"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const socialLinks: SocialLink[] = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
];

interface TopInfoBarProps {
  className?: string;
}

export function TopInfoBar({ className }: TopInfoBarProps) {
  return (
    <div
      className={cn(
        "w-full py-2 text-xs sm:text-sm",
        "bg-slate-100 dark:bg-slate-800",
        "text-slate-900 dark:text-slate-100",
        "border-b border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Left Side - Hours and Contact */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Opening Hours */}
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Clock className="size-3.5 text-primary" />
              <span className="hidden sm:inline">Open:</span>
              <span className="font-medium">10:00 - 23:00</span>
            </div>

            {/* Phone - Hidden on extra small screens */}
            <Link
              href="tel:+442012345678"
              className="hidden xs:flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors group"
            >
              <Phone className="size-3.5 text-primary group-hover:animate-pulse" />
              <span className="font-medium">+44 20 1234 5678</span>
            </Link>

            {/* Location - Hidden on mobile */}
            <Link
              href="/stores"
              className="hidden md:flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-primary transition-colors"
            >
              <MapPin className="size-3.5 text-primary" />
              <span>Find a Store</span>
            </Link>
          </div>

          {/* Right Side - Social Links & Promo */}
          <div className="flex items-center gap-4">
            {/* Promo Badge */}
            <div className="hidden lg:flex items-center">
              <span className="bg-primary/20 text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold animate-pulse">
                Free Delivery Over £25
              </span>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-1">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full text-slate-500 dark:text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="size-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
