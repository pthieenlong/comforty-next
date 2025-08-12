"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const heroSlides = [
  {
    id: 1,
    title: "Thoải Mái Hiện Đại",
    subtitle: "Bộ Sưu Tập Nội Thất Cao Cấp",
    description:
      "Khám phá bộ sưu tập nội thất cao cấp mới nhất được thiết kế cho không gian sống hiện đại.",
    image: "/banners/decoration-1.jpg",
    buttonText: "Mua ngay",
    buttonLink: "/shop",
    backgroundColor: "bg-gradient-to-r from-gray-800 to-gray-900",
  },
  {
    id: 2,
    title: "Thiết Kế Thanh Lịch",
    subtitle: "Chế Tác Với Độ Chính Xác Cao",
    description:
      "Mỗi sản phẩm đều được chế tác cẩn thận để mang lại sự thanh lịch và tiện ích cho ngôi nhà của bạn.",
    image: "/banners/decoration-2.jpg",
    buttonText: "Khám phá bộ sưu tập",
    buttonLink: "/shop?category=ghe",
    backgroundColor: "bg-gradient-to-r from-gray-800 to-gray-900",
  },
  {
    id: 3,
    title: "Thoải Mái Là Ưu Tiên",
    subtitle: "Chất Lượng Đáng Tin Cậy",
    description:
      "Trải nghiệm sự thoải mái vô đối với chất liệu cao cấp và tay nghề chân thành của chúng tôi.",
    image: "/banners/decoration-3.jpg",
    buttonText: "Tìm hiểu thêm",
    buttonLink: "/about",
    backgroundColor: "bg-gradient-to-r from-gray-800 to-gray-900",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000); // Resume autoplay after 10s
  };

  const goToPrevious = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background */}
          <div className={`absolute inset-0 ${slide.backgroundColor}`} />

          {/* Background Image */}
          <div className="absolute inset-0 opacity-20">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl">
                <div className="animate-fade-in-up">
                  <p className="text-white/90 text-lg md:text-xl mb-2 font-light">
                    {slide.subtitle}
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-white/80 text-lg md:text-xl mb-8 leading-relaxed">
                    {slide.description}
                  </p>
                  <Link
                    href={slide.buttonLink}
                    className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg"
                  >
                    {slide.buttonText}
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
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300 backdrop-blur-sm"
        aria-label="Slide trước"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors duration-300 backdrop-blur-sm"
        aria-label="Slide tiếp theo"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Chuyển đến slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
        <div
          className="h-full bg-white transition-all duration-300 ease-linear"
          style={{
            width: `${((currentSlide + 1) / heroSlides.length) * 100}%`,
          }}
        />
      </div>
    </section>
  );
}
