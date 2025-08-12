"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/common/hooks/useCart";
import { useAuth } from "@/contexts/AuthContext";

import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  HeartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  CogIcon,
} from "@heroicons/react/24/outline";

export default function Header() {
  const router = useRouter();
  const { itemsCount } = useCart();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  const navigation = [
    { name: "Trang chủ", href: "/" },
    { name: "Cửa hàng", href: "/shop" },
    { name: "Danh mục", href: "/categories" },
    { name: "Giới thiệu", href: "/about" },
    { name: "Liên hệ", href: "/contact" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="text-gray-600">
              Miễn phí vận chuyển cho đơn hàng trên 2.000.000đ
            </div>
            <div className="flex items-center space-x-4">
              {/* Admin Link - chỉ hiện khi user có role ADMIN */}
              {isAdmin() && (
                <Link
                  href="/admin"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  <CogIcon className="h-4 w-4 mr-1" />
                  Quản trị
                </Link>
              )}
              <Link
                href="/account"
                className="text-gray-600 hover:text-gray-900"
              >
                Tài khoản của tôi
              </Link>
              <Link
                href="/orders"
                className="text-gray-600 hover:text-gray-900"
              >
                Theo dõi đơn hàng
              </Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900">
                Trợ giúp
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Comforty</span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <HeartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {itemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {itemsCount > 99 ? "99+" : itemsCount}
                </span>
              )}
            </Link>

            {/* User Account Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <UserIcon className="h-6 w-6" />
                <ChevronDownIcon className="h-4 w-4 ml-1" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {!isAuthenticated ? (
                    // Menu khi chưa đăng nhập
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          Chào mừng đến với Comforty!
                        </p>
                        <p className="text-sm text-gray-600">
                          Đăng nhập để trải nghiệm tốt hơn
                        </p>
                      </div>
                      <div className="py-2">
                        <Link
                          href="/auth/sign-in"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Đăng nhập
                        </Link>
                        <Link
                          href="/auth/sign-up"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Đăng ký
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <Link
                          href="/help"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Trợ giúp
                        </Link>
                      </div>
                    </>
                  ) : (
                    // Menu khi đã đăng nhập
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.username || "Người dùng"}
                        </p>
                        <div className="flex items-center mt-1">
                          {user?.roles?.map((role) => (
                            <span
                              key={role}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1"
                            >
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="py-2">
                        {/* Admin Panel Link */}
                        {isAdmin() && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <CogIcon className="h-5 w-5 mr-3 text-blue-500" />
                            Quản trị hệ thống
                          </Link>
                        )}

                        <Link
                          href="/account"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <UserCircleIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Tài khoản của tôi
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <ShoppingCartIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Đơn hàng của tôi
                        </Link>
                        <Link
                          href="/wishlist"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <HeartIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Danh sách yêu thích
                        </Link>
                        <Link
                          href="/account/settings"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Cog6ToothIcon className="h-5 w-5 mr-3 text-gray-400" />
                          Cài đặt tài khoản
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 py-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
                          Đăng xuất
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
