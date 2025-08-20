"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslations } from "next-intl";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";
import { FaRegHeart } from "react-icons/fa6";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const VehicleCard = ({
  vehicle,
  userLikedCars,
  handleLikeToggle,
  convertedValues,
  selectedCurrency,
  currency,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = vehicle.imageUrls || [];
  const hasMultipleImages = images.length > 1;

  // Automatic image carousel
  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000); 
    
    return () => clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index, e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(index);
  };

  // Format vehicle title with condition
  const getVehicleTitle = () => {
    const condition = vehicle.condition
      ? vehicle.condition.charAt(0).toUpperCase() +
        vehicle.condition.slice(1).toLowerCase()
      : "";
    const make = vehicle.make || "";
    const model = vehicle.model || "";

    if (condition && condition !== "Default") {
      return `${condition} ${make} ${model}`.trim();
    }
    return `${make} ${model}`.trim();
  };

  return (
    <Link href={`/car-detail/${vehicle.slug || vehicle._id}`}>
      <div className="group w-full h-full transform cursor-pointer overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-slate-800 dark:shadow-slate-900/20 flex flex-col">
        {/* Image Section */}
        <div className="relative">
          <div className="relative aspect-[4/3] overflow-hidden">
            {hasMultipleImages ? (
              /* Image Container with Smooth Sliding */
              <div className="carousel-container">
  <div className="carousel-track">
    {images.map((image, index) => (
      <div key={index} className="carousel-item">
        <Image
          src={image || "/placeholder.svg"}
          fill
          alt={`${getVehicleTitle()} - Image ${index + 1}`}
          className="object-cover"
        />
      </div>
    ))}
  </div>

  <style jsx>{`
    .carousel-container {
      height: 100%;
      display: flex;
      overflow: hidden;
    }

    .carousel-track {
      display: flex;
      height: 100%;
      transition: transform 0.5s ease-in-out;
      transform: translateX(-${currentImageIndex * (100 / images.length)}%);
      width: ${images.length * 100}%;
    }

    .carousel-item {
      position: relative;
      aspect-ratio: 4 / 3;
      height: 100%;
      flex-shrink: 0;
      width: ${100 / images.length}%;
    }
  `}</style>
</div>

            ) : (
              /* Single Image Display */
              <Image
                src={images[0] || "/placeholder.svg"}
                fill
                alt={getVehicleTitle()}
                className="object-cover"
              />
            )}

            {/* Image Navigation Arrows - Only show on hover */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-sm transition-all duration-200 hover:bg-black/80 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {/* Image Progress Indicators */}
          {hasMultipleImages && (
            <div className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 space-x-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => goToImage(index, e)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "w-6 bg-white shadow-md"
                      : "w-1.5 bg-white/60 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Tag Badge - Keep this one */}
          {!vehicle.sold && vehicle.tag && vehicle.tag !== "default" && (
            <div className="absolute right-2 top-2 z-20">
              <span className="rounded-full bg-red-600 px-2 py-1 text-xs font-medium text-white shadow-lg">
                {vehicle.tag.toUpperCase()}
              </span>
            </div>
          )}

          {vehicle.sold && (
            <div className="absolute left-5 top-20 z-10">
              <div className="origin-bottom-left -translate-x-6 -translate-y-5 -rotate-45 transform bg-red-500 shadow-lg">
                <div className="w-32 px-0 py-2 text-center text-xs font-bold text-white">
                  SOLD
                </div>
              </div>
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleLikeToggle(vehicle._id);
            }}
            className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl dark:bg-slate-800/95"
          >
            {userLikedCars &&
            Array.isArray(userLikedCars) &&
            userLikedCars.includes(vehicle._id) ? (
              <FaHeart className="h-3 w-3 text-red-500" />
            ) : (
              <FaRegHeart className="h-3 w-3 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Content Section - Reduced padding */}
        <div className="p-3 flex-1 flex flex-col">
          {/* Title and Price */}
          <div className="mb-2 flex items-start justify-between">
            <div className="flex-1">
              <h3 className="line-clamp-1 text-base font-bold leading-tight text-gray-800 dark:text-white">
                {getVehicleTitle()}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {vehicle.modelYear}
              </p>
            </div>
            <div className="ml-2">
              {/* Green price background without rounding */}
              <div className="bg-green-600 px-2 py-1 text-right">
                <div className="text-sm font-bold text-white">
                  {selectedCurrency && selectedCurrency.symbol}{" "}
                  {Math.round(
                    (vehicle &&
                      vehicle.price *
                        ((selectedCurrency && selectedCurrency.value) || 1)) /
                      ((currency && currency.value) || 1),
                  ).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Stats - Reduced padding and gap */}
          <div className="grid grid-cols-3 gap-1 text-center mt-auto">
            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                <IoSpeedometer className="h-3 w-3 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="text-xs font-semibold text-gray-800 dark:text-white">
                {convertedValues.kms}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                {convertedValues.unit && convertedValues.unit.toUpperCase()}
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                <GiGasPump className="h-3 w-3 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="text-xs font-semibold text-gray-800 dark:text-white">
                {vehicle && vehicle.fuelType}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                Fuel
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                <TbManualGearbox className="h-3 w-3 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="text-xs font-semibold text-gray-800 dark:text-white">
                {vehicle && vehicle.gearbox}
              </div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">
                Trans
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const VehicalsList = ({ loadingState }) => {
  const t = useTranslations("HomePage");
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, selectedCurrency } = useCurrency();
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [visibleVehiclesCount, setVisibleVehiclesCount] = useState(6);
  const [listingData, setListingData] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await fetch("/api/homepage");
        const result = await response.json();
        if (response.ok) {
          setListingData(result?.listingSection);
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };
    fetchListingData();
  }, []);

  // Conversion functions with decimal precision
  const convertKmToMiles = (km) => {
    const numericKm = Number.parseFloat(km);
    return isNaN(numericKm) ? km : (numericKm * 0.621371).toFixed(1);
  };

  const convertMilesToKm = (miles) => {
    const numericMiles = Number.parseFloat(miles);
    return isNaN(numericMiles) ? miles : (numericMiles * 1.60934).toFixed(1);
  };

  // Function to convert car values based on default unit
  const getConvertedValues = (vehicle) => {
    if (distanceLoading || !defaultUnit || !vehicle.unit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit || defaultUnit,
      };
    }
    if (vehicle.unit === defaultUnit) {
      return {
        kms: vehicle.kms,
        mileage: vehicle.mileage,
        unit: vehicle.unit,
      };
    }
    let convertedKms = vehicle.kms;
    let convertedMileage = vehicle.mileage;
    if (vehicle.unit === "km" && defaultUnit === "miles") {
      convertedKms = convertKmToMiles(vehicle.kms);
      convertedMileage = convertKmToMiles(vehicle.mileage);
    } else if (vehicle.unit === "miles" && defaultUnit === "km") {
      convertedKms = convertMilesToKm(vehicle.kms);
      convertedMileage = convertMilesToKm(vehicle.mileage);
    }
    return {
      kms: convertedKms,
      mileage: convertedMileage,
      unit: defaultUnit,
    };
  };

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/cars");
      if (!response.ok) throw new Error("Failed to fetch vehicles");
      const data = await response.json();
      const filteredCars = data.cars.filter(
        (car) => car.status === 1 || car.status === "1",
      );
      setVehicles(filteredCars);
      setFilteredVehicles(filteredCars);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/users/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setUserLikedCars(
          Array.isArray(data.user?.likedCars) ? data.user.likedCars : [],
        );
      }
    } catch (error) {
      return;
    }
  };

  const handleLikeToggle = async (carId) => {
    try {
      const response = await fetch("/api/users/liked-cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ carId }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserLikedCars(Array.isArray(data.likedCars) ? data.likedCars : []);
        setUser((prev) => ({
          ...prev,
          likedCars: data.likedCars,
        }));
      } else {
        console.error("Failed to update liked cars");
      }
    } catch (error) {
      console.error("Error updating liked cars:", error);
    }
  };

  const handleToggleVisibility = () => {
    if (visibleVehiclesCount >= filteredVehicles.length) {
      setVisibleVehiclesCount(3);
    } else {
      setVisibleVehiclesCount((prevCount) =>
        Math.min(prevCount + 3, filteredVehicles.length),
      );
    }
  };

  const handleFilterChange = (filterType) => {
    setActiveFilter(filterType);
    setVisibleVehiclesCount(6); // Reset visible count when filtering

    if (filterType === "all") {
      setFilteredVehicles(vehicles);
    } else {
      const filtered = vehicles.filter((vehicle) => {
        if (filterType === "for-sale") {
          return !vehicle.sold;
        }
        return (
          !vehicle.sold &&
          vehicle.tag &&
          vehicle.tag.toLowerCase() === filterType.toLowerCase()
        );
      });
      setFilteredVehicles(filtered);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchUserData();
  }, []);

  if (error) {
    return (
      <div className="mx-4 my-10 sm:mx-8 md:my-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
          <div className="flex items-center space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
              <span className="text-sm text-white">!</span>
            </div>
            <span className="font-medium">Error: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (listingData && listingData.status === "inactive") {
    return null;
  }

  return (
    <section className="my-7 rounded-xl bg-slate-50 py-7 dark:bg-slate-900 sm:mx-8 md:my-10 md:py-10">
      <div className="mb-10">
        {/* Header with title and filters */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Title Section */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold leading-tight text-gray-800 dark:text-white md:text-4xl">
              {listingData && listingData.heading}
            </h2>
          </div>

          {/* View All Button - Top Right */}
          <div className="flex items-center gap-4">
            <Link href={"/car-for-sale"}>
              <div className="group inline-flex transform items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:text-gray-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                <span>{t("viewAll")}</span>
                <MdOutlineArrowOutward className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Filter Tabs - Professional Rectangular Style */}
        <div className="mb-8 flex flex-wrap gap-1">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeFilter === "all"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            All Cars
          </button>
          <button
            onClick={() => handleFilterChange("for-sale")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeFilter === "for-sale"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            For Sale
          </button>
          <button
            onClick={() => handleFilterChange("featured")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeFilter === "featured"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            Featured
          </button>
          <button
            onClick={() => handleFilterChange("promotion")}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeFilter === "promotion"
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            }`}
          >
            Promotion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:gap-8">
        {loading
          ? Array(3)
              .fill()
              .map((_, index) => (
                <div
                  className="overflow-hidden rounded-lg border border-slate-100 bg-white shadow-md dark:border-slate-700 dark:bg-slate-800"
                  key={index}
                >
                  <div className="relative">
                    <Skeleton className="h-32 w-full" />
                  </div>
                  <div className="space-y-3 p-3">
                    <div className="flex items-start justify-between">
                      <Skeleton height={20} width="60%" />
                      <Skeleton height={24} width="30%" />
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <Skeleton circle width={24} height={24} />
                          <Skeleton height={12} width="80%" className="mt-1" />
                          <Skeleton height={10} width="60%" className="mt-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
          : filteredVehicles.slice(0, visibleVehiclesCount).map((vehicle) => {
              const convertedValues = getConvertedValues(vehicle);
              return (
                <VehicleCard
                  key={vehicle._id}
                  vehicle={vehicle}
                  userLikedCars={userLikedCars}
                  handleLikeToggle={handleLikeToggle}
                  convertedValues={convertedValues}
                  selectedCurrency={selectedCurrency}
                  currency={currency}
                />
              );
            })}
      </div>

      {!loading && filteredVehicles.length > 3 && (
        <div className="mt-10 text-center">
          <button
            onClick={handleToggleVisibility}
            className="group inline-flex transform items-center gap-3 rounded-lg bg-gray-800 px-6 py-3 font-medium text-white shadow-md transition-all duration-300 hover:bg-gray-700"
          >
            <span>
              {visibleVehiclesCount >= filteredVehicles.length
                ? "Show less"
                : "Show more"}
            </span>
            {visibleVehiclesCount >= filteredVehicles.length ? (
              <ChevronUp className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
            )}
          </button>
        </div>
      )}

      {filteredVehicles.length === 0 && !loading && (
        <div className="py-20 text-center">
          <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-slate-50 shadow-inner dark:bg-slate-800">
            <svg
              className="h-16 w-16 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">
            {activeFilter === "all"
              ? "No Vehicles Available"
              : `No ${activeFilter === "for-sale" ? "Cars For Sale" : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1) + " Cars"} Available`}
          </h3>
          <p className="mx-auto max-w-md text-lg text-gray-600 dark:text-slate-400">
            {activeFilter === "all"
              ? "Our inventory is currently being updated. Please check back soon for the latest additions."
              : `No ${activeFilter === "for-sale" ? "cars for sale" : activeFilter + " cars"} found. Try selecting a different filter or check back later.`}
          </p>
        </div>
      )}
    </section>
  );
};

export default VehicalsList;
