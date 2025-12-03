"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
  const [isVisible, setIsVisible] = useState(false);
  const config = popularityConfig[type];
  const sizes = sizeConfig[size];
  const Icon = config.icon;
  const shouldPulse = type === "most-ordered" || type === "trending";

  useEffect(() => {
    if (animate) {
      requestAnimationFrame(() => setIsVisible(true));
    }
  }, [animate]);

  return (
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
        // Animation
        animate && "transition-all duration-300 motion-reduce:transition-none",
        animate && (isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"),
        animate && "hover:scale-105 motion-reduce:hover:scale-100",
        className
      )}
    >
      <span
        className={cn(
          shouldPulse && animate && "animate-pulse motion-reduce:animate-none"
        )}
      >
        <Icon className={cn(sizes.icon, "shrink-0")} />
      </span>
      <span className="whitespace-nowrap">{config.label}</span>
    </span>
  );
}
