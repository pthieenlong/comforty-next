import api from "@/lib/axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface User {
  UID: string;
  username: string;
  roles: string[];
  email?: string;
  fullname?: string;
  phone?: string;
  address?: string;
  avatar?: string;
  isVerified?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  httpCode: number;
  data?: User;
}

export const authService = {
  // Login user
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  },

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  },

  // Logout user (clear tokens)
  async logout(): Promise<void> {
    try {
      // Since we don't have logout endpoint, we'll just clear cookies on client side
      // The HTTP-only cookies will expire naturally or can be cleared by setting expired cookies
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // Forgot password
  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gửi email thất bại");
    }
  },

  // Reset password
  async resetPassword(data: ResetPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/reset-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Đặt lại mật khẩu thất bại"
      );
    }
  },

  // Update password
  async updatePassword(
    username: string,
    data: UpdatePasswordRequest
  ): Promise<AuthResponse> {
    try {
      const response = await api.patch(
        `/auth/${username}/update-password`,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Cập nhật mật khẩu thất bại"
      );
    }
  },

  // Verify email
  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/verify-email", { token });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Xác thực email thất bại"
      );
    }
  },

  // Resend verification email
  async resendVerification(email: string): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/resend-verification", { email });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Gửi lại email thất bại"
      );
    }
  },

  // Refresh access token
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/token");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Làm mới token thất bại"
      );
    }
  },

  // Check if user is authenticated (by trying to refresh token)
  async checkAuth(): Promise<User | null> {
    try {
      const response = await this.refreshToken();
      if (response.success) {
        // Since refresh token doesn't return user data, we need to get it from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
          return JSON.parse(userData);
        }
      }
      return null;
    } catch (error) {
      return null;
    }
  },
};
