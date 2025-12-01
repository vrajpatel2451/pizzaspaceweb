"use client";

import { useState, useMemo } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { CustomImage } from "@/components/ui/custom-image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { QuantityIncrementor } from "@/components/composite/quantity-incrementor";
import { ProductDetailsContainer } from "@/components/product-details/product-details-container";
import { CartResponse } from "@/types";
import { useProductDetails } from "@/lib/hooks/use-product-details";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/utils/format";
import { formatPrice } from "@/lib/formatters";

interface CartItemCardProps {
  item: CartResponse;
  onQuantityChange: (cartId: string, newQuantity: number) => Promise<void>;
  onRemove: (cartId: string) => Promise<void>;
  onEditSuccess?: () => void;
  className?: string;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onEditSuccess,
  className,
}: CartItemCardProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isUpdatingQuantity, setIsUpdatingQuantity] = useState(false);

  // Fetch product details using the itemId
  const { data: productDetails, isLoading } = useProductDetails(item.itemId);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item._id);
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdatingQuantity(true);
    try {
      await onQuantityChange(item._id, newQuantity);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    } finally {
      setIsUpdatingQuantity(false);
    }
  };

  // Extract variant info from product details
  const variantInfo = useMemo(() => {
    if (!productDetails) return null;

    const variant = productDetails.variantList.find(
      (v) => v._id === item.variantId
    );

    return variant || null;
  }, [productDetails, item.variantId]);

  // Extract addon info from product details and map to cart item pricing
  // NOTE: item.pricing[].id is a pricing entry ID, NOT an addon ID!
  // We need to look up the pricing entry first to get the actual addon ID and price
  const addonInfo = useMemo(() => {
    if (!productDetails || !item.pricing || item.pricing.length === 0) {
      return [];
    }

    return item.pricing
      .map((pricingItem) => {
        // Find the pricing entry by ID
        const pricingEntry = productDetails.pricing.find(
          (p) => p._id === pricingItem.id
        );

        // Only process addon type pricing entries
        if (!pricingEntry || pricingEntry.type !== "addon") return null;

        // Get the addon details using the addonId from pricing entry
        const addon = productDetails.addonList.find(
          (a) => a._id === pricingEntry.addonId
        );

        if (!addon) return null;

        return {
          label: addon.label,
          quantity: pricingItem.quantity,
          price: pricingEntry.price, // Use price from pricing entry, not addon.price
        };
      })
      .filter(Boolean) as Array<{
      label: string;
      quantity: number;
      price: number;
    }>;
  }, [productDetails, item.pricing]);
  const sVariantsInfo = useMemo(() => {
    if (!productDetails || !item.pricing || item.pricing.length === 0) {
      return [];
    }

    return item.pricing
      .map((pricingItem) => {
        // Find the pricing entry by ID
        const pricingEntry = productDetails.pricing.find(
          (p) => p._id === pricingItem.id
        );

        // Only process addon type pricing entries
        if (!pricingEntry || pricingEntry.type !== "variant") return null;

        // Get the addon details using the addonId from pricing entry
        const addon = productDetails.variantList.find(
          (a) => a._id === pricingEntry.subVariantId
        );

        if (!addon) return null;

        return {
          label: addon.label,
          quantity: pricingItem.quantity,
          price: pricingEntry.price, // Use price from pricing entry, not addon.price
        };
      })
      .filter(Boolean) as Array<{
      label: string;
      quantity: number;
      price: number;
    }>;
  }, [productDetails, item.pricing]);

  // Calculate item price (variant price + addons)
  const itemPrice = useMemo(() => {
    if (!productDetails) return 0;

    const variantPrice = variantInfo?.price || productDetails.product.basePrice;
    const addonsTotal = addonInfo.reduce(
      (sum, addon) => sum + addon.price * addon.quantity,
      0
    );
    const sVariantTotal = sVariantsInfo.reduce(
      (sum, addon) => sum + addon.price * addon.quantity,
      0
    );

    return variantPrice + addonsTotal + sVariantTotal;
  }, [productDetails, variantInfo, addonInfo, sVariantsInfo]);

  // Calculate total price for this cart item
  const itemTotal = itemPrice * item.quantity;

  // Show loading skeleton while fetching product details
  if (isLoading) {
    return <CartItemSkeleton className={className} />;
  }

  // Show error state if product details failed to load
  if (!productDetails) {
    return (
      <div
        className={cn(
          "flex gap-4 rounded-lg border border-destructive/50 bg-card p-4",
          className
        )}
      >
        <div className="flex-1">
          <p className="text-sm text-destructive">
            Failed to load product details
          </p>
        </div>
      </div>
    );
  }

  const product = productDetails.product;

  return (
    <>
      <div
        className={cn(
          "flex flex-col sm:flex-row gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
          className
        )}
      >
        {/* Product Image */}
        <div className="relative h-48 sm:h-24 w-full sm:w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <CustomImage
            src={product.photoList[0] || ""}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base sm:text-base line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center gap-2">
                {variantInfo && (
                  <Badge variant="secondary" className="mt-1.5">
                    {variantInfo.label}
                  </Badge>
                )}
                {sVariantsInfo?.length >= 1 &&
                  sVariantsInfo.map((e) => (
                    <Badge variant="secondary" className="mt-1.5" key={e.label}>
                      {e.label}
                    </Badge>
                  ))}
              </div>
            </div>

            {/* Price - Desktop */}
            <div className="hidden sm:block text-right">
              <p className="font-semibold text-base">
                {formatPrice(itemTotal)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-muted-foreground">
                  {formatPrice(itemPrice)} each
                </p>
              )}
            </div>
          </div>

          {/* Price - Mobile */}
          <div className="sm:hidden flex justify-between items-center">
            <p className="font-semibold text-lg">{formatPrice(itemTotal)}</p>
            {item.quantity > 1 && (
              <p className="text-sm text-muted-foreground">
                {formatPrice(itemPrice)} each
              </p>
            )}
          </div>

          {/* Selected Addons */}
          {addonInfo.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {addonInfo.map((addon, idx) => (
                <span key={idx} className="text-xs text-muted-foreground">
                  {addon.label} x{addon.quantity}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-2">
            <QuantityIncrementor
              value={item.quantity}
              onChange={handleQuantityChange}
              min={1}
              max={99}
              size="sm"
              disabled={isUpdatingQuantity}
            />

            <div className="flex items-center gap-1 sm:gap-1">
              <ProductDetailsContainer
                productId={item.itemId}
                editMode="edit"
                cartItem={item}
                mode="eager"
                onEditSuccess={onEditSuccess}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="min-h-[44px] min-w-[44px] h-11 w-11 sm:h-8 sm:w-8"
                    aria-label="Edit item"
                  >
                    <Edit2 className="h-5 w-5 sm:h-4 sm:w-4" />
                  </Button>
                }
              />

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowRemoveDialog(true)}
                className="min-h-[44px] min-w-[44px] h-11 w-11 sm:h-8 sm:w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Remove item"
              >
                <Trash2 className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {product.name} from your cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              loading={isRemoving}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Loading skeleton component
function CartItemSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 rounded-lg border bg-card p-4 shadow-sm",
        className
      )}
    >
      <Skeleton className="h-48 sm:h-24 w-full sm:w-24 flex-shrink-0 rounded-md" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="hidden sm:block h-5 w-16" />
        </div>
        <Skeleton className="sm:hidden h-5 w-20" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex items-center justify-between gap-2 mt-auto pt-2">
          <Skeleton className="h-10 sm:h-9 w-32" />
          <div className="flex gap-1">
            <Skeleton className="h-11 w-11 sm:h-8 sm:w-8 rounded" />
            <Skeleton className="h-11 w-11 sm:h-8 sm:w-8 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
