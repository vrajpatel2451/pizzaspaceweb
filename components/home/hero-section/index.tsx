import { BackgroundShapes } from "./background-shapes";
import { HeroContent } from "./hero-content";
import { HeroImage } from "./hero-image";
import { FloatingCards } from "./floating-cards";
import { getCategories } from "@/lib/api/categories";
import { CategoryResponse } from "@/types";

export async function HeroSection() {
  let trendingCategories: CategoryResponse[] = [];

  try {
    const categoriesResponse = await getCategories({ limit: 3 });
    trendingCategories = categoriesResponse?.data?.data || [];
  } catch (error) {
    console.error("Hero data fetch error:", error);
  }

  return (
    <section
      className="relative w-full overflow-hidden pt-24 pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-24"
      aria-label="Hero section"
    >
      {/* Background decorative elements */}
      <BackgroundShapes />

      {/* Main content container */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left side - Content */}
          <HeroContent trendingCategories={trendingCategories} />

          {/* Right side - Visual - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block">
            <HeroImage />
          </div>
        </div>
      </div>

      {/* Floating stat badges - Hidden on mobile */}
      <FloatingCards />

      {/* Bottom fade gradient for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

// Named export for dynamic import compatibility
export { HeroSection as default };
