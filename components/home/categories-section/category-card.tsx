"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CategoryResponse } from "@/types";

interface CategoryCardProps {
  category: CategoryResponse;
  productCount?: number;
  index?: number;
}

export function CategoryCard({
  category,
  productCount = 12,
  index = 0,
}: CategoryCardProps) {
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
          <Image
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

          {/* Product Count Badge */}
          <motion.div
            className="absolute top-3 right-3 md:top-4 md:right-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <span className="inline-flex items-center px-2.5 py-1 md:px-3 md:py-1.5 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-xs md:text-sm font-semibold text-gray-800 dark:text-white shadow-lg">
              {productCount} items
            </span>
          </motion.div>

          {/* Content Container */}
          <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
            {/* Category Name */}
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-1 md:mb-2 tracking-tight">
              {category.name}
            </h3>

            {/* Explore Link */}
            <div className="flex items-center gap-2 text-white/80 group-hover:text-orange-400 transition-colors duration-300">
              <span className="text-sm md:text-base font-medium">
                Explore Menu
              </span>
              <motion.span
                className="inline-block"
                initial={{ x: 0 }}
                animate={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
              </motion.span>
            </div>

            {/* Animated underline */}
            <motion.div
              className="h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 mt-2 origin-left"
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
              style={{ width: "100px" }}
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
      <div className="absolute top-3 right-3 md:top-4 md:right-4">
        <div className="w-16 h-6 rounded-full bg-gray-300 dark:bg-slate-600" />
      </div>
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
        <div className="w-32 h-6 rounded bg-gray-300 dark:bg-slate-600 mb-2" />
        <div className="w-24 h-4 rounded bg-gray-300 dark:bg-slate-600" />
      </div>
    </div>
  );
}
