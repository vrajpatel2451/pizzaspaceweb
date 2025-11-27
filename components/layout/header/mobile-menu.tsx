"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Drawer } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface NavLink {
  label: string;
  href: string;
}

const mainNavLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Stores", href: "/stores" },
  { label: "Menu", href: "/menu" },
  { label: "Contact Us", href: "/contact" },
];

const accountLinks: NavLink[] = [
  { label: "Order History", href: "/account/orders" },
  { label: "Address Management", href: "/account/addresses" },
  { label: "Profile", href: "/account/profile" },
  { label: "Coupons", href: "/account/coupons" },
  { label: "Sign Out", href: "/auth/signout" },
];

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const pathname = usePathname();

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <div className="md:hidden">
        <IconButton
          aria-label="Open navigation menu"
          variant="ghost"
          size="default"
          onClick={() => setIsOpen(true)}
          className="text-white hover:text-orange-500 hover:bg-slate-700/50 transition-all"
        >
          <Menu className="size-6" />
        </IconButton>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Menu"
        side="right"
        size="sm"
      >
        <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
          {/* Main Navigation Links */}
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-foreground hover:bg-accent hover:text-orange-500"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Separator */}
          <div className="my-4 border-t border-border" />

          {/* Account Section */}
          <div className="mb-2">
            <h3 className="px-4 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Account
            </h3>
          </div>
          {accountLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className={cn(
                  "px-4 py-3 text-base font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-orange-500/10 text-orange-500"
                    : "text-foreground hover:bg-accent hover:text-orange-500"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </Drawer>
    </>
  );
}
