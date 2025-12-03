"use client";

import { useState, useEffect } from "react";
import { CategoryResponse } from "@/types";
import { CategoryCard, CategoryCardSkeleton } from "./category-card";

interface CategoriesContentProps {
  categories: CategoryResponse[];
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Category Cards Grid - 2 columns on mobile, responsive scaling */}
      <div
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 transition-opacity duration-1000 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        {safeCategories.length > 0 ? (
          safeCategories.map((category, index) => (
            <CategoryCard
              key={category._id}
              category={category}
              index={index}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No categories available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* View All Button */}
      <div
        className="flex justify-center pt-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 motion-reduce:animate-none"
        style={{ animationDelay: "500ms" }}
      >
        <a
          href="/menu"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 motion-reduce:transition-none"
        >
          <span>View Full Menu</span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
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
        </a>
      </div>
    </div>
  );
}

// Skeleton for loading state
export function CategoriesContentSkeleton() {
  return (
    <div className="space-y-8 md:space-y-10">
      {/* Grid skeleton - 2 columns on mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
        {[...Array(6)].map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
