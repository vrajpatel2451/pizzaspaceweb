"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryResponse } from "@/types";
import { CustomImage } from "@/components/ui/custom-image";

interface CategoryCardProps {
  category: CategoryResponse;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        href={`/menu?category=${category._id}`}
        className="group block relative overflow-hidden rounded-2xl md:rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4"
      >
        {/* Card Container */}
        <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-slate-800">
          {/* Background Image */}
          <CustomImage
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            priority={index < 4}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content Container - Optimized for mobile */}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4">
            {/* Category Name - Smaller on mobile */}
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 tracking-tight line-clamp-2">
              {category.name}
            </h3>

            {/* Explore Link - Simplified for mobile */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-white/80 group-hover:text-orange-400 transition-colors duration-300">
              <span className="text-[10px] sm:text-xs md:text-sm font-medium">
                Explore
              </span>
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
              </motion.span>
            </div>

            {/* Animated underline - Hidden on smallest screens */}
            <motion.div
              className="hidden sm:block h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 mt-1 md:mt-2 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: "60px" }}
            />
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}

// Skeleton loader for category cards
export function CategoryCardSkeleton() {
  return (
    <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl bg-gray-200 dark:bg-slate-700 animate-pulse">
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4">
        <div className="w-20 sm:w-24 md:w-32 h-4 sm:h-5 md:h-6 rounded bg-gray-300 dark:bg-slate-600 mb-1 sm:mb-2" />
        <div className="w-16 sm:w-20 md:w-24 h-3 sm:h-3.5 md:h-4 rounded bg-gray-300 dark:bg-slate-600" />
      </div>
    </div>
  );
}
