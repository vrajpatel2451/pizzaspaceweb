import { BackgroundShapes } from "./background-shapes";
import { HeroContent } from "./hero-content";
import { HeroImage } from "./hero-image";
import { FloatingCards } from "./floating-cards";
import { getProducts } from "@/lib/api/products";
import { getCategories } from "@/lib/api/categories";
import { ProductResponse, CategoryResponse } from "@/types";

export async function HeroSection() {
  let featuredProducts: ProductResponse[] = [];
  let trendingCategories: CategoryResponse[] = [];

  try {
    // Fetch featured products and trending categories in parallel
    const [productsResponse, categoriesResponse] = await Promise.allSettled([
      getProducts({ limit: 3 }),
      getCategories({ limit: 3 }),
    ]);

    // Extract products if fetch was successful
    if (productsResponse.status === 'fulfilled') {
      featuredProducts = productsResponse.value?.data?.data || [];
    } else {
      console.error("Failed to fetch products for hero:", productsResponse.reason);
    }

    // Extract categories if fetch was successful
    if (categoriesResponse.status === 'fulfilled') {
      trendingCategories = categoriesResponse.value?.data?.data || [];
    } else {
      console.error("Failed to fetch categories for hero:", categoriesResponse.reason);
    }
  } catch (error) {
    console.error("Hero data fetch error:", error);
    // featuredProducts and trendingCategories remain empty arrays
  }

  return (
    <section
      className="relative w-full overflow-hidden py-12 sm:py-16 lg:py-0"
      aria-label="Hero section"
    >
      {/* Background decorative elements */}
      <BackgroundShapes />

      {/* Main content container */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left side - Content */}
          <HeroContent trendingCategories={trendingCategories} />

          {/* Right side - Visual - Hidden on mobile, visible on large screens */}
          <div className="hidden lg:block">
            <HeroImage />
          </div>
        </div>
      </div>

      {/* Floating product cards and badges - Hidden on mobile */}
      <FloatingCards products={featuredProducts} />

      {/* Bottom fade gradient for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

// Named export for dynamic import compatibility
export { HeroSection as default };
