"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import api from "@/lib/axios";
import { IProductResponse } from "@/common/types/types";

interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IProductResponse;
}

interface UpdateProductData {
  title?: string;
  price?: number;
  categories?: string[];
  images?: string[];
  isSale?: boolean;
  isVisible?: boolean;
  salePercent?: number;
  shortDesc?: string;
  longDesc?: string;
}

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  // const router = useRouter(); // TODO: Use for navigation after updates
  // params.id chính là slug trong trường hợp này (do Next.js routing)
  const productSlug = params?.id;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    price: 0,
    categories: [] as string[],
    images: [] as string[],
    isSale: false,
    isVisible: true,
    salePercent: 0,
    shortDesc: "",
    longDesc: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;

      try {
        setLoading(true);
        setError("");

        // Fetch bằng slug
        const response = await api.get<ApiResponse>(`/product/${productSlug}`);

        if (response.data.success && response.data.httpCode === 200) {
          const productWithDate = {
            ...response.data.data,
            createdAt: new Date(response.data.data.createdAt),
            updatedAt: new Date(response.data.data.updatedAt),
          };
          setProduct(productWithDate);

          // Populate form data
          setFormData({
            title: productWithDate.title,
            price: productWithDate.price,
            categories: productWithDate.category,
            images: productWithDate.images,
            isSale: productWithDate.isSale,
            isVisible: productWithDate.isVisible,
            salePercent: productWithDate.salePercent,
            shortDesc: productWithDate.shortDesc,
            longDesc: productWithDate.longDesc,
          });
        } else {
          setError(response.data.message || "Không thể tải thông tin sản phẩm");
        }
      } catch (err: unknown) {
        console.error("Error fetching product:", err);
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message ||
            "Có lỗi xảy ra khi tải thông tin sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCategoryAdd = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
  };

  const handleCategoryRemove = (categoryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }));
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);

        // Giả sử bạn có endpoint upload image
        const response = await api.post("/upload/image", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          return response.data.data.url; // URL của hình ảnh đã upload
        }
        throw new Error("Upload failed");
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls],
      }));

      alert(`Đã upload ${uploadedUrls.length} hình ảnh thành công!`);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Có lỗi xảy ra khi upload hình ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleImageRemove = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));

    // Reset active image index if needed
    if (activeImageIndex >= formData.images.length - 1) {
      setActiveImageIndex(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productSlug) return;

    setUpdating(true);
    try {
      // Prepare update data according to UpdateProductDTO
      const updateData: UpdateProductData = {
        title: formData.title,
        price: formData.price,
        categories: formData.categories, // Note: API expects 'categories' not 'category'
        images: formData.images,
        isSale: formData.isSale,
        isVisible: formData.isVisible,
        salePercent: formData.salePercent,
        shortDesc: formData.shortDesc,
        longDesc: formData.longDesc,
      };

      // Update bằng slug
      const response = await api.patch(`/product/${productSlug}`, updateData);

      if (response.data.success) {
        alert("Cập nhật sản phẩm thành công!");
        // Refresh product data by fetching again
        const updatedProduct = await api.get<ApiResponse>(
          `/product/${productSlug}`
        );
        if (updatedProduct.data.success) {
          const productWithDate = {
            ...updatedProduct.data.data,
            createdAt: new Date(updatedProduct.data.data.createdAt),
            updatedAt: new Date(updatedProduct.data.data.updatedAt),
          };
          setProduct(productWithDate);
        }
      } else {
        alert(response.data.message || "Có lỗi xảy ra khi cập nhật sản phẩm");
      }
    } catch (error: unknown) {
      console.error("Update error:", error);
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      alert(
        axiosError.response?.data?.message ||
          "Có lỗi xảy ra khi cập nhật sản phẩm"
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickToggle = async (action: "sale" | "visible") => {
    if (!productSlug) return;

    try {
      // Sử dụng slug cho quick toggle endpoints
      const endpoint =
        action === "sale"
          ? `/product/sale/${productSlug}`
          : `/product/visible/${productSlug}`;
      const response = await api.patch(endpoint);

      if (response.data.success) {
        // Update local state
        if (action === "sale") {
          setFormData((prev) => ({ ...prev, isSale: !prev.isSale }));
        } else {
          setFormData((prev) => ({ ...prev, isVisible: !prev.isVisible }));
        }

        // Update product state as well
        if (product) {
          setProduct((prev) =>
            prev
              ? {
                  ...prev,
                  [action === "sale" ? "isSale" : "isVisible"]:
                    action === "sale" ? !prev.isSale : !prev.isVisible,
                  updatedAt: new Date(),
                }
              : null
          );
        }

        alert(
          `Đã ${
            action === "sale"
              ? "thay đổi trạng thái khuyến mãi"
              : "thay đổi trạng thái hiển thị"
          } thành công!`
        );
      }
    } catch (error: unknown) {
      console.error("Quick toggle error:", error);
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      alert(axiosError.response?.data?.message || "Có lỗi xảy ra khi cập nhật");
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const calculateSalePrice = (price: number, salePercent: number) => {
    return price * (1 - salePercent / 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">Đang tải...</h1>
            <p className="text-sm text-neutral-500">
              Đang tải thông tin sản phẩm
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-neutral-700 hover:text-neutral-900"
          >
            ← Quay lại danh sách
          </Link>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Lỗi tải dữ liệu
            </h1>
            <p className="text-sm text-neutral-500">
              Không thể tải thông tin sản phẩm
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-neutral-700 hover:text-neutral-900"
          >
            ← Quay lại danh sách
          </Link>
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
              onClick={() => window.location.reload()}
              className="ml-auto px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold">
              Không tìm thấy
            </h1>
            <p className="text-sm text-neutral-500">Sản phẩm không tồn tại</p>
          </div>
          <Link
            href="/admin/products"
            className="text-sm text-neutral-700 hover:text-neutral-900"
          >
            ← Quay lại danh sách
          </Link>
        </div>
        <div className="text-center py-12 text-neutral-500">
          Không tìm thấy sản phẩm với slug: {productSlug}
        </div>
      </div>
    );
  }

  const salePrice = formData.isSale
    ? calculateSalePrice(formData.price, formData.salePercent)
    : formData.price;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Sản phẩm: {product.title}
          </h1>
          <p className="text-sm text-neutral-500">
            Slug: {product.slug} | ID: #{product._id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="text-sm text-neutral-700 hover:text-neutral-900"
          >
            ← Quay lại danh sách
          </Link>
        </div>
      </div>

      {/* Thông tin tổng quan */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="text-lg font-medium mb-4">Thông tin tổng quan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-neutral-500">ID:</span>
            <div className="font-medium">#{product._id}</div>
          </div>
          <div>
            <span className="text-neutral-500">Slug:</span>
            <div className="font-medium font-mono bg-gray-100 px-2 py-1 rounded text-xs">
              {product.slug}
            </div>
          </div>
          <div>
            <span className="text-neutral-500">Rating:</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{product.rating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= product.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className="text-neutral-500">Trạng thái:</span>
            <div className="flex gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                  formData.isVisible
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {formData.isVisible ? "Hiển thị" : "Ẩn"}
              </span>
              {formData.isSale && (
                <span className="inline-flex items-center rounded-full bg-orange-100 text-orange-800 px-2 py-0.5 text-xs">
                  Sale {formData.salePercent}%
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <span className="text-neutral-500">Ngày tạo:</span>
            <div className="font-medium">{formatDate(product.createdAt)}</div>
          </div>
          <div>
            <span className="text-neutral-500">Cập nhật lần cuối:</span>
            <div className="font-medium">{formatDate(product.updatedAt)}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 mt-4">
          <button
            type="button"
            onClick={() => handleQuickToggle("visible")}
            className={`px-3 py-1 text-xs rounded ${
              formData.isVisible
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            {formData.isVisible ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
          </button>
          <button
            type="button"
            onClick={() => handleQuickToggle("sale")}
            className={`px-3 py-1 text-xs rounded ${
              formData.isSale
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-orange-100 text-orange-700 hover:bg-orange-200"
            }`}
          >
            {formData.isSale ? "Tắt khuyến mãi" : "Bật khuyến mãi"}
          </button>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* ... rest of the form remains the same ... */}
        <div className="lg:col-span-2 space-y-4">
          {/* Thông tin cơ bản */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <h3 className="text-lg font-medium">Thông tin cơ bản</h3>

            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Tên sản phẩm
              </label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">
                  Giá gốc (₫)
                </label>
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">
                  Phần trăm giảm giá (%)
                </label>
                <input
                  name="salePercent"
                  type="number"
                  value={formData.salePercent}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                />
              </div>
            </div>

            {formData.isSale && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                <div className="text-sm text-orange-800">
                  <strong>Giá sau giảm:</strong> ₫{" "}
                  {salePrice.toLocaleString("vi-VN")}
                  <span className="ml-2 text-xs bg-orange-100 px-2 py-1 rounded">
                    Tiết kiệm: ₫{" "}
                    {(formData.price - salePrice).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Danh mục
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.categories.map((cat, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-xs"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() => handleCategoryRemove(cat)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleCategoryAdd(e.target.value);
                    e.target.value = "";
                  }
                }}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              >
                <option value="">Chọn danh mục để thêm</option>
                <option value="Ghế">Ghế</option>
                <option value="Bàn">Bàn</option>
                <option value="Tủ">Tủ</option>
                <option value="Sofa">Sofa</option>
                <option value="Giường">Giường</option>
                <option value="Kệ">Kệ</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    name="isVisible"
                    type="checkbox"
                    checked={formData.isVisible}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/10"
                  />
                  <span className="text-sm text-neutral-600">
                    Hiển thị sản phẩm
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input
                    name="isSale"
                    type="checkbox"
                    checked={formData.isSale}
                    onChange={handleInputChange}
                    className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/10"
                  />
                  <span className="text-sm text-neutral-600">
                    Có khuyến mãi
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Mô tả sản phẩm */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <h3 className="text-lg font-medium">Mô tả sản phẩm</h3>

            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Mô tả ngắn
              </label>
              <textarea
                name="shortDesc"
                rows={4}
                value={formData.shortDesc}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Mô tả chi tiết
              </label>
              <textarea
                name="longDesc"
                rows={8}
                value={formData.longDesc}
                onChange={handleInputChange}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              />
              <p className="text-xs text-neutral-500 mt-1">
                Hỗ trợ HTML tags cho định dạng nội dung
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* Hình ảnh sản phẩm */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
            <div className="text-sm font-medium">Hình ảnh sản phẩm</div>

            {/* Hình ảnh chính */}
            {formData.images && formData.images.length > 0 ? (
              <div className="space-y-3">
                <div className="relative aspect-square overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
                  <Image
                    alt={formData.title}
                    src={formData.images[activeImageIndex]}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleImageRemove(activeImageIndex)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>

                {/* Thumbnail gallery */}
                {formData.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setActiveImageIndex(index)}
                        className={`relative aspect-square overflow-hidden rounded border-2 ${
                          activeImageIndex === index
                            ? "border-neutral-900"
                            : "border-neutral-200"
                        }`}
                      >
                        <Image
                          alt={`${formData.title} ${index + 1}`}
                          src={image}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-square rounded-md border border-dashed border-neutral-300 flex items-center justify-center text-neutral-500">
                Chưa có hình ảnh
              </div>
            )}
          </div>

          {/* Upload hình ảnh mới */}
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
            <div className="text-sm font-medium">Tải lên hình ảnh mới</div>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 cursor-pointer hover:border-neutral-400 hover:bg-neutral-50"
            >
              <div className="space-y-2">
                <div>
                  {uploading
                    ? "Đang upload..."
                    : "Kéo thả hoặc click để upload"}
                </div>
                <div className="text-xs">
                  Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              disabled={updating}
              className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white text-sm px-4 py-2 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-md border border-neutral-200 text-neutral-700 text-sm px-4 py-2 hover:bg-neutral-50"
            >
              Hủy thay đổi
            </button>
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center text-sm text-neutral-700 hover:text-neutral-900"
            >
              ← Quay lại danh sách
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
