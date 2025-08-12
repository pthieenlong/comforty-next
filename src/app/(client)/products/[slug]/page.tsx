"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  HeartIcon,
  ShoppingCartIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
} from "@heroicons/react/24/solid";
import api from "@/lib/axios";
import { IProductResponse, IShortProductResponse } from "@/common/types/types";
import ProductCard from "@/components/client/ProductCard";

interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IProductResponse;
}

interface RelatedProductsResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IShortProductResponse[];
}

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const productSlug = params?.slug;

  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<
    IShortProductResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // UI States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedTab, setSelectedTab] = useState<
    "description" | "reviews" | "shipping"
  >("description");

  useEffect(() => {
    const fetchProductData = async () => {
      if (!productSlug) return;

      try {
        setLoading(true);
        setError("");

        // Fetch product details
        const response = await api.get<ApiResponse>(`/product/${productSlug}`);

        if (response.data.success && response.data.httpCode === 200) {
          const productData = {
            ...response.data.data,
            createdAt: new Date(response.data.data.createdAt),
            updatedAt: new Date(response.data.data.updatedAt),
          };
          setProduct(productData);

          // Fetch related products from same category
          if (productData.category.length > 0) {
            try {
              const relatedResponse = await api.get<RelatedProductsResponse>(
                `/products?category=${productData.category[0]}&limit=4`
              );
              if (relatedResponse.data.success) {
                // Filter out current product
                const filtered = relatedResponse.data.data.filter(
                  (p: IShortProductResponse) => p.slug !== productSlug
                );
                setRelatedProducts(filtered);
              }
            } catch (relatedError) {
              console.error("Error fetching related products:", relatedError);
            }
          }
        } else {
          setError(response.data.message || "Product not found");
        }
      } catch (err: unknown) {
        console.error("Error fetching product:", err);
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message || "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productSlug]);

  const handleAddToCart = () => {
    console.log("Add to cart:", { productId: product?._id, quantity });
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log("Toggle wishlist:", product?._id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        text: product?.shortDesc,
        url: window.location.href,
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const calculateSalePrice = (price: number, salePercent: number) => {
    return price * (1 - salePercent / 100);
  };

  const nextImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product?.images) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">
            {error || "Product not found"}
          </div>
          <Link
            href="/shop"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const salePrice = product.isSale
    ? calculateSalePrice(product.price, product.salePercent)
    : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-blue-600">
          Shop
        </Link>
        <span>/</span>
        {product.category[0] && (
          <>
            <Link
              href={`/shop?category=${product.category[0]}`}
              className="hover:text-blue-600"
            >
              {product.category[0]}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-900">{product.title}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImageIndex]}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />

            {/* Sale Badge */}
            {product.isSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg font-semibold">
                -{product.salePercent}% OFF
              </div>
            )}

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 ${
                    index === selectedImageIndex ? "ring-2 ring-blue-600" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title and Rating */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarSolidIcon
                    key={star}
                    className={`h-5 w-5 ${
                      star <= product.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">({product.rating}/5)</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">
                SKU: {product._id.slice(-8)}
              </span>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {product.category.map((cat, index) => (
              <Link
                key={index}
                href={`/shop?category=${cat}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-gray-900">
                ₫{salePrice.toLocaleString("vi-VN")}
              </span>
              {product.isSale && (
                <span className="text-xl text-gray-500 line-through">
                  ₫{product.price.toLocaleString("vi-VN")}
                </span>
              )}
            </div>
            {product.isSale && (
              <p className="text-green-600 font-medium">
                You save ₫{(product.price - salePrice).toLocaleString("vi-VN")}{" "}
                ({product.salePercent}%)
              </p>
            )}
          </div>

          {/* Short Description */}
          <div
            className="text-gray-600 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: product.shortDesc }}
          />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-6 w-6 text-red-500" />
                ) : (
                  <HeartIcon className="h-6 w-6 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ShareIcon className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <TruckIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">
                  On orders over ₫1,000,000
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">2 Year Warranty</p>
                <p className="text-sm text-gray-600">Full coverage</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <ArrowPathIcon className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">30-Day Returns</p>
                <p className="text-sm text-gray-600">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "description", label: "Description" },
              { id: "reviews", label: "Reviews" },
              { id: "shipping", label: "Shipping & Returns" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() =>
                  setSelectedTab(
                    tab.id as "description" | "reviews" | "shipping"
                  )
                }
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="prose max-w-none">
          {selectedTab === "description" && (
            <div dangerouslySetInnerHTML={{ __html: product.longDesc }} />
          )}
          {selectedTab === "reviews" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
              <p className="text-gray-600">
                No reviews yet. Be the first to review this product!
              </p>
            </div>
          )}
          {selectedTab === "shipping" && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Free shipping on orders over ₫1,000,000</li>
                <li>Standard delivery: 3-5 business days</li>
                <li>
                  Express delivery: 1-2 business days (additional charges apply)
                </li>
                <li>30-day return policy</li>
                <li>Items must be in original condition</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
