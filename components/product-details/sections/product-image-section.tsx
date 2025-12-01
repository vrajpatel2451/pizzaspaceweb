"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CustomImage } from "@/components/ui/custom-image";
import type { ProductImageSectionProps } from "@/types/product-details";
import type { ProductType } from "@/types/product";
import { cn } from "@/lib/utils";
import { imageLoadVariants } from "@/lib/animations";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// Product Type Badge Component
function ProductTypeBadge({
  productType,
  shouldReduceMotion,
}: {
  productType: ProductType;
  shouldReduceMotion: boolean;
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
    <motion.div
      className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10"
      initial={{ opacity: 0, scale: 0.8, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: shouldReduceMotion ? 0 : 0.2,
        duration: shouldReduceMotion ? 0 : 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
    >
      <div
        className={cn(
          "flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 text-white text-xs font-semibold shadow-lg",
          badgeColor
        )}
      >
        <motion.div
          className="size-1.5 rounded-full bg-white"
          animate={{
            scale: shouldReduceMotion ? 1 : [1, 1.2, 1],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
        />
        <span>{badgeText}</span>
      </div>
    </motion.div>
  );
}

export function ProductImageSection({
  images,
  productName,
  productType,
  className,
}: ProductImageSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [carouselApi, setCarouselApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Use first image or empty string
  const primaryImage = images?.[0] || "";

  // Check if product has multiple images
  const hasMultipleImages = images && images.length > 1;

  // Simplified variants for reduced motion
  const animationVariants = shouldReduceMotion
    ? { loading: { opacity: 1 }, loaded: { opacity: 1 } }
    : imageLoadVariants;

  // Effect to update carousel pagination
  React.useEffect(() => {
    if (!carouselApi) return;

    setCount(carouselApi.scrollSnapList().length);
    setCurrent(carouselApi.selectedScrollSnap());

    carouselApi.on("select", () => {
      setCurrent(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

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
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted"
                          animate={{
                            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          style={{
                            backgroundSize: "200% 200%",
                          }}
                        />
                      )}

                      <motion.div
                        variants={animationVariants}
                        initial="loading"
                        animate={imageLoaded ? "loaded" : "loading"}
                        className="relative w-full h-full"
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
                      </motion.div>

                      {/* Show badge only on first image */}
                      {index === 0 && (
                        <ProductTypeBadge
                          productType={productType}
                          shouldReduceMotion={shouldReduceMotion}
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
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-muted via-muted-foreground/10 to-muted"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              />
            )}

            {/* Animated Image */}
            <motion.div
              variants={animationVariants}
              initial="loading"
              animate={imageLoaded ? "loaded" : "loading"}
              className="relative w-full h-full"
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
            </motion.div>

            {/* Veg/Non-veg Badge Overlay */}
            <ProductTypeBadge
              productType={productType}
              shouldReduceMotion={shouldReduceMotion}
            />
          </>
        )}
      </div>
    </div>
  );
}
