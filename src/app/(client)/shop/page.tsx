"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/axios";
import { IShortProductResponse } from "@/common/types/types";
import ProductCard from "@/components/client/ProductCard";
import ProductFilters from "@/components/client/ProductFilters";
import ProductSort from "@/components/client/ProductSort";
import Pagination from "@/components/client/Pagination";
import {
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
} from "@heroicons/react/24/outline";

interface ApiResponse {
  httpCode: number;
  success: boolean;
  message: string;
  data: IShortProductResponse[];
}

type ViewMode = "grid" | "list";
type SortOption = "newest" | "price-low" | "price-high" | "name" | "rating";

function ShopPageContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<IShortProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    priceMin: searchParams.get("priceMin") || "",
    priceMax: searchParams.get("priceMax") || "",
    onSale: searchParams.get("sale") === "true",
    search: searchParams.get("search") || "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();
        if (filters.category) params.append("category", filters.category);
        if (filters.search) params.append("search", filters.search);

        const endpoint = params.toString()
          ? `/product?${params.toString()}`
          : "/product";
        const response = await api.get<ApiResponse>(endpoint);

        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          setError(response.data.message || "Failed to load products");
        }
      } catch (err: unknown) {
        console.error("Error fetching products:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters.category, filters.search]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    if (filters.priceMin) {
      filtered = filtered.filter((p) => p.price >= Number(filters.priceMin));
    }
    if (filters.priceMax) {
      filtered = filtered.filter((p) => p.price <= Number(filters.priceMax));
    }
    if (filters.onSale) {
      filtered = filtered.filter((p) => p.isSale);
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const aPrice = a.isSale
            ? a.price * (1 - a.salePercent / 100)
            : a.price;
          const bPrice = b.isSale
            ? b.price * (1 - b.salePercent / 100)
            : b.price;
          return aPrice - bPrice;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const aPrice = a.isSale
            ? a.price * (1 - a.salePercent / 100)
            : a.price;
          const bPrice = b.isSale
            ? b.price * (1 - b.salePercent / 100)
            : b.price;
          return bPrice - aPrice;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredAndSortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {filters.category ? `${filters.category} Collection` : "All Products"}
        </h1>
        <p className="text-gray-600">
          {filters.search && `Search results for "${filters.search}" • `}
          {filteredAndSortedProducts.length} products found
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-64 flex-shrink-0">
          <ProductFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                <FunnelIcon className="h-4 w-4" />
                Filters
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Squares2X2Icon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <ListBulletIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sort Options */}
            <ProductSort sortBy={sortBy} onSortChange={handleSortChange} />
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-6 p-4 border border-gray-200 rounded-lg bg-white">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFilterChange}
              />
            </div>
          )}

          {/* Products Grid/List */}
          {paginatedProducts.length > 0 ? (
            <>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-4">
                No products found
              </div>
              <p className="text-gray-400 mb-6">
                Try adjusting your filters or search terms
              </p>
              <button
                onClick={() => {
                  setFilters({
                    category: "",
                    priceMin: "",
                    priceMax: "",
                    onSale: false,
                    search: "",
                  });
                  setCurrentPage(1);
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
              ))}
            </div>
          </div>
        </div>
      }
    >
      <ShopPageContent />
    </Suspense>
  );
}
