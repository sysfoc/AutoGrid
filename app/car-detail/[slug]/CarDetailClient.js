"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CrownIcon as LuCrown,
  PhoneIcon as LuPhone,
  MailIcon as LuMail,
} from "lucide-react"; // Changed from react-icons/lu to lucide-react
import Slider from "../../components/Slider";
import Table from "../../components/Tables";
import SellerComment from "../../components/SellerComment";
import Features from "../../components/Features";
import { useCurrency } from "../../context/CurrencyContext";
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
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("carDetails");
  const [openModal, setOpenModal] = useState(false);
  const { slug } = useParams();
  const [car, setCar] = useState(null); // Changed to null for initial state
  const [loading, setLoading] = useState(true);
  const [dealer, setDealer] = useState(null);
  const [error, setError] = useState(null);
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

  const parseBooleanParam = (param) => {
    return param === "true";
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
          "Failed to fetch reCAPTCHA settings in CarDetail page:",
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
                  (dealer) => dealer._id === selectedCar.dealerId,
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
  }, [slug]);

  if (!slug) {
    return (
      <div className="flex min-h-[50vh] mt-24 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-app-text dark:text-gray-200">
            Sorry! No Car Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested vehicle could not be located.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] mt-24 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-red-600 dark:text-red-400">
            An Error Occurred While Searching
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please try again later or contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!car && !loading) {
    // Added !loading to ensure it's not just loading
    return (
      <div className="flex min-h-[50vh] mt-24 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold text-app-text dark:text-gray-200">
            No Car Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The requested vehicle is not available.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] mt-24 items-center justify-center">
        <div className="flex items-center space-x-4 rounded-2xl border border-slate-200 bg-white px-8 py-6 shadow-2xl dark:border-gray-700 dark:bg-gray-800">
          <Spinner
            aria-label="Loading car details"
            size="lg"
            className="text-white"
          />
          <div>
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Loading car details...
            </span>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Please wait while we fetch the vehicle information
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 mt-32 dark:bg-gray-900">
      <div className="mx-auto mt-16 max-w-7xl px-1 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <div className="bg-gradient-to-r from-app-button to-app-button-hover px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-white/20 p-2">
                <LuCrown className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-wide text-white">
                CERTIFIED VEHICLE
              </h1>
            </div>
          </div>
        </div>
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          {/* Left Column - Main Content */}
          <div className="space-y-6 xl:col-span-8">
            {/* Image Slider */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <Slider loadingState={loading} carData={car} />
            </div>
            {/* Vehicle Info & Actions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl font-bold text-app-text dark:text-white sm:text-3xl">
                    {loading ? <Skeleton width={200} /> : car.model}
                  </h2>
                  <div className="text-3xl font-bold text-app-button dark:text-app-button sm:text-4xl">
                    {loading ? (
                      <Skeleton width={120} />
                    ) : (
                      `${selectedCurrency?.symbol} ${Math.round(car.price).toLocaleString()}`
                    )}
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setOpenModal(true)}
                  className="flex flex-1 items-center justify-center rounded-lg border-2 border-app-button bg-app-button px-6 py-3 font-semibold text-white transition-all duration-200 dark:text-white"
                >
                  <LuMail className="mr-2 h-5 w-5" />
                  {t("enquireNow")}
                </button>
                <button
                  onClick={() => {
                    window.location.href = "tel:+1234567890";
                  }}
                  className="flex flex-1 items-center justify-center rounded-lg border-2 border-app-button bg-app-button px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200"
                >
                  <LuPhone className="mr-2 h-5 w-5" />
                  {t("callUs")}
                </button>
              </div>
            </div>
            {/* Features Section */}
            {dealer && (
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-app-text dark:text-white">
                    Vehicle Features & Dealer Information
                  </h3>
                </div>
                <div className="p-6">
                  <Features
                    loadingState={loading}
                    carData={dealer}
                    car={car}
                    translation={t}
                  />
                </div>
              </div>
            )}
            <div className="mt-8">
              <div className="mt-8">
                {loading ? (
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading dealer information...
                  </p>
                ) : dealer ? (
                  dealer.map ? (
                    <iframe
                      src={dealer.map}
                      width="600"
                      height="450"
                      style={{ border: 0, width: "100%" }}
                      loading="lazy"
                      title="Dealer Location Map"
                    ></iframe>
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">
                      Map is not available
                    </p>
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className="space-y-6 xl:col-span-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-app-text dark:text-white">
                  Vehicle Specifications
                </h3>
              </div>
              <div className="p-6">
                <Table loadingState={loading} carData={car} translation={t} />
              </div>
            </div>
            {/* Seller Comments */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-app-text dark:text-white">
                  Seller Information
                </h3>
              </div>
              <div className="p-4">
                {car ? (
                  <SellerComment
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
