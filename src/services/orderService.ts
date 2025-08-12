import api from "@/lib/axios";

export interface OrderItem {
  id: string;
  slug: string;
  title: string;
  categories: string[];
  price: number;
  quantity: number;
  image: string;
  isSale: boolean;
  salePercent: number;
  inStock: boolean;
  originalPrice?: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  postalCode: string;
  notes: string;
}

export interface PaymentInfo {
  method: "cod" | "card" | "bank";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardName?: string;
}

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface CreateOrderRequest {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  items: OrderItem[];
  total: number;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  username?: string;
}

export interface OrderResponse {
  _id: string;
  orderId?: string;
  status: "PENDING" | "PAID" | "SHIPPING" | "COMPLETED" | "cancelled";
  items: OrderItem[];
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  email: string;
  total: number;
  subtotal?: number;
  discount?: number;
  shippingFee?: number;
  username?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export interface ShortOrderResponse {
  id: string;
  date: Date;
  quantity: number;
  total: number;
  status: "PENDING" | "PAID" | "SHIPPING" | "COMPLETED";
}

export interface OrderHistoryResponse {
  data: ShortOrderResponse[];
  pagination: {
    limit: number;
    page: number;
    totalPage: number;
    totalItems: number;
  };
}

export interface ApiResponse<T> {
  httpCode: number;
  success: boolean;
  message: string;
  data?: T;
}

export const orderService = {
  // Create new order
  async createOrder(
    orderData: CreateOrderRequest
  ): Promise<ApiResponse<OrderResponse>> {
    const response = await api.post("/order/checkout", orderData);
    return response.data;
  },

  // Get order by ID
  async getOrder(
    orderId: string,
    username: string
  ): Promise<ApiResponse<OrderResponse>> {
    const response = await api.get(`/order/${username}?id=${orderId}`);
    return response.data;
  },

  // Get user's order history
  async getOrderHistory(
    username: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<ShortOrderResponse[]>> {
    const response = await api.get(`/order/${username}?page=${page}`);
    return response.data;
  },

  // Cancel order
  async cancelOrder(
    orderId: string,
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(`/orders/${orderId}/cancel`, { reason });
    return response.data;
  },

  // Track order
  async trackOrder(orderId: string): Promise<
    ApiResponse<{
      status: string;
      trackingNumber?: string;
      trackingUrl?: string;
      updates: Array<{
        status: string;
        description: string;
        timestamp: string;
        location?: string;
      }>;
    }>
  > {
    const response = await api.get(`/orders/${orderId}/track`);
    return response.data;
  },

  // Get shipping methods
  async getShippingMethods(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string;
        price: number;
        estimatedDays: string;
      }>
    >
  > {
    const response = await api.get("/orders/shipping-methods");
    return response.data;
  },

  // Calculate shipping cost
  async calculateShipping(
    city: string,
    items: OrderItem[]
  ): Promise<
    ApiResponse<{
      cost: number;
      estimatedDays: string;
      availableMethods: Array<{
        id: string;
        name: string;
        price: number;
        estimatedDays: string;
      }>;
    }>
  > {
    const response = await api.post("/orders/calculate-shipping", {
      city,
      items,
    });
    return response.data;
  },

  // Validate payment method
  async validatePayment(paymentInfo: PaymentInfo): Promise<
    ApiResponse<{
      isValid: boolean;
      message?: string;
    }>
  > {
    const response = await api.post("/orders/validate-payment", paymentInfo);
    return response.data;
  },
};
