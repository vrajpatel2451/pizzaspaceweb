"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/use-scroll";
import { useAuthStore } from "@/store/auth-store";
import { useDeviceId, useIsDeviceHydrated } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";
import { useCart } from "@/lib/hooks/use-cart";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { SearchCommand } from "./search-command";
import { ThemeToggle } from "./theme-toggle";
import { UserDropdown } from "./user-dropdown";
import { CartBadge } from "./cart-badge";
import { MobileNavDrawer } from "./mobile-nav-drawer";
import { StoreLocator } from "./store-locator";

interface NavLink {
  label: string;
  href: string;
}

const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Stores", href: "/stores" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

interface HeaderClientProps {
  className?: string;
}

export function HeaderClient({ className }: HeaderClientProps) {
  const pathname = usePathname();
  const scrolled = useScroll(50);
  const { isAuthenticated, user } = useAuthStore();
  const { selectedStore } = useStore();
  const deviceId = useDeviceId();
  const isDeviceHydrated = useIsDeviceHydrated();

  // Fetch cart on mount and when store/auth changes
  const { refetch: refetchCart } = useCart(
    deviceId || "",
    selectedStore?._id || "",
    false // Don't auto-fetch, we'll control it manually
  );

  // Track previous values to detect changes
  const prevStoreId = React.useRef<string | null>(null);
  const prevIsAuthenticated = React.useRef<boolean>(false);

  // Fetch cart when component mounts and dependencies are ready
  React.useEffect(() => {
    if (isDeviceHydrated && deviceId && selectedStore?._id) {
      refetchCart();
    }
  }, [isDeviceHydrated, deviceId, selectedStore?._id, refetchCart]);

  // Refetch cart when store changes
  React.useEffect(() => {
    const currentStoreId = selectedStore?._id;
    if (
      isDeviceHydrated &&
      deviceId &&
      currentStoreId &&
      prevStoreId.current &&
      prevStoreId.current !== currentStoreId
    ) {
      refetchCart();
    }
    prevStoreId.current = currentStoreId || null;
  }, [selectedStore?._id, isDeviceHydrated, deviceId, refetchCart]);

  // Refetch cart when auth state changes (login/logout)
  React.useEffect(() => {
    if (
      isDeviceHydrated &&
      deviceId &&
      selectedStore?._id &&
      prevIsAuthenticated.current !== isAuthenticated
    ) {
      refetchCart();
    }
    prevIsAuthenticated.current = isAuthenticated;
  }, [
    isAuthenticated,
    isDeviceHydrated,
    deviceId,
    selectedStore?._id,
    refetchCart,
  ]);

  // Determine if we're on the homepage for transparent header behavior
  const isHomePage = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ease-in-out",
        // Base styles
        "border-b",
        // Scrolled state or non-homepage: solid background
        scrolled || !isHomePage
          ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-slate-200 dark:border-slate-800 shadow-sm"
          : "bg-white/20 dark:bg-transparent border-slate-200/50 dark:border-transparent backdrop-blur-sm",
        // Entry animation
        "animate-slide-in-top",
        className
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-18 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo variant={scrolled || !isHomePage ? "default" : "light"} />
          </div>

          {/* Desktop Navigation - Centered */}
          <nav
            className="hidden md:flex flex-1 items-center justify-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.href} className="relative group">
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-sm font-medium rounded-full block",
                      "transition-all duration-200",
                      "hover:bg-slate-100 dark:hover:bg-slate-800/50",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
                      // Active state
                      isActive && "text-primary",
                      // Non-scrolled on homepage: adapt text for both modes
                      !scrolled && isHomePage
                        ? isActive
                          ? "text-primary"
                          : "text-slate-700 dark:text-white/90 hover:text-slate-900 dark:hover:text-white"
                        : isActive
                        ? "text-primary"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {link.label}

                    {/* Animated underline for non-active links on hover */}
                    {!isActive && (
                      <span
                        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 rounded-full bg-current origin-center scale-x-0 opacity-0 transition-all duration-300 group-hover:scale-x-100 group-hover:opacity-100"
                      />
                    )}
                  </Link>

                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pop-in"
                    />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div
            className="flex items-center gap-1 sm:gap-2 animate-fade-in-right animation-delay-200"
          >
            {/* Search */}
            <SearchCommand
              className={cn(
                !scrolled && isHomePage
                  ? "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                  : ""
              )}
            />

            {/* Theme Toggle - Hidden on very small screens */}
            <div className="hidden sm:block">
              <ThemeToggle
                size="sm"
                className={cn(
                  !scrolled && isHomePage
                    ? "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    : ""
                )}
              />
            </div>

            {/* Store Locator */}
            <StoreLocator
              className={cn(
                !scrolled && isHomePage
                  ? "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                  : ""
              )}
            />

            {/* Cart - direct link to cart page */}
            <CartBadge
              className={cn(
                !scrolled && isHomePage
                  ? "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                  : ""
              )}
            />

            {/* User Dropdown - Desktop only */}
            <div className="hidden md:block">
              <UserDropdown
                isLoggedIn={isAuthenticated}
                user={
                  user
                    ? {
                        name: user.name,
                        email: user.email,
                      }
                    : undefined
                }
                className={cn(
                  !scrolled && isHomePage
                    ? "text-slate-700 dark:text-white/80 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
                    : ""
                )}
              />
            </div>

            {/* Mobile Menu Toggle */}
            <MobileNavDrawer
              className={cn(
                !scrolled && isHomePage
                  ? "[&_button]:text-slate-700 [&_button]:dark:text-white/80 [&_button]:hover:text-slate-900 [&_button]:dark:hover:text-white [&_button]:hover:bg-slate-100 [&_button]:dark:hover:bg-white/10"
                  : ""
              )}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
