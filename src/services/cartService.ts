import api from "@/lib/axios";
import { ICartItem } from "@/store/cartSlice";
import {
  IBackendCartItem,
  convertToBackendItem,
  convertToFrontendItem,
} from "@/utils/cartUtils";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  httpCode: number;
}

export interface IBackendCart {
  _id: string;
  username: string;
  items: IBackendCartItem[];
  total: number;
  status: string;
  createdAt: string;
}

export const cartService = {
  // Get user's cart from backend
  async getCart(username: string): Promise<ApiResponse<IBackendCart>> {
    try {
      const response = await api.get(`/cart/${username}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to get cart");
    }
  },

  // Sync local cart with backend
  async syncCart(
    username: string,
    products: IBackendCartItem[]
  ): Promise<ApiResponse<IBackendCart>> {
    try {
      const response = await api.post(`/cart/${username}/sync`, {
        products,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to sync cart");
    }
  },

  // Add product to cart
  async addProduct(username: string, slug: string): Promise<ApiResponse> {
    try {
      const response = await api.post(`/cart/${username}/product`, {
        slug,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add product");
    }
  },

  // Remove product from cart
  async removeProduct(username: string, slug: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`/cart/${username}/product`, {
        data: { slug },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to remove product"
      );
    }
  },

  // Update product quantity
  async updateQuantity(
    username: string,
    slug: string,
    quantity: number
  ): Promise<ApiResponse<IBackendCart>> {
    try {
      const response = await api.put(`/cart/${username}/product/quantity`, {
        slug,
        quantity,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update quantity"
      );
    }
  },

  // Decrease product quantity
  async decreaseProduct(username: string, slug: string): Promise<ApiResponse> {
    try {
      const response = await api.patch(`/cart/${username}/product`, {
        slug,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to decrease product"
      );
    }
  },

  // Clear entire cart
  async clearCart(username: string): Promise<ApiResponse> {
    try {
      const response = await api.delete(`/cart/${username}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to clear cart");
    }
  },

  // Get cart summary
  async getCartSummary(username: string): Promise<
    ApiResponse<{
      totalItems: number;
      totalPrice: number;
      itemCount: number;
    }>
  > {
    try {
      const response = await api.get(`/cart/${username}/summary`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to get cart summary"
      );
    }
  },

  // Convert frontend cart item to backend format
  convertToBackendItem,

  // Convert backend cart item to frontend format
  convertToFrontendItem,
};
