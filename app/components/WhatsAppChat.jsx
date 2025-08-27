"use client";
import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppChat = () => {
  const phoneNumber = "923006904440";

  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="bg-app-bg hover:bg-app-bg group fixed bottom-20 right-3 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      // bottom-4 right-20
      type="button"
      aria-label="Open WhatsApp Chat"
    >
      {/* <MessageCircle className="w-6 h-6" /> */}
      <FaWhatsapp className="h-8 w-8" />

      <div className="pointer-events-none absolute right-20 top-1/2 -translate-y-1/2 translate-x-4 transform opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <div className="whitespace-nowrap rounded-lg border border-gray-700/50 bg-gray-900/90 px-4 py-2 text-white shadow-lg backdrop-blur-md">
          <span className="text-sm font-medium">Chat on WhatsApp</span>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full transform">
            <div className="h-0 w-0 border-y-4 border-l-4 border-y-transparent border-l-gray-900/90"></div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default WhatsAppChat;
