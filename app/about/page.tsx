import { Metadata } from "next";
import dynamic from "next/dynamic";
import { AboutHeroSection } from "@/components/about/hero-section";
import { StorySection } from "@/components/about/story-section";
import { AboutHours } from "@/components/about/about-hours";
import { AboutContact } from "@/components/about/about-contact";
import { AboutTestimonials } from "@/components/about/about-testimonials";
import { AboutPageJsonLd } from "@/components/seo/json-ld";
import { getStores } from "@/lib/api/stores";
import { StoreResponse, APIResponse, PaginatedResponse, OpeningHours, ContactInfo } from "@/types";
import { BookOpen } from "lucide-react";
import {
  fetchOpeningHours,
  fetchContactInfo,
  fetchTestimonials,
  type TestimonialsResult,
} from "@/lib/api/server-fetchers";

// Lazy load below-the-fold sections with loading skeletons
const AboutMissionVisionSection = dynamic(
  () => import("@/components/about/mission-vision-section").then((mod) => mod.AboutMissionVisionSection),
  {
    loading: () => (
      <div className="relative bg-slate-50 dark:bg-navy-950 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse bg-slate-200 dark:bg-navy-800 rounded-3xl" />
        </div>
      </div>
    ),
    ssr: true,
  }
);

const TeamSection = dynamic(
  () => import("@/components/about/team-section").then((mod) => mod.TeamSection),
  {
    loading: () => (
      <div className="relative bg-white dark:bg-navy-900 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] animate-pulse bg-slate-200 dark:bg-navy-800 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    ),
    ssr: true,
  }
);

const StoresPreviewSection = dynamic(
  () => import("@/components/about/stores-preview-section").then((mod) => mod.StoresPreviewSection),
  {
    loading: () => (
      <div className="relative py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-80 animate-pulse bg-slate-200 dark:bg-navy-800 rounded-3xl" />
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "About Us | Pizza Space",
  description:
    "Discover Pizza Space's story - two decades of crafting authentic Italian pizzas with passion and quality ingredients.",
  keywords: [
    "about pizza space",
    "authentic italian pizza",
    "pizza restaurant story",
    "our team",
    "pizza mission",
    "pizza values",
    "London pizza restaurant",
    "family pizza business",
  ],
  alternates: {
    canonical: "https://pizzaspace.co.uk/about",
  },
  openGraph: {
    title: "About Us | Pizza Space",
    description:
      "Discover the story of Pizza Space - over two decades of crafting authentic Italian pizzas with passion, quality ingredients, and unwavering commitment to our community.",
    url: "https://pizzaspace.co.uk/about",
    siteName: "Pizza Space",
    images: [
      {
        url: "https://pizzaspace.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Pizza Space - Our Story",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Pizza Space",
    description:
      "Discover the story of Pizza Space - crafting authentic Italian pizzas with passion and quality ingredients.",
    images: ["https://pizzaspace.co.uk/og-image.jpg"],
    creator: "@pizzaspace",
    site: "@pizzaspace",
  },
};

export default async function AboutPage() {
  // Fetch all data server-side in parallel with cache revalidation
  const [storesData, openingHours, contactInfo, testimonialsData] = await Promise.all([
    getStores({ limit: 3, isActive: true }).catch((): APIResponse<PaginatedResponse<StoreResponse>> | null => null),
    fetchOpeningHours().catch((): OpeningHours[] => []),
    fetchContactInfo().catch((): ContactInfo | null => null),
    fetchTestimonials(1, 3).catch((): TestimonialsResult => ({ testimonials: [], pagination: { page: 1, limit: 3, total: 0, totalPages: 0 } })),
  ]);

  const stores: StoreResponse[] = storesData?.data?.data || [];

  return (
    <>
      {/* Page-specific JSON-LD structured data */}
      <AboutPageJsonLd />

      {/* Server-rendered hero section with SEO-optimized H1 */}
      <section
        className="relative w-full overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-28 lg:pt-40 lg:pb-36"
        aria-label="About us hero section"
      >
        {/* Client-side decorative background and animations */}
        <AboutHeroSection />

        {/* Main content container */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                Welcome to Pizza Space
              </span>
            </div>

            {/* SEO-optimized H1 - Server rendered for crawler visibility */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight px-2 sm:px-0">
              Our{" "}
              <span className="text-orange-500 relative">
                Story
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
              , Your Experience
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              For over two decades, we have been serving authentic Italian pizzas crafted
              with passion, quality ingredients, and a commitment to bringing joy to every
              table. Discover the journey that made us a beloved community favorite.
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
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Story Section - Company history with timeline - Above/at fold, loads immediately */}
      <StorySection />

      {/* Below-the-fold sections - Lazy loaded for better initial page load */}
      {/* Mission & Vision Section - Expanded with values grid */}
      <AboutMissionVisionSection />

      {/* Information Section - Opening Hours, Contact, Testimonials */}
      <section
        className="relative bg-slate-50 dark:bg-navy-950 py-16 md:py-24 lg:py-32"
        aria-label="Restaurant information"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 mb-4">
              Visit Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Plan Your{" "}
              <span className="text-orange-500 relative">
                Visit
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
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Find everything you need to know about visiting Pizza Space
            </p>
          </div>

          {/* Responsive grid - adapts to available content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {/* Opening Hours */}
            {openingHours.length > 0 && (
              <AboutHours hours={openingHours} />
            )}

            {/* Contact Info */}
            {contactInfo && (
              <AboutContact contactInfo={contactInfo} />
            )}

            {/* Testimonials */}
            {testimonialsData?.testimonials?.length > 0 && (
              <AboutTestimonials testimonials={testimonialsData.testimonials} />
            )}
          </div>
        </div>
      </section>

      {/* Team Section - Meet the people behind Pizza Space */}
      <TeamSection />

      {/* Stores Preview Section - Visit our locations */}
      <StoresPreviewSection stores={stores} />
    </>
  );
}
