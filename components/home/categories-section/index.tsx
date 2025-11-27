import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { getMockCategories } from "@/lib/mocks/categories";
import { CategoriesCarousel } from "./categories-carousel";
import { CategoriesSkeleton } from "./categories-skeleton";

export async function CategoriesSection() {
  let categories;

  try {
    // Fetch categories from API
    const response = await getCategories({ limit: 10 });
    categories = response.data.data;
  } catch (error) {
    // Fallback to mock data if API fails
    console.error("Failed to fetch categories, using mock data:", error);
    const mockResponse = getMockCategories(1, 10);
    categories = mockResponse.data.data;
  }

  return (
    <section className="bg-amber-50 py-16 md:py-20" aria-labelledby="categories-heading">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium uppercase tracking-wide shadow-md">
            Popular Categories
          </span>
          <h2 id="categories-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 text-gray-900">
            Choose Your Favorite
          </h2>
          <p className="text-gray-600 mt-3 text-base md:text-lg max-w-2xl mx-auto">
            Explore our most popular categories and discover delicious options
            for every craving
          </p>
        </div>

        {/* Carousel with Suspense */}
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesCarousel categories={categories} />
        </Suspense>
      </div>
    </section>
  );
}
