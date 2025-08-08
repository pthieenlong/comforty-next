export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">Thêm sản phẩm</h1>
        <p className="text-sm text-neutral-500">Nhập thông tin sản phẩm mới</p>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-4">
            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Tên sản phẩm
              </label>
              <input className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-neutral-600 mb-1">
                  Giá
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-neutral-600 mb-1">
                  Tồn kho
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Danh mục
              </label>
              <select className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none">
                <option>Ghế</option>
                <option>Bàn</option>
                <option>Tủ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-neutral-600 mb-1">
                Mô tả
              </label>
              <textarea
                rows={5}
                className="w-full px-3 py-2 rounded-md border border-neutral-200 focus:ring-2 focus:ring-neutral-900/10 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 space-y-3">
            <div className="text-sm font-medium">Hình ảnh</div>
            <div className="rounded-md border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500">
              Kéo thả hoặc chọn tệp (demo)
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center rounded-md bg-neutral-900 text-white text-sm px-4 py-2 hover:bg-neutral-800">
              Lưu sản phẩm
            </button>
            <button
              type="reset"
              className="text-sm text-neutral-700 hover:text-neutral-900"
            >
              Hủy
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
