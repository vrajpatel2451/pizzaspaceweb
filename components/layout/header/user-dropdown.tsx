"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CustomImage } from "@/components/ui/custom-image";
import { useAuthStore } from "@/store/auth-store";
import { clearAuthCookie } from "@/lib/actions/auth";
import {
  User,
  ShoppingBag,
  MapPin,
  Gift,
  Heart,
  LogOut,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconButton } from "@/components/ui/icon-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  className?: string;
  isLoggedIn?: boolean;
  user?: {
    name: string;
    email: string;
    avatar?: string;
    loyaltyPoints?: number;
  };
}

interface MenuLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const accountLinks: MenuLink[] = [
  { label: "My Orders", href: "/order", icon: ShoppingBag },
  { label: "Saved Addresses", href: "/addresses", icon: MapPin },
  { label: "Profile", href: "/profile", icon: User },
];

export function UserDropdown({
  className,
  isLoggedIn = false,
  user,
}: UserDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Clear server-side cookie
      await clearAuthCookie();
      // Clear client-side store
      logout();
      // Close dropdown
      setOpen(false);
      // Navigate to home
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Guest state - show login/signup
  if (!isLoggedIn) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <IconButton
            aria-label="User account"
            variant="ghost"
            size="default"
            className={cn(
              "text-foreground/70 hover:text-primary hover:bg-accent",
              "transition-all duration-200",
              className
            )}
          >
            <User className="size-5" />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end" sideOffset={12}>
          {/* Header */}
          <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserCircle className="size-6" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Welcome!</h3>
                <p className="text-sm text-muted-foreground">
                  Sign in for the best experience
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/login" onClick={() => setOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full" size="lg">
              <Link href="/register" onClick={() => setOpen(false)}>
                Create Account
              </Link>
            </Button>
          </div>

          <Separator />

          {/* Benefits */}
          <div className="p-4">
            <p className="text-xs font-medium text-muted-foreground mb-3">
              MEMBER BENEFITS
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-foreground/80">
                <Gift className="size-4 text-primary" />
                <span>Exclusive offers & discounts</span>
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <Heart className="size-4 text-primary" />
                <span>Save your favorite orders</span>
              </li>
              <li className="flex items-center gap-2 text-foreground/80">
                <ShoppingBag className="size-4 text-primary" />
                <span>Track orders in real-time</span>
              </li>
            </ul>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  // Logged in state
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-full",
            "hover:bg-accent transition-all duration-200",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 outline-none",
            "cursor-pointer",
            className
          )}
          aria-label="User menu"
        >
          {user?.avatar ? (
            <CustomImage
              src={user.avatar}
              alt={user.name}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover ring-2 ring-primary/20"
            />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              {user?.name?.charAt(0) || "U"}
            </div>
          )}
          <span className="hidden lg:inline text-sm font-medium max-w-[100px] truncate">
            {user?.name?.split(" ")[0] || "User"}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end" sideOffset={12}>
        {/* User Info Header */}
        <div className="p-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <CustomImage
                src={user.avatar}
                alt={user.name || "User"}
                width={48}
                height={48}
                className="size-12 rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {user?.name || "User"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Loyalty Points */}
          {user?.loyaltyPoints !== undefined && (
            <div className="mt-3 flex items-center justify-between px-3 py-2 bg-primary/10 rounded-lg">
              <div className="flex items-center gap-2">
                <Gift className="size-4 text-primary" />
                <span className="text-sm font-medium">Loyalty Points</span>
              </div>
              <span className="text-sm font-bold text-primary">
                {user.loyaltyPoints.toLocaleString()} pts
              </span>
            </div>
          )}
        </div>

        {/* Account Links */}
        <div className="p-2">
          {accountLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg",
                "text-sm text-foreground/80 hover:text-foreground",
                "hover:bg-accent transition-colors",
                "group"
              )}
            >
              <link.icon className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="flex-1">{link.label}</span>
              <ChevronRight className="size-4 text-muted-foreground/50 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </div>

        <Separator className="mx-4" />

        {/* Sign Out */}
        <div className="p-2">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2.5 rounded-lg",
              "text-sm text-destructive/80 hover:text-destructive",
              "hover:bg-destructive/10 transition-colors",
              "cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <LogOut className={cn("size-4", isLoggingOut && "animate-spin")} />
            <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
