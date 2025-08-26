const SellerComment = ({ car, translation: t }) => {
  const comments = car?.sellerComments || car?.sellercomments || ""

  return (
    <div className="mt-8">
      <div className="h-0.5 w-full bg-teal-900 mb-6"></div>

      <h3 className="text-lg font-bold uppercase text-gray-900 dark:text-white mb-4">
        {t("sellerComments") || "Seller's Notes"}
      </h3>

      {comments ? (
        <p className="text-gray-700 text-sm dark:text-gray-300 leading-relaxed">
          {comments}
        </p>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 italic">
          No comments provided by the seller.
        </p>
      )}
    </div>
  )
}

export default SellerComment
