import type { Metadata } from "next";
import { getCategories, getSubCategories, getProducts } from "@/lib/api";
import { MenuJsonLd } from "@/components/seo/menu-json-ld";
import { MenuPageClient } from "@/components/menu/menu-page-client";

// Page will be dynamically rendered with search params
export const dynamic = "force-dynamic";

interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    page?: string;
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

  // Parallel data fetching for optimal performance
  const [categoriesResult, subcategoriesResult, productsResult] =
    await Promise.all([
      getCategories({ all: true }),
      getSubCategories({ all: true }),
      getProducts({
        categoryId: params.category,
        subCategoryId: params.subcategory,
        search: params.search,
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
      {/* JSON-LD Structured Data for SEO */}
      <MenuJsonLd
        products={products}
        currentCategory={params.category}
        currentSubcategory={params.subcategory}
      />

      {/* Main Container */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Our Menu</h1>

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
    </>
  );
}
