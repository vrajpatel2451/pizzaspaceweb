"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { CustomImage } from "@/components/ui/custom-image";

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
          "relative flex items-center justify-center size-10 rounded-full overflow-hidden",
          "transition-all duration-300",
          "shadow-md group-hover:shadow-lg",
          "active:scale-95"
        )}
      >
        <CustomImage
          src="/logo.png"
          alt="Pizza Space Logo"
          width={40}
          height={40}
          className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
          fetchPriority="high"
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
