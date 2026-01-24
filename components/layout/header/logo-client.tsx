"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { CustomImage } from "@/components/ui/custom-image";

interface LogoClientProps {
  lightLogoUrl: string;
  darkLogoUrl: string;
  variant?: "default" | "light";
  className?: string;
  showText?: boolean;
}

/**
 * Client-side Logo component with theme-aware logo switching
 * Renders the appropriate logo based on the current theme
 */
export function LogoClient({
  lightLogoUrl,
  darkLogoUrl,
  variant = "default",
  className,
  showText = true,
}: LogoClientProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to show based on theme
  const logoUrl = mounted && resolvedTheme === "dark" ? darkLogoUrl : lightLogoUrl;

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
        {/* Show loading state during hydration */}
        {!mounted ? (
          <div className="size-10 rounded-full bg-muted animate-pulse" />
        ) : (
          <CustomImage
            src={logoUrl}
            alt="Pizza Space Logo"
            width={40}
            height={40}
            className="object-contain transition-transform duration-300 ease-out group-hover:scale-110"
            fetchPriority="high"
          />
        )}
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
