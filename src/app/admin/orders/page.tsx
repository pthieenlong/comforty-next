"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";

const MOCK_ORDERS = Array.from({ length: 20 }).map((_, i) => ({
  id: 2000 + i,
  customer: [
    "Nguyễn An",
    "Trần Bình",
    "Lê Chi",
    "Phạm Dũng",
    "Hoàng Em",
    "Vũ Giai",
    "Đỗ Hạ",
  ][i % 7],
  total: 1000000 + i * 350000,
  status: ["Mới", "Đang giao", "Hoàn tất", "Hủy"][i % 4],
  date: `2025-08-${(10 + i).toString().padStart(2, "0")}`,
}));

export default function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string | "">("");
  const [rows, setRows] = useState(MOCK_ORDERS);

  const filtered = useMemo(() => {
    return rows.filter((o) => {
      const safeCustomer = (o.customer || "").toString().toLowerCase();
      const matchText =
        safeCustomer.includes(query.toLowerCase()) ||
        String(o.id).includes(query);
      const matchStatus = status ? o.status === status : true;
      return matchText && matchStatus;
    });
  }, [rows, query, status]);

  const onDelete = (id: number) => {
    setRows((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Đơn hàng</h1>
        <p className="text-sm text-neutral-500">Theo dõi và xử lý đơn hàng</p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-3 border-b border-neutral-200 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo mã đơn hoặc khách hàng..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Mới">Mới</option>
              <option value="Đang giao">Đang giao</option>
              <option value="Hoàn tất">Hoàn tất</option>
              <option value="Hủy">Hủy</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-600">
              <tr>
                <th className="text-left font-medium px-4 py-3">Mã đơn</th>
                <th className="text-left font-medium px-4 py-3">Khách hàng</th>
                <th className="text-left font-medium px-4 py-3">Ngày</th>
                <th className="text-left font-medium px-4 py-3">Tổng tiền</th>
                <th className="text-left font-medium px-4 py-3">Trạng thái</th>
                <th className="text-right font-medium px-4 py-3">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-neutral-100 hover:bg-neutral-50/60"
                >
                  <td className="px-4 py-3">
                    <a
                      href={`/admin/orders/${o.id}`}
                      className="text-indigo-700 hover:underline"
                    >
                      #{o.id}
                    </a>
                  </td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3">{o.date}</td>
                  <td className="px-4 py-3">
                    ₫ {o.total.toLocaleString("vi-VN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                        o.status === "Hoàn tất"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "Đang giao"
                          ? "bg-amber-100 text-amber-800"
                          : o.status === "Mới"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => onDelete(o.id)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm text-rose-700 hover:text-rose-800 hover:bg-rose-50"
                      title="Xóa đơn hàng"
                    >
                      <TrashIcon className="size-4" /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
