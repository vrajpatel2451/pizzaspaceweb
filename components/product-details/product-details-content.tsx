"use client";

import * as React from "react";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductImageSection } from "./sections/product-image-section";
import { ProductInfoSection } from "./sections/product-info-section";
import { VariantGroupsSection } from "./sections/variant-groups-section";
import { AddonGroupsSection } from "./sections/addon-groups-section";
import { StickyActionBar } from "./sections/sticky-action-bar";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { ProductDetailsContentProps } from "@/types/product-details";

export function ProductDetailsContent({
  data,
  isLoading,
  error,
  onClose,
  editMode = "add",
  isProcessing = false,
}: ProductDetailsContentProps & { editMode?: "add" | "edit"; isProcessing?: boolean }) {
  const context = useProductDetailsContext();

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

  // Check if product has variants or addons
  const hasVariants = data.variantGroupList.length > 0;
  const hasAddons = data.addonGroupList.length > 0;

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
              defaultExpanded={!hasVariants && !hasAddons}
            />
          </div>

          {/* Variant Groups */}
          {hasVariants && (
            <div className="animate-fade-in-up stagger-3 motion-reduce:animate-none">
              <VariantGroupsSection
                variantGroupList={data.variantGroupList}
                variantList={data.variantList}
              />
            </div>
          )}

          {/* Addon Groups */}
          {hasAddons && (
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
        totalPrice={context.totalPrice}
        isValid={context.isValid}
        validationErrors={context.validationErrors}
        isLoading={isProcessing}
        onAddToCart={context.addToCart}
        editMode={editMode}
      />
    </div>
  );
}
