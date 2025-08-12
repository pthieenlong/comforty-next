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
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/login", credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng nhập thất bại");
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Đăng ký thất bại");
    }
  },

  async logout(): Promise<void> {
    try {
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<AuthResponse> {
    try {
      const response = await api.post("/auth/forgot-password", data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Gửi email thất bại");
    }
  },

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

  async checkAuth(): Promise<User | null> {
    try {
      const response = await this.refreshToken();
      if (response.success) {
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
