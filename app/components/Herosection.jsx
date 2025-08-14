"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaCalculator,
  FaHandshake,
  FaSun,
  FaMoon,
  FaUser,
} from "react-icons/fa";
import { useSidebar } from "../context/SidebarContext";
import Image from "next/image";

const CacheManager = {
  get: (key) => {
    try {
      if (typeof window === "undefined") return null;
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      if (now - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      return data;
    } catch (error) {
      console.warn("Cache retrieval failed:", error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      if (typeof window === "undefined") return;
      const cacheData = { data, timestamp: Date.now() };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn("Cache storage failed:", error);
    }
  },

  clear: (key) => {
    try {
      if (typeof window === "undefined") return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn("Cache clear failed:", error);
    }
  },
};

const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600",
  },
});

apiClient.interceptors.request.use((config) => {
  const cachedData = CacheManager.get(CACHE_KEY);
  if (cachedData && config.url?.includes("/api/homepage")) {
    config.adapter = () =>
      Promise.resolve({
        data: cachedData,
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        request: {},
      });
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.config.url?.includes("/api/homepage") &&
      response.status === 200
    ) {
      CacheManager.set(CACHE_KEY, response.data);
    }
    return response;
  },
  (error) => {
    console.error("API request failed:", error.message);
    return Promise.reject(error);
  },
);

const HeroSection = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [imageCached, setImageCached] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [topSettings, setTopSettings] = useState({
    hideDarkMode: false,
    hideFavourite: false,
    hideLogo: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const mountedRef = useRef(true);
  const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();
  const [carSearchData, setCarSearchData] = useState(null);
  const [carSearchLoading, setCarSearchLoading] = useState(false);
  const [carSearchMakes, setCarSearchMakes] = useState([]);
  const [carSearchModels, setCarSearchModels] = useState([]);
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const idPrefix = useRef(Date.now().toString(36)).current;

  const heroImage = "/autogrid.avif";

  const handleLogoError = useCallback(() => {
    setLogoError(true);
    setLogo("");
  }, []);

  const navigateToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  const navigateToLikedCars = useCallback(() => {
    router.push("/liked-cars");
  }, [router]);

  const handleMobileMenuOpen = useCallback(() => {
    setIsMobileMenuOpen(true);
  }, []);

  const handleMobileMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const fetchCarSearchData = useCallback(async () => {
    try {
      setCarSearchLoading(true);
      const response = await fetch("/Vehicle make and model data (2).json");
      const data = await response.json();
      setCarSearchData(data.Sheet1);
      const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))];
      setCarSearchMakes(uniqueMakes);
    } catch (error) {
      console.error("Error loading vehicle data:", error);
    } finally {
      setCarSearchLoading(false);
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    // Persist preference
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");

    // Apply immediately
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const preloadAndCacheImage = useCallback(async (src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        setImageCached(true);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.crossOrigin = "anonymous";
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const cachedData = CacheManager.get("header_settings");
        if (cachedData?.settings?.logo1) {
          setLogo(cachedData.settings.logo1);
          return;
        }
        const response = await fetch("/api/settings/general");
        const data = await response.json();
        CacheManager.set("header_settings", data);
        setLogo(data?.settings?.logo1 || "");
      } catch (error) {
        console.error("Failed to fetch logo:", error);
      }
    };
    fetchLogo();
  }, []);

  useEffect(() => {
    if (selectedMake && carSearchData) {
      const makeData = carSearchData.find(
        (item) => item.Maker === selectedMake,
      );
      if (makeData && makeData["model "]) {
        const modelArray = makeData["model "]
          .split(",")
          .map((model) => model.trim());
        setCarSearchModels(modelArray);
      } else {
        setCarSearchModels([]);
      }
      setSelectedModel("");
    }
  }, [selectedMake, carSearchData]);

  const handleCarSearch = useCallback(async () => {
    if (!selectedMake && !maxPrice && !location) {
      alert("Please select at least one search criterion.");
      return;
    }

    try {
      const queryParams = [];
      if (selectedMake)
        queryParams.push(`make=${encodeURIComponent(selectedMake)}`);
      if (selectedModel)
        queryParams.push(`model=${encodeURIComponent(selectedModel)}`);
      if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
      if (location)
        queryParams.push(`location=${encodeURIComponent(location)}`);
      if (selectedCondition !== "all")
        queryParams.push(`condition=${encodeURIComponent(selectedCondition)}`);

      const queryString = queryParams.join("&");
      router.push(`/car-for-sale?${queryString}`);
    } catch (error) {
      console.error("Error searching cars:", error);
      alert("An error occurred. Please try again.");
    }
  }, [
    selectedMake,
    selectedModel,
    maxPrice,
    location,
    selectedCondition,
    router,
  ]);

  const handleImageError = useCallback((e) => {
    e.target.src =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3Ctext x='960' y='540' font-family='Arial' font-size='48' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EPremium Automotive Platform%3C/text%3E%3C/svg%3E";
  }, []);

  const ConditionTab = ({ condition, label, selected, onClick }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        console.log(`Clicking ${condition} tab`);
        onClick();
      }}
      className={`relative cursor-pointer border-b-2 px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 ${
        selected
          ? "border-green-600 bg-white font-semibold text-green-600 dark:border-green-400 dark:bg-gray-800 dark:text-green-400"
          : "border-transparent bg-gray-50 text-gray-600 hover:border-green-600/30 hover:bg-white hover:text-green-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:border-green-400/30 dark:hover:bg-gray-800 dark:hover:text-green-400"
      }`}
    >
      {label}
      {selected && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 dark:bg-green-400"></div>
      )}
    </button>
  );
  return (
    <>
      <section className="relative h-[87vh] w-full overflow-hidden">
        <nav className="absolute left-0 right-0 top-0 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
            <div className="flex h-16 items-center justify-between">
              <Link href="/" className="group flex items-center space-x-3">
                <div className="flex min-h-[48px] items-center">
                  {logo && !logoError ? (
                    <div className="relative h-16 w-16">
                      <Image
                        src={logo}
                        alt="Logo"
                        fill
                        className="object-contain"
                        onError={handleLogoError}
                        priority
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-xl border-2 border-dashed bg-gray-200" />
                  )}
                </div>
              </Link>

              <div className="hidden items-center space-x-6 lg:flex">
                <div
                  className="group relative"
                  onMouseEnter={() => setListingsDropdownOpen(true)}
                  onMouseLeave={() => setListingsDropdownOpen(false)}
                >
                  <button className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95">
                    <span>Listings</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${listingsDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {listingsDropdownOpen && (
                    <div className="absolute left-0 top-full z-50 w-48 rounded-lg border border-white/20 bg-black/80 shadow-lg backdrop-blur-lg">
                      <div className="py-2">
                        <Link
                          href="/car-for-sale"
                          className="block px-4 py-2 text-sm text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-green-400"
                        >
                          Cars for Sale
                        </Link>
                        <Link
                          href="/cars/leasing"
                          className="block px-4 py-2 text-sm text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-green-400"
                        >
                          Lease Deals
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className="group relative"
                  onMouseEnter={() => setPagesDropdownOpen(true)}
                  onMouseLeave={() => setPagesDropdownOpen(false)}
                >
                  <button className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95">
                    <span>Pages</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-300 ${pagesDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {pagesDropdownOpen && (
                    <div className="absolute left-0 top-full z-50 w-48 rounded-lg border border-white/20 bg-black/80 shadow-lg backdrop-blur-lg">
                      <div className="py-2">
                        <Link
                          href="/about"
                          className="block px-4 py-2 text-sm text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-green-400"
                        >
                          About
                        </Link>
                        <Link
                          href="/contact"
                          className="block px-4 py-2 text-sm text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-green-400"
                        >
                          Contact
                        </Link>
                        <Link
                          href="/blogs"
                          className="block px-4 py-2 text-sm text-white/90 transition-colors duration-200 hover:bg-white/10 hover:text-green-400"
                        >
                          Blogs
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                <Link
                  href="/cars/valuation"
                  className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95"
                >
                  <FaCalculator className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Car valuation</span>
                </Link>

                <Link
                  href="/cars/about-us"
                  className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95"
                >
                  <FaHandshake className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Vehicle Services</span>
                </Link>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={navigateToLogin}
                  aria-label="Login"
                  className="hidden items-center space-x-2 rounded-xl bg-white/10 px-4 py-3 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white focus:outline-none lg:flex"
                >
                  <FaUser className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </button>

                <button
                  onClick={handleMobileMenuOpen}
                  aria-label="Open Menu"
                  className="group relative rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none lg:hidden"
                >
                  <svg
                    className="h-5 w-5 text-white/90 transition-colors duration-300 group-hover:text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>

                {!topSettings.hideFavourite && (
                  <button
                    onClick={navigateToLikedCars}
                    aria-label="Liked Cars"
                    className="group relative hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none md:flex"
                  >
                    <FaHeart className="h-5 w-5 text-white/90 transition-colors duration-300 group-hover:text-green-400" />
                  </button>
                )}

                {!topSettings.hideDarkMode && (
                  <button
                    onClick={toggleDarkMode}
                    className="group relative rounded-xl bg-white/10 p-3 text-white/90 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20"
                    aria-label="Toggle dark mode"
                  >
                    {darkMode ? (
                      <FaSun className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <FaMoon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Premium Vehicle Showcase"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={90}
            onError={handleImageError}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30"></div>
          <div className="absolute inset-0 bg-gray-900/20 dark:bg-gray-900/40"></div>
        </div>

        <div className="absolute bottom-10 left-10 h-20 w-20 animate-pulse rounded-full bg-green-500/20 opacity-60 backdrop-blur-sm"></div>
        <div className="absolute right-20 top-20 h-16 w-16 animate-pulse rounded-full bg-green-400/20 opacity-40 backdrop-blur-sm"></div>

        <div className="z-5 absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255,255,255)_1px,transparent_0)] bg-[size:50px_50px]"></div>
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-start pr-8">
              <div className="text-left">
                <h1 className="mb-4 text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                  Find your
                  <br />
                  <span className="text-green-400">perfect vehicle</span>
                </h1>
                <p className="max-w-md text-lg text-white/90">
                  Discover premium cars with unmatched quality and service
                </p>
              </div>
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={handleMobileMenuClose}
            ></div>
            <div className="fixed right-0 top-0 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 dark:bg-gray-900">
              <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Menu
                  </h2>
                  <button onClick={handleMobileMenuClose} className="p-2">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <nav className="space-y-4">
                  <Link
                    href="/car-for-sale"
                    onClick={handleMobileMenuClose}
                    className="block py-2 text-gray-900 dark:text-white"
                  >
                    Cars for Sale
                  </Link>
                  <Link
                    href="/cars/leasing"
                    onClick={handleMobileMenuClose}
                    className="block py-2 text-gray-900 dark:text-white"
                  >
                    Lease Deals
                  </Link>
                  <Link
                    href="/about"
                    onClick={handleMobileMenuClose}
                    className="block py-2 text-gray-900 dark:text-white"
                  >
                    About
                  </Link>
                  <Link
                    href="/contact"
                    onClick={handleMobileMenuClose}
                    className="block py-2 text-gray-900 dark:text-white"
                  >
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="relative -top-24 -mb-24 mx-auto w-full max-w-6xl px-4">
        <div
          className={`rounded-xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="flex justify-center rounded-t-xl border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700">
            <ConditionTab
              condition="all"
              label="All Condition"
              selected={selectedCondition === "all"}
              onClick={() => setSelectedCondition("all")}
            />
            <ConditionTab
              condition="new"
              label="New"
              selected={selectedCondition === "new"}
              onClick={() => setSelectedCondition("new")}
            />
            <ConditionTab
              condition="used"
              label="Used"
              selected={selectedCondition === "used"}
              onClick={() => setSelectedCondition("used")}
            />
          </div>
          <div className="p-6 dark:bg-gray-700">
            <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <label
                  htmlFor={`${idPrefix}-make`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Make
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-make`}
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    disabled={carSearchLoading}
                  >
                    <option value="">Select Make</option>
                    {carSearchMakes.map((make, index) => (
                      <option key={index} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                  {carSearchLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`${idPrefix}-model`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Model
                </label>
                <select
                  id={`${idPrefix}-model`}
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:bg-gray-600"
                  disabled={!selectedMake || carSearchLoading}
                >
                  <option value="">Select Model</option>
                  {carSearchModels.map((model, index) => (
                    <option key={index} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`${idPrefix}-price`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Max Price
                </label>
                <input
                  id={`${idPrefix}-price`}
                  type="number"
                  placeholder="Enter max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor={`${idPrefix}-location`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Location
                </label>
                <input
                  id={`${idPrefix}-location`}
                  type="text"
                  placeholder="Enter a location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 transition-colors duration-200 focus:border-green-500 focus:ring-2 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <button
                  onClick={handleCarSearch}
                  className="flex w-full items-center justify-center rounded-md bg-green-600 px-6 py-3 font-medium text-white transition-all duration-200 hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
