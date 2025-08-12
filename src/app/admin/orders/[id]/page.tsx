"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { OrderResponse } from "@/services/orderService";
import api from "@/lib/axios";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeftIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

const statusOptions = [
  {
    value: "PENDING",
    label: "Chờ xử lý",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "PAID",
    label: "Đã thanh toán",
    color: "bg-blue-100 text-blue-800",
  },
  {
    value: "SHIPPING",
    label: "Đang giao",
    color: "bg-purple-100 text-purple-800",
  },
  {
    value: "COMPLETED",
    label: "Hoàn tất",
    color: "bg-green-100 text-green-800",
  },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-red-100 text-red-800" },
];

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
    label: "Hoàn tất",
    icon: CheckCircleIcon,
    color: "text-green-600 bg-green-100",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircleIcon,
    color: "text-red-600 bg-red-100",
  },
};

interface AdminOrderResponse {
  success: boolean;
  message: string;
  data: OrderResponse;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);

      const response = await api.get<AdminOrderResponse>(
        `/order/admin/orders/${orderId}`
      );

      if (response.data.success && response.data.data) {
        setOrder(response.data.data);
      } else {
        setError(response.data.message || "Không thể tải chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("Error loading order detail:", err);
      setError("Có lỗi xảy ra khi tải chi tiết đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    if (!order) return;

    try {
      setUpdating(true);
      const response = await api.patch(
        `/order/admin/orders/${orderId}/status`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        setOrder((prev) =>
          prev ? { ...prev, status: newStatus as any } : null
        );
        setEditingStatus(false);
      } else {
        alert("Không thể cập nhật trạng thái: " + response.data.message);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải chi tiết đơn hàng...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <XCircleIcon className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Đơn hàng không tồn tại"}
            </p>
            <Link
              href="/admin/orders"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStatus =
    statusConfig[order.status.toUpperCase() as keyof typeof statusConfig] ||
    statusConfig.PENDING;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Quay lại danh sách đơn hàng
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Đơn hàng #{order._id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">
                  Đặt ngày {formatDate(order.createdAt)}
                </p>
              </div>

              <div className="text-right">
                {editingStatus ? (
                  <div className="flex items-center space-x-2">
                    <select
                      defaultValue={order.status}
                      onChange={(e) => updateOrderStatus(e.target.value)}
                      disabled={updating}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setEditingStatus(false)}
                      className="px-2 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${currentStatus.color}`}
                    >
                      <StatusIcon className="h-5 w-5 mr-2" />
                      {currentStatus.label}
                    </span>
                    <button
                      onClick={() => setEditingStatus(true)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                      title="Chỉnh sửa trạng thái"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Sản phẩm đã đặt
              </h2>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="relative flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600">SKU: {item.slug}</p>
                      {item.isSale && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            Giảm {item.salePercent}%
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.price)}
                      </p>
                      <p className="text-sm text-gray-600">
                        SL: {item.quantity}
                      </p>
                      <p
                        className={`text-xs ${
                          item.inStock ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {item.inStock ? "Còn hàng" : "Hết hàng"}
                      </p>
                    </div>

                    <div className="text-right font-medium">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt đơn hàng
              </h2>

              <div className="space-y-3">
                {order.subtotal && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính:</span>
                    <span>{formatCurrency(order.subtotal)}</span>
                  </div>
                )}

                {order.shippingFee && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển:</span>
                    <span>{formatCurrency(order.shippingFee)}</span>
                  </div>
                )}

                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin khách hàng
              </h2>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.firstName} {order.lastName}
                    </p>
                    {order.username && (
                      <p className="text-xs text-gray-500">@{order.username}</p>
                    )}
                  </div>
                </div>

                {order.phone && (
                  <div className="flex items-start space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">{order.phone}</p>
                    </div>
                  </div>
                )}

                {order.email && (
                  <div className="flex items-start space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">{order.email}</p>
                    </div>
                  </div>
                )}

                {order.address && (
                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-900">{order.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác
              </h2>

              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  In đơn hàng
                </button>

                <button
                  onClick={() => {
                    const subject = encodeURIComponent(
                      `Đơn hàng #${order._id.slice(-8).toUpperCase()}`
                    );
                    const body = encodeURIComponent(
                      `Xin chào ${order.firstName} ${
                        order.lastName
                      },\n\nCảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi.\n\nMã đơn hàng: ${
                        order._id
                      }\nTổng tiền: ${formatCurrency(
                        order.total
                      )}\n\nTrân trọng!`
                    );
                    window.location.href = `mailto:${order.email}?subject=${subject}&body=${body}`;
                  }}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                  disabled={!order.email}
                >
                  Gửi email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
