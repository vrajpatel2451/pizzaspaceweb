/**
 * Animation Constants and Variants
 *
 * Centralized animation configurations for consistent motion design
 * across the application using Framer Motion.
 */

import { Variants, Transition } from "framer-motion";

// ============================================================================
// EASING CURVES
// ============================================================================

export const easings = {
  // Standard easing for smooth, natural motion
  easeOut: [0.25, 0.46, 0.45, 0.94] as const,
  easeIn: [0.55, 0.06, 0.68, 0.19] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const,

  // Spring-like bounce for playful interactions
  bounce: [0.34, 1.56, 0.64, 1] as const,

  // Sharp, quick movements
  sharp: [0.4, 0, 0.2, 1] as const,
} as const;

// ============================================================================
// SPRING CONFIGURATIONS
// ============================================================================

export const springs = {
  // Gentle spring for smooth, natural motion
  gentle: { type: "spring", stiffness: 300, damping: 24 } as const,

  // Responsive spring for interactive elements
  responsive: { type: "spring", stiffness: 400, damping: 17 } as const,

  // Bouncy spring for playful effects
  bouncy: { type: "spring", stiffness: 500, damping: 15 } as const,

  // Stiff spring for quick, snappy motion
  stiff: { type: "spring", stiffness: 600, damping: 20 } as const,
} as const;

// ============================================================================
// DURATION PRESETS
// ============================================================================

export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
} as const;

// ============================================================================
// STAGGER CONFIGURATIONS
// ============================================================================

export const stagger = {
  // Fast stagger for quick reveals
  fast: {
    staggerChildren: 0.08,
    delayChildren: 0.1,
  } as const,

  // Normal stagger for balanced timing
  normal: {
    staggerChildren: 0.12,
    delayChildren: 0.15,
  } as const,

  // Slow stagger for dramatic reveals
  slow: {
    staggerChildren: 0.15,
    delayChildren: 0.2,
  } as const,
} as const;

// ============================================================================
// COMMON ANIMATION VARIANTS
// ============================================================================

/**
 * Fade In/Out Animations
 */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: durations.fast,
      ease: easings.easeIn,
    },
  },
};

/**
 * Fade Up Animation (entrance from below)
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
};

/**
 * Fade Down Animation (entrance from above)
 */
export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
};

/**
 * Scale Up Animation (pop in effect)
 */
export const scaleUpVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.normal,
      ease: easings.bounce,
    },
  },
};

/**
 * Slide In From Left
 */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
};

/**
 * Slide In From Right
 */
export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
};

/**
 * Staggered Container (for lists/grids)
 */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      ...stagger.normal,
    },
  },
};

/**
 * Staggered Child Item
 */
export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
};

// ============================================================================
// HOVER ANIMATIONS
// ============================================================================

/**
 * Card Lift Effect (hover)
 */
export const cardLiftVariants: Variants = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: {
      duration: durations.normal,
      ease: easings.easeOut,
    },
  },
};

/**
 * Button Press Effect
 */
export const buttonPressVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, y: -2 },
  tap: { scale: 0.98 },
};

/**
 * Icon Bounce (playful hover effect)
 */
export const iconBounceVariants: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: [0, -8, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: durations.slow,
      ease: easings.easeOut,
    },
  },
};

// ============================================================================
// LOADING ANIMATIONS
// ============================================================================

/**
 * Pulse Animation (for loading states)
 */
export const pulseVariants: Variants = {
  pulse: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Spin Animation (for loading spinners)
 */
export const spinVariants: Variants = {
  spin: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// ============================================================================
// FLOATING ANIMATIONS
// ============================================================================

/**
 * Gentle Float Animation (y-axis bob)
 */
export const floatVariants = (delay = 0, duration = 4): Variants => ({
  float: {
    y: [0, -15, 0],
    transition: {
      duration,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

/**
 * 3D Float Animation (multi-axis)
 */
export const float3DVariants = (delay = 0): Variants => ({
  float: {
    y: [0, -10, 0],
    x: [0, 5, 0],
    rotate: [0, 2, 0],
    transition: {
      duration: 5,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
});

// ============================================================================
// SCROLL-TRIGGERED ANIMATIONS
// ============================================================================

/**
 * Scroll Fade Up (for scroll-triggered elements)
 */
export const scrollFadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slower,
      ease: easings.easeOut,
    },
  },
};

/**
 * Scroll Scale In (for scroll-triggered elements)
 */
export const scrollScaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: durations.slower,
      ease: easings.easeOut,
    },
  },
};

// ============================================================================
// PATH ANIMATIONS (for SVG)
// ============================================================================

/**
 * SVG Path Draw Animation
 */
export const pathDrawVariants: Variants = {
  hidden: {
    pathLength: 0,
    opacity: 0,
  },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      duration: durations.slower,
      ease: easings.easeOut,
    },
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Create staggered children container with custom delay
 */
export function createStaggerContainer(
  staggerDelay = 0.1,
  delayChildren = 0.2
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren,
      },
    },
  };
}

/**
 * Create custom fade transition
 */
export function createFadeTransition(duration = durations.normal): Transition {
  return {
    duration,
    ease: easings.easeOut,
  };
}

/**
 * Create custom spring transition
 */
export function createSpringTransition(
  stiffness = 400,
  damping = 17
): Transition {
  return {
    type: "spring",
    stiffness,
    damping,
  };
}
