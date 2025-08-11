"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/UserContext";
import { IoLockClosedOutline, IoMail, IoCopyOutline } from "react-icons/io5";
import { MdFiberPin, MdAdminPanelSettings, MdPerson } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    role: "",
    pin: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeCredential, setActiveCredential] = useState<
    "superadmin" | "user"
  >("superadmin"); // Toggle state
  const { refreshUser } = useAuth();

  const onLogin = async () => {
    try {
      setError("");
      setLoading(true);
      toast.info("Authenticating your credentials...");
      const response = await axios.post("/api/users/login", user, {
        withCredentials: true,
      });

      toast.success(
        `${response.data.role.charAt(0).toUpperCase() + response.data.role?.slice(1)} Login successful!`,
      );

      const receivedRole = response.data.role?.toLowerCase()?.trim();
      if (!receivedRole) {
        throw new Error("No role received from server");
      }
      await refreshUser();
      router.push(
        receivedRole === "superadmin" ? "/admin/dashboard" : "/admin/dashboard",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
      console.error("Login error:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  useEffect(() => {
    setButtonDisabled(!user.email || !user.password);
  }, [user]);

  const demoCredentials: {
    superadmin: {
      email: string;
      password: string;
      pin: string;
      role: string;
    };
    user: {
      email: string;
      password: string;
      pin: string;
      role: string;
    };
  } = {
    superadmin: {
      email: "sysfoc_admin@gmail.com",
      password: "sysfoc_admin",
      pin: "123456",
      role: "superadmin",
    },
    user: {
      email: "Sysfoc_User@gmail.com",
      password: "Sysfoc_User@gmail.com",
      pin: "123456",
      role: "user",
    },
  };

  const currentCredentials = demoCredentials[activeCredential];

  return (
    <div className="mt-24 flex min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-red-100 dark:from-gray-900 dark:via-red-900/20 dark:to-gray-900 md:mt-32">
      <div className="relative hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-red-900 p-12 text-white dark:from-red-800 dark:via-red-900 dark:to-red-950 lg:flex lg:w-1/2">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-white via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-32 translate-y-32 transform rounded-full bg-white opacity-5"></div>
          <div className="absolute right-20 top-20 h-64 w-64 rounded-full bg-white opacity-5"></div>
        </div>

        <div className="relative z-10 w-full max-w-lg text-center">
          <div className="mb-8">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold">
              {loading ? "Signing In..." : "Welcome Back"}
            </h1>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-center">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m0 0a2 2 0 012 2m-2-2a2 2 0 00-2 2m0 0a2 2 0 01-2 2m2-2H9m12 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6a2 2 0 012-2h12zM9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                />
              </svg>
              <h2 className="text-lg font-semibold">Demo Credentials</h2>
            </div>

            <div className="mb-4 flex rounded-lg bg-white/10 p-1">
              <button
                onClick={() => setActiveCredential("superadmin")}
                className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCredential === "superadmin"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-red-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <MdAdminPanelSettings className="mr-1.5 h-4 w-4" />
                Admin
              </button>
              <button
                onClick={() => setActiveCredential("user")}
                className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCredential === "user"
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-red-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <MdPerson className="mr-1.5 h-4 w-4" />
                Staff
              </button>
            </div>
            <div className="space-y-3">
              <div className="group flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-red-200">
                    Email
                  </p>
                  <p className="truncate font-mono text-sm text-white">
                    {currentCredentials.email}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(currentCredentials.email, "Email")
                  }
                  className="ml-2 rounded-md p-1.5 opacity-60 transition-colors hover:bg-white/10 hover:opacity-100"
                >
                  <IoCopyOutline className="h-4 w-4" />
                </button>
              </div>

              <div className="group flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-red-200">
                    Password
                  </p>
                  <p className="truncate font-mono text-sm text-white">
                    {currentCredentials.password}
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(currentCredentials.password, "Password")
                  }
                  className="ml-2 rounded-md p-1.5 opacity-60 transition-colors hover:bg-white/10 hover:opacity-100"
                >
                  <IoCopyOutline className="h-4 w-4" />
                </button>
              </div>

              <div className="group flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-red-200">
                    Security PIN
                  </p>
                  <p className="truncate font-mono text-sm text-white">
                    {currentCredentials.pin}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(currentCredentials.pin, "PIN")}
                  className="ml-2 rounded-md p-1.5 opacity-60 transition-colors hover:bg-white/10 hover:opacity-100"
                >
                  <IoCopyOutline className="h-4 w-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => setUser(currentCredentials)}
              className="mt-4 flex w-full items-center justify-center rounded-lg border border-white/20 bg-white/15 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/25"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Auto-Fill Form
            </button>

            <div className="mt-3 rounded-lg bg-white/5 p-2">
              <p className="text-center text-xs text-red-100">
                Click credentials to copy • Use toggle to switch roles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex w-full items-start justify-center p-4 md:p-2 lg:w-1/2 ">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-red-700 to-red-800 dark:from-red-800 dark:to-red-900">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              {loading ? "Signing In..." : "Welcome Back"}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please sign in to your account
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl backdrop-blur-sm dark:border-gray-700/20 dark:bg-gray-800/80">
            {error && (
              <div className="mb-6 flex items-start rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/30">
                <svg
                  className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-red-800 dark:text-red-200">
                  {error}
                </span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <IoMail className="text-red-700 dark:text-red-400" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white/50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => {
                      setUser({ ...user, email: e.target.value });
                      setError("");
                    }}
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <IoLockClosedOutline className="text-red-700 dark:text-red-400" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white/50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => {
                      setUser({ ...user, password: e.target.value });
                      setError("");
                    }}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pin"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Security PIN
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MdFiberPin className="text-red-700 dark:text-red-400" />
                  </div>
                  <input
                    className="w-full rounded-lg border border-gray-300 bg-white/50 py-3 pl-10 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-600 dark:border-gray-600 dark:bg-gray-700/50 dark:text-white dark:placeholder-gray-400"
                    id="pin"
                    type="text"
                    value={user.pin || ""}
                    onChange={(e) => {
                      setUser({ ...user, pin: e.target.value });
                      setError("");
                    }}
                    placeholder="Enter your security PIN"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-5 dark:border-gray-700">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    onClick={() => setUser(demoCredentials.superadmin)}
                    className="flex transform items-center justify-center rounded-lg bg-gradient-to-r from-red-700 to-red-800 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-red-800 hover:to-red-900 hover:shadow-xl dark:from-red-800 dark:to-red-900 dark:hover:from-red-900 dark:hover:to-red-950"
                  >
                    <MdAdminPanelSettings className="mr-2 h-4 w-4" />
                    SuperAdmin
                  </button>

                  <button
                    onClick={() => setUser(demoCredentials.user)}
                    className="flex transform items-center justify-center rounded-lg bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-gray-700 hover:to-gray-800 hover:shadow-xl dark:from-gray-700 dark:to-gray-800 dark:hover:from-gray-800 dark:hover:to-gray-900"
                  >
                    <MdPerson className="mr-2 h-4 w-4" />
                    Staff Login
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                onClick={onLogin}
                disabled={buttonDisabled || loading}
                className="w-full transform rounded-lg bg-gradient-to-r from-red-700 to-red-800 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-red-800 hover:to-red-900 hover:shadow-xl focus:outline-none focus:ring-0 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50 dark:from-red-800 dark:to-red-900 dark:hover:from-red-900 dark:hover:to-red-950 dark:focus:ring-offset-gray-800"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}