/**
 * Price Display Component - Usage Examples
 *
 * This file demonstrates various ways to use the PriceDisplay component
 * in your Next.js application.
 */

import { PriceDisplay, CompactPriceDisplay } from "@/components/product";

// ============================================================================
// Example 1: Basic Usage - Pickup Order
// ============================================================================
export function BasicPickupExample() {
  return (
    <div className="p-4">
      <h3>Margherita Pizza</h3>
      <PriceDisplay
        basePrice={12.50}
        deliveryType="pickup"
      />
    </div>
  );
}

// ============================================================================
// Example 2: Delivery with Packaging Breakdown
// ============================================================================
export function DeliveryWithBreakdownExample() {
  return (
    <div className="p-4">
      <h3>Pepperoni Pizza</h3>
      <PriceDisplay
        basePrice={15.00}
        packagingCharges={0.50}
        deliveryType="delivery"
        showBreakdown
      />
    </div>
  );
}

// ============================================================================
// Example 3: Product Card with Small Size
// ============================================================================
export function ProductCardExample({ product, deliveryType }: {
  product: {
    name: string;
    basePrice: number;
    packagingCharges: number;
  };
  deliveryType: "delivery" | "pickup" | "dineIn";
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <img src="/pizza.jpg" alt={product.name} className="w-full h-48 object-cover rounded" />
      <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
      <PriceDisplay
        basePrice={product.basePrice}
        packagingCharges={product.packagingCharges}
        deliveryType={deliveryType}
        size="sm"
      />
    </div>
  );
}

// ============================================================================
// Example 4: Sticky Action Bar with Large Size
// ============================================================================
export function StickyActionBarExample({
  totalPrice,
  deliveryType,
  onAddToCart,
}: {
  totalPrice: number;
  deliveryType: "delivery" | "pickup" | "dineIn";
  onAddToCart: () => void;
}) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
      <div className="flex items-center justify-between">
        <PriceDisplay
          basePrice={totalPrice}
          deliveryType={deliveryType}
          size="lg"
        />
        <button
          onClick={onAddToCart}
          className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// Example 5: Checkout Item with Breakdown
// ============================================================================
export function CheckoutItemExample({
  item,
  deliveryType,
}: {
  item: {
    name: string;
    quantity: number;
    basePrice: number;
    packagingCharges: number;
  };
  deliveryType: "delivery" | "pickup" | "dineIn";
}) {
  const itemTotal = item.basePrice * item.quantity;
  const packagingTotal = item.packagingCharges * item.quantity;

  return (
    <div className="border-b pb-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{item.name}</h4>
          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
        </div>
        <PriceDisplay
          basePrice={itemTotal}
          packagingCharges={packagingTotal}
          deliveryType={deliveryType}
          showBreakdown
          size="md"
        />
      </div>
    </div>
  );
}

// ============================================================================
// Example 6: Compact Price Display in List
// ============================================================================
export function CompactListExample({ items, deliveryType }: {
  items: Array<{
    id: string;
    name: string;
    basePrice: number;
    packagingCharges: number;
  }>;
  deliveryType: "delivery" | "pickup" | "dineIn";
}) {
  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
          <span className="font-medium">{item.name}</span>
          <CompactPriceDisplay
            basePrice={item.basePrice}
            packagingCharges={item.packagingCharges}
            deliveryType={deliveryType}
          />
        </li>
      ))}
    </ul>
  );
}

// ============================================================================
// Example 7: Dynamic Delivery Type Switching
// ============================================================================
export function DynamicDeliveryExample() {
  const [deliveryType, setDeliveryType] = React.useState<"delivery" | "pickup" | "dineIn">("delivery");
  const basePrice = 18.00;
  const packagingCharges = 0.75;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Premium Pizza</h3>

      {/* Delivery Type Selector */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setDeliveryType("delivery")}
          className={`px-4 py-2 rounded ${deliveryType === "delivery" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
        >
          Delivery
        </button>
        <button
          onClick={() => setDeliveryType("pickup")}
          className={`px-4 py-2 rounded ${deliveryType === "pickup" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
        >
          Pickup
        </button>
        <button
          onClick={() => setDeliveryType("dineIn")}
          className={`px-4 py-2 rounded ${deliveryType === "dineIn" ? "bg-orange-500 text-white" : "bg-gray-200"}`}
        >
          Dine In
        </button>
      </div>

      {/* Price Display with Animation */}
      <PriceDisplay
        basePrice={basePrice}
        packagingCharges={packagingCharges}
        deliveryType={deliveryType}
        showBreakdown
        size="lg"
        animate
      />
    </div>
  );
}

// ============================================================================
// Example 8: Custom Styled Price Display
// ============================================================================
export function CustomStyledExample() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg text-white">
      <h3 className="text-2xl font-bold mb-2">Special Offer!</h3>
      <PriceDisplay
        basePrice={9.99}
        deliveryType="pickup"
        size="lg"
        className="[&>div:first-child]:text-white [&>div:first-child]:drop-shadow-lg"
      />
    </div>
  );
}

// ============================================================================
// Example 9: Disabled Animation for Server Components
// ============================================================================
export function ServerComponentExample({ price }: { price: number }) {
  return (
    <div>
      <PriceDisplay
        basePrice={price}
        deliveryType="dineIn"
        animate={false}
      />
    </div>
  );
}

// ============================================================================
// Example 10: Responsive Grid Layout
// ============================================================================
export function ResponsiveGridExample({ products, deliveryType }: {
  products: Array<{
    id: string;
    name: string;
    image: string;
    basePrice: number;
    packagingCharges: number;
  }>;
  deliveryType: "delivery" | "pickup" | "dineIn";
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-2"
          />
          <h3 className="font-semibold mb-2">{product.name}</h3>
          <PriceDisplay
            basePrice={product.basePrice}
            packagingCharges={product.packagingCharges}
            deliveryType={deliveryType}
            size="sm"
          />
        </div>
      ))}
    </div>
  );
}

// Note: Add React import at the top for useState in Example 7
import React from "react";
