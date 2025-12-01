"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Flame, TrendingUp, Star, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export type PopularityType = "most-ordered" | "best-seller" | "trending" | "top-rated" | "highly-reordered";

export interface PopularityBadgeProps {
  type?: PopularityType;
  className?: string;
  size?: "sm" | "default" | "lg";
  animate?: boolean;
}

const popularityConfig: Record<PopularityType, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: string;
}> = {
  "most-ordered": {
    label: "Most Ordered",
    icon: Flame,
    colors: "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white shadow-amber-200/50 dark:shadow-amber-900/30",
  },
  "best-seller": {
    label: "Best Seller",
    icon: Award,
    colors: "bg-gradient-to-r from-amber-400/90 to-yellow-500/90 text-amber-950 shadow-yellow-200/50 dark:shadow-yellow-900/30",
  },
  "trending": {
    label: "Trending",
    icon: TrendingUp,
    colors: "bg-gradient-to-r from-rose-500/90 to-pink-500/90 text-white shadow-rose-200/50 dark:shadow-rose-900/30",
  },
  "top-rated": {
    label: "Top Rated",
    icon: Star,
    colors: "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white shadow-emerald-200/50 dark:shadow-emerald-900/30",
  },
  "highly-reordered": {
    label: "Highly Reordered",
    icon: TrendingUp,
    colors: "bg-gradient-to-r from-violet-500/90 to-purple-500/90 text-white shadow-violet-200/50 dark:shadow-violet-900/30",
  },
};

const sizeConfig = {
  sm: {
    container: "px-1.5 py-0.5 gap-0.5 text-[10px]",
    icon: "size-2.5",
  },
  default: {
    container: "px-2 py-1 gap-1 text-xs",
    icon: "size-3",
  },
  lg: {
    container: "px-2.5 py-1.5 gap-1.5 text-sm",
    icon: "size-3.5",
  },
};

export function PopularityBadge({
  type = "most-ordered",
  className,
  size = "default",
  animate = true,
}: PopularityBadgeProps) {
  const shouldReduceMotion = useReducedMotion();
  const config = popularityConfig[type];
  const sizes = sizeConfig[size];
  const Icon = config.icon;

  const badgeContent = (
    <span
      className={cn(
        // Base styles
        "inline-flex items-center rounded-full font-semibold",
        // Shadow and glow
        "shadow-sm",
        // Colors
        config.colors,
        // Size
        sizes.container,
        className
      )}
    >
      <Icon className={cn(sizes.icon, "shrink-0")} />
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );

  if (!animate || shouldReduceMotion) {
    return badgeContent;
  }

  return (
    <motion.span
      className={cn(
        // Base styles
        "inline-flex items-center rounded-full font-semibold",
        // Shadow and glow
        "shadow-sm",
        // Colors
        config.colors,
        // Size
        sizes.container,
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
      whileHover={{
        scale: 1.05,
        transition: { duration: 0.2 },
      }}
    >
      <motion.span
        animate={
          type === "most-ordered" || type === "trending"
            ? {
                scale: [1, 1.2, 1],
              }
            : undefined
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      >
        <Icon className={cn(sizes.icon, "shrink-0")} />
      </motion.span>
      <span className="whitespace-nowrap">{config.label}</span>
    </motion.span>
  );
}
