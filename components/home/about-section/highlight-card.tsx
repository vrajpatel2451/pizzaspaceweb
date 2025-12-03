"use client";

import { useState, useEffect, useRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HighlightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient?: string;
  delay?: number;
}

export function HighlightCard({
  icon: Icon,
  title,
  description,
  gradient = "from-primary/10 to-orange-100/50 dark:from-primary/20 dark:to-primary/5",
  delay = 0,
}: HighlightCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
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
        "group transition-all duration-500 motion-reduce:transition-none hover:-translate-y-1 hover:scale-[1.02] motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={cn("relative rounded-2xl bg-gradient-to-br p-5 sm:p-6 border border-primary/10 dark:border-primary/20 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/10 motion-reduce:transition-none", gradient)}>
        {/* Subtle pattern background */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] rounded-2xl overflow-hidden pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 flex items-start gap-4">
          {/* Icon container */}
          <div className="flex-shrink-0 group-hover:rotate-3 transition-transform duration-400 motion-reduce:transition-none motion-reduce:group-hover:rotate-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white dark:bg-navy-800 shadow-md shadow-black/5 dark:shadow-black/20 flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300 motion-reduce:transition-none">
              <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
            </div>
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300 leading-snug break-words motion-reduce:transition-none">
              {title}
            </h4>
            <p className="text-muted-foreground text-sm sm:text-base mt-1.5 leading-relaxed whitespace-normal break-words">
              {description}
            </p>
          </div>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-tl from-primary/10 to-transparent rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-300 pointer-events-none overflow-hidden motion-reduce:transition-none" />
      </div>
    </div>
  );
}
