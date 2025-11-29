"use client";

import { motion } from "framer-motion";
import {
  Pizza,
  UtensilsCrossed,
  Salad,
  IceCream,
  Coffee,
  Flame,
  Beef,
  type LucideIcon,
} from "lucide-react";

// Category type with icon mapping
export interface CategoryPill {
  id: string;
  name: string;
  icon: LucideIcon;
  count?: number;
}

// Default categories with icons
export const defaultCategories: CategoryPill[] = [
  { id: "all", name: "All", icon: UtensilsCrossed, count: 48 },
  { id: "pizza", name: "Pizza", icon: Pizza, count: 12 },
  { id: "burgers", name: "Burgers", icon: Beef, count: 8 },
  { id: "pasta", name: "Pasta", icon: UtensilsCrossed, count: 10 },
  { id: "sides", name: "Sides", icon: Flame, count: 6 },
  { id: "salads", name: "Salads", icon: Salad, count: 5 },
  { id: "desserts", name: "Desserts", icon: IceCream, count: 4 },
  { id: "drinks", name: "Drinks", icon: Coffee, count: 8 },
];

interface CategoriesPillsProps {
  categories?: CategoryPill[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoriesPills({
  categories = defaultCategories,
  activeCategory,
  onCategoryChange,
}: CategoriesPillsProps) {
  return (
    <div className="relative">
      {/* Gradient fade edges for scroll indication */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-50 dark:from-slate-900 to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-amber-50 dark:from-slate-900 to-transparent z-10 pointer-events-none md:hidden" />

      {/* Scrollable pills container */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <div className="flex gap-2 md:gap-3 md:flex-wrap md:justify-center min-w-max md:min-w-0 py-1">
          {categories.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <motion.button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 md:px-5 md:py-3 rounded-full
                  font-medium text-sm md:text-base transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                  min-h-[44px] touch-manipulation
                  ${
                    isActive
                      ? "text-white shadow-lg shadow-orange-500/30"
                      : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-700"
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                aria-pressed={isActive}
                aria-label={`${category.name}${category.count ? `, ${category.count} items` : ''}`}
              >
                {/* Active background with animation */}
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    aria-hidden="true"
                  />
                )}

                {/* Icon */}
                <span className="relative z-10">
                  <Icon
                    className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                      isActive ? "text-white" : "text-orange-500"
                    }`}
                    aria-hidden="true"
                  />
                </span>

                {/* Category name */}
                <span className="relative z-10 whitespace-nowrap">
                  {category.name}
                </span>

                {/* Item count badge */}
                {category.count && (
                  <span
                    className={`
                      relative z-10 ml-1 px-2 py-0.5 text-xs rounded-full transition-colors
                      ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                      }
                    `}
                    aria-hidden="true"
                  >
                    {category.count}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
