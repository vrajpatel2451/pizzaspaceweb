"use client";

import { useEffect, useState, useRef } from "react";
import { CustomImage } from "@/components/ui/custom-image";
import { Star, MessageSquareQuote, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GeneralRating } from "@/types";

interface TestimonialsHeaderProps {
  averageRating?: number;
  totalReviews?: number;
  testimonials?: GeneralRating[];
}

export function TestimonialsHeader({
  averageRating = 0,
  totalReviews = 0,
  testimonials = [],
}: TestimonialsHeaderProps) {
  // Get up to 5 testimonials for avatar display
  const displayAvatars = testimonials.slice(0, 5);
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Format the total reviews count for display
  const formatReviewCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}K+`;
    }
    return count.toString();
  };

  // Calculate filled stars (rounded to nearest 0.5)
  const filledStars = Math.round(averageRating * 2) / 2;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" },
    );

    if (headerRef.current) {
      observer.observe(headerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={headerRef} className="text-center mb-12 md:mb-16">
      {/* Badge */}
      <div
        className={cn(
          "mb-4 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        )}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <MessageSquareQuote className="w-3.5 h-3.5" />
          Testimonials
        </span>
      </div>

      {/* Headline */}
      <h2
        className={cn(
          "text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 transition-all duration-500 delay-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        )}
      >
        What Our Customers{" "}
        <span className="text-orange-500 relative">
          Say
          {/* Decorative underline */}
          <svg
            className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h2>

      {/* Subheadline */}
      <p
        className={cn(
          "text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-500 delay-200",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
        )}
      >
        Join thousands of satisfied customers who have made Pizza Space their
        go-to destination for authentic, delicious pizza.
      </p>

      {/* Decorative elements */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 mt-6 transition-all duration-500 delay-300",
          isVisible ? "opacity-100" : "opacity-0",
        )}
      >
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>

      {/* Rating and Avatars Row - Only show if there are reviews */}
      {totalReviews > 0 && (
        <div
          className={cn(
            "flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 transition-all duration-500 delay-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
          )}
        >
          {/* Rating Display */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/10 border border-orange-100 dark:border-slate-700">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < filledStars
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200 dark:fill-slate-600 dark:text-slate-600"
                  }`}
                />
              ))}
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div className="text-left">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-sm ml-1">
                / 5
              </span>
            </div>
          </div>

          {/* Divider on larger screens */}
          <div className="hidden sm:block h-12 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Customer Avatars with Count */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-3">
              {displayAvatars.map((testimonial, index) => (
                <div
                  key={testimonial._id}
                  className={cn(
                    "relative transition-all duration-300",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3",
                  )}
                  style={{
                    transitionDelay: isVisible
                      ? `${400 + index * 50}ms`
                      : "0ms",
                  }}
                >
                  {testimonial.personImage ? (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-transform duration-200">
                      <CustomImage
                        src={testimonial.personImage}
                        alt={testimonial.personName}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 bg-gradient-to-br from-orange-400 to-orange-600 shadow-md hover:scale-110 hover:z-10 transition-transform duration-200 flex items-center justify-center">
                      <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {/* More customers indicator - only show if more than displayed */}
              {totalReviews > 5 && (
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 bg-orange-500 flex items-center justify-center shadow-md transition-all duration-300",
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-3",
                  )}
                  style={{ transitionDelay: isVisible ? "650ms" : "0ms" }}
                >
                  <span className="text-white text-xs md:text-sm font-semibold">
                    +{formatReviewCount(totalReviews - 5)}
                  </span>
                </div>
              )}
            </div>
            <div className="text-left">
              <p className="text-slate-900 dark:text-white font-semibold text-sm md:text-base">
                {formatReviewCount(totalReviews)} Reviews
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
                Happy Customers
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
