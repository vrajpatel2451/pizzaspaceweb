"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "./hero-search";
import { CategoryResponse } from "@/types/category";

interface HeroContentProps {
  trendingCategories: CategoryResponse[];
}

export function HeroContent({ trendingCategories }: HeroContentProps) {
  return (
    <>
      {/* Brand Badge */}
      <div
        className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/20 dark:border-primary/30 mb-4 sm:mb-6 animate-pop-in stagger-1 motion-reduce:animate-none order-first"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-xs sm:text-sm font-semibold text-primary dark:text-primary-400">
          Pizza Space - Fresh & Fast
        </span>
      </div>

      {/* Subheadline */}
      <p
        className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed animate-fade-in-up stagger-3 motion-reduce:animate-none"
      >
        Experience the finest handcrafted pizzas made with premium ingredients,
        delivered hot and fresh in 30 minutes or less.
      </p>

      {/* Search Bar */}
      <div className="mt-6 sm:mt-8 w-full lg:max-w-xl animate-fade-in-up stagger-4 motion-reduce:animate-none">
        <HeroSearch trendingCategories={trendingCategories} />
      </div>

      {/* CTA Button */}
      <div
        className="mt-8 sm:mt-10 animate-fade-in-up stagger-5 motion-reduce:animate-none"
      >
        <Link href="/menu">
          <Button size="lg" className="group shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
            Order Now
            <svg
              className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Button>
        </Link>
      </div>
    </>
  );
}
