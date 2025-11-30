"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Star, Truck, Award } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Customers",
    color: "text-blue-500 dark:text-blue-400",
  },
  {
    icon: Truck,
    value: 30,
    suffix: "min",
    label: "Fast Delivery",
    color: "text-green-500 dark:text-green-400",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    label: "Average Rating",
    color: "text-amber-500 dark:text-amber-400",
  },
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Awards Won",
    color: "text-primary dark:text-primary-400",
  },
];

function AnimatedCounter({
  value,
  suffix,
  isInView,
}: {
  value: number;
  suffix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = value / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, isInView]);

  return (
    <span className="tabular-nums">
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

function StatBadge({
  stat,
  index,
  isInView,
}: {
  stat: StatItem;
  index: number;
  isInView: boolean;
}) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay: 0.8 + index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="group relative"
    >
      <div className="flex items-center gap-3 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100/80 dark:border-navy-700/80 shadow-lg shadow-black/5 dark:shadow-black/10 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white dark:hover:bg-navy-800">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-navy-700 ${stat.color} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <span className="text-lg font-bold text-foreground leading-tight">
            <AnimatedCounter
              value={stat.value}
              suffix={stat.suffix}
              isInView={isInView}
            />
          </span>
          <span className="text-xs text-muted-foreground">{stat.label}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="mt-8 sm:mt-10 lg:mt-14"
    >
      {/* Desktop: Inline layout */}
      <div className="hidden sm:flex flex-wrap gap-3">
        {stats.map((stat, index) => (
          <StatBadge
            key={stat.label}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>

      {/* Mobile: 2x2 Grid */}
      <div className="sm:hidden grid grid-cols-2 gap-2.5 sm:gap-3">
        {stats.map((stat, index) => (
          <StatBadge
            key={stat.label}
            stat={stat}
            index={index}
            isInView={isInView}
          />
        ))}
      </div>
    </motion.div>
  );
}
