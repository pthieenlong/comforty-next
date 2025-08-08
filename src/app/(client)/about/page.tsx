import Image from "next/image";
import Link from "next/link";
import {
  TruckIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

export default function AboutPage() {
  const features = [
    {
      icon: TruckIcon,
      title: "Free Shipping",
      description: "Free delivery on orders over ₫1,000,000",
    },
    {
      icon: ShieldCheckIcon,
      title: "2 Year Warranty",
      description: "Full warranty coverage on all products",
    },
    {
      icon: HeartIcon,
      title: "Customer Care",
      description: "24/7 customer support for all your needs",
    },
    {
      icon: StarIcon,
      title: "Premium Quality",
      description: "Only the finest materials and craftsmanship",
    },
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/api/placeholder/300/300",
      description:
        "With over 15 years in furniture design, Sarah leads our vision.",
    },
    {
      name: "Michael Chen",
      role: "Head of Design",
      image: "/api/placeholder/300/300",
      description:
        "Michael brings innovative designs that blend form and function.",
    },
    {
      name: "Emily Rodriguez",
      role: "Customer Success",
      image: "/api/placeholder/300/300",
      description:
        "Emily ensures every customer has an exceptional experience.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About Comforty
            </h1>
            <p className="text-xl text-blue-100">
              Creating beautiful, comfortable spaces for modern living since
              2010
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-4">
                  Founded in 2010, Comforty began as a small family business
                  with a simple mission: to create beautiful, functional
                  furniture that brings comfort and style to every home.
                </p>
                <p className="mb-4">
                  What started as a local furniture store has grown into a
                  trusted brand known for quality craftsmanship, innovative
                  design, and exceptional customer service. We believe that
                  great furniture should be accessible to everyone.
                </p>
                <p>
                  Today, we continue to uphold our founding values while
                  embracing new technologies and sustainable practices to serve
                  our customers better.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden">
              <Image
                src="/api/placeholder/600/400"
                alt="Comforty showroom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Comforty?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re committed to providing exceptional value and service to
              every customer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Mission
              </h3>
              <p className="text-gray-600">
                To create furniture that enhances the way people live, work, and
                connect in their spaces, making every home a place of comfort
                and inspiration.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheckIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Values
              </h3>
              <p className="text-gray-600">
                Quality craftsmanship, sustainable practices, customer-first
                service, and innovative design guide everything we do.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <StarIcon className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Our Vision
              </h3>
              <p className="text-gray-600">
                To be the leading furniture brand that transforms houses into
                homes through thoughtful design and exceptional quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Comforty who make it all possible
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative h-64">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Products</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Cities</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">14</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our collection of premium furniture and start creating the
            home of your dreams today.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
