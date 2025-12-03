"use client";

import Link from "next/link";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
  showText?: boolean;
}

export function Logo({
  variant = "default",
  className,
  showText = true,
}: LogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-2.5 group transition-all duration-300",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none rounded-lg",
        className
      )}
      aria-label="Pizza Space Home"
    >
      {/* Logo Icon */}
      <div
        className={cn(
          "relative flex items-center justify-center size-10 rounded-full",
          "transition-all duration-300",
          "shadow-md group-hover:shadow-lg",
          "active:scale-95",
          isLight
            ? "bg-white/90 dark:bg-white/20 backdrop-blur-sm group-hover:bg-white dark:group-hover:bg-white/30"
            : "bg-primary group-hover:bg-primary/90"
        )}
      >
        <div className="transition-transform duration-300 ease-out group-hover:rotate-12">
          <Pizza
            className={cn(
              "size-5",
              isLight ? "text-primary dark:text-white" : "text-primary-foreground"
            )}
          />
        </div>

        {/* Enhanced shine effect */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-white/20 to-transparent opacity-0 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100"
        />
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col transition-transform duration-200 group-hover:scale-[1.02]">
          <span
            className={cn(
              "text-lg sm:text-xl font-bold leading-tight transition-colors duration-300",
              isLight
                ? "text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-white/90"
                : "text-primary group-hover:text-primary/90"
            )}
          >
            Pizza Space
          </span>
          <span
            className={cn(
              "hidden sm:block text-[10px] font-medium tracking-wider uppercase",
              isLight ? "text-slate-600 dark:text-white/60" : "text-muted-foreground"
            )}
          >
            Authentic Italian
          </span>
        </div>
      )}
    </Link>
  );
}
