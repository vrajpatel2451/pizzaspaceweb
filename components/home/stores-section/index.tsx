import { Suspense } from "react";
import { getStores } from "@/lib/api";
import { getMockStores } from "@/lib/mocks/stores";
import { StoresGrid } from "./stores-grid";
import { ReservationForm } from "./reservation-form";
import { StoresSkeleton } from "./stores-skeleton";
import { StoreResponse } from "@/types";

async function StoresContent() {
  let stores: StoreResponse[];

  try {
    const response = await getStores({ isActive: true, limit: 6 });
    stores = response.data.data;
  } catch (error) {
    // Fallback to mock data if API fails
    console.error("Failed to fetch stores, using mock data:", error);
    const mockResponse = getMockStores(1, 6);
    stores = mockResponse.data.data;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Side: Store Cards */}
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Our Locations</h3>
          <p className="text-gray-600 text-sm">
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
    <section className="bg-slate-50 py-16 lg:py-20 relative" aria-labelledby="stores-heading">
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
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <span className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm">
            Our Locations
          </span>
          <h2 id="stores-heading" className="text-3xl lg:text-4xl font-bold mt-4 text-gray-900">
            Visit Us In Person
          </h2>
          <p className="text-gray-600 mt-3 max-w-2xl mx-auto text-base lg:text-lg">
            Experience the authentic taste of our handcrafted pizzas in a warm, inviting atmosphere.
            Dine with us or make a reservation for a special occasion.
          </p>
        </div>

        {/* Content Grid */}
        <Suspense fallback={<StoresSkeleton />}>
          <StoresContent />
        </Suspense>
      </div>
    </section>
  );
}
