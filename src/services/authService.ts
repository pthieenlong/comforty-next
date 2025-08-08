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
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface LoginResponse {
  UID: string;
  username: string;
  roles: string[];
}

// Simplified response structure
export interface ApiResponse<T = any> {
  httpCode: number;
  success: boolean;
  message: string;
  data?: T;
}

export const authService = {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Đăng ký - chỉ trả về success/error
  async register(userData: RegisterRequest): Promise<ApiResponse> {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Xác thực email
  async verifyEmail(data: VerifyEmailRequest): Promise<ApiResponse> {
    const response = await api.post("/auth/verify-email", data);
    return response.data;
  },

  // Gửi lại email xác thực
  async resendVerification(
    data: ResendVerificationRequest
  ): Promise<ApiResponse> {
    const response = await api.post("/auth/resend-verification", data);
    return response.data;
  },

  // Đăng xuất
  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  // Lấy thông tin user hiện tại
  async getCurrentUser(): Promise<ApiResponse<LoginResponse>> {
    const response = await api.get("/auth/me");
    return response.data;
  },

  // Refresh token
  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    const response = await api.post("/auth/refresh");
    return response.data;
  },
};
