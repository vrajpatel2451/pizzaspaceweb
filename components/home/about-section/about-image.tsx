"use client";

import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { Award, ChefHat } from "lucide-react";

const imageVariants: Variants = {
  hidden: { opacity: 0, x: -50, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.4,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
};

const decorativeVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: "easeOut",
    },
  },
};

export function AboutImage() {
  return (
    <motion.div
      variants={imageVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative"
    >
      {/* Decorative frame */}
      <div className="relative">
        {/* Background decorative shapes */}
        <motion.div
          variants={decorativeVariants}
          className="absolute -top-6 -left-6 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 dark:bg-primary/20 rounded-2xl"
        />
        <motion.div
          variants={decorativeVariants}
          className="absolute -bottom-6 -right-6 w-20 h-20 sm:w-28 sm:h-28 bg-orange-200/50 dark:bg-primary/15 rounded-full"
        />

        {/* Dotted pattern decoration */}
        <motion.div
          variants={decorativeVariants}
          className="absolute -bottom-8 -left-8 hidden sm:grid grid-cols-5 gap-2 opacity-30 dark:opacity-20"
        >
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-primary" />
          ))}
        </motion.div>

        {/* Main image container */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative z-10 overflow-hidden rounded-3xl shadow-2xl shadow-black/10 dark:shadow-black/30"
        >
          {/* Image wrapper with gradient overlay */}
          <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] w-full max-w-lg mx-auto lg:mx-0 bg-gradient-to-br from-navy-800 to-navy-900 dark:from-navy-700 dark:to-navy-800">
            {/* Pizza/Kitchen Image - Replace with actual image */}
            <Image
              src="/images/pizza-logo.png"
              alt="Our master chef crafting authentic Italian pizza"
              fill
              className="object-contain p-8 sm:p-12"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
            />

            {/* Gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />

            {/* Premium shine effect on hover */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ x: "200%", opacity: 0.3 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12"
            />
          </div>

          {/* Decorative border accent */}
          <div className="absolute inset-0 rounded-3xl border-4 border-primary/20 dark:border-primary/30 pointer-events-none" />
        </motion.div>

        {/* Established Badge */}
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="absolute -bottom-4 -right-4 sm:bottom-8 sm:-right-6 z-20"
        >
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="relative bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-navy-700">
              {/* Badge content */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Est.
                </span>
                <span className="text-3xl sm:text-4xl font-bold text-foreground">
                  2020
                </span>
                <span className="text-xs text-muted-foreground font-medium">
                  Years of Excellence
                </span>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xs font-bold">5+</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Quality Badge - Top Left */}
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="absolute -top-4 -left-4 sm:top-4 sm:-left-6 z-20"
        >
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className="bg-primary text-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-primary/25">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] sm:text-xs font-medium text-white/80 uppercase tracking-wide">
                    Award
                  </p>
                  <p className="text-sm sm:text-base font-bold">Best Pizza</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Chef Badge - Bottom Left */}
        <motion.div
          variants={badgeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="absolute bottom-20 -left-4 sm:bottom-24 sm:-left-8 z-20 hidden sm:block"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="bg-white dark:bg-navy-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl shadow-black/10 dark:shadow-black/30 border border-gray-100 dark:border-navy-700">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Expert
                  </p>
                  <p className="text-sm font-bold text-foreground">Chefs</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated ring decoration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border-2 border-dashed border-primary/10 dark:border-primary/20"
        />
      </motion.div>
    </motion.div>
  );
}
