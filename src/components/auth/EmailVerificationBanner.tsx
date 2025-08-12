"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface EmailVerificationBannerProps {
  email?: string;
  onDismiss?: () => void;
}

export default function EmailVerificationBanner({
  email,
  onDismiss,
}: EmailVerificationBannerProps) {
  const { resendVerification, isLoading } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!email || !isVisible) {
    return null;
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    try {
      await resendVerification(email);
      setShowSuccess(true);
      setResendCooldown(60);

      
      setTimeout(() => setShowSuccess(false), 3000);

      
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Resend verification error:", err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-yellow-800">
            Email chưa được xác thực
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Vui lòng kiểm tra email <strong>{email}</strong> và click vào link
              xác thực để kích hoạt tài khoản.
            </p>
            {showSuccess && (
              <p className="mt-1 text-green-600 font-medium">
                ✅ Email xác thực đã được gửi lại!
              </p>
            )}
          </div>
          <div className="mt-3">
            <button
              onClick={handleResend}
              disabled={isLoading || resendCooldown > 0}
              className="text-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {resendCooldown > 0
                ? `Gửi lại sau ${resendCooldown}s`
                : isLoading
                ? "Đang gửi..."
                : "Gửi lại email"}
            </button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={handleDismiss}
            className="inline-flex text-yellow-400 hover:text-yellow-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
