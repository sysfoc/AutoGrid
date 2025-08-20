"use client";

import { useParams } from "next/navigation";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCurrency } from "../../context/CurrencyContext"; // Import useCurrency hook
import SliderComponent from "../../components/Slider"; // Import SliderComponent
import SellerCommentComponent from "../../components/SellerComment"; // Import SellerCommentComponent
import { LuMessageCircle, LuMail, LuPhone } from "react-icons/lu";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Textarea,
  TextInput,
  Spinner,
} from "flowbite-react";

export default function CarDetail() {
  const t = useTranslations("carDetails");
  const [openModal, setOpenModal] = useState(false);
  const { slug } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dealer, setDealer] = useState(null);
  const [error, setError] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [showFullWhatsApp, setShowFullWhatsApp] = useState(false);
  const { selectedCurrency } = useCurrency();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(null);
  const [recaptchaStatus, setRecaptchaStatus] = useState("inactive");

  useEffect(() => {
    if (slug) {
      setLoading(true);
      setError(null);
      fetch(`/api/cars?slug=${slug}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to fetch car details");
          }
          return response.json();
        })
        .then((data) => {
          const selectedCar = data.cars?.find((c) => c.slug === slug);
          setCar(selectedCar || null);
          if (selectedCar?.dealerId) {
            fetch(`/api/dealor`)
              .then((res) => res.json())
              .then((dealerData) => {
                const matchedDealer = dealerData.find(
                  (dealer) =>
                    dealer._id.toString() === selectedCar.dealerId.toString(),
                );
                setDealer(matchedDealer || null);
              })
              .catch((err) => console.error("Error fetching dealer:", err));
          }
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setCar(null);
          setLoading(false);
        });
    }

    fetch("/api/cars")
      .then((response) => response.json())
      .then((data) => {
        if (data.cars) {
          const otherCars = data.cars
            .filter((c) => c.slug !== slug)
            .slice(0, 6);
          setRelatedCars(otherCars);
        }
      })
      .catch((err) => console.error("Error fetching related cars:", err));
  }, [slug]);

    const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

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
      carId: car?._id,
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

  const handleWhatsAppClick = () => {
    const phoneNumber = dealer?.contact || "+1234567890";
    const message = `Hi, I'm interested in the ${car?.make} ${car?.model} listed for ${selectedCurrency?.symbol}${Math.round(car?.price || 0).toLocaleString()}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatWhatsAppNumber = (number) => {
    if (!number) return "+12345...";
    const cleanNumber = number.replace(/[^0-9]/g, "");
    if (showFullWhatsApp) {
      return number;
    }
    return cleanNumber.slice(0, 6) + "...";
  };

  return (
    <div className="mt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Main Content Grid - matches reference layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left Column - Main Content (2/3 width) */}
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-200">
                      {car?.condition || "Used"}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {car?.modelYear || "N/A"}
                    </span>
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {loading ? (
                      <Skeleton width={300} />
                    ) : (
                      `${car?.make || "Unknown"} ${car?.model || "Model"}`
                    )}
                  </h1>
                </div>

                <div className="text-right">
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-400">
                    {loading ? (
                      <Skeleton width={200} />
                    ) : (
                      `${selectedCurrency?.symbol}${Math.round(car?.price || 0).toLocaleString()}`
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {car?.kms ? `${car.kms} km` : "Mileage not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Image Slider */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <SliderComponent loadingState={loading} carData={car} />
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Vehicle Details
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Complete technical specifications
                </p>
              </div>
              <div className="p-6">
                <ResponsiveSpecsGrid
                  loadingState={loading}
                  carData={car}
                  translation={t}
                />
              </div>
            </div>

            {/* Features Section */}
            {car?.features && car.features.length > 0 && (
              <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Features
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {car.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                      >
                        <div className="h-2 w-2 rounded-full bg-teal-600"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Seller Comments */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Seller Notes
                </h3>
              </div>
              <div className="p-6">
                {car ? (
                  <SellerCommentComponent
                    loadingState={loading}
                    car={car}
                    translation={t}
                  />
                ) : (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600 dark:text-gray-400">
                      Loading...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="space-y-6">
            {/* Dealer Contact Info */}
            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Dealer Information
                </h3>
              </div>
              <div className="space-y-4 p-6">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                    <Skeleton height={20} />
                  </div>
                ) : dealer ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 text-teal-600">📍</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Location
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {car?.location || dealer?.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 text-teal-600">📋</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          License
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          {dealer.licence || "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 text-green-600">💬</div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            WhatsApp
                          </p>
                        </div>
                        <button
                          onClick={() => setShowFullWhatsApp(!showFullWhatsApp)}
                          className="text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400"
                        >
                          {showFullWhatsApp ? "Hide" : "Show"} number
                        </button>
                      </div>
                      <p className="mb-3 text-gray-600 dark:text-gray-400">
                        {formatWhatsAppNumber(dealer?.contact)}
                      </p>
                      <button
                        onClick={handleWhatsAppClick}
                        className="flex w-full items-center justify-center rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-green-600"
                      >
                        <LuMessageCircle className="mr-2 h-5 w-5" />
                        Chat via WhatsApp
                      </button>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <button
                        onClick={() => setOpenModal(true)}
                        className="flex items-center justify-center rounded-lg bg-teal-600 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-teal-700"
                      >
                        <LuMail className="mr-2 h-5 w-5" />
                        Send Enquiry
                      </button>
                      <button
                        onClick={() =>
                          (window.location.href = `tel:${dealer?.contact || "+1234567890"}`)
                        }
                        className="flex items-center justify-center rounded-lg border-2 border-teal-600 px-4 py-3 font-semibold text-teal-600 transition-colors duration-200 hover:bg-teal-600 hover:text-white"
                      >
                        <LuPhone className="mr-2 h-5 w-5" />
                        Call Now
                      </button>
                    </div>
                    {/* Map Section */}
                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                      <h4 className="mb-3 font-medium text-gray-900 dark:text-white">
                        Location
                      </h4>
                      {loading ? (
                        <p className="text-gray-600 dark:text-gray-400">
                          Loading map...
                        </p>
                      ) : dealer?.map ? (
                        <iframe
                          src={dealer.map}
                          width="100%"
                          height="200"
                          className="rounded-lg border border-gray-200 dark:border-gray-600"
                          loading="lazy"
                          title="Dealer Location"
                        />
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Map not available
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No dealer information available
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Similar Cars
                </h3>
              </div>
              <div className="p-6">
                {relatedCars.length > 0 ? (
                  <div className="space-y-4">
                    {relatedCars.map((relatedCar, index) => (
                      <Link
                        href={`/car-detail/${relatedCar.slug}`}
                        key={index}
                        className="flex cursor-pointer gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <div className="h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-gray-200 dark:bg-gray-600">
                          {relatedCar.imageUrls && relatedCar.imageUrls[0] ? (
                            <Image
                              src={
                                relatedCar.imageUrls[0] || "/placeholder.svg"
                              }
                              alt={`${relatedCar.make} ${relatedCar.model}`}
                              width={64}
                              height={48}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                              🚗
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
                            {relatedCar.make} {relatedCar.model}
                          </h4>
                          <p className="text-sm font-semibold text-teal-600 dark:text-teal-400">
                            $
                            {Math.round(relatedCar.price || 0).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {relatedCar.modelYear} • {relatedCar.kms || "N/A"}{" "}
                            km
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                      🚗
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      No similar cars found
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
}

const ResponsiveSpecsGrid = ({ loadingState, carData, translation: t }) => {
  const loading = loadingState;

  const specifications = [
    { label: "Make", value: carData?.make || "Not provided", icon: "🚗" },
    { label: "Model", value: carData?.model || "Not provided", icon: "🏷️" },
    { label: "Year", value: carData?.modelYear || "Not provided", icon: "📅" },
    {
      label: "Condition",
      value: carData?.condition || "Not provided",
      icon: "⭐",
    },
    {
      label: "Body Type",
      value: carData?.bodyType || "Not provided",
      icon: "🚙",
    },
    { label: "Color", value: carData?.color || "Not provided", icon: "🎨" },
    { label: "Doors", value: carData?.doors || "Not provided", icon: "🚪" },
    { label: "Seats", value: carData?.seats || "Not provided", icon: "💺" },
    {
      label: "Fuel Type",
      value: carData?.fuelType || "Not provided",
      icon: "⛽",
    },
    { label: "Gearbox", value: carData?.gearbox || "Not provided", icon: "⚙️" },
    {
      label: "Drive Type",
      value: carData?.driveType || "Not provided",
      icon: "🔧",
    },
    {
      label: "Engine Size",
      value: carData?.engineSize ? `${carData.engineSize}L` : "Not provided",
      icon: "🔋",
    },
    {
      label: "Engine Power",
      value: carData?.enginePower
        ? `${carData.enginePower} HP`
        : "Not provided",
      icon: "⚡",
    },
    {
      label: "Mileage",
      value: carData?.mileage || carData?.kms || "Not provided",
      icon: "📊",
    },
    {
      label: "Fuel Consumption",
      value: carData?.fuelConsumption
        ? `${carData.fuelConsumption}L/100km`
        : "Not provided",
      icon: "⛽",
    },
    {
      label: "CO2 Emission",
      value: carData?.co2Emission
        ? `${carData.co2Emission}g/km`
        : "Not provided",
      icon: "🌱",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading
        ? Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="h-6 w-6 animate-pulse rounded bg-gray-200 dark:bg-gray-600"></div>
                <Skeleton width={80} height={16} />
              </div>
              <Skeleton width={100} height={20} />
            </div>
          ))
        : specifications.map((spec, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="text-lg">{spec.icon}</span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {spec.label}
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {spec.value}
              </p>
            </div>
          ))}
    </div>
  );
};
