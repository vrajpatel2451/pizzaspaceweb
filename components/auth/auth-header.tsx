"use client";

import { motion, Variants } from "framer-motion";

// Animation variants for staggered entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

interface AuthHeaderProps {
  badge?: string;
  headline: string;
  highlightedWord: string;
  subheadline: string;
}

export function AuthHeader({
  badge = "Pizza Space - Welcome",
  headline,
  highlightedWord,
  subheadline,
}: AuthHeaderProps) {
  // Split headline to insert highlighted word with decorative underline
  const headlineParts = headline.split(highlightedWord);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-8"
    >
      {/* Brand Badge with pulsing dot */}
      <motion.div variants={badgeVariants} className="mb-5">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          {badge}
        </span>
      </motion.div>

      {/* Animated headline with decorative underline */}
      <motion.h1
        variants={itemVariants}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight"
      >
        {headlineParts[0]}
        <span className="relative inline-block">
          <span className="relative z-10 text-orange-500">{highlightedWord}</span>
          <motion.svg
            className="absolute -bottom-1 left-0 w-full h-2 sm:h-3 text-orange-300 dark:text-orange-500/50"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          >
            <motion.path
              d="M0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </motion.svg>
        </span>
        {headlineParts[1]}
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        variants={itemVariants}
        className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed"
      >
        {subheadline}
      </motion.p>

      {/* Decorative divider */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-center gap-3 mt-5"
      >
        <span className="w-10 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-1.5 h-1.5 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-10 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
}
