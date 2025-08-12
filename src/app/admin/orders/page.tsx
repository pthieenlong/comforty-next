"use client";

import { useMemo, useState, useEffect } from "react";
import { MagnifyingGlassIcon, EyeIcon } from "@heroicons/react/24/outline";
import { OrderResponse } from "@/services/orderService";
import api from "@/lib/axios";
import Link from "next/link";

interface AdminOrdersResponse {
  success: boolean;
  message: string;
  data: OrderResponse[];
  pagination?: {
    page: number;
    limit: number;
    totalPage: number;
    totalItems: number;
  };
}

const statusMap = {
  PENDING: "Chờ xử lý",
  PAID: "Đã thanh toán",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
} as const;

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | "">("");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadOrders();
  }, [page]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get<AdminOrdersResponse>(
        `/order/admin/orders?page=${page}`
      );

      if (response.data.success) {
        setOrders(response.data.data || []);
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.totalPage);
        }
      } else {
        setError(response.data.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Có lỗi xảy ra khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const customerName = `${order.firstName || ""} ${order.lastName || ""}`
        .trim()
        .toLowerCase();
      const orderId = order._id.toLowerCase();

      const matchText =
        customerName.includes(query.toLowerCase()) ||
        orderId.includes(query.toLowerCase()) ||
        (order.email &&
          order.email.toLowerCase().includes(query.toLowerCase()));

      const orderStatus =
        statusMap[order.status.toUpperCase() as keyof typeof statusMap] ||
        order.status;
      const matchStatus = status ? orderStatus === status : true;

      return matchText && matchStatus;
    });
  }, [orders, query, status]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Đơn hàng</h1>
        <p className="text-sm text-neutral-500">Theo dõi và xử lý đơn hàng</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-3 border-b border-neutral-200 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc khách hàng..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
              <option value="Đã thanh toán">Đã thanh toán</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Hoàn tất">Hoàn tất</option>
              <option value="Đã hủy">Đã hủy</option>
            </select>
            <button
              onClick={loadOrders}
              disabled={loading}
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">Mã đơn</th>
                <th className="text-left font-medium px-4 py-3">Khách hàng</th>
                <th className="text-left font-medium px-4 py-3">Ngày</th>
                <th className="text-left font-medium px-4 py-3">Tổng tiền</th>
                <th className="text-left font-medium px-4 py-3">Trạng thái</th>
                <th className="text-right font-medium px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading && orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Đang tải...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có đơn hàng nào
                  </td>
                </tr>
              ) : (
                filtered.map((order) => {
                  const displayStatus =
                    statusMap[
                      order.status.toUpperCase() as keyof typeof statusMap
                    ] || order.status;

                  return (
                    <tr
                      key={order._id}
                      className="border-t border-neutral-100 hover:bg-neutral-50/60"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="text-indigo-700 hover:underline font-medium"
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium">
                            {order.firstName} {order.lastName}
                          </div>
                          {order.email && (
                            <div className="text-xs text-gray-500">
                              {order.email}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            displayStatus === "Hoàn tất"
                              ? "bg-emerald-100 text-emerald-800"
                              : displayStatus === "Đang giao"
                              ? "bg-amber-100 text-amber-800"
                              : displayStatus === "Đã thanh toán"
                              ? "bg-blue-100 text-blue-800"
                              : displayStatus === "Chờ xử lý"
                              ? "bg-sky-100 text-sky-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {displayStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="size-4" /> Chi tiết
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="text-sm text-gray-600">{page}</span>
              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
