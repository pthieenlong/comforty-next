"use client";

import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Ghế",
    slug: "ghe",
    description: "Giải pháp chỗ ngồi thoải mái",
    image: "/categories/chair.png",
    productCount: 45,
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Bàn",
    slug: "ban",
    description: "Bàn ăn & bàn cà phê",
    image: "/categories/table.jpg",
    productCount: 32,
    color: "bg-green-500",
  },
  {
    id: 3,
    name: "Sofa",
    slug: "sofa",
    description: "Bộ sofa sang trọng",
    image: "/categories/sofa.jpg",
    productCount: 28,
    color: "bg-purple-500",
  },
  {
    id: 4,
    name: "Tủ đồ",
    slug: "tu",
    description: "Tủ & tủ quần áo",
    image: "/categories/store.jpg",
    productCount: 38,
    color: "bg-orange-500",
  },
  {
    id: 5,
    name: "Nội thất",
    slug: "noi that",
    description: "Nội thất phòng ngủ",
    image: "/categories/bed.jpg",
    productCount: 25,
    color: "bg-red-500",
  },
  {
    id: 6,
    name: "Vienna Collection",
    slug: "vienna-collection",
    description: "Vienna Collection",
    image: "/categories/decor.jpg",
    productCount: 52,
    color: "bg-indigo-500",
  },
];

export default function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mua sắm theo danh mục
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Khám phá nhiều danh mục nội thất đa dạng để tìm kiếm những món đồ hoàn
          hảo cho ngôi nhà của bạn
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {/* Category Image */}
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all duration-300" />

              {/* Color accent */}
              <div
                className={`absolute top-3 left-3 w-3 h-3 rounded-full ${category.color}`}
              />
            </div>

            {/* Category Info */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {category.productCount} sản phẩm
                </span>
                <svg
                  className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* View All Categories */}
      <div className="text-center mt-12">
        <Link
          href="/categories"
          className="inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-300"
        >
          Xem tất cả danh mục
          <svg
            className="ml-2 h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
