// Example: How to integrate the Header in your Next.js app

// ============================================
// Option 1: Add to Root Layout (Recommended)
// ============================================
// File: app/layout.tsx

import { Header } from "@/components/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pizza Space - Fresh Pizza Delivered",
  description: "Order delicious pizzas online from Pizza Space",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header appears on all pages */}
        <Header />

        {/* Main content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer can go here later */}
      </body>
    </html>
  );
}

// ============================================
// Option 2: Conditional Header (Advanced)
// ============================================
// If you need different headers for different sections

import { Header } from "@/components/layout";
import { usePathname } from "next/navigation";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <html lang="en">
      <body>
        {/* Show header only for non-admin routes */}
        {!isAdminRoute && <Header />}

        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

// ============================================
// Testing Individual Components
// ============================================

// Test Logo
import { Logo } from "@/components/layout/header/logo";

export function TestLogo() {
  return (
    <div className="p-8 bg-slate-800">
      <Logo />
    </div>
  );
}

// Test Navigation
import { HeaderNav } from "@/components/layout/header/header-nav";

export function TestNav() {
  return (
    <div className="p-8 bg-slate-800">
      <HeaderNav />
    </div>
  );
}

// Test Icons
import { HeaderIcons } from "@/components/layout/header/header-icons";

export function TestIcons() {
  return (
    <div className="p-8 bg-slate-800">
      <HeaderIcons />
    </div>
  );
}

// Test Mobile Menu
import { MobileMenu } from "@/components/layout/header/mobile-menu";

export function TestMobileMenu() {
  return (
    <div className="p-8 bg-slate-800">
      <MobileMenu />
    </div>
  );
}

// Test Cart Badge with different counts
import { CartBadge } from "@/components/layout/header/cart-badge";

export function TestCartBadge() {
  return (
    <div className="p-8 bg-slate-800 flex gap-4">
      <CartBadge itemCount={0} />
      <CartBadge itemCount={3} />
      <CartBadge itemCount={99} />
      <CartBadge itemCount={150} />
    </div>
  );
}

// ============================================
// Full Page Example with Header
// ============================================

import { Header } from "@/components/layout";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Pizza Space
        </h1>
        <p className="text-lg text-muted-foreground">
          Order your favorite pizzas online for delivery or pickup.
        </p>
      </main>
    </>
  );
}

// ============================================
// Connecting to Cart Context (Future)
// ============================================

// Step 1: Create cart context
// File: contexts/CartContext.tsx

import React, { createContext, useContext, useState } from "react";

interface CartContextType {
  itemCount: number;
  addItem: () => void;
  removeItem: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [itemCount, setItemCount] = useState(0);

  const addItem = () => setItemCount((prev) => prev + 1);
  const removeItem = () => setItemCount((prev) => Math.max(0, prev - 1));

  return (
    <CartContext.Provider value={{ itemCount, addItem, removeItem }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}

// Step 2: Update header-icons.tsx to use cart context
// Replace the useState line with:
// const { itemCount } = useCart();

// Step 3: Wrap your app with CartProvider in layout.tsx
// <CartProvider>
//   <Header />
//   {children}
// </CartProvider>
