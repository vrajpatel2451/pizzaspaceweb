"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyCartProps {
  onBrowseMenu: () => void;
  className?: string;
}

export function EmptyCart({ onBrowseMenu, className }: EmptyCartProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {/* Pizza-themed empty cart illustration */}
      <div className="relative mb-6">
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 flex items-center justify-center">
          <ShoppingCart className="h-16 w-16 text-orange-300 dark:text-orange-700" />

          {/* Animated pizza slice */}
          <svg
            viewBox="0 0 100 100"
            className="absolute -top-2 -right-2 w-16 h-16 text-orange-400 dark:text-orange-600 animate-bounce"
            style={{ animationDuration: "2s" }}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M50 10 L85 80 Q50 95 15 80 Z"
              fill="currentColor"
              opacity="0.3"
            />
            <path
              d="M15 80 Q50 95 85 80"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
              opacity="0.5"
            />
            <circle cx="40" cy="50" r="6" fill="currentColor" opacity="0.6" />
            <circle cx="58" cy="45" r="5" fill="currentColor" opacity="0.6" />
            <circle cx="50" cy="65" r="5" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Looks like you haven&apos;t added any delicious items to your cart yet.
        Explore our menu and discover amazing pizzas, sides, and more!
      </p>

      {/* CTA Button */}
      <Button onClick={onBrowseMenu} size="lg" className="min-w-[200px]">
        Browse Menu
      </Button>

      {/* Additional helpful text */}
      <p className="text-xs text-muted-foreground mt-6">
        Need help? Contact us or view our popular items
      </p>
    </div>
  );
}
