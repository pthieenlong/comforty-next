import api from "@/lib/axios";
import {
  ICategory,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "@/common/types/types";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  httpCode: number;
}

export const categoryService = {
  async getAllCategories(): Promise<ApiResponse<ICategory[]>> {
    const response = await api.get("/category");
    return response.data;
  },

  async getCategoryBySlug(slug: string): Promise<ApiResponse<ICategory>> {
    const response = await api.get(`/category/${slug}`);
    return response.data;
  },

  async createCategory(
    data: ICreateCategoryRequest
  ): Promise<ApiResponse<ICategory>> {
    const response = await api.post("/category", data);
    return response.data;
  },

  async updateCategory(
    slug: string,
    data: IUpdateCategoryRequest
  ): Promise<ApiResponse<ICategory>> {
    const response = await api.patch(`/category/${slug}`, data);
    return response.data;
  },

  async deleteCategory(slug: string): Promise<ApiResponse> {
    const response = await api.delete(`/category/${slug}`);
    return response.data;
  },
};
