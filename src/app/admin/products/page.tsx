"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/axios";
import { IShortProductResponse } from "@/common/types/types";
import { categoryService } from "@/services/categoryService";
import { ICategory } from "@/common/types/types";

interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IShortProductResponse[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<IShortProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Delete modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<IShortProductResponse | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string>("");

  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"visible" | "hidden" | "">("");
  const [category, setCategory] = useState<string>("");
  const [priceMin, setPriceMin] = useState<string>("");
  const [priceMax, setPriceMax] = useState<string>("");
  const [saleFilter, setSaleFilter] = useState<"sale" | "no-sale" | "">("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get<ApiResponse>("/product");

        if (response.data.success && response.data.httpCode === 200) {
          const productsWithDate = response.data.data.map((product) => ({
            ...product,
            createdAt: new Date(product.createdAt),
            // Thêm updatedAt nếu có trong response
            updatedAt: product.updatedAt
              ? new Date(product.updatedAt)
              : new Date(product.createdAt),
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
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Delete functions
  const handleDeleteClick = (product: IShortProductResponse) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
    setDeleteError("");
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      setDeleting(true);
      setDeleteError("");

      const response = await api.delete(`/product/${productToDelete.slug}`);

      if (response.data.success) {
        // Remove product from list
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setShowDeleteModal(false);
        setProductToDelete(null);
      } else {
        setDeleteError(response.data.message || "Không thể xóa sản phẩm");
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      setDeleteError(
        err.response?.data?.message || "Có lỗi xảy ra khi xóa sản phẩm"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
    setDeleteError("");
  };

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery = query
        ? product.title.toLowerCase().includes(query.toLowerCase())
        : true;

      const matchesVisibility = visibility
        ? visibility === "visible"
          ? product.isVisible
          : !product.isVisible
        : true;

      const matchesCategory = category
        ? product.categories.some((cat) =>
            cat.toLowerCase().includes(category.toLowerCase())
          )
        : true;

      const matchesPriceMin = priceMin
        ? product.price >= parseFloat(priceMin)
        : true;
      const matchesPriceMax = priceMax
        ? product.price <= parseFloat(priceMax)
        : true;

      const matchesSale = saleFilter
        ? saleFilter === "sale"
          ? product.isSale
          : !product.isSale
        : true;

      return (
        matchesQuery &&
        matchesVisibility &&
        matchesCategory &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesSale
      );
    });
  }, [products, query, visibility, category, priceMin, priceMax, saleFilter]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-neutral-200 animate-pulse rounded"></div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 bg-neutral-100 animate-pulse rounded"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Sản phẩm</h1>
          <p className="text-sm text-neutral-500">
            Quản lý danh sách sản phẩm ({filtered.length} sản phẩm)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white text-sm px-4 py-2 hover:bg-neutral-800"
        >
          Thêm sản phẩm
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none text-sm"
            />
          </div>

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none text-sm"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="visible">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none text-sm"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Giá từ"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none text-sm"
          />

          <input
            type="number"
            placeholder="Giá đến"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none text-sm"
          />

          <select
            value={saleFilter}
            onChange={(e) => setSaleFilter(e.target.value as any)}
            className="px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none text-sm"
          >
            <option value="">Tất cả khuyến mãi</option>
            <option value="sale">Đang khuyến mãi</option>
            <option value="no-sale">Không khuyến mãi</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="w-[300px] px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="w-[140px] px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Giá
                </th>
                <th className="w-[160px] px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="w-[120px] px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="w-[130px] px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Tạo lúc
                </th>
                <th className="w-[130px] px-4 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Cập nhật
                </th>
                <th className="w-[100px] px-4 py-3 text-center text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filtered.length > 0 ? (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-md overflow-hidden">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.title}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-medium text-neutral-900 truncate"
                            title={p.title}
                          >
                            {p.title}
                          </h3>
                          <p className="text-xs text-neutral-500 truncate">
                            ID: {p.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        {p.isSale && p.salePercent > 0 ? (
                          <div className="space-y-1">
                            <div className="text-neutral-900 font-medium text-xs">
                              {formatPrice(p.price * (1 - p.salePercent / 100))}
                            </div>
                            <div className="text-xs text-neutral-500 line-through">
                              {formatPrice(p.price)}
                            </div>
                            <span className="inline-flex items-center rounded-full bg-red-100 text-red-800 px-1.5 py-0.5 text-xs">
                              -{p.salePercent}%
                            </span>
                          </div>
                        ) : (
                          <div className="text-neutral-900 font-medium text-sm">
                            {formatPrice(p.price)}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {p.categories && p.categories.length > 0 ? (
                          <>
                            {/* Hiển thị category đầu tiên */}
                            <span
                              className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs w-fit max-w-full truncate"
                              title={p.categories[0]}
                            >
                              {p.categories[0]}
                            </span>

                            {/* Hiển thị indicator nếu có nhiều hơn 1 category */}
                            {p.categories.length > 1 && (
                              <span
                                className="inline-flex items-center rounded-full bg-neutral-100 text-neutral-600 px-2 py-0.5 text-xs cursor-help w-fit"
                                title={`Tất cả danh mục: ${p.categories.join(
                                  ", "
                                )}`}
                              >
                                +{p.categories.length - 1} khác
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-neutral-400 italic">
                            Chưa có
                          </span>
                        )}
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
                            Sale
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-neutral-600">
                        <div>{formatDate(p.createdAt).split(", ")[0]}</div>
                        <div className="text-neutral-500">
                          {formatDate(p.createdAt).split(", ")[1]}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-neutral-600">
                        {p.updatedAt ? (
                          <>
                            <div>{formatDate(p.updatedAt).split(", ")[0]}</div>
                            <div className="text-neutral-500">
                              {formatDate(p.updatedAt).split(", ")[1]}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>{formatDate(p.createdAt).split(", ")[0]}</div>
                            <div className="text-neutral-500">
                              {formatDate(p.createdAt).split(", ")[1]}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/admin/products/${p.slug}`}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                          title="Chỉnh sửa sản phẩm"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(p)}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Xác nhận xóa sản phẩm
                </h3>
                <p className="text-sm text-gray-500">
                  Hành động này không thể hoàn tác
                </p>
              </div>
            </div>

            {productToDelete && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 rounded-md overflow-hidden">
                    {productToDelete.image ? (
                      <Image
                        src={productToDelete.image}
                        alt={productToDelete.title}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-neutral-400 text-xs">
                        N/A
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {productToDelete.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      ID: {productToDelete.id}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {deleteError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
                {deleteError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "Đang xóa..." : "Xóa sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
