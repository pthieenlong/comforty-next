"use client";

import { useState } from "react";
import Link from "next/link";
import { EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Email là bắt buộc");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSent(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Không thể gửi email đặt lại mật khẩu"
      );
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
              <EnvelopeIcon className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Kiểm tra email của bạn
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi liên kết đặt lại mật khẩu đến
            </p>
            <p className="text-sm font-medium text-gray-900">{email}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-2">Không nhận được email?</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700">
                <li>Kiểm tra thư mục spam/rác</li>
                <li>Đảm bảo bạn đã nhập đúng email</li>
                <li>Chờ vài phút để email đến</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => {
                setSent(false);
                setEmail("");
              }}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Thử email khác
            </button>

            <Link
              href="/auth/sign-in"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Quay lại đăng nhập
          </Link>

          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để
            đặt lại mật khẩu.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Địa chỉ email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Nhớ mật khẩu?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">🔒 Thông báo bảo mật</p>
              <p className="text-yellow-700">
                Vì lý do bảo mật, liên kết đặt lại mật khẩu sẽ hết hạn sau 1 giờ
                và chỉ có thể sử dụng một lần.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
