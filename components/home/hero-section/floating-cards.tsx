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
  bgColor: string;
  position: {
    top?: string;
    bottom?: string;
    right: string;
  };
  floatDelay: number;
  floatDuration: number;
}

const stats: StatItem[] = [
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Happy Customers",
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
    position: { top: "8%", right: "3%" },
    floatDelay: 0,
    floatDuration: 5,
  },
  {
    icon: Truck,
    value: 30,
    suffix: "min",
    label: "Fast Delivery",
    color: "text-green-500 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-500/20",
    position: { top: "28%", right: "15%" },
    floatDelay: 1.2,
    floatDuration: 4.5,
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "",
    label: "Average Rating",
    color: "text-amber-500 dark:text-amber-400",
    bgColor: "bg-amber-100 dark:bg-amber-500/20",
    position: { bottom: "35%", right: "5%" },
    floatDelay: 0.6,
    floatDuration: 5.5,
  },
  {
    icon: Award,
    value: 15,
    suffix: "+",
    label: "Awards Won",
    color: "text-primary dark:text-primary-400",
    bgColor: "bg-primary/10 dark:bg-primary/20",
    position: { bottom: "15%", right: "18%" },
    floatDelay: 1.8,
    floatDuration: 4,
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

    const duration = 2000;
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

function FloatingStatBadge({
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
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={
        isInView
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 30, scale: 0.9 }
      }
      transition={{
        duration: 0.6,
        delay: 0.8 + index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{
        position: "absolute",
        top: stat.position.top,
        bottom: stat.position.bottom,
        right: stat.position.right,
      }}
      className="pointer-events-auto"
    >
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: stat.floatDuration,
          delay: stat.floatDelay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        whileHover={{ scale: 1.05 }}
        className="group relative"
      >
        <div className="flex items-center gap-3 bg-white/95 dark:bg-navy-800/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-gray-100/80 dark:border-navy-700/80 shadow-xl shadow-black/10 dark:shadow-black/30 transition-all duration-300 hover:shadow-2xl hover:bg-white dark:hover:bg-navy-800">
          {/* Icon */}
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-full ${stat.bgColor} ${stat.color} transition-transform duration-300 group-hover:scale-110`}
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
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FloatingCards() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none hidden lg:block z-10"
    >
      {stats.map((stat, index) => (
        <FloatingStatBadge
          key={stat.label}
          stat={stat}
          index={index}
          isInView={isInView}
        />
      ))}
    </div>
  );
}
