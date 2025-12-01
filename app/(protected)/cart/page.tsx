"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CartItemList,
  EmptyCart,
  DeliveryTypeSelector,
  AddressSelector,
  OrderSummary,
} from "@/components/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tag } from "lucide-react";
import {
  AddressResponse,
  OrderDeliveryType,
} from "@/types";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useCartSummary as useCartSummaryHook,
} from "@/lib/hooks/use-cart";
import { useCartStore } from "@/store/cart-store";
import { getAddresses } from "@/lib/api/address";

export default function CartPage() {
  const router = useRouter();

  // Address state management
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Cart store state
  const {
    items: cartItems,
    deliveryType,
    selectedAddressId,
    setDeliveryType,
    setSelectedAddress,
  } = useCartStore();

  // Device and store IDs (these should eventually come from global state)
  const [deviceId] = useState(() => {
    if (typeof window !== "undefined") {
      let id = localStorage.getItem("deviceId");
      if (!id) {
        id = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("deviceId", id);
      }
      return id;
    }
    return "";
  });
  const [storeId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedStoreId") || "default-store";
    }
    return "default-store";
  });

  // Cart hooks
  const { isLoading: isLoadingCart, refetch: refetchCart } = useCart(
    deviceId,
    storeId,
    true
  );

  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeCartItem } = useRemoveCartItem();

  // Cart summary hook with auto-refresh
  const { summary, isLoading: isLoadingSummary } = useCartSummaryHook(
    { storeId },
    true,
    300 // 300ms debounce
  );

  // Mock item details (replace with actual API call)
  const itemDetailsMap = cartItems.reduce(
    (acc, item) => {
      acc[item.itemId] = {
        name: `Product ${item.itemId}`,
        image: "",
        variantName: item.variantId ? `Variant ${item.variantId}` : undefined,
        price: 12.99,
      };
      return acc;
    },
    {} as Record<string, { name: string; image?: string; variantName?: string; price: number }>
  );

  // Fetch addresses
  const fetchAddresses = useCallback(async () => {
    setIsLoadingAddresses(true);
    try {
      const response = await getAddresses();
      if (response.statusCode === 200 && response.data) {
        setAddresses(response.data);
        // Auto-select default or first address if none selected
        if (!selectedAddressId) {
          const defaultAddr = response.data.find((addr) => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr._id);
          } else if (response.data.length > 0) {
            setSelectedAddress(response.data[0]._id);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoadingAddresses(false);
    }
  }, [selectedAddressId, setSelectedAddress]);

  // Load addresses when delivery type is delivery
  useEffect(() => {
    if (deliveryType === "delivery" && addresses.length === 0) {
      fetchAddresses();
    }
  }, [deliveryType, addresses.length, fetchAddresses]);

  // Handle quantity change
  const handleQuantityChange = async (cartId: string, newQuantity: number) => {
    const item = cartItems.find((i) => i._id === cartId);
    if (!item) return;

    const result = await updateCartItem(cartId, {
      quantity: newQuantity,
      variantId: item.variantId,
      sessionId: deviceId,
      pricing: item.pricing,
    });

    // Summary will auto-refresh via useCartSummary hook
    if (!result.success) {
      // Error toast already shown by the hook
      console.error("Failed to update quantity:", result.error);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (cartId: string) => {
    const result = await removeCartItem(cartId, deviceId);

    // Summary will auto-refresh via useCartSummary hook
    if (!result.success) {
      // Error toast already shown by the hook
      console.error("Failed to remove item:", result.error);
    }
  };

  // Handle edit success - refetch cart to get updated items
  const handleEditSuccess = () => {
    refetchCart();
    // Summary will auto-refresh via useCartSummary hook
  };

  // Handle delivery type change
  const handleDeliveryTypeChange = (type: OrderDeliveryType) => {
    setDeliveryType(type);
    if (type !== "delivery") {
      setSelectedAddress(null);
    }
    // Summary will auto-refresh via useCartSummary hook
  };

  // Handle add new address
  const handleAddNewAddress = () => {
    router.push("/profile?tab=addresses&action=add");
  };

  // Handle checkout
  const handleCheckout = () => {
    if (deliveryType === "delivery" && !selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    toast.info("Checkout functionality coming soon");
    // router.push("/checkout");
  };

  // Handle browse menu
  const handleBrowseMenu = () => {
    router.push("/menu");
  };

  // Show empty state
  if (!isLoadingCart && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart onBrowseMenu={handleBrowseMenu} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
        <p className="text-muted-foreground">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cart Items & Delivery Options */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Your Items</h2>
            <CartItemList
              items={cartItems}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemoveItem}
              onEditSuccess={handleEditSuccess}
              itemDetailsMap={itemDetailsMap}
              loading={isLoadingCart}
            />
          </div>

          <Separator />

          {/* Discount Section - Placeholder */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Apply Discount</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Have a discount code? Enter it here to save on your order.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter discount code"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button variant="outline" className="whitespace-nowrap">
                Apply
              </Button>
            </div>
          </div>

          <Separator />

          {/* Delivery Type Selector */}
          <div className="rounded-lg border bg-card p-6">
            <DeliveryTypeSelector
              value={deliveryType}
              onChange={handleDeliveryTypeChange}
            />

            {/* Address Selector - Show when delivery is selected */}
            {deliveryType === "delivery" && (
              <>
                <Separator className="my-6" />
                <AddressSelector
                  addresses={addresses}
                  selectedAddressId={selectedAddressId || undefined}
                  onAddressSelect={(id) => setSelectedAddress(id || null)}
                  onAddNewAddress={handleAddNewAddress}
                  loading={isLoadingAddresses}
                />
              </>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary (Sticky) */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <OrderSummary
              summary={summary}
              loading={isLoadingSummary}
              onCheckout={handleCheckout}
              checkoutDisabled={
                deliveryType === "delivery" && !selectedAddressId
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
