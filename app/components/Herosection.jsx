"use client";
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useState, useEffect, useMemo, useCallback, useDeferredValue } from "react";
import axios from "axios";
import CarSearchHorizontal from "./car-search"
import { useRef } from "react";
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
import { useSidebar } from "../context/SidebarContext"; // Adjust path as needed
import Image from "next/image";

const FALLBACK_HEADING = "Premium Automotive Platform Built for Dealers";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
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

      const cacheData = {
        data,
        timestamp: Date.now(),
      };

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

// Axios instance with caching configuration
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=3600", // 1 hour cache
  },
});

// Add request interceptor for cache checking
apiClient.interceptors.request.use((config) => {
  const cachedData = CacheManager.get(CACHE_KEY);
  if (cachedData && config.url?.includes("/api/homepage")) {
    // Return cached data as a resolved promise
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

// Add response interceptor for caching
apiClient.interceptors.response.use(
  (response) => {
    // Cache successful API responses
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
  const [headingData, setHeadingData] = useState(FALLBACK_HEADING);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isContentVisible, setIsContentVisible] = useState(true);
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
const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
// const [isLoading, setIsLoading] = useState(true);
const [listingsDropdownOpen, setListingsDropdownOpen] = useState(false);
const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
const mountedRef = useRef(true);
const { isSidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const deferredHeading = useDeferredValue(headingData);

  const heroImage = "/autogrid.avif";


  const handleLogoError = useCallback(() => {
 setLogoError(true);
 setLogo("");
}, []);

const navigateToLogin = useCallback(() => {
 router.push("/login");
}, [router]);

// const navigateToLikedCars = useCallback(() => {
//  router.push("/liked-cars");
// }, [router]);

const handleMobileMenuOpen = useCallback(() => {
 setIsMobileMenuOpen(true);
}, []);

const handleMobileMenuClose = useCallback(() => {
 setIsMobileMenuOpen(false);
}, []);

const toggleDarkMode = useCallback(() => {
 const newDarkMode = !darkMode;
 setDarkMode(newDarkMode);
 
 // Persist preference
 localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
 
 // Apply immediately
 if (newDarkMode) {
   document.documentElement.classList.add("dark");
 } else {
   document.documentElement.classList.remove("dark");
 }
}, [darkMode]);

  // Enhanced data fetching with proper error handling and caching
  const fetchHomepageData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEY);
      if (cachedData?.searchSection?.mainHeading) {
        setHeadingData(cachedData.searchSection.mainHeading);
        setIsLoading(false);
        return;
      }

      const response = await apiClient.get("/api/homepage", {
        params: {
          timestamp: Date.now(), // Prevent browser caching conflicts
        },
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

      // Try to use stale cache data as fallback
      const staleCache = localStorage.getItem(CACHE_KEY);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data?.searchSection?.mainHeading) {
            setHeadingData(data.searchSection.mainHeading);
          }
        } catch (parseError) {
          console.warn("Failed to parse stale cache data:", parseError);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Image caching and optimization utilities
  const preloadAndCacheImage = useCallback(async (src) => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();

      img.onload = () => {
        setImageCached(true);
        resolve(img);
      };

      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };

      img.crossOrigin = "anonymous";
      img.src = src;
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const initializeData = async () => {
      if (!isMounted) return;

      // Use requestIdleCallback for better performance
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        requestIdleCallback(
          () => {
            if (isMounted) {
              timeoutId = setTimeout(() => fetchHomepageData(), 150);
            }
          },
          { timeout: 5000 },
        );
      } else {
        timeoutId = setTimeout(() => fetchHomepageData(), 300);
      }
    };

    initializeData();

    // Preload hero image for better caching
    if (typeof window !== "undefined") {
      preloadAndCacheImage(heroImage).catch(console.warn);
    }

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchHomepageData, preloadAndCacheImage, heroImage]);

  useEffect(() => {
  const fetchLogo = async () => {
    try {
      // Check cache first (reuse your existing CacheManager)
      const cachedData = CacheManager.get('header_settings');
      if (cachedData?.settings?.logo1) {
        setLogo(cachedData.settings.logo1);
        return;
      }

      // If no cache, fetch from API
      const response = await fetch("/api/settings/general");
      const data = await response.json();
      
      // Cache it (reuse your existing CacheManager)
      CacheManager.set('header_settings', data);
      setLogo(data?.settings?.logo1 || "");
    } catch (error) {
      console.error("Failed to fetch logo:", error);
    }
  };
  
  fetchLogo();
}, []);

  const features = useMemo(() => [
    "Premium Vehicle Selection",
    "Expert Professional Service", 
    "Competitive Market Pricing"
  ], []);

  const navigateToCarSale = useCallback(() => {
    router.push("/car-for-sale");
  }, [router]);

  const navigateToLikedCars = useCallback(() => {
    router.push("/liked-cars");
  }, [router]);

  const splitHeadingAfterTwoWords = useCallback((text) => {
    if (!text) return [{ text: FALLBACK_HEADING, style: "normal" }];

    const words = text.split(" ");
    if (words.length <= 2) {
      return [{ text, style: "normal" }];
    }

    const firstTwoWords = words.slice(0, 2).join(" ");
    const nextTwoWords = words.slice(2, 4).join(" ");
    const remainingWords = words.slice(4).join(" ");

    const parts = [
      { text: firstTwoWords + " ", style: "normal" },
      { text: nextTwoWords, style: "gradient" },
    ];

    if (remainingWords) {
      parts.push({ text: " " + remainingWords, style: "normal" });
    }

    return parts;
  }, []);

  const renderStyledParts = useCallback((parts) => {
    return parts.map((part, index) => {
      switch (part.style) {
        case 'gradient':
          return (
            <span 
              key={index} 
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-sm"
            >
              {part.text}
            </span>
          );
        default:
          return (
            <span key={index} className="text-white drop-shadow-lg">
              {part.text}
            </span>
          );
      }
    });
  }, []);

  const getResponsiveTextSize = useCallback((text) => {
    if (!text) return "text-4xl sm:text-5xl lg:text-6xl";

    const length = text.length;
    if (length < 40) return "text-4xl sm:text-5xl lg:text-6xl xl:text-7xl";
    if (length < 80) return "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl";
    return "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl";
  }, []);

  const textParts = useMemo(
    () => splitHeadingAfterTwoWords(deferredHeading),
    [deferredHeading, splitHeadingAfterTwoWords],
  );

  const textSizeClass = useMemo(
    () => getResponsiveTextSize(deferredHeading),
    [deferredHeading, getResponsiveTextSize],
  );

  const processedHeading = useMemo(() => {
    if (!headingData && !isLoading) return null;

    return (
      <h1 className={`font-bold leading-tight ${textSizeClass} ${isLoading ? "opacity-75" : "opacity-100"}`}>
        {renderStyledParts(textParts)}
      </h1>
    );
  }, [headingData, isLoading, textSizeClass, renderStyledParts, textParts]);

  const HeadingSkeleton = useMemo(() => (
    <div className="w-full max-w-4xl space-y-4">
      <div className="h-12 animate-pulse rounded-lg bg-white/20 backdrop-blur-sm sm:h-16 lg:h-20"></div>
      <div className="mx-auto h-12 w-3/4 animate-pulse rounded-lg bg-white/20 backdrop-blur-sm sm:h-16 lg:h-20"></div>
    </div>
  ), []);

  const handleImageError = useCallback((e) => {
    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23111827;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23374151;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1920' height='1080' fill='url(%23grad)'/%3E%3Ctext x='960' y='540' font-family='Arial' font-size='48' fill='%23ffffff' text-anchor='middle' dy='.3em'%3EPremium Automotive Platform%3C/text%3E%3C/svg%3E";
  }, []);

  return (
    <>
   <section className="relative w-full h-[87vh] overflow-hidden">
  {/* Header inside hero section */}
  <nav className="absolute top-0 left-0 right-0 z-40 bg-white/10 backdrop-blur-lg border-b border-white/20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-4">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}>
            {logo && !logoError ? (
              <>
                <div style={{ width: '48px', height: '48px', position: 'relative' }}>
                  <Image
                    src={logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                    onError={handleLogoError}
                    priority
                    sizes="48px"
                  />
                </div>
                <div className="flex ml-2 flex-col">
                  <span className="bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-lg font-bold tracking-tight text-transparent">
                    WindScreen
                  </span>
                  <span className="text-xs font-medium text-white/80 group-hover:text-red-400 transition-colors duration-300">
                    Built to Sell Cars
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col">
                <span className="bg-gradient-to-r from-white via-red-400 to-white bg-clip-text text-lg font-bold tracking-tight text-transparent">
                  WindScreen
                </span>
                <span className="text-xs font-medium text-white/80 group-hover:text-red-400 transition-colors duration-300">
                  Built to Sell Cars
                </span>
              </div>
            )}
          </div>
        </Link>
        
        {/* Desktop Navigation Links */}
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
                  <Link href="/car-for-sale" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-red-400 transition-colors duration-200">
                    Cars for Sale
                  </Link>
                  <Link href="/cars/leasing" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-red-400 transition-colors duration-200">
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
                  <Link href="/about" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-red-400 transition-colors duration-200">
                    About
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-red-400 transition-colors duration-200">
                    Contact
                  </Link>
                  <Link href="/blogs" className="block px-4 py-2 text-sm text-white/90 hover:bg-white/10 hover:text-red-400 transition-colors duration-200">
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
              <FaHeart className="h-5 w-5 text-white/90 transition-colors duration-300 group-hover:text-red-400" />
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

  {/* Existing hero content */}
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

  {/* Decorative elements */}
  <div className="absolute bottom-10 left-10 h-20 w-20 rounded-full bg-red-500/20 backdrop-blur-sm opacity-60 animate-pulse"></div>
  <div className="absolute top-20 right-20 h-16 w-16 rounded-full bg-red-400/20 backdrop-blur-sm opacity-40 animate-pulse"></div>
  
  <div className="absolute inset-0 opacity-5 z-5">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(255,255,255)_1px,transparent_0)] bg-[size:50px_50px]"></div>
  </div>
</section>
<CarSearchHorizontal/>
</>
  );
};

export default HeroSection;











      {/* <div className="relative z-10 mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-screen items-center py-16 mt-6">
          <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            
            <div className={`lg:col-span-7 xl:col-span-6 space-y-8 lg:space-y-10 transition-all duration-1000 ${
              isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              
              <div className="inline-flex items-center space-x-2 rounded-full border border-red-400/30 bg-red-500/10 backdrop-blur-sm px-4 py-2 text-sm font-medium text-red-300">
                <FaCar className="h-4 w-4" />
                <span>Professional Automotive Solutions</span>
              </div>

              <div className="space-y-6">
                {isLoading ? (
                  HeadingSkeleton
                ) : (
                  processedHeading || (
                    <h1 className="text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                      Premium{" "}
                      <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent drop-shadow-sm">
                        Automotive Platform
                      </span>{" "}
                      Built for Dealers
                    </h1>
                  )
                )}
              </div>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div 
                    key={feature}
                    className={`flex items-center space-x-3 transition-all duration-700 ${
                      isContentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    <FaCheckCircle className="h-5 w-5 text-red-400 drop-shadow-sm" />
                    <span className="text-gray-200 font-medium drop-shadow-sm">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`lg:col-span-5 xl:col-span-6 flex flex-col items-center justify-center space-y-6 lg:items-end transition-all duration-1000 ${
              isContentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              
              <div className="flex flex-col gap-4 w-full max-w-sm lg:max-w-none">
                <button
                  onClick={navigateToCarSale}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-8 py-4 text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-4 focus:ring-red-500/50 backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-red-600/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative flex items-center justify-center">
                    <span className="mr-3">Browse Vehicles</span>
                    <FaArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </button>

                <button
                  onClick={navigateToLikedCars}
                  className="group relative overflow-hidden rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-md px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:scale-105 hover:border-red-400/50 hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative flex items-center justify-center">
                    <span className="mr-3">View Favorites</span>
                    <FaArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full max-w-sm lg:max-w-none mt-8">
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                  <div className="text-2xl font-bold text-white">20+</div>
                  <div className="text-sm text-gray-300">Search filters</div>
                </div>
                <div className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-center">
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-300">Expert Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}