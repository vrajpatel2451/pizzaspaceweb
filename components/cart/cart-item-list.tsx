"use client";

import { CartResponse } from "@/types";
import { CartItemCard } from "./cart-item-card";
import { cn } from "@/lib/utils";

interface CartItemListProps {
  items: CartResponse[];
  onQuantityChange: (cartId: string, newQuantity: number) => Promise<void>;
  onRemove: (cartId: string) => Promise<void>;
  onEditSuccess?: () => void;
  className?: string;
}

export function CartItemList({
  items,
  onQuantityChange,
  onRemove,
  onEditSuccess,
  className,
}: CartItemListProps) {
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
        />
      ))}
    </div>
  );
}
