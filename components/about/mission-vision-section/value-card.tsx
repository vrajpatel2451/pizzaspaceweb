"use client";

import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  iconColor?: string;
  gradientFrom?: string;
  gradientTo?: string;
  index?: number;
  isVisible?: boolean;
}

export function ValueCard({
  icon: Icon,
  title,
  description,
  iconColor = "text-orange-500",
  gradientFrom = "from-orange-500/20",
  gradientTo = "to-orange-600/10",
  index = 0,
  isVisible = true,
}: ValueCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={cn(
        "group relative transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
      style={{ transitionDelay: isVisible ? `${index * 100}ms` : "0ms" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card container with improved hover effects */}
      <div
        className={cn(
          "relative h-full bg-white dark:bg-navy-800 rounded-xl md:rounded-2xl p-6 border border-slate-200 dark:border-navy-700 shadow-md dark:shadow-navy-950/50 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-orange-500/5 hover:border-orange-200 dark:hover:border-orange-800/50 transition-all duration-300",
          isHovered && "-translate-y-1"
        )}
      >
        {/* Icon container with animated background */}
        <div
          className={cn(
            "mb-4 relative transition-all duration-500",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
          )}
          style={{ transitionDelay: isVisible ? `${index * 100 + 100}ms` : "0ms" }}
        >
          <div
            className={cn(
              `w-12 h-12 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} flex items-center justify-center relative overflow-hidden transition-transform duration-300`,
              isHovered && "scale-110"
            )}
          >
            {/* Icon */}
            <div className={cn("transition-transform duration-300", isHovered && "-translate-y-0.5")}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>

            {/* Shine effect on hover */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-600",
                isHovered ? "translate-x-full" : "-translate-x-full"
              )}
              style={{ width: "50%" }}
            />
          </div>

          {/* Glow effect on hover */}
          <div
            className={cn(
              `absolute inset-0 rounded-xl bg-gradient-to-br ${gradientFrom} ${gradientTo} blur-md -z-10 transition-all duration-300`,
              isHovered ? "opacity-60 scale-125" : "opacity-0 scale-80"
            )}
          />
        </div>

        {/* Content */}
        <div
          className={cn(
            "transition-all duration-500",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
          style={{ transitionDelay: isVisible ? `${index * 100 + 200}ms` : "0ms" }}
        >
          <h4 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 dark:text-white mb-1.5 sm:mb-2">
            {title}
          </h4>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative corner dot with pulse on hover */}
        <div className="absolute top-4 right-4">
          <div
            className={cn(
              `w-1.5 h-1.5 rounded-full transition-all duration-300 ${iconColor.replace('text-', 'bg-')}`,
              isHovered ? "opacity-80 scale-125" : "opacity-40 scale-100"
            )}
          />
        </div>
      </div>

      {/* Outer glow on hover */}
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-orange-500/20 to-orange-600/20 dark:from-orange-500/10 dark:to-orange-600/10 rounded-xl md:rounded-2xl blur-lg -z-10 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
