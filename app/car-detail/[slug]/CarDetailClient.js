"use client"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { CrownIcon as LuCrown, PhoneIcon as LuPhone, MailIcon as LuMail } from "lucide-react"
import Slider from "../../components/Slider"
import Table from "../../components/Tables"
import SellerComment from "../../components/SellerComment"
import Features from "../../components/Features"
import { useCurrency } from "../../context/CurrencyContext"
import { Label, Modal, ModalBody, ModalHeader, Textarea, TextInput, Spinner } from "flowbite-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useTranslations } from "next-intl"

export default function Home() {
  const t = useTranslations("carDetails")
  const [openModal, setOpenModal] = useState(false)
  const { slug } = useParams()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dealer, setDealer] = useState(null)
  const [error, setError] = useState(null)
  const { selectedCurrency } = useCurrency()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(null)
  const [recaptchaStatus, setRecaptchaStatus] = useState("inactive")

  const parseBooleanParam = (param) => {
    return param === "true"
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  useEffect(() => {
    const fetchRecaptchaSettings = async () => {
      try {
        const response = await fetch("/api/settings/general", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        const data = await response.json()
        if (data.settings?.recaptcha) {
          setRecaptchaSiteKey(data.settings.recaptcha.siteKey)
          setRecaptchaStatus(data.settings.recaptcha.status)
        }
      } catch (error) {
        console.error("Failed to fetch reCAPTCHA settings in CarDetail page:", error)
      }
    }
    fetchRecaptchaSettings()
  }, [])

  const handleEnquirySubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")
    let recaptchaToken = null

    if (recaptchaStatus === "active" && recaptchaSiteKey && typeof window.grecaptcha !== "undefined") {
      try {
        recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
          action: "car_enquiry_submit",
        })
      } catch (error) {
        console.error("reCAPTCHA execution failed:", error)
        setSubmitMessage("reCAPTCHA verification failed. Please try again.")
        setIsSubmitting(false)
        return
      }
    } else if (recaptchaStatus === "active" && (!recaptchaSiteKey || typeof window.grecaptcha === "undefined")) {
      console.error("reCAPTCHA is active but not fully loaded or configured.")
      setSubmitMessage("reCAPTCHA is not ready. Please refresh the page and try again.")
      setIsSubmitting(false)
      return
    }

    const enquiryData = {
      carId: car?._id,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      recaptchaToken: recaptchaToken,
    }

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enquiryData),
      })

      const result = await response.json()
      if (response.ok) {
        setSubmitMessage("Enquiry submitted successfully! We will contact you soon.")
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        })
        setTimeout(() => {
          setOpenModal(false)
          setSubmitMessage("")
        }, 2000)
      } else {
        setSubmitMessage(result.error || "Failed to submit enquiry. Please try again.")
      }
    } catch (error) {
      console.error("Enquiry submission error:", error)
      setSubmitMessage("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (slug) {
      setLoading(true)
      setError(null)
      fetch(`/api/cars?slug=${slug}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch car details")
          }
          return response.json()
        })
        .then((data) => {
          const selectedCar = data.cars?.find((c) => c.slug === slug)
          setCar(selectedCar || null)
          if (selectedCar?.dealerId) {
            fetch(`/api/dealor`)
              .then((res) => res.json())
              .then((dealerData) => {
                const matchedDealer = dealerData.find((dealer) => dealer._id === selectedCar.dealerId)
                setDealer(matchedDealer || null)
              })
              .catch((err) => console.error("Error fetching dealer:", err))
          }
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setCar(null)
          setLoading(false)
        })
    }
  }, [slug])

  if (!slug) {
    return (
      <div className="flex min-h-[50vh] mt-24 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-green-100 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Sorry! No Car Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The requested vehicle could not be located.</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] mt-24 items-center justify-center bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-2xl font-bold text-red-600 dark:text-red-400">An Error Occurred While Searching</h2>
          <p className="text-gray-600 dark:text-gray-400">Please try again later or contact support.</p>
        </div>
      </div>
    )
  }

  if (!car && !loading) {
    return (
      <div className="flex min-h-[50vh] mt-24 items-center justify-center bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-600 dark:text-gray-400"
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
          <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">No Car Found</h2>
          <p className="text-gray-600 dark:text-gray-400">The requested vehicle is not available.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] mt-24 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center space-x-4 rounded-2xl border border-green-200 bg-white px-8 py-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <Spinner aria-label="Loading car details" size="lg" className="text-green-600" />
          <div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">Loading car details...</span>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the vehicle information
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 mt-16 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto mt-16 max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                <LuCrown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wide text-white">CERTIFIED VEHICLE</h1>
                <p className="text-green-100 mt-1">Premium Quality Guaranteed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="space-y-8 xl:col-span-8">
            {/* Image Slider */}
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <Slider loadingState={loading} carData={car} />
            </div>

            {/* Vehicle Info & Actions */}
            <div className="rounded-2xl border border-green-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-3">
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {car?.condition || "Premium"}
                    </span>
                  </div>
                  <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                    {loading ? <Skeleton width={300} /> : `${car?.make} ${car?.model}`}
                  </h2>
                  <div className="text-4xl font-bold text-green-600 dark:text-green-400 sm:text-5xl">
                    {loading ? (
                      <Skeleton width={200} />
                    ) : (
                      `${selectedCurrency?.symbol} ${Math.round(car?.price || 0).toLocaleString()}`
                    )}
                  </div>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">Starting price</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => setOpenModal(true)}
                  className="flex flex-1 items-center justify-center rounded-xl border-2 border-green-600 bg-green-600 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:border-green-700 hover:bg-green-700 hover:shadow-xl transform hover:scale-105"
                >
                  <LuMail className="mr-3 h-6 w-6" />
                  {t("enquireNow")}
                </button>
                <button
                  onClick={() => {
                    window.location.href = "tel:+1234567890"
                  }}
                  className="flex flex-1 items-center justify-center rounded-xl border-2 border-green-600 bg-transparent px-8 py-4 font-semibold text-green-600 shadow-lg transition-all duration-200 hover:bg-green-600 hover:text-white hover:shadow-xl transform hover:scale-105"
                >
                  <LuPhone className="mr-3 h-6 w-6" />
                  {t("callUs")}
                </button>
              </div>
            </div>

            {/* Features Section */}
            {dealer && (
              <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 dark:border-gray-700 dark:from-gray-700 dark:to-gray-600">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Vehicle Features & Dealer Information
                  </h3>
                  <p className="mt-1 text-gray-600 dark:text-gray-400">Complete specifications and dealer details</p>
                </div>
                <div className="p-8">
                  <Features loadingState={loading} carData={dealer} car={car} translation={t} />
                </div>
              </div>
            )}

            {/* Map Section */}
            <div className="rounded-2xl border border-green-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800 overflow-hidden">
              <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 dark:border-gray-700 dark:from-gray-700 dark:to-gray-600">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Dealer Location</h3>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Find us on the map</p>
              </div>
              <div className="p-8">
                {loading ? (
                  <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse flex items-center justify-center">
                    <p className="text-gray-600 dark:text-gray-400">Loading dealer information...</p>
                  </div>
                ) : dealer ? (
                  dealer.map ? (
                   <iframe
  src={dealer.map}
  width="600"
  height="450"
  loading="lazy"
  title="Dealer Location Map"
  className="rounded-xl shadow-inner custom-iframe"
></iframe>
                  ) : (
                    <div className="h-96 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <p className="text-gray-600 dark:text-gray-400">Map is not available</p>
                    </div>
                  )
                ) : null}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8 xl:col-span-4">
            {/* Vehicle Specifications */}
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 dark:border-gray-700 dark:from-gray-700 dark:to-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Vehicle Specifications</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Technical details and specs</p>
              </div>
              <div className="p-6">
                <Table loadingState={loading} carData={car} translation={t} />
              </div>
            </div>

            {/* Seller Comments */}
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 dark:border-gray-700 dark:from-gray-700 dark:to-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Seller Information</h3>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Additional details from the seller</p>
              </div>
              <div className="p-6">
                {car ? (
                  <SellerComment loadingState={loading} car={car} translation={t} />
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enquiry Modal */}
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} className="backdrop-blur-sm">
          <ModalHeader className="border-b border-green-100 pb-4 dark:border-gray-700 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-t-lg">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Get in Touch</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">We will get back to you within 24 hours</p>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <form onSubmit={handleEnquirySubmit} className="space-y-6">
              {submitMessage && (
                <div
                  className={`rounded-xl p-4 text-sm border ${
                    submitMessage.includes("success")
                      ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    First Name *
                  </Label>
                  <TextInput
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Last Name *
                  </Label>
                  <TextInput
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Address *
                  </Label>
                  <TextInput
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </Label>
                  <TextInput
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    className="rounded-xl border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="message" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Your Message
                  </Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Tell us about your requirements, budget, or any specific questions..."
                    className="resize-none rounded-xl border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full rounded-xl py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 transform ${
                    isSubmitting
                      ? "cursor-not-allowed bg-gray-400"
                      : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:shadow-xl hover:scale-105"
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
      </div>
    </div>
  )
}
