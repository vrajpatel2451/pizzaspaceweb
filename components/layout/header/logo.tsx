"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "default" | "light";
  className?: string;
  showText?: boolean;
}

// Logo icon rotation on hover
const iconVariants: Variants = {
  rest: { rotate: 0 },
  hover: {
    rotate: 12,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Shine effect animation
const shineVariants: Variants = {
  rest: { opacity: 0, scale: 0.8 },
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

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
      <motion.div
        initial="rest"
        whileHover="hover"
        animate="rest"
        whileTap={{ scale: 0.95 }}
        className={cn(
          "relative flex items-center justify-center size-10 rounded-full",
          "transition-all duration-300",
          "shadow-md group-hover:shadow-lg",
          isLight
            ? "bg-white/20 backdrop-blur-sm group-hover:bg-white/30 dark:bg-white/20 dark:group-hover:bg-white/30"
            : "bg-primary group-hover:bg-primary/90"
        )}
      >
        <motion.div variants={iconVariants}>
          <Pizza
            className={cn(
              "size-5",
              isLight ? "text-white dark:text-white" : "text-primary-foreground"
            )}
          />
        </motion.div>

        {/* Enhanced shine effect */}
        <motion.div
          variants={shineVariants}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/40 via-white/20 to-transparent"
        />
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 1 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <span
            className={cn(
              "text-lg sm:text-xl font-bold leading-tight transition-colors duration-300",
              isLight
                ? "text-white group-hover:text-white/90 dark:text-white dark:group-hover:text-white/90"
                : "text-primary group-hover:text-primary/90"
            )}
          >
            Pizza Space
          </span>
          <span
            className={cn(
              "hidden sm:block text-[10px] font-medium tracking-wider uppercase",
              isLight ? "text-white/60 dark:text-white/60" : "text-muted-foreground"
            )}
          >
            Authentic Italian
          </span>
        </motion.div>
      )}
    </Link>
  );
}
