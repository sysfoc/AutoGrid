"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();
        setCars(data.cars);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleStatusChange = async (carId, newStatus) => {
    try {
      const response = await fetch("/api/cars", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ carId, status: newStatus }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      toast.success(data.message);
      setCars((prevCars) =>
        prevCars.map((car) =>
          car._id === carId ? { ...car, status: newStatus } : car,
        ),
      );
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
            <span className="ml-3 font-medium text-slate-600">
              Loading car listings...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="mb-2 text-3xl font-bold text-app-text">
                  Manage Car Listings
                </h1>
                <p className="text-slate-600">
                  Review and manage car listing approvals
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Listings</p>
                  <p className="text-2xl font-bold text-app-button">
                    {cars.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Approved</p>
                  <p className="text-app-bg text-2xl font-bold">
                    {cars.filter((car) => car.status === 1).length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {cars.filter((car) => car.status === 0).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
          {cars.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                <svg
                  className="h-12 w-12 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-app-text">
                No car listings found
              </h3>
              <p className="text-slate-500">
                There are currently no cars pending approval.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table hoverable className="min-w-full">
                <TableHead className="bg-slate-50">
                  <TableHeadCell className="px-6 py-4 font-semibold text-app-text">
                    Featured Photo
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-4 font-semibold text-app-text">
                    Vehicle Details
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-4 font-semibold text-app-text">
                    Location
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-4 font-semibold text-app-text">
                    User Info
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-4 font-semibold text-app-text">
                    Status
                  </TableHeadCell>
                  <TableHeadCell className="px-6 py-4 font-semibold text-app-text">
                    Actions
                  </TableHeadCell>
                </TableHead>
                <TableBody className="divide-y divide-slate-200">
                  {cars.map((car) => (
                    <TableRow
                      key={car._id}
                      className="bg-white transition-colors duration-200 hover:bg-slate-50"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="relative">
                          <Image
                            src={car.imageUrls?.[0]}
                            width={100}
                            height={75}
                            alt="Car Image"
                            className="rounded-xl border border-slate-200 object-cover shadow-md"
                          />
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="space-y-1">
                          <h4 className="text-lg font-semibold text-app-text">
                            {car.model}
                          </h4>
                          <p className="font-medium text-slate-600">
                            {car.make}
                          </p>
                          <p className="inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">
                            {car.slug}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="h-4 w-4 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="font-medium text-app-text">
                            {car.location || "Unknown"}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
                            <span className="text-sm font-semibold text-indigo-600">
                              {car.userId?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                          <span className="font-mono text-sm text-app-text">
                            {car.userId}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        {car.status === 1 ? (
                          <div className="flex items-center space-x-2">
                            <div className="bg-app-bg h-3 w-3 rounded-full"></div>
                            <span className="text-app-bg rounded-full  px-3 py-1 text-sm font-semibold">
                              Approved
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
                              Pending
                            </span>
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-x-3">
                          {car.status === 1 ? (
                            <Button
                              color="warning"
                              size="sm"
                              onClick={() => handleStatusChange(car._id, 0)}
                              className="rounded-lg bg-orange-500 px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-orange-600 hover:shadow-lg"
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
                                  strokeWidth="2"
                                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636"
                                />
                              </svg>
                              Unapprove
                            </Button>
                          ) : (
                            <Button
                              color="success"
                              size="sm"
                              onClick={() => handleStatusChange(car._id, 1)}
                              className="rounded-lg bg-app-button px-4 py-2 font-medium text-white shadow-md transition-colors duration-200 hover:bg-app-button-hover hover:shadow-lg"
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
                                  strokeWidth="2"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Approve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
