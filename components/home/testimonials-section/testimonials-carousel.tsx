"use client";

import { useCallback, useEffect, useState, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Pause, Play } from 'lucide-react';
import { TestimonialCard } from './testimonial-card';
import { CarouselDots } from './carousel-dots';

const testimonials = [
  {
    id: 1,
    quote: "Fresh ingredients, perfect cooking, and excellent customer service. What more could you ask for?",
    name: "Lisa Brown",
    location: "Midtown",
    rating: 5
  },
  {
    id: 2,
    quote: "Best pizza in town! The crust is always perfect and crispy. My family orders here every weekend.",
    name: "John Smith",
    location: "Downtown",
    rating: 5
  },
  {
    id: 3,
    quote: "Quick delivery and amazing taste. The Margherita is to die for! Highly recommend.",
    name: "Sarah Johnson",
    location: "Westside",
    rating: 5
  },
  {
    id: 4,
    quote: "Authentic Italian flavors that remind me of my grandmother's cooking. Simply the best!",
    name: "Michael Chen",
    location: "Eastside",
    rating: 5
  },
  {
    id: 5,
    quote: "We've tried every pizza place in the city, and Pizza Space is hands down the winner.",
    name: "Emily Davis",
    location: "Northside",
    rating: 5
  }
];

export function TestimonialsCarousel() {
  const autoplayRef = useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    autoplayRef.current
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
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
    <div className="max-w-2xl mx-auto relative">
      {/* Screen reader announcement */}
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        Testimonial {selectedIndex + 1} of {testimonials.length}
      </div>

      {/* Pause/Play Button */}
      <button
        onClick={toggleAutoplay}
        className="absolute top-0 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
        aria-label={isPlaying ? "Pause testimonials" : "Play testimonials"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Play className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

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
              className="flex-[0_0_100%] min-w-0"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
              aria-hidden={index !== selectedIndex}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
      <CarouselDots
        count={testimonials.length}
        selectedIndex={selectedIndex}
        onSelect={scrollTo}
      />
    </div>
  );
}
