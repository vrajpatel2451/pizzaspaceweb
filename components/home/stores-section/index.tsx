import { Suspense } from "react";
import Link from "next/link";
import { getStores } from "@/lib/api";
import { StoresGrid } from "./stores-grid";
import { ReservationForm } from "./reservation-form";
import { StoresSkeleton } from "./stores-skeleton";
import { StoreResponse } from "@/types";

async function StoresContent() {
  let stores: StoreResponse[] = [];

  try {
    const response = await getStores({ isActive: true, limit: 6 });
    stores = response?.data?.data || [];
  } catch (error) {
    console.error("Failed to fetch stores:", error);
    // Return empty array - will show empty state
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Side: Store Cards */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 mb-2">Our Locations</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Visit us at any of our convenient locations
          </p>
        </div>
        <StoresGrid stores={stores} maxStores={3} />
      </div>

      {/* Right Side: Reservation Form */}
      <div className="lg:sticky lg:top-24 h-fit">
        <ReservationForm stores={stores} />
      </div>
    </div>
  );
}

export function StoresSection() {
  return (
    <section className="bg-slate-50 dark:bg-slate-900 py-16 lg:py-20 relative" aria-labelledby="stores-heading">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-5 dark:opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #94a3b8 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Our Locations
            </span>
          </div>

          {/* Headline */}
          <h2 id="stores-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Visit Us{" "}
            <span className="text-orange-500 relative">
              In Person
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
            Experience the authentic taste of our handcrafted pizzas in a warm, inviting atmosphere.
            Dine with us or make a reservation for a special occasion.
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>

        {/* Content Grid */}
        <Suspense fallback={<StoresSkeleton />}>
          <StoresContent />
        </Suspense>

        {/* View All Locations Link */}
        <div className="text-center mt-10">
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            <span>View All Locations</span>
            <svg
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
