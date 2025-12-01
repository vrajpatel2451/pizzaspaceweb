"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { useCartCount, useIsCartLoading, useIsCartHydrated } from "@/store/cart-store";

export interface CartBadgeProps {
  className?: string;
  onClick?: () => void;
  asButton?: boolean;
}

export function CartBadge({ className, onClick, asButton = false }: CartBadgeProps) {
  const itemCount = useCartCount();
  const isLoading = useIsCartLoading();
  const isHydrated = useIsCartHydrated();

  // Track previous count for animation direction
  const prevCountRef = React.useRef(itemCount);
  const [animationDirection, setAnimationDirection] = React.useState<"up" | "down">("up");

  React.useEffect(() => {
    if (prevCountRef.current !== itemCount) {
      setAnimationDirection(itemCount > prevCountRef.current ? "up" : "down");
      prevCountRef.current = itemCount;
    }
  }, [itemCount]);

  // Show a subtle loading state during hydration
  const showLoadingPulse = !isHydrated || isLoading;

  const button = (
    <IconButton
      aria-label={`Shopping cart with ${itemCount} items`}
      variant="ghost"
      size="default"
      className={cn(
        "text-foreground/70 hover:text-primary hover:bg-accent relative",
        "transition-all duration-200",
        showLoadingPulse && "animate-pulse",
        className
      )}
      onClick={onClick}
    >
      <ShoppingCart className="size-5" />
      {isHydrated && itemCount > 0 && (
        <AnimatePresence mode="wait">
          <motion.span
            key={itemCount}
            initial={{
              scale: 0.5,
              opacity: 0,
              y: animationDirection === "up" ? 10 : -10,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
            }}
            exit={{
              scale: 0.5,
              opacity: 0,
              y: animationDirection === "up" ? -10 : 10,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className={cn(
              "absolute -top-1 -right-1",
              "flex items-center justify-center",
              "min-w-[18px] h-[18px] px-1",
              "text-[10px] font-bold",
              "text-primary-foreground bg-primary",
              "rounded-full",
              "ring-2 ring-background"
            )}
            aria-live="polite"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </motion.span>
        </AnimatePresence>
      )}
    </IconButton>
  );

  if (asButton) {
    return button;
  }

  return (
    <Link href="/cart" className="relative group">
      {button}
    </Link>
  );
}
