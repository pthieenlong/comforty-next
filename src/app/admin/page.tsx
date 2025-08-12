"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import RevenueChart from "@/components/charts/RevenueChart";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { orderService } from "@/services/orderService";
import {
  CubeIcon,
  TagIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { IShortProductResponse, ICategory } from "@/common/types/types";

interface DashboardStats {
  todayRevenue: number;
  newOrders: number;
  lowStockProducts: number;
  newCustomers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalCustomers: number;
}

interface RecentActivity {
  id: string;
  type: "order" | "product" | "user";
  message: string;
  timestamp: string;
  status?: "success" | "warning" | "error";
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    todayRevenue: 0,
    newOrders: 0,
    lowStockProducts: 0,
    newCustomers: 0,
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [recentProducts, setRecentProducts] = useState<IShortProductResponse[]>(
    []
  );
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch products and categories
      const [productsResponse, categoriesResponse] = await Promise.all([
        productService.getAllProducts(),
        categoryService.getAllCategories(),
      ]);

      // Mock data for other stats (replace with real API calls)
      const mockStats: DashboardStats = {
        todayRevenue: 12500000,
        newOrders: 24,
        lowStockProducts: 8,
        newCustomers: 15,
        totalProducts: productsResponse.data?.length || 0,
        totalCategories: categoriesResponse.data?.length || 0,
        totalOrders: 156,
        totalCustomers: 1234,
      };

      setStats(mockStats);
      setRecentProducts((productsResponse.data || []).slice(0, 5));

      // Mock recent activities
      setRecentActivities([
        {
          id: "1",
          type: "order",
          message: "Đơn hàng #1256 đã được thanh toán",
          timestamp: "5 phút trước",
          status: "success",
        },
        {
          id: "2",
          type: "product",
          message: "Sản phẩm 'Ghế sofa cao cấp' đã được thêm",
          timestamp: "15 phút trước",
          status: "success",
        },
        {
          id: "3",
          type: "product",
          message: "Sản phẩm 'Bàn gỗ' sắp hết hàng",
          timestamp: "30 phút trước",
          status: "warning",
        },
        {
          id: "4",
          type: "user",
          message: "Khách hàng mới đã đăng ký",
          timestamp: "1 giờ trước",
          status: "success",
        },
        {
          id: "5",
          type: "order",
          message: "Đơn hàng #1255 đã bị hủy",
          timestamp: "2 giờ trước",
          status: "error",
        },
      ]);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const kpiCards = [
    {
      label: "Doanh thu hôm nay",
      value: formatCurrency(stats.todayRevenue),
      change: "+12.5%",
      changeType: "increase" as const,
      icon: CubeIcon,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Đơn hàng mới",
      value: stats.newOrders.toString(),
      change: "+5.2%",
      changeType: "increase" as const,
      icon: ShoppingBagIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Sản phẩm tồn kho thấp",
      value: stats.lowStockProducts.toString(),
      change: "-2.1%",
      changeType: "decrease" as const,
      icon: CubeIcon,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Khách hàng mới",
      value: stats.newCustomers.toString(),
      change: "+8.3%",
      changeType: "increase" as const,
      icon: UserGroupIcon,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const overviewCards = [
    {
      label: "Tổng sản phẩm",
      value: stats.totalProducts,
      href: "/admin/products",
      icon: CubeIcon,
      color: "bg-indigo-500",
    },
    {
      label: "Tổng danh mục",
      value: stats.totalCategories,
      href: "/admin/categories",
      icon: TagIcon,
      color: "bg-green-500",
    },
    {
      label: "Tổng đơn hàng",
      value: stats.totalOrders,
      href: "/admin/orders",
      icon: ShoppingBagIcon,
      color: "bg-blue-500",
    },
    {
      label: "Tổng khách hàng",
      value: stats.totalCustomers,
      href: "/admin/customers",
      icon: UserGroupIcon,
      color: "bg-purple-500",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-neutral-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
          Dashboard
        </h1>
        <p className="text-neutral-600 mt-1">
          Chào mừng bạn quay trở lại! Đây là tổng quan về hoạt động kinh doanh.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className="relative rounded-xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  {kpi.label}
                </p>
                <p className="text-2xl font-bold text-neutral-900 mb-2">
                  {kpi.value}
                </p>
                <div className="flex items-center text-sm">
                  {kpi.changeType === "increase" ? (
                    <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      kpi.changeType === "increase"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {kpi.change}
                  </span>
                  <span className="text-neutral-500 ml-1">so với hôm qua</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${kpi.color}`}>
                <kpi.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => (
          <Link
            key={index}
            href={card.href}
            className="group relative rounded-xl border border-neutral-200 bg-white p-6 hover:shadow-lg transition-all duration-200 hover:border-neutral-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-600 mb-1">
                  {card.label}
                </p>
                <p className="text-3xl font-bold text-neutral-900">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color} text-white`}>
                <card.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-neutral-900/10 transition-colors"></div>
          </Link>
        ))}
      </div>

      {/* Charts and Recent Data */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">
                  Doanh thu theo tháng
                </h3>
                <p className="text-sm text-neutral-600">Năm 2025</p>
              </div>
              <select className="text-sm border border-neutral-200 rounded-md px-3 py-1 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none">
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <RevenueChart />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="space-y-6">
          {/* Recent Products */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Sản phẩm gần đây
              </h3>
              <Link
                href="/admin/products"
                className="text-sm text-neutral-600 hover:text-neutral-900"
              >
                Xem tất cả
              </Link>
            </div>
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-12 h-12 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-neutral-900 line-clamp-2 leading-tight mb-1"
                      title={product.title}
                    >
                      {product.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-neutral-500">
                        {formatCurrency(product.price)}
                      </p>
                      <div className="flex items-center space-x-1 ml-2">
                        <button
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Xem chi tiết"
                        >
                          <EyeIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-900">
                Hoạt động gần đây
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      activity.status === "success"
                        ? "bg-green-500"
                        : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-colors group"
          >
            <div className="text-center">
              <CubeIcon className="h-8 w-8 text-neutral-400 group-hover:text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
                Thêm sản phẩm
              </p>
            </div>
          </Link>
          <Link
            href="/admin/categories/new"
            className="flex items-center justify-center p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-colors group"
          >
            <div className="text-center">
              <TagIcon className="h-8 w-8 text-neutral-400 group-hover:text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
                Thêm danh mục
              </p>
            </div>
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center justify-center p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-colors group"
          >
            <div className="text-center">
              <ShoppingBagIcon className="h-8 w-8 text-neutral-400 group-hover:text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
                Xem đơn hàng
              </p>
            </div>
          </Link>
          <Link
            href="/admin/settings"
            className="flex items-center justify-center p-4 border-2 border-dashed border-neutral-300 rounded-lg hover:border-neutral-400 hover:bg-neutral-50 transition-colors group"
          >
            <div className="text-center">
              <UserGroupIcon className="h-8 w-8 text-neutral-400 group-hover:text-neutral-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-neutral-600 group-hover:text-neutral-900">
                Cài đặt
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
