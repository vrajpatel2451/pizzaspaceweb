import { Suspense } from "react";
import { getStores } from "@/lib/api";
import { getMockStores } from "@/lib/mocks/stores";
import { StoresGrid } from "./stores-grid";
import { StoresSkeleton } from "./stores-skeleton";

async function StoresContent() {
  let stores;

  try {
    const response = await getStores({ isActive: true, limit: 6 });
    stores = response.data.data;
  } catch (error) {
    // Fallback to mock data if API fails
    console.error("Failed to fetch stores, using mock data:", error);
    const mockResponse = getMockStores(1, 6);
    stores = mockResponse.data.data;
  }

  return <StoresGrid stores={stores} />;
}

export function StoresSection() {
  return (
    <section className="bg-slate-50 py-16 relative" aria-labelledby="stores-heading">
      {/* Subtle grid pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(to right, #94a3b8 1px, transparent 1px),
            linear-gradient(to bottom, #94a3b8 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            Our Locations
          </span>
          <h2 id="stores-heading" className="text-3xl font-bold mt-4 text-gray-900">
            Find Your Nearest Store
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Visit us at any of our convenient locations or order online for
            delivery.
          </p>
        </div>

        <Suspense fallback={<StoresSkeleton />}>
          <StoresContent />
        </Suspense>
      </div>
    </section>
  );
}
