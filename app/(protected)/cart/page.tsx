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
  DiscountSection,
} from "@/components/cart";
import { PaymentMethod } from "@/components/cart/order-summary";
import { AddAddressModal } from "@/components/address";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AddressResponse, OrderDeliveryType } from "@/types";
import { createOrder } from "@/lib/api/order";
import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useCartSummary as useCartSummaryHook,
} from "@/lib/hooks/use-cart";
import { useCartStore } from "@/store/cart-store";
import { useStore } from "@/lib/contexts/store-context";
import { getAddresses } from "@/lib/api/address";
import { useDeviceId } from "@/store/device-store";
import { useCartValidation } from "@/hooks/use-cart-validation";
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";
import { useDeliveryTypeContext } from "@/contexts/delivery-type-context";

// Premium Section Badge Component
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
      {children}
    </span>
  );
}

// Premium Cart Section Header Component
function CartSectionHeader({ itemCount }: { itemCount: number }) {
  return (
    <div className="text-center mb-12 mt-8 sm:mb-16">
      {/* Badge */}
      <div className="mb-4">
        <SectionBadge>Your Cart</SectionBadge>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
        Review Your{" "}
        <span className="text-orange-500 relative">
          Order
          {/* Decorative underline */}
          <svg
            className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>

      {/* Subheadline with item count */}
      <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        {itemCount === 0
          ? "Your cart is empty. Start adding delicious items!"
          : itemCount === 1
          ? "You have 1 item ready for checkout. Review your selection below."
          : `You have ${itemCount} items in your cart. Review your selections below and proceed to checkout when ready.`}
      </p>

      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>
    </div>
  );
}

export default function CartPage() {
  const router = useRouter();

  // Address state management
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Get store context
  const { selectedStore, isLoading: isLoadingStore } = useStore();
  const storeId = selectedStore?._id;

  // Cart store state
  const {
    items: cartItems,
    selectedAddressId,
    selectedDiscountIds,
    setSelectedAddress,
    getCartIds,
    clearCart,
  } = useCartStore();

  // Get delivery type from context
  const { deliveryType, openModal, setDeliveryType } = useDeliveryTypeContext();

  // Cart validation
  const {
    invalidItems,
    hasInvalidItems,
    isCartValid,
    invalidItemCount,
  } = useCartValidation();

  // Device ID - Use centralized store for consistency
  const deviceId = useDeviceId() || "";

  // Cart hooks - only fetch if we have a store selected
  const { isLoading: isLoadingCart, refetch: refetchCart } = useCart(
    deviceId,
    storeId || "",
    !!storeId // Only enable query if storeId exists
  );

  const { mutate: updateCartItem } = useUpdateCartItem();
  const { mutate: removeCartItem } = useRemoveCartItem();

  // Cart summary hook with auto-refresh - only fetch if we have a store selected
  const {
    summary,
    isLoading: isLoadingSummary,
    error: summaryError,
    refetch: refetchSummary,
  } = useCartSummaryHook(
    { storeId: storeId || "" },
    !!storeId, // Only enable auto-refresh if storeId exists
    300 // 300ms debounce
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
    setShowAddAddressModal(true);
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (deliveryType === "delivery" && !selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    if (!storeId) {
      toast.error("Store not selected");
      return;
    }

    const cartIds = getCartIds();
    if (cartIds.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const response = await createOrder({
        cartIds,
        discountIds: selectedDiscountIds,
        addressId: deliveryType === "delivery" ? selectedAddressId || undefined : undefined,
        paymentType: paymentMethod === "cod" ? "cash" : "online",
        deliveryType,
        storeId,
      });

      if (response.statusCode === 201 && response.data) {
        // Clear cart after successful order
        clearCart();

        // Handle payment flow
        if (response.data.openPaymentLink && response.data.paymentUrl) {
          // Redirect to payment gateway
          window.location.href = response.data.paymentUrl;
        } else {
          // Redirect to success page
          router.push(`/order/${response.data.order._id}/success`);
        }
      } else {
        toast.error(response.errorMessage || "Failed to place order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // Handle browse menu
  const handleBrowseMenu = () => {
    router.push("/menu");
  };

  // Handle remove invalid items
  const handleRemoveInvalidItems = async () => {
    if (invalidItems.length === 0) return;

    const itemsToRemove = invalidItems.map((item) => item._id);

    // Remove all invalid items in parallel
    await Promise.all(
      itemsToRemove.map((cartId) => removeCartItem(cartId, deviceId))
    );

    toast.success(
      `Removed ${invalidItemCount} invalid ${invalidItemCount === 1 ? "item" : "items"} from cart`
    );
  };

  // Show error state if no store selected
  if (!isLoadingStore && !storeId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">No Store Selected</h2>
            <p className="text-muted-foreground">
              Please select a store location to view your cart.
            </p>
          </div>
          <Button onClick={() => router.push("/")}>Select Store</Button>
        </div>
      </div>
    );
  }

  // Show loading state while store is being loaded
  if (isLoadingStore) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!isLoadingCart && cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyCart onBrowseMenu={handleBrowseMenu} />
      </div>
    );
  }

  return (
    <section className="relative bg-white dark:bg-slate-950 pt-24 pb-6 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16 overflow-hidden min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient blob */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        {/* Bottom right gradient blob */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        {/* Center accent blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50 dark:bg-orange-500/3 rounded-full blur-3xl opacity-40" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <CartSectionHeader itemCount={cartItems.length} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Cart Items & Delivery Options */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Invalid Items Warning */}
            {hasInvalidItems && (
              <InvalidItemsWarning
                invalidItems={invalidItems.map((item) => ({
                  id: item._id,
                  name: item.productDetails?.product.name || "Unknown Item",
                }))}
                deliveryType={deliveryType}
                onRemoveItems={handleRemoveInvalidItems}
                onChangeDeliveryType={openModal}
              />
            )}

            {/* Cart Items */}
            <div className="space-y-4">
              {/* <h2 className="text-lg sm:text-xl font-semibold">Your Items</h2> */}
              <CartItemList
                items={cartItems}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemoveItem}
                onEditSuccess={handleEditSuccess}
              />
            </div>

            <Separator />

            {/* Discount Section */}
            <DiscountSection />

            <Separator />

            {/* Delivery Type Selector */}
            <div className="rounded-lg border bg-card p-4 sm:p-6">
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
                error={summaryError}
                onRetry={refetchSummary}
                onCheckout={handleCheckout}
                checkoutDisabled={
                  (deliveryType === "delivery" && !selectedAddressId) ||
                  !isCartValid ||
                  hasInvalidItems
                }
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                isPlacingOrder={isPlacingOrder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      <AddAddressModal
        open={showAddAddressModal}
        onOpenChange={setShowAddAddressModal}
        onSuccess={() => {
          fetchAddresses();
          setShowAddAddressModal(false);
          toast.success("Address added successfully!");
        }}
      />
    </section>
  );
}
