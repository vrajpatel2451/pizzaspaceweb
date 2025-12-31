/**
 * USAGE EXAMPLE: Delivery Type Modal Integration
 *
 * This example shows how to integrate the DeliveryTypeModal into your app.
 * Place this in your root layout or main order page.
 */

"use client";

import { DeliveryTypeModal } from "@/components/delivery";
import { useIsDeliveryTypeSelected, useCartStore } from "@/store/cart-store";
import { useRouter, usePathname } from "next/navigation";

// Example 1: Basic Integration (Recommended)
export function OrderPageWithModal() {
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();

  return (
    <div>
      {/* Your main order content */}
      <h1>Your Order</h1>
      <div className="menu-items">
        {/* Menu items here */}
      </div>

      {/* Delivery Type Modal - automatically shows if not selected */}
      <DeliveryTypeModal open={!isDeliveryTypeSelected} />
    </div>
  );
}

// Example 2: With Custom Handler
export function OrderPageWithCustomHandler() {
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();

  const handleModalChange = (open: boolean) => {
    if (!open) {
      console.log("User completed delivery type selection");
      // You can add analytics tracking here
    }
  };

  return (
    <div>
      <h1>Your Order</h1>

      <DeliveryTypeModal
        open={!isDeliveryTypeSelected}
        onOpenChange={handleModalChange}
      />
    </div>
  );
}

// Example 3: Resetting Selection for New Order
export function CartPageWithReset() {
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();
  const { setDeliveryTypeSelected, clearCart } = useCartStore();

  const handleStartNewOrder = () => {
    clearCart(); // Clear cart items
    setDeliveryTypeSelected(false); // Reset delivery type selection
    // This will trigger the modal to appear again
  };

  return (
    <div>
      <button onClick={handleStartNewOrder}>
        Start New Order
      </button>

      <DeliveryTypeModal open={!isDeliveryTypeSelected} />
    </div>
  );
}

// Example 4: App Layout Integration (Global)
export function RootLayout({ children }: { children: React.ReactNode }) {
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();

  return (
    <html>
      <body>
        {/* Your app content */}
        {children}

        {/* Global delivery type modal - appears across all pages */}
        <DeliveryTypeModal open={!isDeliveryTypeSelected} />
      </body>
    </html>
  );
}

// Example 5: Conditional Rendering Based on Route
export function ConditionalModalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();

  // Only show modal on order-related pages
  const shouldShowModal = pathname.startsWith("/order") || pathname.startsWith("/cart");

  return (
    <>
      {children}

      {shouldShowModal && (
        <DeliveryTypeModal open={!isDeliveryTypeSelected} />
      )}
    </>
  );
}

// Example 6: Checking Selection Before Checkout
export function CheckoutButton() {
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();
  const router = useRouter();

  const handleCheckout = () => {
    if (!isDeliveryTypeSelected) {
      alert("Please select a delivery type first");
      return;
    }

    router.push("/checkout");
  };

  return (
    <button onClick={handleCheckout}>
      Proceed to Checkout
    </button>
  );
}
