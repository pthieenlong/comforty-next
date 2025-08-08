import RevenueChart from "@/components/charts/RevenueChart";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Tổng quan</h1>
        <p className="text-sm text-neutral-500">
          Hiển thị số liệu tổng quan hệ thống
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Doanh thu hôm nay", value: "₫ 12.500.000" },
          { label: "Đơn hàng mới", value: "126" },
          { label: "Sản phẩm tồn kho thấp", value: "8" },
          { label: "Khách hàng mới", value: "27" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="text-sm text-neutral-500">{kpi.label}</div>
            <div className="mt-2 text-2xl font-semibold">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-neutral-500">Doanh thu theo tháng</div>
            <div className="text-lg font-semibold">Năm 2025</div>
          </div>
        </div>
        <div className="mt-4">
          <RevenueChart />
        </div>
      </div>
    </div>
  );
}
