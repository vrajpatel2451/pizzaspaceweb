"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { HeroSearch } from "./hero-search";
import { CategoryResponse } from "@/types/category";

// Animation variants for staggered entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  },
};

interface HeroContentProps {
  trendingCategories: CategoryResponse[];
}

export function HeroContent({ trendingCategories }: HeroContentProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-start justify-center min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] py-8 sm:py-12 lg:py-20"
    >
      {/* Brand Badge */}
      <motion.div
        variants={badgeVariants}
        className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary/20 dark:border-primary/30 mb-4 sm:mb-6"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <span className="text-xs sm:text-sm font-semibold text-primary dark:text-primary-400">
          Pizza Space - Fresh & Fast
        </span>
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-[1.1] tracking-tight max-w-2xl"
      >
        Fresh Pizza{" "}
        <motion.span
          className="relative inline-block"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <span className="relative z-10 text-primary">Delivered</span>
          <motion.svg
            className="absolute -bottom-1 sm:-bottom-2 left-0 w-full h-2 sm:h-3 text-primary/30 dark:text-primary/20"
            viewBox="0 0 200 12"
            preserveAspectRatio="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          >
            <motion.path
              d="M0 8 Q 50 0, 100 8 T 200 8"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>
        </motion.span>{" "}
        to Your Door
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={itemVariants}
        className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed"
      >
        Experience the finest handcrafted pizzas made with premium ingredients,
        delivered hot and fresh in 30 minutes or less.
      </motion.p>

      {/* Search Bar */}
      <motion.div variants={itemVariants} className="mt-6 sm:mt-8 w-full lg:max-w-xl">
        <HeroSearch trendingCategories={trendingCategories} />
      </motion.div>

      {/* CTA Button */}
      <motion.div
        variants={itemVariants}
        className="mt-8 sm:mt-10"
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
      </motion.div>

    </motion.div>
  );
}
