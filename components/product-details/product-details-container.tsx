"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductDetailsDialog } from "./product-details-dialog";
import { ProductDetailsBottomsheet } from "./product-details-bottomsheet";
import { ProductDetailsProvider } from "@/contexts/product-details-context";
import { useProductDetails } from "@/hooks/use-product-details";
import type { ProductDetailsContainerProps } from "@/types/product-details";

export function ProductDetailsContainer({
  productId,
  trigger,
  mode = "lazy",
  onAddToCart,
  className,
}: ProductDetailsContainerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Use hook to fetch product details
  const { data, isLoading, error, refetch } = useProductDetails(productId);

  // Fetch data when modal opens (lazy mode)
  React.useEffect(() => {
    if (isOpen && mode === "lazy" && !data) {
      refetch();
    }
  }, [isOpen, mode, data, refetch]);

  // Fetch data immediately (eager mode)
  React.useEffect(() => {
    if (mode === "eager" && !data) {
      refetch();
    }
  }, [mode, data, refetch]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle add to cart from context
  const handleAddToCart = React.useCallback(
    (cartData: {
      productId: string;
      selectedVariants: Map<string, string>;
      selectedAddons: Map<string, { selected: boolean; quantity: number }>;
      quantity: number;
      totalPrice: number;
    }) => {
      if (!onAddToCart || !data) return;

      // Transform context data to CartItem format
      const selectedVariantsList = Array.from(
        cartData.selectedVariants.entries()
      ).map(([groupId, variantId]) => {
        const group = data.variantGroupList.find((g) => g._id === groupId);
        const variant = data.variantList.find((v) => v._id === variantId);
        return {
          groupId,
          groupLabel: group?.label ?? "",
          variantId,
          variantLabel: variant?.label ?? "",
          price: variant?.price ?? 0,
        };
      });

      const selectedAddonsList = Array.from(cartData.selectedAddons.entries())
        .filter(([, sel]) => sel.selected && sel.quantity > 0)
        .map(([addonId, sel]) => {
          const addon = data.addonList.find((a) => a._id === addonId);
          const group = data.addonGroupList.find(
            (g) => g._id === addon?.groupId
          );
          return {
            addonId,
            addonLabel: addon?.label ?? "",
            groupId: addon?.groupId ?? "",
            groupLabel: group?.label ?? "",
            quantity: sel.quantity,
            unitPrice: addon?.price ?? 0,
            totalPrice: (addon?.price ?? 0) * sel.quantity,
          };
        });

      onAddToCart({
        productId: data.product._id,
        productName: data.product.name,
        quantity: cartData.quantity,
        basePrice: data.product.basePrice,
        totalPrice: cartData.totalPrice,
        selectedVariants: selectedVariantsList,
        selectedAddons: selectedAddonsList,
      });
    },
    [onAddToCart, data]
  );

  // Render trigger element
  const triggerElement = trigger ? (
    <div onClick={handleOpen} className={className}>
      {trigger}
    </div>
  ) : null;

  // Render appropriate modal based on viewport
  return (
    <>
      {triggerElement}
      <ProductDetailsProvider initialData={data} onAddToCart={handleAddToCart}>
        {isDesktop ? (
          <ProductDetailsDialog
            isOpen={isOpen}
            onClose={handleClose}
            data={data}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <ProductDetailsBottomsheet
            isOpen={isOpen}
            onClose={handleClose}
            data={data}
            isLoading={isLoading}
            error={error}
          />
        )}
      </ProductDetailsProvider>
    </>
  );
}
