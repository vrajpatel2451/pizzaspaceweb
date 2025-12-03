"use client";

import { useEffect, useRef, useState } from "react";
import { Users, UtensilsCrossed, MapPin } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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
    label: "Customers",
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-500/20",
  },
  {
    icon: UtensilsCrossed,
    value: 50,
    suffix: "+",
    label: "Dishes",
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
];

// Animated count-up hook
function useCountUp(
  target: number,
  duration: number = 2000,
  startOnView: boolean = true
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      ref={ref}
      className={cn(
        "group relative",
        "transition-all duration-500 motion-reduce:transition-none",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}
    >
      <div className="relative bg-card rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md border border-border/50 transition-all duration-300 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
        {/* Subtle gradient background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl motion-reduce:transition-none" />

        <div className="relative z-10 flex items-center gap-3 sm:gap-4">
          {/* Icon */}
          <div
            className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
              "transition-transform duration-300 group-hover:scale-110",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
              stat.bgColor
            )}
          >
            <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6", stat.color)} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-0.5 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-foreground tabular-nums leading-tight">
                {count}
              </span>
              <span className="text-xl md:text-2xl font-bold text-primary leading-tight">
                {stat.suffix}
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground font-medium mt-1 leading-snug whitespace-normal break-words">
              {stat.label}
            </p>
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none motion-reduce:transition-none" />
      </div>
    </div>
  );
}

export function StatsCounter() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </div>
  );
}
