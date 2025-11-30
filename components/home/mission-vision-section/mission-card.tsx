"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MissionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconGradient?: string;
  delay?: number;
}

export function MissionCard({
  icon: Icon,
  title,
  description,
  iconGradient = "from-orange-500 to-orange-600",
  delay = 0,
}: MissionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="group relative"
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 dark:from-orange-500/10 dark:to-amber-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Card container */}
      <div className="relative h-full bg-white/70 dark:bg-navy-800/70 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 dark:border-navy-700/80 shadow-lg shadow-slate-200/50 dark:shadow-navy-950/50 hover:shadow-xl hover:shadow-slate-300/50 dark:hover:shadow-navy-950/70 transition-all duration-500 hover:-translate-y-1">
        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden rounded-tr-2xl md:rounded-tr-3xl">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/10 to-transparent dark:from-orange-500/5 dark:to-transparent" />
        </div>

        {/* Icon container with animated background */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
          className="relative mb-6 sm:mb-8"
        >
          {/* Icon background glow */}
          <div
            className={`absolute inset-0 w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br ${iconGradient} rounded-2xl blur-lg opacity-40 dark:opacity-30 group-hover:opacity-60 dark:group-hover:opacity-50 transition-opacity duration-500`}
          />

          {/* Icon container */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className={`relative w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 dark:shadow-orange-500/20`}
          >
            {/* Inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-white/10" />

            {/* Animated pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-white/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Icon */}
            <Icon className="relative w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-white drop-shadow-sm" />
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.3 }}
        >
          {/* Title with underline accent */}
          <div className="mb-4 sm:mb-5">
            <h3 className="text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-slate-900 dark:text-white tracking-tight">
              {title}
            </h3>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: delay + 0.4 }}
              className="origin-left mt-2 h-1 w-12 sm:w-14 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 dark:from-orange-400 dark:to-orange-500"
            />
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-[1.0625rem] text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.5 }}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6"
        >
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400/50 dark:bg-orange-500/40" />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400/30 dark:bg-orange-500/25" />
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400/15 dark:bg-orange-500/15" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
