import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getStores } from "@/lib/api/stores";
import { StoreResponse, PaginationMeta } from "@/types";
import { StoresClientWrapper } from "@/components/stores/stores-client-wrapper";

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
  description: "Find your nearest Pizza Space location. Discover our stores across the UK and reserve your table for an unforgettable dining experience.",
  keywords: ["pizza stores", "locations", "find pizza space", "nearest store", "reservations"],
  openGraph: {
    title: "Our Stores | Pizza Space",
    description: "Find your nearest Pizza Space location and reserve your table.",
    type: "website",
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
