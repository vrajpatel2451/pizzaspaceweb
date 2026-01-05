"use client";

import * as React from "react";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ProductDetailsDialog } from "./product-details-dialog";
import { ProductDetailsBottomsheet } from "./product-details-bottomsheet";
import {
  ProductDetailsProvider,
  PricingSelection,
} from "@/contexts/product-details-context";
import { useProductDetails } from "@/hooks/use-product-details";
import { useAddToCart, useUpdateCartItem } from "@/lib/hooks/use-cart";
import { useDeviceId } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";
import { useDeliveryTypeContext } from "@/contexts/delivery-type-context";
import { isProductAvailableForDeliveryType } from "@/lib/utils/price";
import type { ProductDetailsContainerProps } from "@/types/product-details";
import type { AddToCartPayload, UpdateCartPayload, ComboSelection } from "@/types";
import type { FlatComboSelection, ComboGroupSelectionState, ComboItemSelection } from "@/types/combo";

export function ProductDetailsContainer({
  productId,
  trigger,
  mode = "lazy",
  onAddToCart,
  className,
  editMode = "add",
  cartItem,
  onEditSuccess,
}: ProductDetailsContainerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  // Cart integration
  const { mutate: addToCart, isLoading: isAddingToCart } = useAddToCart();
  const { mutate: updateCartItem, isLoading: isUpdatingCart } =
    useUpdateCartItem();
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();

  // Get delivery type context
  const { deliveryType } = useDeliveryTypeContext();

  // Use hook to fetch product details - pass storeId if available
  const { data, isLoading, error, refetch } = useProductDetails(
    productId,
    selectedStore?._id
  );

  // Processing state - defined early for use in handleClose
  const isProcessing = isAddingToCart || isUpdatingCart;

  // Check product availability for current delivery type
  const isProductAvailable =
    !data?.product?.availableDeliveryTypes ||
    isProductAvailableForDeliveryType(
      data.product.availableDeliveryTypes,
      deliveryType
    );

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

  const handleClose = React.useCallback(() => {
    // Prevent closing during add/update operations
    if (isProcessing) {
      return;
    }
    setIsOpen(false);
  }, [isProcessing]);

  // Prepare initial selections for edit mode
  // Now returns variantId and pricing array directly (matching reference code)
  const initialSelections = React.useMemo(() => {
    if (editMode !== "edit" || !cartItem || !data) {
      return { variantId: undefined, pricing: undefined, quantity: 1, comboSelections: undefined };
    }

    // Get variant ID directly from cartItem
    const variantId = cartItem.variantId || undefined;

    // Get pricing array directly from cartItem (already in correct format)
    const pricing: PricingSelection[] =
      cartItem.pricing?.map((p) => ({
        id: p.id,
        quantity: p.quantity,
      })) || [];

    // For combo products, convert cart comboSelections to ComboGroupSelectionState
    let comboSelections: ComboGroupSelectionState | undefined = undefined;
    if (cartItem.isCombo && cartItem.comboSelections && data.comboGroupProducts) {
      comboSelections = {};

      for (const selection of cartItem.comboSelections) {
        // selection.groupId is the ComboGroup.groupId string (e.g., "pizzas")
        const groupId = selection.groupId;

        // Find the combo group by groupId to get its _id
        const comboGroup = data.comboGroups?.find(
          (g) => g.groupId === groupId
        );

        // Find the comboGroupProduct matching both the product and the combo group
        const comboGroupProduct = data.comboGroupProducts.find(
          (cgp) =>
            cgp.productId === selection.productId &&
            cgp.comboGroupId === comboGroup?._id
        );

        if (comboGroupProduct) {
          if (!comboSelections[groupId]) {
            comboSelections[groupId] = [];
          }

          // Create ComboItemSelection from cart data
          const itemSelection: ComboItemSelection = {
            productId: selection.productId,
            comboGroupProductId: comboGroupProduct._id,
            variantId: comboGroupProduct.defaultVariantId || "",
            pricing: selection.pricing || [],
            customized: (selection.pricing?.length ?? 0) > 0,
          };

          comboSelections[groupId].push(itemSelection);
        }
      }
    }

    return {
      variantId,
      pricing: pricing.length > 0 ? pricing : undefined,
      quantity: cartItem.quantity,
      comboSelections,
    };
  }, [editMode, cartItem, data]);

  // Handle add/edit cart from context
  // Now receives the new format: {productId, variantId, pricing, quantity, totalPrice}
  // Combo products also include: {isCombo, comboSelections}
  const handleAddToCart = React.useCallback(
    async (cartData: {
      productId: string;
      variantId: string;
      pricing: PricingSelection[];
      quantity: number;
      totalPrice: number;
      // Combo-specific fields
      isCombo?: boolean;
      comboSelections?: FlatComboSelection[];
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

      // Validate variant selection (only if primary variants exist and NOT a combo)
      // Combo products don't use variants - they use combo groups instead
      if (!cartData.isCombo) {
        const primaryGroup = data.variantGroupList.find((g) => g.isPrimary);
        const hasPrimaryVariants =
          primaryGroup &&
          data.variantList.some((v) => v.groupId === primaryGroup._id);
        if (hasPrimaryVariants && !cartData.variantId) {
          toast.error("Please select a variant");
          return;
        }
      }

      // Handle EDIT mode
      if (editMode === "edit" && cartItem) {
        const updatePayload: UpdateCartPayload = {
          pricing: cartData.pricing,
          quantity: cartData.quantity,
          sessionId: deviceId,
          // Only include variantId if it has a value
          ...(cartData.variantId && { variantId: cartData.variantId }),
        };

        const result = await updateCartItem(
          cartItem._id,
          updatePayload,
          selectedStore._id
        );

        if (result.success) {
          handleClose();
          onEditSuccess?.();
        }
        return;
      }

      // Handle ADD mode (default)
      // Convert FlatComboSelection[] to ComboSelection[] for API
      const comboSelectionsForApi: ComboSelection[] | undefined =
        cartData.isCombo && cartData.comboSelections
          ? cartData.comboSelections.map((s) => ({
              groupId: s.groupId,
              productId: s.productId,
              pricing: s.pricing,
            }))
          : undefined;

      const payload: AddToCartPayload = {
        itemId: data.product._id,
        categoryId: data.product.category,
        storeId: selectedStore._id,
        sessionId: deviceId,
        pricing: cartData.pricing,
        quantity: cartData.quantity,
        // Only include variantId if it has a value (not used for combos)
        ...(cartData.variantId && { variantId: cartData.variantId }),
        // Include combo fields if this is a combo product
        ...(cartData.isCombo && {
          isCombo: true,
          comboSelections: comboSelectionsForApi,
        }),
      };

      // Call API
      const result = await addToCart(payload);

      if (result.success) {
        // Close modal on success
        handleClose();

        // Call optional callback with CartItem format (for legacy support)
        if (onAddToCart) {
          // Handle combo products differently
          if (cartData.isCombo) {
            // For combo products, provide combo-specific information
            onAddToCart({
              productId: data.product._id,
              productName: data.product.name,
              quantity: cartData.quantity,
              basePrice: data.product.basePrice,
              totalPrice: cartData.totalPrice,
              selectedVariants: [],
              selectedAddons: [],
              isCombo: true,
              comboSelections: cartData.comboSelections,
            });
          } else {
            // Regular products: Find variant info for the callback
            const selectedVariant = data.variantList.find(
              (v) => v._id === cartData.variantId
            );
            const primaryGroup = data.variantGroupList.find((g) => g.isPrimary);

            const selectedVariantsList =
              selectedVariant && primaryGroup
                ? [
                    {
                      groupId: primaryGroup._id,
                      groupLabel: primaryGroup.label,
                      variantId: selectedVariant._id,
                      variantLabel: selectedVariant.label,
                      price: selectedVariant.price,
                    },
                  ]
                : [];

            // Build addon list from pricing entries
            const selectedAddonsList = cartData.pricing
              .map((p) => {
                const pricingEntry = data.pricing.find((pr) => pr._id === p.id);
                if (!pricingEntry || pricingEntry.type !== "addon") return null;

                const addon = data.addonList.find(
                  (a) => a._id === pricingEntry.addonId
                );
                const group = data.addonGroupList.find(
                  (g) => g._id === addon?.groupId
                );

                if (!addon) return null;

                return {
                  addonId: addon._id,
                  addonLabel: addon.label,
                  groupId: addon.groupId,
                  groupLabel: group?.label ?? "",
                  quantity: p.quantity,
                  unitPrice: pricingEntry.price,
                  totalPrice: pricingEntry.price * p.quantity,
                };
              })
              .filter((x): x is NonNullable<typeof x> => x !== null);

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
      }
    },
    [
      onAddToCart,
      data,
      addToCart,
      updateCartItem,
      deviceId,
      selectedStore,
      editMode,
      cartItem,
      onEditSuccess,
      handleClose,
    ]
  );

  // Render trigger element
  const triggerElement = trigger ? (
    <div onClick={handleOpen} className={className}>
      {trigger}
    </div>
  ) : null;

  // Add console logging for debugging
  React.useEffect(() => {
    if (isOpen) {
      console.log("ProductDetailsContainer state:", {
        isOpen,
        hasData: !!data,
        isLoading,
        isProcessing,
        error: error?.message,
      });
    }
  }, [isOpen, data, isLoading, isProcessing, error]);

  return (
    <>
      {triggerElement}
      <ProductDetailsProvider
        initialData={data}
        onAddToCart={handleAddToCart}
        initialVariantId={initialSelections.variantId}
        initialPricing={initialSelections.pricing}
        initialQuantity={initialSelections.quantity}
        initialComboSelections={initialSelections.comboSelections}
      >
        {isDesktop ? (
          <ProductDetailsDialog
            isOpen={isOpen}
            onClose={handleClose}
            data={data}
            isLoading={isLoading}
            isProcessing={isProcessing}
            error={error}
            editMode={editMode}
            deliveryType={deliveryType}
            isProductAvailable={isProductAvailable}
          />
        ) : (
          <ProductDetailsBottomsheet
            isOpen={isOpen}
            onClose={handleClose}
            data={data}
            isLoading={isLoading}
            isProcessing={isProcessing}
            error={error}
            editMode={editMode}
            deliveryType={deliveryType}
            isProductAvailable={isProductAvailable}
          />
        )}
      </ProductDetailsProvider>
    </>
  );
}
