"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react"; 
import Link from 'next/link';
import {
  FaCheck,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaPercent,
  FaCalculator,
  FaClock,
  FaUsers,
} from "react-icons/fa6";

export default function Home() {
  const t = useTranslations("carFinance");
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "Why sell my car with Auto Trader?",
      answer:
        "With Auto Trader, you are twice as likely to sell your car within a week. We also have more options than anywhere else to sell your car, so you are in control. Part Exchange, The easy way to part exchange your old car for new one. 2. Create an advert, You are in full control with your own sale. You can create and upload your advert in just three steps, and the size of our audience means you will get your car in front of more buyers than on any other site.",
    },
    {
      question: "What paperwork do I need to sell my car?",
      answer:
        "When you sell your car, you will need to hand over the car handbook, the service logbook (plus receipts) and, if the car is over three years old, the MOT certificate. Buyers may also appreciate older MOT certificates and maintenance receipts.",
    },
    {
      question: "Where can I sell my car?",
      answer:
        "You could sell it directly to a dealership or auction house, or you can sell it online. If you have got the time to wait for the right buyer, selling your car privately on a site like Auto Trader can earn you more money.",
    },
    {
      question: "What is my car worth?",
      answer:
        "Auto Trader free car valuation tool gives you the right guide price. We combine data from thousands of live adverts and dealer websites, plus values from car auctions, and ex-fleet and leasing vehicles. As our guide price represents the entire market and our data is updated daily, your quote is fair, priced to sell, and accurate.",
    },
  ];

  const features = [
    {
      icon: <FaPercent className="text-2xl" />,
      title: "Competitive Rates",
      description: "Starting from 3.9% APR with flexible terms",
    },
    {
      icon: <FaCalculator className="text-2xl" />,
      title: "Easy Calculator",
      description: "Instant pre-approval in under 60 seconds",
    },
    {
      icon: <FaClock className="text-2xl" />,
      title: "Quick Process",
      description: "Get approved and funded within 24 hours",
    },
    {
      icon: <FaUsers className="text-2xl" />,
      title: "Expert Support",
      description: "Dedicated finance specialists to guide you",
    },
  ];

  const loanTypes = [
    {
      title: "New Car Loans",
      description: "Finance your dream new vehicle with competitive rates",
      rate: "From 3.9% APR",
      features: [
        "Up to 7 years term",
        "No early payment fees",
        "Same day approval",
      ],
    },
    {
      title: "Used Car Loans",
      description: "Quality pre-owned vehicles with flexible financing",
      rate: "From 4.9% APR",
      features: [
        "Up to 5 years term",
        "Vehicles up to 10 years old",
        "Quick processing",
      ],
    },
    {
      title: "Refinancing",
      description: "Lower your current car loan payments",
      rate: "From 3.5% APR",
      features: [
        "Reduce monthly payments",
        "Better interest rates",
        "No hidden fees",
      ],
    },
  ];

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full bg-blue-600/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <FaStar className="mr-2 text-yellow-400" />
                Trusted by 50,000+ customers
              </div>
              <div>
                <h1 className="text-5xl font-bold leading-tight lg:text-6xl">
                  Drive Your
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    {" "}
                    Dream Car{" "}
                  </span>
                  Today
                </h1>
                <p className="mt-6 text-xl leading-relaxed text-blue-100">
                  Get pre-approved for your car loan in minutes with competitive
                  rates starting from 3.9% APR. No hidden fees, flexible terms,
                  and expert support every step of the way.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">3.9%</div>
                  <div className="text-sm text-blue-200">Starting APR</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">60 sec</div>
                  <div className="text-sm text-blue-200">Pre-approval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24hr</div>
                  <div className="text-sm text-blue-200">Funding</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-yellow-400/20 to-orange-500/20 blur-xl"></div>
              <div className="relative rounded-3xl bg-white/10 p-6 backdrop-blur-sm">
                <Image
                  src="/Luxury SUV.webp"
                  alt="Luxury SUV"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Why Choose Our Car Finance?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Experience the difference with our customer-first approach
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900/50">
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-20 dark:from-gray-800 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="space-y-8">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Financing Made Simple & Transparent
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We believe car financing should be straightforward, fair, and
                tailored to your needs. That is why we have streamlined our
                process to get you behind the wheel faster.
              </p>
              <div className="space-y-6">
                {[
                  "No hidden fees or surprise charges",
                  "Flexible repayment terms up to 7 years",
                  "Pre-approval without affecting credit score",
                  "Competitive rates for all credit types",
                  "Online application takes just 5 minutes",
                  "Dedicated support throughout the process",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                      <FaCheck className="text-xs" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-xl"></div>
              <div className="relative rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
                <Image
                  src="/sydney.jpg"
                  alt="Happy customer"
                  width={500}
                  height={400}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan Types Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Choose Your Perfect Loan
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Tailored financing solutions for every situation
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {loanTypes.map((loan, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-blue-900/20 dark:to-indigo-900/20"></div>
                <div className="relative">
                  <div className="mb-4 inline-block rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                    {loan.rate}
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                    {loan.title}
                  </h3>
                  <p className="mb-6 text-gray-600 dark:text-gray-300">
                    {loan.description}
                  </p>
                  <ul className="space-y-3">
                    {loan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <FaCheck className="text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

<section className="bg-gradient-to-r from-gray-900 to-blue-900 py-20 text-white">
  <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
    <h2 className="text-4xl font-bold sm:text-5xl">Ready to Get Started?</h2>
    <p className="mt-6 text-xl text-blue-100">
      Join thousands of satisfied customers who found their perfect car loan with us.
      Get pre-approved in minutes and drive away today.
    </p>
    <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Link
        href="/contact"
        className="rounded-xl border-2 border-white/30 bg-white/10 px-10 py-4 text-lg font-semibold backdrop-blur-sm transition-all hover:bg-white/20 text-white text-center"
      >
        Contact us
      </Link>
    </div>
  </div>
</section>

      {/* Educational Cards */}
      <section className="bg-gray-50 py-20 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Learn More About Car Loans
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Expert insights to help you make informed decisions
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Can I get a car loan with bad credit?",
                description:
                  "Your credit score is not the only factor that lenders consider when deciding whether to approve you for a car loan.",
                image: "/Luxury SUV.webp",
              },
              {
                title: "How to calculate car loan payments?",
                description:
                  "Understanding the key factors that affect your monthly payments can help you budget effectively.",
                image: "/Luxury SUV.webp",
              },
              {
                title: "New vs Used Car Financing",
                description:
                  "Compare the benefits and considerations of financing new versus pre-owned vehicles.",
                image: "/Luxury SUV.webp",
              },
              {
                title: "Car Loan Pre-approval Guide",
                description:
                  "Learn how pre-approval works and why it gives you an advantage when shopping for cars.",
                image: "/Luxury SUV.webp",
              },
            ].map((card, index) => (
              <article
                key={index}
                className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl dark:bg-gray-800"
              >
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    width={400}
                    height={250}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">
                    {card.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {card.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Get answers to common questions about car financing
            </p>
          </div>
          <div className="mt-12 space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-6 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </span>
                  <div className="ml-4 flex-shrink-0">
                    {activeIndex === index ? (
                      <FaChevronUp className="h-5 w-5 text-blue-600" />
                    ) : (
                      <FaChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>
                {activeIndex === index && (
                  <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}