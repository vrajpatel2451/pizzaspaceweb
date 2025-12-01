# Code from existing website

## Dialog

    ``` tsx
    "use client";

import AddToCartSkeleton from "@/components/shared/AddToCartSkeleton";
import QuantityCounter from "@/components/shared/QuantityCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetProductDetails } from "@/lib/hooks/useProduct";
import { useAddToCart, useUpdateCart } from "@/lib/hooks/useCart";
import { useAppSelector } from "@/utils/store/hook";
import { CartResponse, PricingIdsAndQuantity } from "@/types/cart";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface AddToCartPopperProps {
id: string;
cartItem?: CartResponse;
onClose?: () => void;
}

export default function AddToCartPopper({
id,
cartItem,
onClose,
}: AddToCartPopperProps) {
const isEditMode = !!cartItem;
const [quantity, setQuantity] = useState(cartItem?.quantity || 1);
const [selectedPricingIds, setSelectedPricingIds] = useState<
PricingIdsAndQuantity[]

> (cartItem?.pricing || []);
> const [selectedVariantId, setSelectedVariantId] = useState(

    cartItem?.variantId || ""

);

const { data, isLoading, isError } = useGetProductDetails(id);
const { storeId } = useAppSelector((state) => state.store);
const addToCartMutation = useAddToCart();
const updateCartMutation = useUpdateCart();

const productDetails = data?.product;
const variantList = useMemo(
() => data?.variantList || [],
[data?.variantList]
);
const variantGroupList = useMemo(
() => data?.variantGroupList || [],
[data?.variantGroupList]
);
const pricing = useMemo(() => data?.pricing || [], [data?.pricing]);
const addonGroupList = useMemo(
() => data?.addonGroupList || [],
[data?.addonGroupList]
);
const addonList = useMemo(() => data?.addonList || [], [data?.addonList]);

const primaryGroups = variantGroupList.filter((g: any) => g.isPrimary);
const subGroups = variantGroupList.filter((g: any) => !g.isPrimary);

const findVariantPricing = (primaryId: string, subId: string) =>
pricing.find(
(p: any) =>
p.type === "variant" &&
p.variantId === primaryId &&
p.subVariantId === subId
);

const findAddonPricing = (variantId: string, addonId: string) =>
pricing.find(
(p: any) =>
p.type === "addon" && p.variantId === variantId && p.addonId === addonId
);

const handleSelectPrimary = (variantId: string) => {
if (selectedVariantId !== variantId) {
setSelectedPricingIds((prev) =>
prev.filter((p) => {
const entry = pricing.find((x: any) => x.\_id === p.id);
return entry?.type !== "variant";
})
);
}
setSelectedVariantId(variantId);
};

const handleSelectSubVariant = (subVariantId: string) => {
const p = findVariantPricing(selectedVariantId, subVariantId);
if (!p) {
setSelectedPricingIds((prev) =>
prev.filter((x) => {
const entry = pricing.find((e: any) => e.\_id === x.id);
return !(
entry?.type === "variant" && entry.variantId === selectedVariantId
);
})
);
return;
}

    setSelectedPricingIds((prev) => {
      const exists = prev.find((x) => x.id === p._id);
      if (exists) return prev;

      const remove = pricing
        .filter(
          (e: any) => e.type === "variant" && e.variantId === selectedVariantId
        )
        .map((e: any) => e._id);

      return [
        ...prev.filter((x) => !remove.includes(x.id)),
        { id: p._id, quantity: 1 },
      ];
    });

};

const toggleAddon = (pricingId: string, qty = 1) => {
setSelectedPricingIds((prev) => {
const exists = prev.find((p) => p.id === pricingId);

      if (exists) {
        if (qty === 0) return prev.filter((p) => p.id !== pricingId);

        return prev.map((p) =>
          p.id === pricingId ? { ...p, quantity: qty } : p
        );
      }

      return [...prev, { id: pricingId, quantity: qty }];
    });

};

const amount = useMemo(() => {
const extra = pricing
.map((pr: any) => {
const entry = selectedPricingIds.find((x) => x.id === pr.\_id);
if (!entry) return 0;
return pr.type === "addon" ? pr.price \* entry.quantity : pr.price;
})
.reduce((a, b) => a + b, 0);

    const primaryVariant = variantList.find(
      (v: any) => v._id === selectedVariantId
    );
    const base = primaryVariant
      ? primaryVariant.price
      : productDetails?.basePrice;

    return (base + extra) * quantity;

}, [
quantity,
selectedVariantId,
selectedPricingIds,
pricing,
variantList,
productDetails,
]);

const handleAddToCart = () => {
if (!productDetails) return;

    // Validate required fields
    if (!selectedVariantId) {
      toast.error("Please select a variant");
      return;
    }

    if (!storeId) {
      toast.error("Please select a store first");
      return;
    }

    if (isEditMode && cartItem) {
      // Update existing cart item
      updateCartMutation.mutate(
        {
          id: cartItem._id,
          data: {
            quantity,
            variantId: selectedVariantId,
            pricing: selectedPricingIds,
          },
        },
        {
          onSuccess: () => {
            toast.success("Cart updated successfully");
            onClose?.();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Failed to update cart";
            toast.error(errorMessage);
          },
        }
      );
    } else {
      // Add new item to cart
      addToCartMutation.mutate(
        {
          itemId: productDetails._id,
          categoryId: productDetails.category,
          quantity,
          variantId: selectedVariantId,
          pricing: selectedPricingIds,
          storeId,
        },
        {
          onSuccess: () => {
            toast.success("Item added to cart");
            // Reset form or close modal
            setQuantity(1);
            setSelectedPricingIds([]);
            setSelectedVariantId("");
            onClose?.();
          },
          onError: (error: any) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Failed to add to cart";
            toast.error(errorMessage);
          },
        }
      );
    }

};

if (isLoading) return <AddToCartSkeleton />;
if (isError || !productDetails)
return (
<Card className="w-full p-6 text-center">
<p className="text-gray-600">Failed to load product.</p>
</Card>
);

const photo = productDetails.photoList?.[0];
const imageSrc = photo
? `${process.env.NEXT_PUBLIC_APPLICATION_IMAGE_URL}/${photo}`
: "/placeholder.svg";

return (
<Card className="w-full max-h-[90vh] overflow-hidden border-0 shadow-2xl bg-white p-0">
<CardContent className="p-0 flex flex-col max-h-[90vh]">
{/_ FIXED HEADER _/}
<div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 flex-shrink-0">
<h2 className="text-lg font-bold">Customize Order</h2>
<p className="text-sm text-orange-100">Make it perfect for you</p>
</div>

        {/* FIXED PRODUCT INFO */}
        <div className="p-4 border-b bg-white flex-shrink-0">
          <div className="flex space-x-4">
            <Image
              src={imageSrc}
              height={80}
              width={80}
              alt="product"
              className="rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate">
                {productDetails.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {productDetails.description}
              </p>
              <div className="text-orange-600 font-semibold mt-1">
                £{productDetails.basePrice}
              </div>
            </div>
          </div>
        </div>

        {/* SCROLLABLE CUSTOMIZATIONS */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* PRIMARY VARIANTS */}
          {primaryGroups.map((group: any) => (
            <div key={group._id} className="space-y-2">
              <h3 className="text-gray-900 font-semibold text-sm">
                {group.label}
              </h3>

              <RadioGroup
                value={selectedVariantId}
                onValueChange={handleSelectPrimary}
                className="grid gap-2"
              >
                {variantList
                  .filter((v: any) => v.groupId === group._id)
                  .map((v: any) => (
                    <label
                      key={v._id}
                      htmlFor={v._id}
                      className="flex items-center justify-between border border-gray-200 p-2.5 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
                    >
                      <div className="flex items-center space-x-2.5">
                        <RadioGroupItem
                          value={v._id}
                          id={v._id}
                          className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                        />
                        <span className="text-sm font-medium">{v.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        £{v.price}
                      </span>
                    </label>
                  ))}
              </RadioGroup>
            </div>
          ))}

          {/* SUB VARIANTS */}
          {subGroups.map((group: any) => (
            <div key={group._id} className="space-y-2">
              <h3 className="text-gray-900 font-semibold text-sm">
                {group.label}
              </h3>

              <RadioGroup
                value={
                  pricing.find(
                    (p: any) =>
                      p.type === "variant" &&
                      p.variantId === selectedVariantId &&
                      selectedPricingIds.find((x) => x.id === p._id)
                  )?.subVariantId || ""
                }
                onValueChange={handleSelectSubVariant}
                className="grid gap-2"
              >
                {variantList
                  .filter((v: any) => v.groupId === group._id)
                  .map((v: any) => {
                    const p = findVariantPricing(selectedVariantId, v._id);

                    return (
                      <label
                        key={v._id}
                        htmlFor={v._id}
                        className="flex items-center justify-between border border-gray-200 p-2.5 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50/50 transition-all has-[:checked]:border-orange-500 has-[:checked]:bg-orange-50"
                      >
                        <div className="flex items-center space-x-2.5">
                          <RadioGroupItem
                            value={v._id}
                            id={v._id}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <span className="text-sm font-medium">{v.label}</span>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">
                          +£{p?.price ?? 0}
                        </span>
                      </label>
                    );
                  })}
              </RadioGroup>
            </div>
          ))}

          {/* ADDON GROUPS */}
          {addonGroupList
            .filter((group: any) =>
              pricing.some(
                (p: any) =>
                  p.type === "addonGroup" &&
                  p.variantId === selectedVariantId &&
                  p.addonGroupId === group._id &&
                  p.isVisible
              )
            )
            .map((group: any) => (
              <div key={group._id} className="space-y-2">
                <h3 className="text-gray-900 font-semibold text-sm">
                  {group.label}
                </h3>

                <div className="grid gap-2">
                  {addonList
                    .filter((a: any) => a.groupId === group._id)
                    .map((a: any) => {
                      const pr = findAddonPricing(selectedVariantId, a._id);
                      if (!pr?.isVisible) return null;

                      const selected = selectedPricingIds.find(
                        (x) => x.id === pr._id
                      );
                      const isChecked = !!selected;

                      return (
                        <div
                          key={a._id}
                          className={`flex items-center justify-between border p-2.5 rounded-lg transition-all ${
                            isChecked
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200 bg-white hover:border-orange-400 hover:bg-orange-50/50"
                          }`}
                        >
                          {!group.allowMulti ? (
                            // Simple checkbox for single quantity addons
                            <>
                              <label
                                htmlFor={`addon-${a._id}`}
                                className="flex items-center gap-2.5 flex-1 cursor-pointer"
                              >
                                <Checkbox
                                  id={`addon-${a._id}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      toggleAddon(pr._id, 1);
                                    } else {
                                      toggleAddon(pr._id, 0);
                                    }
                                  }}
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <span className="text-sm font-medium">
                                  {a.label}
                                </span>
                              </label>
                              <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                                +£{pr.price}
                              </span>
                            </>
                          ) : (
                            // Checkbox with quantity counter for multi-quantity addons
                            <>
                              <label
                                htmlFor={`addon-${a._id}`}
                                className="flex items-center gap-2.5 flex-1 cursor-pointer min-w-0"
                              >
                                <Checkbox
                                  id={`addon-${a._id}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      toggleAddon(pr._id, 1);
                                    } else {
                                      toggleAddon(pr._id, 0);
                                    }
                                  }}
                                  className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <span className="text-sm font-medium truncate">
                                  {a.label}
                                </span>
                              </label>

                              <div className="flex items-center gap-2.5 flex-shrink-0">
                                {isChecked && (
                                  <QuantityCounter
                                    min={1}
                                    value={selected?.quantity || 1}
                                    onChange={(q) => toggleAddon(pr._id, q)}
                                    size="sm"
                                  />
                                )}
                                <span className="text-sm font-semibold text-orange-600 whitespace-nowrap min-w-[3.5rem] text-right">
                                  +£{pr.price}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
        </div>

        {/* FIXED FOOTER */}
        <div className="border-t p-3 bg-white flex-shrink-0">
          <div className="flex items-center gap-3 w-full">
            <div className="w-auto">
              <QuantityCounter
                min={1}
                value={quantity}
                onChange={setQuantity}
              />
            </div>
            <div className="flex-1">
              <Button
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white flex items-center justify-center h-10"
                onClick={handleAddToCart}
                disabled={
                  addToCartMutation.isPending || updateCartMutation.isPending
                }
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {addToCartMutation.isPending || updateCartMutation.isPending
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                  ? `Update Cart • £${amount.toFixed(2)}`
                  : `Add to Cart • £${amount.toFixed(2)}`}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

);
}
```
