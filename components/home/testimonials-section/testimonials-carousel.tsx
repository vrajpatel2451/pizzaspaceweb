"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { TestimonialCard, type Testimonial } from "./testimonial-card";
import { CarouselControls } from "./carousel-controls";

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      "The best pizza I've ever had! Fresh ingredients, perfect crust, and the delivery was incredibly fast. My whole family is obsessed with their Margherita pizza. We order at least twice a week now!",
    name: "Sarah Johnson",
    title: "Food Blogger",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "2 weeks ago",
    isVerified: true,
  },
  {
    id: 2,
    quote:
      "Outstanding quality and service! The Pepperoni Supreme is absolutely divine. I've tried pizza from every place in town, and Pizza Space is hands down the winner. The cheese pull is unreal!",
    name: "Michael Chen",
    title: "Local Business Owner",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "1 month ago",
    isVerified: true,
  },
  {
    id: 3,
    quote:
      "Every bite takes me back to Italy! The authentic flavors and homemade sauce remind me of my grandmother's cooking. This is not just pizza, it's an experience. Absolutely phenomenal!",
    name: "Emily Rodriguez",
    title: "Culinary Enthusiast",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "3 weeks ago",
    isVerified: true,
  },
  {
    id: 4,
    quote:
      "We hosted a party with Pizza Space catering and everyone was blown away! The variety, freshness, and presentation were top-notch. Our guests are still talking about it weeks later.",
    name: "David Thompson",
    title: "Event Planner",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "1 week ago",
    isVerified: true,
  },
  {
    id: 5,
    quote:
      "As a picky eater, finding good pizza is tough. Pizza Space exceeded all my expectations! The crust is perfectly crispy, toppings are generous, and their gluten-free options are actually delicious.",
    name: "Lisa Martinez",
    title: "Health Coach",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    date: "5 days ago",
    isVerified: true,
  },
];

export function TestimonialsCarousel() {
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
              key={testimonial.id}
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
