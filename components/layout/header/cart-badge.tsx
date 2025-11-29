"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";

export interface CartBadgeProps {
  itemCount?: number;
  className?: string;
}

export function CartBadge({ itemCount = 0, className }: CartBadgeProps) {
  return (
    <Link href="/cart" className="relative group">
      <IconButton
        aria-label={`Shopping cart with ${itemCount} items`}
        variant="ghost"
        size="default"
        className={cn(
          "text-foreground/70 hover:text-primary hover:bg-accent",
          "transition-all duration-200",
          className
        )}
      >
        <ShoppingCart className="size-5" />
        {itemCount > 0 && (
          <span
            className={cn(
              "absolute -top-1 -right-1",
              "flex items-center justify-center",
              "min-w-[18px] h-[18px] px-1",
              "text-[10px] font-bold",
              "text-primary-foreground bg-primary",
              "rounded-full",
              "ring-2 ring-background",
              "transform transition-transform duration-200",
              "group-hover:scale-110"
            )}
            aria-live="polite"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </IconButton>
    </Link>
  );
}
