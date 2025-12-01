"use client";

import { useEffect, useState } from "react";

/**
 * Hook to detect if a media query matches
 * @param query - Media query string (e.g., "(min-width: 640px)")
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window === "undefined") {
      return;
    }

    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create event listener
    const listener = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // Add listener (use deprecated addListener for older browsers)
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      // @ts-expect-error - deprecated but needed for older browsers
      media.addListener(listener);
    }

    // Cleanup
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        // @ts-expect-error - deprecated but needed for older browsers
        media.removeListener(listener);
      }
    };
  }, [query]);

  return matches;
}
