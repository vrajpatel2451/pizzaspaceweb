"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";

interface CartBadgeProps {
  itemCount?: number;
}

export function CartBadge({ itemCount = 0 }: CartBadgeProps) {
  return (
    <Link href="/cart" className="relative">
      <IconButton
        aria-label={`Shopping cart with ${itemCount} items`}
        variant="ghost"
        size="default"
        className="text-white hover:text-orange-500 hover:bg-slate-700/50 transition-all"
      >
        <ShoppingCart className="size-5" />
        {itemCount > 0 && (
          <span
            className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-orange-500 rounded-full"
            aria-live="polite"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </IconButton>
    </Link>
  );
}
