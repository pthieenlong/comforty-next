"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import api from "@/lib/axios";
import { IShortProductResponse } from "@/common/types/types";
import ProductCard from "@/components/client/ProductCard";
import CategorySection from "@/components/client/CategorySection";
import HeroSection from "@/components/client/HeroSection";

interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IShortProductResponse[];
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<
    IShortProductResponse[]
  >([]);
  const [newProducts, setNewProducts] = useState<IShortProductResponse[]>([]);
  const [bestProducts, setBestProducts] = useState<IShortProductResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [featuredRes, newRes, bestRes] = await Promise.all([
          api.get<ApiResponse>("/product/sale"),
          api.get<ApiResponse>("/product/new"),
          api.get<ApiResponse>("/product/best"),
        ]);

        if (featuredRes.data.success) {
          setFeaturedProducts(featuredRes.data.data);
        }
        if (newRes.data.success) {
          setNewProducts(newRes.data.data);
        }
        if (bestRes.data.success) {
          setBestProducts(bestRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <CategorySection />

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Sản phẩm khuyến mãi
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Khám phá bộ sưu tập nội thất cao cấp được tuyển chọn kỹ lưỡng
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      {newProducts.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản phẩm mới
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Những thiết kế mới nhất vừa được thêm vào bộ sưu tập
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showBadge="new"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestProducts.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Bán chạy nhất
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Lựa chọn yêu thích của khách hàng
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showBadge="bestseller"
              />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Cập nhật thông tin
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Đăng ký nhận bản tin để nhận ưu đãi độc quyền, thông báo sản phẩm
            mới và mẹo thiết kế.
          </p>

          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
