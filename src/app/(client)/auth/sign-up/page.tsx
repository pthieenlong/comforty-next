"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import {
  validatePassword,
  PasswordValidation,
} from "@/utils/passwordValidation";

export default function SignUpPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Separate errors for each field
  const [formErrors, setFormErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const [passwordValidation, setPasswordValidation] =
    useState<PasswordValidation>({
      isValid: false,
      errors: [],
      strength: "weak",
    });
  const [showPasswordHints, setShowPasswordHints] = useState(false);

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  // Validate password khi thay đổi
  useEffect(() => {
    if (formData.password) {
      const validation = validatePassword(formData.password);
      setPasswordValidation(validation);

      // Clear password error if password becomes valid
      if (validation.isValid && formErrors.password) {
        setFormErrors((prev) => ({ ...prev, password: "" }));
      }
    } else {
      setPasswordValidation({
        isValid: false,
        errors: [],
        strength: "weak",
      });
    }
  }, [formData.password, formErrors.password]);

  // Validate confirm password
  useEffect(() => {
    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setFormErrors((prev) => ({
        ...prev,
        confirmPassword: "Mật khẩu xác nhận không khớp",
      }));
    } else if (
      formData.confirmPassword &&
      formData.password === formData.confirmPassword
    ) {
      setFormErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  }, [formData.password, formData.confirmPassword]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    };
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      errors.username = "Vui lòng nhập tên đăng nhập";
      isValid = false;
    } else if (formData.username.length < 3) {
      errors.username = "Tên đăng nhập phải có ít nhất 3 ký tự";
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = "Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Vui lòng nhập địa chỉ email";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = "Địa chỉ email không hợp lệ";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      errors.password = "Vui lòng nhập mật khẩu";
      isValid = false;
    } else if (!passwordValidation.isValid) {
      errors.password = "Mật khẩu không đáp ứng yêu cầu bảo mật";
      isValid = false;
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      errors.terms = "Vui lòng đồng ý với điều khoản sử dụng";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear global error from AuthContext
    if (error) {
      clearError();
    }

    // Special handling for terms checkbox
    if (name === "agreeToTerms" && checked) {
      setFormErrors((prev) => ({ ...prev, terms: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      // Call register API
      await register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Show success message and redirect
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      router.push("/auth/sign-in");
    } catch (err: any) {
      // Error handling
      console.error("Registration error:", err);

      // Handle specific field errors from API
      if (err.response?.data?.errors) {
        const apiErrors = err.response.data.errors;
        const newErrors = { ...formErrors };

        // Map API errors to form fields
        if (apiErrors.username) {
          newErrors.username = apiErrors.username;
        }
        if (apiErrors.email) {
          newErrors.email = apiErrors.email;
        }
        if (apiErrors.password) {
          newErrors.password = apiErrors.password;
        }

        setFormErrors(newErrors);
      }
      // Global error will be handled by AuthContext and displayed via error prop
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
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              đăng nhập vào tài khoản có sẵn
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Global error from AuthContext */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Username */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    formErrors.username ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Tên đăng nhập"
                />
              </div>
              {formErrors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.username}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    formErrors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Địa chỉ email"
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
              )}
            </div>

            {/* Password với validation */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setShowPasswordHints(true)}
                  className={`appearance-none relative block w-full pl-10 pr-10 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    formErrors.password ||
                    (formData.password && !passwordValidation.isValid)
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {formErrors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.password}
                </p>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordValidation.strength === "weak"
                            ? "bg-red-500 w-1/3"
                            : passwordValidation.strength === "medium"
                            ? "bg-yellow-500 w-2/3"
                            : "bg-green-500 w-full"
                        }`}
                      />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        passwordValidation.strength === "weak"
                          ? "text-red-500"
                          : passwordValidation.strength === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {passwordValidation.strength === "weak"
                        ? "Yếu"
                        : passwordValidation.strength === "medium"
                        ? "Trung bình"
                        : "Mạnh"}
                    </span>
                  </div>
                </div>
              )}

              {/* Password Requirements */}
              {showPasswordHints &&
                formData.password &&
                !passwordValidation.isValid && (
                  <div className="mt-2 p-3 bg-red-50 rounded-lg">
                    <p className="text-sm font-medium text-red-800 mb-2">
                      Mật khẩu cần đáp ứng các yêu cầu sau:
                    </p>
                    <ul className="text-sm text-red-700 space-y-1">
                      {passwordValidation.errors.map((error, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                          {error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`appearance-none relative block w-full pl-10 pr-10 py-3 border placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    formErrors.confirmPassword
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  placeholder="Xác nhận mật khẩu"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div>
            <div className="flex items-start">
              <input
                id="agree-terms"
                name="agreeToTerms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gray-900"
              >
                Tôi đồng ý với{" "}
                <Link
                  href="/terms"
                  className="text-blue-600 hover:text-blue-500"
                >
                  điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  chính sách bảo mật
                </Link>
              </label>
            </div>
            {formErrors.terms && (
              <p className="mt-1 text-sm text-red-600">{formErrors.terms}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                "Tạo tài khoản"
              )}
            </button>
          </div>

          {/* Social Sign Up */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Hoặc đăng ký với
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
