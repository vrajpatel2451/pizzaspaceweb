import { getProducts } from "@/lib/api";
import { ProductResponse } from "@/types";
import { DealsContent } from "./deals-content";

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
        <SectionBadge>Limited Time</SectionBadge>
      </div>

      {/* Headline */}
      <h2
        id="deals-heading"
        className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4"
      >
        Crazy{" "}
        <span className="text-orange-500 relative">
          Deals
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
        Grab these incredible offers before they&apos;re gone. Fresh from the
        oven, straight to your door.
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

export async function DealsSection() {
  const categoryId = process.env.NEXT_PUBLIC_DEALS_CATEGORY_ID;

  if (!categoryId) {
    return null;
  }

  let products: ProductResponse[] = [];

  try {
    const res = await getProducts({ categoryId, limit: 8 });
    products = res?.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch deals:", error);
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="relative bg-white dark:bg-slate-950 py-16 sm:py-20 lg:py-24 overflow-hidden"
      aria-labelledby="deals-heading"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader />
        <DealsContent products={products} />
      </div>
    </section>
  );
}
