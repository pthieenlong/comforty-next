"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import { IShortProductResponse } from "@/common/types/types";
interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IShortProductResponse[];
}

const CATEGORIES = ["Ghế", "Bàn", "Tủ", "Sofa", "Giường", "Kệ"];

export default function ProductsPage() {
  const [products, setProducts] = useState<IShortProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"visible" | "hidden" | "">("");
  const [category, setCategory] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [saleFilter, setSaleFilter] = useState<"sale" | "no-sale" | "">("");

  // Fetch products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ApiResponse>("/product");

        if (response.data.success && response.data.httpCode === 200) {
          // Chuyển đổi createdAt từ string sang Date nếu cần
          const productsWithDate = response.data.data.map((product) => ({
            ...product,
            createdAt: new Date(product.createdAt),
          }));
          setProducts(productsWithDate);
        } else {
          setError(response.data.message || "Không thể tải danh sách sản phẩm");
        }
      } catch (err: unknown) {
        console.error("Error fetching products:", err);
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            "Có lỗi xảy ra khi tải danh sách sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filtered = useMemo(() => {
    const minP = priceMin ? Number(priceMin) : undefined;
    const maxP = priceMax ? Number(priceMax) : undefined;

    return products.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(query.toLowerCase());
      const matchVisibility = visibility
        ? visibility === "visible"
          ? p.isVisible
          : !p.isVisible
        : true;
      const matchCategory = category ? p.categories.includes(category) : true;
      const matchPriceMin = minP !== undefined ? p.price >= minP : true;
      const matchPriceMax = maxP !== undefined ? p.price <= maxP : true;
      const matchSale = saleFilter
        ? saleFilter === "sale"
          ? p.isSale
          : !p.isSale
        : true;

      return (
        matchTitle &&
        matchVisibility &&
        matchCategory &&
        matchPriceMin &&
        matchPriceMax &&
        matchSale
      );
    });
  }, [products, query, visibility, category, priceMin, priceMax, saleFilter]);

  const clearFilters = () => {
    setQuery("");
    setVisibility("");
    setCategory("");
    setPriceMin("");
    setPriceMax("");
    setSaleFilter("");
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  const refreshProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiResponse>("/products");

      if (response.data.success && response.data.httpCode === 200) {
        const productsWithDate = response.data.data.map((product) => ({
          ...product,
          createdAt: new Date(product.createdAt),
        }));
        setProducts(productsWithDate);
        setError("");
      }
    } catch {
      setError("Có lỗi xảy ra khi tải lại danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Tất cả sản phẩm
            </h1>
            <p className="text-sm text-neutral-500">
              Quản lý danh sách sản phẩm
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-900"></div>
          <span className="ml-2 text-neutral-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Tất cả sản phẩm
            </h1>
            <p className="text-sm text-neutral-500">
              Quản lý danh sách sản phẩm
            </p>
          </div>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-600">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-red-800 font-medium">Lỗi tải dữ liệu</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
            <button
              onClick={refreshProducts}
              className="ml-auto px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Tất cả sản phẩm</h1>
          <p className="text-sm text-neutral-500">
            Quản lý danh sách sản phẩm ({filtered.length}/{products.length})
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={refreshProducts}
            className="inline-flex items-center justify-center rounded-md border border-neutral-200 text-neutral-700 text-sm px-3 py-2 hover:bg-neutral-50"
          >
            Làm mới
          </button>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white text-sm px-3 py-2 hover:bg-neutral-800"
          >
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-3 border-b border-neutral-200 grid grid-cols-1 gap-2 md:grid-cols-12 md:items-end">
          <div className="relative md:col-span-3">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên sản phẩm..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 mb-1">
              Hiển thị
            </label>
            <select
              value={visibility}
              onChange={(e) =>
                setVisibility(e.target.value as "visible" | "hidden" | "")
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            >
              <option value="">Tất cả</option>
              <option value="visible">Hiển thị</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 mb-1">
              Danh mục
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            >
              <option value="">Tất cả</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-neutral-500 mb-1">
                Giá từ
              </label>
              <input
                type="number"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-500 mb-1">đến</label>
              <input
                type="number"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-neutral-500 mb-1">
              Khuyến mãi
            </label>
            <select
              value={saleFilter}
              onChange={(e) =>
                setSaleFilter(e.target.value as "sale" | "no-sale" | "")
              }
              className="w-full px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            >
              <option value="">Tất cả</option>
              <option value="sale">Có khuyến mãi</option>
              <option value="no-sale">Không khuyến mãi</option>
            </select>
          </div>
          <div className="md:col-span-1 flex md:justify-end">
            <button
              type="button"
              onClick={clearFilters}
              className="h-9 px-3 rounded-md text-sm border border-neutral-200 hover:bg-neutral-50"
            >
              Xóa lọc
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">ID</th>
                <th className="text-left font-medium px-4 py-3">Sản phẩm</th>
                <th className="text-left font-medium px-4 py-3">Giá</th>
                <th className="text-left font-medium px-4 py-3">Danh mục</th>
                <th className="text-left font-medium px-4 py-3">Trạng thái</th>
                <th className="text-left font-medium px-4 py-3">Ngày tạo</th>
                <th className="text-right font-medium px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr
                    key={p.id}
                    className="border-t border-neutral-100 hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3">#{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative size-11 overflow-hidden rounded-md border border-neutral-200 bg-neutral-50 min-w-14 max-w-20">
                          <Image
                            alt={p.title}
                            src={p.image}
                            fill
                            className="object-contain p-1.5"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/admin/products/${p.slug}`}
                            className="text-indigo-700 hover:underline"
                          >
                            {p.title}
                          </Link>
                          <div className="text-xs text-neutral-500">
                            Slug: {p.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div
                          className={`${
                            p.isSale ? "line-through text-neutral-400" : ""
                          }`}
                        >
                          ₫ {p.price.toLocaleString("vi-VN")}
                        </div>
                        {p.isSale && (
                          <div className="text-red-600 font-medium">
                            ₫{" "}
                            {(
                              p.price *
                              (1 - p.salePercent / 100)
                            ).toLocaleString("vi-VN")}
                            <span className="ml-1 text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                              -{p.salePercent}%
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.categories.map((cat, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs w-fit ${
                            p.isVisible
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {p.isVisible ? "Hiển thị" : "Ẩn"}
                        </span>
                        {p.isSale && (
                          <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-800 px-2 py-0.5 text-xs w-fit">
                            Khuyến mãi
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-600">
                      {formatDate(p.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="text-neutral-700 hover:text-neutral-900"
                      >
                        Sửa
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    {products.length === 0
                      ? "Chưa có sản phẩm nào"
                      : "Không tìm thấy sản phẩm phù hợp với bộ lọc"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
