import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderPageHeaderProps {
  badge: {
    icon: LucideIcon;
    label: string;
  };
  title: {
    prefix: string;
    highlight: string;
  };
  subtitle: string;
  variant?: "default" | "success" | "error";
  className?: string;
}

export function OrderPageHeader({
  badge,
  title,
  subtitle,
  variant = "default",
  className,
}: OrderPageHeaderProps) {
  const Icon = badge.icon;

  const variantStyles = {
    default: {
      badge:
        "bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/20",
      highlight: "text-orange-500",
      decorative: "text-orange-300 dark:text-orange-500/50",
      blob1: "bg-orange-100 dark:bg-orange-500/5",
      blob2: "bg-orange-100 dark:bg-orange-500/5",
    },
    success: {
      badge:
        "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20",
      highlight: "text-green-500",
      decorative: "text-green-300 dark:text-green-500/50",
      blob1: "bg-green-100 dark:bg-green-500/5",
      blob2: "bg-green-100 dark:bg-green-500/5",
    },
    error: {
      badge:
        "bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20",
      highlight: "text-red-500",
      decorative: "text-red-300 dark:text-red-500/50",
      blob1: "bg-red-100 dark:bg-red-500/5",
      blob2: "bg-red-100 dark:bg-red-500/5",
    },
  };

  const styles = variantStyles[variant];

  return (
    <section
      className={cn(
        "relative py-4 sm:py-16 lg:py-16 lg:pt-32 pt-20 overflow-hidden",
        className
      )}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient blob */}
        <div
          className={cn(
            "absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-60",
            styles.blob1
          )}
        />
        {/* Bottom right gradient blob */}
        <div
          className={cn(
            "absolute -bottom-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-60",
            styles.blob2
          )}
        />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <div className="text-center">
          {/* Badge */}
          <div className="mb-4">
            <span
              className={cn(
                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase border",
                styles.badge
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {badge.label}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {title.prefix}{" "}
            <span className={cn("relative", styles.highlight)}>
              {title.highlight}
              {/* Decorative underline */}
              <svg
                className={cn(
                  "absolute -bottom-2 left-0 w-full h-3",
                  styles.decorative
                )}
                viewBox="0 0 100 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 8 Q 25 0, 50 8 T 100 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span
              className={cn(
                "w-12 h-0.5 rounded-full",
                variant === "default" &&
                  "bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50",
                variant === "success" &&
                  "bg-gradient-to-r from-transparent to-green-300 dark:to-green-500/50",
                variant === "error" &&
                  "bg-gradient-to-r from-transparent to-red-300 dark:to-red-500/50"
              )}
            />
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                variant === "default" && "bg-orange-400 dark:bg-orange-500",
                variant === "success" && "bg-green-400 dark:bg-green-500",
                variant === "error" && "bg-red-400 dark:bg-red-500"
              )}
            />
            <span
              className={cn(
                "w-12 h-0.5 rounded-full",
                variant === "default" &&
                  "bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50",
                variant === "success" &&
                  "bg-gradient-to-l from-transparent to-green-300 dark:to-green-500/50",
                variant === "error" &&
                  "bg-gradient-to-l from-transparent to-red-300 dark:to-red-500/50"
              )}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
