import { MenuIcon } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Tables = ({ loadingState, carData, translation: t }) => {
  const loading = loadingState

  const specifications = [
    { label: "Vehicle", value: carData?.make, icon: "🚗" },
    { label: "Doors", value: carData?.doors || "Not provided", icon: "🚪" },
    { label: "Seats", value: carData?.seats || "Not provided", icon: "💺" },
    { label: "Cylinders", value: carData?.cylinder || "Not provided", icon: "⚙️" },
    { label: "Fuel Type", value: carData?.fuelType || "Not provided", icon: "⛽" },
    { label: "Gearbox", value: carData?.gearbox || "Not provided", icon: "🔧" },
    { label: "Gears", value: carData?.noOfGears || "Not provided", icon: "⚡" },
    { label: "Capacity", value: carData?.engineCapacity || "Not provided", icon: "🔋" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-xl shadow-lg">
        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
          <MenuIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold uppercase text-white">{t("vehicalDetail")}</h3>
          <p className="text-green-100 text-sm">Complete technical specifications</p>
        </div>
      </div>

      {/* Specifications Grid */}
      <div className="grid gap-4">
        {loading
          ? // Loading state
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-lg animate-pulse"></div>
                  <Skeleton width={100} height={20} />
                </div>
                <Skeleton width={120} height={20} />
              </div>
            ))
          : // Actual specifications
            specifications.map((spec, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600 hover:from-green-100 hover:to-emerald-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-200">
                    <span className="text-lg">{spec.icon}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{spec.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm">
                    {spec.value}
                  </span>
                </div>
              </div>
            ))}
      </div>

      {/* Additional Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Verified Information</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All specifications have been verified and are accurate as of the listing date.
        </p>
      </div>
    </div>
  )
}

export default Tables
