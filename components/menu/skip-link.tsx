"use client";

import { cn } from "@/lib/utils";

/**
 * SkipLink - Accessibility Component
 *
 * Purpose: Provides a skip navigation link for keyboard users
 * - Allows screen reader and keyboard users to skip to main content
 * - Visually hidden until focused with keyboard (Tab)
 * - WCAG 2.1 AA requirement for bypass blocks
 * - Styled to match brand when visible
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={cn(
        // Hidden by default
        "sr-only",
        // Visible when focused
        "focus:not-sr-only",
        // Positioning and z-index
        "focus:absolute focus:top-4 focus:left-4 focus:z-[9999]",
        // Styling
        "focus:px-4 focus:py-2",
        "focus:bg-orange-500 focus:text-white",
        "focus:rounded-md focus:shadow-lg",
        "focus:font-medium focus:text-sm",
        // Focus ring
        "focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2",
        // Transition
        "transition-all"
      )}
    >
      Skip to main content
    </a>
  );
}
