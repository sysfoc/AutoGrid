"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useCallback, useDeferredValue, useRef } from "react";
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

const FALLBACK_HEADING = "Premium Automotive Platform Built for Dealers";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = "homepage_data";

// Cache utilities
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

// Axios instance
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
  }
);

const HeroSection = () => {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const [headingData, setHeadingData] = useState(FALLBACK_HEADING);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageCached, setImageCached] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [logo, setLogo] = useState("");
  const [logoError, setLogoError] = useState(false);
  const [topSettings, setTopSettings] = useState({
    hideDarkMode: false,
    hideFavourite: false,
    hideLogo: false,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false);
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

  const deferredHeading = useDeferredValue(headingData);
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

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Fetch homepage data
  const fetchHomepageData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData?.searchSection?.mainHeading) {
        setHeadingData(cachedData.searchSection.mainHeading);
        setIsLoading(false);
        return;
      }

      const response = await apiClient.get("/api/homepage", {
        params: { timestamp: Date.now() },
      });

      if (
        response.data?.searchSection?.mainHeading &&
        response.data.searchSection.mainHeading !== FALLBACK_HEADING
      ) {
        setHeadingData(response.data.searchSection.mainHeading);
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
      setError(error.message);
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data?.searchSection?.mainHeading) {
            setHeadingData(data.searchSection.mainHeading);
          }
        } catch (parseError) {
          console.warn("Failed to parse stale cache:", parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch car data for search
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

  // Preload images
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
    fetchHomepageData();
    fetchCarSearchData();
    
    if (typeof window !== "undefined") {
      preloadAndCacheImage(heroImage).catch(console.warn);
      const savedTheme = localStorage.getItem("theme");
      setDarkMode(savedTheme === "dark");
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      }
    }
  }, [fetchHomepageData, fetchCarSearchData, preloadAndCacheImage, heroImage]);

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
      const makeData = carSearchData.find((item) => item.Maker === selectedMake);
      if (makeData && makeData["model "]) {
        const modelArray = makeData["model "].split(",").map((model) => model.trim());
        setCarSearchModels(modelArray);
      } else {
        setCarSearchModels([]);
      }
      setSelectedModel("");
    }
  }, [selectedMake, carSearchData]);

  // Car search functions
  const handleCarSearch = useCallback(async () => {
    if (!selectedMake && !maxPrice && !location) {
      alert("Please select at least one search criterion.");
      return;
    }

    try {
      const queryParams = [];
      if (selectedMake) queryParams.push(`make=${encodeURIComponent(selectedMake)}`);
      if (selectedModel) queryParams.push(`model=${encodeURIComponent(selectedModel)}`);
      if (maxPrice) queryParams.push(`maxPrice=${maxPrice}`);
      if (location) queryParams.push(`location=${encodeURIComponent(location)}`);
      if (selectedCondition !== "all") queryParams.push(`condition=${encodeURIComponent(selectedCondition)}`);
      
      const queryString = queryParams.join("&");
      router.push(`/car-for-sale?${queryString}`);
    } catch (error) {
      console.error("Error searching cars:", error);
      alert("An error occurred. Please try again.");
    }
  }, [selectedMake, selectedModel, maxPrice, location, selectedCondition, router]);

  // Hero section rendering utilities
  const splitHeadingAfterTwoWords = useCallback((text) => {
    if (!text) return [{ text: FALLBACK_HEADING, style: "normal" }];
    const words = text.split(" ");
    if (words.length <= 2) return [{ text, style: "normal" }];

    const firstTwoWords = words.slice(0, 2).join(" ");
    const nextTwoWords = words.slice(2, 4).join(" ");
    const remainingWords = words.slice(4).join(" ");

    return [
      { text: firstTwoWords + " ", style: "normal" },
      { text: nextTwoWords, style: "gradient" },
      ...(remainingWords ? [{ text: " " + remainingWords, style: "normal" }] : []),
    ];
  }, []);

  const renderStyledParts = useCallback((parts) => {
    return parts.map((part, index) => {
      if (part.style === "gradient") {
        return (
          <span 
            key={index} 
            className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent drop-shadow-sm"
          >
            {part.text}
          </span>
        );
      }
      return (
        <span key={index} className="text-white drop-shadow-lg">
          {part.text}
        </span>
      );
    });
  }, []);

  const getResponsiveTextSize = useCallback((text) => {
    if (!text) return "text-4xl sm:text-5xl lg:text-6xl";
    if (text.length < 40) return "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl";
    if (text.length < 80) return "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl";
    return "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl";
  }, []);

  const textParts = useMemo(
    () => splitHeadingAfterTwoWords(deferredHeading),
    [deferredHeading, splitHeadingAfterTwoWords]
  );

  const textSizeClass = useMemo(
    () => getResponsiveTextSize(deferredHeading),
    [deferredHeading, getResponsiveTextSize]
  );

  const processedHeading = useMemo(() => {
    if (!headingData && !isLoading) return null;
    return (
      <h1 className={`font-bold leading-tight ${textSizeClass} ${isLoading ? "opacity-75" : "opacity-100"}`}>
        {renderStyledParts(textParts)}
      </h1>
    );
  }, [headingData, isLoading, textSizeClass, renderStyledParts, textParts]);

  const handleImageError = useCallback((e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3Ctext x='960' y='540' font-family='Arial' font-size='48' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EPremium Automotive Platform%3C/text%3E%3C/svg%3E";
  }, []);

  // Condition Tab Component
  const ConditionTab = ({ condition, label, selected, onClick }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
        selected
          ? "text-green-600 dark:text-green-400 border-green-600 dark:border-green-400 bg-white dark:bg-gray-800"
          : "text-gray-600 dark:text-gray-300 border-transparent hover:text-green-600 dark:hover:text-green-400 hover:border-green-600/30 dark:hover:border-green-400/30 bg-gray-50 dark:bg-gray-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <section className="relative w-full h-[87vh] overflow-hidden">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="min-h-[48px] flex items-center">
                  {logo && !logoError ? (
                    <div className="w-16 h-16 relative">
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
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  )}
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden items-center space-x-6 lg:flex">
                {/* Listings Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setListingsDropdownOpen(true)}
                  onMouseLeave={() => setListingsDropdownOpen(false)}
                >
                  <button className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95">
                    <span>Listings</span>
                    <svg className={`h-4 w-4 transition-transform duration-300 ${listingsDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {listingsDropdownOpen && (
                    <div className="absolute top-full left-0 w-48 bg-black/80 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 z-50">
                      <div className="py-2">
                        <Link href="/car-for-sale" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-green-400 transition-colors duration-200">
                          Cars for Sale
                        </Link>
                        <Link href="/cars/leasing" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-green-400 transition-colors duration-200">
                          Lease Deals
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pages Dropdown */}
                <div 
                  className="relative group"
                  onMouseEnter={() => setPagesDropdownOpen(true)}
                  onMouseLeave={() => setPagesDropdownOpen(false)}
                >
                  <button className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95">
                    <span>Pages</span>
                    <svg className={`h-4 w-4 transition-transform duration-300 ${pagesDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {pagesDropdownOpen && (
                    <div className="absolute top-full left-0 w-48 bg-black/80 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 z-50">
                      <div className="py-2">
                        <Link href="/about" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-green-400 transition-colors duration-200">
                          About
                        </Link>
                        <Link href="/contact" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-green-400 transition-colors duration-200">
                          Contact
                        </Link>
                        <Link href="/blogs" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-green-400 transition-colors duration-200">
                          Blogs
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Car Valuation */}
                <Link href="/cars/valuation" className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95">
                  <FaCalculator className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Car valuation</span>
                </Link>

                {/* Vehicle Services */}
                <Link href="/cars/about-us" className="group flex items-center space-x-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white/90 transition-all duration-300 hover:bg-white/10 hover:text-white hover:shadow-lg active:scale-95">
                  <FaHandshake className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>Vehicle Services</span>
                </Link>
              </div>
              
              {/* Right side buttons */}
              <div className="flex items-center space-x-3">
                {/* Login Button */}
                <button
                  onClick={navigateToLogin}
                  aria-label="Login"
                  className="hidden items-center space-x-2 rounded-xl bg-white/10 backdrop-blur-sm px-4 py-3 text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:text-white focus:outline-none lg:flex"
                >
                  <FaUser className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </button>

                {/* Mobile Menu Toggle */}
                <button
                  onClick={handleMobileMenuOpen}
                  aria-label="Open Menu"
                  className="group relative rounded-xl bg-white/10 backdrop-blur-sm p-3 transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none lg:hidden"
                >
                  <svg className="h-5 w-5 text-white/90 transition-colors duration-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                {/* Liked Cars Button */}
                {!topSettings.hideFavourite && (
                  <button
                    onClick={navigateToLikedCars}
                    aria-label="Liked Cars"
                    className="group relative hidden rounded-xl bg-white/10 backdrop-blur-sm p-3 transition-all duration-300 hover:scale-105 hover:bg-white/20 focus:outline-none md:flex"
                  >
                    <FaHeart className="h-5 w-5 text-white/90 transition-colors duration-300 group-hover:text-green-400" />
                  </button>
                )}
                
                {/* Dark Mode Toggle */}
                {!topSettings.hideDarkMode && (
                  <button
                    onClick={toggleDarkMode}
                    className="group relative rounded-xl bg-white/10 backdrop-blur-sm p-3 text-white/90 transition-all duration-300 hover:scale-105 hover:bg-white/20"
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

        {/* Hero Background */}
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

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl">
            {processedHeading || (
              <div className="w-full max-w-4xl space-y-4">
                <div className="h-12 animate-pulse rounded-lg bg-white/20 backdrop-blur-sm sm:h-16 lg:h-20"></div>
                <div className="mx-auto h-12 w-3/4 animate-pulse rounded-lg bg-white/20 backdrop-blur-sm sm:h-16 lg:h-20"></div>
              </div>
            )}
            
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {["Premium Vehicle Selection", "Expert Professional Service", "Competitive Market Pricing"].map((feature, idx) => (
                <div key={idx} className="flex items-center rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-400"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => router.push("/car-for-sale")}
                className="rounded-xl bg-green-600 px-8 py-4 font-medium text-white transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-500/20 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Browse Inventory
              </button>
              <button
                onClick={() => router.push("/cars/valuation")}
                className="rounded-xl bg-white/20 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:shadow-lg hover:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
              >
                Get Valuation
              </button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-green-500/20 backdrop-blur-sm opacity-60 animate-pulse"></div>
        <div className="absolute top-20 right-20 h-16 w-16 rounded-full bg-green-400/20 backdrop-blur-sm opacity-40 animate-pulse"></div>
        
        <div className="absolute inset-0 opacity-5 z-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255,255,255)_1px,transparent_0)] bg-[size:50px_50px]"></div>
        </div>
      </section>

      {/* Integrated Car Search */}
      <div className="relative -top-16 mx-auto w-full max-w-6xl px-4">
        <div className={`rounded-xl shadow-xl ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          {/* Condition Tabs */}
          <div className="flex justify-center border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-xl">
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

          {/* Search Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
              {/* Make Selection */}
              <div className="space-y-2">
                <label htmlFor={`${idPrefix}-make`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Make
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-make`}
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
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

              {/* Model Selection */}
              <div className="space-y-2">
                <label htmlFor={`${idPrefix}-model`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Model
                </label>
                <select
                  id={`${idPrefix}-model`}
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200 disabled:bg-gray-100 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
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

              {/* Max Price Input */}
              <div className="space-y-2">
                <label htmlFor={`${idPrefix}-price`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Max Price
                </label>
                <input
                  id={`${idPrefix}-price`}
                  type="number"
                  placeholder="Enter max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>

              {/* Location Input */}
              <div className="space-y-2">
                <label htmlFor={`${idPrefix}-location`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Location
                </label>
                <input
                  id={`${idPrefix}-location`}
                  type="text"
                  placeholder="Enter a location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                />
              </div>

              {/* Search Button */}
              <div>
                <button
                  onClick={handleCarSearch}
                  className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
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