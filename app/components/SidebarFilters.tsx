"use client";
import { Checkbox, Label, Select, TextInput } from "flowbite-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { VscSymbolKeyword } from "react-icons/vsc";
import { SiCmake, SiGoogleearthengine } from "react-icons/si";
import { useRouter } from "next/navigation";
import { IoIosSpeedometer } from "react-icons/io";
import { IoPricetag, IoArrowDownSharp, IoArrowUpSharp } from "react-icons/io5";
import { usePathname } from "next/navigation";
import {
  FaLocationDot,
  FaRecycle,
  FaRegCalendarCheck,
  FaCar,
  FaHourglassEnd,
} from "react-icons/fa6";
import {
  GiCarDoor,
  GiCartwheel,
  GiGearStickPattern,
  GiPathDistance,
  GiCarSeat,
  GiGasPump,
  GiBatteryPack,
  GiElectric,
  GiPowerLightning,
  GiCarWheel,
} from "react-icons/gi";
import { MdOutlineCo2 } from "react-icons/md";
import { useTranslations } from "next-intl";
import { useDebouncedCallback } from "use-debounce";
import { FaHandshake } from "react-icons/fa";

const SidebarFilters = () => {
  const t = useTranslations("Filters");
  const router = useRouter();
  const [localFilters, setLocalFilters] = useState<Record<string, any>>({});
  const [openSections, setOpenSections] = useState<string[]>([]);
  const pathname = usePathname();
  const isLeasingPage = pathname.includes("/leasing");

  const activeInputRef = useRef<string | null>(null);
  const inputRefs = useRef<
    Record<string, HTMLInputElement | HTMLSelectElement>
  >({});
  const isUpdatingFromURL = useRef(false);

  useEffect(() => {
    isUpdatingFromURL.current = true;
    const params = new URLSearchParams(window.location.search);
    const initialFilters: Record<string, any> = {};

    params.forEach((value, key) => {
      if (initialFilters[key]) {
        if (Array.isArray(initialFilters[key])) {
          initialFilters[key].push(value);
        } else {
          initialFilters[key] = [initialFilters[key], value];
        }
      } else {
        initialFilters[key] = value;
      }
    });

    setLocalFilters(initialFilters);

    setTimeout(() => {
      isUpdatingFromURL.current = false;
    }, 100);
  }, []);

  const updateURL = useCallback(() => {
    const activeElement = document.activeElement as
      | HTMLInputElement
      | HTMLSelectElement;
    const activeId = activeElement?.id || activeElement?.name;

    if (activeId && inputRefs.current[activeId]) {
      activeInputRef.current = activeId;
    }

    const params = new URLSearchParams();

    Object.entries(localFilters).forEach(([key, value]) => {
      if (key === "minPrice" || key === "maxPrice") {
        if (localFilters.minPrice && localFilters.maxPrice) {
          if (key === "minPrice" && localFilters.minPrice) {
            params.set("minPrice", localFilters.minPrice);
          }
          if (key === "maxPrice" && localFilters.maxPrice) {
            params.set("maxPrice", localFilters.maxPrice);
          }
        }
      } else if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value !== undefined && value !== "") {
        params.set(key, value);
      }
    });

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [localFilters, router]);

  const debouncedUpdateURL = useDebouncedCallback(updateURL, 500);

  useEffect(() => {
    if (!isUpdatingFromURL.current) {
      debouncedUpdateURL();
    }
  }, [localFilters, debouncedUpdateURL]);

  useEffect(() => {
    if (
      activeInputRef.current &&
      inputRefs.current[activeInputRef.current] &&
      !isUpdatingFromURL.current
    ) {
      const element = inputRefs.current[activeInputRef.current];
      if (element && document.activeElement !== element) {
        setTimeout(() => {
          element.focus();
          if (element.type === "text" || element.type === "number") {
            const input = element as HTMLInputElement;
            const length = input.value.length;
            input.setSelectionRange(length, length);
          }
        }, 0);
      }
      activeInputRef.current = null;
    }
  });

  useEffect(() => {
    const handleRouteChange = () => {
      isUpdatingFromURL.current = true;
      const params = new URLSearchParams(window.location.search);
      const newFilters: Record<string, any> = {};

      params.forEach((value, key) => {
        if (newFilters[key]) {
          if (Array.isArray(newFilters[key])) {
            newFilters[key].push(value);
          } else {
            newFilters[key] = [newFilters[key], value];
          }
        } else {
          newFilters[key] = value;
        }
      });

      setLocalFilters(newFilters);

      setTimeout(() => {
        isUpdatingFromURL.current = false;
      }, 100);
    };

    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const handleInputChange = (
    key: string,
    value: string,
    elementId?: string,
  ) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
    if (elementId) {
      activeInputRef.current = elementId;
    }
  };

  const handleCheckboxChange = (key: string, value: string) => {
    setLocalFilters((prev) => {
      const current = prev[key] || [];
      const array = Array.isArray(current) ? current : [current];

      if (array.includes(value)) {
        return {
          ...prev,
          [key]: array.filter((v) => v !== value),
        };
      } else {
        return {
          ...prev,
          [key]: [...array, value],
        };
      }
    });
  };

   const handleLeaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      handleInputChange("lease", "true", "lease-filter");
    } else {
      setLocalFilters(prev => {
        const { lease, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleApplyFilters = () => {
    debouncedUpdateURL.flush();
  };

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section],
    );
  };

  const setInputRef =
    (key: string) => (element: HTMLInputElement | HTMLSelectElement | null) => {
      if (element) {
        inputRefs.current[key] = element;
      } else {
        delete inputRefs.current[key];
      }
    };

  // New components
  const ColorDot = ({
    color,
    selected,
    onClick,
    label,
  }: {
    color: string;
    selected: boolean;
    onClick: () => void;
    label: string;
  }) => (
    <button
      className={`relative h-8 w-8 rounded-full border-2 ${selected ? "border-white" : "border-gray-300 dark:border-gray-600"} transition-all duration-200`}
      style={{ backgroundColor: color }}
      onClick={onClick}
      title={label}
      aria-label={`Select ${label} color`}
    >
      {selected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-4 w-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </button>
  );

  const ConditionButton = ({
    condition,
    selected,
    onClick,
  }: {
    condition: string;
    selected: boolean;
    onClick: () => void;
  }) => (
    <button
      className={`rounded-lg px-4 py-2 font-medium transition-all duration-200 ${
        selected
          ? "bg-gradient-to-r from-app-button to-app-button-hover text-white shadow-lg"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {condition === "new" ? "New" : "Used"}
    </button>
  );

  // Color mapping
  const colorMap = {
    black: "#000000",
    blue: "#3b82f6",
    gray: "#6b7280",
    white: "#ffffff",
    silver: "#c0c0c0",
    red: "#ef4444",
    green: "#22c55e",
  };

  const sections = [
    {
      label: t("year"),
      content: "year",
      symbol: <FaRegCalendarCheck />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="minYear"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                From Year
              </Label>
              <TextInput
                type="number"
                name="minYear"
                id="minYear"
                ref={setInputRef("minYear")}
                value={localFilters.minYear || ""}
                placeholder="2010"
                onChange={(e) =>
                  handleInputChange("minYear", e.target.value, "minYear")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 "
              />
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="maxYear"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                To Year
              </Label>
              <TextInput
                type="number"
                name="maxYear"
                id="maxYear"
                ref={setInputRef("maxYear")}
                value={localFilters.maxYear || ""}
                placeholder="2024"
                onChange={(e) =>
                  handleInputChange("maxYear", e.target.value, "maxYear")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 placeholder-gray-500 shadow-lg transition-all duration-300 focus:border-violet-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-violet-900/50"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("mileage"),
      content: "mileage",
      symbol: <IoIosSpeedometer />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="millageFrom"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("from")}
              </Label>
              <Select
                id="millageFrom"
                name="millageFrom"
                ref={setInputRef("millageFrom")}
                value={localFilters.millageFrom || ""}
                onChange={(e) =>
                  handleInputChange(
                    "millageFrom",
                    e.target.value,
                    "millageFrom",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="25000">25,000 km</option>
                <option value="26000">26,000 km</option>
                <option value="27000">27,000 km</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="millageTo"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("to")}
              </Label>
              <Select
                id="millageTo"
                name="millageTo"
                ref={setInputRef("millageTo")}
                value={localFilters.millageTo || ""}
                onChange={(e) =>
                  handleInputChange("millageTo", e.target.value, "millageTo")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-app-button focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="24000">24,000 km</option>
                <option value="26000">26,000 km</option>
                <option value="27000">27,000 km</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("location"),
      content: "location",
      symbol: <FaLocationDot />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["Cityville", "uk", "New York", "Berlin"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`location-${value}`}
                  checked={
                    Array.isArray(localFilters.location) &&
                    localFilters.location.includes(value)
                  }
                  onChange={() => handleCheckboxChange("location", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`location-${value}`}
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("price"),
      content: "price",
      symbol: <IoPricetag />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="minPrice"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                Minimum Price
              </Label>
              <Select
                id="minPrice"
                name="minPrice"
                ref={setInputRef("minPrice")}
                value={localFilters.minPrice || ""}
                onChange={(e) =>
                  handleInputChange("minPrice", e.target.value, "minPrice")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any Min</option>
                <option value="100">$100</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="5000">$5,000</option>
                <option value="10000">$10,000</option>
                <option value="15000">$15,000</option>
                <option value="20000">$20,000</option>
                <option value="25000">$25,000</option>
                <option value="30000">$30,000</option>
                <option value="40000">$40,000</option>
                <option value="50000">$50,000</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="maxPrice"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                Maximum Price
              </Label>
              <Select
                id="maxPrice"
                name="maxPrice"
                ref={setInputRef("maxPrice")}
                value={localFilters.maxPrice || ""}
                onChange={(e) =>
                  handleInputChange("maxPrice", e.target.value, "maxPrice")
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any Max</option>
                <option value="500">$500</option>
                <option value="1000">$1,000</option>
                <option value="5000">$5,000</option>
                <option value="10000">$10,000</option>
                <option value="15000">$15,000</option>
                <option value="20000">$20,000</option>
                <option value="25000">$25,000</option>
                <option value="30000">$30,000</option>
                <option value="40000">$40,000</option>
                <option value="50000">$50,000</option>
                <option value="75000">$75,000</option>
                <option value="100000">$100,000</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: "Model",
      content: "Model",
      symbol: <SiCmake />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["Corolla", "sequoio", "147", "146", "159"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`model-${value}`}
                  checked={
                    Array.isArray(localFilters.model) &&
                    localFilters.model.includes(value)
                  }
                  onChange={() => handleCheckboxChange("model", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`model-${value}`}
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("gearbox"),
      content: "gearbox",
      symbol: <GiGearStickPattern />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["automatic", "manual"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`gearbox-${value}`}
                  checked={
                    Array.isArray(localFilters.gearBox) &&
                    localFilters.gearBox.includes(value)
                  }
                  onChange={() => handleCheckboxChange("gearBox", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`gearbox-${value}`}
                  className="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("body"),
      content: "bodytype",
      symbol: <GiCarDoor />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {[
              "convertible",
              "coupe",
              "estate",
              "hatchback",
              "saloon",
              "suv",
            ].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`body-${value}`}
                  checked={
                    Array.isArray(localFilters.bodyType) &&
                    localFilters.bodyType.includes(value)
                  }
                  onChange={() => handleCheckboxChange("bodyType", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`body-${value}`}
                  className="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300"
                >
                  {value}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("doors"),
      content: "doors",
      symbol: <GiCarDoor />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["2", "3", "4", "5"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`doors-${value}`}
                  checked={
                    Array.isArray(localFilters.doors) &&
                    localFilters.doors.includes(value)
                  }
                  onChange={() => handleCheckboxChange("doors", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`doors-${value}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value} Doors
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("seats"),
      content: "Seats",
      symbol: <GiCarSeat />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {["2", "3", "4", "5", "7"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`seats-${value}`}
                  checked={
                    Array.isArray(localFilters.seats) &&
                    localFilters.seats.includes(value)
                  }
                  onChange={() => handleCheckboxChange("seats", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`seats-${value}`}
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value} Seats
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: t("fuel"),
      content: "fueltype",
      symbol: <GiGasPump />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["petrol", "diesel", "electric", "hybrid", "bi-fuel"].map(
              (value) => (
                <div key={value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`fuel-${value}`}
                    checked={
                      Array.isArray(localFilters.fuel) &&
                      localFilters.fuel.includes(value)
                    }
                    onChange={() => handleCheckboxChange("fuel", value)}
                    className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                  />
                  <label
                    htmlFor={`fuel-${value}`}
                    className="ml-3 text-sm capitalize text-gray-700 dark:text-gray-300"
                  >
                    {value}
                  </label>
                </div>
              ),
            )}
          </div>
        </div>
      ),
    },
    {
      label: t("battery"),
      content: "battery",
      symbol: <GiBatteryPack />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="battery"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Select Range
          </Label>
          <Select
            id="battery"
            ref={setInputRef("battery")}
            value={localFilters.battery || "Any"}
            onChange={(e) =>
              handleInputChange("battery", e.target.value, "battery")
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any Range</option>
            <option value="100">0-100 Miles</option>
            <option value="1000">100-200 Miles</option>
            <option value="2000">200+ Miles</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("charging"),
      content: "charging",
      symbol: <GiElectric />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="charging"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Maximum Charging Rate
          </Label>
          <Select
            id="charging"
            ref={setInputRef("charging")}
            value={localFilters.charging || "Any"}
            onChange={(e) =>
              handleInputChange("charging", e.target.value, "charging")
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any Speed</option>
            <option value="100">Standard (0-50kW)</option>
            <option value="1000">Fast (50-150kW)</option>
            <option value="2000">Rapid (150kW+)</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("engineSize"),
      content: "engine-size",
      symbol: <SiGoogleearthengine />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="engine-from"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("from")}
              </Label>
              <Select
                id="engine-from"
                ref={setInputRef("engineSizeFrom")}
                value={localFilters.engineSizeFrom || ""}
                onChange={(e) =>
                  handleInputChange(
                    "engineSizeFrom",
                    e.target.value,
                    "engineSizeFrom",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="0">0.0L</option>
                <option value="1">1.0L</option>
                <option value="2">2.0L</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="engine-to"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                {t("to")}
              </Label>
              <Select
                id="engine-to"
                ref={setInputRef("engineSizeTo")}
                value={localFilters.engineSizeTo || ""}
                onChange={(e) =>
                  handleInputChange(
                    "engineSizeTo",
                    e.target.value,
                    "engineSizeTo",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="">Any</option>
                <option value="0">0.0L</option>
                <option value="1">1.0L</option>
                <option value="2">2.0L</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("enginePower"),
      content: "engine-power",
      symbol: <GiPowerLightning />,
      render: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label
                htmlFor="engine-power-from"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-app-button"></span>
                {t("from")}
              </Label>
              <Select
                id="engine-power-from"
                ref={setInputRef("enginePowerFrom")}
                value={localFilters.enginePowerFrom || "Any"}
                onChange={(e) =>
                  handleInputChange(
                    "enginePowerFrom",
                    e.target.value,
                    "enginePowerFrom",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="Any">Any</option>
                <option value="50">50 bhp</option>
                <option value="100">100 bhp</option>
                <option value="150">150 bhp</option>
              </Select>
            </div>
            <div className="space-y-3">
              <Label
                htmlFor="engine-power-to"
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                {t("to")}
              </Label>
              <Select
                id="engine-power-to"
                ref={setInputRef("enginePowerTo")}
                value={localFilters.enginePowerTo || "Any"}
                onChange={(e) =>
                  handleInputChange(
                    "enginePowerTo",
                    e.target.value,
                    "enginePowerTo",
                  )
                }
                className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
              >
                <option value="Any">Any</option>
                <option value="50">50 bhp</option>
                <option value="100">100 bhp</option>
                <option value="150">150 bhp</option>
              </Select>
            </div>
          </div>
        </div>
      ),
    },
    {
      label: t("fuelConsumption"),
      content: "fuel-comsumption",
      symbol: <FaHourglassEnd />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="fuel-comsumption"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Minimum MPG
          </Label>
          <Select
            id="fuel-comsumption"
            ref={setInputRef("fuelConsumption")}
            value={localFilters.fuelConsumption || "Any"}
            onChange={(e) =>
              handleInputChange(
                "fuelConsumption",
                e.target.value,
                "fuelConsumption",
              )
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any MPG</option>
            <option value="30">30+ MPG</option>
            <option value="40">40+ MPG</option>
            <option value="50">50+ MPG</option>
            <option value="60">60+ MPG</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("co2"),
      content: "c02-emission",
      symbol: <MdOutlineCo2 />,
      render: (
        <div className="space-y-3">
          <Label
            htmlFor="c02-emission"
            className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            <span className="h-2 w-2 rounded-full bg-app-button"></span>
            Maximum CO2 Output
          </Label>
          <Select
            id="c02-emission"
            ref={setInputRef("co2Emission")}
            value={localFilters.co2Emission || "Any"}
            onChange={(e) =>
              handleInputChange("co2Emission", e.target.value, "co2Emission")
            }
            className="w-full rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-medium text-gray-800 shadow-lg transition-all duration-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:ring-violet-900/50"
          >
            <option value="Any">Any Emission</option>
            <option value="30">Up to 30 g/km CO2</option>
            <option value="75">Up to 75 g/km CO2</option>
            <option value="100">Up to 100 g/km CO2</option>
            <option value="110">Up to 110 g/km CO2</option>
            <option value="120">Up to 120 g/km CO2</option>
          </Select>
        </div>
      ),
    },
    {
      label: t("driveType"),
      content: "drive-type",
      symbol: <GiCarWheel />,
      render: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2">
            {["four", "front", "rear"].map((value) => (
              <div key={value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`drive-${value}`}
                  checked={
                    Array.isArray(localFilters.driveType) &&
                    localFilters.driveType.includes(value)
                  }
                  onChange={() => handleCheckboxChange("driveType", value)}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor={`drive-${value}`}
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  {value === "four"
                    ? "Four Wheel Drive"
                    : value === "front"
                      ? "Front Wheel Drive"
                      : "Rear Wheel Drive"}
                </label>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];
  const isLightColor = (colorId: any) => ["white", "silver"].includes(colorId);
  const visibleSections = sections.filter(section => 
    section.content !== 'lease'
  );
  useEffect(() => {
    document.documentElement.classList.add("no-scrollbar")
    return () => {
      document.documentElement.classList.remove("no-scrollbar")
    }
  }, [])
  return (
   <div className="max-h-screen overflow-y-auto no-scrollbar rounded-xl bg-white p-6 shadow-lg dark:bg-gray-900">
     <h2 className="mb-6 border-b border-gray-200 pb-4 text-2xl font-bold text-gray-800 dark:border-gray-800 dark:text-white">
        Filter Vehicles
      </h2>

      {/* Keyword Search */}
      <div className="mb-4">
        <div className="mb-4 flex items-center gap-3">
          <VscSymbolKeyword className="text-xl text-app-button" />
          <label
            htmlFor="keyword"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200"
          >
            {t("keyword")}
          </label>
        </div>
        <div className="relative">
          <TextInput
            type="text"
            id="keyword"
            name="keyword"
            ref={setInputRef("keyword")}
            value={localFilters.keyword || ""}
            placeholder="e.g., Toyota, BMW, Sedan..."
            onChange={(e) =>
              handleInputChange("keyword", e.target.value, "keyword")
            }
            className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 text-gray-800 placeholder-gray-500 focus:border-violet-500 focus:focus:ring-violet-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-400 dark:focus:ring-violet-900/50"
          />
          <VscSymbolKeyword className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 dark:text-gray-400" />
        </div>
      </div>

      {/* Condition Toggle Buttons */}
      <div className="mb-6">
        <div className="mb-3 flex items-center gap-3">
          <FaRecycle className="text-xl text-app-button" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {t("condition")}
          </h3>
        </div>
        <div className="flex gap-3">
          <ConditionButton
            condition="new"
            selected={
              Array.isArray(localFilters.condition) &&
              localFilters.condition.includes("new")
            }
            onClick={() => handleCheckboxChange("condition", "new")}
          />
          <ConditionButton
            condition="used"
            selected={
              Array.isArray(localFilters.condition) &&
              localFilters.condition.includes("used")
            }
            onClick={() => handleCheckboxChange("condition", "used")}
          />
        </div>
      </div>

      {!isLeasingPage && (
        <div className="mb-6 border-b border-gray-200 pb-4 last:border-0 dark:border-gray-800">
          <button
            className="group mb-4 flex w-full items-center justify-between"
            onClick={() => toggleSection("lease")}
          >
            <div className="flex items-center gap-3">
              <FaHandshake className="text-app-button dark:text-app-button-hover" />
              <h3 className="text-left font-semibold text-gray-800 dark:text-gray-200">
                Lease
              </h3>
            </div>
            <div className="text-gray-500 group-hover:text-app-button dark:text-gray-400 dark:group-hover:text-app-button-hover">
              {openSections.includes("lease") ? (
                <IoArrowUpSharp className="h-5 w-5" />
              ) : (
                <IoArrowDownSharp className="h-5 w-5" />
              )}
            </div>
          </button>

          {openSections.includes("lease") && (
            <div className="pl-9 space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lease-filter"
                  checked={localFilters.lease === "true"}
                  onChange={handleLeaseChange}
                  className="h-4 w-4 rounded border-gray-300 text-app-button focus:ring-violet-500"
                />
                <label
                  htmlFor="lease-filter"
                  className="ml-3 text-sm text-gray-700 dark:text-gray-300"
                >
                  Show Lease Cars Only
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-6">
        {visibleSections.map((section, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-4 last:border-0 dark:border-gray-800"
          >
            <button
              className="group mb-4 flex w-full items-center justify-between"
              onClick={() => toggleSection(section.content)}
            >
              <div className="flex items-center gap-3">
                <div className="text-app-button dark:text-app-button-hover">
                  {section.symbol}
                </div>
                <h3 className="text-left font-semibold text-gray-800 dark:text-gray-200">
                  {section.label}
                </h3>
              </div>
              <div className="text-gray-500 group-hover:text-app-button dark:text-gray-400 dark:group-hover:text-app-button-hover">
                {openSections.includes(section.content) ? (
                  <IoArrowUpSharp className="h-5 w-5" />
                ) : (
                  <IoArrowDownSharp className="h-5 w-5" />
                )}
              </div>
            </button>

            {openSections.includes(section.content) && (
              <div className="pl-9">{section.render}</div>
            )}
          </div>
        ))}
      </div>
        <div className="mb-4">
        <div className="mb-3 flex items-center gap-3">
          <div className="text-xl text-app-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Colors
          </h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(colorMap).map(([id, hex]) => {
            const label = id.charAt(0).toUpperCase() + id.slice(1);
            const isSelected =
              Array.isArray(localFilters.color) &&
              localFilters.color.includes(id);

            return (
              <button
                key={id}
                className={`relative h-8 w-8 rounded-full border-2 ${isSelected ? "border-white ring-text-app-button" : "border-gray-300 dark:border-gray-600"} transition-all duration-200`}
                style={{ backgroundColor: hex }}
                onClick={() => handleCheckboxChange("color", id)}
                title={label}
                aria-label={`Select ${label} color`}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg
                      className={`h-4 w-4 ${isLightColor(id) ? "text-black" : "text-white"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default SidebarFilters;
