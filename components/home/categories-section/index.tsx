import { Suspense } from "react";
import { getCategories } from "@/lib/api";
import { CategoriesContent, CategoriesContentSkeleton } from "./categories-content";
import { CategoryResponse } from "@/types";
import { Grid3X3 } from "lucide-react";

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
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <Grid3X3 className="w-3.5 h-3.5" />
              Our Categories
            </span>
          </div>

          {/* Headline */}
          <h2
            id="categories-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
          >
            Choose Your{" "}
            <span className="text-orange-500 relative">
              Favorite
              {/* Decorative underline */}
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

          {/* Subheadline */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our carefully curated menu categories and discover
            delicious options crafted to satisfy every craving
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>

        {/* Categories Content with Interactive Pills, Filters, and Cards */}
        <Suspense fallback={<CategoriesContentSkeleton />}>
          <CategoriesContent categories={categories} />
        </Suspense>
      </div>
    </section>
  );
}
