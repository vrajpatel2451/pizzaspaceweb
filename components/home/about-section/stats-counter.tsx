"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { Users, UtensilsCrossed, MapPin, Clock } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface StatItem {
  icon: LucideIcon;
  value: number;
  suffix: string;
  label: string;
  color: string;
  bgColor: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Customers",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
  },
  {
    icon: UtensilsCrossed,
    value: 50,
    suffix: "+",
    label: "Menu Items",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-500/20",
  },
  {
    icon: MapPin,
    value: 5,
    suffix: "",
    label: "Locations",
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-500/20",
  },
  {
    icon: Clock,
    value: 30,
    suffix: " min",
    label: "Avg. Delivery",
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-500/20",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// Animated count-up hook
function useCountUp(target: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!startOnView || !isInView || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function for smooth deceleration
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.floor(easedProgress * target);

      setCount(currentCount);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(updateCount);
  }, [target, duration, isInView, startOnView]);

  return { count, ref };
}

interface StatCardProps {
  stat: StatItem;
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const { count, ref } = useCountUp(stat.value, 2000 + index * 200);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative"
    >
      <div className="relative bg-white dark:bg-navy-800 rounded-2xl p-4 sm:p-5 shadow-lg shadow-black/5 dark:shadow-black/20 border border-gray-100 dark:border-navy-700 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-black/10 dark:group-hover:shadow-black/30">
        {/* Subtle gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        <div className="relative z-10 flex items-center gap-3 sm:gap-4">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}
          >
            <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.color}`} />
          </motion.div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-0.5 flex-wrap">
              <motion.span
                key={count}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl sm:text-3xl font-bold text-foreground tabular-nums leading-tight"
              >
                {count}
              </motion.span>
              <span className="text-xl sm:text-2xl font-bold text-primary leading-tight">
                {stat.suffix}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 leading-snug whitespace-normal break-words">
              {stat.label}
            </p>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
}

export function StatsCounter() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </motion.div>
  );
}
