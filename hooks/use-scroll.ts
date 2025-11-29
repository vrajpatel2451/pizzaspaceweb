"use client";

import * as React from "react";

/**
 * Custom hook to detect if the user has scrolled past a threshold
 * @param threshold - Number of pixels to scroll before returning true
 * @returns boolean indicating if scrolled past threshold
 */
export function useScroll(threshold: number = 10): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  const handleScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    // Check initial scroll position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrolled;
}

/**
 * Custom hook to get the current scroll position
 * @returns Object with x and y scroll positions
 */
export function useScrollPosition(): { x: number; y: number } {
  const [scrollPosition, setScrollPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    const handleScroll = () => {
      setScrollPosition({
        x: window.scrollX,
        y: window.scrollY,
      });
    };

    // Check initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollPosition;
}

/**
 * Custom hook to detect scroll direction
 * @returns "up" | "down" | null
 */
export function useScrollDirection(): "up" | "down" | null {
  const [scrollDirection, setScrollDirection] = React.useState<"up" | "down" | null>(null);
  const [prevScrollY, setPrevScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        setScrollDirection("down");
      } else if (currentScrollY < prevScrollY) {
        setScrollDirection("up");
      }

      setPrevScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return scrollDirection;
}
