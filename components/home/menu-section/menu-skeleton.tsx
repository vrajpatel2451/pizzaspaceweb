"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MenuSkeletonProps {
  count?: number;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm"
    >
      {/* Image skeleton */}
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Content skeleton */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Size info */}
        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.1,
            }}
          />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.2,
            }}
          />
        </div>

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.3,
              }}
            />
          </div>
          <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.4,
              }}
            />
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-3.5 h-3.5 bg-slate-100 dark:bg-slate-800 rounded-full"
            />
          ))}
        </div>

        {/* Price and button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-7 w-20 bg-orange-100 dark:bg-orange-500/10 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/50 dark:via-orange-500/10 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
          </div>
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}

export function MenuSkeleton({ count = 8 }: MenuSkeletonProps) {
  return (
    <div
      className={cn(
        "grid gap-5 sm:gap-6 lg:gap-8",
        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
      )}
      aria-busy="true"
      aria-label="Loading menu items"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}

// Predefined widths for consistent rendering
const TAB_WIDTHS = [70, 85, 65, 90, 75, 80];

// Tab skeleton for loading state
export function TabsSkeleton() {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14">
      {TAB_WIDTHS.map((width, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="h-11 px-7 py-3 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden"
          style={{ width: `${width}px` }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent"
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
