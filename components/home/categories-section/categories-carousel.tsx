"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CategoryResponse } from "@/types";
import { CategoryCard } from "./category-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoriesCarouselProps {
  categories: CategoryResponse[];
}

export function CategoriesCarousel({ categories }: CategoriesCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
    breakpoints: {
      "(min-width: 640px)": { slidesToScroll: 2 },
      "(min-width: 768px)": { slidesToScroll: 3 },
      "(min-width: 1024px)": { slidesToScroll: 4 },
    },
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    // Initialize scroll state
    const updateScrollState = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    updateScrollState();
    emblaApi.on("select", updateScrollState);
    emblaApi.on("reInit", updateScrollState);

    return () => {
      emblaApi.off("select", updateScrollState);
      emblaApi.off("reInit", updateScrollState);
    };
  }, [emblaApi]);

  if (categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      {canScrollPrev && (
        <button
          onClick={scrollPrev}
          aria-label="Previous categories"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <ChevronLeft className="w-6 h-6 text-orange-500" />
        </button>
      )}

      {canScrollNext && (
        <button
          onClick={scrollNext}
          aria-label="Next categories"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-50 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <ChevronRight className="w-6 h-6 text-orange-500" />
        </button>
      )}

      {/* Carousel */}
      <div className="overflow-hidden px-12" ref={emblaRef}>
        <div className="flex gap-6 md:gap-8">
          {categories.map((category) => (
            <div key={category._id} className="flex-shrink-0">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
