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

export interface LoginResponse {
  UID: string;
  username: string;
  roles: string[];
}

export interface RegisterResponse {
  UID: string;
  username: string;
  email: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  // Đăng nhập
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Đăng ký
  async register(
    userData: RegisterRequest
  ): Promise<ApiResponse<RegisterResponse>> {
    const response = await api.post("/auth/register", userData);
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
