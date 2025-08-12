"use client";

import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import api from "@/lib/axios";

interface FilterProps {
  filters: {
    category: string;
    priceMin: string;
    priceMax: string;
    onSale: boolean;
    search: string;
  };
  onFiltersChange: (filters: FilterProps["filters"]) => void;
}
const priceRanges = [
  { id: "under-500k", label: "Under ₫500,000", min: "", max: "500000" },
  {
    id: "500k-1m",
    label: "₫500,000 - ₫1,000,000",
    min: "500000",
    max: "1000000",
  },
  {
    id: "1m-2m",
    label: "₫1,000,000 - ₫2,000,000",
    min: "1000000",
    max: "2000000",
  },
  {
    id: "2m-5m",
    label: "₫2,000,000 - ₫5,000,000",
    min: "2000000",
    max: "5000000",
  },
  { id: "over-5m", label: "Over ₫5,000,000", min: "5000000", max: "" },
];
interface ICategoryResponse {
  slug: string,
  name: string,
  productCount: number,
}
interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: ICategoryResponse[];
}

export default function ProductFilters({
  filters,
  onFiltersChange,
}: FilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    features: true,
  });
  const [categories, setCategories] = useState<ICategoryResponse[]>([]);

  useEffect(() => {
    const fetchCategory = async () => {
      const endpoint = `category/count`
      const response = await api.get<ApiResponse>(endpoint);
      if(response.data.success) {
        setCategories(response.data.data);
      }
    }
    fetchCategory();
  }, [])
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      category: filters.category === categoryId ? "" : categoryId,
    });
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    onFiltersChange({
      ...filters,
      priceMin: min,
      priceMax: max,
    });
  };

  const handleCustomPriceChange = (
    field: "priceMin" | "priceMax",
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  const handleSaleToggle = () => {
    onFiltersChange({
      ...filters,
      onSale: !filters.onSale,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "",
      priceMin: "",
      priceMax: "",
      onSale: false,
      search: "",
    });
  };

  const hasActiveFilters =
    filters.category || filters.priceMin || filters.priceMax || filters.onSale;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Xóa tất cả
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection("categories")}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <span className="font-medium text-gray-900">Danh mục</span>
          {expandedSections.categories ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.categories && (
          <div className="mt-4 space-y-3">
            {categories.map((category) => (
              <label
                key={category.slug}
                className="flex items-center cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.category === category.slug}
                  onChange={() => handleCategoryChange(category.slug)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm text-gray-700 flex-1 capitalize">
                  {category.name}
                </span>
                <span className="text-xs text-gray-500">
                  ({category.productCount})
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-6">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <span className="font-medium text-gray-900">Khoảng giá</span>
          {expandedSections.price ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.price && (
          <div className="mt-4 space-y-4">
            {/* Preset Price Ranges */}
            <div className="space-y-3">
              {priceRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={
                      filters.priceMin === range.min &&
                      filters.priceMax === range.max
                    }
                    onChange={() =>
                      handlePriceRangeChange(range.min, range.max)
                    }
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div className="pb-6">
        <button
          onClick={() => toggleSection("features")}
          className="flex items-center justify-between w-full py-2 text-left"
        >
          <span className="font-medium text-gray-900">Tính năng</span>
          {expandedSections.features ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
          )}
        </button>

        {expandedSections.features && (
          <div className="mt-4 space-y-3">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onSale}
                onChange={handleSaleToggle}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                Đang khuyến mãi
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">
            Bộ lọc đang áp dụng
          </h4>

          <div className="flex flex-wrap gap-2">
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {categories.find((c) => c.slug === filters.category)?.name}
                <button
                  onClick={() => handleCategoryChange(filters.category)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {(filters.priceMin || filters.priceMax) && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {filters.priceMin &&
                  `₫${Number(filters.priceMin).toLocaleString("vi-VN")}`}
                {filters.priceMin && filters.priceMax && " - "}
                {filters.priceMax &&
                  `₫${Number(filters.priceMax).toLocaleString("vi-VN")}`}
                <button
                  onClick={() => handlePriceRangeChange("", "")}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.onSale && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                Đang khuyến mãi
                <button
                  onClick={handleSaleToggle}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
