"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function ThemeToggle({ className, size = "default" }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  const sizeClasses = {
    sm: "size-8",
    default: "size-10",
    lg: "size-12",
  };

  const iconSizeClasses = {
    sm: "size-4",
    default: "size-5",
    lg: "size-6",
  };

  // Show placeholder while mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center rounded-full",
          "bg-transparent transition-all duration-300",
          "hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
          sizeClasses[size],
          className
        )}
        aria-label="Toggle theme"
        disabled
      >
        <div className={cn("rounded-full bg-muted animate-pulse", iconSizeClasses[size])} />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "group relative inline-flex items-center justify-center rounded-full",
        "bg-transparent transition-all duration-300 cursor-pointer",
        "hover:bg-accent active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
        sizeClasses[size],
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Current: ${isDark ? "Dark" : "Light"} mode`}
    >
      {/* Container for icons with overflow hidden for smooth transitions */}
      <div className="relative overflow-hidden">
        {/* Sun Icon - visible in dark mode (to switch to light) */}
        <Sun
          className={cn(
            iconSizeClasses[size],
            "absolute inset-0 m-auto transition-all duration-500 ease-in-out",
            "text-amber-500",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
          strokeWidth={2}
        />

        {/* Moon Icon - visible in light mode (to switch to dark) */}
        <Moon
          className={cn(
            iconSizeClasses[size],
            "transition-all duration-500 ease-in-out",
            "text-slate-600 dark:text-slate-300",
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
          strokeWidth={2}
        />
      </div>

      {/* Subtle glow effect on hover */}
      <div
        className={cn(
          "absolute inset-0 rounded-full transition-all duration-300",
          "opacity-0 group-hover:opacity-100",
          isDark
            ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
            : "bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
        )}
      />
    </button>
  );
}

// Alternative pill-style theme toggle for more premium look
export function ThemeTogglePill({ className }: { className?: string }) {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-8 w-16 rounded-full bg-muted animate-pulse",
          className
        )}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative h-8 w-16 rounded-full p-1 transition-colors duration-300 cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
        isDark ? "bg-slate-700 dark:bg-slate-700" : "bg-slate-200",
        className
      )}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {/* Sliding indicator */}
      <div
        className={cn(
          "absolute top-1 h-6 w-6 rounded-full bg-white shadow-md",
          "flex items-center justify-center",
          "transition-all duration-300 ease-in-out",
          isDark ? "left-9" : "left-1"
        )}
      >
        {isDark ? (
          <Moon className="size-3.5 text-slate-700 dark:text-slate-700" strokeWidth={2.5} />
        ) : (
          <Sun className="size-3.5 text-amber-500" strokeWidth={2.5} />
        )}
      </div>

      {/* Background icons */}
      <div className="flex h-full w-full items-center justify-between px-1.5">
        <Sun
          className={cn(
            "size-3.5 transition-colors duration-300",
            isDark ? "text-slate-500 dark:text-slate-500" : "text-transparent"
          )}
        />
        <Moon
          className={cn(
            "size-3.5 transition-colors duration-300",
            isDark ? "text-transparent" : "text-slate-400"
          )}
        />
      </div>
    </button>
  );
}
