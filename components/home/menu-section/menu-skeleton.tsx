"use client";

import { cn } from "@/lib/utils";

interface MenuSkeletonProps {
  count?: number;
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in-0 slide-in-from-bottom-2 duration-400 motion-reduce:animate-none"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image skeleton */}
      <div className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
      </div>

      {/* Content skeleton */}
      <div className="p-4 sm:p-5 space-y-3">
        {/* Size info */}
        <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"
            style={{ animationDelay: "100ms" }}
          />
        </div>

        {/* Title */}
        <div className="h-5 w-3/4 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"
            style={{ animationDelay: "200ms" }}
          />
        </div>

        {/* Description lines */}
        <div className="space-y-2">
          <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"
              style={{ animationDelay: "300ms" }}
            />
          </div>
          <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer"
              style={{ animationDelay: "400ms" }}
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
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-200/50 dark:via-orange-500/10 to-transparent animate-shimmer"
              style={{ animationDelay: "500ms" }}
            />
          </div>
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full" />
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer {
            animation: none;
          }
        }
      `}</style>
    </div>
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
        <div
          key={i}
          className="h-11 px-7 py-3 bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-300 motion-reduce:animate-none"
          style={{ width: `${width}px`, animationDelay: `${i * 50}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer" />
        </div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-shimmer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
