"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Search, User } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { CartBadge } from "./cart-badge";

export function HeaderIcons() {
  const [cartItemCount] = React.useState(3); // TODO: Connect to cart context later

  const handleSearchClick = () => {
    // TODO: Implement search modal
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* Location Pin - Hidden on smallest mobile */}
      <Link href="/stores" className="hidden sm:block">
        <IconButton
          aria-label="Find nearby stores"
          variant="ghost"
          size="default"
          className="text-white hover:text-orange-500 hover:bg-slate-700/50 transition-all"
        >
          <MapPin className="size-5" />
        </IconButton>
      </Link>

      {/* Search */}
      <IconButton
        aria-label="Search menu"
        variant="ghost"
        size="default"
        onClick={handleSearchClick}
        className="text-white hover:text-orange-500 hover:bg-slate-700/50 transition-all"
      >
        <Search className="size-5" />
      </IconButton>

      {/* Cart with Badge */}
      <CartBadge itemCount={cartItemCount} />

      {/* User Icon - Hidden on mobile, shown on desktop */}
      <Link href="/account" className="hidden md:block">
        <IconButton
          aria-label="User account"
          variant="ghost"
          size="default"
          className="text-white hover:text-orange-500 hover:bg-slate-700/50 transition-all"
        >
          <User className="size-5" />
        </IconButton>
      </Link>
    </div>
  );
}
