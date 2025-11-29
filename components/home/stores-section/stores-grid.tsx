import { StoreResponse } from "@/types";
import { StoreCard } from "./store-card";

interface StoresGridProps {
  stores: StoreResponse[];
  maxStores?: number;
}

export function StoresGrid({ stores, maxStores = 3 }: StoresGridProps) {
  if (!stores || stores.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No stores available at the moment.</p>
        <p className="text-gray-400 text-sm mt-2">
          Check back soon for locations near you.
        </p>
      </div>
    );
  }

  // Limit the number of stores displayed
  const displayedStores = stores.slice(0, maxStores);

  return (
    <div className="grid grid-cols-1 gap-6">
      {displayedStores.map((store) => (
        <StoreCard key={store._id} store={store} />
      ))}
    </div>
  );
}
