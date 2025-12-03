import { Suspense } from "react";
import dynamic from "next/dynamic";

// Force dynamic rendering since we're fetching API data
export const dynamicParams = true;
export const revalidate = 60; // Cache for 60 seconds

// Above-the-fold sections (loaded immediately)
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";

// Skeletons for loading states
import { CategoriesContentSkeleton } from "@/components/home/categories-section/categories-content";
import { MenuSkeleton } from "@/components/home/menu-section/menu-skeleton";
import { StoresSkeleton } from "@/components/home/stores-section/stores-skeleton";

// Below-the-fold sections (lazy loaded for better initial performance)
const MenuSection = dynamic(
  () =>
    import("@/components/home/menu-section").then((mod) => ({
      default: mod.MenuSection,
    })),
  {
    loading: () => <MenuSkeleton />,
  }
);

const StoresSection = dynamic(
  () =>
    import("@/components/home/stores-section").then((mod) => ({
      default: mod.StoresSection,
    })),
  {
    loading: () => <StoresSkeleton />,
  }
);

const AboutSection = dynamic(() =>
  import("@/components/home/about-section").then((mod) => ({
    default: mod.AboutSection,
  }))
);

const MissionVisionSection = dynamic(() =>
  import("@/components/home/mission-vision-section").then((mod) => ({
    default: mod.MissionVisionSection,
  }))
);

const TestimonialsSection = dynamic(() =>
  import("@/components/home/testimonials-section").then((mod) => ({
    default: mod.TestimonialsSection,
  }))
);

const ContactSection = dynamic(() =>
  import("@/components/home/contact-section").then((mod) => ({
    default: mod.ContactSection,
  }))
);

export default function Home() {
  return (
    <>
      {/* Section 1: Hero Section - Critical above-the-fold content */}
      <HeroSection />

      {/* Section 2: Popular Categories (API) - Above the fold with Suspense */}
      <Suspense fallback={<CategoriesContentSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* Section 4: Our Special Menu (API) - Lazy loaded below the fold */}
      <MenuSection />

      {/* Section 5: Find Your Nearest Store (API) - Lazy loaded */}
      <StoresSection />

      {/* Section 6: About Pizza Space - Lazy loaded */}
      <AboutSection />

      {/* Section 7: Our Mission & Vision - Lazy loaded */}
      <MissionVisionSection />

      {/* Section 8: Customer Testimonials - Lazy loaded */}
      <TestimonialsSection />

      {/* Section 9: Contact Us - Lazy loaded */}
      <ContactSection />
    </>
  );
}
