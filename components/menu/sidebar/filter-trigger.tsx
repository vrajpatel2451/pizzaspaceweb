"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterTriggerProps {
  activeFilterCount: number;
  onClick: () => void;
}

/**
 * FilterTrigger - Client Component
 *
 * Purpose: Floating Action Button (FAB) to trigger mobile filter sheet
 * - Fixed position at bottom-right on mobile
 * - Shows active filter count badge
 * - Hidden on desktop (lg:hidden)
 * - Uses SlidersHorizontal icon from lucide-react
 * - Orange brand color with shadow
 * - Safe area inset support for iOS notch
 */
export function FilterTrigger({
  activeFilterCount,
  onClick,
}: FilterTriggerProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed z-[1030]",
        "w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl",
        "bg-orange-500 hover:bg-orange-600 text-white",
        "transition-all duration-200",
        "hover:shadow-[0_20px_25px_-5px_rgba(249,115,22,0.3)]",
        "active:scale-95", // Touch feedback
        "lg:hidden", // Hide on desktop
        "flex items-center justify-center",
        "touch-manipulation" // Optimized for touch
      )}
      style={{
        bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))",
        right: "1rem",
      }}
      aria-label={`Open filters${
        activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ""
      }`}
    >
      <SlidersHorizontal className="w-5 h-5 sm:w-6 sm:h-6" />

      {/* Active Filter Count Badge */}
      {activeFilterCount > 0 && (
        <Badge
          className={cn(
            "absolute -top-1 -right-1",
            "h-6 w-6 sm:h-7 sm:w-7 rounded-full p-0",
            "flex items-center justify-center",
            "bg-red-600 text-white",
            "text-xs font-bold",
            "border-2 border-background"
          )}
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
}
