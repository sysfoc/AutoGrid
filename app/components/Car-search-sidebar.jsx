"use client"

import { useState, useEffect, useId } from "react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { FaSearch, FaTimes, FaTags } from "react-icons/fa"
import { useSidebar } from "../context/SidebarContext"

const isLightColor = (colorId) => {
  const lightColors = ["white", "yellow", "beige", "silver"]
  return lightColors.includes(colorId)
}

const colorMap = {
  black: "#000000",
  blue: "#3b82f6",
  gray: "#6b7280",
  white: "#ffffff",
  silver: "#c0c0c0",
  red: "#ef4444",
  green: "#22c55e",
}

const ConditionButton = ({ condition, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 ${
        selected
          ? "border-[#DC3C22] bg-[#DC3C22] text-white shadow-md"
          : "border-gray-300 bg-white text-[#182641] hover:border-[#DC3C22]/40 hover:bg-[#DC3C22]/10 hover:text-[#DC3C22] dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-[#DC3C22]/50 dark:hover:bg-[#DC3C22]/20 dark:hover:text-[#DC3C22]"
      }`}
    >
      {condition === "new" ? "New" : "Used"}
    </button>
  )
}

const CarSearchSidebar = () => {
  const t = useTranslations("HomePage")
  const { isSidebarOpen, closeSidebar } = useSidebar() // Use context
  
  const [makes, setMakes] = useState([])
  const [models, setModels] = useState([])
  const [selectedMake, setSelectedMake] = useState("")
  const [selectedModel, setSelectedModel] = useState("")
  const [minPrice, setMinPrice] = useState(100)
  const [maxPrice, setMaxPrice] = useState(100000)
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedConditions, setSelectedConditions] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [jsonData, setJsonData] = useState(null)
  const router = useRouter()
  const idPrefix = useId();

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        setLoading(true)
        const response = await fetch("/Vehicle make and model data (2).json")
        const data = await response.json()
        setJsonData(data.Sheet1)
        // Extract unique makes
        const uniqueMakes = [...new Set(data.Sheet1.map((item) => item.Maker))]
        setMakes(uniqueMakes)
      } catch (error) {
        console.error("Error loading vehicle data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchJsonData()
  }, [])

  useEffect(() => {
    if (selectedMake && jsonData) {
      const makeData = jsonData.find((item) => item.Maker === selectedMake)
      if (makeData && makeData["model "]) {
        const modelArray = makeData["model "].split(",").map((model) => model.trim())
        setModels(modelArray)
      } else {
        setModels([])
      }
      setSelectedModel("")
    }
  }, [selectedMake, jsonData])

  const handleColorSelection = (colorId) => {
    setSelectedColors((prev) => (prev.includes(colorId) ? prev.filter((c) => c !== colorId) : [...prev, colorId]))
  }

  const handleConditionSelection = (condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition],
    )
  }

  const handleSearch = async () => {
    if (
      !selectedMake &&
      minPrice === 100 &&
      maxPrice === 100000 &&
      selectedColors.length === 0 &&
      selectedConditions.length === 0
    ) {
      alert("Please select at least one search criterion (Make, Price Range, Color, or Condition).")
      return
    }
    setSearchLoading(true)
    try {
      const queryParams = []
      if (selectedMake) {
        queryParams.push(`make=${encodeURIComponent(selectedMake)}`)
      }
      if (selectedModel) {
        queryParams.push(`model=${encodeURIComponent(selectedModel)}`)
      }
      if (minPrice !== 100 || maxPrice !== 100000) {
        queryParams.push(`minPrice=${minPrice}`)
        queryParams.push(`maxPrice=${maxPrice}`)
      }
      if (selectedColors.length > 0) {
        selectedColors.forEach((color) => {
          queryParams.push(`color=${encodeURIComponent(color)}`)
        })
      }
      if (selectedConditions.length > 0) {
        selectedConditions.forEach((condition) => {
          queryParams.push(`condition=${encodeURIComponent(condition)}`)
        })
      }
      const queryString = queryParams.join("&")
      router.push(`/car-for-sale?${queryString}`)
      closeSidebar() // Use context function
    } catch (error) {
      console.error("Error searching cars:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setSearchLoading(false)
    }
  }

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}k`
    }
    return `$${price.toLocaleString()}`
  }

  return (
    <>
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform overflow-y-auto bg-white shadow-2xl transition-transform duration-300 dark:bg-gray-900 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } scrollbar-hide`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header - Minimal */}
          <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-[#182641] dark:text-white">Search Filters</h2>
            <button
              onClick={closeSidebar}
              aria-label="Close Sidebar"
              className="rounded-lg p-1.5 text-[#182641] transition-colors duration-200 hover:bg-[#DC3C22]/10 hover:text-[#DC3C22] focus:outline-none focus:ring-2 focus:ring-[#DC3C22]/50 dark:text-gray-300 dark:hover:bg-[#DC3C22]/20 dark:hover:text-[#DC3C22]"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>
          {/* Search Content */}
          <div className="flex-1 space-y-4 overflow-y-auto p-2 px-4">
            {/* Make and Model Selection */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor={`${idPrefix}-make`} className="mb-2 block text-sm font-semibold text-[#182641] dark:text-gray-300">
                  Make
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-make`}
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                    aria-label="Select Make"
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-[#182641] transition-all duration-200 hover:border-[#DC3C22]/40 focus:border-[#DC3C22] focus:ring-2 focus:ring-[#DC3C22]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-[#DC3C22]/40 dark:focus:border-[#DC3C22] dark:focus:ring-[#DC3C22]/30"
                    disabled={loading}
                  >
                    <option value="">Select Make</option>
                    {makes.map((make, index) => (
                      <option key={index} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                  {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label htmlFor={`${idPrefix}-model`} className="mb-2 block text-sm font-semibold text-[#182641] dark:text-gray-300">
                  Model
                </label>
                <div className="relative">
                  <select
                    id={`${idPrefix}-model`}
                    value={selectedModel}
                    aria-label="Select Model"
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-[#182641] transition-all duration-200 hover:border-red-500 focus:border-red-600 focus:ring-2 focus:ring-[#DC3C22]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-[#DC3C22]/40 dark:focus:border-[#DC3C22] dark:focus:ring-[#DC3C22]/30"
                    disabled={!selectedMake || loading}
                  >
                    <option value="">Select Model</option>
                    {models.map((model, index) => (
                      <option key={index} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  {loading && selectedMake && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="mb-3 block text-sm font-semibold text-[#182641] dark:text-gray-300">
                <span className="flex items-center space-x-1">
                  <FaTags className="h-3 w-3 text-red-600" />
                  <span>{t("priceRange")}</span>
                </span>
              </div>
              <div id="priceRangeOne" className="rounded-xl border-2 border-gray-200 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/60">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="rounded-lg bg-[#DC3C22]/10 px-3 py-1 dark:bg-[#DC3C22]/20">
                      <span className="text-sm font-bold text-red-600">
                        {formatPrice(minPrice)}
                      </span>
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="rounded-lg bg-[#DC3C22]/10 px-3 py-1 dark:bg-[#DC3C22]/20">
                      <span className="text-sm font-bold text-red-600">
                        {formatPrice(maxPrice)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="relative mb-4">
                  <input
                    id={`${idPrefix}-minPriceSlider`}
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={minPrice}
                    aria-label="Minimum price range"
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (value < maxPrice) setMinPrice(value)
                    }}
                    className="absolute h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  <input
                    id={`${idPrefix}-maxPriceSlider`}
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={maxPrice}
                    aria-label="Maximum price range"
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      if (value > minPrice) setMaxPrice(value)
                    }}
                    className="absolute h-2 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  <div className="relative h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="absolute h-2 rounded-full bg-gradient-to-r from-red-600 to-red-700 shadow-sm"
                      style={{
                        left: `${((minPrice - 100) / 99900) * 100}%`,
                        width: `${((maxPrice - minPrice) / 99900) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={`${idPrefix}-minPriceInput`} className="mb-1 block text-xs font-medium text-[#182641]/70 dark:text-gray-400">Minimum</label>
                    <input
                      id={`${idPrefix}-minPriceInput`}
                      type="number"
                      min="100"
                      max="100000"
                      value={minPrice}
                      aria-label="Minimum price range"
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 100
                        if (value < maxPrice && value >= 100) setMinPrice(value)
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#182641] transition-colors duration-200 focus:border-[#DC3C22] focus:ring-2 focus:ring-[#DC3C22]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#DC3C22] dark:focus:ring-[#DC3C22]/30"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${idPrefix}-maxPriceInput`} className="mb-1 block text-xs font-medium text-[#182641]/70 dark:text-gray-400">Maximum</label>
                    <input
                      id={`${idPrefix}-maxPriceInput`}
                      type="number"
                      min="100"
                      max="100000"
                      value={maxPrice}
                      aria-label="Maximum price range"
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || 100000
                        if (value > minPrice && value <= 100000) setMaxPrice(value)
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#182641] transition-colors duration-200 focus:border-[#DC3C22] focus:ring-2 focus:ring-[#DC3C22]/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-[#DC3C22] dark:focus:ring-[#DC3C22]/30"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Color Selection - Compact */}
            <div>
              <div className="mb-2 block text-sm font-semibold text-[#182641] dark:text-gray-300">Colors</div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Color selection">
                {Object.entries(colorMap).map(([id, hex]) => {
                  const label = id.charAt(0).toUpperCase() + id.slice(1)
                  const isSelected = selectedColors.includes(id)
                  return (
                    <button
                      key={id}
                      className={`relative h-6 w-6 rounded-full border ${
                        isSelected ? "border-white ring-2 ring-red-600" : "border-gray-300 dark:border-gray-600"
                      } transition-all duration-200`}
                      style={{ backgroundColor: hex }}
                      onClick={() => handleColorSelection(id)}
                      title={label}
                      aria-label={`${label} color ${isSelected ? 'selected' : ''}`}
                    >
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            className={`h-3 w-3 ${isLightColor(id) ? "text-black" : "text-white"}`}
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
                  )
                })}
              </div>
            </div>
            {/* Condition Selection - Compact */}
            <div>
              <div className="mb-2 block text-sm font-semibold text-[#182641] dark:text-gray-300">Condition</div>
              <div className="flex gap-2" role="group" aria-label="Condition selection">
                <ConditionButton
                  condition="new"
                  selected={selectedConditions.includes("new")}
                  onClick={() => handleConditionSelection("new")}
                />
                <ConditionButton
                  condition="used"
                  selected={selectedConditions.includes("used")}
                  onClick={() => handleConditionSelection("used")}
                />
              </div>
            </div>
            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={searchLoading}
              className="w-full rounded-lg bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-medium text-white shadow-md transition-all duration-300 hover:shadow-lg hover:from-red-700 hover:to-red-600 focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <div className="flex items-center justify-center">
                {searchLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2 h-4 w-4" />
                    <span>Search Cars</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CarSearchSidebar