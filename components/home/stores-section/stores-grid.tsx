import { StoreResponse } from "@/types";
import { StoreCard } from "./store-card";

interface StoresGridProps {
  stores: StoreResponse[];
}

export function StoresGrid({ stores }: StoresGridProps) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {stores.map((store) => (
        <StoreCard key={store._id} store={store} />
      ))}
    </div>
  );
}
