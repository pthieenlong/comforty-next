"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { orderService, OrderResponse } from "@/services/orderService";
import Link from "next/link";
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
} from "@heroicons/react/24/outline";

const statusConfig = {
  PENDING: {
    label: "Chờ xử lý",
    icon: ClockIcon,
    color: "text-yellow-600 bg-yellow-100",
    description: "Đơn hàng đang được xử lý",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: CheckCircleIcon,
    color: "text-blue-600 bg-blue-100",
    description: "Đơn hàng đã được thanh toán",
  },
  SHIPPING: {
    label: "Đang giao",
    icon: TruckIcon,
    color: "text-purple-600 bg-purple-100",
    description: "Đơn hàng đang được vận chuyển",
  },
  COMPLETED: {
    label: "Hoàn thành",
    icon: CheckCircleIcon,
    color: "text-green-600 bg-green-100",
    description: "Đơn hàng đã được giao thành công",
  },
  cancelled: {
    label: "Đã hủy",
    icon: XCircleIcon,
    color: "text-red-600 bg-red-100",
    description: "Đơn hàng đã được hủy",
  },
};

export default function AccountOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated || !user?.username) {
      router.push("/auth/sign-in");
      return;
    }

    if (orderId) {
      loadOrderDetail();
    }
  }, [isAuthenticated, user?.username, orderId]);

  const loadOrderDetail = async () => {
    if (!user?.username || !orderId) return;

    try {
      setLoading(true);
      const response = await orderService.getOrder(orderId, user.username);

      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        setError(response.message || "Không thể tải chi tiết đơn hàng");
      }
    } catch (err) {
      console.error("Error loading order detail:", err);
      setError("Có lỗi xảy ra khi tải chi tiết đơn hàng");
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
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <XCircleIcon className="h-16 w-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không thể tải đơn hàng
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "Đơn hàng không tồn tại hoặc bạn không có quyền xem"}
            </p>
            <Link
              href="/account/orders"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/account" className="hover:text-gray-900">
              Tài khoản
            </Link>
            <span>/</span>
            <Link href="/account/orders" className="hover:text-gray-900">
              Đơn hàng
            </Link>
            <span>/</span>
            <span className="text-gray-900">Chi tiết</span>
          </div>
        </div>

        <div className="mb-6">
          <Link
            href="/account/orders"
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
                <span
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${status.color}`}
                >
                  <StatusIcon className="h-5 w-5 mr-2" />
                  {status.label}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {status.description}
                </p>
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
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
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
                        Số lượng: {item.quantity}
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
                Thông tin giao hàng
              </h2>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {order.firstName} {order.lastName}
                    </p>
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
                Trạng thái đơn hàng
              </h2>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Đã đặt hàng
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>

                {order.status !== "PENDING" && (
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        ["PAID", "SHIPPING", "COMPLETED"].includes(order.status)
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <ClockIcon
                        className={`h-5 w-5 ${
                          ["PAID", "SHIPPING", "COMPLETED"].includes(
                            order.status
                          )
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Đang xử lý
                      </p>
                      {order.updatedAt && (
                        <p className="text-xs text-gray-600">
                          {formatDate(order.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {["SHIPPING", "COMPLETED"].includes(order.status) && (
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        order.status === "COMPLETED"
                          ? "bg-green-100"
                          : "bg-blue-100"
                      }`}
                    >
                      <TruckIcon
                        className={`h-5 w-5 ${
                          order.status === "COMPLETED"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Đang giao hàng
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-gray-600">
                          Mã vận đơn: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {order.status === "COMPLETED" && (
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Đã giao hàng
                      </p>
                      {order.estimatedDelivery && (
                        <p className="text-xs text-gray-600">
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Hành động
              </h2>

              <div className="space-y-3">
                <Link
                  href="/shop"
                  className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Mua lại sản phẩm
                </Link>

                {order.status === "PENDING" && (
                  <button className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium">
                    Hủy đơn hàng
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium"
                >
                  In đơn hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
