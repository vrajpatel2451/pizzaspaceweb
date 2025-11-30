import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ContactHeroSection } from "@/components/contact/hero-section";
import { ContactSection } from "@/components/contact/contact-section";

// Lazy load map section (below the fold)
const MapSection = dynamic(
  () => import("@/components/contact/map-section").then((mod) => mod.MapSection),
  {
    loading: () => (
      <div className="relative w-full py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="h-[400px] md:h-[500px] animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Contact Us | Pizza Space",
  description: "Get in touch with Pizza Space. Contact us for reservations, feedback, catering inquiries, or general questions. We're here to help!",
  keywords: ["contact", "pizza space contact", "get in touch", "customer service", "reservations"],
  openGraph: {
    title: "Contact Us | Pizza Space",
    description: "Get in touch with Pizza Space. We're here to help with your inquiries.",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section - Compact variant - Above the fold */}
      <ContactHeroSection />

      {/* Contact Section - Two-column layout with info and form - Above/at fold */}
      <ContactSection />

      {/* Map Section - Full-width map with store location - Below the fold, lazy loaded */}
      <MapSection />
    </>
  );
}
