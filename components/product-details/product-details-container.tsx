"use client";

import * as React from "react";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductDetailsDialog } from "./product-details-dialog";
import { ProductDetailsBottomsheet } from "./product-details-bottomsheet";
import { ProductDetailsProvider } from "@/contexts/product-details-context";
import { useProductDetails } from "@/hooks/use-product-details";
import { useAddToCart } from "@/lib/hooks/use-cart";
import { useDeviceId } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";
import { createAddToCartPayload } from "@/lib/utils/cart-utils";
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

  // Cart integration
  const { mutate: addToCart, isLoading: isAddingToCart } = useAddToCart();
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();

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

  // Handle add to cart from context - Integrate with API
  const handleAddToCart = React.useCallback(
    async (cartData: {
      productId: string;
      selectedVariants: Map<string, string>;
      selectedAddons: Map<string, { selected: boolean; quantity: number }>;
      quantity: number;
      totalPrice: number;
    }) => {
      // Validate prerequisites
      if (!deviceId) {
        toast.error("Session not initialized. Please refresh the page.");
        return;
      }

      if (!selectedStore) {
        toast.error("Please select a store first");
        return;
      }

      if (!data) {
        toast.error("Product data not loaded");
        return;
      }

      // Get the primary variant (required)
      const primaryGroup = data.variantGroupList.find((g) => g.isPrimary);
      const selectedVariantId = primaryGroup
        ? cartData.selectedVariants.get(primaryGroup._id)
        : null;
      const selectedVariant = selectedVariantId
        ? data.variantList.find((v) => v._id === selectedVariantId)
        : null;

      if (!selectedVariant) {
        toast.error("Please select a variant");
        return;
      }

      // Create cart payload
      const payload = createAddToCartPayload({
        productId: data.product._id,
        categoryId: data.product.category,
        storeId: selectedStore._id,
        sessionId: deviceId,
        selectedVariant,
        selectedAddons: cartData.selectedAddons,
        addonList: data.addonList,
        pricing: data.pricing,
        quantity: cartData.quantity,
      });

      if (!payload) {
        toast.error("Invalid cart data");
        return;
      }

      // Call API
      const result = await addToCart(payload);

      if (result.success) {
        // Close modal on success
        handleClose();

        // Call optional callback with CartItem format (for legacy support)
        if (onAddToCart) {
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

          const selectedAddonsList = Array.from(
            cartData.selectedAddons.entries()
          )
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
        }
      }
    },
    [onAddToCart, data, addToCart, deviceId, selectedStore]
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
            isLoading={isLoading || isAddingToCart}
            error={error}
          />
        ) : (
          <ProductDetailsBottomsheet
            isOpen={isOpen}
            onClose={handleClose}
            data={data}
            isLoading={isLoading || isAddingToCart}
            error={error}
          />
        )}
      </ProductDetailsProvider>
    </>
  );
}
