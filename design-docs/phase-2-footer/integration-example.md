/**
 * Integration Example: Adding Footer to Your Layout
 *
 * This file shows how to integrate the Footer component into your Next.js application.
 * Copy the relevant code snippets into your actual layout file.
 */

// ==============================================================================
// EXAMPLE 1: Basic Layout Integration
// ==============================================================================

// File: app/layout.tsx
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}

// ==============================================================================
// EXAMPLE 2: Layout with Header and Footer
// ==============================================================================

// File: app/layout.tsx
import { Header } from "@/components/layout/header"; // Your header component
import { Footer } from "@/components/layout/footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

// ==============================================================================
// EXAMPLE 3: Custom Wrapper Component
// ==============================================================================

// File: components/layout/page-layout.tsx
import { ReactNode } from "react";
import { Footer } from "@/components/layout/footer";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}

// Then use in your pages:
// File: app/page.tsx
import { PageLayout } from "@/components/layout/page-layout";

export default function Home() {
  return (
    <PageLayout>
      <h1>Welcome to Pizza Space</h1>
    </PageLayout>
  );
}

// ==============================================================================
// EXAMPLE 4: Conditional Footer (e.g., hide on certain pages)
// ==============================================================================

// File: app/layout.tsx
import { Footer } from "@/components/layout/footer";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Note: This requires "use client" directive for usePathname
  // For server components, pass pathname as prop instead

  return (
    <html lang="en">
      <body>
        {children}
        <FooterWrapper />
      </body>
    </html>
  );
}

function FooterWrapper() {
  "use client"; // This makes it a client component
  const pathname = usePathname();
  const hideFooter = pathname === "/checkout" || pathname === "/admin";

  if (hideFooter) return null;

  return <Footer />;
}

// ==============================================================================
// EXAMPLE 5: Testing the Footer Component
// ==============================================================================

// File: app/test-footer/page.tsx
import { Footer } from "@/components/layout/footer";

export default function TestFooterPage() {
  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold mb-4">Footer Test Page</h1>
        <p className="mb-4">Scroll down to see the footer component below.</p>
        <div className="h-96 bg-white rounded p-4">
          <p>Page content goes here...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

// ==============================================================================
// EXAMPLE 6: Using Individual Footer Components
// ==============================================================================

// If you need to customize the footer layout, you can use sub-components:
import { FooterLinks } from "@/components/layout/footer/footer-links";
import { FooterSocial } from "@/components/layout/footer/footer-social";
import { FooterCopyright } from "@/components/layout/footer/footer-copyright";

const customLinks = [
  { label: "Custom Page", href: "/custom" },
  { label: "Another Page", href: "/another" },
];

export function CustomFooter() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Custom layout with 3 columns instead of 4 */}
          <FooterLinks title="Navigation" links={customLinks} />
          <FooterLinks title="Support" links={customLinks} />
          <FooterSocial />
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
}

// ==============================================================================
// EXAMPLE 7: Adding Footer to Specific Pages Only
// ==============================================================================

// File: app/(marketing)/layout.tsx
// Use route groups to apply footer only to marketing pages
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}

// ==============================================================================
// QUICK START CHECKLIST
// ==============================================================================

/*
 * To add the footer to your app:
 *
 * 1. Import the Footer component:
 *    import { Footer } from "@/components/layout/footer";
 *
 * 2. Add it to your layout file (typically app/layout.tsx):
 *    <Footer />
 *
 * 3. Place it after your main content, before closing </body>:
 *    <body>
 *      {children}
 *      <Footer />
 *    </body>
 *
 * 4. Start your dev server:
 *    npm run dev
 *
 * 5. Visit http://localhost:3000 to see the footer
 *
 * 6. Customize:
 *    - Update contact info in components/layout/footer/index.tsx
 *    - Update social URLs in components/layout/footer/footer-social.tsx
 *    - Create legal pages (/privacy, /terms, etc.)
 */

// ==============================================================================
// CUSTOMIZATION EXAMPLES
// ==============================================================================

// Example: Custom contact information
const contactInfo = {
  address: {
    street: "123 Pizza Street",
    city: "Food City",
    zip: "FC 12345",
  },
  phone: "+1 234 567 8900",
  email: "info@pizzaspace.com",
};

// Example: Custom quick links
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Store Locations", href: "/stores" },
  { label: "Full Menu", href: "/menu" },
  { label: "Get in Touch", href: "/contact" },
  { label: "Careers", href: "/careers" }, // Add new link
];

// Example: Custom social media links
const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/pizzaspace", icon: "Facebook" },
  { name: "Instagram", href: "https://instagram.com/pizzaspace", icon: "Instagram" },
  { name: "Twitter", href: "https://twitter.com/pizzaspace", icon: "Twitter" },
  { name: "TikTok", href: "https://tiktok.com/@pizzaspace", icon: "Music" }, // Add TikTok
];

export {};
