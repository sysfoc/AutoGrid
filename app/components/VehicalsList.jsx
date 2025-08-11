"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdOutlineArrowOutward } from "react-icons/md";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { BiTachometer } from "react-icons/bi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslations } from "next-intl";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";
import { FaRegHeart } from "react-icons/fa6";
import { ChevronDown, ChevronUp } from "lucide-react";

const VehicleCard = ({
  vehicle,
  userLikedCars,
  handleLikeToggle,
  convertedValues,
  selectedCurrency,
  currency,
}) => {
  return (
    <div className="w-full transform overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:bg-slate-800 dark:shadow-slate-900/20">
      {/* Image Section - Reduced height */}
      <div className="relative">
        <div className="relative aspect-[4/2.8] overflow-hidden">
          <Image
            src={
              (vehicle.imageUrls && vehicle.imageUrls[0]) || "/placeholder.svg"
            }
            fill
            alt={`${vehicle.make} ${vehicle.model}`}
            className="object-cover transition-all duration-500 hover:scale-105"
          />
        </div>

        {!vehicle.sold && vehicle.tag && vehicle.tag !== "default" && (
          <div className="absolute right-3 top-3 z-20">
            <span className="rounded-full bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              {vehicle.tag.toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute left-5 top-20 z-10">
          <div
            className={`origin-bottom-left -translate-x-6 -translate-y-5 -rotate-45 transform shadow-lg ${
              vehicle.sold ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <div className="w-32 px-0 py-2 text-center text-xs font-bold text-white">
              {vehicle.sold ? "SOLD" : "AVAILABLE"}
            </div>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleLikeToggle(vehicle._id);
          }}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl dark:bg-slate-800/95"
        >
          {userLikedCars &&
          Array.isArray(userLikedCars) &&
          userLikedCars.includes(vehicle._id) ? (
            <FaHeart className="h-3.5 w-3.5 text-red-500" />
          ) : (
            <FaRegHeart className="h-3.5 w-3.5 text-gray-600 hover:text-red-500" />
          )}
        </button>
      </div>

      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold leading-tight text-gray-800 dark:text-white">
              {vehicle.make} {vehicle.model}
            </h3>
          </div>
          <div className="ml-4 text-right">
            <div className="text-xl font-bold text-gray-800 dark:text-red-400">
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

        <div className="mb-4 grid grid-cols-3 gap-3 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <IoSpeedometer className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {convertedValues.kms}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {convertedValues.unit && convertedValues.unit.toUpperCase()}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <GiGasPump className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {vehicle && vehicle.fuelType}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Fuel</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
              <TbManualGearbox className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {vehicle && vehicle.gearbox}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Trans
            </div>
          </div>
        </div>

        {/* View Details Button - Now inside the card */}
        <Link
          href={`/car-detail/${vehicle.slug || vehicle._id}`}
          className="block w-fit rounded-xl bg-gradient-to-r from-red-600 to-red-600/90 px-3 py-3 text-center text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-700 hover:shadow-xl dark:from-red-600 dark:to-red-600/90 dark:hover:from-red-700 dark:hover:to-red-700"
          onClick={(e) => e.stopPropagation()}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

const VehicalsList = ({ loadingState }) => {
  const t = useTranslations("HomePage");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currency, selectedCurrency } = useCurrency();
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [visibleVehiclesCount, setVisibleVehiclesCount] = useState(6);
  const [listingData, setListingData] = useState(null);

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
    if (visibleVehiclesCount >= vehicles.length) {
      setVisibleVehiclesCount(3);
    } else {
      setVisibleVehiclesCount((prevCount) =>
        Math.min(prevCount + 3, vehicles.length),
      );
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
      <div className="mb-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-600/10 px-4 py-2 text-sm font-medium text-red-600 dark:bg-red-600/20 dark:text-red-400">
            <BiTachometer className="h-4 w-4" />
            <span>Premium Collection</span>
          </div>
          <h2 className="mb-6 bg-gradient-to-br from-gray-800 via-gray-800/90 to-gray-800/70 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-slate-100 dark:to-slate-300 md:text-5xl lg:text-6xl">
            {listingData && listingData.heading}
          </h2>
          <Link href={"/car-for-sale"}>
            <div className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-600/90 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-700 hover:shadow-2xl dark:from-red-600 dark:to-red-600/90 dark:hover:from-red-700 dark:hover:to-red-700">
              <span>{t("viewAll")}</span>
              <MdOutlineArrowOutward className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:grid-cols-3 lg:gap-8">
        {loading
          ? Array(3)
              .fill()
              .map((_, index) => (
                <div
                  className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                  key={index}
                >
                  <div className="relative">
                    <Skeleton className="h-40 w-full" />
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="flex items-start justify-between">
                      <Skeleton height={24} width="60%" />
                      <Skeleton height={28} width="30%" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                          <Skeleton circle width={32} height={32} />
                          <Skeleton height={14} width="80%" className="mt-2" />
                          <Skeleton height={10} width="60%" className="mt-1" />
                        </div>
                      ))}
                    </div>
                    <Skeleton height={40} width="100%" />
                  </div>
                </div>
              ))
          : vehicles.slice(0, visibleVehiclesCount).map((vehicle) => {
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

      {!loading && vehicles.length > 3 && (
        <div className="mt-10 text-center">
          <button
            onClick={handleToggleVisibility}
            className="group inline-flex transform items-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-600/90 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-700 hover:shadow-2xl dark:from-red-600 dark:to-red-600/90 dark:hover:from-red-700 dark:hover:to-red-700"
          >
            <span>
              {visibleVehiclesCount >= vehicles.length
                ? "Show less"
                : "Show more"}
            </span>
            {visibleVehiclesCount >= vehicles.length ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-1" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
            )}
          </button>
        </div>
      )}

      {vehicles.length === 0 && !loading && (
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
            No Vehicles Available
          </h3>
          <p className="mx-auto max-w-md text-lg text-gray-600 dark:text-slate-400">
            Our premium collection is currently being updated. Please check back
            soon for the latest additions.
          </p>
        </div>
      )}
    </section>
  );
};

export default VehicalsList;
