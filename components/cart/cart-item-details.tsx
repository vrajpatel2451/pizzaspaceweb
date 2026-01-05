"use client";

import { Package } from "lucide-react";
import { CustomImage } from "@/components/ui/custom-image";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProductDetailsResponse, CartResponse } from "@/types";
import { formatNumber } from "@/lib/utils/format";

interface CartItemDetailsProps {
  item: CartResponse;
  productDetails: ProductDetailsResponse | null;
  className?: string;
}

export function CartItemDetails({
  item,
  productDetails,
  className,
}: CartItemDetailsProps) {
  if (!productDetails) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        <div className="h-3 w-24 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  const { product, variantList, pricing } = productDetails;

  // Find selected variant
  const selectedVariant = variantList.find((v) => v._id === item.variantId);

  // Get selected addons from pricing (for regular products)
  const selectedAddons = item.pricing
    .map((p) => {
      const pricingItem = pricing.find((pr) => pr._id === p.id);
      if (pricingItem && pricingItem.type === "addon") {
        return {
          id: p.id,
          quantity: p.quantity,
          pricingItem,
        };
      }
      return null;
    })
    .filter(Boolean);

  // Get combo selections info (for combo products)
  const comboSelectionsInfo = item.isCombo && item.comboSelections
    ? item.comboSelections.map((selection) => {
        // Find the combo group for this selection
        const comboGroup = productDetails.comboGroups?.find(
          (g) => g.groupId === selection.groupId
        );

        // Find the combo group product to get product details
        const comboGroupProduct = productDetails.comboGroupProducts?.find(
          (cgp) => cgp.productId === selection.productId
        );

        // Get product name from the embedded product data
        const productName = comboGroupProduct?.product?.name ?? "Selected Item";

        // Calculate extras total for this selection
        const extrasTotal = selection.pricing?.reduce(
          (sum, p) => sum + (p.price ?? 0) * p.quantity,
          0
        ) ?? 0;

        return {
          groupId: selection.groupId,
          groupLabel: comboGroup?.label ?? "Item",
          productId: selection.productId,
          productName,
          extrasTotal,
          pricing: selection.pricing ?? [],
        };
      })
    : [];

  // Calculate unit price from pricing
  const unitPrice = item.isCombo
    ? // For combos: base price + combo extras
      product.basePrice + comboSelectionsInfo.reduce((sum, s) => sum + s.extrasTotal, 0)
    : // For regular products: sum of pricing entries
      pricing
        .filter((p) => item.pricing.some((ip) => ip.id === p._id))
        .reduce((sum, p) => {
          const itemPricing = item.pricing.find((ip) => ip.id === p._id);
          return sum + p.price * (itemPricing?.quantity || 1);
        }, 0);

  const totalPrice = unitPrice * item.quantity;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Product Header */}
      <div className="flex gap-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <CustomImage
            src={product.photoList[0] || ""}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex-1 space-y-1">
          <h3 className="font-semibold text-base line-clamp-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center gap-2">
            {item.isCombo && (
              <Badge variant="outline" className="text-xs gap-1">
                <Package className="h-3 w-3" />
                Combo
              </Badge>
            )}
            <Badge
              variant={
                product.type === "veg"
                  ? "veg"
                  : product.type === "non_veg"
                  ? "nonveg"
                  : "success"
              }
              className="text-xs"
            >
              {product.type === "veg"
                ? "Veg"
                : product.type === "non_veg"
                ? "Non-Veg"
                : "Vegan"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Selected Variant (for regular products only) */}
      {!item.isCombo && selectedVariant && (
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            Selected Variant
          </p>
          <div className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2">
            <span className="text-sm">{selectedVariant.label}</span>
            <span className="text-sm font-medium">
              {formatNumber(selectedVariant?.price || 0)}
            </span>
          </div>
        </div>
      )}

      {/* Selected Addons (for regular products only) */}
      {!item.isCombo && selectedAddons.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Selected Addons</p>
          <div className="space-y-1">
            {selectedAddons.map((addon) => (
              <div
                key={addon!.id}
                className="flex items-center justify-between rounded-md border bg-muted/50 px-3 py-2"
              >
                <span className="text-sm">
                  {addon!.pricingItem.addonId || "Addon"}{" "}
                  {addon!.quantity > 1 && `x${addon!.quantity}`}
                </span>
                <span className="text-sm font-medium">
                  {formatNumber(addon!.pricingItem.price * addon!.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Combo Selections (for combo products only) */}
      {item.isCombo && comboSelectionsInfo.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Combo Items</p>
          <div className="space-y-2">
            {comboSelectionsInfo.map((selection, idx) => (
              <div
                key={`${selection.groupId}-${selection.productId}-${idx}`}
                className="rounded-md border bg-muted/50 px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-muted-foreground">
                      {selection.groupLabel}
                    </span>
                    <p className="text-sm font-medium">{selection.productName}</p>
                  </div>
                  {selection.extrasTotal > 0 && (
                    <span className="text-sm font-medium text-primary">
                      +{formatNumber(selection.extrasTotal)}
                    </span>
                  )}
                </div>
                {selection.pricing.length > 0 && (
                  <div className="mt-1 pt-1 border-t border-dashed">
                    <span className="text-xs text-muted-foreground">
                      +{selection.pricing.length} customization{selection.pricing.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Summary */}
      <div className="space-y-1 border-t pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Unit Price</span>
          <span className="font-medium">{formatNumber(unitPrice)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Quantity</span>
          <span className="font-medium">{item.quantity}</span>
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <span className="font-semibold">Total</span>
          <span className="font-semibold text-lg">
            {formatNumber(totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}
