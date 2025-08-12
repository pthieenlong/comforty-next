"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentType, SVGProps } from "react";
import {
  HomeIcon,
  CubeIcon,
  ShoppingBagIcon,
  TagIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

type NavItem = {
  label: string;
  href?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children?: { label: string; href: string }[];
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: HomeIcon },
  {
    label: "Sản phẩm",
    icon: CubeIcon,
    children: [
      { label: "Xem tất cả", href: "/admin/products" },
      { label: "Thêm sản phẩm", href: "/admin/products/new" },
    ],
  },
  {
    label: "Danh mục",
    icon: TagIcon,
    children: [
      { label: "Xem tất cả", href: "/admin/categories" },
      { label: "Thêm danh mục", href: "/admin/categories/new" },
    ],
  },
  { label: "Đơn hàng", href: "/admin/orders", icon: ShoppingBagIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.startsWith("/admin/products")) {
      setOpenGroups((prev) => ({ ...prev, products: true }));
    }
    if (pathname.startsWith("/admin/categories")) {
      setOpenGroups((prev) => ({ ...prev, categories: true }));
    }
  }, [pathname]);

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(href + "/") : false;

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-5 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="size-9 rounded-md bg-gradient-to-br from-indigo-600 to-sky-500 text-white grid place-items-center font-semibold shadow-sm">
            C
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold">Comforty</div>
            <div className="text-xs text-neutral-500">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            if (item.children) {
              const groupKey =
                item.label === "Sản phẩm" ? "products" : "categories";
              const open = openGroups[groupKey] ?? false;
              const anyChildActive = item.children.some((c) =>
                isActive(c.href)
              );
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                      anyChildActive
                        ? "bg-indigo-50 text-indigo-900 ring-1 ring-inset ring-indigo-100"
                        : "text-neutral-700 hover:bg-neutral-50"
                    }`}
                    onClick={() =>
                      setOpenGroups((prev) => ({
                        ...prev,
                        [groupKey]: !open,
                      }))
                    }
                  >
                    {item.icon && (
                      <item.icon className="size-5 shrink-0 text-neutral-500" />
                    )}
                    <span className="flex-1 text-left">{item.label}</span>
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>
                  {open && (
                    <ul className="mt-1 ml-9 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`block px-3 py-1.5 rounded-md text-sm transition-colors ${
                              isActive(child.href)
                                ? "bg-indigo-50 text-indigo-900 ring-1 ring-inset ring-indigo-100"
                                : "text-neutral-700 hover:bg-neutral-50"
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.label}>
                <Link
                  href={item.href!}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                    isActive(item.href)
                      ? "bg-indigo-50 text-indigo-900 ring-1 ring-inset ring-indigo-100"
                      : "text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  {item.icon && (
                    <item.icon className="size-5 shrink-0 text-neutral-500" />
                  )}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
