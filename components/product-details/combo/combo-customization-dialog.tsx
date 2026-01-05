"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomImage } from "@/components/ui/custom-image";
import { AddonGroupsSection } from "../sections/addon-groups-section";
import { VariantGroupsSection } from "../sections/variant-groups-section";
import { ProductDetailsProvider, useProductDetailsContext } from "@/contexts/product-details-context";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import type { PricingSelection } from "@/contexts/product-details-context";
import type { PricingIdsAndQuantity } from "@/types/cart";

/**
 * ComboCustomizationDialog - Modal for customizing a selected combo product
 *
 * Opens a full product details view for a specific combo item selection,
 * allowing users to customize variants and addons. Pricing from this
 * customization is saved back to the ComboItemSelection.pricing array.
 *
 * Uses Dialog on desktop and Sheet (bottom drawer) on mobile.
 */
export function ComboCustomizationDialog() {
  const {
    activeCustomizationGroup,
    activeCustomizationIndex,
    customizationProductData,
    isCustomizationLoading,
    comboSelections,
    closeComboCustomization,
    updateComboItemPricing,
  } = useProductDetailsContext();

  // Check if dialog should be open
  const isOpen =
    activeCustomizationGroup !== null && activeCustomizationIndex !== null;

  // Use Sheet on mobile, Dialog on desktop
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Get current selection for initial state
  const currentSelection = React.useMemo(() => {
    if (!activeCustomizationGroup || activeCustomizationIndex === null) {
      return null;
    }
    return comboSelections[activeCustomizationGroup]?.[activeCustomizationIndex] ?? null;
  }, [activeCustomizationGroup, activeCustomizationIndex, comboSelections]);

  // Convert PricingIdsAndQuantity[] to PricingSelection[] for provider
  const initialPricing = React.useMemo((): PricingSelection[] => {
    if (!currentSelection?.pricing) return [];
    return currentSelection.pricing.map((p) => ({
      id: p.id,
      quantity: p.quantity,
    }));
  }, [currentSelection?.pricing]);

  // Handle close
  const handleClose = React.useCallback(() => {
    closeComboCustomization();
  }, [closeComboCustomization]);

  // Handle save - receives pricing from nested provider
  const handleSave = React.useCallback(
    (pricing: PricingSelection[]) => {
      if (activeCustomizationGroup === null || activeCustomizationIndex === null) {
        return;
      }

      // Convert PricingSelection[] to PricingIdsAndQuantity[]
      // We need to get the price from the pricing data
      const pricingWithPrices: PricingIdsAndQuantity[] = pricing.map((p) => {
        // Find the pricing entry to get the price
        const pricingEntry = customizationProductData?.pricing?.find(
          (entry) => entry._id === p.id
        );
        return {
          id: p.id,
          quantity: p.quantity,
          price: pricingEntry?.price ?? 0,
        };
      });

      updateComboItemPricing(
        activeCustomizationGroup,
        activeCustomizationIndex,
        pricingWithPrices
      );
    },
    [
      activeCustomizationGroup,
      activeCustomizationIndex,
      customizationProductData?.pricing,
      updateComboItemPricing,
    ]
  );

  // Loading state
  if (isOpen && isCustomizationLoading) {
    return isMobile ? (
      <Sheet open={true} onOpenChange={handleClose}>
        <SheetContent side="bottom" className="h-[80vh] rounded-t-xl">
          <CustomizationLoadingSkeleton />
        </SheetContent>
      </Sheet>
    ) : (
      <Dialog open={true} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <CustomizationLoadingSkeleton />
        </DialogContent>
      </Dialog>
    );
  }

  // No data or not open
  if (!isOpen || !customizationProductData) {
    return null;
  }

  // Render the actual dialog
  const productName = customizationProductData.product.name;
  const productImage = customizationProductData.product.photoList?.[0];

  // Get the defaultVariantId from the combo selection to pre-select variant
  const defaultVariantId = currentSelection?.variantId || "";

  // Check if product has variants or addons
  const hasVariants = customizationProductData.variantGroupList.length > 0;
  const hasAddons = customizationProductData.addonGroupList.length > 0;

  // Check if there are non-primary variant groups (sub-variants)
  const hasSubVariants = customizationProductData.variantGroupList.some(
    (vg) => !vg.isPrimary
  );

  const DialogContent_ = isMobile ? (
    <Sheet open={true} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl flex flex-col">
        <SheetHeader className="text-left pb-2 border-b">
          <div className="flex items-center gap-3">
            {productImage && (
              <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                <CustomImage
                  src={productImage}
                  alt={productName}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <SheetTitle className="text-base">
                Customize {productName}
              </SheetTitle>
              <SheetDescription className="text-xs">
                Add extras and toppings (optional)
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Nested Provider for customization */}
        <ProductDetailsProvider
          initialData={customizationProductData}
          initialVariantId={defaultVariantId}
          initialPricing={initialPricing}
        >
          <CustomizationContent
            hasVariants={hasVariants}
            hasSubVariants={hasSubVariants}
            hasAddons={hasAddons}
            onSave={handleSave}
            onCancel={handleClose}
            isMobile={true}
          />
        </ProductDetailsProvider>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            {productImage && (
              <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                <CustomImage
                  src={productImage}
                  alt={productName}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <DialogTitle>Customize {productName}</DialogTitle>
              <DialogDescription>
                Add extras and toppings (optional)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Nested Provider for customization */}
        <ProductDetailsProvider
          initialData={customizationProductData}
          initialVariantId={defaultVariantId}
          initialPricing={initialPricing}
        >
          <CustomizationContent
            hasVariants={hasVariants}
            hasSubVariants={hasSubVariants}
            hasAddons={hasAddons}
            onSave={handleSave}
            onCancel={handleClose}
            isMobile={false}
          />
        </ProductDetailsProvider>
      </DialogContent>
    </Dialog>
  );

  return DialogContent_;
}

/**
 * Inner content component that uses nested ProductDetailsProvider context
 */
interface CustomizationContentProps {
  hasVariants: boolean;
  hasSubVariants: boolean;
  hasAddons: boolean;
  onSave: (pricing: PricingSelection[]) => void;
  onCancel: () => void;
  isMobile: boolean;
}

function CustomizationContent({
  hasVariants,
  hasSubVariants,
  hasAddons,
  onSave,
  onCancel,
  isMobile,
}: CustomizationContentProps) {
  const { selectedPricingIds, totalPrice, productData } = useProductDetailsContext();

  // Calculate addon total (excluding variant pricing)
  const addonTotal = React.useMemo(() => {
    if (!productData?.pricing) return 0;

    return selectedPricingIds.reduce((sum, selection) => {
      const pricingEntry = productData.pricing.find((p) => p._id === selection.id);
      if (pricingEntry && pricingEntry.type === "addon") {
        return sum + pricingEntry.price * selection.quantity;
      }
      return sum;
    }, 0);
  }, [selectedPricingIds, productData?.pricing]);

  const handleSave = () => {
    onSave(selectedPricingIds);
  };

  const FooterContent = (
    <>
      {/* Price Summary */}
      {addonTotal > 0 && (
        <div className="flex items-center justify-between px-2 py-2 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">Additional cost:</span>
          <Badge variant="secondary" className="font-semibold">
            +{"\u20B9"}{addonTotal.toFixed(0)}
          </Badge>
        </div>
      )}

      {/* Action Buttons */}
      <div className={cn("flex gap-2", isMobile && "flex-col")}>
        <Button
          variant="outline"
          onClick={onCancel}
          className={cn(isMobile && "order-2")}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} className={cn(isMobile && "order-1")}>
          Save Customization
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
        {/* Sub-Variants (Non-primary variants) */}
        {hasSubVariants && (
          <div>
            <VariantGroupsSection
              variantGroupList={productData?.variantGroupList.filter(
                (vg) => !vg.isPrimary
              )}
              variantList={productData?.variantList}
            />
          </div>
        )}

        {/* Addons */}
        {hasAddons && (
          <AddonGroupsSection
            addonGroupList={productData?.addonGroupList}
            addonList={productData?.addonList}
          />
        )}

        {/* Empty State */}
        {!hasSubVariants && !hasAddons && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No customization options available</p>
            <p className="text-xs mt-1">This item comes as-is</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {isMobile ? (
        <SheetFooter className="border-t pt-4 space-y-3">{FooterContent}</SheetFooter>
      ) : (
        <DialogFooter className="border-t p-6 pt-4 space-y-3 flex-col">
          {FooterContent}
        </DialogFooter>
      )}
    </>
  );
}

/**
 * Loading skeleton for customization dialog
 */
function CustomizationLoadingSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-4">
        <Skeleton className="w-16 h-16 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      <div className="space-y-3 pt-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-16 w-full rounded-lg" />
      </div>
    </div>
  );
}
