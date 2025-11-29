"use client";

import { motion } from "framer-motion";
import {
  Leaf,
  Flame,
  Wheat,
  Milk,
  Heart,
  Baby,
  type LucideIcon,
} from "lucide-react";

export interface FilterTag {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
}

export const defaultFilterTags: FilterTag[] = [
  {
    id: "vegetarian",
    name: "Vegetarian",
    icon: Leaf,
    color: "emerald",
  },
  {
    id: "vegan",
    name: "Vegan",
    icon: Leaf,
    color: "green",
  },
  {
    id: "spicy",
    name: "Spicy",
    icon: Flame,
    color: "red",
  },
  {
    id: "gluten-free",
    name: "Gluten Free",
    icon: Wheat,
    color: "amber",
  },
  {
    id: "lactose-free",
    name: "Lactose Free",
    icon: Milk,
    color: "blue",
  },
  {
    id: "healthy",
    name: "Healthy",
    icon: Heart,
    color: "pink",
  },
  {
    id: "kids",
    name: "Kids Menu",
    icon: Baby,
    color: "purple",
  },
];

// Color mapping for different filter types
const colorStyles: Record<
  string,
  {
    active: string;
    inactive: string;
    icon: string;
  }
> = {
  emerald: {
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive:
      "bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600",
    icon: "text-emerald-500",
  },
  green: {
    active: "bg-green-500 text-white border-green-500",
    inactive:
      "bg-white dark:bg-slate-800 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600",
    icon: "text-green-500",
  },
  red: {
    active: "bg-red-500 text-white border-red-500",
    inactive:
      "bg-white dark:bg-slate-800 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600",
    icon: "text-red-500",
  },
  amber: {
    active: "bg-amber-500 text-white border-amber-500",
    inactive:
      "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600",
    icon: "text-amber-500",
  },
  blue: {
    active: "bg-blue-500 text-white border-blue-500",
    inactive:
      "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600",
    icon: "text-blue-500",
  },
  pink: {
    active: "bg-pink-500 text-white border-pink-500",
    inactive:
      "bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600",
    icon: "text-pink-500",
  },
  purple: {
    active: "bg-purple-500 text-white border-purple-500",
    inactive:
      "bg-white dark:bg-slate-800 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600",
    icon: "text-purple-500",
  },
};

interface FilterTagsProps {
  tags?: FilterTag[];
  activeFilters: string[];
  onFilterToggle: (filterId: string) => void;
}

export function FilterTags({
  tags = defaultFilterTags,
  activeFilters,
  onFilterToggle,
}: FilterTagsProps) {
  // Animation variants for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative">
      {/* Mobile scroll fade indicators */}
      <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-amber-50 dark:from-slate-900 to-transparent z-10 pointer-events-none md:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-amber-50 dark:from-slate-900 to-transparent z-10 pointer-events-none md:hidden" />

      {/* Scrollable container */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        <motion.div
          className="flex gap-2 md:flex-wrap md:justify-center min-w-max md:min-w-0 py-1"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tags.map((tag) => {
            const Icon = tag.icon;
            const isActive = activeFilters.includes(tag.id);
            const styles = colorStyles[tag.color] || colorStyles.emerald;

            return (
              <motion.button
                key={tag.id}
                onClick={() => onFilterToggle(tag.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full
                  text-xs md:text-sm font-medium border transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                  ${isActive ? styles.active : styles.inactive}
                `}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon
                  className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                    isActive ? "text-current" : styles.icon
                  }`}
                />
                <span className="whitespace-nowrap">{tag.name}</span>

                {/* Checkmark for active state */}
                {isActive && (
                  <motion.svg
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    className="w-3.5 h-3.5 ml-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                )}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      {/* Active filters summary */}
      {activeFilters.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400"
        >
          <span>
            {activeFilters.length} filter{activeFilters.length > 1 ? "s" : ""}{" "}
            active
          </span>
          <button
            onClick={() => activeFilters.forEach((f) => onFilterToggle(f))}
            className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2"
          >
            Clear all
          </button>
        </motion.div>
      )}
    </div>
  );
}
