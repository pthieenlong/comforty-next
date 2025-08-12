import api from "@/lib/axios";
import {
  ICreateProductRequest,
  IProductApiResponse,
  IShortProductResponse,
} from "@/common/types/types";

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  httpCode: number;
}

export const productService = {
  async getAllProducts(): Promise<ApiResponse<IShortProductResponse[]>> {
    const response = await api.get("/product");
    return response.data;
  },

  async getProductBySlug(slug: string): Promise<ApiResponse<any>> {
    const response = await api.get(`/product/${slug}`);
    return response.data;
  },

  async createProduct(
    data: ICreateProductRequest
  ): Promise<IProductApiResponse> {
    const response = await api.post("/product", data);
    return response.data;
  },

  async updateProduct(
    slug: string,
    data: Partial<ICreateProductRequest>
  ): Promise<IProductApiResponse> {
    const response = await api.patch(`/product/${slug}`, data);
    return response.data;
  },

  async deleteProduct(slug: string): Promise<ApiResponse> {
    const response = await api.delete(`/product/${slug}`);
    return response.data;
  },

  async getBestProducts(): Promise<ApiResponse<IShortProductResponse[]>> {
    const response = await api.get("/product/best");
    return response.data;
  },
};
