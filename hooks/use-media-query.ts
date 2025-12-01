"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if a media query matches
 * SSR-safe: returns false on server, actual match on client
 *
 * @param query - Media query string (e.g., "(min-width: 640px)")
 * @returns true if the media query matches, false otherwise
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with a function to avoid hydration mismatch
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);

    // Update if initial value differs (handles SSR case)
    if (matches !== mediaQuery.matches) {
      setMatches(mediaQuery.matches);
    }

    // Create event listener for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add listener
    mediaQuery.addEventListener("change", handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [query, matches]);

  return matches;
}

/**
 * Convenience hook to detect mobile viewport
 * Uses Tailwind's sm breakpoint (640px)
 *
 * @returns true if viewport is mobile (<640px), false otherwise
 */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 639px)");
}
