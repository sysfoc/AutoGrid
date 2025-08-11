import { IoSpeedometerOutline } from "react-icons/io5"
import { GiGasPump, GiMagicLamp } from "react-icons/gi"
import { PiGasCanLight } from "react-icons/pi"
import { GrMapLocation } from "react-icons/gr"
import { TbManualGearbox } from "react-icons/tb"
import { Table, TableBody, TableCell, TableRow } from "flowbite-react"
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
  const featureChunks = chunkArray(car.features || [], 2)
  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div>
            <IoSpeedometerOutline fontSize={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              {loading ? <Skeleton /> : car.kms}
            </span>
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              Kms
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <PiGasCanLight fontSize={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              On
            </span>
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              {loading ? <Skeleton /> : car.fuelType}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <GiGasPump fontSize={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              {loading ? <Skeleton /> : car.fuelTankFillPrice}
            </span>
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              To Fill
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <GrMapLocation fontSize={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              {loading ? <Skeleton /> : car.fuelCapacityPerTank}
            </span>
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              Average Per Tank
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <TbManualGearbox fontSize={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              {loading ? <Skeleton /> : car.noOfGears}
            </span>
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              Gears
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div>
            <GiMagicLamp fontSize={25} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              {loading ? <Skeleton className="h-[15px] w-[50px]" /> : car.cylinder}
            </span>
            <span className="text-sm font-semibold text-app-text dark:text-gray-300">
              {" "}
              {/* Changed color */}
              Cylinder
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 border-b-2 border-app-button dark:border-gray-700"></div> {/* Changed color */}
      {car.features && car.features.length > 0 && (
        <div className="my-3">
          <div className="flex items-center gap-2 bg-app-button p-3 dark:bg-gray-700">
            {" "}
            {/* Changed color */}
            <div>
              <BsFillBookmarkFill fontSize={20} className="text-white" />
            </div>
            <h3 className="text-lg font-bold uppercase text-white">{t("vehicalFeatures")}</h3>
          </div>
          <Table hoverable className="mt-3 dark:bg-gray-700">
            <TableBody className="divide-y">
              {featureChunks.map((chunk, rowIndex) => (
                <TableRow key={rowIndex} className="grid grid-cols-2">
                  {chunk.map((feature, colIndex) => (
                    <TableCell key={colIndex}>{loading ? <Skeleton height={25} /> : feature}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <div className="mt-8 flex items-center gap-2 bg-app-button p-3 dark:bg-gray-700">
        {" "}
        {/* Changed color */}
        <div>
          <MdLocationOn fontSize={25} className="text-white" />
        </div>
        <h3 className="text-lg font-bold uppercase text-white">{t("findUs")}</h3>
      </div>
      <div>
        <Table hoverable className="mt-3 dark:bg-gray-700">
          <TableBody className="divide-y">
            {loading ? (
              <>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    Location
                  </TableCell>
                  <TableCell>
                    <Skeleton height={25} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    Contact
                  </TableCell>
                  <TableCell>
                    <Skeleton height={25} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    Licence
                  </TableCell>
                  <TableCell>
                    <Skeleton height={25} />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    ABN
                  </TableCell>
                  <TableCell>
                    <Skeleton height={25} />
                  </TableCell>
                </TableRow>
              </>
            ) : carData ? (
              <>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    Location
                  </TableCell>
                  <TableCell>{carData.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    Contact
                  </TableCell>
                  <TableCell>{carData.contact}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    Licence
                  </TableCell>
                  <TableCell>{carData.licence}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold text-app-text dark:text-gray-200">
                    {" "}
                    {/* Changed color */}
                    ABN
                  </TableCell>
                  <TableCell>{carData.abn}</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={2}>No dealer information available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Features
