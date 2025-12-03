"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { CustomImage } from "@/components/ui/custom-image";
import type { ProductImageSectionProps } from "@/types/product-details";
import type { ProductType } from "@/types/product";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Product Type Badge Component
function ProductTypeBadge({
  productType,
  isVisible,
}: {
  productType: ProductType;
  isVisible: boolean;
}) {
  const badgeColor =
    productType === "veg"
      ? "bg-green-500"
      : productType === "vegan"
        ? "bg-green-600"
        : "bg-red-500";

  const badgeText =
    productType === "veg" ? "Veg" : productType === "vegan" ? "Vegan" : "Non-Veg";

  return (
    <div
      className={cn(
        "absolute top-2 left-2 sm:top-3 sm:left-3 z-10 transition-all duration-300 motion-reduce:transition-none",
        isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-80 -translate-y-2.5"
      )}
      style={{ transitionDelay: "200ms" }}
    >
      <div
        className={cn(
          "flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-white text-xs font-semibold shadow-lg",
          badgeColor
        )}
      >
        <div className="size-1.5 rounded-full bg-white animate-pulse motion-reduce:animate-none" />
        <span>{badgeText}</span>
      </div>
    </div>
  );
}

export function ProductImageSection({
  images,
  productName,
  productType,
  className,
}: ProductImageSectionProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Use first image or empty string
  const primaryImage = images?.[0] || "";

  // Check if product has multiple images
  const hasMultipleImages = images && images.length > 1;

  // Effect to update carousel pagination
  useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Trigger visibility after mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Product Image - Responsive aspect ratios */}
      <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden rounded-2xl bg-muted">
        {hasMultipleImages ? (
          // Multi-image carousel
          <>
            <Carousel
              className="w-full h-full"
              opts={{ loop: true }}
              setApi={setCarouselApi}
            >
              <CarouselContent className="-ml-0">
                {images.map((image, index) => (
                  <CarouselItem key={index} className="pl-0">
                    <div className="relative aspect-[4/3] sm:aspect-video w-full">
                      {/* Loading skeleton background for each image */}
                      {!imageLoaded && index === current && (
                        <div
                          className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted animate-pulse"
                        />
                      )}

                      <div
                        className={cn(
                          "relative w-full h-full transition-opacity duration-300 motion-reduce:transition-none",
                          imageLoaded ? "opacity-100" : "opacity-0"
                        )}
                      >
                        <CustomImage
                          src={image}
                          alt={`${productName} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 640px"
                          priority={index === 0}
                          onLoad={() => index === 0 && setImageLoaded(true)}
                        />
                      </div>

                      {/* Show badge only on first image */}
                      {index === 0 && (
                        <ProductTypeBadge
                          productType={productType}
                          isVisible={isVisible}
                        />
                      )}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Pagination dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    current === index
                      ? "w-6 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/75"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          // Single image display
          <>
            {/* Loading skeleton background */}
            {!imageLoaded && (
              <div
                className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted animate-pulse"
              />
            )}

            {/* Animated Image */}
            <div
              className={cn(
                "relative w-full h-full transition-opacity duration-300 motion-reduce:transition-none",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
            >
              <CustomImage
                src={primaryImage}
                alt={productName}
                fill
                className="object-cover transition-transform duration-300 sm:hover:scale-105"
                sizes="(max-width: 640px) 100vw, 640px"
                priority
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Veg/Non-veg Badge Overlay */}
            <ProductTypeBadge
              productType={productType}
              isVisible={isVisible}
            />
          </>
        )}
      </div>
    </div>
  );
}
