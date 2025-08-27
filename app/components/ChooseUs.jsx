"use client";
import React from "react";
import { BiSolidOffer } from "react-icons/bi";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdCleaningServices } from "react-icons/md";
import Link from "next/link";

const ChooseUs = () => {
  const features = [
    {
      icon: BiSolidOffer,
      title: "Special Lease Offers",
      description:
        "Explore flexible lease options tailored to your needs, making it easy and affordable to drive your next car.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      hoverBgColor: "group-hover:bg-blue-500/20",
      borderColor: "group-hover:border-blue-400/50",
    },
    {
      icon: VscWorkspaceTrusted,
      title: "Trusted Car Dealership",
      description:
        "Years of experience and thousands of satisfied customers make us your most reliable automotive partner.",
      color: "from-app-bg to-app-border",
      bgColor: "bg-app-bg/10",
      hoverBgColor: "group-hover:bg-app-bg/20",
      borderColor: "group-hover:border-app-border/50",
    },
    {
      icon: IoPricetagsOutline,
      title: "Transparent Pricing",
      description:
        "No hidden fees, no surprises. We believe in honest, upfront pricing that you can trust and understand.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      hoverBgColor: "group-hover:bg-purple-500/20",
      borderColor: "group-hover:border-purple-400/50",
    },
    {
      icon: MdCleaningServices,
      title: "Expert Car Service",
      description:
        "Professional maintenance and repair services to keep your vehicle running smoothly for years to come.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-500/10",
      hoverBgColor: "group-hover:bg-orange-500/20",
      borderColor: "group-hover:border-orange-400/50",
    },
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.03%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.05%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Animated background elements */}
      <div className="absolute left-0 top-0 h-60 w-60 animate-pulse rounded-full bg-blue-500/20 blur-3xl dark:bg-blue-400/10"></div>
      <div className="absolute bottom-0 right-0 h-72 w-72 animate-pulse rounded-full bg-app-bg/20 blur-3xl delay-1000 dark:bg-app-bg/10"></div>

      <div className="relative px-4 py-8 sm:px-6 md:py-12 lg:py-16">
        <div className="mx-auto max-w-6xl">
          {/* Header Section */}
          <div className="mb-8 space-y-3 text-center">
            <div className="inline-block">
              <div className="mb-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-sm transition-all duration-300 hover:border-app-border/30 hover:bg-app-bg/10 dark:border-gray-700/50 dark:bg-gray-800/30 dark:hover:border-app-border/40">
                <span className="text-sm font-semibold uppercase tracking-wider text-blue-200 dark:text-blue-300">
                  Our Advantages
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-bold leading-tight text-white dark:text-gray-100 md:text-3xl lg:text-4xl">
              <span className="bg-gradient-to-r from-white via-app-border to-app-bg bg-clip-text text-transparent dark:from-gray-100 dark:via-app-border dark:to-app-bg">
                Why Choose Us?
              </span>
            </h2>

            <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-100/80 dark:text-gray-300/90">
              Experience the difference with our premium automotive services and
              customer-first approach
            </p>

            <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-app-bg to-app-border dark:from-app-bg dark:to-app-border"></div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative transform rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-white/30 ${feature.borderColor} hover:bg-white/15 hover:shadow-2xl hover:shadow-blue-500/25 dark:border-gray-700/50 dark:bg-gray-800/30 dark:hover:border-gray-600/70 dark:hover:bg-gray-800/50 dark:hover:shadow-blue-400/20`}
              >
                {/* Background glow effect */}
                <div
                  className={`absolute inset-0 ${feature.bgColor} ${feature.hoverBgColor} rounded-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:opacity-50`}
                ></div>

                {/* Content */}
                <div className="relative z-10 space-y-3">
                  {/* Icon container */}
                  <div className="relative">
                    <div
                      className={`h-12 w-12 bg-gradient-to-r ${feature.color} flex transform items-center justify-center rounded-lg shadow-lg transition-all duration-300 group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-xl`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>

                    {/* Floating particles effect */}
                    <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-white/30 opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-100 dark:bg-gray-200/40"></div>
                  </div>

                  {/* Text content */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white transition-colors duration-300 group-hover:text-blue-100 dark:text-gray-100 dark:group-hover:text-blue-200">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-blue-100/70 transition-colors duration-300 group-hover:text-blue-100/90 dark:text-gray-200 dark:group-hover:text-gray-200/90">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover indicator */}
                  <div className="flex translate-y-2 transform items-center space-x-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div
                      className={`h-0.5 w-5 bg-gradient-to-r ${feature.color} rounded-full`}
                    ></div>
                    <span className="text-xs font-medium text-blue-200 dark:text-blue-300">
                      Learn More
                    </span>
                  </div>
                </div>

                {/* Border glow effect */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${feature.color} p-[1px]`}
                >
                  <div className="h-full w-full rounded-xl bg-slate-900 dark:bg-gray-950"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA Section */}
          <div className="mt-12 text-center">
            <div className="mx-auto max-w-3xl rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-md transition-all duration-300 hover:border-app-border/30 hover:bg-white/15 dark:border-gray-700/50 dark:bg-gray-800/30 dark:hover:border-app-border/40 dark:hover:bg-gray-800/50">
              <h3 className="mb-2 text-xl font-bold text-white dark:text-gray-100 md:text-2xl">
                Ready to Experience the Difference?
              </h3>
              <p className="mb-5 text-base text-blue-100/80 dark:text-gray-300/90">
                Join thousands of satisfied customers who chose excellence
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/car-for-sale">
                  <button className="transform rounded-lg bg-gradient-to-r from-app-bg to-app-border px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-105 hover:from-app-hover hover:to-app-bg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-app-bg/50 dark:focus:ring-app-hover/50">
                    Browse Our Inventory
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="rounded-lg border border-white/30 bg-white/20 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-app-border/50 hover:bg-white/30 focus:outline-none focus:ring-4 focus:ring-white/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-gray-100 dark:hover:border-app-border/70 dark:hover:bg-gray-600/60 dark:focus:ring-gray-500/30">
                    Contact Us Today
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="h-8 w-full fill-white dark:fill-gray-900"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          ></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default ChooseUs;