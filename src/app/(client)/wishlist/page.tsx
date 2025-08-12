"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HeartIcon,
  ShoppingCartIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface WishlistItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  salePrice?: number;
  isSale: boolean;
  salePercent: number;
  isInStock: boolean;
  categories: string[];
  rating: number;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock wishlist data - replace with real API call
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setWishlistItems([
        {
          id: "1",
          slug: "modern-sofa",
          title: "Modern 3-Seater Sofa",
          image: "/api/placeholder/300/300",
          price: 12500000,
          salePrice: 10000000,
          isSale: true,
          salePercent: 20,
          isInStock: true,
          categories: ["Sofas", "Living Room"],
          rating: 4.5,
        },
        {
          id: "2",
          slug: "coffee-table",
          title: "Glass Coffee Table",
          image: "/api/placeholder/300/300",
          price: 3500000,
          isSale: false,
          salePercent: 0,
          isInStock: true,
          categories: ["Tables", "Living Room"],
          rating: 4.2,
        },
        {
          id: "3",
          slug: "bookshelf",
          title: "Wooden Bookshelf",
          image: "/api/placeholder/300/300",
          price: 4500000,
          isSale: false,
          salePercent: 0,
          isInStock: false,
          categories: ["Storage", "Office"],
          rating: 4.8,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlistItems((items) => items.filter((item) => item.id !== id));
  };

  const addToCart = (id: string) => {
    console.log("Add to cart:", id);
    alert("Added to cart!");
  };

  const moveAllToCart = () => {
    const inStockItems = wishlistItems.filter((item) => item.isInStock);
    if (inStockItems.length === 0) {
      alert("No items in stock to add to cart");
      return;
    }
    console.log("Move all to cart:", inStockItems);
    alert(`Added ${inStockItems.length} items to cart!`);
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

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <HeartIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Save your favorite items for later by adding them to your wishlist.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? "s" : ""}{" "}
            saved
          </p>
        </div>

        {wishlistItems.some((item) => item.isInStock) && (
          <button
            onClick={moveAllToCart}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCartIcon className="h-5 w-5" />
            <span>Add All to Cart</span>
          </button>
        )}
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div
            key={item.id}
            className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeFromWishlist(item.id)}
              className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-50"
            >
              <TrashIcon className="h-4 w-4 text-red-500" />
            </button>

            {/* Wishlist Indicator */}
            <div className="absolute top-3 left-3 z-10">
              <HeartSolidIcon className="h-6 w-6 text-red-500" />
            </div>

            <Link href={`/products/${item.slug}`} className="block">
              {/* Product Image */}
              <div className="relative aspect-square bg-gray-100 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Sale Badge */}
                {item.isSale && (
                  <div className="absolute top-3 left-12 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    -{item.salePercent}%
                  </div>
                )}

                {/* Stock Status */}
                {!item.isInStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold">
                      Out of Stock
                    </span>
                  </div>
                )}

                {/* Quick View */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      console.log("Quick view:", item.id);
                    }}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    title="Quick View"
                  >
                    <EyeIcon className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.categories.slice(0, 2).map((category, index) => (
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
                  {item.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.floor(item.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({item.rating})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₫
                    {(item.isSale
                      ? item.salePrice || item.price
                      : item.price
                    ).toLocaleString("vi-VN")}
                  </span>
                  {item.isSale && (
                    <span className="text-sm text-gray-500 line-through">
                      ₫{item.price.toLocaleString("vi-VN")}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            {/* Action Button */}
            <div className="px-4 pb-4">
              {item.isInStock ? (
                <button
                  onClick={() => addToCart(item.id)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCartIcon className="h-4 w-4 mr-2" />
                  Add to Cart
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-semibold cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Wishlist Tips */}
      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Wishlist Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <HeartIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Save Favorites</h4>
            <p className="text-sm text-gray-600">
              Click the heart icon on any product to save it for later
            </p>
          </div>
          <div className="text-center">
            <ShoppingCartIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Quick Add</h4>
            <p className="text-sm text-gray-600">
              Add all in-stock items to your cart with one click
            </p>
          </div>
          <div className="text-center">
            <EyeIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-1">Stay Updated</h4>
            <p className="text-sm text-gray-600">
              Get notified when your saved items go on sale
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
