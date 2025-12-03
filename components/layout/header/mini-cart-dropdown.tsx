"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, X, Loader2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCartItems,
  useCartSummary,
  useIsCartLoading,
  useIsCartHydrated,
  useCartCount,
} from "@/store/cart-store";
import { CartBadge } from "./cart-badge";
import { formatNumber } from "@/lib/utils/format";

export interface MiniCartDropdownProps {
  className?: string;
}

export function MiniCartDropdown({ className }: MiniCartDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const items = useCartItems();
  const summary = useCartSummary();
  const isLoading = useIsCartLoading();
  const isHydrated = useIsCartHydrated();
  const itemCount = useCartCount();

  // Display only first 3 items in dropdown
  const displayItems = items.slice(0, 3);
  const hasMoreItems = items.length > 3;

  const isEmpty = itemCount === 0;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className={className}>
          <CartBadge
            asButton
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "transition-transform duration-200",
              isOpen && "scale-95"
            )}
          />
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className={cn(
          "w-[360px] sm:w-[400px] p-0 overflow-hidden",
          "bg-background border shadow-xl rounded-xl",
          "animate-modal-in"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/40">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            <h3 className="font-semibold text-base">
              Shopping Cart
              {!isEmpty && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className={cn(
              "size-8 rounded-full flex items-center justify-center",
              "hover:bg-accent transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-ring"
            )}
            aria-label="Close cart"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[400px] overflow-y-auto">
          {!isHydrated || isLoading ? (
            <LoadingState />
          ) : isEmpty ? (
            <EmptyState onClose={() => setIsOpen(false)} />
          ) : (
            <CartItemsList
              items={displayItems}
              hasMoreItems={hasMoreItems}
              remainingCount={items.length - 3}
            />
          )}
        </div>

        {/* Footer */}
        {!isEmpty && isHydrated && !isLoading && (
          <div className="border-t bg-muted/40 p-4 space-y-3">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Subtotal
              </span>
              <span className="text-lg font-bold">
                {summary?.itemTotal
                  ? formatNumber(summary.itemTotal)
                  : formatNumber(0)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="default"
                className="w-full"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button
                variant="default"
                size="default"
                className="w-full"
                onClick={() => setIsOpen(false)}
                asChild
              >
                <Link href="/checkout">Checkout</Link>
              </Button>
            </div>

            {/* Tax & Delivery Notice */}
            <p className="text-xs text-center text-muted-foreground">
              Taxes and delivery calculated at checkout
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Loader2 className="size-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">Loading cart...</p>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  onClose: () => void;
}

function EmptyState({ onClose }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ShoppingBag className="size-8 text-muted-foreground" />
      </div>
      <h4 className="text-base font-semibold mb-2">Your cart is empty</h4>
      <p className="text-sm text-muted-foreground mb-6 max-w-[260px]">
        Start adding items from our menu to see them here
      </p>
      <Button
        variant="default"
        size="sm"
        className="min-w-[140px]"
        onClick={onClose}
        asChild
      >
        <Link href="/menu">Browse Menu</Link>
      </Button>
    </div>
  );
}

// Cart Items List Component
interface CartItemsListProps {
  items: Array<{
    _id: string;
    itemId: string;
    quantity: number;
    variantId: string;
  }>;
  hasMoreItems: boolean;
  remainingCount: number;
}

function CartItemsList({
  items,
  hasMoreItems,
  remainingCount,
}: CartItemsListProps) {
  return (
    <div className="divide-y">
      {items.map((item, index) => (
        <div
          key={item._id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <CartItemPreview item={item} />
        </div>
      ))}

      {/* Show more items indicator */}
      {hasMoreItems && (
        <div className="py-3 px-4 bg-muted/30 text-center animate-fade-in">
          <Link
            href="/cart"
            className="text-sm text-primary hover:underline font-medium"
          >
            + {remainingCount} more {remainingCount === 1 ? "item" : "items"}
          </Link>
        </div>
      )}
    </div>
  );
}

// Cart Item Preview Component
interface CartItemPreviewProps {
  item: {
    _id: string;
    itemId: string;
    quantity: number;
    variantId: string;
  };
}

function CartItemPreview({ item }: CartItemPreviewProps) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
      {/* Item Image Placeholder */}
      <div className="flex-shrink-0 size-16 rounded-lg bg-muted flex items-center justify-center">
        <ShoppingBag className="size-6 text-muted-foreground" />
      </div>

      {/* Item Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate mb-1">
          Item #{item.itemId.slice(-6)}
        </h4>
        <p className="text-xs text-muted-foreground mb-1">
          Variant: {item.variantId.slice(-6)}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Qty: {item.quantity}
          </span>
        </div>
      </div>

      {/* Item Price - Placeholder */}
      <div className="flex-shrink-0 text-right">
        <p className="text-sm font-semibold">--</p>
      </div>
    </div>
  );
}
