# Product Details State Management - Usage Examples

This document provides practical examples of how to use the implemented state management system.

## Example 1: Basic Setup in Modal Component

```typescript
'use client';

import { useEffect } from 'react';
import { useProductDetails } from '@/hooks/use-product-details';
import { ProductDetailsProvider } from '@/contexts/product-details-context';

interface ProductDetailsModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsModal({
  productId,
  isOpen,
  onClose
}: ProductDetailsModalProps) {
  const { data, isLoading, error, refetch } = useProductDetails(productId);

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen && productId) {
      refetch();
    }
  }, [isOpen, productId, refetch]);

  const handleAddToCart = (cartData) => {
    console.log('Adding to cart:', cartData);
    // Implement your cart logic here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        {isLoading && <ProductDetailsSkeleton />}
        {error && <ErrorMessage error={error} onRetry={refetch} />}
        {data && (
          <ProductDetailsProvider
            initialData={data}
            onAddToCart={handleAddToCart}
          >
            <ProductDetailsContent />
          </ProductDetailsProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
```

## Example 2: Variant Selection Component

```typescript
'use client';

import { useProductDetailsContext } from '@/contexts/product-details-context';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function VariantGroupsSection() {
  const {
    productData,
    selectedVariants,
    selectVariant
  } = useProductDetailsContext();

  if (!productData) return null;

  const { variantList, variantGroupList } = productData;

  // Sort groups - primary first
  const sortedGroups = [...variantGroupList].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1;
    if (!a.isPrimary && b.isPrimary) return 1;
    return 0;
  });

  return (
    <div className="space-y-6">
      {sortedGroups.map((group) => {
        const groupVariants = variantList.filter(v => v.groupId === group._id);
        const selectedVariantId = selectedVariants.get(group._id);

        return (
          <div key={group._id} className="space-y-3">
            <div>
              <h3 className="font-semibold">
                {group.label}
                {group.isPrimary && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </h3>
              {group.description && (
                <p className="text-sm text-gray-600">{group.description}</p>
              )}
            </div>

            <RadioGroup
              value={selectedVariantId}
              onValueChange={(variantId) => selectVariant(group._id, variantId)}
            >
              {groupVariants.map((variant) => (
                <div key={variant._id} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={variant._id}
                    id={variant._id}
                  />
                  <label
                    htmlFor={variant._id}
                    className="flex-1 cursor-pointer"
                  >
                    {variant.label}
                  </label>
                  {variant.price > 0 && (
                    <span className="text-sm text-gray-600">
                      +£{(variant.price / 100).toFixed(2)}
                    </span>
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>
        );
      })}
    </div>
  );
}
```

## Example 3: Addon Selection Component

```typescript
'use client';

import { useProductDetailsContext } from '@/contexts/product-details-context';
import { Checkbox } from '@/components/ui/checkbox';
import { QuantityIncrementor } from '@/components/composite/quantity-incrementor';
import { getAddonPrice } from '@/lib/utils/price-calculator';
import { validateAddonGroup } from '@/lib/utils/product-validation';

export function AddonGroupsSection() {
  const {
    productData,
    selectedAddons,
    toggleAddon,
    setAddonQuantity,
  } = useProductDetailsContext();

  if (!productData) return null;

  const { addonList, addonGroupList, pricing, variantGroupList, variantList, selectedVariants } = productData;

  // Get primary variant ID for pricing lookup
  const primaryVariantId = Array.from(selectedVariants.entries())
    .find(([groupId]) => {
      const group = variantGroupList.find(g => g._id === groupId);
      return group?.isPrimary;
    })?.[1] || null;

  return (
    <div className="space-y-6">
      {addonGroupList.map((group) => {
        const groupAddons = addonList.filter(a => a.groupId === group._id);

        // Validate this group
        const { error } = validateAddonGroup({
          group,
          selectedAddons,
          addonList,
        });

        return (
          <div key={group._id} className="space-y-3">
            <div>
              <h3 className="font-semibold">
                {group.label}
                {group.min > 0 && (
                  <span className="text-sm text-gray-600 ml-2">
                    (Min: {group.min})
                  </span>
                )}
                {group.max > 0 && (
                  <span className="text-sm text-gray-600 ml-2">
                    (Max: {group.max})
                  </span>
                )}
              </h3>
              {group.description && (
                <p className="text-sm text-gray-600">{group.description}</p>
              )}
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>

            <div className="space-y-2">
              {groupAddons.map((addon) => {
                const selection = selectedAddons.get(addon._id) || {
                  selected: false,
                  quantity: 0,
                };
                const price = getAddonPrice(addon._id, primaryVariantId, pricing);

                return (
                  <div
                    key={addon._id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={addon._id}
                        checked={selection.selected}
                        onCheckedChange={() => toggleAddon(addon._id)}
                      />
                      <label
                        htmlFor={addon._id}
                        className="cursor-pointer"
                      >
                        {addon.label}
                      </label>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600">
                        +£{(price / 100).toFixed(2)}
                      </span>

                      {group.allowMulti && selection.selected && (
                        <QuantityIncrementor
                          value={selection.quantity}
                          onChange={(qty) => setAddonQuantity(addon._id, qty)}
                          min={0}
                          max={group.max || 99}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

## Example 4: Add to Cart Section with Validation

```typescript
'use client';

import { useProductDetailsContext } from '@/contexts/product-details-context';
import { Button } from '@/components/ui/button';
import { QuantityIncrementor } from '@/components/composite/quantity-incrementor';

export function AddToCartSection() {
  const {
    totalPrice,
    quantity,
    setQuantity,
    isValid,
    validationErrors,
    addToCart,
  } = useProductDetailsContext();

  return (
    <div className="sticky bottom-0 bg-white border-t p-4 space-y-4">
      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm font-medium text-red-800 mb-1">
            Please complete your selection:
          </p>
          <ul className="text-sm text-red-700 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Price and Quantity */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">Total Price</p>
          <p className="text-2xl font-bold">
            £{(totalPrice / 100).toFixed(2)}
          </p>
        </div>

        <QuantityIncrementor
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={99}
        />
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={addToCart}
        disabled={!isValid}
        className="w-full"
        size="lg"
      >
        {isValid ? 'Add to Cart' : 'Complete Selection'}
      </Button>
    </div>
  );
}
```

## Example 5: Responsive Modal Wrapper

```typescript
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';

interface ProductDetailsModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function ProductDetailsModalWrapper({
  isOpen,
  onClose,
  children,
}: ProductDetailsModalWrapperProps) {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      side="bottom"
      size="full"
      closeOnOverlayClick
    >
      <div className="h-[95vh] overflow-y-auto">
        {children}
      </div>
    </Drawer>
  );
}
```

## Example 6: Price Display with Breakdown

```typescript
'use client';

import { useMemo } from 'react';
import { useProductDetailsContext } from '@/contexts/product-details-context';
import { getVariantPrice, getAddonPrice } from '@/lib/utils/price-calculator';

export function PriceBreakdown() {
  const {
    productData,
    selectedVariants,
    selectedAddons,
    quantity,
    totalPrice,
  } = useProductDetailsContext();

  const breakdown = useMemo(() => {
    if (!productData) return null;

    const {
      product,
      variantList,
      variantGroupList,
      addonList,
      pricing
    } = productData;

    // Get primary variant ID
    const primaryVariantId = Array.from(selectedVariants.entries())
      .find(([groupId]) => {
        const group = variantGroupList.find(g => g._id === groupId);
        return group?.isPrimary;
      })?.[1] || null;

    // Calculate variant costs
    const variantCosts = Array.from(selectedVariants.entries()).map(([groupId, variantId]) => {
      const variant = variantList.find(v => v._id === variantId);
      const price = getVariantPrice(
        variantId,
        primaryVariantId,
        variantList,
        variantGroupList,
        pricing
      );
      return {
        label: variant?.label || 'Unknown',
        price,
      };
    });

    // Calculate addon costs
    const addonCosts = Array.from(selectedAddons.entries())
      .filter(([_, selection]) => selection.selected && selection.quantity > 0)
      .map(([addonId, selection]) => {
        const addon = addonList.find(a => a._id === addonId);
        const unitPrice = getAddonPrice(addonId, primaryVariantId, pricing);
        return {
          label: addon?.label || 'Unknown',
          quantity: selection.quantity,
          unitPrice,
          totalPrice: unitPrice * selection.quantity,
        };
      });

    const itemPrice =
      product.basePrice +
      variantCosts.reduce((sum, v) => sum + v.price, 0) +
      addonCosts.reduce((sum, a) => sum + a.totalPrice, 0);

    return {
      base: product.basePrice,
      variants: variantCosts,
      addons: addonCosts,
      itemPrice,
      quantity,
      totalPrice,
    };
  }, [productData, selectedVariants, selectedAddons, quantity, totalPrice]);

  if (!breakdown) return null;

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <span>Base Price</span>
        <span>£{(breakdown.base / 100).toFixed(2)}</span>
      </div>

      {breakdown.variants.map((variant, index) => (
        <div key={index} className="flex justify-between text-gray-600">
          <span>{variant.label}</span>
          <span>+£{(variant.price / 100).toFixed(2)}</span>
        </div>
      ))}

      {breakdown.addons.map((addon, index) => (
        <div key={index} className="flex justify-between text-gray-600">
          <span>
            {addon.label} x{addon.quantity}
          </span>
          <span>+£{(addon.totalPrice / 100).toFixed(2)}</span>
        </div>
      ))}

      <div className="flex justify-between text-gray-600 pt-2 border-t">
        <span>Item Total</span>
        <span>£{(breakdown.itemPrice / 100).toFixed(2)}</span>
      </div>

      {breakdown.quantity > 1 && (
        <div className="flex justify-between text-gray-600">
          <span>Quantity</span>
          <span>x{breakdown.quantity}</span>
        </div>
      )}

      <div className="flex justify-between font-bold text-lg pt-2 border-t">
        <span>Total</span>
        <span>£{(breakdown.totalPrice / 100).toFixed(2)}</span>
      </div>
    </div>
  );
}
```

## Example 7: Cache Management

```typescript
import { productDetailsCache } from '@/lib/cache/product-details-cache';

// Clear cache on user logout
export function handleLogout() {
  productDetailsCache.clear();
  // ... rest of logout logic
}

// Manually refresh product data
export async function refreshProduct(productId: string) {
  // Clear cached entry
  productDetailsCache.delete(productId);

  // Fetch fresh data
  const response = await getProductDetails(productId);

  if (response.statusCode === 200 && response.data) {
    productDetailsCache.set(productId, response.data);
  }

  return response;
}

// Get cache statistics
export function getCacheStats() {
  const stats = productDetailsCache.getStats();
  console.log('Cache size:', stats.size);
  console.log('Cached products:', stats.entries);
  return stats;
}

// Configure custom TTL (e.g., 10 minutes)
productDetailsCache.setDefaultTTL(10 * 60 * 1000);

// Store with custom TTL (e.g., 1 hour)
const oneHour = 60 * 60 * 1000;
productDetailsCache.set(productId, data, oneHour);
```

## Example 8: Error Handling

```typescript
'use client';

import { useProductDetails } from '@/hooks/use-product-details';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export function ProductDetailsWithErrorHandling({ productId }: { productId: string }) {
  const { data, isLoading, error, refetch } = useProductDetails(productId);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <div className="text-center">
          <h3 className="font-semibold text-lg mb-2">
            Failed to Load Product Details
          </h3>
          <p className="text-gray-600 mb-4">
            {error.message}
          </p>
          <Button onClick={refetch}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">No product data available</p>
      </div>
    );
  }

  return (
    <ProductDetailsProvider initialData={data}>
      <ProductDetailsContent />
    </ProductDetailsProvider>
  );
}
```

## Example 9: Testing Helper

```typescript
import { productDetailsCache } from '@/lib/cache/product-details-cache';
import { ProductDetailsResponse } from '@/types/product';

// Mock data for testing
export const mockProductDetails: ProductDetailsResponse = {
  product: {
    _id: 'prod1',
    name: 'Margherita Pizza',
    basePrice: 1200,
    // ... other fields
  },
  variantList: [
    {
      _id: 'var1',
      label: 'Small',
      price: 1000,
      groupId: 'group1',
      isPrimary: true,
      // ... other fields
    },
    {
      _id: 'var2',
      label: 'Large',
      price: 1400,
      groupId: 'group1',
      isPrimary: true,
      // ... other fields
    },
  ],
  variantGroupList: [
    {
      _id: 'group1',
      label: 'Size',
      isPrimary: true,
      // ... other fields
    },
  ],
  addonList: [],
  addonGroupList: [],
  pricing: [],
};

// Test cache
export function testCache() {
  const productId = 'test-product';

  // Store mock data
  productDetailsCache.set(productId, mockProductDetails);

  // Retrieve data
  const cached = productDetailsCache.get(productId);
  console.log('Cached data:', cached);

  // Check if exists
  console.log('Has cache:', productDetailsCache.has(productId));

  // Clear
  productDetailsCache.delete(productId);
  console.log('After delete:', productDetailsCache.has(productId));
}
```

## Key Patterns

### 1. Always Use Context Within Provider
```typescript
// ✅ Correct
<ProductDetailsProvider initialData={data}>
  <ComponentUsingContext />
</ProductDetailsProvider>

// ❌ Wrong - will throw error
<ComponentUsingContext />
```

### 2. Fetch Data Before Rendering Provider
```typescript
// ✅ Correct - fetch first, then provide
const { data } = useProductDetails(productId);
if (data) {
  return (
    <ProductDetailsProvider initialData={data}>
      <Content />
    </ProductDetailsProvider>
  );
}

// ❌ Wrong - provider needs data
<ProductDetailsProvider initialData={null}>
  <Content />
</ProductDetailsProvider>
```

### 3. Use Maps for Selection State
```typescript
// ✅ Correct - use Map methods
const { selectedVariants, selectVariant } = useProductDetailsContext();
selectVariant(groupId, variantId); // Updates Map

// ❌ Wrong - don't mutate Map directly
selectedVariants.set(groupId, variantId); // Won't trigger re-render
```

### 4. Validate Before Submit
```typescript
// ✅ Correct - check isValid
const { isValid, addToCart } = useProductDetailsContext();
<Button disabled={!isValid} onClick={addToCart}>
  Add to Cart
</Button>

// ❌ Wrong - no validation check
<Button onClick={addToCart}>Add to Cart</Button>
```

These examples demonstrate the complete usage patterns for the state management system!
