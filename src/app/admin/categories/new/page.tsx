"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { categoryService } from "@/services/categoryService";
import { ICreateCategoryRequest } from "@/common/types/types";

export default function NewCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<ICreateCategoryRequest>({
    name: "",
    slug: "",
    isVisible: true,
  });

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

    if (!formData.name.trim()) {
      setError("Tên danh mục không được để trống");
      return;
    }

    if (!formData.slug.trim()) {
      setError("Slug không được để trống");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await categoryService.createCategory(formData);

      if (response.success) {
        router.push("/admin/categories");
      } else {
        setError(response.message || "Có lỗi xảy ra khi tạo danh mục");
      }
    } catch (err: unknown) {
      console.error("Error creating category:", err);
      const axiosError = err as {
        response?: { data?: { message?: string } };
      };
      setError(
        axiosError.response?.data?.message || "Có lỗi xảy ra khi tạo danh mục"
      );
    } finally {
      setLoading(false);
    }
  };

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
            Thêm danh mục mới
          </h1>
          <p className="text-sm text-neutral-500">Tạo danh mục sản phẩm mới</p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
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
            disabled={loading}
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm text-white bg-neutral-900 rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Đang tạo..." : "Tạo danh mục"}
          </button>
        </div>
      </form>
    </div>
  );
}
