"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CategoryResponse } from "@/types";
import { CategoriesPills, CategoryPill, defaultCategories } from "./categories-pills";
import { FilterTags, defaultFilterTags } from "./filter-tags";
import { CategoryCard, CategoryCardSkeleton } from "./category-card";

interface CategoriesContentProps {
  categories: CategoryResponse[];
}

// Stable product count generator based on category id
function getStableCount(categoryId: string): number {
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    const char = categoryId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 15) + 5;
}

// Map API categories to pill format with icons
function mapCategoriesToPills(categories: CategoryResponse[]): CategoryPill[] {
  // Start with "All" option
  const allOption = defaultCategories.find((c) => c.id === "all");
  const pills: CategoryPill[] = allOption
    ? [{ ...allOption, count: categories.length * 8 }]
    : [];

  // Map each API category to a pill, using default icon if available
  categories.forEach((category) => {
    const defaultCat = defaultCategories.find(
      (c) => c.name.toLowerCase() === category.name.toLowerCase()
    );

    pills.push({
      id: category._id,
      name: category.name,
      icon: defaultCat?.icon || defaultCategories[3].icon, // Default to UtensilsCrossed
      count: getStableCount(category._id),
    });
  });

  return pills;
}

export function CategoriesContent({ categories }: CategoriesContentProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Map categories to pills format
  const categoryPills = useMemo(
    () => mapCategoriesToPills(categories),
    [categories]
  );

  // Filter categories based on selection
  const filteredCategories = useMemo(() => {
    if (activeCategory === "all") {
      return categories;
    }
    return categories.filter((c) => c._id === activeCategory);
  }, [categories, activeCategory]);

  // Handle filter toggle
  const handleFilterToggle = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((f) => f !== filterId)
        : [...prev, filterId]
    );
  };

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
      {/* Category Pills */}
      <CategoriesPills
        categories={categoryPills}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Filter Tags */}
      <FilterTags
        tags={defaultFilterTags}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
      />

      {/* Divider */}
      <div className="flex items-center justify-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
        <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          {filteredCategories.length} Categories
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-slate-600 to-transparent" />
      </div>

      {/* Category Cards Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        variants={gridVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory} // Re-animate on category change
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <CategoryCard
              key={category._id}
              category={category}
              productCount={getStableCount(category._id) + 3}
              index={index}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No categories found matching your criteria.
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
      {/* Pills skeleton */}
      <div className="flex gap-3 justify-center flex-wrap">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-11 w-24 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"
          />
        ))}
      </div>

      {/* Filter tags skeleton */}
      <div className="flex gap-2 justify-center flex-wrap">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-8 w-20 rounded-full bg-gray-200 dark:bg-slate-700 animate-pulse"
          />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
