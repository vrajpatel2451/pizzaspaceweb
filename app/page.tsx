import { Suspense } from "react";
import dynamic from "next/dynamic";

// Above-the-fold sections (loaded immediately)
import { HeroSlider } from "@/components/home/hero-slider";
import { MakeOrderSection } from "@/components/home/make-order-section";
import { CategoriesSection } from "@/components/home/categories-section";

// Skeletons for loading states
import { CategoriesSkeleton } from "@/components/home/categories-section/categories-skeleton";
import { MenuSkeleton } from "@/components/home/menu-section/menu-skeleton";
import { StoresSkeleton } from "@/components/home/stores-section/stores-skeleton";

// Below-the-fold sections (lazy loaded for better initial performance)
const MenuSection = dynamic(() => import("@/components/home/menu-section").then(mod => ({ default: mod.MenuSection })), {
  loading: () => <MenuSkeleton />,
});

const StoresSection = dynamic(() => import("@/components/home/stores-section").then(mod => ({ default: mod.StoresSection })), {
  loading: () => <StoresSkeleton />,
});

const AwardsSection = dynamic(() => import("@/components/home/awards-section").then(mod => ({ default: mod.AwardsSection })));

const AboutSection = dynamic(() => import("@/components/home/about-section").then(mod => ({ default: mod.AboutSection })));

const MissionVisionSection = dynamic(() => import("@/components/home/mission-vision-section").then(mod => ({ default: mod.MissionVisionSection })));

const TestimonialsSection = dynamic(() => import("@/components/home/testimonials-section").then(mod => ({ default: mod.TestimonialsSection })));

const ContactSection = dynamic(() => import("@/components/home/contact-section").then(mod => ({ default: mod.ContactSection })));

export default function Home() {
  return (
    <>
      {/* Section 1: Hero Slider - Critical above-the-fold content */}
      <HeroSlider />

      {/* Section 2: Make Your Order CTA - Above the fold */}
      <MakeOrderSection />

      {/* Section 3: Popular Categories (API) - Above the fold with Suspense */}
      <Suspense fallback={<CategoriesSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* Section 4: Our Special Menu (API) - Lazy loaded below the fold */}
      <MenuSection />

      {/* Section 5: Find Your Nearest Store (API) - Lazy loaded */}
      <StoresSection />

      {/* Section 6: Awards & Achievements - Lazy loaded */}
      <AwardsSection />

      {/* Section 7: About Pizza Space - Lazy loaded */}
      <AboutSection />

      {/* Section 8: Our Mission & Vision - Lazy loaded */}
      <MissionVisionSection />

      {/* Section 9: Customer Testimonials - Lazy loaded */}
      <TestimonialsSection />

      {/* Section 10: Contact Us - Lazy loaded */}
      <ContactSection />
    </>
  );
}
