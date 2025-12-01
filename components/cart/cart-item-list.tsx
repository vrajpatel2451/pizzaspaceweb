"use client";

import { CartResponse } from "@/types";
import { CartItemCard } from "./cart-item-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CartItemListProps {
  items: CartResponse[];
  onQuantityChange: (cartId: string, newQuantity: number) => Promise<void>;
  onRemove: (cartId: string) => Promise<void>;
  onEditSuccess?: () => void;
  itemDetailsMap?: Record<
    string,
    {
      name: string;
      image?: string;
      variantName?: string;
      price: number;
    }
  >;
  loading?: boolean;
  className?: string;
}

export function CartItemList({
  items,
  onQuantityChange,
  onRemove,
  onEditSuccess,
  itemDetailsMap = {},
  loading = false,
  className,
}: CartItemListProps) {
  if (loading) {
    return (
      <div className={cn("flex flex-col gap-4", className)}>
        {[1, 2, 3].map((i) => (
          <CartItemSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {items.map((item) => (
        <CartItemCard
          key={item._id}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          onEditSuccess={onEditSuccess}
          itemDetails={itemDetailsMap[item.itemId]}
        />
      ))}
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4 shadow-sm">
      <Skeleton className="h-24 w-24 flex-shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center justify-between gap-2 mt-auto">
          <Skeleton className="h-9 w-32" />
          <div className="flex gap-1">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
