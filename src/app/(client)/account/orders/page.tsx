"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, ShortOrderResponse } from "@/services/orderService";
import Link from "next/link";
import {
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  CalendarDaysIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";

const statusConfig = {
  PENDING: {
    label: "Chờ xử lý",
    icon: ClockIcon,
    color: "text-yellow-600 bg-yellow-100",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: CheckCircleIcon,
    color: "text-blue-600 bg-blue-100",
  },
  SHIPPING: {
    label: "Đang giao",
    icon: TruckIcon,
    color: "text-purple-600 bg-purple-100",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: CheckCircleIcon,
    color: "text-green-600 bg-green-100",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircleIcon,
    color: "text-red-600 bg-red-100",
  },
};

export default function AccountOrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<ShortOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !user?.username) {
      setError("Vui lòng đăng nhập để xem đơn hàng");
      setLoading(false);
      return;
    }

    loadOrders();
  }, [isAuthenticated, user?.username, page]);

  const loadOrders = async () => {
    if (!user?.username) return;

    try {
      setLoading(true);
      const response = await orderService.getOrderHistory(user.username, page);

      if (response.success && response.data) {
        if (page === 1) {
          setOrders(response.data || []);
        } else {
          setOrders((prev) => [...prev, ...(response.data || [])]);
        }
        setHasMore((response.data?.length || 0) === 10); // Assuming 10 per page
      } else {
        setError(response.message || "Không thể tải danh sách đơn hàng");
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      setError("Có lỗi xảy ra khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateFromOrder = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Vui lòng đăng nhập
            </h1>
            <p className="text-gray-600 mb-6">
              Bạn cần đăng nhập để xem lịch sử đơn hàng
            </p>
            <Link
              href="/auth/sign-in"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Quay lại tài khoản
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Đơn hàng của tôi
              </h1>
              <p className="text-gray-600">
                Theo dõi và quản lý các đơn hàng của bạn
              </p>
            </div>
            <Link
              href="/shop"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <XCircleIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && orders.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách đơn hàng...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && orders.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <CalendarDaysIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Chưa có đơn hàng nào
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
            </p>
            <Link
              href="/shop"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              const StatusIcon = status.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Đơn hàng #{order.id.slice(-8).toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Đặt ngày {formatDateFromOrder(order.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                      >
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {status.label}
                      </span>

                      <Link
                        href={`/account/orders/${order.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Chi tiết
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Số lượng sản phẩm</p>
                      <p className="font-medium">{order.quantity} sản phẩm</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Tổng tiền</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-6">
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={loading}
                  className="bg-white border border-gray-300 rounded-lg px-6 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loading ? "Đang tải..." : "Xem thêm"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
