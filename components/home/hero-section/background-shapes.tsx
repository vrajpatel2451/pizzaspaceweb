"use client";

import { motion } from "framer-motion";

export function BackgroundShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white dark:from-navy-900 dark:via-navy-800 dark:to-navy-900" />

      {/* Animated circular shapes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary-200/40 to-primary-300/20 dark:from-primary-500/10 dark:to-primary-600/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-200/20 dark:from-amber-500/10 dark:to-orange-500/5 blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
        className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-primary-100/50 to-amber-100/30 dark:from-primary-600/10 dark:to-amber-600/5 blur-3xl"
      />

      {/* Decorative circles - visible only on larger screens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="hidden lg:block absolute top-32 right-[15%] w-4 h-4 rounded-full bg-primary-400/60 dark:bg-primary-400/40"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        className="hidden lg:block absolute top-48 right-[25%] w-2 h-2 rounded-full bg-amber-400/80 dark:bg-amber-400/50"
      />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="hidden lg:block absolute bottom-40 left-[10%] w-3 h-3 rounded-full bg-primary-300/70 dark:bg-primary-400/40"
      />

      {/* Grid pattern overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-foreground) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
