"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ProductDetailsSkeleton } from "./product-details-skeleton";
import { ProductImageSection } from "./sections/product-image-section";
import { ProductInfoSection } from "./sections/product-info-section";
import { VariantGroupsSection } from "./sections/variant-groups-section";
import { AddonGroupsSection } from "./sections/addon-groups-section";
import { StickyActionBar } from "./sections/sticky-action-bar";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import type { ProductDetailsContentProps } from "@/types/product-details";
import {
  productDetailsContainerVariants,
  productDetailsSectionVariants,
} from "@/lib/animations";

export function ProductDetailsContent({
  data,
  isLoading,
  error,
  onClose,
  editMode = "add",
  isProcessing = false,
}: ProductDetailsContentProps & { editMode?: "add" | "edit"; isProcessing?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const context = useProductDetailsContext();

  // Simplified variants for reduced motion
  const containerVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : productDetailsContainerVariants;

  const sectionVariants = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : productDetailsSectionVariants;

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
        <motion.div
          className="space-y-3 sm:space-y-5 p-3 sm:p-5 pb-24 sm:pb-28"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Product Image */}
          <motion.div variants={sectionVariants}>
            <ProductImageSection
              images={data.product.photoList ?? []}
              productName={data.product.name}
              productType={data.product.type}
            />
          </motion.div>

          {/* Product Info */}
          <motion.div variants={sectionVariants}>
            <ProductInfoSection product={data.product} />
          </motion.div>

          {/* Variant Groups */}
          {hasVariants && (
            <motion.div variants={sectionVariants}>
              <VariantGroupsSection
                variantGroupList={data.variantGroupList}
                variantList={data.variantList}
              />
            </motion.div>
          )}

          {/* Addon Groups */}
          {hasAddons && (
            <motion.div variants={sectionVariants}>
              <AddonGroupsSection
                addonGroupList={data.addonGroupList}
                addonList={data.addonList}
              />
            </motion.div>
          )}
        </motion.div>
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
