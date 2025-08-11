import React from "react";
import { Carousel } from "flowbite-react";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Slider = ({ loadingState, carData }) => {
  const loading = loadingState;

  const imageUrls = Array.isArray(carData.imageUrls)
    ? carData.imageUrls
    : carData.imageUrls && typeof carData.imageUrls === "object"
      ? Object.values(carData.imageUrls)
      : [];

  if (!carData.video && imageUrls.length === 0) {
    return <div className="text-center text-gray-500">No images available</div>;
  }

  const mediaItems = [
    carData.video ? { type: "video", src: carData.video } : null,
    ...(Array.isArray(carData.imageUrls)
      ? carData.imageUrls
      : carData.imageUrls && typeof carData.imageUrls === "object"
        ? Object.values(carData.imageUrls)
        : []
    ).map((image) => ({
      type: "image",
      src: image,
    })),
  ].filter(Boolean);

  return (
    <div className="mt-3 h-56 sm:h-72 xl:h-80 2xl:h-96">
      <Carousel slideInterval={3000}>
        {mediaItems.map((media, index) => {
          if (loading) {
            return <Skeleton key={index} width="100%" height="100%" />;
          }

          if (media.type === "video") {
            return (
              <div key={index} className="size-full">
                <video
                  src={media.src}
                  controls
                  className="size-full object-cover"
                />
              </div>
            );
          }

          if (media.type === "image") {
            return (
              <div key={index} className="size-full">
                <Image
                  src={media.src}
                  alt={`Vehicle Media ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            );
          }

          return null;
        })}
      </Carousel>
    </div>
  );
};

export default Slider;
