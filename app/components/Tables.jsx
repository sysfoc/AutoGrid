import { Table, TableBody, TableCell, TableRow } from "flowbite-react"
import { MenuIcon } from "lucide-react" 
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Tables = ({ loadingState, carData, translation: t }) => {
  const loading = loadingState
  return (
    <div>
      <div className="flex items-center gap-2 bg-app-button p-3 dark:bg-gray-700">
        {" "}
        {/* Changed color */}
        <div>
          <MenuIcon fontSize={25} className="text-white" /> {/* Changed icon */}
        </div>
        <h3 className="text-lg font-bold uppercase text-white">{t("vehicalDetail")}</h3>
      </div>
      <Table hoverable className="mt-3 dark:bg-gray-700">
        {loading ? (
          <TableBody className="divide-y">
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                <Skeleton height={25} />
              </TableCell>
              <TableCell>
                <Skeleton height={25} />
              </TableCell>
            </TableRow>
          </TableBody>
        ) : (
          <TableBody className="divide-y">
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Vehicle
              </TableCell>
              <TableCell>{carData.make}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Doors
              </TableCell>
              <TableCell>{carData.doors || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Seats
              </TableCell>
              <TableCell>{carData.seats || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Cylinders
              </TableCell>
              <TableCell>{carData.cylinder || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Fuel Type
              </TableCell>
              <TableCell>{carData.fuelType || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Gearbox
              </TableCell>
              <TableCell>{carData.gearbox || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Gears
              </TableCell>
              <TableCell>{carData.noOfGears || "Not provided"}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-semibold text-app-text dark:text-gray-200">
                {" "}
                {/* Changed color */}
                Capacity
              </TableCell>
              <TableCell>{carData.engineCapacity || "Not provided"}</TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </div>
  )
}

export default Tables