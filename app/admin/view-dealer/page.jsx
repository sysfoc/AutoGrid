"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FaEdit,
  FaTrash,
  FaUserTag,
  FaMapMarkerAlt,
  FaPhone,
  FaFileAlt,
  FaBuilding,
  FaMap,
  FaSave,
  FaTimes,
  FaEnvelope,
  FaUsers,
  FaEye,
  FaExclamationTriangle,
} from "react-icons/fa";

export default function ViewDealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingDealer, setEditingDealer] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  // Fetch user role for access control
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (data.user.role !== "superadmin") {
          router.replace("/admin/dashboard");
        } else {
          setUserRole(data.user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        router.replace("/login");
      }
    };
    fetchUserRole();
  }, [router]);

  // Fetch dealers
  useEffect(() => {
    if (userRole) {
      fetchDealers();
    }
  }, [userRole]);

  const fetchDealers = async () => {
    try {
      const response = await fetch("/api/dealor");
      const data = await response.json();
      setDealers(data);
    } catch (error) {
      console.error("Error fetching dealers:", error);
    } finally {
      setLoading(false);
    }
  };

  const convertEmbedToRegularUrl = (embedUrl) => {
    if (!embedUrl) return null;

    try {
      // If it's already a regular maps URL, return as-is
      if (
        embedUrl.includes("/maps/place/") ||
        embedUrl.includes("/maps/dir/") ||
        embedUrl.includes("/maps/@")
      ) {
        return embedUrl;
      }

      // If it's an embed URL, convert it
      if (embedUrl.includes("/maps/embed")) {
        // Extract the pb parameter which contains the location data
        const pbMatch = embedUrl.match(/pb=([^&]+)/);
        if (pbMatch) {
          // Create a regular Google Maps URL with the same location data
          return `https://www.google.com/maps?pb=${pbMatch[1]}`;
        }

        // Fallback: try to extract coordinates if pb parameter fails
        const coordMatch = embedUrl.match(/!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
        if (coordMatch) {
          const lng = coordMatch[1];
          const lat = coordMatch[2];
          return `https://www.google.com/maps/@${lat},${lng},15z`;
        }
      }

      return embedUrl; // Return original if no conversion possible
    } catch (error) {
      console.error("Error converting embed URL:", error);
      return embedUrl;
    }
  };

  const isValidGoogleMapsUrl = (url) => {
    if (!url || url.trim() === "") return true;
    const googleMapsPatterns = [
      /^https:\/\/maps\.google\.com\//,
      /^https:\/\/www\.google\.com\/maps\//,
      /^https:\/\/goo\.gl\/maps\//,
      /^https:\/\/maps\.app\.goo\.gl\//,
      /^https:\/\/google\.com\/maps\//,
      /^https:\/\/www\.google\.com\/maps\/embed/,
    ];

    return googleMapsPatterns.some((pattern) => pattern.test(url.trim()));
  };

  const handleEdit = (dealer) => {
    setEditingDealer(dealer);
    setEditFormData({
      name: dealer.name,
      address: dealer.address,
      contact: dealer.contact,
      licence: dealer.licence,
      email: dealer.email,
      abn: dealer.abn,
      map: dealer.map || "",
    });
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditingDealer(null);
    setEditFormData({});
    setErrors({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear map error when user starts typing
    if (name === "map" && errors.map) {
      setErrors((prev) => ({
        ...prev,
        map: "",
      }));
    }
  };

  const validateEditForm = () => {
    const newErrors = {};

    if (!editFormData.name?.trim()) {
      newErrors.name = "Dealer name is required";
    }
    if (!editFormData.address?.trim()) {
      newErrors.address = "Address is required";
    }
    if (!editFormData.contact?.trim()) {
      newErrors.contact = "Contact number is required";
    }
    if (!editFormData.licence?.trim()) {
      newErrors.licence = "Licence number is required";
    }
    if (!editFormData.abn?.trim()) {
      newErrors.abn = "ABN is required";
    }
    if (!editFormData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    // Validate Google Maps URL
    if (editFormData.map && editFormData.map.trim() !== "") {
      if (!isValidGoogleMapsUrl(editFormData.map)) {
        newErrors.map = "Please enter a valid Google Maps URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveEdit = async () => {
    if (!validateEditForm() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/dealor/${editingDealer._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });
      if (response.ok) {
        await fetchDealers();
        setEditingDealer(null);
        setEditFormData({});
        setErrors({});
      } else {
        const data = await response.json();
        setErrors({ general: data.error || "Failed to update dealer" });
      }
    } catch (error) {
      setErrors({ general: "Failed to connect to server" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (dealerId) => {
    try {
      const response = await fetch(`/api/dealor/${dealerId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchDealers();
        setDeleteConfirm(null);
      } else {
        console.error("Failed to delete dealer");
      }
    } catch (error) {
      console.error("Error deleting dealer:", error);
    }
  };

  if (!userRole || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <span className="ml-3 font-medium text-slate-600">
              Loading Dealers...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-8xl mx-auto space-y-6">
        {/* Header Section - Made Compact */}
        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-lg">
          <div className=" bg-gradient-to-r text-white from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-4 sm:px-6">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
              <div className="flex flex-1 items-center space-x-3">
                <div className="rounded-lg bg-white/20 p-2 backdrop-blur-sm">
                  <FaUsers className="text-base text-white sm:text-lg" />
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-white sm:text-2xl">
                    Dealer Management
                  </h1>
                  <p className="text-xs text-blue-100">
                    Manage dealership records
                  </p>
                </div>
              </div>
              <div className="self-start rounded-lg bg-white/10 px-3 py-1 backdrop-blur-sm sm:self-auto">
                <div className="text-xs text-white/80">Total</div>
                <div className="text-base font-bold text-white sm:text-lg">
                  {dealers.length}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="rounded-xl border-l-4 border-app-button bg-red-50 p-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-app-button">
                  <span className="text-xs font-bold text-white">!</span>
                </div>
              </div>
              <div className="ml-4">
                <div className="font-semibold text-app-text">
                  Error Occurred
                </div>
                <div className="mt-1 text-app-text/80">{errors.general}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="overflow-hidden rounded-xl border border-slate-200/60 bg-white shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaUserTag className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        Dealer Name
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaMapMarkerAlt className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        Address
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaPhone className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        Contact
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaFileAlt className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        Licence
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaBuilding className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        ABN
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaEnvelope className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        Email
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <FaMap className="text-sm text-slate-400" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                        Map
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wider text-app-text">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {dealers.map((dealer, index) => (
                  <tr
                    key={dealer._id}
                    className={`transition-colors duration-200 hover:bg-slate-50/50 ${index % 2 === 0 ? "bg-white" : "bg-slate-25"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-app-text to-slate-600 text-xs font-bold text-white">
                          {dealer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-sm font-semibold text-app-text">
                          {dealer.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-xs text-sm leading-relaxed text-app-text/80">
                        {dealer.address}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-block rounded-md bg-slate-100 px-2 py-1">
                        <div className="text-sm font-medium text-app-text">
                          {dealer.contact}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-block rounded-md bg-slate-100 px-2 py-1">
                        <div className="text-sm font-medium text-app-text">
                          {dealer.licence}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="inline-block rounded-md bg-slate-100 px-2 py-1">
                        <div className="text-sm font-medium text-app-text">
                          {dealer.abn}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-block rounded-md bg-slate-100 px-2 py-1">
                        <div className="text-sm font-medium text-app-text">
                          {dealer.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dealer.map && isValidGoogleMapsUrl(dealer.map) ? (
                        <a
                          href={dealer.map}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-app-bg hover:text-app-bg inline-flex items-center space-x-1 rounded-md bg-green-50 px-3 py-1 text-sm font-medium transition-colors duration-200"
                        >
                          <FaEye className="text-xs" />
                          <span>View Map</span>
                        </a>
                      ) : dealer.map ? (
                        <div className="inline-flex items-center space-x-1 rounded-md bg-red-50 px-3 py-1 text-sm font-medium text-app-button">
                          <FaExclamationTriangle className="text-xs" />
                          <span>Invalid URL</span>
                        </div>
                      ) : (
                        <div className="text-sm italic text-slate-400">
                          No map
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEdit(dealer)}
                          className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-app-text to-slate-600 px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-slate-600 hover:to-slate-700 hover:shadow-lg"
                        >
                          <FaEdit className="text-xs" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(dealer._id)}
                          className="flex items-center space-x-1 rounded-lg bg-gradient-to-r from-app-button to-app-button-hover px-3 py-1.5 text-sm font-medium text-white shadow-md transition-all duration-200 hover:from-app-button-hover hover:to-red-700 hover:shadow-lg"
                        >
                          <FaTrash className="text-xs" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {dealers.length === 0 && !loading && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <FaUsers className="text-3xl text-slate-400" />
              </div>
              <div className="space-y-1">
                <div className="text-lg font-semibold text-app-text">
                  No dealers found
                </div>
                <div className="text-sm text-app-text/60">
                  There are currently no dealers in the system.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Professional Edit Modal */}
      {editingDealer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-app-text to-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <FaEdit className="text-lg text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Edit Dealer
                    </h3>
                    <p className="text-sm text-blue-100">
                      Update dealer information
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCancelEdit}
                  className="text-white/80 transition-colors duration-200 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Dealer Name */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaUserTag className="mr-2 inline text-slate-400" />
                    Dealer Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.name ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="Enter dealer name"
                  />
                  {errors.name && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.name}
                    </div>
                  )}
                </div>

                {/* Contact */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaPhone className="mr-2 inline text-slate-400" />
                    Contact Number
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={editFormData.contact}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.contact ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="Enter contact number"
                  />
                  {errors.contact && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.contact}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaMapMarkerAlt className="mr-2 inline text-slate-400" />
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    rows="2"
                    className={`w-full border-2 ${errors.address ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} resize-none rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="Enter complete address"
                  />
                  {errors.address && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.address}
                    </div>
                  )}
                </div>

                {/* Licence */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaFileAlt className="mr-2 inline text-slate-400" />
                    Licence Number
                  </label>
                  <input
                    type="text"
                    name="licence"
                    value={editFormData.licence}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.licence ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="Enter licence number"
                  />
                  {errors.licence && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.licence}
                    </div>
                  )}
                </div>

                {/* ABN */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaBuilding className="mr-2 inline text-slate-400" />
                    ABN
                  </label>
                  <input
                    type="text"
                    name="abn"
                    value={editFormData.abn}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.abn ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="Enter ABN"
                  />
                  {errors.abn && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.abn}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaEnvelope className="mr-2 inline text-slate-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.email ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="dealer@example.com"
                  />
                  {errors.email && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Map Link */}
                <div className="space-y-1 md:col-span-2">
                  <label className="block text-sm font-semibold text-app-text">
                    <FaMap className="mr-2 inline text-slate-400" />
                    Google Maps URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="map"
                    value={editFormData.map}
                    onChange={handleEditChange}
                    className={`w-full border-2 ${errors.map ? "border-app-button bg-red-50" : "border-slate-200 bg-white"} rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-app-text`}
                    placeholder="https://maps.google.com/..."
                  />
                  {errors.map && (
                    <div className="text-xs font-medium text-app-button">
                      {errors.map}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-4 border-t border-slate-200 pt-4">
                <button
                  onClick={handleCancelEdit}
                  className="rounded-xl bg-slate-100 px-4 py-2 font-medium text-app-text transition-colors duration-200 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-app-text to-slate-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-200 hover:from-slate-600 hover:to-slate-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FaSave className="text-sm" />
                  <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="bg-gradient-to-r from-app-button to-app-button-hover px-8 py-6">
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <FaTrash className="text-lg text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Confirm Deletion
                  </h3>
                  <p className="text-sm text-red-100">
                    This action is irreversible
                  </p>
                </div>
              </div>
            </div>
            <div className="p-8">
              <p className="mb-8 text-base leading-relaxed text-app-text/80">
                Are you sure you want to permanently delete this dealer? All
                associated data will be lost and this action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="rounded-xl bg-slate-100 px-6 py-3 font-medium text-app-text transition-colors duration-200 hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="rounded-xl bg-gradient-to-r from-app-button to-app-button-hover px-6 py-3 font-medium text-white shadow-lg transition-all duration-200 hover:from-app-button-hover hover:to-red-700 hover:shadow-xl"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
