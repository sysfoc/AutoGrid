"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Shield,
  DollarSign,
  Users,
  Clock,
  Star,
  ChevronDown,
  ArrowRight,
  Phone,
  Car,
  CreditCard,
  CheckCircle,
  Gauge,
  Lock,
  LifeBuoy,
  ClipboardList,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

export default function SellMyCar() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const router = useRouter()

  const benefits = [
    {
      icon: <DollarSign className="text-2xl" />,
      title: "Best Market Price",
      description: "We help you get the highest value for your vehicle with professional valuation",
    },
    {
      icon: <Clock className="text-2xl" />,
      title: "Quick Process",
      description: "Our streamlined process makes selling faster than traditional methods",
    },
    {
      icon: <Shield className="text-2xl" />,
      title: "Secure Process",
      description: "Complete protection with verified processes and secure transactions",
    },
    {
      icon: <Users className="text-2xl" />,
      title: "Expert Network",
      description: "Access to our extensive network of automotive professionals",
    },
  ]

  const howItWorks = [
    {
      step: "01",
      icon: <Phone className="text-3xl" />,
      title: "Contact Our Team",
      description: "Get in touch with our automotive experts who will guide you through the entire selling process.",
      tip: "Pro tip: Have your vehicle details ready including make, model, year, and mileage",
    },
    {
      step: "02",
      icon: <ClipboardList className="text-3xl" />,
      title: "Professional Assessment",
      description: "Our experts will evaluate your vehicle and provide a comprehensive market analysis.",
      tip: "We consider all factors including condition, history, and current market trends",
    },
    {
      step: "03",
      icon: <CheckCircle className="text-3xl" />,
      title: "Selling Assistance",
      description: "We help facilitate the sale through our network of dealers and automotive professionals.",
      tip: "Our team handles all the paperwork and ensures a smooth transaction process",
    },
  ]

  const guides = [
    {
      icon: <Car className="text-4xl text-gray-700" />,
      title: "Car Preparation",
      description: "Learn how to prepare your vehicle to maximize its appeal and value in the market.",
      color: "from-gray-500 to-gray-600",
    },
    {
      icon: <TrendingUp className="text-4xl text-gray-700" />,
      title: "Market Analysis",
      description: "Understand current market trends and how they affect your vehicle value.",
      color: "from-gray-500 to-gray-600",
    },
    {
      icon: <CreditCard className="text-4xl text-gray-700" />,
      title: "Transaction Security",
      description: "Learn about secure payment methods and transaction protection strategies.",
      color: "from-gray-500 to-gray-600",
    },
    {
      icon: <AlertTriangle className="text-4xl text-gray-700" />,
      title: "Important Considerations",
      description: "Key factors to consider when selling your vehicle through professional channels.",
      color: "from-gray-500 to-gray-600",
    },
  ]

  const features = [
    {
      icon: <Gauge className="text-3xl" />,
      title: "Expert Consultation",
      description: "Get professional advice from automotive experts",
    },
    {
      icon: <Lock className="text-3xl" />,
      title: "Secure Process",
      description: "All transactions are handled with professional oversight",
    },
    {
      icon: <LifeBuoy className="text-3xl" />,
      title: "24/7 Support",
      description: "Our team is available to assist you throughout the process",
    },
  ]

  const faqs = [
    {
      question: "How does the car selling process work on your platform?",
      answer:
        "Our platform connects you with automotive professionals who specialize in vehicle sales. You contact our team, we assess your vehicle, and then help facilitate the sale through our network of dealers and professionals. All transactions are handled with professional oversight for your security.",
    },
    {
      question: "What documents do I need to sell my car?",
      answer:
        "You will need your vehicle title, registration, maintenance records, and if applicable, your loan payoff information. Our team will guide you through exactly what is required in your state during the consultation process.",
    },
    {
      question: "How is my car value determined?",
      answer:
        "Our automotive experts use comprehensive market analysis including recent sales data, current market trends, vehicle condition, mileage, and location to provide the most accurate valuation for your specific vehicle.",
    },
    {
      question: "Is it safe to sell my car through your platform?",
      answer:
        "Absolutely. All sales are facilitated through our network of verified automotive professionals. We provide consultation, professional assessment, and transaction oversight to ensure a secure and smooth selling experience.",
    },
    {
      question: "How long does the selling process typically take?",
      answer:
        "The timeline varies depending on your vehicle and market conditions. Our team will provide you with realistic expectations during the initial consultation and work to facilitate the sale as efficiently as possible.",
    },
  ]

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const handleContactUs = () => {
    // This would typically open a contact form or navigate to contact page
    router.push("/contact")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 mt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full bg-green-500/20 px-3 py-1.5 backdrop-blur-sm">
                <Star className="mr-2 text-yellow-400" />
                <span className="text-sm font-medium text-gray-200">Trusted automotive services</span>
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-white lg:text-5xl">
                  We Sell Cars{" "}
                  <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                    Professionally
                  </span>
                </h1>
                <p className="text-lg text-gray-300 lg:text-xl">
                  Learn about our professional car selling services. Our automotive experts help you navigate the
                  selling process with confidence and security.
                </p>
                <button
                  onClick={handleContactUs}
                  className="group relative inline-flex transform items-center justify-center overflow-hidden rounded-xl bg-green-600 px-6 py-3 text-base font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                >
                  <div className="absolute inset-0 bg-green-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <span className="relative z-10 mr-2">Contact Our Experts</span>
                  <ArrowRight className="relative z-10 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-green-400/10 blur-2xl"></div>
              <div className="relative overflow-hidden rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <Image
                  src="/Luxury SUV.webp"
                  alt="Luxury SUV consultation"
                  width={600}
                  height={400}
                  className="w-full rounded-xl object-cover shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
          {/* Benefits Section */}
          <div className="mt-12 flex w-full justify-center">
            <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400 backdrop-blur-sm">
                    {benefit.icon}
                  </div>
                  <p className="text-sm font-medium text-white">{benefit.title}</p>
                  <p className="text-xs text-gray-300">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">How Our Service Works</h2>
            <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-300">
              Our professional team guides you through every step of the car selling process. Here&apos;s how we help
              you sell your vehicle with confidence.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="group relative"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-900">
                  <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-green-500 to-green-600"></div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                      {step.icon}
                    </div>
                    <div className="text-5xl font-bold text-gray-100 dark:text-gray-700">{step.step}</div>
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">{step.title}</h3>
                  <p className="mb-3 leading-relaxed text-gray-600 dark:text-gray-300">{step.description}</p>
                  <div
                    className={`transform transition-all duration-500 ${
                      hoveredCard === index ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                    }`}
                  >
                    <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{step.tip}</p>
                    </div>
                  </div>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="absolute -right-4 top-1/2 z-10 hidden -translate-y-1/2 transform md:block">
                    <ArrowRight className="text-2xl text-green-500/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">Why Choose Our Service?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Experience professional automotive services with expert guidance
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Get answers to common questions about our car selling services
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between p-5 text-left transition-colors duration-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="pr-4 text-base font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-600 transition-transform duration-300 dark:text-gray-400 ${
                      activeIndex === index ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } overflow-hidden`}
                >
                  <div className="px-5 pb-5">
                    <div className="mb-3 h-px bg-gradient-to-r from-green-500 to-green-600"></div>
                    <p className="leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-800 to-gray-900 py-16 dark:from-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white dark:text-gray-100">Ready to Sell Your Car?</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-gray-200 dark:text-gray-300">
            Contact our automotive experts today to learn more about our professional car selling services and get
            expert guidance for your vehicle.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={handleContactUs}
              className="group flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:from-green-600 hover:to-green-700"
            >
              Contact Our Experts
              <Phone className="ml-2 transition-transform group-hover:scale-110" />
            </button>
            <Link
              href="/about"
              className="flex items-center justify-center rounded-xl border-2 border-white/30 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/20 dark:border-gray-600/50 dark:bg-gray-700/50 dark:text-gray-100 dark:hover:border-gray-500/70 dark:hover:bg-gray-600/60"
            >
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}