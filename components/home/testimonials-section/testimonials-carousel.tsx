"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { TestimonialCard } from "./testimonial-card";
import { CarouselControls } from "./carousel-controls";
import type { GeneralRating } from "@/types";

interface TestimonialsCarouselProps {
  testimonials: GeneralRating[];
}

export function TestimonialsCarousel({
  testimonials,
}: TestimonialsCarouselProps) {
  // Show message if no testimonials
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          No testimonials available at the moment.
        </p>
        <p className="text-slate-500 dark:text-slate-500 text-sm mt-2">
          Be the first to leave a review and share your experience!
        </p>
      </div>
    );
  }
  const autoplayRef = useRef(
    Autoplay({
      delay: 5000,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      dragFree: false,
    },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  const scrollPrev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleAutoplay = useCallback(() => {
    const autoplay = autoplayRef.current;
    if (!autoplay) return;

    const isCurrentlyPlaying = autoplay.isPlaying();
    if (isCurrentlyPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  }, []);

  return (
    <div className="relative">
      {/* Screen reader announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Testimonial {selectedIndex + 1} of {testimonials.length}
      </div>

      {/* Carousel Container */}
      <div
        className="overflow-hidden"
        ref={emblaRef}
        aria-roledescription="carousel"
        aria-label="Customer testimonials"
      >
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial._id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_80%] lg:flex-[0_0_60%] px-2 md:px-4"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
              aria-hidden={index !== selectedIndex}
            >
              <TestimonialCard
                testimonial={testimonial}
                isActive={index === selectedIndex}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlays for Depth Effect */}
      <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-amber-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />
      <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-amber-50 dark:from-slate-900 to-transparent pointer-events-none z-10" />

      {/* Controls */}
      <CarouselControls
        onPrev={scrollPrev}
        onNext={scrollNext}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
        isPlaying={isPlaying}
        onTogglePlay={toggleAutoplay}
        currentIndex={selectedIndex}
        totalSlides={testimonials.length}
        onDotClick={scrollTo}
      />
    </div>
  );
}
