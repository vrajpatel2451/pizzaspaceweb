"use client";

import { ProductResponse } from "@/types";
import { DealCard } from "./deal-card";

interface DealsContentProps {
  products: ProductResponse[];
}

export function DealsContent({ products }: DealsContentProps) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6"
      role="list"
      aria-label="Deals products"
    >
      {products.slice(0, 8).map((product, i) => (
        <div key={product._id} role="listitem">
          <DealCard
            product={product}
            index={i}
            priority={i < 4}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
