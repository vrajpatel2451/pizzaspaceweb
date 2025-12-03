"use client";

import { useEffect, useState, useRef } from "react";
import { Users, Star, Truck, Award } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 800 + index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={cn(
        "group relative transition-all duration-500 motion-reduce:transition-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}
    >
      <div className="flex items-center gap-3 bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm rounded-xl px-4 py-3 border border-gray-100/80 dark:border-navy-700/80 shadow-lg shadow-black/5 dark:shadow-black/10 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:bg-white dark:hover:bg-navy-800 motion-reduce:transition-none motion-reduce:hover:scale-100">
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-navy-700 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100",
            stat.color
          )}
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
    </div>
  );
}

export function HeroStats() {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-100px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "mt-8 sm:mt-10 lg:mt-14 transition-opacity duration-500 motion-reduce:transition-none",
        isInView ? "opacity-100" : "opacity-0"
      )}
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
    </div>
  );
}
