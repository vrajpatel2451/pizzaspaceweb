"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import Link from "next/link";
import { StoreResponse } from "@/types";
import { StoreCard } from "./store-card";
import { Button } from "@/components/ui/button";

// Section header component
function SectionHeader({ isVisible }: { isVisible: boolean }) {
  return (
    <div
      className={`text-center mb-12 md:mb-16 transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
    >
      {/* Badge */}
      <div
        className={`mb-4 transition-all duration-500 delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        } motion-reduce:transition-none`}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
          Find Us
        </span>
      </div>

      {/* Main heading */}
      <h2
        id="stores-preview-heading"
        className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 md:mb-6 transition-all duration-500 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } motion-reduce:transition-none`}
      >
        Visit Our{" "}
        <span className="text-orange-500 relative">
          Locations
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

      {/* Subtitle */}
      <p
        className={`text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-all duration-500 delay-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } motion-reduce:transition-none`}
      >
        Experience authentic Italian pizza at any of our welcoming locations. Find the
        nearest Pizza Space and join us for a memorable meal.
      </p>

      {/* Decorative elements */}
      <div
        className={`flex items-center justify-center gap-3 mt-6 transition-all duration-500 delay-400 ${
          isVisible ? "opacity-100" : "opacity-0"
        } motion-reduce:transition-none`}
      >
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>
    </div>
  );
}

// Background decorations
function BackgroundDecorations({ isVisible }: { isVisible: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient orb - top left */}
      <div
        className={`absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-orange-500/10 to-orange-600/5 dark:from-orange-500/5 dark:to-orange-600/3 rounded-full blur-3xl transition-all duration-1000 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100`}
      />

      {/* Floating map pin decoration */}
      <div
        className={`absolute top-20 right-[10%] hidden xl:block transition-all duration-800 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        } motion-reduce:transition-none`}
      >
        <div className="animate-float motion-reduce:animate-none">
          <MapPin className="w-16 h-16 text-orange-500/20 dark:text-orange-500/10" />
        </div>
      </div>
    </div>
  );
}

interface StoresPreviewSectionProps {
  stores?: StoreResponse[];
}

export function StoresPreviewSection({ stores = [] }: StoresPreviewSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-slate-50 dark:bg-navy-950 py-16 md:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="stores-preview-heading"
    >
      {/* Background decorations */}
      <BackgroundDecorations isVisible={isVisible} />

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <SectionHeader isVisible={isVisible} />

        {/* Stores grid */}
        {stores.length > 0 ? (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 transition-all duration-600 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
          >
            {stores.map((store, index) => (
              <div
                key={store._id}
                className={`transition-all duration-600 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } motion-reduce:transition-none`}
                style={{ transitionDelay: isVisible ? `${100 * index}ms` : "0ms" }}
              >
                <StoreCard store={store} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className={`text-center py-12 transition-all duration-600 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            } motion-reduce:transition-none`}
          >
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              No stores available at the moment. Please check back soon!
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div
          className={`flex justify-center transition-all duration-600 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
        >
          <Button
            asChild
            size="lg"
            className="group shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/stores">
              Visit Our Locations
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
