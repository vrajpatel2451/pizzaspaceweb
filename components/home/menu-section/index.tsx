import { getProducts, getCategories } from "@/lib/api";
import { getMockProducts } from "@/lib/mocks/products";
import { getMockCategories } from "@/lib/mocks/categories";
import { MenuContent } from "./menu-content";

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
      {children}
    </span>
  );
}

function SectionHeader() {
  return (
    <div className="text-center mb-12 sm:mb-16">
      {/* Badge */}
      <div className="mb-4">
        <SectionBadge>Our Menu</SectionBadge>
      </div>

      {/* Headline */}
      <h2
        id="menu-heading"
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
      >
        Most Popular{" "}
        <span className="text-orange-500 relative">
          Dishes
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
        Discover our handcrafted selection of premium pizzas, made with the finest
        ingredients and baked to perfection in our wood-fired ovens.
      </p>

      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>
    </div>
  );
}

export async function MenuSection() {
  let products;
  let categories;
  let meta;

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts({ limit: 8, page: 1 }),
      getCategories({ limit: 10 }),
    ]);
    products = productsRes.data.data;
    categories = categoriesRes.data.data;
    meta = productsRes.data.meta;
  } catch (error) {
    // Fallback to mock data if API fails
    console.error("Failed to fetch menu data, using mock data:", error);
    const mockProducts = getMockProducts(1, 8);
    const mockCategories = getMockCategories(1, 10);
    products = mockProducts.data.data;
    categories = mockCategories.data.data;
    meta = mockProducts.data.meta;
  }

  return (
    <section
      className="relative bg-white dark:bg-slate-950 py-16 sm:py-20 lg:py-24 overflow-hidden"
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
        {/* Section Header */}
        <SectionHeader />

        {/* Menu Content (Tabs + Grid) */}
        <MenuContent
          initialProducts={products}
          categories={categories}
          initialMeta={meta}
        />
      </div>
    </section>
  );
}
