"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  CheckCircleIcon,
  TruckIcon,
  EnvelopeIcon,
  HomeIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [orderId, setOrderId] = useState<string>("");

  useEffect(() => {
    // Get order ID from URL params or generate one
    const urlOrderId = searchParams.get("orderId");
    if (urlOrderId) {
      setOrderId(urlOrderId);
    } else {
      // Generate a mock order ID for demo
      setOrderId(`ORD-${Date.now().toString().slice(-8)}`);
    }
  }, [searchParams]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth/sign-in");
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đặt hàng thành công!
          </h1>
          <p className="text-gray-600">
            Cảm ơn bạn đã mua hàng. Chúng tôi đã nhận được đơn hàng của bạn và
            sẽ bắt đầu xử lý ngay lập tức.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chi tiết đơn hàng
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-medium text-gray-900">{orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Ngày đặt hàng:</span>
              <span className="font-medium text-gray-900">
                {new Date().toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Khách hàng:</span>
              <span className="font-medium text-gray-900">{user.username}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">
            Bước tiếp theo?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <EnvelopeIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">
                  Email xác nhận đơn hàng
                </h3>
                <p className="text-sm text-blue-800">
                  Chúng tôi đã gửi email xác nhận đến địa chỉ email đã đăng ký
                  với tất cả chi tiết đơn hàng.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <TruckIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">
                  Cập nhật vận chuyển
                </h3>
                <p className="text-sm text-blue-800">
                  Bạn sẽ nhận được cập nhật vận chuyển qua email và SMS khi đơn
                  hàng tiến triển.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <ShoppingBagIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">Theo dõi đơn hàng</h3>
                <p className="text-sm text-blue-800">
                  Theo dõi trạng thái đơn hàng trong bảng điều khiển tài khoản
                  hoặc sử dụng mã đơn hàng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thời gian giao hàng dự kiến
          </h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Thời gian xử lý:</strong> 1-2 ngày làm việc
            </p>
            <p className="text-gray-600">
              <strong>Thời gian vận chuyển:</strong> 3-5 ngày làm việc
            </p>
            <p className="text-gray-600">
              <strong>Tổng thời gian dự kiến:</strong> 4-7 ngày làm việc
            </p>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            * Thời gian giao hàng có thể thay đổi tùy thuộc vào vị trí của bạn
            và tình trạng sản phẩm.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/account"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Xem đơn hàng của tôi
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Tiếp tục mua sắm
          </Link>
        </div>

        {/* Support Information */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            Cần hỗ trợ? Liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi
          </p>
          <div className="space-x-4 text-sm">
            <Link href="/contact" className="text-blue-600 hover:underline">
              Liên hệ chúng tôi
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/faq" className="text-blue-600 hover:underline">
              Câu hỏi thường gặp
            </Link>
            <span className="text-gray-400">|</span>
            <Link href="/support" className="text-blue-600 hover:underline">
              Trung tâm hỗ trợ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
