"use client";

import { motion } from "framer-motion";

export function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, x: 50 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="relative hidden lg:flex items-center justify-center min-h-[600px]"
    >
      {/* Main circular backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-[450px] h-[450px] xl:w-[550px] xl:h-[550px] rounded-full bg-gradient-to-br from-primary-100/60 via-amber-100/40 to-orange-100/30 dark:from-primary-500/20 dark:via-amber-500/10 dark:to-orange-500/5"
        />
      </div>

      {/* Inner circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="w-[350px] h-[350px] xl:w-[420px] xl:h-[420px] rounded-full bg-gradient-to-tr from-primary-200/50 via-amber-100/30 to-transparent dark:from-primary-600/20 dark:via-amber-500/10 dark:to-transparent"
        />
      </div>

      {/* Main Hero Image */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10"
      >
        {/* Floating animation on the image */}
        <motion.div
          animate={{
            y: [0, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="relative w-[380px] h-[380px] xl:w-[480px] xl:h-[480px]">
            {/* Glow effect behind image */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-b from-primary/20 to-amber-500/10 blur-2xl dark:from-primary/15 dark:to-amber-500/5" />

            {/* Pizza Image - Using placeholder until real image is available */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Placeholder pizza visual */}
              <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 dark:from-amber-400 dark:via-orange-500 dark:to-red-600 shadow-2xl relative overflow-hidden">
                {/* Cheese texture */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500" />
                {/* Sauce */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700" />
                {/* Center cheese */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-500" />
                {/* Pepperoni spots */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute bottom-1/3 left-1/4 w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute bottom-1/4 right-1/3 w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                {/* Basil leaves */}
                <div className="absolute top-1/3 right-1/3 w-6 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full rotate-45" />
                <div className="absolute bottom-1/2 left-1/2 w-5 h-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full -rotate-12" />
              </div>
              {/* Shadow under pizza */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/10 dark:bg-black/20 blur-xl rounded-full" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Decorative elements around the pizza */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute top-20 left-10"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-500 shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍅</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
        className="absolute bottom-32 left-8"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-lg flex items-center justify-center">
            <span className="text-xl">🌿</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="absolute top-40 right-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg flex items-center justify-center">
            <span className="text-lg">🧀</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
        className="absolute bottom-24 right-16"
      >
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg flex items-center justify-center">
            <span className="text-xl">🌶️</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Steam/heat waves effect */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [-10, -40],
              scale: [1, 1.2, 0.8],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm"
          />
        ))}
      </div>
    </motion.div>
  );
}
