"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface AuthHeaderProps {
  badge?: string;
  headline: string;
  highlightedWord: string;
  subheadline: string;
}

export function AuthHeader({
  badge = "Pizza Space - Welcome",
  headline,
  highlightedWord,
  subheadline,
}: AuthHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Split headline to insert highlighted word with decorative underline
  const headlineParts = headline.split(highlightedWord);

  return (
    <div
      className={cn(
        "text-center mb-8 transition-opacity duration-500",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Brand Badge with pulsing dot */}
      <div
        className={cn(
          "mb-5 transition-all duration-500",
          isVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-2.5"
        )}
        style={{ transitionDelay: "100ms" }}
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          {badge}
        </span>
      </div>

      {/* Animated headline with decorative underline */}
      <h1
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "220ms" }}
      >
        {headlineParts[0]}
        <span className="relative inline-block">
          <span className="relative z-10 text-orange-500">{highlightedWord}</span>
          <svg
            className={cn(
              "absolute -bottom-1 left-0 w-full h-2 sm:h-3 text-orange-300 dark:text-orange-500/50 transition-all duration-800",
              isVisible ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: "600ms" }}
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={cn(
                "transition-all duration-800",
                isVisible ? "[stroke-dashoffset:0]" : "[stroke-dashoffset:100]"
              )}
              style={{
                strokeDasharray: 100,
                strokeDashoffset: isVisible ? 0 : 100,
                transition: "stroke-dashoffset 0.8s ease-out 0.6s"
              }}
            />
          </svg>
        </span>
        {headlineParts[1]}
      </h1>

      {/* Subheadline */}
      <p
        className={cn(
          "mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "340ms" }}
      >
        {subheadline}
      </p>

      {/* Decorative divider */}
      <div
        className={cn(
          "flex items-center justify-center gap-3 mt-5 transition-all duration-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
        style={{ transitionDelay: "460ms" }}
      >
        <span className="w-10 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-1.5 h-1.5 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-10 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>
    </div>
  );
}
