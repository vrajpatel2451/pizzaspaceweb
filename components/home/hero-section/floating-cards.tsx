"use client";

import { useEffect, useState, useRef } from "react";
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
  staggerClass: string;
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
    staggerClass: "stagger-1",
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
    staggerClass: "stagger-2",
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
    staggerClass: "stagger-3",
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
    staggerClass: "stagger-4",
  },
];

function AnimatedCounter({
  value,
  suffix,
  isVisible,
}: {
  value: number;
  suffix: string;
  isVisible: boolean;
}) {
  const [count, setCount] = useState(0);
  const isDecimal = value % 1 !== 0;

  useEffect(() => {
    if (!isVisible) return;

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
  }, [value, isVisible]);

  return (
    <span className="tabular-nums">
      {isDecimal ? count.toFixed(1) : Math.floor(count)}
      {suffix}
    </span>
  );
}

function FloatingStatBadge({
  stat,
  isVisible,
}: {
  stat: StatItem;
  isVisible: boolean;
}) {
  const Icon = stat.icon;

  return (
    <div
      style={{
        position: "absolute",
        top: stat.position.top,
        bottom: stat.position.bottom,
        right: stat.position.right,
        animationDelay: `${stat.floatDelay}s`,
      }}
      className={`pointer-events-auto animate-fade-in-up ${stat.staggerClass} animation-delay-800 motion-reduce:animate-none`}
    >
      <div
        className="group relative animate-float motion-reduce:animate-none"
        style={{ animationDelay: `${stat.floatDelay}s` }}
      >
        <div className="flex items-center gap-3 bg-white/95 dark:bg-navy-800/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-gray-100/80 dark:border-navy-700/80 shadow-xl shadow-black/10 dark:shadow-black/30 transition-all duration-300 hover:shadow-2xl hover:bg-white dark:hover:bg-navy-800 hover-scale">
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
                isVisible={isVisible}
              />
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {stat.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FloatingCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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
      className="absolute inset-0 pointer-events-none hidden lg:block z-10"
    >
      {stats.map((stat) => (
        <FloatingStatBadge
          key={stat.label}
          stat={stat}
          isVisible={isVisible}
        />
      ))}
    </div>
  );
}
