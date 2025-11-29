"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

// Icon bounce animation on hover
const iconVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: [0, -8, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Card lift animation
const cardVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

// Accent bar animation
const accentVariants: Variants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export function InfoCard({ icon: Icon, title, description }: InfoCardProps) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      className="group relative flex flex-col items-center gap-3 sm:gap-4 rounded-xl sm:rounded-2xl bg-white p-5 sm:p-6 dark:bg-navy-800 touch-manipulation"
      role="article"
      aria-label={`${title}: ${description}`}
    >
      {/* Icon Container */}
      <motion.div
        variants={iconVariants}
        className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-orange-100 text-orange-500 transition-colors duration-300 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-950 dark:text-orange-400 dark:group-hover:bg-orange-500 dark:group-hover:text-white"
      >
        <Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden="true" />
      </motion.div>

      {/* Content */}
      <div className="text-center">
        <motion.h3
          className="text-base sm:text-lg font-bold text-navy-900 dark:text-white"
          initial={{ opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p
          className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0.8 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {description}
        </motion.p>
      </div>

      {/* Decorative Accent */}
      <motion.div
        variants={accentVariants}
        className="absolute inset-x-0 bottom-0 h-1 rounded-b-xl sm:rounded-b-2xl bg-gradient-to-r from-orange-400 to-orange-600 origin-left"
      />
    </motion.div>
  );
}
