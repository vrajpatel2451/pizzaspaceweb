# Product Details State Management Implementation Summary

This document summarizes the implementation of state management, API integration, and caching for the Product Details feature.

## Files Created

### 1. Custom Hooks

#### `/hooks/use-media-query.ts`
```typescript
export function useMediaQuery(query: string): boolean
export function useIsMobile(): boolean
```

**Features:**
- SSR-safe media query detection
- Returns `false` on server, actual match on client
- Auto-updates when viewport changes
- Convenience hook `useIsMobile()` for mobile detection (<640px)

**Usage:**
```typescript
const isMobile = useIsMobile();
const isDesktop = useMediaQuery('(min-width: 640px)');
```

#### `/hooks/use-product-details.ts`
```typescript
export function useProductDetails(productId: string): {
  data: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Features:**
- Lazy fetch (only when `refetch()` is called)
- Global cache integration to prevent duplicate API calls
- Loading, error, and data states
- Automatic cache lookup before API call
- Stores successful responses in cache

**Usage:**
```typescript
const { data, isLoading, error, refetch } = useProductDetails(productId);

// Trigger fetch when modal opens
useEffect(() => {
  if (isOpen) {
    refetch();
  }
}, [isOpen, refetch]);
```

---

### 2. Global Cache

#### `/lib/cache/product-details-cache.ts`
```typescript
class ProductDetailsCache {
  get(productId: string): ProductDetailsResponse | undefined
  set(productId: string, data: ProductDetailsResponse, ttl?: number): void
  has(productId: string): boolean
  delete(productId: string): boolean
  clear(): void
  size(): number
  getStats(): object
}

export const productDetailsCache: ProductDetailsCache
```

**Features:**
- Simple in-memory cache using Map
- TTL (Time-To-Live) support - default 5 minutes
- Automatic expiration of stale entries
- Cache statistics and cleanup utilities
- Singleton instance exported for global use

**Implementation Details:**
- Cache entries include timestamp and expiration time
- Expired entries automatically removed on access
- Configurable TTL per entry or globally

**Usage:**
```typescript
import { productDetailsCache } from '@/lib/cache/product-details-cache';

// Check cache
const cached = productDetailsCache.get(productId);
if (cached) {
  return cached;
}

// Store in cache
productDetailsCache.set(productId, data);

// Clear cache
productDetailsCache.clear();
```

---

### 3. Context Provider

#### `/contexts/product-details-context.tsx`
```typescript
interface ProductDetailsContextValue {
  // Product data
  productId: string | null;
  productData: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;

  // Selection state
  selectedVariants: Map<string, string>;
  selectedAddons: Map<string, AddonSelection>;
  quantity: number;

  // Computed values
  totalPrice: number;
  isValid: boolean;
  validationErrors: string[];

  // Actions
  openProductDetails: (productId: string) => void;
  closeProductDetails: () => void;
  selectVariant: (groupId: string, variantId: string) => void;
  toggleAddon: (addonId: string) => void;
  setAddonQuantity: (addonId: string, quantity: number) => void;
  setQuantity: (quantity: number) => void;
  addToCart: () => void;
}

export function ProductDetailsProvider(props): JSX.Element
export function useProductDetailsContext(): ProductDetailsContextValue
```

**Features:**
- Centralized state management for product details modal
- Selection state for variants and addons using Maps
- Real-time price calculation based on selections
- Automatic validation of selections
- Auto-selects first primary variant when data loads
- Actions for all user interactions

**State Management:**
- `selectedVariants`: Map<groupId, variantId>
- `selectedAddons`: Map<addonId, {selected: boolean, quantity: number}>
- `quantity`: Product quantity (1-99)

**Computed Values:**
- `totalPrice`: Calculated using price calculator utility
- `isValid`: Boolean indicating if selections are valid
- `validationErrors`: Array of validation error messages

**Usage:**
```typescript
// In parent component
<ProductDetailsProvider
  initialData={data}
  onAddToCart={handleAddToCart}
>
  <ProductDetailsModal />
</ProductDetailsProvider>

// In child components
const {
  selectedVariants,
  selectVariant,
  totalPrice,
  isValid,
  addToCart
} = useProductDetailsContext();
```

---

### 4. Price Calculator Utility

#### `/lib/utils/price-calculator.ts`
```typescript
export function calculateTotalPrice(params: {
  basePrice: number;
  selectedVariants: Map<string, string>;
  selectedAddons: Map<string, AddonSelection>;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  pricing: VariantPricingResponse[];
  quantity: number;
}): number

export function getVariantPrice(
  variantId: string,
  primaryVariantId: string | null,
  variantList: VariantResponse[],
  variantGroupList: VariantGroupResponse[],
  pricing: VariantPricingResponse[]
): number

export function getAddonPrice(
  addonId: string,
  primaryVariantId: string | null,
  pricing: VariantPricingResponse[]
): number
```

**Price Calculation Algorithm:**

1. **Start with base price**: `product.basePrice`

2. **Add primary variant price**:
   - Use `variant.price` directly
   - Primary variant is from a group where `isPrimary === true`

3. **Add secondary variant prices**:
   - Lookup in `VariantPricingResponse` array
   - Find entry where:
     - `type === "variant"`
     - `variantId === primaryVariantId`
     - `subVariantId === secondaryVariantId`
     - `isVisible === true`

4. **Add addon prices**:
   - Lookup in `VariantPricingResponse` array
   - Find entry where:
     - `type === "addon"` (variant-specific pricing)
     - OR `type === "addonGroup"` (group-level pricing)
     - `variantId === primaryVariantId` (if variant-specific)
     - `addonId === addonId`
     - `isVisible === true`
   - Multiply by addon quantity

5. **Multiply by product quantity**: `itemPrice * quantity`

**Example:**
```typescript
const totalPrice = calculateTotalPrice({
  basePrice: 1000, // £10.00
  selectedVariants: new Map([
    ['group1', 'variant1'], // Large - £12.00
    ['group2', 'variant2'], // Extra cheese - £2.00
  ]),
  selectedAddons: new Map([
    ['addon1', { selected: true, quantity: 2 }], // Jalapeños x2 - £1.00 each
  ]),
  variantList,
  variantGroupList,
  addonList,
  pricing,
  quantity: 2,
});
// Result: (12.00 + 2.00 + 2.00) * 2 = £32.00 (3200 pence)
```

---

### 5. Validation Utility

#### `/lib/utils/product-validation.ts`
```typescript
export function validateSelections(params: {
  selectedVariants: Map<string, string>;
  selectedAddons: Map<string, AddonSelection>;
  variantGroupList: VariantGroupResponse[];
  addonGroupList: AddonGroupResponse[];
  addonList: AddonResponse[];
  quantity: number;
}): {
  isValid: boolean;
  errors: string[];
}

export function validateAddonGroup(params: {
  group: AddonGroupResponse;
  selectedAddons: Map<string, AddonSelection>;
  addonList: AddonResponse[];
}): {
  isValid: boolean;
  error: string | null;
}

export function validateVariantGroup(params: {
  group: VariantGroupResponse;
  selectedVariants: Map<string, string>;
}): {
  isValid: boolean;
  error: string | null;
}
```

**Validation Rules:**

1. **Primary Variant Groups** (Required):
   - All groups where `isPrimary === true` must have a selection
   - Error: "Please select a {group.label}"

2. **Addon Group Minimum** (Optional):
   - If `group.min > 0`, at least `min` items must be selected
   - For multi-select: count total quantities
   - For single-select: count selections
   - Error: "Please select at least {min} {group.label}"

3. **Addon Group Maximum** (Optional):
   - If `group.max > 0`, no more than `max` items can be selected
   - Error: "Maximum {max} {group.label} allowed"

4. **Product Quantity**:
   - Must be >= 1
   - Error: "Quantity must be at least 1"

**Usage:**
```typescript
// Validate all selections
const { isValid, errors } = validateSelections({
  selectedVariants,
  selectedAddons,
  variantGroupList,
  addonGroupList,
  addonList,
  quantity,
});

// Validate specific addon group
const { isValid, error } = validateAddonGroup({
  group,
  selectedAddons,
  addonList,
});
```

---

## Integration Flow

### 1. Component Initialization
```typescript
// Product Details Modal opens
<ProductDetailsProvider initialData={null} onAddToCart={handleAddToCart}>
  <ProductDetailsContent />
</ProductDetailsProvider>
```

### 2. Data Fetching
```typescript
// Hook fetches data on modal open
const { data, isLoading, error, refetch } = useProductDetails(productId);

useEffect(() => {
  if (isOpen) {
    refetch(); // Checks cache first, then API
  }
}, [isOpen, refetch]);
```

### 3. State Management
```typescript
// User selects variant
const { selectVariant } = useProductDetailsContext();
selectVariant(groupId, variantId);

// User toggles addon
const { toggleAddon } = useProductDetailsContext();
toggleAddon(addonId);

// User changes addon quantity
const { setAddonQuantity } = useProductDetailsContext();
setAddonQuantity(addonId, 2);
```

### 4. Price Calculation (Automatic)
```typescript
// Price updates automatically via useMemo
const { totalPrice } = useProductDetailsContext();
// Display: £{(totalPrice / 100).toFixed(2)}
```

### 5. Validation (Automatic)
```typescript
// Validation runs automatically via useMemo
const { isValid, validationErrors } = useProductDetailsContext();

// Disable button if invalid
<button disabled={!isValid} onClick={addToCart}>
  Add to Cart
</button>

// Show errors
{validationErrors.map(error => (
  <p key={error} className="text-red-500">{error}</p>
))}
```

### 6. Add to Cart
```typescript
// User clicks "Add to Cart"
const { addToCart } = useProductDetailsContext();
addToCart(); // Calls onAddToCart callback with cart data
```

---

## Key Features Implemented

### 1. Performance Optimizations
- **Global Cache**: Prevents duplicate API calls for same product
- **TTL**: Automatic cache expiration after 5 minutes
- **Lazy Loading**: Data only fetched when modal opens
- **Memoization**: Price and validation calculations memoized

### 2. State Management
- **Map-based State**: Efficient lookups and updates
- **Immutable Updates**: New Map instances on state changes
- **Auto-selection**: First primary variant auto-selected
- **Cleanup**: State reset on modal close

### 3. Price Calculation
- **Accurate Logic**: Handles primary variants, secondary variants, and addons
- **Variant-specific Pricing**: Addon prices can vary by primary variant
- **Quantity Support**: Addon and product quantity properly multiplied

### 4. Validation
- **Real-time**: Validation runs on every state change
- **Comprehensive**: Covers all business rules
- **User-friendly**: Clear error messages
- **Per-group**: Individual group validation available

### 5. Type Safety
- **Strict TypeScript**: Full type coverage
- **Type Guards**: Runtime type checking available
- **Null Safety**: Handles null values gracefully

### 6. SSR Safety
- **Media Query Hook**: Returns false on server
- **Client-only State**: All state in client components
- **No Window Access**: Safe server rendering

---

## Testing Checklist

- [ ] Cache stores and retrieves product data correctly
- [ ] Cache respects TTL and expires entries
- [ ] Media query hook detects mobile/desktop correctly
- [ ] Media query hook is SSR-safe
- [ ] Product details hook fetches data on refetch()
- [ ] Product details hook uses cache when available
- [ ] Context auto-selects first primary variant
- [ ] Variant selection updates state correctly
- [ ] Addon toggle works (select/deselect)
- [ ] Addon quantity updates correctly
- [ ] Price calculation is accurate for all cases
- [ ] Primary variant price added correctly
- [ ] Secondary variant price looked up from pricing array
- [ ] Addon price looked up correctly
- [ ] Variant-specific addon pricing works
- [ ] Group-level addon pricing fallback works
- [ ] Quantity multiplier applied correctly
- [ ] Validation detects missing primary variant
- [ ] Validation detects addon min constraint violation
- [ ] Validation detects addon max constraint violation
- [ ] Validation detects invalid quantity
- [ ] Error messages are user-friendly
- [ ] Add to cart works when valid
- [ ] Add to cart blocked when invalid
- [ ] State resets on modal close

---

## Next Steps

### Component Implementation
Now that the state management layer is complete, implement the UI components:

1. **ProductDetailsContainer** - Entry point with trigger
2. **ProductDetailsModal** - Responsive Dialog/Drawer wrapper
3. **ProductDetailsContent** - Main content component
4. **Section Components**:
   - ProductImageSection
   - ProductInfoSection
   - VariantGroupsSection
   - AddonGroupsSection
   - AddToCartSection

### Integration Points
Connect the context to components:
```typescript
// In VariantGroupsSection
const { selectedVariants, selectVariant } = useProductDetailsContext();

// In AddonGroupsSection
const { selectedAddons, toggleAddon, setAddonQuantity } = useProductDetailsContext();

// In AddToCartSection
const { totalPrice, quantity, setQuantity, isValid, addToCart } = useProductDetailsContext();
```

---

## API Reference

### Hooks

#### `useMediaQuery(query: string): boolean`
Detect if media query matches (SSR-safe)

#### `useIsMobile(): boolean`
Convenience hook for mobile detection (<640px)

#### `useProductDetails(productId: string): object`
Fetch product details with caching

#### `useProductDetailsContext(): ProductDetailsContextValue`
Access product details context (must be used within provider)

### Utilities

#### `calculateTotalPrice(params): number`
Calculate total price based on selections

#### `getVariantPrice(variantId, primaryVariantId, ...): number`
Get price for specific variant

#### `getAddonPrice(addonId, primaryVariantId, ...): number`
Get price for specific addon

#### `validateSelections(params): ValidationResult`
Validate all selections

#### `validateAddonGroup(params): object`
Validate specific addon group

#### `validateVariantGroup(params): object`
Validate specific variant group

### Cache

#### `productDetailsCache.get(productId): ProductDetailsResponse | undefined`
Get cached product data

#### `productDetailsCache.set(productId, data, ttl?): void`
Store product data in cache

#### `productDetailsCache.has(productId): boolean`
Check if product is cached

#### `productDetailsCache.clear(): void`
Clear all cache

---

## File Structure

```
pizzaspace_web/
├── hooks/
│   ├── use-media-query.ts ✅
│   └── use-product-details.ts ✅
├── lib/
│   ├── cache/
│   │   └── product-details-cache.ts ✅
│   └── utils/
│       ├── price-calculator.ts ✅
│       └── product-validation.ts ✅
├── contexts/
│   └── product-details-context.tsx ✅
└── docs/
    └── product-details/
        ├── COMPONENT_ARCHITECTURE.md
        └── IMPLEMENTATION_SUMMARY.md ✅
```

All core state management, caching, and utility files have been successfully implemented!
