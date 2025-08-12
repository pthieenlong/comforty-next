"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  userService,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "@/services/userService";
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  {
    id: "profile",
    name: "Thông tin cá nhân",
    icon: UserIcon,
    description: "Quản lý thông tin cá nhân của bạn",
  },
  {
    id: "orders",
    name: "Đơn hàng",
    icon: ShoppingBagIcon,
    description: "Xem lịch sử đơn hàng",
  },
  {
    id: "wishlist",
    name: "Danh sách yêu thích",
    icon: HeartIcon,
    description: "Sản phẩm đã lưu",
  },
  {
    id: "settings",
    name: "Cài đặt",
    icon: CogIcon,
    description: "Tùy chọn tài khoản",
  },
  {
    id: "notifications",
    name: "Thông báo",
    icon: BellIcon,
    description: "Quản lý thông báo",
  },
  {
    id: "security",
    name: "Bảo mật",
    icon: ShieldCheckIcon,
    description: "Mật khẩu và bảo mật",
  },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [profileForm, setProfileForm] = useState<UpdateProfileRequest>({
    fullname: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordForm, setPasswordForm] = useState<ChangePasswordRequest>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/sign-in");
    }
  }, [isAuthenticated, router]);

  // Load user profile and stats
  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.username) return;

      try {
        setLoading(true);

        // Load user profile
        const profileResponse = await userService.getUserProfile(user.username);

        if (profileResponse.success && profileResponse.data) {
          setUserProfile(profileResponse.data);
          setProfileForm({
            fullname: profileResponse.data.fullname || "",
            email: profileResponse.data.email || "",
            phone: profileResponse.data.phone || "",
            address: profileResponse.data.address || "",
          });
        } else {
          setError(
            profileResponse.message || "Không thể tải thông tin người dùng"
          );
        }

        // Load user stats
        try {
          const statsResponse = await userService.getUserStats(user.username);
          if (statsResponse.success && statsResponse.data) {
            setUserStats(statsResponse.data);
          }
        } catch (statsError) {
          console.warn("Could not load user stats:", statsError);
          // Stats không bắt buộc, nên không throw error
        }
      } catch (error: any) {
        setError(error.message || "Có lỗi xảy ra khi tải thông tin");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user?.username]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const updateData = profileForm;

      const response = await userService.updateProfile(
        user.username,
        updateData
      );

      if (response.success && response.data) {
        setUserProfile(response.data);
        setSuccess("Cập nhật thông tin thành công!");
      } else {
        setError(response.message || "Cập nhật thất bại");
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi cập nhật");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.username) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const response = await userService.changePassword(
        user.username,
        passwordForm
      );

      if (response.success) {
        setSuccess("Đổi mật khẩu thành công!");
        setPasswordForm({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.message || "Đổi mật khẩu thất bại");
      }
    } catch (error: any) {
      setError(error.message || "Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            {/* User Info */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                {userProfile?.avatar ? (
                  <img
                    src={userProfile.avatar}
                    alt={userProfile.fullname}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {userProfile?.fullname
                      ? userProfile.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : user?.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {userProfile?.fullname || user?.username}
              </h2>
              <p className="text-gray-600">{userProfile?.email}</p>
              <p className="text-sm text-gray-500 mt-1">
                Thành viên từ{" "}
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString("vi-VN")
                  : "N/A"}
              </p>
              {userProfile?.isVerified === "VERIFIED" && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Đã xác thực
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {userStats.totalOrders}
                </div>
                <div className="text-xs text-gray-600">Đơn hàng</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ₫{(userStats.totalSpent / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-gray-600">Đã chi</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                if (item.id === "orders") {
                  return (
                    <Link
                      key={item.id}
                      href="/account/orders"
                      className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-4"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            {/* Error/Success Messages */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Thông tin cá nhân
                </h1>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={profileForm.fullname}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          fullname: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Address Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Thông tin địa chỉ
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Địa chỉ chính thức *
                      </label>
                      <input
                        type="text"
                        value={profileForm.address}
                        onChange={(e) =>
                          setProfileForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {updating ? "Đang cập nhật..." : "Lưu thay đổi"}
                  </button>
                </form>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Danh sách yêu thích
                  </h1>
                  <Link
                    href="/wishlist"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Xem danh sách đầy đủ
                  </Link>
                </div>

                <div className="text-center py-8">
                  <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">
                    Bạn có {userStats.wishlistItems} sản phẩm trong danh sách
                    yêu thích
                  </p>
                  <Link
                    href="/wishlist"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Xem danh sách yêu thích
                  </Link>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Cài đặt tài khoản
                </h1>

                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Tùy chọn
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Thông báo Email
                          </p>
                          <p className="text-sm text-gray-600">
                            Nhận cập nhật email về đơn hàng của bạn
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Thông báo SMS
                          </p>
                          <p className="text-sm text-gray-600">
                            Nhận cập nhật SMS về đơn hàng của bạn
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Email Marketing
                          </p>
                          <p className="text-sm text-gray-600">
                            Nhận ưu đãi và tin tức khuyến mãi
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Ngôn ngữ & Khu vực
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ngôn ngữ
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Tiếng Việt</option>
                          <option>English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiền tệ
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>VND (₫)</option>
                          <option>USD ($)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Bảo mật
                </h1>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Đổi mật khẩu
                    </h3>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu hiện tại
                        </label>
                        <input
                          type="password"
                          value={passwordForm.oldPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              oldPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Xác nhận mật khẩu mới
                        </label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={updating}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {updating ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
                      </button>
                    </form>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Xác thực hai yếu tố
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Thêm một lớp bảo mật bổ sung cho tài khoản của bạn
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                      Bật 2FA
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                  Thông báo
                </h1>
                <p className="text-gray-600">
                  Cài đặt thông báo sẽ được triển khai tại đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
