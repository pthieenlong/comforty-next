"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/auth/sign-in",
}: ProtectedRouteProps) {
  const { isAuthenticated, hasRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRole && !hasRole(requiredRole)) {
        router.push("/"); // Redirect to home if no permission
        return;
      }
    }
  }, [isAuthenticated, hasRole, isLoading, requiredRole, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền truy cập vào trang này.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
