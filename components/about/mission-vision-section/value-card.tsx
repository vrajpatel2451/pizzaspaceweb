"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  delay?: number;
}

export function ValueCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-orange-500",
  gradientFrom = "from-orange-500/20",
  gradientTo = "to-orange-600/10",
  delay = 0,
}: ValueCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : delay, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card container with improved hover effects */}
      <motion.div
        whileHover={shouldReduceMotion ? {} : { y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative h-full bg-white dark:bg-navy-800 rounded-xl md:rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-md dark:shadow-navy-950/50 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-300"
      >
        {/* Icon container with animated background */}
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : delay + 0.1 }}
          className="mb-4 relative"
        >
          <motion.div
            animate={shouldReduceMotion ? {} : {
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, -5, 5, -5, 0] : 0,
            }}
            transition={{
              scale: { type: "spring", stiffness: 300, damping: 20 },
              rotate: { duration: 0.5 }
            }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} dark:${gradientFrom} dark:${gradientTo} flex items-center justify-center relative overflow-hidden`}
          >
            {/* Icon with bounce animation */}
            <motion.div
              animate={shouldReduceMotion ? {} : {
                y: isHovered ? [0, -3, 0] : 0,
              }}
              transition={{ duration: 0.4 }}
            >
              <Icon className={`w-6 h-6 ${iconColor} dark:${iconColor}`} />
            </motion.div>

            {/* Shine effect on hover */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: isHovered && !shouldReduceMotion ? "100%" : "-100%" }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              style={{ width: "50%" }}
            />
          </motion.div>

          {/* Glow effect on hover */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isHovered && !shouldReduceMotion ? 0.6 : 0, scale: isHovered ? 1.2 : 0.8 }}
            transition={{ duration: 0.3 }}
            className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} blur-md -z-10`}
          />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : delay + 0.2 }}
        >
          <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Decorative corner dot with pulse on hover */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={shouldReduceMotion ? {} : {
              scale: isHovered ? [1, 1.2, 1] : 1,
              opacity: isHovered ? [0.4, 0.8, 0.4] : 0.4,
            }}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
            className={`w-1.5 h-1.5 rounded-full ${iconColor.replace('text-', 'bg-')}`}
          />
        </div>
      </motion.div>

      {/* Outer glow on hover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered && !shouldReduceMotion ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 dark:from-orange-500/10 dark:to-orange-600/10 rounded-xl md:rounded-2xl blur-lg -z-10"
      />
    </motion.div>
  );
}
