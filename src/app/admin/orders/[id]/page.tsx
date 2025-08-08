"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Mock detail content
  const order = {
    id,
    customer: "Nguyễn An",
    date: "2025-08-12",
    status: "Mới",
    total: 3250000,
    items: [
      { name: "Ghế gỗ Comfort 1", qty: 1, price: 1500000 },
      { name: "Bàn gỗ Comfort 2", qty: 1, price: 1750000 },
    ],
    address: "123 Lê Lợi, Q.1, TP.HCM",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">
            Đơn hàng #{order.id}
          </h1>
          <p className="text-sm text-neutral-500">Chi tiết đơn hàng</p>
        </div>
        <Link
          href="/admin/orders"
          className="text-sm text-neutral-700 hover:text-neutral-900"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-neutral-500">Khách hàng</div>
                <div className="font-medium">{order.customer}</div>
              </div>
              <div>
                <div className="text-neutral-500">Ngày</div>
                <div className="font-medium">{order.date}</div>
              </div>
              <div>
                <div className="text-neutral-500">Trạng thái</div>
                <div className="font-medium">{order.status}</div>
              </div>
              <div>
                <div className="text-neutral-500">Tổng tiền</div>
                <div className="font-medium">
                  ₫ {order.total.toLocaleString("vi-VN")}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className="text-sm font-medium mb-3">Sản phẩm</div>
            <div className="divide-y divide-neutral-100">
              {order.items.map((it, i) => (
                <div
                  key={i}
                  className="py-3 flex items-center justify-between text-sm"
                >
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-neutral-500">SL: {it.qty}</div>
                  </div>
                  <div>₫ {(it.price * it.qty).toLocaleString("vi-VN")}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
            <div className="text-neutral-500">Địa chỉ giao hàng</div>
            <div className="font-medium mt-1">{order.address}</div>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm">
            <div className="text-neutral-500">Ghi chú</div>
            <div className="text-neutral-600 mt-1">Không có</div>
          </div>
        </div>
      </div>
    </div>
  );
}
