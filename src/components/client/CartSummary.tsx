"use client";

import React from "react";
import { useCart } from "@/common/hooks/useCart";

const CartSummary: React.FC = () => {
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    total,
    isEmpty,
    formatCurrency,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeItem,
    clearAllItems,
  } = useCart();

  if (isEmpty) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Giỏ hàng</h2>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
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
          </div>
          <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống</p>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b">
        <h2 className="text-xl font-semibold">
          Giỏ hàng{" "}
          <span className="text-blue-600">({itemsCount} sản phẩm)</span>
        </h2>
        <button
          onClick={clearAllItems}
          className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Cart Items */}
      <div className="p-6">
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
            >
              {/* Product Image */}
              <div className="flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 mb-1 truncate">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-semibold text-blue-600 text-lg">
                    {formatCurrency(item.price)}
                  </span>
                  {item.originalPrice && item.originalPrice > item.price && (
                    <span className="text-sm text-gray-500 line-through">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.inStock ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => decreaseItemQuantity(item.slug)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!item.inStock || item.quantity <= 1}
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
                  <span className="w-12 h-10 flex items-center justify-center font-medium bg-gray-50 border-l border-r border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => increaseItemQuantity(item.slug)}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!item.inStock}
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

                {/* Item Total */}
                <div className="text-right min-w-[80px]">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.slug)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa sản phẩm"
                >
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="border-t pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Tạm tính ({itemsCount} sản phẩm):</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Tiết kiệm:</span>
                <span className="font-medium">-{formatCurrency(discount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-lg font-semibold pt-3 border-t">
              <span className="text-gray-900">Tổng cộng:</span>
              <span className="text-blue-600">{formatCurrency(total)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Thanh toán ngay
            </button>
            <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Tiếp tục mua sắm
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              🚚 Miễn phí vận chuyển cho đơn hàng từ 500,000đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
