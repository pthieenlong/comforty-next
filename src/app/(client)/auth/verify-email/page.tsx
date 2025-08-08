"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const { verifyEmail, resendVerification, isLoading, error, isAuthenticated } =
    useAuth();

  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error" | "expired"
  >("pending");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showResendSuccess, setShowResendSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // Local state cho email

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Auto verify if token is in URL
  useEffect(() => {
    if (token) {
      console.log(token);
      handleVerifyWithToken(token);
    }
  }, [token]);

  // Resend cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendCooldown]);

  const handleVerifyWithToken = async (verificationToken: string) => {
    try {
      await verifyEmail(verificationToken);
      setVerificationStatus("success");

      // Auto redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/auth/sign-in");
      }, 3000);
    } catch (err: any) {
      console.error("Email verification error:", err);
      if (err.response?.status === 400) {
        setVerificationStatus("expired");
      } else {
        setVerificationStatus("error");
      }
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail || resendCooldown > 0) return;

    try {
      await resendVerification(userEmail);
      setShowResendSuccess(true);
      setResendCooldown(60);

      setTimeout(() => {
        setShowResendSuccess(false);
      }, 5000);
    } catch (err) {
      console.error("Resend verification error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Xác thực địa chỉ email
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Success State */}
          {verificationStatus === "success" && (
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Email đã được xác thực thành công!
              </h3>
              <p className="text-gray-600 mb-4">
                Tài khoản của bạn đã được kích hoạt. Bạn sẽ được chuyển hướng
                đến trang đăng nhập.
              </p>
              <div className="flex items-center justify-center space-x-2 text-blue-600">
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                <span className="text-sm">Đang chuyển hướng...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {verificationStatus === "error" && (
            <div className="text-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác thực thất bại
              </h3>
              <p className="text-gray-600 mb-4">
                Có lỗi xảy ra trong quá trình xác thực email. Vui lòng thử lại.
              </p>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-3">
                <Link
                  href="/auth/sign-up"
                  className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 block text-center"
                >
                  Quay lại đăng ký
                </Link>
              </div>
            </div>
          )}

          {/* Expired Token State */}
          {verificationStatus === "expired" && (
            <div className="text-center">
              <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Link xác thực đã hết hạn
              </h3>
              <p className="text-gray-600 mb-4">
                Link xác thực email đã hết hạn hoặc không hợp lệ. Vui lòng nhập
                email để gửi lại.
              </p>

              {/* Email input for resend */}
              <div className="mb-4">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Nhập email của bạn"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading || resendCooldown > 0 || !userEmail}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Gửi lại sau ${resendCooldown}s`
                    : isLoading
                    ? "Đang gửi..."
                    : "Gửi lại email xác thực"}
                </button>
                <Link
                  href="/auth/sign-up"
                  className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 block text-center"
                >
                  Quay lại đăng ký
                </Link>
              </div>
            </div>
          )}

          {/* Pending State - General message */}
          {verificationStatus === "pending" && !token && (
            <div className="text-center">
              <EnvelopeIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Kiểm tra email của bạn
              </h3>
              <p className="text-gray-600 mb-6">
                Chúng tôi đã gửi link xác thực đến địa chỉ email bạn vừa đăng
                ký. Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam) và click
                vào link để kích hoạt tài khoản.
              </p>

              {/* Resend Success Message */}
              {showResendSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm mb-4">
                  Email xác thực đã được gửi lại thành công!
                </div>
              )}

              {/* Global Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Email input for resend */}
              <div className="mb-4">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Nhập email để gửi lại xác thực"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isLoading || resendCooldown > 0 || !userEmail}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Gửi lại sau ${resendCooldown}s`
                    : isLoading
                    ? "Đang gửi..."
                    : "Gửi lại email xác thực"}
                </button>
                <Link
                  href="/auth/sign-up"
                  className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-200 block text-center"
                >
                  Quay lại đăng ký
                </Link>
              </div>

              {/* Tips */}
              <div className="mt-6 text-left">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Không nhận được email?
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Kiểm tra thư mục spam/junk</li>
                  <li>• Đảm bảo địa chỉ email chính xác</li>
                  <li>• Thử gửi lại email xác thực</li>
                  <li>• Liên hệ hỗ trợ nếu vẫn gặp vấn đề</li>
                </ul>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && verificationStatus === "pending" && token && (
            <div className="text-center">
              <ArrowPathIcon className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Đang xác thực email...
              </h3>
              <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
            </div>
          )}
        </div>

        {/* Footer Links */}
        <div className="text-center">
          <Link
            href="/auth/sign-in"
            className="text-blue-600 hover:text-blue-500 text-sm"
          >
            Quay lại trang đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
