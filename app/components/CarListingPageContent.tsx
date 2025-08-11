"use client"
import { useState, useEffect } from "react"
import { HiMenu } from "react-icons/hi"
import SidebarFilters from "./SidebarFilters"
import CardetailCard from "./CardetailCard"

const CarListingPageContent = () => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) setIsMobileFiltersOpen(false)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isMobileFiltersOpen])

  return (
    <div className="relative mt-36 flex flex-wrap gap-5 md:flex-nowrap">
      {isMobile && (
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="fixed top-36 left-6 z-40 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 font-semibold text-white shadow-lg transition-all hover:bg-blue-700 md:hidden"
        >
          <HiMenu className="h-5 w-5" />
          Filters
        </button>
      )}
      <div
        className={`transition-all duration-300 md:w-1/4 ${
          isMobile
            ? `fixed right-0 top-0 z-50 h-screen !w-[80vw] max-w-xs transform overflow-y-auto bg-white shadow-xl ${
                isMobileFiltersOpen ? "translate-x-0" : "translate-x-full"
              }`
            : ""
        }`}
      >
        <SidebarFilters />
      </div>
      <div className={`w-full md:w-3/4  mt-10 sm:mt-10 md:mt-0 ${isMobileFiltersOpen ? "opacity-30 md:opacity-100" : ""}`}>
        <CardetailCard />
      </div>
      {isMobile && isMobileFiltersOpen && (
        <div className="fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)} />
      )}
    </div>
  )
}

export default CarListingPageContent
