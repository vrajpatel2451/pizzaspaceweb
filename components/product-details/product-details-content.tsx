"use client";

import * as React from "react";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductImageSection } from "./sections/product-image-section";
import { ProductInfoSection } from "./sections/product-info-section";
import { VariantGroupsSection } from "./sections/variant-groups-section";
import { AddonGroupsSection } from "./sections/addon-groups-section";
import { ComboGroupsSection } from "./combo/combo-groups-section";
import { StickyActionBar } from "./sections/sticky-action-bar";
import { UnavailableNotice } from "./unavailable-notice";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { useDeliveryType } from "@/store/cart-store";
import type { ProductDetailsContentProps } from "@/types/product-details";
import type { OrderDeliveryType } from "@/types/cart";

export function ProductDetailsContent({
  data,
  isLoading,
  error,
  onClose,
  editMode = "add",
  isProcessing = false,
  deliveryType,
  isProductAvailable = true,
}: ProductDetailsContentProps & {
  editMode?: "add" | "edit";
  isProcessing?: boolean;
  deliveryType?: OrderDeliveryType;
  isProductAvailable?: boolean;
}) {
  const context = useProductDetailsContext();
  const storeDeliveryType = useDeliveryType();

  // Use prop or store delivery type
  const activeDeliveryType = deliveryType || storeDeliveryType;

  // Check if this is a combo product
  const isCombo = data?.product.isCombo ?? false;

  // Get selected primary variant for packaging charges
  const selectedPrimaryVariant = data?.variantList.find(
    (v) => v._id === context.selectedVariantId
  );

  // Calculate display price with packaging for delivery
  // For combos, use comboTotalPrice; for regular products, use totalPrice
  // Packaging charges: use variant's if available, otherwise fall back to product's
  const basePrice = isCombo ? context.comboTotalPrice : context.totalPrice;
  const packagingTotal = activeDeliveryType === "delivery"
    ? (selectedPrimaryVariant?.packagingCharges ?? data?.product.packagingCharges ?? 0) * context.quantity
    : 0;
  const displayTotalPrice = basePrice + packagingTotal;

  // Validation: For combos use isComboValid, for regular products use isValid
  const isProductValid = isCombo ? context.isComboValid : context.isValid;

  // Loading state - only show skeleton when actually loading data (not processing)
  if (isLoading && !data) {
    return <ProductDetailsSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-destructive mb-4">Failed to load product details</p>
        <button
          onClick={onClose}
          className="text-sm text-primary hover:underline"
        >
          Close
        </button>
      </div>
    );
  }

  // No data fallback (should not happen, but defensive)
  if (!data) {
    return <ProductDetailsSkeleton />;
  }

  // Check if product has primary variants (required for showing any selections)
  const primaryGroup = data.variantGroupList.find((g) => g.isPrimary);
  const hasPrimaryVariants = primaryGroup
    ? data.variantList.some((v) => v.groupId === primaryGroup._id)
    : false;

  // Only show variants and addons if primary variants exist
  // If no primary variants, hide all variant selections and addons
  const hasVariants = hasPrimaryVariants && data.variantGroupList.length > 0;
  const hasAddons = hasPrimaryVariants && data.addonGroupList.length > 0;
  const hasComboGroups = isCombo && (data.comboGroups?.length ?? 0) > 0;

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-hide">
        <div className="space-y-3 sm:space-y-5 p-3 sm:p-5 pb-24 sm:pb-28">
          {/* Product Image */}
          <div className="animate-fade-in-up stagger-1 motion-reduce:animate-none">
            <ProductImageSection
              images={data.product.photoList ?? []}
              productName={data.product.name}
              productType={data.product.type}
            />
          </div>

          {/* Product Info */}
          <div className="animate-fade-in-up stagger-2 motion-reduce:animate-none">
            <ProductInfoSection
              product={data.product}
              defaultExpanded={!hasVariants && !hasAddons && !hasComboGroups}
            />
          </div>

          {/* Unavailable Notice - Show when product is not available for delivery type */}
          {!isProductAvailable && deliveryType && (
            <div className="animate-fade-in-up stagger-3 motion-reduce:animate-none">
              <UnavailableNotice
                productName={data.product.name}
                deliveryType={deliveryType}
                availableDeliveryTypes={data.product.availableDeliveryTypes ?? []}
              />
            </div>
          )}

          {/* Combo Groups - Show for combo products instead of variants/addons */}
          {hasComboGroups && (
            <div className="animate-fade-in-up stagger-3 motion-reduce:animate-none">
              <ComboGroupsSection />
            </div>
          )}

          {/* Variant Groups - Only for non-combo products */}
          {!isCombo && hasVariants && (
            <div className="animate-fade-in-up stagger-3 motion-reduce:animate-none">
              <VariantGroupsSection
                variantGroupList={data.variantGroupList}
                variantList={data.variantList}
              />
            </div>
          )}

          {/* Addon Groups - Only for non-combo products */}
          {!isCombo && hasAddons && (
            <div className="animate-fade-in-up stagger-4 motion-reduce:animate-none">
              <AddonGroupsSection
                addonGroupList={data.addonGroupList}
                addonList={data.addonList}
              />
            </div>
          )}
        </div>
      </div>

      {/* Sticky Action Bar */}
      <StickyActionBar
        quantity={context.quantity}
        onQuantityChange={context.setQuantity}
        totalPrice={displayTotalPrice}
        isValid={isProductValid && isProductAvailable}
        validationErrors={context.validationErrors}
        isLoading={isProcessing}
        onAddToCart={context.addToCart}
        editMode={editMode}
      />
    </div>
  );
}
