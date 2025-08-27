"use client";
import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

const BarChart = () => {
  const [chartData, setChartData] = useState([
    ["Month", "New Listings", "Total Inventory"],
    ["Loading...", 0, 0],
  ]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await fetch("/api/cars");
        const data = await response.json();

        if (data.cars && data.cars.length > 0) {
          // Process cars by month based on createdAt
          const monthlyData = {};
          const currentYear = new Date().getFullYear();

          // Initialize all months
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          months.forEach((month) => {
            monthlyData[month] = { newListings: 0, totalInventory: 0 };
          });

          // Calculate cumulative inventory and monthly additions
          let cumulativeInventory = 0;

          data.cars.forEach((car) => {
            const carDate = new Date(car.createdAt);
            if (carDate.getFullYear() === currentYear) {
              const monthIndex = carDate.getMonth();
              const monthName = months[monthIndex];
              monthlyData[monthName].newListings += 1;
            }
          });

          // Calculate cumulative inventory for each month
          months.forEach((month) => {
            cumulativeInventory += monthlyData[month].newListings;
            monthlyData[month].totalInventory = cumulativeInventory;
          });

          // Convert to chart format
          const chartDataArray = months.map((month) => [
            month,
            monthlyData[month].newListings,
            monthlyData[month].totalInventory,
          ]);

          setChartData([
            ["Month", "New Listings", "Total Inventory"],
            ...chartDataArray,
          ]);

          // Calculate total inventory value
          const totalInventoryValue = data.cars.reduce((sum, car) => {
            return sum + (car.price || 0);
          }, 0);

          setTotalValue(totalInventoryValue);
        } else {
          setChartData([
            ["Month", "New Listings", "Total Inventory"],
            ["No Data", 0, 0],
          ]);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
        setChartData([
          ["Month", "New Listings", "Total Inventory"],
          ["Error", 0, 0],
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, []);

  const options = {
    chart: {
      title: "Vehicle Inventory Analytics",
      subtitle: "Monthly new listings and cumulative inventory growth",
    },
    bars: "vertical",
    vAxis: {
      title: "Number of Vehicles",
      minValue: 0,
      gridlines: {
        count: 8,
        color: "#f0f0f0",
      },
      textStyle: {
        fontSize: 11,
        fontName: "Inter",
      },
    },
    hAxis: {
      title: "Months",
      textStyle: {
        fontSize: 11,
        fontName: "Inter",
      },
    },
    colors: ["#3b82f6", "#10b981"],
    legend: {
      position: "top",
      alignment: "center",
      textStyle: {
        fontSize: 12,
        fontName: "Inter",
      },
    },
    chartArea: {
      left: 60,
      top: 80,
      width: "85%",
      height: "70%",
    },
    backgroundColor: "transparent",
    titleTextStyle: {
      fontSize: 14,
      fontName: "Inter",
      bold: true,
    },
    animation: {
      duration: 1000,
      easing: "out",
      startup: true,
    },
    bar: { groupWidth: "75%" },
    isStacked: false,
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">
            Inventory Growth Analytics
          </h3>
          <div className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-600">
            Monthly Overview
          </div>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Track new listings and cumulative inventory growth
        </p>
      </div>

      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="p-2">
          <Chart
            chartType="Bar"
            data={chartData}
            options={options}
            width="100%"
            height="300px"
          />
        </div>
      )}

      <div className="border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
        <div className="flex items-center justify-between">
          <span>Total Inventory Value</span>
          <span className="text-app-bg font-medium">
            {formatCurrency(totalValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
