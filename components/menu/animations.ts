/**
 * Menu Page Animation Variants
 *
 * Centralized animation configurations for Menu Page components.
 * All animations respect prefers-reduced-motion accessibility setting.
 *
 * Based on UX Design specs:
 * - Product Grid: 50ms stagger delay, fade + scale
 * - Sidebar: Subtle hover states, slide animation for active indicator
 * - Filter Chips: Spring physics for add/remove
 * - Empty State: Gentle floating for illustration
 */

import { Variants } from "framer-motion";

// ============================================================================
// PRODUCT GRID ANIMATIONS
// ============================================================================

/**
 * Container variant for product grid
 * Stagger children on load with 50ms delay between items
 */
export const productGridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // 50ms between each card
      delayChildren: 0.1, // Start after 100ms
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * Individual product card animation
 * Fade in with subtle y-axis movement and scale
 */
export const productGridItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0, 0, 0.2, 1], // ease-out
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// SIDEBAR ANIMATIONS
// ============================================================================

/**
 * Category accordion item hover effect
 * Subtle scale for visual feedback
 */
export const categoryHover: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.01,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

/**
 * Active category indicator slide animation
 * Smooth left border appearance
 */
export const categoryIndicator: Variants = {
  initial: {
    scaleX: 0,
    opacity: 0,
  },
  animate: {
    scaleX: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

/**
 * Subcategory list stagger animation
 * Reveal subcategories with stagger when accordion opens
 */
export const subcategoryContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03, // 30ms between subcategories
      delayChildren: 0.05,
    },
  },
};

/**
 * Individual subcategory item animation
 */
export const subcategoryItem: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// FILTER CHIP ANIMATIONS
// ============================================================================

/**
 * Container for filter chips
 * Layout animation for smooth reflow when chips are added/removed
 */
export const filterChipContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

/**
 * Individual filter chip animation
 * Spring physics for playful add/remove
 */
export const filterChip: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
  exit: {
    scale: 0.8,
    opacity: 0,
    x: -10,
    transition: {
      duration: 0.15,
    },
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.15,
    },
  },
};

/**
 * Remove button (X) animation
 * Rotate slightly on hover for feedback
 */
export const chipRemoveButton: Variants = {
  rest: {
    rotate: 0,
    scale: 1,
  },
  hover: {
    rotate: 90,
    scale: 1.1,
    transition: {
      duration: 0.15,
    },
  },
};

// ============================================================================
// EMPTY STATE ANIMATIONS
// ============================================================================

/**
 * Empty state container fade in
 */
export const emptyStateContainer: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

/**
 * Floating animation for empty state illustration
 * Gentle y-axis bob for visual interest
 */
export const emptyStateFloat: Variants = {
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Illustration icon animation
 * Scale pulse for emphasis
 */
export const emptyStateIcon: Variants = {
  initial: {
    scale: 0,
    rotate: -10,
  },
  animate: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.1,
    },
  },
  float: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================================================
// PAGINATION ANIMATIONS
// ============================================================================

/**
 * Pagination button hover effect
 */
export const paginationButton: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  tap: {
    scale: 0.98,
  },
};

/**
 * Active page indicator slide animation
 */
export const activePage: Variants = {
  initial: {
    scale: 0.9,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// ============================================================================
// MOBILE SHEET ANIMATIONS
// ============================================================================

/**
 * Mobile filter sheet slide up animation
 * Spring physics for natural feel
 */
export const mobileSheet: Variants = {
  initial: {
    y: "100%",
  },
  animate: {
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 300,
    },
  },
  exit: {
    y: "100%",
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1], // ease-in
    },
  },
};

/**
 * Sheet backdrop fade
 */
export const sheetBackdrop: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

/**
 * Shimmer effect for skeleton loaders
 */
export const shimmer: Variants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

/**
 * Pulse animation for loading indicators
 */
export const pulse: Variants = {
  pulse: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user prefers reduced motion
 * Returns true if reduced motion is preferred
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get animation props that respect reduced motion preference
 * Returns empty object if reduced motion is preferred
 */
export function getAnimationProps(variants: Variants) {
  if (prefersReducedMotion()) {
    return {};
  }

  return {
    variants,
    initial: "hidden" in variants ? "hidden" : "initial",
    animate: "visible" in variants ? "visible" : "animate",
    exit: "exit" in variants ? "exit" : undefined,
  };
}

/**
 * Get hover animation props that respect reduced motion
 */
export function getHoverAnimationProps(variants: Variants) {
  if (prefersReducedMotion()) {
    return {};
  }

  return {
    variants,
    initial: "rest",
    whileHover: "hover",
    whileTap: "tap" in variants ? "tap" : undefined,
  };
}
