"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { categoryService } from "@/services/categoryService";
import { ICategory } from "@/common/types/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [query, setQuery] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState<
    "visible" | "hidden" | ""
  >("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await categoryService.getAllCategories();

      if (response.success && response.httpCode === 200) {
        setCategories(response.data || []);
      } else {
        setError(response.message || "Không thể tải danh sách danh mục");
      }
    } catch (err: unknown) {
      console.error("Error fetching categories:", err);
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError.response?.data?.message ||
          "Có lỗi xảy ra khi tải danh sách danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return categories.filter((category) => {
      const matchName = category.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchSlug = category.slug
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchVisibility = visibilityFilter
        ? visibilityFilter === "visible"
          ? category.isVisible
          : !category.isVisible
        : true;

      return (matchName || matchSlug) && matchVisibility;
    });
  }, [categories, query, visibilityFilter]);

  const handleToggleVisibility = async (
    categorySlug: string,
    currentVisibility: boolean
  ) => {
    try {
      await categoryService.updateCategory(categorySlug, {
        isVisible: !currentVisibility,
      });
      await fetchCategories();
    } catch (error) {
      console.error("Error toggling category visibility:", error);
    }
  };

  const handleDeleteCategory = async (categorySlug: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa danh mục này?")) return;

    try {
      await categoryService.deleteCategory(categorySlug);
      await fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded mt-2"></div>
          </div>
          <div className="h-10 w-32 bg-neutral-200 animate-pulse rounded"></div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
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
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Quản lý danh mục
          </h1>
          <p className="text-sm text-neutral-500">Quản lý danh mục sản phẩm</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="inline-flex items-center justify-center rounded-md bg-red-600 text-white text-sm px-4 py-2 hover:bg-red-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Quản lý danh mục
          </h1>
          <p className="text-sm text-neutral-500">
            Quản lý danh mục sản phẩm ({filtered.length}/{categories.length})
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCategories}
            className="inline-flex items-center justify-center rounded-md border border-neutral-200 text-neutral-700 text-sm px-3 py-2 hover:bg-neutral-50"
          >
            Làm mới
          </button>
          <Link
            href="/admin/categories/new"
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white text-sm px-3 py-2 hover:bg-neutral-800"
          >
            Thêm danh mục
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-neutral-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên hoặc slug..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={visibilityFilter}
              onChange={(e) =>
                setVisibilityFilter(e.target.value as "visible" | "hidden" | "")
              }
              className="px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="visible">Hiển thị</option>
              <option value="hidden">Ẩn</option>
            </select>
          </div>
        </div>

        {/* Categories List */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">ID</th>
                <th className="text-left font-medium px-4 py-3">
                  Tên danh mục
                </th>
                <th className="text-left font-medium px-4 py-3">Slug</th>
                <th className="text-left font-medium px-4 py-3">Trạng thái</th>
                <th className="text-right font-medium px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-neutral-500"
                  >
                    {query || visibilityFilter
                      ? "Không tìm thấy danh mục nào phù hợp"
                      : "Chưa có danh mục nào"}
                  </td>
                </tr>
              ) : (
                filtered.map((category) => (
                  <tr
                    key={category.id}
                    className="border-t border-neutral-100 hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs bg-neutral-100 px-2 py-1 rounded">
                        {category.id}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{category.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          handleToggleVisibility(
                            category.slug,
                            category.isVisible
                          )
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${
                          category.isVisible
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-rose-100 text-rose-800 hover:bg-rose-200"
                        }`}
                      >
                        {category.isVisible ? (
                          <>
                            <EyeIcon className="size-3" />
                            Hiển thị
                          </>
                        ) : (
                          <>
                            <EyeSlashIcon className="size-3" />
                            Ẩn
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/categories/${category.slug}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                          title="Chỉnh sửa"
                        >
                          <PencilIcon className="size-4" />
                          Sửa
                        </Link>
                        <button
                          onClick={() => handleDeleteCategory(category.slug)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                          title="Xóa danh mục"
                        >
                          <TrashIcon className="size-4" />
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
