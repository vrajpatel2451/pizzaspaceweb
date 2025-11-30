import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { CategoriesContent, CategoriesContentSkeleton } from "./categories-content";
import { CategoryResponse } from "@/types";

export async function CategoriesSection() {
  let categories: CategoryResponse[] = [];

  try {
    // Fetch categories from API
    const response = await getCategories({ limit: 10 });
    categories = response.data?.data || [];
  } catch (error) {
    // Log error and show empty state
    console.error("Failed to fetch categories:", error);
    categories = [];
  }

  // Don't render section if no categories
  if (categories.length === 0) {
    return null;
  }

  return (
    <section
      className="relative bg-amber-50 dark:bg-slate-900 py-16 md:py-24 overflow-hidden"
      aria-labelledby="categories-heading"
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top-right decorative circle */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/40 to-amber-100/20 dark:from-orange-900/20 dark:to-amber-900/10 rounded-full blur-3xl" />

        {/* Bottom-left decorative circle */}
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-orange-300/30 to-yellow-100/20 dark:from-orange-900/15 dark:to-yellow-900/10 rounded-full blur-3xl" />

        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          {/* Section Badge */}
          <span className="inline-flex items-center gap-2 bg-orange-500/10 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-4">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            Our Categories
          </span>

          {/* Main Headline */}
          <h2
            id="categories-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Choose Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              Favorite
            </span>
          </h2>

          {/* Subheadline */}
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our carefully curated menu categories and discover
            delicious options crafted to satisfy every craving
          </p>
        </div>

        {/* Categories Content with Interactive Pills, Filters, and Cards */}
        <Suspense fallback={<CategoriesContentSkeleton />}>
          <CategoriesContent categories={categories} />
        </Suspense>
      </div>
    </section>
  );
}
