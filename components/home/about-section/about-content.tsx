"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureList, FeaturePills } from "./feature-list";
import { StatsCounter } from "./stats-counter";
import { cn } from "@/lib/utils";

export function AboutContent() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="lg:pl-8">
      {/* Section Badge */}
      <div
        className={cn(
          "transition-all duration-500 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-2 scale-80"
        )}
      >
        <span className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 dark:border-primary/30">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-sm font-semibold text-primary">
            About Us
          </span>
        </span>
      </div>

      {/* Main Headline */}
      <h2
        className={cn(
          "mt-5 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] tracking-tight transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        id="about-heading"
        style={{ transitionDelay: "120ms" }}
      >
        Crafting Pizza with{" "}
        <span className="relative inline-block group">
          <span className="relative z-10 text-primary">Passion</span>
          <svg
            className={cn(
              "absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary/30 transition-all duration-800 motion-reduce:transition-none",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "600ms" }}
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q 50 0, 100 8 T 200 8"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </span>{" "}
        Since 2020
      </h2>

      {/* Story Paragraph */}
      <p
        className={cn(
          "mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "240ms" }}
      >
        What started as a dream in a small kitchen has grown into a beloved neighborhood destination.
        At Pizza Space, we believe every pizza tells a story - handcrafted with love, topped with
        the freshest ingredients, and baked to perfection in our authentic wood-fired ovens.
      </p>

      {/* Secondary paragraph */}
      <p
        className={cn(
          "mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "360ms" }}
      >
        Our commitment to quality has earned us recognition across the city, but it&apos;s the
        smiles on our customers&apos; faces that truly drive us forward every day.
      </p>

      {/* Feature Pills */}
      <div
        className={cn(
          "mt-6 sm:mt-8 transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "480ms" }}
      >
        <FeaturePills />
      </div>

      {/* Feature List */}
      <div
        className={cn(
          "mt-8 sm:mt-10 transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "600ms" }}
      >
        <FeatureList />
      </div>

      {/* CTA Button */}
      <div
        className={cn(
          "mt-8 sm:mt-10 transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "720ms" }}
      >
        <Link href="/about">
          <Button
            size="lg"
            className="group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 motion-reduce:transition-none"
          >
            {/* Button gradient overlay on hover */}
            <span className="absolute inset-0 bg-gradient-to-r from-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 motion-reduce:transition-none" />
            <span className="relative flex items-center gap-2">
              Our Story
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
            </span>
          </Button>
        </Link>
      </div>

      {/* Stats Section */}
      <div
        className={cn(
          "mt-10 sm:mt-12 transition-all duration-600 motion-reduce:transition-none",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "840ms" }}
      >
        <StatsCounter />
      </div>
    </div>
  );
}
