/**
 * Invalid Items Warning - Usage Examples
 *
 * This file demonstrates various usage patterns for the InvalidItemsWarning component.
 * Copy these examples into your cart/checkout pages as needed.
 */

import { useState } from "react";
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";
import { OrderDeliveryType } from "@/types/cart";

// ============================================================================
// Example 1: Basic Usage
// ============================================================================

export function BasicExample() {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("delivery");

  const invalidItems = [
    { id: "item-1", name: "Dine-In Special Pizza" },
    { id: "item-2", name: "Restaurant Exclusive Burger" },
  ];

  const handleRemoveItems = () => {
    console.log("Removing invalid items from cart");
    // Implement cart removal logic
  };

  const handleChangeDeliveryType = () => {
    console.log("Opening delivery type selector");
    // Navigate to delivery type selector or open modal
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold">Cart Summary</h2>

      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType={deliveryType}
        onRemoveItems={handleRemoveItems}
        onChangeDeliveryType={handleChangeDeliveryType}
      />

      {/* Rest of cart UI */}
    </div>
  );
}

// ============================================================================
// Example 2: With Conditional Rendering
// ============================================================================

export function ConditionalRenderingExample() {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("pickup");
  const [cartItems, setCartItems] = useState([
    { id: "1", name: "Pizza", availableFor: ["dineIn", "pickup", "delivery"] },
    { id: "2", name: "Dine-In Special", availableFor: ["dineIn"] },
    { id: "3", name: "Burger", availableFor: ["pickup", "delivery"] },
  ]);

  // Filter invalid items based on current delivery type
  const invalidItems = cartItems
    .filter((item) => !item.availableFor.includes(deliveryType))
    .map((item) => ({ id: item.id, name: item.name }));

  const removeInvalidItems = () => {
    setCartItems((prev) =>
      prev.filter((item) => item.availableFor.includes(deliveryType))
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* Only show warning if there are invalid items */}
      {invalidItems.length > 0 && (
        <InvalidItemsWarning
          invalidItems={invalidItems}
          deliveryType={deliveryType}
          onRemoveItems={removeInvalidItems}
          onChangeDeliveryType={() => console.log("Change delivery type")}
        />
      )}

      <div className="bg-card rounded-lg p-4">
        <h3 className="font-semibold mb-2">Valid Items: {cartItems.length - invalidItems.length}</h3>
        <p className="text-sm text-muted-foreground">
          Current delivery type: {deliveryType}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Example 3: Collapsible with Many Items
// ============================================================================

export function ManyItemsExample() {
  const invalidItems = [
    { id: "1", name: "Dine-In Special Pizza" },
    { id: "2", name: "Restaurant Exclusive Burger" },
    { id: "3", name: "Chef's Table Pasta" },
    { id: "4", name: "Signature Steak" },
    { id: "5", name: "Premium Wine Selection" },
    { id: "6", name: "Dessert Platter" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType="delivery"
        onRemoveItems={() => console.log("Remove all 6 items")}
        onChangeDeliveryType={() => console.log("Change to dine-in")}
      />

      <p className="mt-4 text-sm text-muted-foreground">
        Note: First 3 items shown, click "Show 3 more items" to expand
      </p>
    </div>
  );
}

// ============================================================================
// Example 4: Integration with Cart Context
// ============================================================================

interface CartContextType {
  deliveryType: OrderDeliveryType;
  invalidItemsForDeliveryType: Array<{ id: string; name: string }>;
  removeInvalidItems: () => void;
  setShowDeliverySelector: (show: boolean) => void;
}

// Mock hook for demonstration
const useCart = (): CartContextType => ({
  deliveryType: "delivery",
  invalidItemsForDeliveryType: [
    { id: "1", name: "Dine-In Special" },
  ],
  removeInvalidItems: () => console.log("Removing invalid items"),
  setShowDeliverySelector: (show) => console.log("Show delivery selector:", show),
});

export function CartContextExample() {
  const {
    deliveryType,
    invalidItemsForDeliveryType,
    removeInvalidItems,
    setShowDeliverySelector,
  } = useCart();

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Checkout</h2>

      <InvalidItemsWarning
        invalidItems={invalidItemsForDeliveryType}
        deliveryType={deliveryType}
        onRemoveItems={removeInvalidItems}
        onChangeDeliveryType={() => setShowDeliverySelector(true)}
      />

      {/* Rest of checkout UI */}
      <div className="bg-card rounded-lg p-4">
        <h3 className="font-semibold">Order Summary</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Your order for {deliveryType}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Single Action (Remove Only)
// ============================================================================

export function RemoveOnlyExample() {
  const invalidItems = [
    { id: "1", name: "Out of Stock Item" },
  ];

  const handleRemove = () => {
    console.log("Removing item from cart");
    // Implement removal logic
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType="pickup"
        onRemoveItems={handleRemove}
        // No onChangeDeliveryType - only show remove button
      />
    </div>
  );
}

// ============================================================================
// Example 6: Single Action (Change Type Only)
// ============================================================================

export function ChangeTypeOnlyExample() {
  const invalidItems = [
    { id: "1", name: "Dine-In Exclusive" },
    { id: "2", name: "Restaurant Special" },
  ];

  const handleChangeType = () => {
    console.log("Opening delivery type selector");
    // Navigate to delivery type page
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType="delivery"
        onChangeDeliveryType={handleChangeType}
        // No onRemoveItems - only show change type button
      />
    </div>
  );
}

// ============================================================================
// Example 7: With Custom Styling
// ============================================================================

export function CustomStyledExample() {
  const invalidItems = [
    { id: "1", name: "Test Item" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType="dineIn"
        onRemoveItems={() => console.log("Remove")}
        onChangeDeliveryType={() => console.log("Change")}
        className="shadow-lg rounded-2xl border-2"
      />
    </div>
  );
}

// ============================================================================
// Example 8: Page-Level Integration
// ============================================================================

export function CheckoutPageExample() {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("delivery");
  const [showDeliverySelector, setShowDeliverySelector] = useState(false);

  // Mock data
  const cartItems = [
    { id: "1", name: "Pizza", availableFor: ["pickup", "delivery"] },
    { id: "2", name: "Dine-In Special", availableFor: ["dineIn"] },
  ];

  const invalidItems = cartItems
    .filter((item) => !item.availableFor.includes(deliveryType))
    .map((item) => ({ id: item.id, name: item.name }));

  const removeInvalidItems = () => {
    console.log("Removing invalid items");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <h1 className="text-2xl font-bold">Checkout</h1>

        {/* Show warning at the top of checkout */}
        <InvalidItemsWarning
          invalidItems={invalidItems}
          deliveryType={deliveryType}
          onRemoveItems={removeInvalidItems}
          onChangeDeliveryType={() => setShowDeliverySelector(true)}
          className="mb-6"
        />

        {/* Delivery Type Selector */}
        {showDeliverySelector && (
          <div className="bg-card border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Select Delivery Type</h3>
            <div className="flex gap-2">
              {(["dineIn", "pickup", "delivery"] as OrderDeliveryType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setDeliveryType(type);
                    setShowDeliverySelector(false);
                  }}
                  className="px-4 py-2 rounded border hover:bg-accent"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Your Items</h3>
          <div className="space-y-2">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="p-2 rounded border flex justify-between items-center"
              >
                <span>{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {item.availableFor.join(", ")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <p className="text-sm text-muted-foreground">
            Delivery Type: <span className="font-medium text-foreground">{deliveryType}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Valid Items: <span className="font-medium text-foreground">
              {cartItems.length - invalidItems.length}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
