import type { Metadata } from "next";
import { getCategories, getSubCategories, getProducts } from "@/lib/api";
import { MenuJsonLd } from "@/components/seo/menu-json-ld";
import { MenuPageJsonLd } from "@/components/seo/json-ld";
import { MenuPageClient } from "@/components/menu/menu-page-client";
import { UtensilsCrossed } from "lucide-react";
import { cookies } from "next/headers";

// Page will be dynamically rendered with search params
export const dynamic = "force-dynamic";

interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    page?: string;
    deliveryType?: string;
  }>;
}

/**
 * Generate dynamic metadata based on active filters
 */
export async function generateMetadata({
  searchParams,
}: MenuPageProps): Promise<Metadata> {
  const params = await searchParams;

  // Base metadata
  let title = "Menu - Pizza Space";
  let description =
    "Browse our complete menu of authentic Italian pizzas, sides, drinks, and desserts. Fresh ingredients, handcrafted with love.";

  // Customize metadata based on active filters
  if (params.category) {
    try {
      const categoriesResult = await getCategories({ all: true });
      if (categoriesResult.statusCode === 200) {
        const category = categoriesResult.data.data.find(
          (c) => c._id === params.category
        );
        if (category) {
          title = `${category.name} - Menu - Pizza Space`;
          description = `Explore our ${category.name.toLowerCase()} menu with fresh ingredients and authentic Italian recipes.`;
        }
      }
    } catch (error) {
      console.error("Error fetching category for metadata:", error);
    }
  }

  if (params.search) {
    title = `Search: "${params.search}" - Menu - Pizza Space`;
    description = `Search results for "${params.search}" in our menu of authentic Italian pizzas and specialties.`;
  }

  // Build canonical URL with query params
  const baseUrl = "https://pizzaspace.co.uk/menu";
  const queryParams = new URLSearchParams();
  if (params.category) queryParams.set("category", params.category);
  if (params.subcategory) queryParams.set("subcategory", params.subcategory);
  if (params.search) queryParams.set("search", params.search);
  if (params.page && params.page !== "1") queryParams.set("page", params.page);

  const canonicalUrl =
    queryParams.toString() !== ""
      ? `${baseUrl}?${queryParams.toString()}`
      : baseUrl;

  return {
    title,
    description,
    keywords: [
      "pizza menu",
      "pizza space menu",
      "Italian pizza menu",
      "pizza delivery menu",
      "pizza prices",
      "pizza toppings",
      "order pizza",
      "pizza sides",
      "pizza deals London",
    ],
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Pizza Space",
      images: [
        {
          url: "https://pizzaspace.co.uk/og-menu.jpg",
          width: 1200,
          height: 630,
          alt: "Pizza Space Menu",
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://pizzaspace.co.uk/og-menu.jpg"],
      creator: "@pizzaspace",
      site: "@pizzaspace",
    },
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

/**
 * Menu Page - Server Component
 * Fetches categories, subcategories, and products in parallel
 * Renders basic layout structure for now (client components will be added in Phase 3.2)
 */
export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");

  // Get delivery type from searchParams (passed from client)
  const deliveryType = params.deliveryType;

  // Parallel data fetching for optimal performance
  const [categoriesResult, subcategoriesResult, productsResult] =
    await Promise.all([
      getCategories({ all: true }),
      getSubCategories({ all: true }),
      getProducts({
        categoryId: params.category,
        subCategoryId: params.subcategory,
        search: params.search,
        deliveryType: deliveryType,
        page,
        limit: 12,
      }),
    ]);

  // Error handling - throw to trigger error.tsx boundary
  if (categoriesResult.statusCode !== 200) {
    throw new Error("Failed to load menu categories");
  }

  if (subcategoriesResult.statusCode !== 200) {
    throw new Error("Failed to load menu subcategories");
  }

  if (productsResult.statusCode !== 200) {
    throw new Error("Failed to load menu products");
  }

  // Extract data from API responses
  const categories = categoriesResult.data.data;
  const subcategories = subcategoriesResult.data.data;
  const products = productsResult.data.data;
  const pagination = productsResult.data.meta;

  return (
    <>
      {/* Page-level JSON-LD structured data */}
      <MenuPageJsonLd />

      {/* Product-level JSON-LD structured data */}
      <MenuJsonLd
        products={products}
        currentCategory={params.category}
        currentSubcategory={params.subcategory}
      />

      {/* Main Container */}
      <section
        className="relative bg-white dark:bg-slate-950 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20 overflow-hidden"
        aria-labelledby="menu-heading"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top left gradient blob */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
          {/* Bottom right gradient blob */}
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Premium Section Header */}
          <div className="text-center mb-10 sm:mb-12 lg:mb-14">
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                <UtensilsCrossed className="w-3.5 h-3.5" />
                Browse Menu
              </span>
            </div>

            {/* Headline */}
            <h1
              id="menu-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Our{" "}
              <span className="text-orange-500 relative">
                Menu
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
            </h1>

            {/* Subheadline */}
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Explore our handcrafted selection of pizzas, sides, and more. Made
              with the finest ingredients and baked to perfection.
            </p>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
              <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
              <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            </div>
          </div>

          {/* Client Component - Handles desktop/mobile layouts and filter UI */}
          <MenuPageClient
            categories={categories}
            subcategories={subcategories}
            products={products}
            pagination={pagination}
            initialFilters={{
              categoryId: params.category,
              subCategoryId: params.subcategory,
              search: params.search,
              page,
            }}
          />
        </div>
      </section>
    </>
  );
}
