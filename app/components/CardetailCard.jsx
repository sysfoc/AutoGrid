"use client";
import {
  Carousel,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Select,
  Textarea,
  TextInput,
  Spinner,
} from "flowbite-react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { GrSort } from "react-icons/gr";
import { FiGrid, FiList } from "react-icons/fi";
import { FaLocationCrosshairs, FaRegHeart, FaHeart } from "react-icons/fa6";
import { IoSpeedometer } from "react-icons/io5";
import { GiGasPump, GiCarSeat } from "react-icons/gi";
import { TbManualGearbox } from "react-icons/tb";
import { IoIosColorPalette } from "react-icons/io";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useCurrency } from "../context/CurrencyContext";
import { useDistance } from "../context/DistanceContext";

const CardetailCard = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const searchParams = useSearchParams();
  const { currency, selectedCurrency } = useCurrency();
  const [sortOption, setSortOption] = useState("default");
  const [sortedAndFilteredCars, setSortedAndFilteredCars] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [userLikedCars, setUserLikedCars] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const { distance: defaultUnit, loading: distanceLoading } = useDistance();
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(null);
  const [recaptchaStatus, setRecaptchaStatus] = useState("inactive");

  const parseBooleanParam = (param) => {
    return param === "true";
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  useEffect(() => {
    const fetchRecaptchaSettings = async () => {
      try {
        const response = await fetch("/api/settings/general", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.settings?.recaptcha) {
          setRecaptchaSiteKey(data.settings.recaptcha.siteKey);
          setRecaptchaStatus(data.settings.recaptcha.status);
        }
      } catch (error) {
        console.error(
          "Failed to fetch reCAPTCHA settings in CardetailCard:",
          error,
        );
      }
    };
    fetchRecaptchaSettings();
  }, []);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    let recaptchaToken = null;
    if (
      recaptchaStatus === "active" &&
      recaptchaSiteKey &&
      typeof window.grecaptcha !== "undefined"
    ) {
      try {
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
          action: "car_enquiry_submit",
        });
      } catch (error) {
        console.error("reCAPTCHA execution failed:", error);
        setSubmitMessage("reCAPTCHA verification failed. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } else if (
      recaptchaStatus === "active" &&
      (!recaptchaSiteKey || typeof window.grecaptcha === "undefined")
    ) {
      console.error("reCAPTCHA is active but not fully loaded or configured.");
      setSubmitMessage(
        "reCAPTCHA is not ready. Please refresh the page and try again.",
      );
      setIsSubmitting(false);
      return;
    }

    const enquiryData = {
      carId: selectedCar?._id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      recaptchaToken: recaptchaToken,
    };

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiryData),
      });
      const result = await response.json();

      if (response.ok) {
        setSubmitMessage(
          "Enquiry submitted successfully! We will contact you soon.",
        );
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        setTimeout(() => {
          setOpenModal(false);
          setSubmitMessage("");
          setSelectedCar(null);
        }, 2000);
      } else {
        setSubmitMessage(
          result.error || "Failed to submit enquiry. Please try again.",
        );
      }
    } catch (error) {
      console.error("Enquiry submission error:", error);
      setSubmitMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filters = useMemo(() => {
    return Object.fromEntries(searchParams.entries());
  }, [searchParams]);

  const parseArrayParam = (param) => {
    if (!param) return [];
    return Array.isArray(param) ? param : [param];
  };

  const parseNumberParam = (param) => {
    if (!param) return [];
    const parsed = Array.isArray(param)
      ? param.map((p) => Number.parseInt(p, 10)).filter(Number.isInteger)
      : [Number.parseInt(param, 10)].filter(Number.isInteger);
    return parsed;
  };

  const sortCars = (cars, sortBy) => {
    if (!cars || cars.length === 0) return cars;
    const sortedCars = [...cars];
    switch (sortBy) {
      case "price-lh":
        return sortedCars.sort((a, b) => {
          const priceA = Number.parseInt(a.price) || 0;
          const priceB = Number.parseInt(b.price) || 0;
          return priceA - priceB;
        });
      case "price-hl":
        return sortedCars.sort((a, b) => {
          const priceA = Number.parseInt(a.price) || 0;
          const priceB = Number.parseInt(b.price) || 0;
          return priceB - priceA;
        });
      case "model-latest":
        return sortedCars.sort((a, b) => {
          const yearA = Number.parseInt(a.year || a.modelYear) || 0;
          const yearB = Number.parseInt(b.year || b.modelYear) || 0;
          return yearB - yearA;
        });
      case "model-oldest":
        return sortedCars.sort((a, b) => {
          const yearA = Number.parseInt(a.year || a.modelYear) || 0;
          const yearB = Number.parseInt(b.year || b.modelYear) || 0;
          return yearA - yearB;
        });
      case "mileage-lh":
        return sortedCars.sort((a, b) => {
          const getMileage = (car) => {
            const mileageField = car.mileage || car.kms || "0";
            return (
              Number.parseInt(String(mileageField).replace(/[^\d]/g, "")) || 0
            );
          };
          return getMileage(a) - getMileage(b);
        });
      case "mileage-hl":
        return sortedCars.sort((a, b) => {
          const getMileage = (car) => {
            const mileageField = car.mileage || car.kms || "0";
            return (
              Number.parseInt(String(mileageField).replace(/[^\d]/g, "")) || 0
            );
          };
          return getMileage(b) - getMileage(a);
        });
      default:
        return sortedCars;
    }
  };

  const parsedFilters = useMemo(() => {
    return {
      keyword: filters.keyword || "",
      condition: parseArrayParam(filters.condition),
      location: parseArrayParam(filters.location),
      minPrice: filters.minPrice ? Number.parseInt(filters.minPrice, 10) : null,
      maxPrice: filters.maxPrice ? Number.parseInt(filters.maxPrice, 10) : null,
      minYear: filters.minYear || "",
      maxYear: filters.maxYear || "",
      model: parseArrayParam(filters.model),
      millageFrom: filters.millageFrom || "",
      millageTo: filters.millageTo || "",
      gearBox: parseArrayParam(filters.gearBox),
      bodyType: parseArrayParam(filters.bodyType),
      color: parseArrayParam(filters.color),
      doors: parseNumberParam(filters.doors),
      seats: parseNumberParam(filters.seats),
      fuel: parseArrayParam(filters.fuel),
      engineSizeFrom: filters.engineSizeFrom || "",
      engineSizeTo: filters.engineSizeTo || "",
      enginePowerFrom: filters.enginePowerFrom || "",
      enginePowerTo: filters.enginePowerTo || "",
      battery: filters.battery || "Any",
      charging: filters.charging || "Any",
      lease: parseBooleanParam(filters.lease) || false,
      fuelConsumption: filters.fuelConsumption || "Any",
      co2Emission: filters.co2Emission || "Any",
      driveType: parseArrayParam(filters.driveType),
    };
  }, [filters]);

  const t = useTranslations("Filters");
  const [isGridView, setIsGridView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(filters).toString();
    const apiUrl = "/api";
    setLoading(true);
    fetch(`${apiUrl}/cars?${query}`)
      .then((res) => {
        if (!res.ok) {
          console.error(`API error: ${res.status} ${res.statusText}`);
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setCars(data.cars || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setCars([]);
        setLoading(false);
      });
  }, [filters]);

  useEffect(() => {
    const filtered = (cars || []).filter((car) => {
      const matchesKeyword = parsedFilters.keyword
        ? car.make
            ?.toLowerCase()
            .includes(parsedFilters.keyword.toLowerCase()) ||
          car.model?.toLowerCase().includes(parsedFilters.keyword.toLowerCase())
        : true;
      const matchesCondition = parsedFilters.condition.length
        ? parsedFilters.condition.includes(car.condition?.toLowerCase())
        : true;
      const matchesLocation = parsedFilters.location.length
        ? parsedFilters.location.some((loc) =>
            car.location?.toLowerCase().includes(loc.toLowerCase()),
          )
        : true;
      const matchesLease = parsedFilters.lease ? car.isLease : true;
      const carPrice = car.price ? Number.parseInt(car.price, 10) : null;
      const matchesPrice =
        (parsedFilters.minPrice === null && parsedFilters.maxPrice === null) ||
        (carPrice !== null &&
          (parsedFilters.minPrice === null ||
            carPrice >= parsedFilters.minPrice) &&
          (parsedFilters.maxPrice === null ||
            carPrice <= parsedFilters.maxPrice));
      const carYear = car.year || car.modelYear;
      const matchesYear =
        (!parsedFilters.minYear && !parsedFilters.maxYear) ||
        (carYear &&
          (!parsedFilters.minYear ||
            Number.parseInt(carYear, 10) >=
              Number.parseInt(parsedFilters.minYear, 10)) &&
          (!parsedFilters.maxYear ||
            Number.parseInt(carYear, 10) <=
              Number.parseInt(parsedFilters.maxYear, 10)));
      const matchesModel = parsedFilters.model.length
        ? parsedFilters.model.some((modelVal) => {
            if (car.model) {
              return modelVal.toLowerCase() === car.model.toLowerCase();
            }
            return false;
          })
        : true;
      const carMileageField = car.mileage || car.kms;
      const matchesMileage = carMileageField
        ? (() => {
            const carMileage =
              Number.parseInt(
                String(carMileageField).replace(/[^\d]/g, ""),
                10,
              ) || 0;
            const from = parsedFilters.millageFrom
              ? Number.parseInt(parsedFilters.millageFrom, 10)
              : null;
            const to = parsedFilters.millageTo
              ? Number.parseInt(parsedFilters.millageTo, 10)
              : null;
            return (!from || carMileage >= from) && (!to || carMileage <= to);
          })()
        : true;
      const matchesGearBox = parsedFilters.gearBox.length
        ? parsedFilters.gearBox.includes(car.gearbox?.toLowerCase())
        : true;
      const matchesbodyType = parsedFilters.bodyType.length
        ? parsedFilters.bodyType.includes(car.bodyType?.toLowerCase())
        : true;
      const matchesColor = parsedFilters.color.length
        ? parsedFilters.color.includes(car.color?.toLowerCase())
        : true;
      const carDoors =
        typeof car.doors === "string" && car.doors !== "Select"
          ? Number.parseInt(car.doors, 10)
          : car.doors;
      const matchesDoors = parsedFilters.doors.length
        ? parsedFilters.doors.includes(carDoors)
        : true;
      const carSeats =
        typeof car.seats === "string" && car.seats !== "Select"
          ? Number.parseInt(car.seats, 10)
          : car.seats;
      const matchesSeats = parsedFilters.seats.length
        ? parsedFilters.seats.includes(carSeats)
        : true;
      const matchesFuelType = parsedFilters.fuel.length
        ? parsedFilters.fuel.includes(car.fuelType?.toLowerCase())
        : true;
      const matchesDriveType = parsedFilters.driveType.length
        ? parsedFilters.driveType.includes(car.driveType?.toLowerCase())
        : true;
      const matchesBatteryrange = car.batteryRange
        ? (() => {
            const batteryRange =
              parsedFilters.battery !== "Any"
                ? Number.parseInt(parsedFilters.battery, 10)
                : null;
            const carBatteryRange = car.batteryRange
              ? Number.parseInt(car.batteryRange, 10)
              : null;
            return batteryRange ? carBatteryRange >= batteryRange : true;
          })()
        : true;
      const matchesChargingTime = car.chargingTime
        ? (() => {
            const chargingTime =
              parsedFilters.charging !== "Any"
                ? Number.parseInt(parsedFilters.charging, 10)
                : null;
            const carChargingTime = car.chargingTime
              ? Number.parseInt(car.chargingTime, 10)
              : null;
            return chargingTime ? carChargingTime >= chargingTime : true;
          })()
        : true;
      const matchesEngineSize =
        (!parsedFilters.engineSizeFrom ||
          Number.parseInt(String(car.engineSize), 10) >=
            Number.parseInt(parsedFilters.engineSizeFrom, 10)) &&
        (!parsedFilters.engineSizeTo ||
          Number.parseInt(String(car.engineSize), 10) <=
            Number.parseInt(parsedFilters.engineSizeTo, 10));
      const matchesEnginePower =
        (!parsedFilters.enginePowerFrom ||
          Number.parseInt(String(car.enginePower), 10) >=
            Number.parseInt(parsedFilters.enginePowerFrom, 10)) &&
        (!parsedFilters.enginePowerTo ||
          Number.parseInt(String(car.enginePower), 10) <=
            Number.parseInt(parsedFilters.enginePowerTo, 10));
      const matchesFuelConsumption = car.fuelConsumption
        ? (() => {
            const selectedFuelConsumption =
              parsedFilters.fuelConsumption !== "Any"
                ? Number.parseInt(parsedFilters.fuelConsumption, 10)
                : null;
            const carFuelConsumption = car.fuelConsumption
              ? Number.parseInt(car.fuelConsumption, 10)
              : null;
            return selectedFuelConsumption
              ? carFuelConsumption === selectedFuelConsumption
              : true;
          })()
        : true;
      const matchesCo2Emission = car.co2Emission
        ? (() => {
            const selectedCo2Emission =
              parsedFilters.co2Emission !== "Any"
                ? Number.parseInt(parsedFilters.co2Emission, 10)
                : null;
            const carCo2Emission = car.co2Emission
              ? Number.parseInt(car.co2Emission, 10)
              : null;
            return selectedCo2Emission
              ? carCo2Emission === selectedCo2Emission
              : true;
          })()
        : true;

      return (
        matchesKeyword &&
        matchesCondition &&
        matchesLocation &&
        matchesPrice &&
        matchesYear &&
        matchesModel &&
        matchesMileage &&
        matchesGearBox &&
        matchesLease &&
        matchesbodyType &&
        matchesColor &&
        matchesDoors &&
        matchesSeats &&
        matchesFuelType &&
        matchesBatteryrange &&
        matchesChargingTime &&
        matchesEngineSize &&
        matchesEnginePower &&
        matchesFuelConsumption &&
        matchesCo2Emission &&
        matchesDriveType
      );
    });
    setFilteredCars(filtered);
  }, [cars, parsedFilters]);

  useEffect(() => {
    const sorted = sortCars(filteredCars, sortOption);
    setSortedAndFilteredCars(sorted);
  }, [filteredCars, sortOption]);

  const paginationData = useMemo(() => {
    const totalItems = sortedAndFilteredCars.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedAndFilteredCars.slice(startIndex, endIndex);
    return {
      totalItems,
      totalPages,
      currentItems,
      startIndex,
      endIndex: Math.min(endIndex, totalItems),
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    };
  }, [sortedAndFilteredCars, currentPage, itemsPerPage]);

  const handlePageChange = async (newPage) => {
    if (newPage === currentPage || isPageTransitioning) return;
    setIsPageTransitioning(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setTimeout(() => {
      setCurrentPage(newPage);
      setIsPageTransitioning(false);
    }, 200);
  };

  const getVisiblePageNumbers = () => {
    const { totalPages } = paginationData;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }
    return rangeWithDots;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [parsedFilters]);

  const convertKmToMiles = (km) => {
    const numericKm = Number.parseFloat(km);
    return isNaN(numericKm) ? km : (numericKm * 0.621371).toFixed(1);
  };

  const convertMilesToKm = (miles) => {
    const numericMiles = Number.parseFloat(miles);
    return isNaN(numericMiles) ? miles : (numericMiles * 1.60934).toFixed(1);
  };

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
      convertedKms = convertMilesToKm(vehicle.miles);
      convertedMileage = convertMilesToKm(vehicle.mileage);
    }

    return {
      kms: convertedKms,
      mileage: convertedMileage,
      unit: defaultUnit,
    };
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <Spinner
            aria-label="Loading vehicles"
            size="lg"
            className="text-white"
          />
          <div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Loading vehicles...
            </span>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the latest listings
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!sortedAndFilteredCars.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 dark:bg-gray-700">
            <svg
              className="h-10 w-10 text-slate-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.664-2.647l.835-1.252A6 6 0 0112 13a6 6 0 014.829-1.899l.835 1.252zm.835-1.252A7.962 7.962 0 0112 9c-2.34 0-4.29 1.009-5.664 2.647L5.5 10.395A9.969 9.969 0 0112 7c2.477 0 4.73.901 6.5 2.395l-.835 1.252z"
              />
            </svg>
          </div>
          <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">
            No vehicles found
          </h3>
          <p className="mb-6 text-gray-500 dark:text-gray-400">
            We could not find any vehicles matching your current filters. Try
            adjusting your search criteria or clearing some filters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="my-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-50 p-4 dark:border-gray-600 dark:from-gray-800 dark:to-gray-700 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-app-button"></div>
              <span className="text-base font-semibold text-app-text dark:text-gray-200 sm:text-lg">
                <span className="text-app-button dark:text-app-button">
                  {paginationData.startIndex + 1}-{paginationData.endIndex}
                </span>
                <span className="mx-2 text-gray-500 dark:text-gray-400">
                  of
                </span>
                <span className="text-app-text dark:text-gray-200">
                  {paginationData.totalItems}
                </span>
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  vehicles found
                </span>
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <Select
              className="w-full min-w-0 flex-shrink rounded-xl border-slate-300 bg-white text-sm font-medium shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:w-auto sm:min-w-[130px]"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number.parseInt(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={3}>3 per page</option>
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
              <option value={12}>12 per page</option>
            </Select>
            <Select
              icon={GrSort}
              className="w-full min-w-0 flex-shrink rounded-xl border-slate-300 bg-white text-sm font-medium shadow-sm dark:border-gray-600 dark:bg-gray-700 sm:w-auto sm:min-w-[180px]"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="price-lh">{t("priceLowToHigh")}</option>
              <option value="price-hl">{t("priceHighToLow")}</option>
              <option value="model-latest">{t("modelLatest")}</option>
              <option value="model-oldest">{t("modelOldest")}</option>
              <option value="mileage-lh">{t("mileageLowToHigh")}</option>
              <option value="mileage-hl">{t("mileageHighToLow")}</option>
            </Select>
            <div className="flex justify-center sm:justify-start">
              <div className="flex rounded-xl border border-slate-300 bg-white p-1 shadow-sm dark:border-gray-600 dark:bg-gray-700">
                <button
                  onClick={() => setIsGridView(false)}
                  className={`rounded-lg p-2.5 transition-all duration-200 ${
                    !isGridView
                      ? "bg-app-button text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <FiList size={18} />
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`rounded-lg p-2.5 transition-all duration-200 ${
                    isGridView
                      ? "bg-app-button text-white shadow-md"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <FiGrid size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`gap-4 transition-opacity duration-200 ${
          isPageTransitioning ? "opacity-50" : "opacity-100"
        } ${isGridView ? "grid grid-cols-1 md:grid-cols-2" : "space-y-6"}`}
      >
        {paginationData.currentItems.map((car, index) => (
          <div key={car._id} className="relative">
            <Link href={`car-detail/${car.slug}`}>
              <div
                className={`group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800 ${
                  isGridView
                    ? "flex h-full flex-col"
                    : "mx-auto flex max-w-5xl flex-col sm:flex-row"
                }`}
              >
                {/* Image Section */}
                <div
                  className={`relative flex-shrink-0 ${isGridView ? "h-44 w-full" : "h-60 sm:h-64 sm:w-64 md:w-72"}`}
                >
                  <Carousel
                    slideInterval={3000}
                    className="h-full w-full overflow-hidden rounded-t-2xl sm:rounded-l-2xl sm:rounded-tr-none"
                  >
                    {Array.isArray(car.imageUrls) &&
                    car.imageUrls.length > 0 ? (
                      car.imageUrls.map((image, i) => (
                        <div key={i} className="relative h-full w-full">
                          <Image
                            src={image.src || image}
                            alt={
                              image.alt ||
                              `${car.make} ${car.model} Image ${i + 1}`
                            }
                            width={600}
                            height={400}
                            className="h-full w-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-100 dark:bg-gray-700">
                        <div className="text-center">
                          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-gray-600">
                            <svg
                              className="h-8 w-8 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-slate-500 dark:text-gray-400">
                            No images available
                          </span>
                        </div>
                      </div>
                    )}
                  </Carousel>

                  <div className="absolute left-0 top-0 z-10">
                    {!car.sold && (
                      <div className="relative h-16 w-16 overflow-hidden">
                        <div className="absolute left-[-18px] top-2 w-[75px] rotate-[-45deg] bg-app-button shadow-md">
                          <span className="block py-[2px] text-center text-[10px] font-bold uppercase text-white">
                            {(car.condition && car.condition !== "Select"
                              ? car.condition
                              : car.type || "Used"
                            ).substring(0, 4)}
                          </span>
                        </div>
                      </div>
                    )}

                    {car.sold && (
                      <div className="relative h-16 w-16 overflow-hidden">
                        <div className="absolute left-0 top-0 h-6 w-14 translate-x-[-8px] translate-y-[12px] -rotate-45 transform bg-red-500 shadow-md">
                          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold uppercase text-white">
                            SOLD
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Wishlist & Image Counter */}
                  <div className="absolute right-3 top-3 flex items-center gap-1.5">
                    {Array.isArray(car.imageUrls) &&
                      car.imageUrls.length > 1 && (
                        <div className="rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                          1/{car.imageUrls.length}
                        </div>
                      )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleLikeToggle(car._id);
                      }}
                      aria-label={
                        userLikedCars?.includes(car._id)
                          ? "Unlike Car"
                          : "Like Car"
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white hover:shadow-xl"
                    >
                      {userLikedCars &&
                      Array.isArray(userLikedCars) &&
                      userLikedCars.includes(car._id) ? (
                        <FaHeart className="h-4 w-4 text-red-500" />
                      ) : (
                        <FaRegHeart className="h-4 w-4 hover:text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Content Section */}
                <div
                  className={`flex flex-1 flex-col ${
                    isGridView ? "p-2.5 pb-14" : "p-5 pb-20 sm:p-6"
                  }`}
                >
                  {/* Header */}
                  <div
                    className={`flex items-start justify-between ${isGridView ? "mb-2" : "mb-4"}`}
                  >
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`line-clamp-1 font-bold text-app-text transition-colors group-hover/link:text-app-button dark:text-white dark:group-hover/link:text-app-button ${
                            isGridView
                              ? "text-base leading-tight"
                              : "text-xl sm:text-2xl"
                          }`}
                        >
                          {loading ? (
                            <Skeleton height={28} />
                          ) : (
                            `${car.make || "Unknown"} ${car.model || "Unknown"}`
                          )}
                        </h3>
                        {(car.year || car.modelYear) && (
                          <span
                            className={`inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 dark:bg-gray-700 dark:text-gray-300 ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {car.year || car.modelYear}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-app-button dark:text-app-button ${
                          isGridView ? "text-lg" : "text-2xl sm:text-3xl"
                        }`}
                      >
                        {loading ? (
                          <Skeleton height={32} width={120} />
                        ) : (
                          `${selectedCurrency?.symbol} ${Math.round(car.price) || 0}`
                        )}
                      </div>
                      <p
                        className={`mt-0.5 text-slate-500 dark:text-gray-400 ${isGridView ? "text-xs" : "text-xs"}`}
                      >
                        Starting price
                      </p>
                    </div>
                  </div>
                  {/* Key Specifications */}
                  <div className={`flex-1 ${isGridView ? "mb-2" : "mb-4"}`}>
                    <div
                      className={`grid gap-1.5 ${isGridView ? "grid-cols-2" : "grid grid-cols-2 lg:grid-cols-3"}`}
                    >
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-gray-700/50">
                        <div
                          className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-700/50 ${
                            isGridView ? "h-6 w-6" : "h-8 w-8"
                          }`}
                        >
                          <FaLocationCrosshairs
                            className={`text-app-button dark:text-app-button ${isGridView ? "h-3 w-3" : "h-4 w-4"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-gray-400 ${
                              isGridView ? "text-[9px]" : "text-[10px]"
                            }`}
                          >
                            Location
                          </p>
                          <p
                            className={`truncate font-semibold leading-tight text-app-text dark:text-white ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {car.location || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-gray-700/50">
                        <div
                          className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-700/50 ${
                            isGridView ? "h-6 w-6" : "h-8 w-8"
                          }`}
                        >
                          <IoSpeedometer
                            className={`text-app-button dark:text-app-button ${isGridView ? "h-3 w-3" : "h-4 w-4"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-gray-400 ${
                              isGridView ? "text-[9px]" : "text-[10px]"
                            }`}
                          >
                            Mileage
                          </p>
                          <p
                            className={`font-semibold leading-tight text-app-text dark:text-white ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {(() => {
                              const convertedValues = getConvertedValues(car);
                              return `${convertedValues.kms || "Not specified"} ${convertedValues.unit?.toUpperCase() || ""}`;
                            })()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-gray-700/50">
                        <div
                          className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-700/50 ${
                            isGridView ? "h-6 w-6" : "h-8 w-8"
                          }`}
                        >
                          <GiGasPump
                            className={`text-app-button dark:text-app-button ${isGridView ? "h-3 w-3" : "h-4 w-4"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-gray-400 ${
                              isGridView ? "text-[9px]" : "text-[10px]"
                            }`}
                          >
                            Fuel
                          </p>
                          <p
                            className={`font-semibold leading-tight text-app-text dark:text-white ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {car.fuelType || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-gray-700/50">
                        <div
                          className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-700/50 ${
                            isGridView ? "h-6 w-6" : "h-8 w-8"
                          }`}
                        >
                          <TbManualGearbox
                            className={`text-app-button dark:text-app-button ${isGridView ? "h-3 w-3" : "h-4 w-4"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-gray-400 ${
                              isGridView ? "text-[9px]" : "text-[10px]"
                            }`}
                          >
                            Gearbox
                          </p>
                          <p
                            className={`font-semibold leading-tight text-app-text dark:text-white ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {car.gearbox || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-gray-700/50">
                        <div
                          className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-700/50 ${
                            isGridView ? "h-6 w-6" : "h-8 w-8"
                          }`}
                        >
                          <IoIosColorPalette
                            className={`text-app-button dark:text-app-button ${isGridView ? "h-3 w-3" : "h-4 w-4"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-gray-400 ${
                              isGridView ? "text-[9px]" : "text-[10px]"
                            }`}
                          >
                            Color
                          </p>
                          <p
                            className={`font-semibold leading-tight text-app-text dark:text-white ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {car.color || "Not specified"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-2 dark:bg-gray-700/50">
                        <div
                          className={`flex flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-gray-700/50 ${
                            isGridView ? "h-6 w-6" : "h-8 w-8"
                          }`}
                        >
                          <GiCarSeat
                            className={`text-app-button dark:text-app-button ${isGridView ? "h-3 w-3" : "h-4 w-4"}`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`font-medium uppercase leading-tight tracking-wide text-slate-500 dark:text-gray-400 ${
                              isGridView ? "text-[9px]" : "text-[10px]"
                            }`}
                          >
                            Seats
                          </p>
                          <p
                            className={`font-semibold leading-tight text-app-text dark:text-white ${
                              isGridView ? "text-xs" : "text-xs"
                            }`}
                          >
                            {car.seats && car.seats !== "Select"
                              ? car.seats
                              : "Not specified"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                </div>
              </div>
            </Link>
            <div
              className={`absolute ${
                isGridView
                  ? "bottom-0 left-0 right-0 p-2.5"
                  : "sm:-bottom-5 -bottom-2 right-0 p-5 sm:p-6"
              }`}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedCar(car);
                  setOpenModal(true);
                }}
                className={`rounded-xl border-2 border-app-button bg-app-button font-semibold text-white shadow-lg transition-all duration-200 hover:border-app-button-hover hover:bg-app-button-hover hover:shadow-xl ${
                  isGridView ? "w-full px-2 py-2 text-sm" : "px-4 py-2"
                }`}
              >
                {t("enquireNow")}
              </button>
            </div>
          </div>
        ))}
      </div>
      {paginationData.totalPages > 1 && (
        <div className="mt-12 flex flex-col items-center gap-6">
          {/* Pagination Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing{" "}
              <span className="font-semibold text-app-text dark:text-white">
                {paginationData.startIndex + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-app-text dark:text-white">
                {paginationData.endIndex}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-app-text dark:text-white">
                {paginationData.totalItems}
              </span>{" "}
              results
            </p>
          </div>
          {/* Pagination Controls */}
          <div className="flex items-center justify-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!paginationData.hasPrevPage || isPageTransitioning}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                paginationData.hasPrevPage && !isPageTransitioning
                  ? "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
              }`}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Previous
            </button>
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {getVisiblePageNumbers().map((pageNum, index) => (
                <div key={index}>
                  {pageNum === "..." ? (
                    <span className="px-3 py-2 text-gray-500 dark:text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      disabled={isPageTransitioning}
                      className={`min-w-[40px] rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? "bg-app-button text-white shadow-lg hover:bg-app-button-hover"
                          : "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      } ${isPageTransitioning ? "cursor-not-allowed opacity-50" : ""}`}
                    >
                      {pageNum}
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!paginationData.hasNextPage || isPageTransitioning}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                paginationData.hasNextPage && !isPageTransitioning
                  ? "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  : "cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-500"
              }`}
            >
              Next
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          {/* Quick Jump */}
          {paginationData.totalPages > 10 && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Jump to page:
              </span>
              <input
                type="number"
                min="1"
                max={paginationData.totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Number.parseInt(e.target.value);
                  if (page >= 1 && page <= paginationData.totalPages) {
                    handlePageChange(page);
                  }
                }}
                className="w-16 rounded-lg border border-gray-300 px-2 py-1 text-center text-sm dark:border-gray-600 dark:bg-gray-800"
                disabled={isPageTransitioning}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                of {paginationData.totalPages}
              </span>
            </div>
          )}
        </div>
      )}
      {/* Enquiry Modal */}
      <Modal
        dismissible
        show={openModal}
        onClose={() => setOpenModal(false)}
        className="backdrop-blur-sm"
      >
        <ModalHeader className="border-b border-gray-200 pb-4 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-app-text dark:text-white">
            Get in Touch
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            We will get back to you within 24 hours
          </p>
        </ModalHeader>
        <ModalBody className="p-6">
          <form onSubmit={handleEnquirySubmit} className="space-y-6">
            {submitMessage && (
              <div
                className={`rounded-lg p-4 text-sm ${
                  submitMessage.includes("success")
                    ? "border border-green-200 bg-green-50 text-green-800"
                    : "border border-red-200 bg-red-50 text-red-800"
                }`}
              >
                {submitMessage}
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  First Name *
                </Label>
                <TextInput
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  className="rounded-xl border-gray-300 focus:border-app-button focus:ring-2 focus:ring-app-button"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Last Name *
                </Label>
                <TextInput
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  className="rounded-xl border-gray-300 focus:border-app-button focus:ring-2 focus:ring-app-button"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Email Address *
                </Label>
                <TextInput
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="rounded-xl border-gray-300 focus:border-app-button focus:ring-2 focus:ring-app-button"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Phone Number *
                </Label>
                <TextInput
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+92 300 1234567"
                  className="rounded-xl border-gray-300 focus:border-app-button focus:ring-2 focus:ring-app-button"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="message"
                  className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your requirements, budget, or any specific questions..."
                  className="resize-none rounded-xl border-gray-300 focus:border-app-button focus:ring-2 focus:ring-app-button"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-xl py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 ${
                  isSubmitting
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-gradient-to-r from-app-button to-app-button-hover hover:from-app-button-hover hover:to-app-button-hover hover:shadow-xl"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner size="sm" />
                    Sending...
                  </div>
                ) : (
                  "Send Enquiry"
                )}
              </button>
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default CardetailCard;
