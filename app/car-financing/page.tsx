"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, Calculator, Car, DollarSign } from "lucide-react"
import Link from "next/link"

function FinancingCalculatorContent() {
  const searchParams = useSearchParams()

  // Car data from URL parameters
  const carMake = searchParams.get("make") || "Unknown"
  const carModel = searchParams.get("model") || "Unknown"
  const carPrice = Number.parseFloat(searchParams.get("price") || "0")
  const carYear = searchParams.get("year") || ""
  const carImage = searchParams.get("image") || "/placeholder.svg?height=200&width=300"

  // Calculator state
  const [downPayment, setDownPayment] = useState(carPrice * 0.2)
  const [loanTerm, setLoanTerm] = useState(60)
  const [interestRate, setInterestRate] = useState(7.5)
  const [monthlyPayment, setMonthlyPayment] = useState(0)
  const [totalInterest, setTotalInterest] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  // Calculate financing details
  useEffect(() => {
    const principal = carPrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const numPayments = loanTerm

    if (principal > 0 && monthlyRate > 0) {
      const monthly =
        (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
        (Math.pow(1 + monthlyRate, numPayments) - 1)

      const totalPaid = monthly * numPayments
      const interest = totalPaid - principal

      setMonthlyPayment(monthly)
      setTotalInterest(interest)
      setTotalAmount(totalPaid + downPayment)
    } else {
      setMonthlyPayment(0)
      setTotalInterest(0)
      setTotalAmount(carPrice)
    }
  }, [carPrice, downPayment, loanTerm, interestRate])

  return (
    <div className="min-h-screen mt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Car Financing Calculator</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Car Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Car className="w-5 h-5 mr-2 text-blue-600" />
                Vehicle Details
              </h2>
            </div>
            <div className="p-4">
              <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100 mb-4">
                <img
                  src={carImage || "/placeholder.svg"}
                  alt={`${carMake} ${carModel}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Vehicle</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {carYear} {carMake} {carModel}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-blue-600">${carPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Controls */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                Loan Parameters
              </h2>
            </div>
            <div className="p-4 space-y-6">
              {/* Down Payment */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Down Payment</label>
                  <span className="text-sm font-semibold text-blue-600">${downPayment.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={carPrice * 0.5}
                  step="1000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>$0</span>
                  <span>{((downPayment / carPrice) * 100).toFixed(1)}%</span>
                  <span>${(carPrice * 0.5).toLocaleString()}</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Loan Term</label>
                  <span className="text-sm font-semibold text-blue-600">{loanTerm} months</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="84"
                  step="12"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>1 year</span>
                  <span>{(loanTerm / 12).toFixed(1)} years</span>
                  <span>7 years</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div className="space-y-2">
                <label htmlFor="interest-rate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Rate (APR)
                </label>
                <div className="relative">
                  <input
                    id="interest-rate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number.parseFloat(e.target.value) || 0)}
                    min="0"
                    max="30"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  <span className="absolute right-3 top-2 text-gray-500 dark:text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                Payment Summary
              </h2>
            </div>
            <div className="p-4 space-y-4">
              {/* Monthly Payment - Highlighted */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Payment</p>
                <p className="text-3xl font-bold text-blue-600">
                  ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Other Details */}
              <div className="grid grid-cols-1 gap-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Amount Financed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${(carPrice - downPayment).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Interest</span>
                  <span className="font-semibold text-orange-600">
                    ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ${totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Loan Term</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {loanTerm} months ({(loanTerm / 12).toFixed(1)} years)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default function CarFinancingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading calculator...</p>
          </div>
        </div>
      }
    >
      <FinancingCalculatorContent />
    </Suspense>
  )
}
