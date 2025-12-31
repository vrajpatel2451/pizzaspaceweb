/**
 * Unavailable Notice Component - Usage Examples
 *
 * This file demonstrates various usage scenarios for the UnavailableNotice component.
 * Copy these examples into your product details implementation.
 */

import { UnavailableNotice } from "@/components/product-details/unavailable-notice";

// ============================================================================
// Example 1: Product only available for Delivery
// ============================================================================
export function Example1_DeliveryOnly() {
  return (
    <UnavailableNotice
      productName="Express Burger Combo"
      deliveryType="dineIn"
      availableDeliveryTypes={["delivery"]}
    />
  );
}
// Output: "Express Burger Combo is not available for dine in."
//         "This item is available for Delivery."

// ============================================================================
// Example 2: Product available for Delivery or Pickup (not Dine In)
// ============================================================================
export function Example2_DeliveryAndPickup() {
  return (
    <UnavailableNotice
      productName="Pizza Margherita"
      deliveryType="dineIn"
      availableDeliveryTypes={["delivery", "pickup"]}
    />
  );
}
// Output: "Pizza Margherita is not available for dine in."
//         "This item is available for Delivery or Pickup."

// ============================================================================
// Example 3: Product available for Pickup and Dine In (not Delivery)
// ============================================================================
export function Example3_PickupAndDineIn() {
  return (
    <UnavailableNotice
      productName="Fresh Salad Bar"
      deliveryType="delivery"
      availableDeliveryTypes={["pickup", "dineIn"]}
    />
  );
}
// Output: "Fresh Salad Bar is not available for delivery."
//         "This item is available for Pickup or Dine In."

// ============================================================================
// Example 4: Integration with Product Details Modal
// ============================================================================
export function Example4_ProductDetailsIntegration({ data, currentDeliveryType }) {
  const isAvailable = data.product.availableDeliveryTypes.includes(currentDeliveryType);

  return (
    <div className="space-y-4">
      {/* Product image and basic info */}
      <div className="product-header">
        <h2>{data.product.name}</h2>
        <p>{data.product.description}</p>
      </div>

      {/* Show unavailable notice if product can't be added to cart */}
      {!isAvailable && (
        <UnavailableNotice
          productName={data.product.name}
          deliveryType={currentDeliveryType}
          availableDeliveryTypes={data.product.availableDeliveryTypes}
        />
      )}

      {/* Only show customization options if product is available */}
      {isAvailable && (
        <div className="product-options">
          <VariantSelector />
          <AddonSelector />
          <AddToCartButton />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Example 5: Conditional Rendering Pattern
// ============================================================================
export function Example5_ConditionalRendering() {
  const product = {
    name: "Family Meal Deal",
    availableDeliveryTypes: ["delivery"],
  };
  const userDeliveryType = "pickup";

  const canAddToCart = product.availableDeliveryTypes.includes(userDeliveryType);

  if (!canAddToCart) {
    return (
      <div className="p-4">
        <UnavailableNotice
          productName={product.name}
          deliveryType={userDeliveryType}
          availableDeliveryTypes={product.availableDeliveryTypes}
        />
        <div className="mt-4 text-center">
          <button className="text-primary hover:underline">
            Change to Delivery
          </button>
        </div>
      </div>
    );
  }

  return <AddToCartFlow product={product} />;
}

// ============================================================================
// Example 6: All Three Delivery Types Scenario
// ============================================================================
export function Example6_AllThreeTypes() {
  return (
    <div className="space-y-4 p-4">
      {/* Scenario: User is on Delivery, product only for Pickup and Dine In */}
      <div>
        <h3 className="font-semibold mb-2">Scenario 1: User on Delivery</h3>
        <UnavailableNotice
          productName="Draft Beer Special"
          deliveryType="delivery"
          availableDeliveryTypes={["pickup", "dineIn"]}
        />
      </div>

      {/* Scenario: User is on Pickup, product only for Delivery */}
      <div>
        <h3 className="font-semibold mb-2">Scenario 2: User on Pickup</h3>
        <UnavailableNotice
          productName="Ice Cream Sundae"
          deliveryType="pickup"
          availableDeliveryTypes={["delivery", "dineIn"]}
        />
      </div>

      {/* Scenario: User is on Dine In, product only for Delivery */}
      <div>
        <h3 className="font-semibold mb-2">Scenario 3: User on Dine In</h3>
        <UnavailableNotice
          productName="Party Pack Combo"
          deliveryType="dineIn"
          availableDeliveryTypes={["delivery"]}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Example 7: With React Hook (Real-world usage)
// ============================================================================
export function Example7_WithHook() {
  const { deliveryType } = useCart(); // Assuming you have a cart context
  const { data: product } = useProduct(); // Assuming you have a product hook

  const isProductAvailable = product?.availableDeliveryTypes.includes(deliveryType);

  return (
    <div className="product-details">
      <ProductHeader product={product} />

      {!isProductAvailable && product && (
        <div className="px-4 py-3">
          <UnavailableNotice
            productName={product.name}
            deliveryType={deliveryType}
            availableDeliveryTypes={product.availableDeliveryTypes}
          />
        </div>
      )}

      {isProductAvailable && (
        <>
          <VariantGroupsSection />
          <AddonGroupsSection />
          <StickyActionBar />
        </>
      )}
    </div>
  );
}

// ============================================================================
// Example 8: Early Return Pattern
// ============================================================================
export function Example8_EarlyReturn({ product, deliveryType }) {
  // Check availability early
  const isAvailable = product.availableDeliveryTypes.includes(deliveryType);

  // Early return with unavailable notice
  if (!isAvailable) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <UnavailableNotice
          productName={product.name}
          deliveryType={deliveryType}
          availableDeliveryTypes={product.availableDeliveryTypes}
        />
        <button
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>
    );
  }

  // Render full product details if available
  return <FullProductDetails product={product} />;
}

// ============================================================================
// Example 9: With Animation (Future Enhancement)
// ============================================================================
export function Example9_WithAnimation({ show, product, deliveryType }) {
  return (
    <div
      className={cn(
        "transition-all duration-300 motion-reduce:transition-none",
        show ? "opacity-100 animate-in fade-in slide-in-from-top-4" : "opacity-0 hidden"
      )}
    >
      <UnavailableNotice
        productName={product.name}
        deliveryType={deliveryType}
        availableDeliveryTypes={product.availableDeliveryTypes}
      />
    </div>
  );
}

// ============================================================================
// Helper Functions (for reference)
// ============================================================================

/**
 * Check if a product is available for the current delivery type
 */
export function checkProductAvailability(
  product: ProductResponse,
  deliveryType: OrderDeliveryType
): boolean {
  return product.availableDeliveryTypes.includes(deliveryType);
}

/**
 * Get unavailable products from a list
 */
export function getUnavailableProducts(
  products: ProductResponse[],
  deliveryType: OrderDeliveryType
): ProductResponse[] {
  return products.filter(
    (product) => !product.availableDeliveryTypes.includes(deliveryType)
  );
}

/**
 * Get suggested delivery types for a product
 */
export function getSuggestedDeliveryTypes(
  product: ProductResponse
): OrderDeliveryType[] {
  return product.availableDeliveryTypes;
}
