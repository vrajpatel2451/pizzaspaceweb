import { getProducts } from "@/lib/api";
import { ProductResponse } from "@/types";
import { DealsContent } from "./deals-content";

export async function DealsSection() {
  const categoryId = process.env.NEXT_PUBLIC_DEALS_CATEGORY_ID;

  if (!categoryId) {
    return null;
  }

  let products: ProductResponse[] = [];

  try {
    const res = await getProducts({ categoryId, limit: 10 });
    products = res?.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch deals:", error);
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section
      className="relative bg-slate-950 py-16 sm:py-20 lg:py-24 overflow-hidden"
      aria-labelledby="deals-heading"
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-500/5 rounded-full blur-3xl" />
        {/* Subtle dotted pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Limited Time
            </span>
          </div>

          <h2
            id="deals-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            Crazy{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
              Deals
            </span>
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Grab these incredible offers before they&apos;re gone. Fresh from the
            oven, straight to your door.
          </p>
        </div>

        {/* Deals Carousel */}
        <DealsContent products={products} />
      </div>
    </section>
  );
}
