"use client";
import React from "react";
import { FaStar, FaQuoteLeft } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const CustomerTestimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Austin, TX",
      rating: 5,
      quote:
        "Exceptional service from start to finish. The team was professional, transparent, and helped me find the perfect car within my budget. Highly recommended!",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "March 2024",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "Seattle, WA",
      rating: 5,
      quote:
        "Best car buying experience I have ever had. No pressure, honest pricing, and excellent financing options. My new SUV runs perfectly!",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "January 2024",
      verified: true,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      location: "Miami, FL",
      rating: 5,
      quote:
        "Outstanding customer service and quality vehicles. The maintenance team keeps my car running like new. Worth every penny!",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "February 2024",
      verified: true,
    },
    {
      id: 4,
      name: "David Thompson",
      location: "Chicago, IL",
      rating: 5,
      quote:
        "Professional, reliable, and trustworthy. They delivered exactly what they promised. Great selection and competitive prices.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "April 2024",
      verified: true,
    },
    {
      id: 5,
      name: "Lisa Park",
      location: "Denver, CO",
      rating: 5,
      quote:
        "Smooth transaction, excellent communication, and fantastic after-sales support. They truly care about their customers.",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "March 2024",
      verified: true,
    },
    {
      id: 6,
      name: "Robert Wilson",
      location: "Phoenix, AZ",
      rating: 5,
      quote:
        "Incredible value and service quality. The team went above and beyond to ensure I was completely satisfied with my purchase.",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face&facepad=2",
      purchaseDate: "February 2024",
      verified: true,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <FaStar
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? "text-yellow-400"
            : "text-gray-300 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <section className="bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            <MdVerified className="h-4 w-4" />
            <span>Verified Reviews</span>
          </div>

          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
            Customer Testimonials
          </h2>

          <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">
            Do not just take our word for it. Here is what our satisfied
            customers have to say about their experience.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-lg dark:hover:shadow-gray-900/20"
            >
              {/* Quote Icon */}
              <div className="mb-3 flex items-start justify-between">
                <FaQuoteLeft className="h-4 w-4 text-blue-600 opacity-60 dark:text-blue-400" />
                {testimonial.verified && (
                  <div className="text-app-bg dark:text-app-bg flex items-center gap-1 rounded-full  px-2 py-0.5 text-xs font-medium dark:bg-green-900/30">
                    <MdVerified className="h-3 w-3" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="mb-3 flex items-center gap-1">
                {renderStars(testimonial.rating)}
              </div>

              {/* Quote */}
              <blockquote className="mb-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {testimonial.quote}
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="h-10 w-10 rounded-full border-2 border-gray-200 object-cover dark:border-gray-600"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.location} • {testimonial.purchaseDate}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div className="flex flex-col items-center">
              <div className="mb-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
                4.9/5
              </div>
              <div className="mb-1 flex items-center gap-1">
                {renderStars(5)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Average Rating
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="text-app-bg dark:text-app-bg mb-1 text-2xl font-bold">
                2,500+
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Happy Customers
              </p>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-1 text-2xl font-bold text-purple-600 dark:text-purple-400">
                98%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonials;
