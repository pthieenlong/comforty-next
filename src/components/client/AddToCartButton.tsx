"use client";

import React, { useState } from "react";
import { useCartItem } from "@/common/hooks/useCart";
import { ICartItem } from "@/store/cartSlice";

interface AddToCartButtonProps {
  product: {
    slug: string;
    title: string;
    price: number;
    originalPrice?: number;
    image: string;
    inStock: boolean;
  };
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "outline";
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  product,
  className = "",
  size = "md",
  variant = "primary",
}) => {
  const { isInCart, quantity, addToCart, increaseQuantity, decreaseQuantity } =
    useCartItem(product.slug);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const cartItem: Omit<ICartItem, "quantity"> = {
        slug: product.slug,
        title: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        inStock: product.inStock,
      };

      await addToCart(cartItem);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline:
      "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
  };

  const baseClasses = `font-medium rounded-lg transition-colors ${sizeClasses[size]} ${className}`;

  // Out of stock state
  if (!product.inStock) {
    return (
      <button
        disabled
        className={`${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`}
      >
        <span className="flex items-center justify-center space-x-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span>Hết hàng</span>
        </span>
      </button>
    );
  }

  // Already in cart - show quantity controls
  if (isInCart) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <button
          onClick={decreaseQuantity}
          className={`w-8 h-8 flex items-center justify-center bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors ${
            quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={quantity <= 1}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>

        <span className="w-8 text-center font-medium text-gray-900">
          {quantity}
        </span>

        <button
          onClick={increaseQuantity}
          className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    );
  }

  // Add to cart button
  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={`${baseClasses} ${variantClasses[variant]} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="flex items-center justify-center space-x-2">
        {loading ? (
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
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
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M20 13v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6"
            />
          </svg>
        )}
        <span>{loading ? "Đang thêm..." : "Thêm vào giỏ"}</span>
      </span>
    </button>
  );
};

export default AddToCartButton;
