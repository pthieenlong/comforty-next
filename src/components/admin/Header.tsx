"use client";

import { useEffect, useRef, useState } from "react";
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";

function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  onOutside: () => void
) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) onOutside();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onOutside]);
}

export default function Header() {
  const [openNotif, setOpenNotif] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  useOutsideClick(notifRef, () => setOpenNotif(false));
  useOutsideClick(userRef, () => setOpenUser(false));

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-neutral-200">
      <div className="mx-auto max-w-7xl flex items-center gap-4 px-4 md:px-6 lg:px-8 py-3">
        {/* Search */}
        <div className="flex-1 min-w-0">
          <label className="relative block">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full pl-10 pr-3 py-2 rounded-md border border-neutral-200 bg-white text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </label>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              aria-label="Notifications"
              className="relative inline-grid place-items-center size-9 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50"
              onClick={() => setOpenNotif((v) => !v)}
            >
              <BellIcon className="size-5 text-neutral-600" />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 h-5 text-[10px] rounded-full bg-neutral-900 text-white">
                3
              </span>
            </button>
            {openNotif && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-neutral-200 bg-white shadow-lg p-2">
                <div className="px-2 py-1.5 text-xs font-medium text-neutral-500">
                  Thông báo gần đây
                </div>
                <ul className="divide-y divide-neutral-100">
                  {[
                    "Đơn hàng #1256 đã được thanh toán",
                    "Sản phẩm mới đã được thêm",
                    "Hệ thống sẽ bảo trì 2h sáng",
                  ].map((msg, idx) => (
                    <li
                      key={idx}
                      className="p-2 text-sm hover:bg-neutral-50 rounded-md"
                    >
                      {msg}
                    </li>
                  ))}
                </ul>
                <div className="px-2 pt-2">
                  <button className="w-full text-center text-sm text-neutral-700 hover:text-neutral-900 py-1.5">
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User */}
          <div className="relative" ref={userRef}>
            <button
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-md border border-neutral-200 bg-white hover:bg-neutral-50"
              onClick={() => setOpenUser((v) => !v)}
            >
              <div className="size-7 rounded-full bg-neutral-900 text-white grid place-items-center text-xs font-semibold">
                AD
              </div>
              <div className="text-left leading-tight hidden sm:block">
                <div className="text-[13px] font-medium">Admin</div>
                <div className="text-[11px] text-neutral-500">
                  admin@comforty.com
                </div>
              </div>
            </button>
            {openUser && (
              <div className="absolute right-0 mt-2 w-64 rounded-lg border border-neutral-200 bg-white shadow-lg p-2">
                <div className="px-2 py-1.5 text-xs font-medium text-neutral-500">
                  Tài khoản
                </div>
                <div className="px-2 py-2">
                  <div className="text-sm font-medium">admin@comforty.com</div>
                  <div className="text-xs text-neutral-500">
                    Role: Administrator
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <button
                    className="w-full rounded-md bg-neutral-900 text-white text-sm py-2 hover:bg-neutral-800"
                    onClick={() => alert("Logged out (demo)")}
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
