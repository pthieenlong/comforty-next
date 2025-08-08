import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: 1,
    name: "Phòng ngủ",
    slug: "phong-ngu",
    description:
      "Nội thất phòng ngủ hoàn chỉnh cho không gian nghỉ ngơi lý tưởng",
    image: "/categories/bed.jpg",
    productCount: 45,
    featured: true,
    subcategories: [
      "Giường ngủ",
      "Tủ quần áo",
      "Tủ đầu giường",
      "Bàn trang điểm",
    ],
  },
  {
    id: 2,
    name: "Sofa",
    slug: "sofa",
    description: "Sofa cao cấp cho phòng khách sang trọng và thoải mái",
    image: "/categories/sofa.jpg",
    productCount: 32,
    featured: true,
    subcategories: ["Sofa 3 chỗ", "Sofa 2 chỗ", "Sofa góc", "Ghế thư giãn"],
  },
  {
    id: 3,
    name: "Bàn",
    slug: "ban",
    description: "Bàn ăn, bàn làm việc và bàn cà phê đa dạng",
    image: "/categories/table.jpg",
    productCount: 28,
    featured: true,
    subcategories: ["Bàn ăn", "Bàn cà phê", "Bàn làm việc", "Bàn console"],
  },
  {
    id: 4,
    name: "Tủ quần áo",
    slug: "tu-quan-ao",
    description: "Tủ quần áo đa dạng kích thước và thiết kế",
    image: "/categories/store.jpg",
    productCount: 38,
    featured: false,
    subcategories: ["Tủ 2 cánh", "Tủ 3 cánh", "Tủ 4 cánh", "Tủ âm tường"],
  },
  {
    id: 5,
    name: "Giường ngủ",
    slug: "giuong-ngu",
    description: "Giường ngủ chất lượng cao cho giấc ngủ ngon",
    image: "/categories/bed.jpg",
    productCount: 25,
    featured: false,
    subcategories: ["Giường King", "Giường Queen", "Giường đơn", "Giường tầng"],
  },
  {
    id: 6,
    name: "Tủ đầu giường",
    slug: "tu-dau-giuong",
    description: "Tủ đầu giường tiện dụng và thẩm mỹ",
    image: "/categories/store.jpg",
    productCount: 52,
    featured: false,
    subcategories: ["Tủ 1 ngăn", "Tủ 2 ngăn", "Tủ có đèn", "Tủ treo tường"],
  },
  {
    id: 7,
    name: "Kệ",
    slug: "ke-sach",
    description: "Kệ sách và kệ trang trí đa năng",
    image: "/categories/decor.png",
    productCount: 34,
    featured: false,
    subcategories: ["Kệ sách", "Kệ tivi", "Kệ trang trí", "Kệ góc"],
  },
  {
    id: 8,
    name: "Lưu trữ",
    slug: "luu-tru",
    description: "Giải pháp lưu trữ thông minh cho ngôi nhà",
    image: "/categories/store.jpg",
    productCount: 19,
    featured: false,
    subcategories: ["Tủ lưu trữ", "Hộp đựng đồ", "Kệ để đồ", "Tủ đa năng"],
  },
  {
    id: 9,
    name: "Combo",
    slug: "combo",
    description: "Bộ nội thất combo tiết kiệm và phù hợp",
    image: "/categories/chair.png",
    productCount: 15,
    featured: false,
    subcategories: [
      "Combo phòng ngủ",
      "Combo phòng khách",
      "Combo văn phòng",
      "Combo bếp",
    ],
  },
  {
    id: 10,
    name: "Vienna Collection",
    slug: "vienna-collection",
    description: "Bộ sưu tập Vienna sang trọng và đẳng cấp",
    image: "/categories/sofa.png",
    productCount: 22,
    featured: true,
    subcategories: [
      "Vienna Sofa",
      "Vienna Bed",
      "Vienna Table",
      "Vienna Storage",
    ],
  },
  {
    id: 11,
    name: "Signature Collection",
    slug: "signature-collection",
    description: "Bộ sưu tập đặc trưng với thiết kế độc đáo",
    image: "/categories/decor.jpg",
    productCount: 18,
    featured: true,
    subcategories: [
      "Signature Luxury",
      "Signature Modern",
      "Signature Classic",
      "Signature Minimalist",
    ],
  },
  {
    id: 12,
    name: "Cao cấp",
    slug: "cao-cap",
    description: "Nội thất cao cấp với chất lượng và thiết kế đỉnh cao",
    image: "/categories/chair.png",
    productCount: 30,
    featured: true,
    subcategories: [
      "Luxury Sofa",
      "Premium Bed",
      "Executive Desk",
      "Designer Chair",
    ],
  },
  {
    id: 13,
    name: "Nội thất",
    slug: "noi-that",
    description: "Tổng hợp tất cả các loại nội thất cho ngôi nhà",
    image: "/categories/store.jpg",
    productCount: 120,
    featured: false,
    subcategories: [
      "Nội thất phòng khách",
      "Nội thất phòng ngủ",
      "Nội thất bếp",
      "Nội thất văn phòng",
    ],
  },
  {
    id: 14,
    name: "Khác",
    slug: "khac",
    description: "Các sản phẩm nội thất và phụ kiện khác",
    image: "/categories/decor.png",
    productCount: 25,
    featured: false,
    subcategories: [
      "Phụ kiện trang trí",
      "Đèn chiếu sáng",
      "Thảm trải sàn",
      "Gương trang trí",
    ],
  },
];
export default function CategoriesPage() {
  const featuredCategories = categories.filter((cat) => cat.featured);
  const allCategories = categories;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Furniture Categories
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Explore our wide range of furniture categories to find exactly what
            you need for your space
          </p>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our most popular furniture categories with the largest selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative h-80">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-200 mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.productCount} products
                      </span>
                      <div className="flex items-center text-sm">
                        <span>Shop Now</span>
                        <svg
                          className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
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
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              All Categories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Browse our complete collection of furniture categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allCategories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {category.featured && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Subcategories */}
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {category.subcategories.slice(0, 2).map((sub, index) => (
                        <span
                          key={index}
                          className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 2 && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          +{category.subcategories.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {category.productCount} products
                    </span>
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <span>Browse</span>
                      <svg
                        className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
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
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help you find the perfect
            furniture for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
