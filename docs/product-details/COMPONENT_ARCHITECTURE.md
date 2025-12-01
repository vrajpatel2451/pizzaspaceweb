# Product Details Component Architecture

## Component Hierarchy

```
ProductDetailsContainer (Server Component)
  |
  +-- ProductDetailsTrigger (Server/Client - depending on usage)
  |     |
  |     +-- ProductCard QuickAddButton (click trigger)
  |
  +-- ProductDetailsModal (Client Component)
        |
        +-- [Desktop: Dialog wrapper]
        |     |
        |     +-- ProductDetailsContent
        |
        +-- [Mobile: Drawer wrapper]
              |
              +-- ProductDetailsContent


ProductDetailsContent (Client Component - Shared)
  |
  +-- ProductDetailsProvider (Context Provider)
        |
        +-- ProductDetailsBody
              |
              +-- ProductImageSection
              |     |
              |     +-- CustomImage (carousel/gallery)
              |     +-- ProductBadge (veg/non-veg/vegan)
              |
              +-- ProductInfoSection
              |     |
              |     +-- ProductHeader (name, type, spice level)
              |     +-- Accordion (collapsible description)
              |     +-- NutritionalInfo (protein, carbs, fats, etc.)
              |     +-- AllergyInfo
              |
              +-- VariantGroupsSection
              |     |
              |     +-- VariantGroup (Primary) - RadioGroup
              |     +-- VariantGroup (Secondary) - RadioGroup
              |
              +-- AddonGroupsSection
              |     |
              |     +-- AddonGroup (allowMulti: false) - RadioGroup
              |     +-- AddonGroup (allowMulti: true) - Checkbox + QuantityIncrementor
              |
              +-- AddToCartSection (Sticky Footer)
                    |
                    +-- PriceCalculator (real-time total)
                    +-- QuantityIncrementor (item quantity)
                    +-- Button (Add to Cart)
```

## Server vs Client Component Boundaries

### Server Components
- **ProductDetailsContainer**: Orchestrates the modal, can optionally pre-fetch data
- **ProductDetailsTrigger**: Can be server-rendered if used as a simple button

### Client Components (require "use client")
- **ProductDetailsModal**: Handles Dialog/Drawer state, viewport detection
- **ProductDetailsContent**: All interactive content
- **ProductDetailsProvider**: Context for selection state
- **All child components**: Interactive elements with state

### Why Client Components?
- State management for variant/addon selections
- Real-time price calculations
- Form interactions (radio, checkbox, quantity)
- Responsive viewport detection (desktop vs mobile)
- Modal open/close state

## Component Specifications

### 1. ProductDetailsContainer
**Purpose**: Entry point, handles modal trigger and lazy loading

**Props**:
```typescript
interface ProductDetailsContainerProps {
  productId: string;
  trigger?: React.ReactNode; // Custom trigger element
  mode?: 'lazy' | 'eager'; // Data fetching strategy
  onAddToCart?: (item: CartItem) => void | Promise<void>;
}
```

**Responsibilities**:
- Render trigger element
- Manage modal open/close state
- Lazy fetch product details on modal open
- Global caching to prevent duplicate API calls

### 2. ProductDetailsModal
**Purpose**: Responsive wrapper switching between Dialog (desktop) and Drawer (mobile)

**Props**:
```typescript
interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  children: React.ReactNode;
}
```

**Responsibilities**:
- Detect viewport size (useMediaQuery hook for >640px)
- Render Dialog component for desktop
- Render Drawer component for mobile (side="bottom")
- Pass through open/close state to children

### 3. ProductDetailsContent
**Purpose**: Shared content component used by both Dialog and Drawer

**Props**:
```typescript
interface ProductDetailsContentProps {
  data: ProductDetailsResponse | null;
  isLoading: boolean;
  error: Error | null;
  onClose: () => void;
  onAddToCart?: (item: CartItem) => void | Promise<void>;
}
```

**Responsibilities**:
- Wrap content in ProductDetailsProvider
- Handle loading state (Skeleton components)
- Handle error state
- Render ProductDetailsBody when data loaded

### 4. ProductDetailsProvider
**Purpose**: Context provider for selection state and price calculation

**Context Shape**:
```typescript
interface ProductDetailsContextValue {
  // Product data
  product: ProductResponse;
  variantList: VariantResponse[];
  variantGroupList: VariantGroupResponse[];
  addonList: AddonResponse[];
  addonGroupList: AddonGroupResponse[];
  pricing: VariantPricingResponse[];

  // Selection state
  selectedVariants: Record<string, string>; // groupId -> variantId
  selectedAddons: Record<string, number>; // addonId -> quantity
  itemQuantity: number;

  // Actions
  selectVariant: (groupId: string, variantId: string) => void;
  selectAddon: (addonId: string, quantity: number) => void;
  setItemQuantity: (quantity: number) => void;

  // Computed values
  currentPrice: number;
  isValid: boolean; // All required selections made
  validationErrors: string[];
}
```

**Responsibilities**:
- Manage variant selection state
- Manage addon selection state
- Manage item quantity
- Calculate real-time price based on selections
- Validate selections (required variants, addon min/max)

### 5. ProductImageSection
**Purpose**: Display product images with carousel/gallery

**Props**:
```typescript
interface ProductImageSectionProps {
  images: string[];
  productName: string;
  productType: ProductType;
}
```

**Responsibilities**:
- Render image carousel (use CustomImage component)
- Show product type badge (veg/non-veg/vegan indicator)
- Handle image navigation (dots or thumbnails)
- Lazy load images

### 6. ProductInfoSection
**Purpose**: Display product information

**Props**:
```typescript
interface ProductInfoSectionProps {
  product: ProductResponse;
}
```

**Responsibilities**:
- Display product name and type
- Show spice level indicators
- Collapsible description (Accordion component)
- Display nutritional information (protein, carbs, fats, fiber)
- Show allergy information if present
- Display ingredient list
- Show serving size (noOfPeople, dishSize)

### 7. VariantGroupsSection
**Purpose**: Display all variant groups with selection UI

**Props**:
```typescript
interface VariantGroupsSectionProps {
  variantGroups: VariantGroupResponse[];
  variants: VariantResponse[];
}
```

**Responsibilities**:
- Sort groups: Primary groups first, then secondary
- Render VariantGroup component for each group
- Use RadioGroup for single-selection

### 8. VariantGroup
**Purpose**: Single variant group with radio selection

**Props**:
```typescript
interface VariantGroupProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
}
```

**Responsibilities**:
- Display group label and description
- Render RadioGroup with RadioGroupItem for each variant
- Show variant price if different from base
- Highlight selection
- Mark as required if isPrimary

### 9. AddonGroupsSection
**Purpose**: Display all addon groups with selection UI

**Props**:
```typescript
interface AddonGroupsSectionProps {
  addonGroups: AddonGroupResponse[];
  addons: AddonResponse[];
}
```

**Responsibilities**:
- Render AddonGroup component for each group
- Display min/max requirements

### 10. AddonGroup
**Purpose**: Single addon group with checkbox/quantity selection

**Props**:
```typescript
interface AddonGroupProps {
  group: AddonGroupResponse;
  addons: AddonResponse[];
  selectedAddons: Record<string, number>; // addonId -> quantity
  onSelect: (addonId: string, quantity: number) => void;
}
```

**Responsibilities**:
- Display group label and description
- If allowMulti: false, use RadioGroup (single selection)
- If allowMulti: true, use Checkbox + QuantityIncrementor
- Show addon prices
- Validate against min/max constraints
- Display validation feedback

### 11. AddToCartSection
**Purpose**: Sticky footer with price and add to cart button

**Props**:
```typescript
interface AddToCartSectionProps {
  totalPrice: number;
  itemQuantity: number;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  isValid: boolean;
  isLoading?: boolean;
}
```

**Responsibilities**:
- Display total price (uses PriceCalculator)
- Render QuantityIncrementor for item quantity
- Render "Add to Cart" Button
- Disable button if selections invalid
- Show loading state during cart operations
- Sticky positioning at bottom

### 12. PriceCalculator
**Purpose**: Calculate and display real-time price

**Props**:
```typescript
interface PriceCalculatorProps {
  basePrice: number;
  selectedVariants: Record<string, string>;
  selectedAddons: Record<string, number>;
  pricing: VariantPricingResponse[];
  itemQuantity: number;
  className?: string;
}
```

**Responsibilities**:
- Calculate base price + variant prices + addon prices
- Apply quantity multiplier
- Display formatted price (use formatPrice util)
- Show price breakdown on hover/click (optional)

## State Management Strategy

### Context-Based State Management

We use React Context for state management to avoid prop drilling and keep the architecture clean.

**ProductDetailsContext** provides:
1. Product data (read-only)
2. Selection state (variants, addons, quantity)
3. Actions to update selections
4. Computed values (price, validation)

### State Flow

```
User Interaction
  |
  v
Action (selectVariant, selectAddon, setItemQuantity)
  |
  v
Context State Update
  |
  v
Price Recalculation (based on pricing rules)
  |
  v
Component Re-render
  |
  v
UI Updates (price, validation feedback, button state)
```

### Price Calculation Algorithm

```typescript
function calculatePrice(
  basePrice: number,
  selectedVariants: Record<string, string>,
  selectedAddons: Record<string, number>,
  pricing: VariantPricingResponse[]
): number {
  let total = basePrice;

  // Add variant prices
  for (const [groupId, variantId] of Object.entries(selectedVariants)) {
    const variantPricing = pricing.find(
      p => p.type === 'variant' && p.variantId === variantId
    );
    if (variantPricing && variantPricing.isVisible) {
      total += variantPricing.price;
    }
  }

  // Add addon prices
  for (const [addonId, quantity] of Object.entries(selectedAddons)) {
    if (quantity > 0) {
      const addonPricing = pricing.find(
        p => p.type === 'addon' && p.addonId === addonId
      );
      if (addonPricing && addonPricing.isVisible) {
        total += addonPricing.price * quantity;
      }
    }
  }

  return total;
}
```

### Validation Logic

```typescript
function validateSelections(
  variantGroups: VariantGroupResponse[],
  selectedVariants: Record<string, string>,
  addonGroups: AddonGroupResponse[],
  selectedAddons: Record<string, number>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate all primary variant groups are selected
  for (const group of variantGroups) {
    if (group.isPrimary && !selectedVariants[group._id]) {
      errors.push(`Please select a ${group.label}`);
    }
  }

  // Validate addon groups min/max constraints
  for (const group of addonGroups) {
    const groupAddons = selectedAddons.filter(
      (addonId) => addons.find(a => a._id === addonId && a.groupId === group._id)
    );
    const totalSelected = Object.values(groupAddons).reduce((sum, qty) => sum + qty, 0);

    if (totalSelected < group.min) {
      errors.push(`Please select at least ${group.min} ${group.label}`);
    }
    if (totalSelected > group.max) {
      errors.push(`Maximum ${group.max} ${group.label} allowed`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
```

## Data Flow Diagram

```
ProductDetailsContainer (productId)
  |
  | [User clicks trigger]
  |
  v
API Fetch (lazy) --> Cache Check --> GET /products/:id/details
  |                                        |
  | [Data loaded]                          | [Fresh data]
  |                                        v
  +---------------------------------> ProductDetailsResponse
                                           |
                                           v
                                 ProductDetailsProvider
                                           |
                     +--------------------+--------------------+
                     |                                         |
                     v                                         v
            State Management                            Price Calculation
                     |                                         |
    +---------------+----------------+                         |
    |                                |                         |
    v                                v                         v
VariantGroupsSection         AddonGroupsSection         AddToCartSection
    |                                |                         |
    | [User selects]                 | [User selects]          | [Displays total]
    v                                v                         v
selectVariant()                selectAddon()              PriceCalculator
    |                                |                         |
    +----------------+---------------+                         |
                     |                                         |
                     v                                         |
            Context State Update                               |
                     |                                         |
                     +-------------------> Recalculate Price <-+
                                                |
                                                v
                                        Component Re-render
```

## Responsive Design Strategy

### Desktop (>640px)
- Use Dialog component
- Max width: 800px
- Center positioned
- Show close button (X)
- Image on left, details on right (2-column layout)

### Mobile (<640px)
- Use Drawer component (side="bottom")
- Full width
- Slide up from bottom
- Size: "full" (95vh)
- Single column layout
- Image carousel at top
- Sticky footer for Add to Cart

### Implementation

```typescript
'use client';

import { useMediaQuery } from '@/hooks/use-media-query';

function ProductDetailsModal({ isOpen, onClose, children }: Props) {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[800px]">
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
      {children}
    </Drawer>
  );
}
```

## Loading States

### Initial Load
Show Skeleton components matching the content layout:

```typescript
function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Image skeleton */}
      <Skeleton className="aspect-square rounded-2xl" />

      {/* Product info skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>

      {/* Variant groups skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
```

### Cart Operation Loading
- Button shows loading spinner
- Button disabled during operation
- Price display locked

## Error Handling

### API Errors
```typescript
if (error) {
  return (
    <div className="p-6 text-center">
      <p className="text-destructive">Failed to load product details</p>
      <Button onClick={refetch} className="mt-4">
        Try Again
      </Button>
    </div>
  );
}
```

### Validation Errors
- Display inline under invalid sections
- Highlight invalid fields
- Disable Add to Cart button
- Show error summary at bottom

## Accessibility Considerations

1. **Semantic HTML**: Use proper heading hierarchy (h2, h3)
2. **ARIA Labels**: All interactive elements have accessible names
3. **Keyboard Navigation**: Full keyboard support for all interactions
4. **Focus Management**: Focus trap within modal, return focus on close
5. **Screen Reader Announcements**: Price updates announced via aria-live
6. **Color Contrast**: All text meets WCAG AA standards
7. **Touch Targets**: Minimum 44px for mobile interactions

## Performance Optimizations

1. **Lazy Loading**: Fetch product details only when modal opens
2. **Global Caching**: Cache product details to avoid duplicate API calls
3. **Image Optimization**: Use CustomImage with lazy loading and proper sizes
4. **Memoization**: Memoize expensive calculations (price, validation)
5. **Code Splitting**: Modal code loaded dynamically
6. **Debouncing**: Debounce quantity input changes (optional)

## File Structure

```
components/
├── product-details/
│   ├── ProductDetailsContainer.tsx (Server Component)
│   ├── ProductDetailsTrigger.tsx
│   ├── ProductDetailsModal.tsx (Client Component)
│   ├── ProductDetailsContent.tsx (Client Component)
│   ├── ProductDetailsProvider.tsx (Context)
│   ├── ProductDetailsBody.tsx (Client Component)
│   ├── sections/
│   │   ├── ProductImageSection.tsx
│   │   ├── ProductInfoSection.tsx
│   │   ├── VariantGroupsSection.tsx
│   │   ├── AddonGroupsSection.tsx
│   │   └── AddToCartSection.tsx
│   ├── components/
│   │   ├── VariantGroup.tsx
│   │   ├── AddonGroup.tsx
│   │   ├── PriceCalculator.tsx
│   │   ├── ProductBadge.tsx
│   │   ├── NutritionalInfo.tsx
│   │   └── AllergyInfo.tsx
│   ├── hooks/
│   │   ├── useProductDetails.ts
│   │   ├── usePriceCalculation.ts
│   │   └── useSelectionValidation.ts
│   └── utils/
│       ├── price-calculation.ts
│       └── validation.ts
├── ui/ (existing components)
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── radio-group.tsx
│   ├── checkbox.tsx
│   ├── accordion.tsx
│   ├── skeleton.tsx
│   └── custom-image.tsx
└── composite/
    └── quantity-incrementor.tsx

types/
└── product-details.ts (Component prop types)

lib/
├── api/
│   └── products.ts (API functions)
└── cache/
    └── product-details-cache.ts (Global cache)
```

## Integration Example

```typescript
// In product-card.tsx or any trigger component
import { ProductDetailsContainer } from '@/components/product-details/ProductDetailsContainer';

export function ProductCard({ product }: Props) {
  return (
    <ProductDetailsContainer
      productId={product._id}
      trigger={
        <QuickAddButton
          productId={product._id}
          productName={product.name}
        />
      }
      onAddToCart={handleAddToCart}
    />
  );
}
```

## Design Tokens

Following the existing design system:

```css
/* Colors */
--primary: #F97316 (Orange)
--background-dark: #0e182b (Navy)

/* Spacing */
--card-padding: 1.5rem
--section-gap: 1.5rem

/* Borders */
--border-radius: 1rem (rounded-2xl)

/* Typography */
--heading-1: 1.5rem / 2rem (text-2xl)
--heading-2: 1.25rem / 1.75rem (text-xl)
--body: 0.875rem / 1.25rem (text-sm)
```

## Testing Checklist

- [ ] Desktop dialog opens and closes correctly
- [ ] Mobile drawer opens and closes correctly
- [ ] Viewport switching works at breakpoint
- [ ] Product data loads correctly
- [ ] Loading skeletons display during fetch
- [ ] Error states handle API failures
- [ ] Variant selection updates price
- [ ] Addon selection updates price
- [ ] Quantity changes multiply total price
- [ ] Validation prevents invalid submissions
- [ ] Add to Cart dispatches correct data
- [ ] Keyboard navigation works throughout
- [ ] Screen readers announce changes
- [ ] Touch targets are adequate on mobile
- [ ] Images load with fallback support
- [ ] Cache prevents duplicate API calls
