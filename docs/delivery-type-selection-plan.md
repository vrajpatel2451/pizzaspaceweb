# Delivery Type Selection - Implementation Plan

## Overview

This document outlines the comprehensive implementation plan for the "Delivery Type Selection" feature. The feature requires users to select a delivery type (Dine In, Pickup, or Delivery) on page load before any menu or cart operations can be performed.

---

## Feature Analysis

### Feature Summary
| Attribute | Value |
|-----------|-------|
| **Feature Name** | Delivery Type Selection |
| **Complexity** | Complex |
| **Estimated Agents** | 8 |
| **Estimated Duration** | 3-4 sprints |

### UI Elements Detected
- [x] Modal/Dialog (mandatory selection on page load)
- [x] Forms/Inputs (delivery type radio/cards)
- [x] Data Display (price modifications)
- [x] Lists/Grids (product cards with pricing)
- [x] Interactive Elements (disabled states, validation)

### Technical Requirements
- [x] Global state management (Zustand store already exists)
- [x] Client interactivity (modal, price calculations)
- [x] Form validation (delivery type required)
- [x] API integration (deliveryType parameter)
- [x] Conditional rendering (packaging charges)

### Quality Requirements
- [x] Mobile responsive (always yes)
- [x] Accessibility (always yes)
- [x] Performance critical (price calculations)

---

## Current State Analysis

### Existing Infrastructure

#### 1. Zustand Cart Store (`/store/cart-store.ts`)
- Already has `deliveryType: OrderDeliveryType` field (default: 'pickup')
- Has `setDeliveryType` action
- Persists to localStorage via `partialize`
- Already exports `useDeliveryType()` selector hook

#### 2. DeliveryTypeSelector Component (`/components/cart/delivery-type-selector.tsx`)
- Exists but only used in cart page
- Uses card-based selection UI with icons
- Accepts `value`, `onChange`, `disabled` props
- Already has proper accessibility attributes

#### 3. Product Types (`/types/product.ts`)
- `ProductResponse` has `availableDeliveryTypes: OrderDeliveryType[]`
- `ProductResponse` has `packagingCharges: number`
- `ProductQueryParams` has `deliveryType?: string`

#### 4. Cart Types (`/types/cart.ts`)
- `OrderDeliveryType = "dineIn" | "pickup" | "delivery"`
- `CustomerBillingOnCart` includes `packingCharges`

#### 5. Products API (`/lib/api/products.ts`)
- `getProducts()` accepts `ProductQueryParams` but **does not** currently pass `deliveryType` to API

---

## Phase 1: Global State & Modal Infrastructure

### Subphase 1.1: Create Delivery Type Selection Modal

**Purpose**: Create a blocking modal that appears on page load when delivery type is not selected

**Agent**: `shadcn-implementation-builder`

**MCP Tools**:
- `shadcn` - Get dialog/modal component examples
- `21st-dev` - Search for premium modal inspiration

**Deliverables**:
1. Create `/components/delivery/delivery-type-modal.tsx`
   - Uses shadcn Dialog with no close button (mandatory)
   - Cannot be dismissed without selection
   - Full-screen on mobile, centered dialog on desktop
   - Uses existing `DeliveryTypeSelector` component internally
   - Animated entrance
   - Stores selection in Zustand and localStorage

2. Create `/components/delivery/index.ts` - barrel export

**Component Structure**:
```
components/delivery/
  delivery-type-modal.tsx    # Main modal component
  delivery-type-provider.tsx # Provider to check/show modal
  index.ts                   # Exports
```

**Key Props**:
```typescript
interface DeliveryTypeModalProps {
  open: boolean;
  onSelect: (type: OrderDeliveryType) => void;
}
```

**Files to Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/delivery/delivery-type-modal.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/delivery/delivery-type-provider.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/delivery/index.ts`

---

### Subphase 1.2: Extend Cart Store for Delivery Type Tracking

**Purpose**: Add flags to track if delivery type was explicitly selected

**Agent**: `nextjs-component-architect`

**Deliverables**:
1. Modify `/store/cart-store.ts`:
   - Add `isDeliveryTypeSelected: boolean` flag
   - Add `setDeliveryTypeSelected: (selected: boolean) => void` action
   - Persist `isDeliveryTypeSelected` in localStorage
   - Add `useIsDeliveryTypeSelected()` selector hook

**Files to Modify**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/store/cart-store.ts`

---

### Subphase 1.3: Create Delivery Type Provider

**Purpose**: Create a provider that checks delivery type selection and shows modal if needed

**Agent**: `nextjs-component-architect`

**Deliverables**:
1. Create `/components/delivery/delivery-type-provider.tsx`:
   - Checks `isDeliveryTypeSelected` from store
   - Shows `DeliveryTypeModal` if not selected
   - Provides context with `deliveryType` and `requiresSelection` state
   - Handles page transitions

2. Create `/contexts/delivery-type-context.tsx`:
   - React context for delivery type state
   - Export `useDeliveryTypeContext()` hook

**Files to Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/delivery/delivery-type-provider.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/contexts/delivery-type-context.tsx`

---

### Subphase 1.4: Integrate Provider into App Layout

**Purpose**: Wrap protected routes and menu page with delivery type provider

**Agent**: `nextjs-component-architect`

**Deliverables**:
1. Modify `/app/menu/layout.tsx`:
   - Wrap children with `DeliveryTypeProvider`

2. Modify `/app/(protected)/layout.tsx`:
   - Wrap children with `DeliveryTypeProvider`

**Files to Modify**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/menu/layout.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/layout.tsx`

---

## Phase 2: API Integration

### Subphase 2.1: Update Products API to Pass Delivery Type

**Purpose**: Ensure menu API receives delivery type parameter

**Agent**: `nextjs-component-architect`

**Deliverables**:
1. Modify `/lib/api/products.ts`:
   - Add `deliveryType` parameter handling in `getProducts()`
   - ```typescript
     if (params?.deliveryType) queryParams.append("deliveryType", params.deliveryType);
     ```

**Files to Modify**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/api/products.ts`

---

### Subphase 2.2: Update Menu Page to Pass Delivery Type

**Purpose**: Pass delivery type from global state to products API call

**Agent**: `nextjs-component-architect`

**Approach Decision**: Since menu page is a Server Component, we have two options:
1. **Option A**: Pass delivery type via URL search params
2. **Option B**: Fetch products client-side with delivery type

**Recommended**: **Option B** - Create a client-side data fetching pattern for products filtered by delivery type

**Deliverables**:
1. Modify `/components/menu/menu-page-client.tsx`:
   - Read `deliveryType` from Zustand store
   - Trigger re-fetch when delivery type changes
   - Pass `deliveryType` to products API

2. Create `/hooks/use-products.ts`:
   - Custom hook for fetching products with delivery type
   - Debounced refetch on delivery type change

**Alternative Approach** (simpler):
- Keep server-side fetch but filter client-side based on `product.availableDeliveryTypes`

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/menu/menu-page-client.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/hooks/use-products.ts` (new)

---

## Phase 3: Price Display Logic

### Subphase 3.1: Create Price Calculation Utilities

**Purpose**: Centralize price calculation logic with packaging charges

**Agent**: `nextjs-component-architect`

**Deliverables**:
1. Create `/lib/utils/price.ts`:
   ```typescript
   export function calculateDisplayPrice(
     basePrice: number,
     packagingCharges: number,
     deliveryType: OrderDeliveryType
   ): number {
     if (deliveryType === "delivery") {
       return basePrice + packagingCharges;
     }
     return basePrice;
   }

   export function getPackagingInfo(
     packagingCharges: number,
     deliveryType: OrderDeliveryType
   ): { showPackaging: boolean; amount: number } {
     return {
       showPackaging: deliveryType === "delivery" && packagingCharges > 0,
       amount: packagingCharges,
     };
   }
   ```

**Files to Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/utils/price.ts`

---

### Subphase 3.2: Update ProductCard Component

**Purpose**: Display incremented price when delivery type is "delivery"

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Modify `/components/home/menu-section/product-card.tsx`:
   - Import `useDeliveryType` from store
   - Calculate display price using `calculateDisplayPrice()`
   - Show packaging charges badge/tooltip when applicable
   - Add visual indicator for delivery pricing
   - Show "Not available for delivery" badge if `!product.availableDeliveryTypes.includes(deliveryType)`
   - Optional: Disable card interaction if product not available

2. Create `/components/product/price-display.tsx`:
   - Reusable component for showing price with optional packaging breakdown
   - Props: `basePrice`, `packagingCharges`, `deliveryType`, `showBreakdown`

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/menu-section/product-card.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product/price-display.tsx` (new)

---

### Subphase 3.3: Update ProductDetails Component

**Purpose**: Show incremented price in product details modal/bottomsheet

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Modify `/components/product-details/sections/product-info-section.tsx`:
   - Show price with packaging charges for delivery
   - Add packaging charges line item

2. Modify `/components/product-details/sections/product-details-footer.tsx`:
   - Calculate total including packaging when delivery type is "delivery"
   - Show packaging as separate line in price breakdown

3. Modify `/contexts/product-details-context.tsx`:
   - Include `deliveryType` in context
   - Adjust `totalPrice` calculation to include packaging when delivery

**Files to Modify**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/sections/product-info-section.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/sections/product-details-footer.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/contexts/product-details-context.tsx`

---

### Subphase 3.4: Update CartItemCard Component

**Purpose**: Show incremented price for cart items when delivery type is "delivery"

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Modify `/components/cart/cart-item-card.tsx`:
   - Import `useDeliveryType` from store
   - Add packaging charges to `itemPrice` calculation when delivery
   - Show packaging charges as separate line item
   - Add "Includes packaging" indicator

**Files to Modify**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-card.tsx`

---

## Phase 4: Product Availability Validation

### Subphase 4.1: Block Add to Cart for Unsupported Products

**Purpose**: Prevent adding products to cart that don't support selected delivery type

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Modify `/components/product-details/product-details-container.tsx`:
   - Check `product.availableDeliveryTypes.includes(deliveryType)`
   - If not available, disable "Add to Cart" button
   - Show message: "This item is not available for [deliveryType]"

2. Modify `/components/product-details/sections/product-details-footer.tsx`:
   - Accept `isAvailable` prop
   - Show "Not Available" state with explanation
   - Different button styling for unavailable state

3. Create `/components/product-details/unavailable-notice.tsx`:
   - Shows why product is unavailable for selected delivery type
   - Suggests changing delivery type

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/product-details-container.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/sections/product-details-footer.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product-details/unavailable-notice.tsx` (new)

---

### Subphase 4.2: ProductCard Availability Badge

**Purpose**: Show visual indicator on product cards for unavailable items

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Modify `/components/home/menu-section/product-card.tsx`:
   - Add "Not Available" overlay/badge for products not supporting delivery type
   - Dim card slightly for unavailable items
   - Keep card clickable to show why it's unavailable

2. Create `/components/product/availability-badge.tsx`:
   - Reusable badge component
   - Props: `available`, `deliveryType`

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/menu-section/product-card.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/product/availability-badge.tsx` (new)

---

## Phase 5: Cart Page Validation

### Subphase 5.1: Disable Unsupported Cart Items

**Purpose**: Disable cart items that don't support selected delivery type

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Create `/hooks/use-cart-validation.ts`:
   ```typescript
   export function useCartValidation() {
     const cartItems = useCartItems();
     const deliveryType = useDeliveryType();

     // Check each item's availability
     // Return list of invalid items
     // Return overall cart validity
   }
   ```

2. Modify `/components/cart/cart-item-card.tsx`:
   - Accept `isAvailable` prop
   - Add disabled/grayed out styling when not available
   - Show "Remove or change delivery type" message
   - Disable quantity controls for unavailable items

3. Modify `/components/cart/cart-item-list.tsx`:
   - Pass availability status to each CartItemCard
   - Group unavailable items at bottom with warning

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/hooks/use-cart-validation.ts` (new)
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-card.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/cart-item-list.tsx`

---

### Subphase 5.2: Disable Checkout Button

**Purpose**: Prevent checkout when cart has unsupported items

**Agent**: `shadcn-implementation-builder`

**Deliverables**:
1. Modify `/app/(protected)/cart/page.tsx`:
   - Use `useCartValidation()` hook
   - Disable checkout button when cart is invalid
   - Show warning message about invalid items

2. Modify `/components/cart/order-summary.tsx`:
   - Accept `hasInvalidItems` prop
   - Show error state when items are invalid
   - Add link/button to view problematic items

3. Create `/components/cart/invalid-items-warning.tsx`:
   - Alert component explaining invalid items
   - List of invalid item names
   - Actions: "Remove Items" or "Change Delivery Type"

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/(protected)/cart/page.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/order-summary.tsx`
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/invalid-items-warning.tsx` (new)

---

## Phase 6: Delivery Type Change Handler

### Subphase 6.1: Handle Delivery Type Changes

**Purpose**: Re-validate cart and update prices when delivery type changes

**Agent**: `nextjs-component-architect`

**Deliverables**:
1. Create `/hooks/use-delivery-type-change.ts`:
   - Hook that handles all side effects of delivery type change
   - Triggers cart revalidation
   - Updates prices across components
   - Shows warning if items become invalid

2. Modify `/components/cart/delivery-type-selector.tsx`:
   - Add confirmation dialog when changing to a type that invalidates items
   - "Some items in your cart are not available for [type]. Continue anyway?"

**Files to Modify/Create**:
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/hooks/use-delivery-type-change.ts` (new)
- `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/cart/delivery-type-selector.tsx`

---

## Phase 7: Accessibility & Responsive Design

### Subphase 7.1: Accessibility Audit

**Agent**: `nextjs-accessibility-expert`

**Deliverables**:
1. Audit all new/modified components:
   - Modal focus trap and focus management
   - ARIA labels for delivery type options
   - Screen reader announcements for price changes
   - Keyboard navigation for all interactive elements
   - Color contrast for disabled states
   - Error message associations

2. Add accessibility improvements:
   - `aria-live` regions for dynamic price updates
   - `aria-disabled` for unavailable products
   - Focus restoration after modal closes
   - Skip links if needed

**Files to Audit**:
- All components in `/components/delivery/`
- Modified components in `/components/cart/`
- Modified components in `/components/product-details/`
- Modified components in `/components/home/menu-section/`

---

### Subphase 7.2: Responsive Design Audit

**Agent**: `nextjs-responsive-design`

**Deliverables**:
1. Ensure modal works on all screen sizes:
   - Full-screen on mobile
   - Centered dialog on desktop
   - Touch-friendly buttons (min 44x44px)

2. Ensure price displays are readable:
   - Appropriate font sizes on mobile
   - Packaging badge doesn't overflow

3. Ensure disabled states are visible:
   - Sufficient contrast on all devices
   - Clear visual indication

---

## Phase 8: Animation & Polish

### Subphase 8.1: Add Micro-interactions

**Agent**: `nextjs-animation-specialist`

**Deliverables**:
1. Modal entrance/exit animations
2. Price change animations (number ticker)
3. Availability badge transitions
4. Disabled state transitions
5. Delivery type selection feedback

**Files to Modify**:
- `/components/delivery/delivery-type-modal.tsx`
- `/components/product/price-display.tsx`

---

## Phase 9: Testing Strategy

### Subphase 9.1: Unit Tests

**MCP Tools**: `playwright`

**Test Cases**:
1. **Price Calculations**:
   - `calculateDisplayPrice()` returns base price for dineIn/pickup
   - `calculateDisplayPrice()` adds packaging for delivery
   - `calculateDisplayPrice()` handles zero packaging charges

2. **Availability Checks**:
   - Product with all delivery types is always available
   - Product without "delivery" shows as unavailable for delivery
   - Product without "dineIn" shows as unavailable for dine-in

3. **Store Actions**:
   - `setDeliveryType()` updates state correctly
   - `isDeliveryTypeSelected` persists to localStorage
   - State rehydrates correctly on page load

---

### Subphase 9.2: Integration Tests

**MCP Tools**: `playwright`

**Test Scenarios**:
1. **Fresh User Flow**:
   - User lands on menu page
   - Modal appears requiring selection
   - Cannot close modal without selection
   - After selection, modal closes and products load
   - Delivery type persists on page refresh

2. **Menu Page Flow**:
   - Products show correct prices based on delivery type
   - Unavailable products show badge
   - Clicking unavailable product shows explanation
   - Add to cart blocked for unavailable products

3. **Cart Page Flow**:
   - Cart items show prices with/without packaging
   - Changing delivery type updates all prices
   - Invalid items are visually disabled
   - Checkout blocked when cart has invalid items
   - Removing invalid items enables checkout

4. **Product Details Flow**:
   - Modal shows correct price with packaging
   - Total includes packaging for delivery
   - Add to cart disabled for unavailable products
   - Clear message explains why unavailable

---

### Subphase 9.3: E2E Tests

**MCP Tools**: `playwright`

**Critical User Journeys**:
1. First-time user selects delivery type and completes order
2. User changes delivery type mid-session, cart updates correctly
3. User tries to checkout with invalid items, blocked appropriately
4. User removes invalid items and successfully checks out

---

## Phase 10: Code Review & Optimization

### Subphase 10.1: UI Review

**Agent**: `nextjs-ui-reviewer`

**Checklist**:
- [ ] Consistent styling with existing components
- [ ] Proper error handling
- [ ] Loading states
- [ ] Empty states
- [ ] TypeScript types complete
- [ ] No prop drilling
- [ ] Memoization where needed

---

### Subphase 10.2: Performance Optimization

**Agent**: `nextjs-performance-optimizer`

**Checklist**:
- [ ] Price calculations memoized
- [ ] Avoid re-renders on unrelated state changes
- [ ] Efficient cart validation (don't recalculate unnecessarily)
- [ ] Modal lazy loaded
- [ ] No layout shifts on price updates

---

## Implementation Sequence

### Quick Reference Table

| Phase | Subphase | Agent | Priority |
|-------|----------|-------|----------|
| 1 | 1.1 Modal Component | `shadcn-implementation-builder` | P0 |
| 1 | 1.2 Store Extension | `nextjs-component-architect` | P0 |
| 1 | 1.3 Provider | `nextjs-component-architect` | P0 |
| 1 | 1.4 Layout Integration | `nextjs-component-architect` | P0 |
| 2 | 2.1 API Update | `nextjs-component-architect` | P1 |
| 2 | 2.2 Menu Integration | `nextjs-component-architect` | P1 |
| 3 | 3.1 Price Utilities | `nextjs-component-architect` | P0 |
| 3 | 3.2 ProductCard | `shadcn-implementation-builder` | P0 |
| 3 | 3.3 ProductDetails | `shadcn-implementation-builder` | P0 |
| 3 | 3.4 CartItemCard | `shadcn-implementation-builder` | P0 |
| 4 | 4.1 Add to Cart Block | `shadcn-implementation-builder` | P0 |
| 4 | 4.2 Availability Badge | `shadcn-implementation-builder` | P1 |
| 5 | 5.1 Cart Item Disable | `shadcn-implementation-builder` | P0 |
| 5 | 5.2 Checkout Block | `shadcn-implementation-builder` | P0 |
| 6 | 6.1 Change Handler | `nextjs-component-architect` | P1 |
| 7 | 7.1 Accessibility | `nextjs-accessibility-expert` | P0 |
| 7 | 7.2 Responsive | `nextjs-responsive-design` | P0 |
| 8 | 8.1 Animations | `nextjs-animation-specialist` | P2 |
| 9 | 9.1-9.3 Testing | `playwright` MCP | P0 |
| 10 | 10.1-10.2 Review | `nextjs-ui-reviewer`, `nextjs-performance-optimizer` | P1 |

---

## File Summary

### New Files to Create
```
/components/delivery/
  delivery-type-modal.tsx
  delivery-type-provider.tsx
  index.ts

/components/product/
  price-display.tsx
  availability-badge.tsx

/components/product-details/
  unavailable-notice.tsx

/components/cart/
  invalid-items-warning.tsx

/contexts/
  delivery-type-context.tsx

/hooks/
  use-products.ts
  use-cart-validation.ts
  use-delivery-type-change.ts

/lib/utils/
  price.ts
```

### Existing Files to Modify
```
/store/cart-store.ts
/lib/api/products.ts
/app/menu/layout.tsx
/app/(protected)/layout.tsx
/components/menu/menu-page-client.tsx
/components/home/menu-section/product-card.tsx
/components/product-details/sections/product-info-section.tsx
/components/product-details/sections/product-details-footer.tsx
/components/product-details/product-details-container.tsx
/contexts/product-details-context.tsx
/components/cart/cart-item-card.tsx
/components/cart/cart-item-list.tsx
/components/cart/delivery-type-selector.tsx
/components/cart/order-summary.tsx
/app/(protected)/cart/page.tsx
```

---

## Risk Assessment

### High Risk Areas
1. **Price Calculation Consistency**: Ensure packaging charges are calculated the same way everywhere
2. **Cart State Synchronization**: Cart items may become invalid when delivery type changes
3. **Race Conditions**: User might change delivery type while API calls are in progress

### Mitigation Strategies
1. Centralize all price calculations in `/lib/utils/price.ts`
2. Use optimistic UI with rollback on failure
3. Implement debouncing and cancellation for delivery type changes

---

## Success Criteria

1. **Functional**:
   - [ ] Modal appears on first visit to menu/cart without delivery type selection
   - [ ] Cannot dismiss modal without selecting delivery type
   - [ ] Selection persists across page refreshes
   - [ ] Menu API receives delivery type parameter
   - [ ] Products show packaging-inclusive price for delivery orders
   - [ ] ProductDetails blocks add-to-cart for unsupported delivery types
   - [ ] Cart page disables unsupported items
   - [ ] Checkout blocked when cart contains unsupported items

2. **Quality**:
   - [ ] No console errors
   - [ ] All TypeScript types properly defined
   - [ ] Accessible (WCAG 2.1 AA)
   - [ ] Mobile responsive
   - [ ] Performance: No visible lag on delivery type change

3. **Testing**:
   - [ ] All unit tests pass
   - [ ] All integration tests pass
   - [ ] Manual QA completed on desktop and mobile

---

## Appendix: API Contract Reference

### Expected Product Response Fields
```typescript
interface ProductResponse {
  _id: string;
  name: string;
  basePrice: number;
  packagingCharges: number;
  availableDeliveryTypes: OrderDeliveryType[]; // ["dineIn", "pickup", "delivery"]
  // ... other fields
}
```

### Expected Menu API Behavior
When `deliveryType` query param is passed:
- API should filter products to only those with matching `availableDeliveryTypes`
- OR return all products and let client filter (current approach)

### Order API Contract
Already handles `deliveryType` field in `createOrder()` payload.

---

*Document Version: 1.0*
*Created: 2025-12-31*
*Last Updated: 2025-12-31*
