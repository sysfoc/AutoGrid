"use client";

import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState } from "react";

const Slider = ({ loadingState, carData }) => {
  const loading = loadingState;
  const [currentSlide, setCurrentSlide] = useState(0);

  const imageUrls = Array.isArray(carData?.imageUrls)
    ? carData.imageUrls
    : carData?.imageUrls && typeof carData.imageUrls === "object"
      ? Object.values(carData.imageUrls)
      : [];

  const mediaItems = [
    carData?.video ? { type: "video", src: carData.video } : null,
    ...(Array.isArray(carData?.imageUrls)
      ? carData.imageUrls
      : carData?.imageUrls && typeof carData.imageUrls === "object"
        ? Object.values(carData.imageUrls)
        : []
    ).map((image) => ({
      type: "image",
      src: image,
    })),
  ].filter(Boolean);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mediaItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length,
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (!carData?.video && imageUrls.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl">
        <div className="p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full  dark:bg-green-900/30">
            <svg
              className="text-app-bg h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="font-medium text-gray-600 dark:text-gray-400">
            No images available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-4 z-20">
        <div className="bg-app-bg rounded-full px-3 py-1 text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
          {mediaItems.length}{" "}
          {mediaItems.length === 1 ? "Media" : "Media Items"}
        </div>
      </div>

      {/* Quality badge */}
      <div className="absolute right-4 top-4 z-10">
        <div className="text-app-bg rounded-full bg-white/90 px-3 py-1 text-sm font-semibold shadow-lg backdrop-blur-sm">
          HD Quality
        </div>
      </div>

      {/* Main Carousel */}
      <div className="relative h-64 overflow-hidden rounded-2xl shadow-inner sm:h-80 xl:h-96 2xl:h-[28rem]">
        <div className="relative h-full w-full">
          {mediaItems.map((media, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              {loading ? (
                <div className="flex h-full w-full animate-pulse items-center justify-center">
                  <div className="text-center">
                    <div className="dark:bg-app-bg mx-auto mb-3 h-12 w-12 animate-pulse rounded-full bg-green-200"></div>
                    <Skeleton width={200} height={20} />
                  </div>
                </div>
              ) : media.type === "video" ? (
                <div className="group relative h-full w-full">
                  <video
                    src={media.src}
                    controls
                    className="h-full w-full object-cover"
                    poster="/placeholder-video.jpg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="bg-app-bg absolute bottom-4 left-4 rounded-full px-3 py-1 text-sm font-semibold text-white">
                    Video
                  </div>
                </div>
              ) : (
                <div className="group relative h-full w-full">
                  <Image
                    src={media.src || "/placeholder.svg"}
                    alt={`Vehicle Media ${index + 1}`}
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="bg-app-bg absolute bottom-4 left-4 rounded-full px-3 py-1 text-sm font-semibold text-white">
                    {index + 1} / {mediaItems.length}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        {mediaItems.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
            >
              <svg
                className="text-app-bg h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 transform items-center justify-center rounded-full bg-white/80 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white"
            >
              <svg
                className="text-app-bg h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dots Indicators */}
        {mediaItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform space-x-2">
            {mediaItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  index === currentSlide
                    ? "w-8 bg-white"
                    : "bg-white/60 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {mediaItems.length > 1 && (
        <div className="mt-4 px-2">
          <div className="scrollbar-hide flex gap-2 overflow-x-auto">
            {mediaItems.map((media, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 hover:scale-105 sm:h-14 sm:w-20 ${
                  currentSlide === index
                    ? "ring-app-bg ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                    : "hover:ring-app-bg hover:ring-1"
                }`}
              >
                {media.type === "video" ? (
                  <div className="relative flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <svg
                      className="text-app-bg h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <div className="absolute inset-0 bg-black/20"></div>
                  </div>
                ) : (
                  <Image
                    src={media.src || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover"
                    fill
                    sizes="80px"
                  />
                )}
                {currentSlide === index && (
                  <div className="border-app-bg absolute inset-0 rounded-lg border-2 bg-green-500/20"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;
