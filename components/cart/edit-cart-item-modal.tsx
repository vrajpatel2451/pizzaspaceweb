"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuantityControl } from "./quantity-control";
import { CustomImage } from "@/components/ui/custom-image";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";
import { useProductDetails } from "@/lib/hooks/use-product-details";
import { useUpdateCartItem } from "@/lib/hooks/use-cart";
import {
  CartResponse,
  UpdateCartPayload,
  PricingIdsAndQuantity,
  VariantResponse,
  AddonResponse,
} from "@/types";
import { cn } from "@/lib/utils";

interface EditCartItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CartResponse;
  onSuccess?: () => void;
}

export function EditCartItemModal({
  isOpen,
  onClose,
  item,
  onSuccess,
}: EditCartItemModalProps) {
  const { data: productDetails, isLoading: isLoadingDetails, error: detailsError } = useProductDetails(
    item.itemId,
    isOpen
  );
  const { mutate: updateCartItem, isLoading: isUpdating } = useUpdateCartItem();

  // Form state
  const [selectedVariantId, setSelectedVariantId] = useState(item.variantId);
  const [selectedAddons, setSelectedAddons] = useState<Map<string, number>>(new Map());
  const [quantity, setQuantity] = useState(item.quantity);

  // Initialize form with current item data
  useEffect(() => {
    if (isOpen && item && productDetails) {
      setSelectedVariantId(item.variantId);
      setQuantity(item.quantity);

      // Initialize addons from current cart item
      const addonsMap = new Map<string, number>();
      item.pricing.forEach((p) => {
        const pricingItem = productDetails.pricing.find((pr) => pr._id === p.id);
        if (pricingItem && pricingItem.type === 'addon') {
          addonsMap.set(p.id, p.quantity);
        }
      });
      setSelectedAddons(addonsMap);
    }
  }, [isOpen, item, productDetails]);

  // Calculate pricing
  const calculatedPrice = useMemo(() => {
    if (!productDetails) return 0;

    const { pricing, variantList } = productDetails;

    // Get variant price
    const selectedVariant = variantList.find((v) => v._id === selectedVariantId);
    let total = selectedVariant?.price || 0;

    // Add addon prices
    selectedAddons.forEach((addonQuantity, pricingId) => {
      const pricingItem = pricing.find((p) => p._id === pricingId);
      if (pricingItem) {
        total += pricingItem.price * addonQuantity;
      }
    });

    return total;
  }, [productDetails, selectedVariantId, selectedAddons]);

  const totalPrice = calculatedPrice * quantity;

  // Group variants by variant group - MUST be before early returns
  const variantsByGroup = useMemo(() => {
    if (!productDetails) return new Map<string, VariantResponse[]>();
    const { variantList } = productDetails;
    const grouped = new Map<string, VariantResponse[]>();
    variantList.forEach((variant) => {
      const existing = grouped.get(variant.groupId) || [];
      grouped.set(variant.groupId, [...existing, variant]);
    });
    return grouped;
  }, [productDetails]);

  // Group addons by addon group - MUST be before early returns
  const addonsByGroup = useMemo(() => {
    if (!productDetails) return new Map<string, AddonResponse[]>();
    const { addonList } = productDetails;
    const grouped = new Map<string, AddonResponse[]>();
    addonList.forEach((addon) => {
      const existing = grouped.get(addon.groupId) || [];
      grouped.set(addon.groupId, [...existing, addon]);
    });
    return grouped;
  }, [productDetails]);

  // Handle addon selection
  const handleAddonToggle = (pricingId: string, checked: boolean, _allowMulti: boolean) => {
    setSelectedAddons((prev) => {
      const newMap = new Map(prev);
      if (checked) {
        newMap.set(pricingId, 1);
      } else {
        newMap.delete(pricingId);
      }
      return newMap;
    });
  };

  // Handle addon quantity change
  const handleAddonQuantityChange = async (pricingId: string, newQuantity: number) => {
    setSelectedAddons((prev) => {
      const newMap = new Map(prev);
      if (newQuantity > 0) {
        newMap.set(pricingId, newQuantity);
      } else {
        newMap.delete(pricingId);
      }
      return newMap;
    });
  };

  // Handle save
  const handleSave = async () => {
    if (!productDetails) {
      toast.error("Product details not loaded");
      return;
    }

    // Build pricing array
    const pricing: PricingIdsAndQuantity[] = [];

    // Add variant pricing
    const variantPricing = productDetails.pricing.find(
      (p) => p.type === 'variant' && p.variantId === selectedVariantId
    );
    if (variantPricing) {
      pricing.push({ id: variantPricing._id, quantity: 1 });
    }

    // Add addon pricing
    selectedAddons.forEach((addonQuantity, pricingId) => {
      pricing.push({ id: pricingId, quantity: addonQuantity });
    });

    // Validate pricing
    if (pricing.length === 0) {
      toast.error("Please select at least a variant");
      return;
    }

    const payload: UpdateCartPayload = {
      variantId: selectedVariantId,
      pricing,
      quantity,
      sessionId: item.sessionId,
    };

    const result = await updateCartItem(item._id, payload);

    if (result.success) {
      onSuccess?.();
      onClose();
    }
  };

  // Handle quantity change
  const handleQuantityChange = async (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  // Render loading state
  if (isLoadingDetails) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Item"
        size="md"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Modal>
    );
  }

  // Render error state
  if (detailsError || !productDetails) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Item"
        size="md"
      >
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-center text-muted-foreground">
            {detailsError || "Failed to load product details"}
          </p>
        </div>
      </Modal>
    );
  }

  const { product, variantList, variantGroupList, addonList, addonGroupList, pricing } = productDetails;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Item"
      subtitle={product.name}
      size="lg"
      actions={{
        secondary: {
          label: "Cancel",
          onClick: onClose,
          disabled: isUpdating,
        },
        primary: {
          label: "Save Changes",
          onClick: handleSave,
          loading: isUpdating,
          disabled: isUpdating,
        },
      }}
    >
      <div className="space-y-6">
        {/* Product Header */}
        <div className="flex gap-4 rounded-lg border bg-muted/50 p-4">
          <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-background">
            <CustomImage
              src={product.photoList[0] || ""}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            </div>
            <Badge
              variant={
                product.type === 'veg'
                  ? 'veg'
                  : product.type === 'non_veg'
                  ? 'nonveg'
                  : 'success'
              }
              className="text-xs"
            >
              {product.type === 'veg' ? 'Veg' : product.type === 'non_veg' ? 'Non-Veg' : 'Vegan'}
            </Badge>
          </div>
        </div>

        {/* Variant Selection */}
        {variantGroupList.map((group) => {
          const variants = variantsByGroup.get(group._id) || [];
          if (variants.length === 0) return null;

          return (
            <div key={group._id} className="space-y-3">
              <div>
                <Label className="text-base font-semibold">{group.label}</Label>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                )}
              </div>

              <RadioGroup
                value={selectedVariantId}
                onValueChange={setSelectedVariantId}
                className="space-y-2"
              >
                {variants.map((variant) => (
                  <div
                    key={variant._id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50",
                      selectedVariantId === variant._id && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value={variant._id} id={variant._id} />
                      <Label htmlFor={variant._id} className="cursor-pointer font-normal">
                        {variant.label}
                      </Label>
                    </div>
                    <span className="font-medium text-sm">£{variant.price.toFixed(2)}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        })}

        {/* Addon Selection */}
        {addonGroupList.map((group) => {
          const addons = addonsByGroup.get(group._id) || [];
          if (addons.length === 0) return null;

          return (
            <div key={group._id} className="space-y-3">
              <div>
                <Label className="text-base font-semibold">{group.label}</Label>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-1">{group.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {group.allowMulti
                    ? `Select up to ${group.max} options`
                    : "Select one option"}
                  {group.min > 0 && ` (Minimum: ${group.min})`}
                </p>
              </div>

              <div className="space-y-2">
                {addons.map((addon) => {
                  // Find pricing for this addon
                  const addonPricing = pricing.find(
                    (p) => p.type === 'addon' && p.addonId === addon._id
                  );
                  if (!addonPricing) return null;

                  const isSelected = selectedAddons.has(addonPricing._id);
                  const addonQuantity = selectedAddons.get(addonPricing._id) || 1;

                  return (
                    <div
                      key={addon._id}
                      className={cn(
                        "flex items-center justify-between rounded-lg border p-3 transition-colors",
                        isSelected && "border-primary bg-primary/5"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <Checkbox
                          id={addon._id}
                          checked={isSelected}
                          onCheckedChange={(checked) =>
                            handleAddonToggle(addonPricing._id, checked as boolean, group.allowMulti)
                          }
                        />
                        <Label htmlFor={addon._id} className="cursor-pointer font-normal flex-1">
                          {addon.label}
                        </Label>
                      </div>

                      <div className="flex items-center gap-3">
                        {isSelected && group.allowMulti && (
                          <QuantityControl
                            quantity={addonQuantity}
                            onQuantityChange={(newQty) =>
                              handleAddonQuantityChange(addonPricing._id, newQty)
                            }
                            min={1}
                            max={group.max}
                            className="h-8"
                          />
                        )}
                        <span className="font-medium text-sm min-w-[60px] text-right">
                          £{(addonPricing.price * addonQuantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Quantity Selection */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Quantity</Label>
          <div className="flex items-center gap-4">
            <QuantityControl
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              min={1}
              max={99}
            />
            <span className="text-sm text-muted-foreground">
              £{calculatedPrice.toFixed(2)} per item
            </span>
          </div>
        </div>

        {/* Price Summary */}
        <div className="rounded-lg border bg-muted/50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-base">Total Price</span>
            <span className="font-bold text-xl">£{totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {quantity} x £{calculatedPrice.toFixed(2)}
          </p>
        </div>
      </div>
    </Modal>
  );
}
