"use client";

import Link from "next/link";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import LanguageSwitching from "../components/LanguageSwitching";
import { useTranslations } from "next-intl";
import { iconComponentsMap, allSocialPlatforms } from "../lib/social-icons";

const CACHE_DURATION = 5 * 60 * 1000;
const CACHE_KEYS = {
  FOOTER_SETTINGS: 'footer_settings',
  HOMEPAGE_DATA: 'footer_homepage',
  SOCIAL_MEDIA: 'footer_socials'
};

const CacheManager = {
  get: (key) => {
    try {
      if (typeof window === 'undefined') return null;
      
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
      console.warn('Cache retrieval failed for key:', key, error);
      return null;
    }
  },

  set: (key, data) => {
    try {
      if (typeof window === 'undefined') return;
      
      const cacheData = {
        data,
        timestamp: Date.now()
      };
      
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache storage failed for key:', key, error);
    }
  },

  clear: (key) => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Cache clear failed for key:', key, error);
    }
  }
};

const DEFAULT_FOOTER_SETTINGS = {
  col1Heading: null,
  col2Heading: null,
  col3Heading: null,
};

const DEFAULT_HOMEPAGE_DATA = {
  monday: null,
  tuesday: null,
  wednesday: null,
  thursday: null,
  friday: null,
  saturday: null,
};

const Footerr = () => {
  const t = useTranslations("Footer");
  const mountedRef = useRef(true);

  const [footerSettings, setFooterSettings] = useState(DEFAULT_FOOTER_SETTINGS);
  const [logo, setLogo] = useState("");
  const [logoLoading, setLogoLoading] = useState(true);
  const [homepageData, setHomepageData] = useState(DEFAULT_HOMEPAGE_DATA);
  const [fetchedSocials, setFetchedSocials] = useState([]);

  const tradingHours = useMemo(() => [
    { day: t("monday"), hours: homepageData?.monday || t("openingHours") },
    { day: t("tuesday"), hours: homepageData?.tuesday || t("openingHours") },
    { day: t("wednesday"), hours: homepageData?.wednesday || t("openingHours") },
    { day: t("thursday"), hours: homepageData?.thursday || t("openingHours") },
    { day: t("friday"), hours: homepageData?.friday || t("openingHours") },
    { day: t("saturday"), hours: homepageData?.saturday || t("closedHours") },
    { day: t("sunday"), hours: t("closedHours") },
  ], [homepageData, t]);

  const fetchHomepageData = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const cachedData = CacheManager.get(CACHE_KEYS.HOMEPAGE_DATA);
      if (cachedData) {
        setHomepageData(cachedData);
        return;
      }

      const res = await fetch("/api/homepage", { 
        next: { revalidate: 300 }
      });

      if (!res.ok) throw new Error('Homepage fetch failed');
      
      const data = await res.json();
      const footerData = data?.footer || DEFAULT_HOMEPAGE_DATA;
      
      if (mountedRef.current) {
        setHomepageData(footerData);
        CacheManager.set(CACHE_KEYS.HOMEPAGE_DATA, footerData);
      }
    } catch (error) {
      console.error("Failed to fetch homepage data:", error);
      
      const staleCache = localStorage.getItem(CACHE_KEYS.HOMEPAGE_DATA);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setHomepageData(data);
          }
        } catch (parseError) {
          console.warn('Failed to parse stale homepage cache:', parseError);
        }
      }
    }
  }, []);

  const fetchSocialMedia = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      const cachedData = CacheManager.get(CACHE_KEYS.SOCIAL_MEDIA);
      if (cachedData) {
        setFetchedSocials(cachedData);
        return;
      }

      const res = await fetch("/api/socials");

      if (!res.ok) throw new Error('Socials fetch failed');
      
      const json = await res.json();

      if (json.data && mountedRef.current) {
        const combinedSocials = json.data.map((social) => {
          if (social.iconType === "react-icon") {
            const platformDetails = allSocialPlatforms.find(
              (p) => p.name === social.iconValue,
            );
            return {
              ...social,
              color: platformDetails?.color || "from-gray-200 to-gray-300",
              textColor: platformDetails?.textColor || "text-gray-600",
            };
          }

          return {
            ...social,
            color: "from-gray-200 to-gray-300",
            textColor: "text-gray-600",
          };
        });

        setFetchedSocials(combinedSocials);
        CacheManager.set(CACHE_KEYS.SOCIAL_MEDIA, combinedSocials);
      }
    } catch (error) {
      console.error("Failed to fetch social media data:", error);
      
      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEYS.SOCIAL_MEDIA);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setFetchedSocials(data);
          }
        } catch (parseError) {
          console.warn('Failed to parse stale socials cache:', parseError);
        }
      }
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    if (!mountedRef.current) return;

    try {
      setLogoLoading(true);
      
      // Check cache first
      const cachedData = CacheManager.get(CACHE_KEYS.FOOTER_SETTINGS);
      if (cachedData) {
        setFooterSettings(cachedData.footer || DEFAULT_FOOTER_SETTINGS);
        setLogo(cachedData.logo1 || "");
        setLogoLoading(false);
        return;
      }

      const res = await fetch("/api/settings/general", { 
        next: { revalidate: 300 }
      });

      if (!res.ok) throw new Error('Settings fetch failed');
      
      const data = await res.json();
      
      if (mountedRef.current) {
        const settings = data?.settings || {};
        
        // Cache the response
        CacheManager.set(CACHE_KEYS.FOOTER_SETTINGS, settings);
        
        setFooterSettings(settings.footer || DEFAULT_FOOTER_SETTINGS);
        setLogo(settings.logo1 || "");
      }
    } catch (error) {
      console.error("Failed to fetch footer settings:", error);
      
      // Try to use stale cache as fallback
      const staleCache = localStorage.getItem(CACHE_KEYS.FOOTER_SETTINGS);
      if (staleCache) {
        try {
          const { data } = JSON.parse(staleCache);
          if (data && mountedRef.current) {
            setFooterSettings(data.footer || DEFAULT_FOOTER_SETTINGS);
            setLogo(data.logo1 || "");
          }
        } catch (parseError) {
          console.warn('Failed to parse stale settings cache:', parseError);
        }
      }
    } finally {
      if (mountedRef.current) {
        setLogoLoading(false);
      }
    }
  }, []);

  // Combined data fetch with proper error handling
  const fetchAllData = useCallback(async () => {
    const promises = [
      fetchHomepageData(),
      fetchSocialMedia(),
      fetchSettings()
    ];

    await Promise.allSettled(promises);
  }, [fetchHomepageData, fetchSocialMedia, fetchSettings]);

  // Effect with proper cleanup and idle callback optimization
  useEffect(() => {
    mountedRef.current = true;

    // Use requestIdleCallback for non-critical footer data
    const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
    const taskId = scheduleTask(() => {
      fetchAllData();
    }, { timeout: 5000 });

    return () => {
      mountedRef.current = false;
      if (window.cancelIdleCallback) {
        window.cancelIdleCallback(taskId);
      } else {
        clearTimeout(taskId);
      }
    };
  }, [fetchAllData]);

  return (
    <footer className="relative mt-10">
      <div className="bg-white dark:bg-slate-950">
        {/* Main footer content */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
            
            {/* Quick Links - Compact column */}
            <div className="lg:col-span-3">
              <div className="mb-8">
                <h4 className="text-sm sm:text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">
                  {footerSettings?.col1Heading || t("quickLinks")}
                </h4>
                <nav className="space-y-3">
                  {[
                    { href: "/about", label: t("about") },
                    { href: "/contact", label: t("contact") },
                    { href: "/terms", label: t("terms") },
                    { href: "/privacy", label: t("privacy") },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>

            {/* Trading Hours - Wider column */}
            <div className="lg:col-span-5">
              <h4 className="text-sm sm:text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">
                {footerSettings?.col2Heading || t("tradingHours")}
              </h4>
                <div className="space-y-2">
                  {tradingHours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-3 rounded-lg hover:bg-white dark:hover:bg-slate-800/50 transition-colors duration-200"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {schedule.day}
                      </span>
                      <span className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          schedule.hours === t("closedHours")
                            ? "bg-red-400"
                            : "bg-emerald-400"
                        }`}></div>
                        <span className={`text-xs font-semibold uppercase tracking-wide ${
                          schedule.hours === t("closedHours")
                            ? "text-red-600 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                        }`}>
                          {schedule.hours}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
            </div>

            {/* Language & Social - Compact column */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Language Section */}
                <div>
                  <h4 className="text-sm sm:text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">
                    {footerSettings?.col3Heading || t("language")}
                  </h4>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                    <LanguageSwitching />
                  </div>
                </div>

                {/* Social Media Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white mb-6">
                    Follow Us
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {fetchedSocials.length > 0 ? (
                      fetchedSocials.map((platform, index) => {
                        const IconComponent = 
                          platform.iconType === "react-icon" 
                            ? iconComponentsMap[platform.iconValue] 
                            : null;
                        
                        return (
                          <a
                            key={index}
                            href={platform.url}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-900 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                            aria-label={`${platform.iconValue} social link`}
                          >
                            {IconComponent ? (
                              <IconComponent className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-white transition-colors duration-300" />
                            ) : (
                              <div className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded-full group-hover:bg-white transition-colors duration-300" />
                            )}
                          </a>
                        );
                      })
                    ) : (
                      <div className="text-sm text-slate-500 dark:text-slate-400 italic">
                        No socials available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-slate-100 dark:border-slate-800">
          <div className="max-w-6xl mx-auto px-6 py-3">
            <div className="text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                © {new Date().getFullYear()} {t("copyright")}
                <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-600 dark:text-slate-300">by Sysfoc</span>
                <span className="mx-2 text-slate-300 dark:text-slate-600">•</span>
                All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footerr;