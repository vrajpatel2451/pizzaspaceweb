"use client";

import { motion } from "framer-motion";
import { CategoryResponse } from "@/types";
import { CategoryCard, CategoryCardSkeleton } from "./category-card";

interface CategoriesContentProps {
  categories: CategoryResponse[];
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  // Ensure categories is always an array
  const safeCategories = Array.isArray(categories) ? categories : [];

  // Animation variants
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Category Cards Grid - 2 columns on mobile, responsive scaling */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
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
      </motion.div>

      {/* View All Button */}
      <motion.div
        className="flex justify-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <a
          href="/menu"
          className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          <span>View Full Menu</span>
          <svg
            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
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
      </motion.div>
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
