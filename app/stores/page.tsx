import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getStores } from "@/lib/api/stores";
import { StoreResponse, PaginationMeta } from "@/types";
import { StoresClientWrapper } from "@/components/stores/stores-client-wrapper";
import { StoresPageJsonLd } from "@/components/seo/json-ld";
import { MapPin } from "lucide-react";

// Lazy load reservation section (below the fold)
const ReservationSection = dynamic(
  () => import("@/components/stores/reservation-section").then((mod) => mod.ReservationSection),
  {
    loading: () => (
      <div className="relative py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-96 animate-pulse bg-slate-200 dark:bg-navy-800 rounded-3xl" />
        </div>
      </div>
    ),
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "Our Stores | Pizza Space",
  description:
    "Find your nearest Pizza Space location. Discover our stores across the UK and reserve your table for an unforgettable dining experience.",
  keywords: [
    "pizza space locations",
    "pizza stores London",
    "find pizza space near me",
    "pizza space restaurants",
    "reserve table",
    "pizza dine in",
    "pizza space opening hours",
  ],
  alternates: {
    canonical: "https://pizzaspace.co.uk/stores",
  },
  openGraph: {
    title: "Our Stores | Pizza Space",
    description:
      "Find your nearest Pizza Space location and reserve your table.",
    url: "https://pizzaspace.co.uk/stores",
    siteName: "Pizza Space",
    images: [
      {
        url: "https://pizzaspace.co.uk/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Pizza Space Store Locations",
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Stores | Pizza Space",
    description:
      "Find your nearest Pizza Space location and reserve your table.",
    images: ["https://pizzaspace.co.uk/og-image.jpg"],
    creator: "@pizzaspace",
    site: "@pizzaspace",
  },
};

const DEFAULT_ITEMS_PER_PAGE = 9;

export default async function StoresPage() {
  // Fetch stores data server-side with pagination
  let stores: StoreResponse[] = [];
  let allStores: StoreResponse[] = []; // For the map (all stores)
  let meta: PaginationMeta = {
    currentPage: 1,
    totalPages: 0,
    totalItems: 0,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    hasNextPage: false,
    hasPrevPage: false,
  };

  try {
    // Fetch paginated stores for grid
    const response = await getStores({ isActive: true, limit: DEFAULT_ITEMS_PER_PAGE, page: 1 });
    if (response.statusCode === 200 && response.data?.data) {
      stores = response.data.data;
      meta = response.data.meta;
    }

    // Fetch all stores for the map (without pagination)
    const allStoresResponse = await getStores({ isActive: true, limit: 1000 });
    if (allStoresResponse.statusCode === 200 && allStoresResponse.data?.data) {
      allStores = allStoresResponse.data.data;
    }
  } catch (error) {
    // Log error in development only
    if (process.env.NODE_ENV === 'development') {
      console.error("Failed to load stores:", error);
    }
  }

  return (
    <>
      {/* Page-specific JSON-LD structured data */}
      <StoresPageJsonLd />

      {/* Server-rendered hero section with SEO-optimized H1 - Centered like About page */}
      <section
        className="relative w-full overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24 lg:pt-40 lg:pb-28 bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
        aria-label="Store locator hero section"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-200/40 to-orange-300/20 dark:from-orange-500/10 dark:to-orange-600/5 blur-3xl" />
          <div className="absolute top-1/3 -left-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-amber-200/30 to-orange-200/20 dark:from-amber-500/10 dark:to-orange-500/5 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-tl from-orange-100/50 to-amber-100/30 dark:from-orange-600/10 dark:to-amber-600/5 blur-3xl" />
        </div>

        {/* Main content container */}
        <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Find Your Nearest Store
              </span>
            </div>

            {/* SEO-optimized H1 - Server rendered for crawler visibility */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight px-2 sm:px-0">
              Our{" "}
              <span className="text-orange-500 relative">
                Locations
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
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Discover our locations across the UK. Fresh pizza, warm atmosphere,
              and exceptional service await you at every Pizza Space restaurant.
            </p>

            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
              <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
              <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            </div>

            {/* Stats Section */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-10 sm:mt-12">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                  <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">50+</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Locations</div>
                </div>
              </div>

              <div className="h-12 sm:h-14 w-px bg-slate-200 dark:bg-slate-700" />

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">10-23</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Opening Hours</div>
                </div>
              </div>

              <div className="hidden sm:block h-12 sm:h-14 w-px bg-slate-200 dark:bg-slate-700" />

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">4.8★</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-16 sm:h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* Client wrapper handles search state, filtering, and pagination */}
      <StoresClientWrapper
        initialStores={stores}
        allStores={allStores}
        initialMeta={meta}
        itemsPerPage={DEFAULT_ITEMS_PER_PAGE}
      />

      {/* Reservation Section - Below the fold, lazy loaded */}
      <ReservationSection stores={allStores} />
    </>
  );
}
