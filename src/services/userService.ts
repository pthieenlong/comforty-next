import api from "@/lib/axios";

export interface UserProfile {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  phone: string;
  address: string;
  avatar: string;
  roles: string[];
  isVerified: string;
  createdAt: string;
  // Các trường tính toán từ API khác
  totalOrders?: number;
  totalSpent?: number;
  wishlistItems?: number;
}

export interface UpdateProfileRequest {
  fullname?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ApiResponse<T = any> {
  httpCode: number;
  success: boolean;
  message: string;
  data?: T;
}

export const userService = {
  // Lấy thông tin chi tiết user
  async getUserProfile(username: string): Promise<ApiResponse<UserProfile>> {
    const response = await api.get(`/user/${username}`);
    return response.data;
  },

  // Cập nhật thông tin profile
  async updateProfile(
    username: string,
    data: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfile>> {
    const response = await api.put(`/user/${username}`, data);
    return response.data;
  },

  // Đổi mật khẩu
  async changePassword(
    username: string,
    data: ChangePasswordRequest
  ): Promise<ApiResponse> {
    const response = await api.put(`/user/${username}/password`, data);
    return response.data;
  },

  // Lấy lịch sử đơn hàng
  async getOrderHistory(username: string): Promise<ApiResponse<any[]>> {
    const response = await api.get(`/user/${username}/orders`);
    return response.data;
  },

  // Lấy thống kê user (orders, spending, wishlist)
  async getUserStats(username: string): Promise<
    ApiResponse<{
      totalOrders: number;
      totalSpent: number;
      wishlistItems: number;
    }>
  > {
    const response = await api.get(`/user/${username}/stats`);
    return response.data;
  },
};
