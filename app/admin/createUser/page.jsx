"use client";
import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaKey,
  FaUserPlus,
  FaChevronDown,
  FaRandom,
  FaInfoCircle,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    pin: "",
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [userRole, setUserRole] = useState("");

  useEffect(() => generateRandomPin(), []);

  const generateRandomPin = () => {
    const randomPin = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData((prev) => ({ ...prev, pin: randomPin }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "pin" ? value.replace(/\D/g, "") : value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.role) {
      newErrors.role = "Please select a role";
    }
    if (!/^\d{4,6}$/.test(formData.pin)) {
      newErrors.pin = "PIN must be 4-6 digits";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const submitData = JSON.stringify({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        pin: formData.pin,
      });

      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        const serverErrors = {};
        const errorMessage = data.error.toLowerCase();

        if (errorMessage.includes("email")) serverErrors.email = data.error;
        else if (errorMessage.includes("password"))
          serverErrors.password = data.error;
        else if (errorMessage.includes("role")) serverErrors.role = data.error;
        else if (errorMessage.includes("pin")) serverErrors.pin = data.error;
        else serverErrors.general = data.error;
        setErrors(serverErrors);
        return;
      }

      setIsSuccess(true);
      setFormData({ email: "", password: "", role: "", pin: "" });
      generateRandomPin();

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      setErrors({ general: "Failed to connect to server. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchUserRole = async () => {
      const res = await fetch("/api/users/me");
      const data = await res.json();

      if (data.user.role !== "superadmin") {
        router.replace("/admin/dashboard");
      } else {
        setUserRole(data.user.role);
      }
    };
    fetchUserRole();
  }, [router]);

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-xl rounded-lg bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-app-text">
              Create New User
            </h1>
            <p className="text-gray-600">
              Add new users to the dealership management system
            </p>
          </div>
          {errors.general && (
            <div className="relative mb-6 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {errors.general}</span>
            </div>
          )}

          {isSuccess && (
            <div className="text-app-bg border-app-bg relative mb-6 rounded border  px-4 py-3">
              <strong className="font-bold">Success!</strong>
              <span className="block sm:inline">
                {" "}
                User created successfully.
              </span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Email Field - Full Width */}
              <div className="form-group md:col-span-2">
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium text-app-text"
                >
                  Email
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-app-button`}
                    placeholder="user@example.com"
                  />
                </div>
                {errors.email && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field - Full Width */}
              <div className="form-group md:col-span-2">
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium text-app-text"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-app-button`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <div className="mt-1 text-sm text-red-500">
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Role Selection - Left Column */}
              <div className="form-group">
                <label
                  htmlFor="role"
                  className="mb-1 block text-sm font-medium text-app-text"
                >
                  Role
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaUserTag className="text-gray-400" />
                  </div>
                  <select
                    id="role"
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleChange}
                    className={`w-full border ${errors.role ? "border-red-500" : "border-gray-300"} appearance-none rounded-md bg-white py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-app-button`}
                  >
                    <option value="" disabled>
                      Select a role
                    </option>
                    <option value="superadmin">Super Admin</option>
                    <option value="user">User</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <FaChevronDown className="text-gray-400" />
                  </div>
                </div>
                {errors.role && (
                  <div className="mt-1 text-sm text-red-500">{errors.role}</div>
                )}
              </div>

              {/* PIN Input - Right Column */}
              <div className="form-group">
                <label
                  htmlFor="pin"
                  className="mb-1 block text-sm font-medium text-app-text"
                >
                  PIN (For Internal Use)
                  <span className="ml-1 inline-block text-gray-500">
                    <FaInfoCircle
                      size={14}
                      title="This PIN is auto-generated"
                    />
                  </span>
                </label>
                <div className="group relative flex">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FaKey className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="pin"
                    name="pin"
                    required
                    value={formData.pin}
                    onChange={handleChange}
                    className={`w-full border ${errors.pin ? "border-red-500" : "border-gray-300"} rounded-l-md py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-app-button`}
                    placeholder="Auto-generated PIN"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={generateRandomPin}
                    className="flex items-center justify-center rounded-r-md border-y border-r border-gray-300 bg-gray-200 px-3 hover:bg-gray-300 focus:outline-none"
                    title="Generate new PIN"
                  >
                    <FaRandom className="text-gray-600" />
                  </button>
                </div>
                {errors.pin && (
                  <div className="mt-1 text-sm text-red-500">{errors.pin}</div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-md bg-app-button py-3 text-white transition duration-200 hover:bg-app-button-hover disabled:opacity-50"
              >
                <FaUserPlus className="mr-2" />
                {isSubmitting ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
