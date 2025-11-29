"use client";

import { motion } from "framer-motion";
import { AboutImage } from "./about-image";
import { AboutContent } from "./about-content";

// Background decorative blob shapes
function BackgroundBlobs() {
  return (
    <>
      {/* Top left blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none"
      />
      {/* Bottom right blob */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
        className="absolute -bottom-32 -right-32 w-80 h-80 bg-orange-100/50 dark:bg-primary/5 rounded-full blur-3xl pointer-events-none"
      />
      {/* Center accent blob */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-50/30 via-transparent to-amber-50/30 dark:from-primary/5 dark:via-transparent dark:to-primary/3 rounded-full blur-3xl pointer-events-none"
      />
    </>
  );
}

// Floating ingredient decorations
function FloatingIngredients() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating tomato - top right */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -10 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        className="absolute top-20 right-[15%] hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-200/50 dark:shadow-red-900/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-2 bg-green-500 rounded-full" />
          </div>
        </motion.div>
      </motion.div>

      {/* Floating basil leaf - bottom left */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: 10 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="absolute bottom-32 left-[10%] hidden lg:block"
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="w-8 h-12 bg-gradient-to-t from-green-600 to-green-400 rounded-full rotate-45 shadow-lg shadow-green-200/50 dark:shadow-green-900/30" />
        </motion.div>
      </motion.div>

      {/* Floating cheese piece - mid right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-1/2 right-[5%] hidden xl:block"
      >
        <motion.div
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-sm rotate-12 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-900/30" style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function AboutSection() {
  return (
    <section
      className="relative bg-white dark:bg-navy-900 py-20 sm:py-24 lg:py-32 overflow-hidden"
      aria-labelledby="about-heading"
    >
      {/* Background decorative elements */}
      <BackgroundBlobs />
      <FloatingIngredients />

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left side - Image */}
          <AboutImage />

          {/* Right side - Content */}
          <AboutContent />
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-12 text-gray-50 dark:text-navy-800"
          viewBox="0 0 1200 60"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 L0,30 Q300,0 600,30 T1200,30 L1200,60 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </section>
  );
}

// Named export for dynamic import compatibility
export { AboutSection as default };
