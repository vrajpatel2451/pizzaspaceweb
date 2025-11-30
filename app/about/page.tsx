import { Metadata } from "next";
import dynamic from "next/dynamic";
import { AboutHeroSection } from "@/components/about/hero-section";
import { StorySection } from "@/components/about/story-section";
import { getStores } from "@/lib/api/stores";
import { StoreResponse } from "@/types";

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
    "Discover the story of Pizza Space - over two decades of crafting authentic Italian pizzas with passion, quality ingredients, and unwavering commitment to our community. Meet our team and learn about our mission.",
  keywords: [
    "about pizza space",
    "authentic italian pizza",
    "pizza restaurant story",
    "our team",
    "pizza mission",
    "pizza values",
  ],
  openGraph: {
    title: "About Us | Pizza Space",
    description:
      "Discover the story of Pizza Space - over two decades of crafting authentic Italian pizzas with passion, quality ingredients, and unwavering commitment to our community.",
    type: "website",
  },
};

export default async function AboutPage() {
  // Fetch stores data server-side with cache revalidation
  let stores: StoreResponse[] = [];
  try {
    const storesResponse = await getStores({ limit: 3, isActive: true });
    stores = storesResponse?.data?.data || [];
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error("Error fetching stores:", error);
    }
  }

  return (
    <>
      {/* Hero Section - Our Story headline - Above the fold, loads immediately */}
      <AboutHeroSection />

      {/* Story Section - Company history with timeline - Above/at fold, loads immediately */}
      <StorySection />

      {/* Below-the-fold sections - Lazy loaded for better initial page load */}
      {/* Mission & Vision Section - Expanded with values grid */}
      <AboutMissionVisionSection />

      {/* Team Section - Meet the people behind Pizza Space */}
      <TeamSection />

      {/* Stores Preview Section - Visit our locations */}
      <StoresPreviewSection stores={stores} />
    </>
  );
}
