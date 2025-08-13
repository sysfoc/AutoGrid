import { IoSpeedometerOutline } from "react-icons/io5"
import { GiGasPump, GiMagicLamp } from "react-icons/gi"
import { PiGasCanLight } from "react-icons/pi"
import { GrMapLocation } from "react-icons/gr"
import { TbManualGearbox } from "react-icons/tb"
import { BsFillBookmarkFill } from "react-icons/bs"
import { MdLocationOn } from "react-icons/md"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Features = ({ loadingState, carData, car, translation: t }) => {
  const loading = loadingState

  const chunkArray = (array, chunkSize) => {
    const result = []
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize))
    }
    return result
  }

  const featureChunks = chunkArray(car?.features || [], 2)

  const keyStats = [
    {
      icon: <IoSpeedometerOutline className="h-6 w-6 text-green-600 dark:text-green-400" />,
      label: "Mileage",
      value: car?.kms,
      unit: "Kms",
      color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20",
    },
    {
      icon: <PiGasCanLight className="h-6 w-6 text-green-600 dark:text-green-400" />,
      label: "Fuel Type",
      value: "On",
      unit: car?.fuelType,
      color: "from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20",
    },
    {
      icon: <GiGasPump className="h-6 w-6 text-green-600 dark:text-green-400" />,
      label: "Tank Fill",
      value: car?.fuelTankFillPrice,
      unit: "To Fill",
      color: "from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20",
    },
    {
      icon: <GrMapLocation className="h-6 w-6 text-green-600 dark:text-green-400" />,
      label: "Average",
      value: car?.fuelCapacityPerTank,
      unit: "Per Tank",
      color: "from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20",
    },
    {
      icon: <TbManualGearbox className="h-6 w-6 text-green-600 dark:text-green-400" />,
      label: "Transmission",
      value: car?.noOfGears,
      unit: "Gears",
      color: "from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20",
    },
    {
      icon: <GiMagicLamp className="h-6 w-6 text-green-600 dark:text-green-400" />,
      label: "Engine",
      value: car?.cylinder,
      unit: "Cylinder",
      color: "from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20",
    },
  ]

  const dealerInfo = [
    { label: "Location", value: carData?.address, icon: "📍" },
    { label: "Contact", value: carData?.contact, icon: "📞" },
    { label: "Licence", value: carData?.licence, icon: "📋" },
    { label: "ABN", value: carData?.abn, icon: "🏢" },
  ]

  return (
    <div className="space-y-8">
      {/* Key Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyStats.map((stat, index) => (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.color} p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-green-100 dark:border-gray-600`}
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {loading ? <Skeleton width={60} /> : stat.value || "N/A"}
                  </span>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.unit}</span>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 w-8 h-8 bg-green-500/20 rounded-full animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-green-200 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center">
          <div className="bg-white dark:bg-gray-800 px-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Vehicle Features */}
      {car?.features && car.features.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl shadow-lg">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <BsFillBookmarkFill className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold uppercase text-white">{t("vehicalFeatures")}</h3>
              <p className="text-green-100 text-sm">Premium features included</p>
            </div>
          </div>

          <div className="grid gap-4">
            {featureChunks.map((chunk, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {chunk.map((feature, colIndex) => (
                  <div
                    key={colIndex}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600 hover:from-green-100 hover:to-emerald-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <svg
                        className="w-4 h-4 text-green-600 dark:text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {loading ? <Skeleton width={150} /> : feature}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dealer Information */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl shadow-lg">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <MdLocationOn className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold uppercase text-white">{t("findUs")}</h3>
            <p className="text-green-100 text-sm">Dealer contact information</p>
          </div>
        </div>

        <div className="grid gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-200 dark:bg-green-800 rounded-lg animate-pulse"></div>
                  <Skeleton width={80} height={20} />
                </div>
                <Skeleton width={150} height={20} />
              </div>
            ))
          ) : carData ? (
            dealerInfo.map((info, index) => (
              <div
                key={index}
                className="group flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600 hover:from-green-100 hover:to-emerald-100 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800/50 transition-colors duration-200">
                    <span className="text-lg">{info.icon}</span>
                  </div>
                  <span className="font-semibold text-gray-900 dark:text-white">{info.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg shadow-sm">
                    {info.value || "Not provided"}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">No dealer information available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Features
