import { MessageSquareTextIcon } from "lucide-react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const SellerComment = ({ loadingState, car, translation: t }) => {
  const loading = loadingState
  const comments = car?.sellerComments || car?.sellercomments || ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl shadow-lg">
        <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
          <MessageSquareTextIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold uppercase text-white">{t("sellerComments")}</h3>
          <p className="text-green-100 text-sm">Additional information from seller</p>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {loading ? (
          <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-green-100 dark:border-gray-600">
            <Skeleton height={20} />
            <Skeleton height={20} />
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />
          </div>
        ) : comments ? (
          <div className="group relative overflow-hidden">
            {/* Quote decoration */}
            <div className="absolute top-4 left-4 text-6xl text-green-200 dark:text-green-800 opacity-50 font-serif leading-none">
              "
            </div>
            <div className="absolute bottom-4 right-4 text-6xl text-green-200 dark:text-green-800 opacity-50 font-serif leading-none rotate-180">
              "
            </div>

            <div className="relative p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-green-100 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg font-medium">{comments}</p>
              </div>

              {/* Seller badge */}
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Verified Seller</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Authenticated dealer</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl border border-green-100 dark:border-gray-600">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <MessageSquareTextIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Comments Available</h3>
            <p className="text-gray-600 dark:text-gray-400">
              The seller hasn't provided additional comments for this vehicle.
            </p>
          </div>
        )}
      </div>

      {/* Additional info */}
      <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-green-100 dark:border-gray-600">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-900 dark:text-white">Seller Information</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All seller comments are reviewed for accuracy and authenticity before publication.
        </p>
      </div>
    </div>
  )
}

export default SellerComment
