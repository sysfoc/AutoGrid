// "use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Car,
  Truck,
  Bus,
  CarFront,
  CarTaxiFront,
  TruckIcon as TruckOpen,
} from "lucide-react";
import { MdOutlineArrowOutward } from "react-icons/md";

// Lucide vehicle icons
const vehicleIcons = [Car, Truck, Bus, CarFront, CarTaxiFront, TruckOpen];

const BrandsList = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setBrandData(result?.brandSection);
        }
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };

    fetchBrandData();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/Vehicle make and model data (2).json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const extractedBrands = data.Sheet1.map((item) => ({
          name: item.Maker.trim(),
          icon: vehicleIcons[Math.floor(Math.random() * vehicleIcons.length)],
        }));
        setBrands(extractedBrands);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Track screen width
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Decide how many brands to show
  let visibleBrandsCount = 12;
  if (screenWidth < 640) visibleBrandsCount = 4;
  else if (screenWidth < 768) visibleBrandsCount = 6;
  else if (screenWidth < 1024) visibleBrandsCount = 8;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-32 sm:h-64 items-center justify-center">
            <div className="h-8 w-8 sm:h-12 sm:w-12 animate-spin rounded-full border-b-2 border-indigo-600 dark:border-app-button"></div>
            <span className="ml-3 text-sm sm:text-base font-medium text-app-text dark:text-gray-100">
              Loading brands...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (brandData?.status === "inactive") return null;

  return (
    <section className="relative mx-2 sm:mx-4 my-4 sm:my-6 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 px-2 sm:px-4 py-8 sm:py-12 shadow-lg">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-16 sm:-right-32 -top-20 sm:-top-40 h-48 w-48 sm:h-96 sm:w-96 animate-pulse rounded-full bg-blue-200/15 to-purple-200/15 blur-3xl dark:bg-blue-900/20 dark:to-purple-900/20"></div>
        <div className="absolute -bottom-16 sm:-bottom-32 -left-20 sm:-left-40 h-40 w-40 sm:h-80 sm:w-80 animate-pulse rounded-full bg-orange-200/15 to-red-200/15 blur-3xl delay-1000 dark:bg-orange-900/20 dark:to-red-900/20"></div>
      </div>

      <div className="relative mx-auto max-w-7xl translate-y-0 opacity-100 transition-all duration-1000">
        {/* Heading */}
        <div className="mb-8 sm:mb-16 text-center px-2">
          <h2 className="mb-2 sm:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold text-app-text dark:text-gray-100">
            {brandData?.heading || "Browse Cars by Brands"}
          </h2>
          <p className="mx-auto mb-4 sm:mb-8 max-w-xl sm:max-w-2xl text-center text-sm sm:text-base lg:text-lg text-app-text/80 dark:text-gray-300 px-4">
            {brandData?.description}
          </p>

          <div className="flex justify-center">
            <Link href="/brands">
              <div className="group transform rounded-xl sm:rounded-2xl bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-2.5 sm:py-3.5 text-center text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-center justify-center gap-2">
                  <span>View All Brands</span>
                  <MdOutlineArrowOutward className="h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Brands Grid */}
        <div className="relative px-2 sm:px-6">
          <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {brands.slice(0, visibleBrandsCount).map((brand, index) => {
              const Icon = brand.icon;
              return (
                <Link
                  href={`/car-for-sale?make=${encodeURIComponent(brand.name)}`}
                  key={`${brand.name}-${index}`}
                  className="group"
                >
                  <div
                    className="animate-fade-in-up relative flex flex-col items-center justify-center rounded-lg sm:rounded-xl border border-gray-300 hover:border-app-button dark:border-gray-600 dark:hover:border-app-button bg-white dark:bg-gray-800 p-2 sm:p-3 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-xl"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 overflow-hidden rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-700 p-1.5 sm:p-2 lg:p-3 shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:shadow-md">
                      <Icon className="h-full w-full text-app-button dark:text-app-button transition-all duration-300" />
                    </div>
                    <h3 className="mt-1.5 sm:mt-2 lg:mt-3 w-full truncate px-1 text-center text-xs sm:text-sm lg:text-base font-bold text-app-button dark:text-app-button transition-all duration-300">
                      {brand.name}
                    </h3>
                    <div className="mx-auto mt-1 sm:mt-2 h-0.5 sm:h-1 w-0 bg-app-button rounded-full transition-all duration-500 group-hover:w-6 sm:group-hover:w-8"></div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animation Style */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default BrandsList;