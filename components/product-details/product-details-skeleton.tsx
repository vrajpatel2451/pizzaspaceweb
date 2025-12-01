"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { shimmerVariants } from "@/lib/animations";

interface ProductDetailsSkeletonProps {
  className?: string;
}

/**
 * Animated Skeleton with shimmer effect
 */
function AnimatedSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("relative overflow-hidden rounded-lg bg-muted", className)}
      animate="shimmer"
      variants={shimmerVariants}
      style={{
        background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function ProductDetailsSkeleton({
  className,
}: ProductDetailsSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Image skeleton */}
      <div className="space-y-3">
        <AnimatedSkeleton className="aspect-[4/3] w-full rounded-2xl" />
      </div>

      {/* Product info skeleton */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <AnimatedSkeleton className="h-7 w-2/3" />
          <AnimatedSkeleton className="h-7 w-20" />
        </div>
        <AnimatedSkeleton className="h-4 w-full" />
        <AnimatedSkeleton className="h-4 w-5/6" />
      </div>

      {/* Variant groups skeleton */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <AnimatedSkeleton className="h-5 w-32" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, j) => (
              <AnimatedSkeleton key={j} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ))}

      {/* Addon groups skeleton */}
      <div className="space-y-3">
        <AnimatedSkeleton className="h-5 w-40" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <AnimatedSkeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="sticky bottom-0 border-t bg-background pt-4">
        <div className="flex items-center justify-between gap-3">
          <AnimatedSkeleton className="h-12 w-32" />
          <AnimatedSkeleton className="h-10 w-24" />
          <AnimatedSkeleton className="h-12 flex-1" />
        </div>
      </div>
    </div>
  );
}
