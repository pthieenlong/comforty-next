"use client";

import CartSummary from "@/components/client/CartSummary";

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng</h1>
        <CartSummary />
      </div>
    </div>
  );
}
