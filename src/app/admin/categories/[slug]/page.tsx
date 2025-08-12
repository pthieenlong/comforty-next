"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { categoryService } from "@/services/categoryService";
import { ICategory, IUpdateCategoryRequest } from "@/common/types/types";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [category, setCategory] = useState<ICategory | null>(null);
  const [originalSlug, setOriginalSlug] = useState<string>("");

  const [formData, setFormData] = useState<IUpdateCategoryRequest>({
    name: "",
    slug: "",
    isVisible: true,
  });

  useEffect(() => {
    if (params.slug) {
      fetchCategory();
    }
  }, [params.slug]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await categoryService.getCategoryBySlug(params.slug);

      if (response.success && response.data) {
        const cat = response.data;
        setCategory(cat);
        setOriginalSlug(cat.slug);
        setFormData({
          name: cat.name,
          slug: cat.slug,
          isVisible: cat.isVisible,
        });
      } else {
        setError(response.message || "Không thể tải thông tin danh mục");
      }
    } catch (err: unknown) {
      console.error("Error fetching category:", err);
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError.response?.data?.message ||
          "Có lỗi xảy ra khi tải thông tin danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    if (!formData.slug?.trim()) {
      setError("Slug không được để trống");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await categoryService.updateCategory(
        originalSlug,
        formData
      );

      if (response.success) {
        if (formData.slug !== originalSlug) {
          router.push(`/admin/categories/${formData.slug}`);
        } else {
          router.push("/admin/categories");
        }
      } else {
        setError(response.message || "Có lỗi xảy ra khi cập nhật danh mục");
      }
    } catch (err: unknown) {
      console.error("Error updating category:", err);
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật danh mục"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-6 w-20 bg-neutral-200 animate-pulse rounded"></div>
          <div>
            <div className="h-8 w-48 bg-neutral-200 animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-neutral-200 animate-pulse rounded mt-2"></div>
          </div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 bg-neutral-100 animate-pulse rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error && !category) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Chỉnh sửa danh mục
          </h1>
          <p className="text-sm text-neutral-500">
            Cập nhật thông tin danh mục
          </p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchCategory}
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
        >
          <ArrowLeftIcon className="size-4" />
          Quay lại
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Chỉnh sửa danh mục
          </h1>
          <p className="text-sm text-neutral-500">
            Cập nhật thông tin danh mục: {category?.name}
            {category && (
              <span className="ml-2 text-xs text-neutral-400">
                (ID: {category.id})
              </span>
            )}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="space-y-6">
            {/* Category Info */}
            {category && (
              <div className="bg-neutral-50 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-medium text-neutral-700 mb-2">
                  Thông tin danh mục
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-neutral-500">ID:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                      {category.id}
                    </code>
                  </div>
                  <div>
                    <span className="text-neutral-500">Slug hiện tại:</span>
                    <code className="ml-2 bg-white px-2 py-1 rounded text-xs">
                      {originalSlug}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tên danh mục *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                  placeholder="Nhập tên danh mục"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Slug *
                  {formData.slug !== originalSlug && (
                    <span className="ml-2 text-xs text-amber-600">
                      (Sẽ thay đổi URL)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                  placeholder="slug-danh-muc"
                  required
                />
              </div>
            </div>

            {/* Visibility */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Trạng thái
              </label>
              <select
                value={formData.isVisible ? "visible" : "hidden"}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isVisible: e.target.value === "visible",
                  }))
                }
                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              >
                <option value="visible">Hiển thị</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm text-neutral-700 border border-neutral-200 rounded-md hover:bg-neutral-50"
            disabled={saving}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 text-sm text-white bg-neutral-900 rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
}
