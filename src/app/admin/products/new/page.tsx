"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { ICategory, ICreateProductRequest } from "@/common/types/types";
import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Image upload states
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Form data with better initial values
  const [formData, setFormData] = useState<ICreateProductRequest>({
    title: "",
    price: 0,
    categories: [],
    images: [],
    salePercent: 0,
    isSale: false,
    rating: 5,
    isVisible: true,
    shortDesc: "",
    longDesc: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAllCategories();
      if (response.success && response.httpCode === 200) {
        setCategories(response.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Không thể tải danh sách danh mục");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (type === "number") {
      const numValue = parseFloat(value);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);

    setFormData((prev) => ({
      ...prev,
      categories: selectedValue ? [selectedValue] : [],
    }));
  };

  // Validate file type and size
  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      return "Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)";
    }

    if (file.size > maxSize) {
      return "Kích thước file không được vượt quá 5MB";
    }

    return null;
  };

  const handleImageSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const errors: string[] = [];

    // Validate each file
    fileArray.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`File ${index + 1}: ${error}`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join("; "));
      return;
    }

    // Check total number of images
    if (imageFiles.length + fileArray.length > 10) {
      setError("Chỉ được upload tối đa 10 hình ảnh");
      return;
    }

    setImageFiles((prev) => [...prev, ...fileArray]);

    const previewUrls = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previewUrls]);

    setError("");
  };

  const handleImageRemove = (indexToRemove: number) => {
    setImageFiles((prev) => prev.filter((_, index) => index !== indexToRemove));

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[indexToRemove]);
    setImagePreviews((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const files = e.dataTransfer.files;
    handleImageSelect(files);
  };

  // Validate form data
  const validateForm = (): string | null => {
    if (!formData.title.trim()) {
      return "Tên sản phẩm là bắt buộc";
    }
    if (formData.title.length < 3) {
      return "Tên sản phẩm phải có ít nhất 3 ký tự";
    }
    if (formData.price <= 0) {
      return "Giá sản phẩm phải lớn hơn 0";
    }
    if (formData.categories.length === 0) {
      return "Vui lòng chọn một danh mục";
    }
    const rating = formData.rating ?? 0;
    if (rating < 0 || rating > 5) {
      return "Đánh giá phải từ 0 đến 5";
    }
    const salePercent = formData.salePercent ?? 0;
    if (salePercent < 0 || salePercent > 100) {
      return "Phần trăm giảm giá phải từ 0 đến 100";
    }
    if (imageFiles.length === 0) {
      return "Vui lòng thêm ít nhất một hình ảnh sản phẩm";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Validate form
      const validationError = validateForm();
      if (validationError) {
        throw new Error(validationError);
      }

      // Create FormData for file upload
      const submitFormData = new FormData();
      submitFormData.append("title", formData.title.trim());
      submitFormData.append("price", formData.price.toString());
      submitFormData.append("categories", JSON.stringify(formData.categories));
      submitFormData.append("isSale", String(formData.isSale));
      submitFormData.append("isVisible", String(formData.isVisible));
      submitFormData.append("salePercent", String(formData.salePercent));
      submitFormData.append("rating", String(formData.rating));
      submitFormData.append("shortDesc", formData.shortDesc || "");
      submitFormData.append("longDesc", formData.longDesc || "");

      // Append image files
      imageFiles.forEach((file, index) => {
        submitFormData.append(`images`, file);
      });

      // Use productService instead of direct API call
      const response = await productService.createProduct(
        submitFormData as any
      );

      if (response.success && response.httpCode === 201) {
        setSuccess("Thêm sản phẩm thành công!");

        // Reset form after successful creation
        handleReset();

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/admin/products");
        }, 2000);
      } else {
        throw new Error(response.message || "Không thể thêm sản phẩm");
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Có lỗi xảy ra khi thêm sản phẩm"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      price: 0,
      categories: [],
      images: [],
      salePercent: 0,
      isSale: false,
      rating: 5,
      isVisible: true,
      shortDesc: "",
      longDesc: "",
    });
    setSelectedCategory("");

    // Clear images
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    setImageFiles([]);
    setImagePreviews([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Thêm sản phẩm mới</h1>
        <p className="text-sm text-neutral-500">
          Nhập thông tin chi tiết để tạo sản phẩm mới
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XMarkIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{success}</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Tên sản phẩm *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors"
                  placeholder="Nhập tên sản phẩm..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Giá sản phẩm *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors"
                      placeholder="0.00"
                      required
                    />
                    <span className="absolute right-3 top-2 text-sm text-neutral-500">
                      VNĐ
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Đánh giá (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Danh mục *
                </label>
                <select
                  name="category"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors"
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Sale Information */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Thông tin giảm giá</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phần trăm giảm giá (%)
                </label>
                <input
                  type="number"
                  name="salePercent"
                  value={formData.salePercent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors"
                  placeholder="0"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isSale"
                    checked={formData.isSale}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded"
                  />
                  <span className="ml-2 text-sm text-neutral-700">
                    Đang giảm giá
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isVisible"
                    checked={formData.isVisible}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded"
                  />
                  <span className="ml-2 text-sm text-neutral-700">
                    Hiển thị sản phẩm
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Mô tả sản phẩm</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  name="shortDesc"
                  value={formData.shortDesc}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors resize-none"
                  placeholder="Mô tả ngắn gọn về sản phẩm..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mô tả chi tiết
                </label>
                <textarea
                  name="longDesc"
                  value={formData.longDesc}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 rounded-md border border-neutral-300 focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 outline-none transition-colors resize-none"
                  placeholder="Mô tả chi tiết về sản phẩm, tính năng, chất liệu..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-medium mb-4">Hình ảnh sản phẩm *</h2>

            {/* File input (hidden) */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={(e) => handleImageSelect(e.target.files)}
              className="hidden"
            />

            {/* Drop zone */}
            <div
              className="rounded-lg border-2 border-dashed border-neutral-300 p-8 text-center cursor-pointer hover:border-neutral-400 hover:bg-neutral-50 transition-all duration-200"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <PhotoIcon className="mx-auto h-12 w-12 text-neutral-400 mb-3" />
              <p className="text-sm font-medium text-neutral-600 mb-1">
                Kéo thả hoặc click để chọn hình ảnh
              </p>
              <p className="text-xs text-neutral-500">
                PNG, JPG, WebP • Tối đa 5MB mỗi file • Tối đa 10 ảnh
              </p>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">
                    Hình ảnh đã chọn ({imagePreviews.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
                      setImageFiles([]);
                      setImagePreviews([]);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    Xóa tất cả
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-neutral-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleImageRemove(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      >
                        <XMarkIcon className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-lg bg-neutral-900 text-white text-sm font-medium px-4 py-3 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang tạo sản phẩm...
                  </>
                ) : (
                  "Tạo sản phẩm"
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="w-full text-sm text-neutral-600 hover:text-neutral-900 py-2 transition-colors"
              >
                Đặt lại form
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
