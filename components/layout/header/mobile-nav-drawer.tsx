"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  Home,
  Pizza,
  Store,
  Info,
  Phone,
  User,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Clock,
  Flame,
  Salad,
  Coffee,
  IceCream,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeTogglePill } from "./theme-toggle";
import { useAuthStore } from "@/store/auth-store";
import { clearAuthCookie } from "@/lib/actions/auth";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface MenuCategory {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const mainNavLinks: NavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Menu", href: "/menu", icon: Pizza },
  { label: "Stores", href: "/stores", icon: Store },
  { label: "About", href: "/about", icon: Info },
  { label: "Contact", href: "/contact", icon: Phone },
];

const menuCategories: MenuCategory[] = [
  { label: "Pizza", href: "/menu?category=pizza", icon: Pizza, description: "Classic & specialty" },
  { label: "Sides", href: "/menu?category=sides", icon: Salad, description: "Salads, garlic bread" },
  { label: "Drinks", href: "/menu?category=drinks", icon: Coffee, description: "Soft drinks, juices" },
  { label: "Desserts", href: "/menu?category=desserts", icon: IceCream, description: "Sweet treats" },
];

const accountLinks: NavLink[] = [
  { label: "My Orders", href: "/order", icon: ShoppingBag },
  { label: "Saved Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Profile", href: "/profile", icon: User },
];

interface MobileNavDrawerProps {
  className?: string;
}

export function MobileNavDrawer({ className }: MobileNavDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [expandedSection, setExpandedSection] = React.useState<string | null>(null);
  const [isMounted, setIsMounted] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear server-side cookie
      await clearAuthCookie();
      // Clear client-side store
      logout();
      // Close drawer
      setIsOpen(false);
      // Navigate to home
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close drawer on route change
  React.useEffect(() => {
    setIsOpen(false);
    setExpandedSection(null);
  }, [pathname]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Focus trap - keep focus within drawer when open
  React.useEffect(() => {
    if (!isOpen) return;

    const drawer = document.querySelector('[role="dialog"]');
    if (!drawer) return;

    const focusableElements = drawer.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: Event) => {
      if (!(e instanceof KeyboardEvent) || e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    drawer.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      drawer.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const drawerContent = (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
        aria-label="Close navigation menu"
      />

      {/* Drawer Panel */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-full max-w-sm",
          "bg-background shadow-2xl",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Pizza className="size-5" />
            </div>
            <span className="text-lg font-bold text-primary">Pizza Space</span>
          </div>
          <IconButton
            aria-label="Close menu"
            variant="ghost"
            size="default"
            onClick={() => setIsOpen(false)}
            className="hover:bg-accent min-w-[44px] min-h-[44px] touch-manipulation"
          >
            <X className="size-5" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto">
          {/* Main Navigation */}
          <nav className="p-4" aria-label="Main navigation">
            <ul className="space-y-1">
              {mainNavLinks.map((link) => {
                const isActive = pathname === link.href;
                const isMenuLink = link.href === "/menu";

                return (
                  <li key={link.href}>
                    {isMenuLink ? (
                      // Menu link with expandable categories
                      <div>
                        <button
                          onClick={() => toggleSection("menu")}
                          aria-expanded={expandedSection === "menu"}
                          aria-controls="menu-categories"
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-3 rounded-xl",
                            "text-base font-medium transition-all duration-200",
                            "hover:bg-accent group cursor-pointer touch-manipulation",
                            "min-h-[48px]",
                            isActive && "bg-primary/10 text-primary"
                          )}
                        >
                          <link.icon
                            className={cn(
                              "size-5 transition-colors",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-primary"
                            )}
                            aria-hidden="true"
                          />
                          <span className="flex-1 text-left">{link.label}</span>
                          <ChevronDown
                            className={cn(
                              "size-4 text-muted-foreground transition-transform duration-200",
                              expandedSection === "menu" && "rotate-180"
                            )}
                            aria-hidden="true"
                          />
                        </button>

                        {/* Expanded Menu Categories */}
                        <div
                          id="menu-categories"
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-in-out",
                            expandedSection === "menu"
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="pl-4 py-2 space-y-1">
                            <Link
                              href="/menu"
                              className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-accent group touch-manipulation min-h-[44px]"
                            >
                              <Flame className="size-4 text-primary" />
                              <div>
                                <span className="text-sm font-medium">Full Menu</span>
                                <p className="text-xs text-muted-foreground">
                                  Browse all items
                                </p>
                              </div>
                            </Link>
                            {menuCategories.map((category) => (
                              <Link
                                key={category.href}
                                href={category.href}
                                className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-accent group touch-manipulation min-h-[44px]"
                              >
                                <category.icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                <div>
                                  <span className="text-sm font-medium">
                                    {category.label}
                                  </span>
                                  {category.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular nav link
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl",
                          "text-base font-medium transition-all duration-200",
                          "hover:bg-accent group touch-manipulation",
                          "min-h-[48px]",
                          isActive && "bg-primary/10 text-primary"
                        )}
                      >
                        <link.icon
                          className={cn(
                            "size-5 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-primary"
                          )}
                        />
                        <span>{link.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* Orders Link - Only for authenticated users */}
            {isAuthenticated && (
              <div className="mt-2">
                <Link
                  href="/order"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl",
                    "text-base font-medium transition-all duration-200",
                    "hover:bg-accent group touch-manipulation",
                    "min-h-[48px]",
                    pathname.startsWith("/order") && "bg-primary/10 text-primary"
                  )}
                >
                  <ShoppingBag
                    className={cn(
                      "size-5 transition-colors",
                      pathname.startsWith("/order")
                        ? "text-primary"
                        : "text-muted-foreground group-hover:text-primary"
                    )}
                  />
                  <span>Orders</span>
                  {pathname.startsWith("/order") && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              </div>
            )}
          </nav>

          <Separator className="mx-4" />

          {/* Account Section */}
          <div className="p-4">
            <button
              onClick={() => toggleSection("account")}
              aria-expanded={expandedSection === "account"}
              aria-controls="account-links"
              className="flex w-full items-center gap-2 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors cursor-pointer touch-manipulation min-h-[44px]"
            >
              <User className="size-4" aria-hidden="true" />
              <span className="flex-1 text-left">Account</span>
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  expandedSection === "account" && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>

            <div
              id="account-links"
              className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                expandedSection === "account"
                  ? "max-h-96 opacity-100"
                  : "max-h-0 opacity-0"
              )}
            >
              <ul className="mt-2 space-y-1">
                {accountLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                          "text-sm transition-colors",
                          "hover:bg-accent group touch-manipulation",
                          "min-h-[44px]",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/80"
                        )}
                      >
                        <link.icon
                          className={cn(
                            "size-4 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-primary"
                          )}
                        />
                        <span className="flex-1">{link.label}</span>
                        <ChevronRight className="size-4 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <Separator className="mx-4" />

          {/* Theme Toggle & Info */}
          <div className="p-4 space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 rounded-xl">
              <span className="text-sm font-medium">Dark Mode</span>
              <ThemeTogglePill />
            </div>

            {/* Store Hours */}
            <div className="px-4 py-3 bg-primary/5 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-primary" />
                <span className="text-sm font-semibold">Opening Hours</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Monday - Sunday: 10:00 AM - 11:00 PM
              </p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t mt-auto">
            {isAuthenticated ? (
              // Logged in user - show user info and sign out
              <div className="space-y-4">
                {user && (
                  <div className="flex items-center gap-3 px-3 py-2 bg-muted/50 rounded-lg">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {user.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  variant="destructive"
                  className="w-full"
                  size="lg"
                >
                  <LogOut className={cn("size-4 mr-2", isLoggingOut && "animate-spin")} />
                  {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                </Button>
              </div>
            ) : (
              // Guest - show sign in and create account
              <div className="space-y-2">
                <Button asChild className="w-full" size="lg">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link href="/register">Create Account</Link>
                </Button>
              </div>
            )}

            <p className="mt-4 text-center text-xs text-muted-foreground">
              Need help?{" "}
              <Link href="/contact" className="text-primary hover:underline">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <div className={cn("md:hidden", className)}>
        <IconButton
          aria-label="Open navigation menu"
          variant="ghost"
          size="default"
          onClick={() => setIsOpen(true)}
          className="text-foreground/70 hover:text-primary hover:bg-accent/50 transition-all min-w-[44px] min-h-[44px] touch-manipulation"
        >
          <Menu className="size-6" />
        </IconButton>
      </div>

      {/* Portal for drawer */}
      {isMounted && createPortal(drawerContent, document.body)}
    </>
  );
}
