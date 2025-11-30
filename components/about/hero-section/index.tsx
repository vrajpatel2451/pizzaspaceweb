"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Background gradient and decorative shapes
function BackgroundShapes() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white dark:from-navy-900 dark:via-navy-800 dark:to-navy-900" />

      {/* Animated circular shapes */}
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1, ease: "easeOut" }}
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-200/40 to-primary-300/20 dark:from-primary-500/10 dark:to-primary-600/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.2, delay: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
        className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-200/20 dark:from-amber-500/10 dark:to-orange-500/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 1.4, delay: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
        className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-primary-100/50 to-amber-100/30 dark:from-primary-600/10 dark:to-amber-600/5 blur-3xl"
      />

      {/* Decorative circles with staggered entrance */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.6 }}
        className="hidden lg:block absolute top-32 right-[15%] w-4 h-4 rounded-full bg-primary-400/60 dark:bg-primary-400/40"
      />

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.7 }}
        className="hidden lg:block absolute top-48 right-[25%] w-2 h-2 rounded-full bg-amber-400/80 dark:bg-amber-400/50"
      />

      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.8 }}
        className="hidden lg:block absolute bottom-40 left-[10%] w-3 h-3 rounded-full bg-primary-300/70 dark:bg-primary-400/40"
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}

// Floating decorative elements
function FloatingElements() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating pizza slice */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.5 }}
        className="absolute top-1/4 right-[10%] hidden xl:block"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-6xl opacity-20 dark:opacity-10">🍕</div>
        </motion.div>
      </motion.div>

      {/* Floating tomato */}
      <motion.div
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.8, delay: shouldReduceMotion ? 0 : 0.7 }}
        className="absolute bottom-1/3 left-[8%] hidden lg:block"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="text-4xl opacity-20 dark:opacity-10">🍅</div>
        </motion.div>
      </motion.div>

      {/* Sparkles */}
      <motion.div
        initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : 0.9 }}
        className="absolute top-1/3 left-[15%] hidden xl:block"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, -10, 0], rotate: [0, 15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <Sparkles className="w-8 h-8 text-orange-400/30 dark:text-orange-400/15" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function AboutHeroSection() {
  const shouldReduceMotion = useReducedMotion();

  // Staggered animation variants for text elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
        delayChildren: shouldReduceMotion ? 0 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      className="relative w-full overflow-hidden py-16 sm:py-20 md:py-28 lg:py-36"
      aria-label="About us hero section"
    >
      {/* Background decorative elements */}
      <BackgroundShapes />
      <FloatingElements />

      {/* Main content container */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          {/* Overline */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 mb-4 sm:mb-6"
          >
            <span className="h-px w-6 sm:w-8 bg-gradient-to-r from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 tracking-widest uppercase">
              Welcome to Pizza Space
            </span>
            <span className="h-px w-6 sm:w-8 bg-gradient-to-l from-transparent to-orange-500 dark:to-orange-400" aria-hidden="true" />
          </motion.div>

          {/* Main headline with word stagger */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white mb-4 sm:mb-6 tracking-tight px-2 sm:px-0"
          >
            Our{" "}
            <motion.span
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 bg-clip-text text-transparent"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Story
            </motion.span>
            ,{" "}
            <br className="hidden sm:block" />
            Your{" "}
            <motion.span
              className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent"
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Experience
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            For over two decades, we have been serving authentic Italian pizzas crafted
            with passion, quality ingredients, and a commitment to bringing joy to every
            table. Discover the journey that made us a beloved community favorite.
          </motion.p>

          {/* Decorative scroll indicator */}
          <motion.div
            variants={itemVariants}
            className="mt-8 sm:mt-12 flex justify-center"
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Scroll to explore
              </span>
              <div className="w-6 h-10 rounded-full border-2 border-slate-300 dark:border-slate-600 flex items-start justify-center p-2">
                <motion.div
                  animate={shouldReduceMotion ? {} : { y: [0, 12, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400"
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
