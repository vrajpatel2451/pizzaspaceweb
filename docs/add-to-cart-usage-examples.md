# Add to Cart Usage Examples

Quick reference guide for using the Add to Cart functionality in different scenarios.

## Table of Contents

1. [Basic Product Card (with modal)](#basic-product-card-with-modal)
2. [Quick Add Button (simple products)](#quick-add-button-simple-products)
3. [Custom Add to Cart Implementation](#custom-add-to-cart-implementation)
4. [Handling Cart Callbacks](#handling-cart-callbacks)
5. [Error Handling](#error-handling)

---

## Basic Product Card (with modal)

### Simple Usage (Recommended)

The ProductCard component now has built-in cart integration via ProductDetailsContainer.

```typescript
import { ProductCard } from "@/components/home/menu-section/product-card";
import { ProductResponse } from "@/types";

function ProductList({ products }: { products: ProductResponse[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product, index) => (
        <ProductCard
          key={product._id}
          product={product}
          index={index}
          priority={index < 6}
        />
      ))}
    </div>
  );
}
```

**That's it!** The card will:
1. Open product details modal on click
2. Allow variant/addon selection
3. Validate selections
4. Add to cart via API
5. Show toast notifications
6. Close modal on success

---

## Quick Add Button (simple products)

For products that don't require variant/addon selection, use QuickAddButton.

### Prerequisites

You need to fetch the product's primary variant and pricing data first:

```typescript
import { useProductDetails } from "@/hooks/use-product-details";

function SimpleProductCard({ productId }: { productId: string }) {
  const { data, isLoading } = useProductDetails(productId);

  if (isLoading || !data) return <div>Loading...</div>;

  // Get primary variant
  const primaryGroup = data.variantGroupList.find((g) => g.isPrimary);
  const primaryVariant = primaryGroup
    ? data.variantList.find((v) => v.groupId === primaryGroup._id)
    : null;

  // Get variant pricing
  const variantPricing = primaryVariant
    ? data.pricing.find(
        (p) =>
          p.type === "variant" &&
          p.variantId === primaryVariant._id &&
          p.isVisible
      )
    : null;

  if (!primaryVariant || !variantPricing) {
    return <div>Invalid product configuration</div>;
  }

  return (
    <div className="product-card">
      <h3>{data.product.name}</h3>
      <p>{formatPrice(data.product.basePrice)}</p>

      <QuickAddButton
        productId={data.product._id}
        productName={data.product.name}
        categoryId={data.product.category}
        variantId={primaryVariant._id}
        pricingId={variantPricing._id}
        variant="full"
      />
    </div>
  );
}
```

### With Icon Variant

```typescript
<QuickAddButton
  productId={product._id}
  productName={product.name}
  categoryId={product.category}
  variantId={primaryVariant._id}
  pricingId={variantPricing._id}
  variant="icon" // Shows icon button
  className="absolute top-2 right-2"
/>
```

### With Callback

```typescript
<QuickAddButton
  productId={product._id}
  productName={product.name}
  categoryId={product.category}
  variantId={primaryVariant._id}
  pricingId={variantPricing._id}
  onAdd={(productId) => {
    console.log(`Product ${productId} added to cart`);
    // Optional: Navigate to cart, show animation, etc.
  }}
/>
```

---

## Custom Add to Cart Implementation

If you need to implement a custom add to cart button, use the `useAddToCart()` hook directly.

### Basic Example

```typescript
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAddToCart } from "@/lib/hooks/use-cart";
import { useDeviceId } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";
import { createAddToCartPayload } from "@/lib/utils/cart-utils";

function CustomAddButton({ productData, selectedVariant, selectedAddons, quantity }) {
  const { mutate: addToCart, isLoading } = useAddToCart();
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();

  const handleAddToCart = async () => {
    // Validate prerequisites
    if (!deviceId) {
      toast.error("Session not initialized");
      return;
    }

    if (!selectedStore) {
      toast.error("Please select a store first");
      return;
    }

    // Create payload
    const payload = createAddToCartPayload({
      productId: productData.product._id,
      categoryId: productData.product.category,
      storeId: selectedStore._id,
      sessionId: deviceId,
      selectedVariant,
      selectedAddons,
      addonList: productData.addonList,
      pricing: productData.pricing,
      quantity,
    });

    if (!payload) {
      toast.error("Invalid selection");
      return;
    }

    // Add to cart
    const result = await addToCart(payload);

    if (result.success) {
      // Handle success
      console.log("Added to cart:", result.data);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="btn-primary"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
```

### With Manual Payload Construction

```typescript
function ManualAddToCart() {
  const { mutate: addToCart, isLoading } = useAddToCart();
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();

  const handleAdd = async () => {
    if (!deviceId || !selectedStore) return;

    // Manually construct payload
    const payload = {
      itemId: "product_123",
      categoryId: "category_456",
      storeId: selectedStore._id,
      sessionId: deviceId,
      variantId: "variant_789",
      pricing: [
        { id: "pricing_variant_1", quantity: 1 },
        { id: "pricing_addon_1", quantity: 2 },
      ],
      quantity: 1,
    };

    const result = await addToCart(payload);

    if (result.success) {
      console.log("Success:", result.data);
    } else {
      console.error("Error:", result.error);
    }
  };

  return (
    <button onClick={handleAdd} disabled={isLoading}>
      Add to Cart
    </button>
  );
}
```

---

## Handling Cart Callbacks

### ProductDetailsContainer with Callback

```typescript
import { ProductDetailsContainer } from "@/components/product-details";
import type { CartItem } from "@/types/product-details";

function CustomProductCard({ productId }) {
  const handleAddToCart = (cartItem: CartItem) => {
    console.log("Item added:", cartItem);

    // Optional actions:
    // - Show custom notification
    // - Navigate to cart page
    // - Update local state
    // - Trigger analytics event
  };

  return (
    <ProductDetailsContainer
      productId={productId}
      onAddToCart={handleAddToCart}
      trigger={<button>View Details</button>}
    />
  );
}
```

### Accessing Cart Item Details

```typescript
const handleAddToCart = (cartItem: CartItem) => {
  console.log({
    productId: cartItem.productId,
    productName: cartItem.productName,
    quantity: cartItem.quantity,
    totalPrice: cartItem.totalPrice,
    variants: cartItem.selectedVariants,
    addons: cartItem.selectedAddons,
  });

  // Example: Show custom success message
  toast.success(
    `${cartItem.quantity}x ${cartItem.productName} added for ${formatPrice(
      cartItem.totalPrice
    )}`
  );

  // Example: Track analytics
  analytics.track("Product Added to Cart", {
    product_id: cartItem.productId,
    product_name: cartItem.productName,
    price: cartItem.totalPrice,
    quantity: cartItem.quantity,
  });
};
```

---

## Error Handling

### Handling Prerequisites

```typescript
function AddToCartButton() {
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();
  const { mutate: addToCart, isLoading } = useAddToCart();

  const handleClick = async () => {
    // Check device ID
    if (!deviceId) {
      toast.error("Session not initialized. Please refresh the page.");
      return;
    }

    // Check store selection
    if (!selectedStore) {
      toast.error("Please select a store first");
      // Optional: Navigate to store selector
      router.push("/stores");
      return;
    }

    // Proceed with add to cart
    await addToCart(payload);
  };

  return (
    <button onClick={handleClick} disabled={isLoading || !selectedStore}>
      Add to Cart
    </button>
  );
}
```

### Handling API Errors

```typescript
const handleAddToCart = async () => {
  const result = await addToCart(payload);

  if (!result.success) {
    // Error is already shown via toast by useAddToCart hook
    // But you can handle it further if needed

    if (result.error?.includes("out of stock")) {
      // Show custom out of stock modal
      showOutOfStockModal();
    } else if (result.error?.includes("store closed")) {
      // Show store closed message
      showStoreClosedModal();
    } else {
      // Generic error handling
      console.error("Failed to add to cart:", result.error);
    }

    return;
  }

  // Success handling
  console.log("Added successfully:", result.data);
};
```

### Custom Error Display

```typescript
function CustomAddButton() {
  const { mutate: addToCart, isLoading } = useAddToCart();
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async () => {
    setError(null);

    const result = await addToCart(payload);

    if (!result.success) {
      setError(result.error || "Failed to add to cart");
      return;
    }

    // Success
    setError(null);
  };

  return (
    <div>
      <button onClick={handleAdd} disabled={isLoading}>
        {isLoading ? "Adding..." : "Add to Cart"}
      </button>

      {error && (
        <div className="error-message">
          <AlertCircle />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
```

---

## Advanced Examples

### Bulk Add to Cart

```typescript
async function addMultipleItemsToCart(items: Array<{
  productId: string;
  variantId: string;
  quantity: number;
}>) {
  const { mutate: addToCart } = useAddToCart();
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();

  if (!deviceId || !selectedStore) return;

  const results = await Promise.all(
    items.map((item) =>
      addToCart({
        itemId: item.productId,
        categoryId: "...",
        storeId: selectedStore._id,
        sessionId: deviceId,
        variantId: item.variantId,
        pricing: [{ id: "...", quantity: 1 }],
        quantity: item.quantity,
      })
    )
  );

  const successful = results.filter((r) => r.success).length;
  toast.success(`Added ${successful} items to cart`);
}
```

### Add to Cart with Validation

```typescript
function ValidatedAddButton({ productData }) {
  const { mutate: addToCart } = useAddToCart();
  const [selectedVariants, setSelectedVariants] = useState(new Map());
  const [selectedAddons, setSelectedAddons] = useState(new Map());

  const validation = validateSelections({
    selectedVariants,
    selectedAddons,
    variantGroupList: productData.variantGroupList,
    addonGroupList: productData.addonGroupList,
    addonList: productData.addonList,
    quantity: 1,
  });

  const handleAdd = async () => {
    if (!validation.isValid) {
      // Show validation errors
      validation.errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    // Proceed with add to cart
    const payload = createAddToCartPayload({...});
    await addToCart(payload);
  };

  return (
    <div>
      {/* Variant/Addon selectors */}

      <button
        onClick={handleAdd}
        disabled={!validation.isValid}
      >
        Add to Cart
      </button>

      {!validation.isValid && (
        <ul className="errors">
          {validation.errors.map((error, i) => (
            <li key={i}>{error}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

---

## Common Patterns

### 1. Product Grid with Add to Cart

```typescript
function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### 2. Featured Product with Quick Add

```typescript
function FeaturedProduct({ product, variantId, pricingId }) {
  return (
    <div className="featured-card">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <QuickAddButton
        productId={product._id}
        productName={product.name}
        categoryId={product.category}
        variantId={variantId}
        pricingId={pricingId}
        variant="full"
      />
    </div>
  );
}
```

### 3. Product List with Custom Actions

```typescript
function ProductList({ products }) {
  const handleProductAdded = (cartItem: CartItem) => {
    // Custom action after add
    showMiniCart();
  };

  return (
    <div>
      {products.map((product) => (
        <ProductDetailsContainer
          key={product._id}
          productId={product._id}
          onAddToCart={handleProductAdded}
          trigger={
            <div className="product-item">
              <h3>{product.name}</h3>
              <button>Add to Cart</button>
            </div>
          }
        />
      ))}
    </div>
  );
}
```

---

## Tips & Best Practices

1. **Always validate prerequisites** (deviceId, selectedStore) before calling cart API
2. **Use ProductDetailsContainer** for products with variants/addons
3. **Use QuickAddButton** for simple products without customization
4. **Handle loading states** to provide user feedback
5. **Show toast notifications** for all cart operations (done automatically)
6. **Close modals on success** for better UX (done automatically)
7. **Use utility functions** (`createAddToCartPayload`) for consistent payload creation
8. **Validate selections** before allowing add to cart
9. **Handle errors gracefully** with user-friendly messages
10. **Test edge cases** (no store, no device ID, API failures)

---

## Related Documentation

- [Full Implementation Guide](/docs/add-to-cart-implementation.md)
- [Summary](/docs/add-to-cart-summary.md)
- [API Reference](/lib/api/cart.ts)
- [Type Definitions](/types/cart.ts)
