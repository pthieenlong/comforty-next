"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HeartIcon,
  ShoppingCartIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { IShortProductResponse } from "@/common/types/types";

interface ProductCardProps {
  product: IShortProductResponse;
  showBadge?: "new" | "sale" | "bestseller";
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  showBadge,
  viewMode = "grid",
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const salePrice = product.isSale
    ? product.price * (1 - product.salePercent / 100)
    : product.price;

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
    // TODO: Add to wishlist API call
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Add to cart API call
    console.log("Added to cart:", product.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    // TODO: Open quick view modal
    console.log("Quick view:", product.id);
  };
  if (viewMode === "list") {
    return (
      <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <Link href={`/products/${product.slug}`} className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 bg-gray-100 overflow-hidden flex-shrink-0">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                imageLoading ? "blur-sm" : "blur-0"
              }`}
              onLoad={() => setImageLoading(false)}
              sizes="192px"
            />

            {/* Badge */}
            {(showBadge || product.isSale) && (
              <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
                {product.isSale && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.salePercent}%
                  </span>
                )}
                {showBadge === "new" && (
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                {showBadge === "bestseller" && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                    BESTSELLER
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Categories */}
              <div className="flex flex-wrap gap-1 mb-2">
                {product.categories.slice(0, 2).map((category, index) => (
                  <span
                    key={index}
                    className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                  >
                    {category}
                  </span>
                ))}
              </div>

              {/* Product Title */}
              <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4 ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">(4.0)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xl font-bold text-gray-900">
                  ₫{salePrice.toLocaleString("vi-VN")}
                </span>
                {product.isSale && (
                  <span className="text-sm text-gray-500 line-through">
                    ₫{product.price.toLocaleString("vi-VN")}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thêm vào giỏ hàng
              </button>
              <button
                onClick={handleAddToWishlist}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
              <button
                onClick={handleQuickView}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <EyeIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Badge */}
      {(showBadge || product.isSale) && (
        <div className="absolute top-3 left-3 z-10 flex flex-col space-y-1">
          {product.isSale && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.salePercent}%
            </span>
          )}
          {showBadge === "new" && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
              NEW
            </span>
          )}
          {showBadge === "bestseller" && (
            <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              BESTSELLER
            </span>
          )}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={handleAddToWishlist}
        className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-50"
      >
        {isWishlisted ? (
          <HeartSolidIcon className="h-5 w-5 text-red-500" />
        ) : (
          <HeartIcon className="h-5 w-5 text-gray-600" />
        )}
      </button>

      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
              imageLoading ? "blur-sm" : "blur-0"
            }`}
            onLoad={() => setImageLoading(false)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300" />

          {/* Quick Actions */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickView}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
              title="Xem nhanh"
            >
              <EyeIcon className="h-4 w-4 text-gray-600" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 bg-blue-600 rounded-full shadow-md hover:bg-blue-700 transition-colors"
              title="Thêm vào giỏ hàng"
            >
              <ShoppingCartIcon className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              ₫{salePrice.toLocaleString("vi-VN")}
            </span>
            {product.isSale && (
              <span className="text-sm text-gray-500 line-through">
                ₫{product.price.toLocaleString("vi-VN")}
              </span>
            )}
          </div>

          {/* Rating (placeholder) */}
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-4 w-4 ${
                    star <= 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">(4.0)</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
