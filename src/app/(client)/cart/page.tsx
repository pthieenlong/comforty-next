"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

interface CartItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  isSale: boolean;
  salePercent: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Mock cart data - replace with real API call
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setCartItems([
        {
          id: "1",
          slug: "modern-chair",
          title: "Modern Ergonomic Office Chair",
          image: "/api/placeholder/200/200",
          price: 2500000,
          salePrice: 2000000,
          quantity: 1,
          isSale: true,
          salePercent: 20,
        },
        {
          id: "2",
          slug: "dining-table",
          title: "Wooden Dining Table Set",
          image: "/api/placeholder/200/200",
          price: 8500000,
          quantity: 1,
          isSale: false,
          salePercent: 0,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const moveToWishlist = (id: string) => {
    // TODO: Implement move to wishlist
    console.log("Move to wishlist:", id);
    removeItem(id);
  };

  const applyPromoCode = () => {
    // Mock promo code logic
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(0.1);
      alert("Promo code applied! 10% discount");
    } else if (promoCode.toLowerCase() === "welcome20") {
      setDiscount(0.2);
      alert("Welcome code applied! 20% discount");
    } else {
      alert("Invalid promo code");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.isSale ? item.salePrice || item.price : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const discountAmount = subtotal * discount;
  const shipping = subtotal > 1000000 ? 0 : 50000; // Free shipping over 1M VND
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax
  const total = subtotal - discountAmount + shipping + tax;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <ShoppingBagIcon className="h-24 w-24 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven&apos;t added anything to your cart yet.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-start space-x-4">
                {/* Product Image */}
                <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                  {item.isSale && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded">
                      -{item.salePercent}%
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                  >
                    {item.title}
                  </Link>

                  <div className="flex items-center space-x-2 mt-2">
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

                  {/* Quantity and Actions */}
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-2 border-x border-gray-300 min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Total for this item */}
                      <div className="text-lg font-semibold text-gray-900">
                        ₫
                        {(
                          (item.isSale
                            ? item.salePrice || item.price
                            : item.price) * item.quantity
                        ).toLocaleString("vi-VN")}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => moveToWishlist(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Move to wishlist"
                      >
                        <HeartIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Order Summary
            </h2>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={applyPromoCode}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Try: SAVE10 or WELCOME20
              </p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ₫{subtotal.toLocaleString("vi-VN")}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                  <span>-₫{discountAmount.toLocaleString("vi-VN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₫${shipping.toLocaleString("vi-VN")}`
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ₫{tax.toLocaleString("vi-VN")}
                </span>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₫{total.toLocaleString("vi-VN")}</span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
            >
              Proceed to Checkout
            </Link>

            {/* Security Info */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                🔒 Secure checkout with SSL encryption
              </p>
            </div>

            {/* Accepted Payment Methods */}
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 mb-2">We accept:</p>
              <div className="flex justify-center space-x-2">
                <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                  VISA
                </div>
                <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                  MC
                </div>
                <div className="w-8 h-5 bg-gray-600 rounded text-white text-xs flex items-center justify-center">
                  COD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
