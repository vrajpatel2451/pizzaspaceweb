"use client";

import { useEffect, useState, useRef } from "react";
import { CustomImage } from "@/components/ui/custom-image";
import { Star, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

const customerAvatars = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Sarah",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    alt: "Customer John",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Emily",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Michael",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    alt: "Customer Lisa",
  },
];

export function TestimonialsHeader() {
  const [isVisible, setIsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
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
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
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
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
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
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        Join thousands of satisfied customers who have made Pizza Space their
        go-to destination for authentic, delicious pizza.
      </p>

      {/* Decorative elements */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 mt-6 transition-all duration-500 delay-300",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>

      {/* Rating and Avatars Row */}
      <div
        className={cn(
          "flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 transition-all duration-500 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        {/* Rating Display */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-5 py-3 rounded-2xl shadow-lg shadow-orange-500/10 border border-orange-100 dark:border-slate-700">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < 5
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-left">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              4.8
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
            {customerAvatars.map((avatar, index) => (
              <div
                key={avatar.id}
                className={cn(
                  "relative transition-all duration-300",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
                )}
                style={{ transitionDelay: isVisible ? `${400 + index * 50}ms` : "0ms" }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 overflow-hidden shadow-md hover:scale-110 hover:z-10 transition-transform duration-200">
                  <CustomImage
                    src={avatar.src}
                    alt={avatar.alt}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
            {/* More customers indicator */}
            <div
              className={cn(
                "w-10 h-10 md:w-12 md:h-12 rounded-full border-3 border-white dark:border-slate-800 bg-orange-500 flex items-center justify-center shadow-md transition-all duration-300",
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-3"
              )}
              style={{ transitionDelay: isVisible ? "650ms" : "0ms" }}
            >
              <span className="text-white text-xs md:text-sm font-semibold">
                +2K
              </span>
            </div>
          </div>
          <div className="text-left">
            <p className="text-slate-900 dark:text-white font-semibold text-sm md:text-base">
              2.5K+ Reviews
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm">
              Happy Customers
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
