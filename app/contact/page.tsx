import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ContactHeroSection } from "@/components/contact/hero-section";
import { ContactSection } from "@/components/contact/contact-section";
import { ContactPageJsonLd } from "@/components/seo/json-ld";
import { Mail } from "lucide-react";
import { fetchContactInfo, fetchOpeningHours } from "@/lib/api/server-fetchers";

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
  description:
    "Get in touch with Pizza Space. Contact us for reservations, feedback, catering inquiries, or general questions. We're here to help!",
  keywords: [
    "contact pizza space",
    "pizza space phone number",
    "pizza space email",
    "customer service",
    "reservations",
    "catering inquiries",
    "pizza delivery contact",
  ],
  alternates: {
    canonical: "https://pizzaspace.co.uk/contact",
  },
  openGraph: {
    title: "Contact Us | Pizza Space",
    description:
      "Get in touch with Pizza Space. We're here to help with your inquiries.",
    url: "https://pizzaspace.co.uk/contact",
    siteName: "Pizza Space",
    images: [
      {
        url: "https://pizzaspace.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Pizza Space",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Pizza Space",
    description:
      "Get in touch with Pizza Space. We're here to help with your inquiries.",
    images: ["https://pizzaspace.co.uk/og-image.jpg"],
    creator: "@pizzaspace",
    site: "@pizzaspace",
  },
};

export default async function ContactPage() {
  // Fetch contact info and opening hours server-side
  const [contactInfo, openingHours] = await Promise.all([
    fetchContactInfo(),
    fetchOpeningHours(),
  ]);

  return (
    <>
      {/* Page-specific JSON-LD structured data */}
      <ContactPageJsonLd />

      {/* Server-rendered hero section with SEO-optimized H1 */}
      <section
        className="relative w-full overflow-hidden pt-24 pb-10 sm:pt-28 sm:pb-12 md:pt-32 md:pb-16 lg:pt-36 lg:pb-20"
        aria-label="Contact hero section"
      >
        {/* Client-side decorative background and animations */}
        <ContactHeroSection />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl text-center">
          <div>
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                <Mail className="w-3.5 h-3.5" />
                We&apos;re Here to Help
              </span>
            </div>

            {/* SEO-optimized H1 - Server rendered for crawler visibility */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 px-4 sm:px-0">
              Get In{" "}
              <span className="text-orange-500 relative">
                Touch
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8 Q 25 0, 50 8 T 100 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
              <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
              <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Contact Section - Two-column layout with info and form - Above/at fold */}
      <ContactSection contactInfo={contactInfo} openingHours={openingHours} />

      {/* Map Section - Full-width map with store location - Below the fold, lazy loaded */}
      <MapSection />
    </>
  );
}
