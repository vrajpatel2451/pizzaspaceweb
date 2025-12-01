# PizzaSpace Cart Feature - Comprehensive Development Plan

## Executive Summary

This document outlines a comprehensive, multi-phase development plan for the PizzaSpace cart feature. The plan is organized into **4 Sprints**, each containing multiple phases and subphases with clear agent assignments, MCP tool usage, deliverables, and testing requirements.

### Feature Overview
- **Cart Management**: Full cart CRUD operations with guest-to-user merge
- **Address Management**: CRUD operations with Google Maps integration
- **Discount System**: Apply/search discounts with validation
- **Order Configuration**: Delivery type selection (dine-in/pickup/delivery)
- **Real-time Summary**: Dynamic pricing updates on cart changes
- **Protected Routes**: Authentication gating with cart ID persistence

### Technology Stack
| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| React | React 19 |
| State Management | Zustand (with persist middleware) |
| Styling | Tailwind CSS 4 |
| UI Components | shadcn/ui (new-york style) |
| Forms | React Hook Form + Zod |
| Maps | Google Maps API |
| HTTP Client | Axios |

---

## Sprint Overview Table

| Sprint | Focus Area | Phases | Subphases | Duration | Complexity |
|--------|------------|--------|-----------|----------|------------|
| **Sprint 1** | Global State & Infrastructure | 4 | 12 | High |
| **Sprint 2** | Cart Core Features | 4 | 16 | High |
| **Sprint 3** | Address Features (Expanded) | 7 | 35 | High |
| **Sprint 4** | Discount Features (Expanded) | 6 | 28 | High |
| **Sprint 5** | Integration & Polish | 3 | 12 | Medium |

---

## Dependency Graph

```
Sprint 1 (Foundation)
    |
    +-- Phase 1.1: Global Store Setup
    |       |
    |       +-- deviceId generation
    |       +-- storeId management
    |       +-- cart store skeleton
    |
    +-- Phase 1.2: Cart Store Implementation
    |       |
    |       +-- Zustand cart store
    |       +-- Persist middleware
    |       +-- Selectors & actions
    |
    +-- Phase 1.3: API Integration Layer
    |       |
    |       +-- Cart API hooks
    |       +-- Address API hooks
    |       +-- Discount API hooks
    |
    +-- Phase 1.4: Auth Integration
            |
            +-- Cart merge on login
            +-- Protected route setup
            +-- Auth guard updates

Sprint 2 (Cart Core) [depends on Sprint 1]
    |
    +-- Phase 2.1: Cart Page Layout
    |       |
    |       +-- Two-column layout
    |       +-- Responsive design
    |       +-- Loading states
    |
    +-- Phase 2.2: Cart Item Components
    |       |
    |       +-- Cart item card
    |       +-- Quantity controls
    |       +-- Remove functionality
    |       +-- Edit item modal
    |
    +-- Phase 2.3: Order Summary Panel
    |       |
    |       +-- Summary component
    |       +-- Real-time updates
    |       +-- Payment method selection
    |
    +-- Phase 2.4: Delivery Type Selection
            |
            +-- Delivery type tabs
            +-- Conditional address display
            +-- State management

Sprint 3 (Address Features - EXPANDED) [depends on Sprint 2]
    |
    +-- Phase 3.1: Address Page Infrastructure
    |       |
    |       +-- Address page route setup
    |       +-- Address page layout
    |       +-- Page header with stats
    |       +-- Empty state design
    |       +-- Loading skeleton
    |
    +-- Phase 3.2: Address Card Component
    |       |
    |       +-- Card base structure
    |       +-- Address type badge
    |       +-- Action buttons
    |       +-- Hover & selection states
    |       +-- Responsive behavior
    |       +-- Delete confirmation dialog
    |
    +-- Phase 3.3: Add Address Feature
    |       |
    |       +-- Add button placement
    |       +-- Modal structure
    |       +-- Location search (Google Places)
    |       +-- Google Maps integration
    |       +-- Current location feature
    |       +-- Auto-fill from map
    |       +-- Address form fields
    |       +-- Address type selector
    |       +-- Default checkbox
    |       +-- Form validation
    |       +-- Submit with loading
    |       +-- Success/error toasts
    |       +-- Modal cleanup
    |
    +-- Phase 3.4: Edit Address Feature
    |       |
    |       +-- Edit button trigger
    |       +-- Pre-populate form
    |       +-- Map centering
    |       +-- Edit validation
    |       +-- Optimistic update
    |       +-- Cancel/revert
    |
    +-- Phase 3.5: Delete Address Feature
    |       |
    |       +-- Delete button
    |       +-- Confirmation dialog
    |       +-- API call with loading
    |       +-- Handle default deletion
    |       +-- Optimistic delete
    |
    +-- Phase 3.6: Set Default Address
    |       |
    |       +-- Default button/star
    |       +-- API update call
    |       +-- Visual feedback
    |       +-- Cart update
    |
    +-- Phase 3.7: Address Selection in Cart
            |
            +-- Compact address list
            +-- Radio selection
            +-- Selected highlight
            +-- Quick add from cart
            +-- Summary refresh trigger

Sprint 4 (Discount Features - EXPANDED) [depends on Sprint 3]
    |
    +-- Phase 4.1: Discount Input Section
    |       |
    |       +-- Section container
    |       +-- Code input field
    |       +-- Apply button
    |       +-- Input validation
    |       +-- Error messages
    |       +-- Success animation
    |
    +-- Phase 4.2: View All Discounts Modal
    |       |
    |       +-- View All button
    |       +-- Modal structure
    |       +-- Search input
    |       +-- Search results list
    |       +-- Empty results state
    |       +-- Loading state
    |       +-- Virtualization (optional)
    |
    +-- Phase 4.3: Discount Card Component
    |       |
    |       +-- Card layout
    |       +-- Coupon code display
    |       +-- Discount type badge
    |       +-- Amount display
    |       +-- Maximum limit
    |       +-- Validity date
    |       +-- Applicable items
    |       +-- Description text
    |       +-- Apply button states
    |       +-- Card click behavior
    |
    +-- Phase 4.4: Applied Discounts Display
    |       |
    |       +-- Applied chip/badge
    |       +-- Multiple discounts
    |       +-- Remove button
    |       +-- Remove confirmation
    |       +-- Savings display
    |
    +-- Phase 4.5: Discount Validation & Logic
    |       |
    |       +-- Eligibility checking
    |       +-- Stacking rules
    |       +-- Minimum order validation
    |       +-- Expiry checking
    |       +-- Customer type validation
    |
    +-- Phase 4.6: Discount Integration with Summary
            |
            +-- Discount line item
            +-- Strikethrough prices
            +-- "You saved" badge
            +-- Real-time updates

Sprint 5 (Integration & Polish) [depends on Sprint 4]
    |
    +-- Phase 5.1: Global Cart Provider
    |       |
    |       +-- Cart context provider
    |       +-- Initial fetch on load
    |       +-- Header badge update
    |       +-- Store change handler
    |       +-- Address provider
    |
    +-- Phase 5.2: End-to-End Testing
    |       |
    |       +-- Playwright tests
    |       +-- API integration tests
    |       +-- Address flow tests
    |       +-- Discount flow tests
    |       +-- Edge case coverage
    |
    +-- Phase 5.3: Performance & Accessibility
            |
            +-- Performance optimization
            +-- WCAG compliance
            +-- Final review
```

---

## SPRINT 1: Global State & Infrastructure

**Goal**: Establish the foundational infrastructure for cart functionality including global state management, API integration layer, and authentication flow updates.

**Complexity**: High
**Dependencies**: None (Foundation Sprint)

---

### Phase 1.1: Global Store Setup

**Objective**: Create global state management for deviceId, storeId, and cart state skeleton.

#### Subphase 1.1.1: Device ID Management

**Agents**:
- `nextjs-component-architect` (state architecture)

**MCPs**:
- `shadcn` (for utility functions)

**Deliverables**:
```
store/
  device-store.ts       # Device ID Zustand store
lib/utils/
  device-id.ts          # UUID generation utility
```

**Implementation Details**:
```typescript
// store/device-store.ts
interface DeviceStore {
  deviceId: string | null;
  isHydrated: boolean;
  initializeDeviceId: () => void;
  setHydrated: (value: boolean) => void;
}
```

**Requirements**:
- Generate UUID v4 for deviceId
- Persist to localStorage
- Available globally via Zustand selector
- Generate on first visit, persist thereafter

**Testing Requirements**:
- [ ] Unit test: deviceId generation is valid UUID
- [ ] Unit test: deviceId persists across page refreshes
- [ ] Unit test: deviceId is consistent across components

---

#### Subphase 1.1.2: Store ID Management

**Agents**:
- `nextjs-component-architect` (state architecture)

**MCPs**:
- `next-devtools` (runtime debugging)

**Deliverables**:
```
store/
  store-selector-store.ts  # Store selection Zustand store
types/
  store-selector.ts        # Type definitions
```

**Implementation Details**:
```typescript
// store/store-selector-store.ts
interface StoreSelectorStore {
  selectedStoreId: string | null;
  isHydrated: boolean;
  setSelectedStore: (storeId: string) => void;
  clearSelectedStore: () => void;
  setHydrated: (value: boolean) => void;
}
```

**Requirements**:
- Sync with existing header store selector component
- Persist to localStorage
- Trigger cart refetch on store change
- Default to first available store if none selected

**Testing Requirements**:
- [ ] Unit test: storeId persists correctly
- [ ] Unit test: storeId change triggers cart refetch
- [ ] Integration test: Header selector syncs with store

---

#### Subphase 1.1.3: Cart Store Skeleton

**Agents**:
- `nextjs-component-architect` (state architecture)

**MCPs**:
- `shadcn` (component inspection)

**Deliverables**:
```
store/
  cart-store.ts            # Cart Zustand store
types/
  cart-store.ts            # Store type definitions
```

**Implementation Details**:
```typescript
// store/cart-store.ts
interface CartState {
  items: CartResponse[];
  summary: CustomerBillingOnCart | null;
  selectedDiscountIds: string[];
  deliveryType: OrderDeliveryType;
  selectedAddressId: string | null;
  isLoading: boolean;
  isHydrated: boolean;
  error: string | null;
}

interface CartActions {
  setItems: (items: CartResponse[]) => void;
  addItem: (item: CartResponse) => void;
  updateItem: (id: string, updates: Partial<CartResponse>) => void;
  removeItem: (id: string) => void;
  setSummary: (summary: CustomerBillingOnCart | null) => void;
  setDeliveryType: (type: OrderDeliveryType) => void;
  setSelectedAddress: (addressId: string | null) => void;
  addDiscount: (discountId: string) => void;
  removeDiscount: (discountId: string) => void;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
}
```

**Requirements**:
- Follow existing auth-store.ts pattern
- Use persist middleware for selectedDiscountIds, deliveryType, selectedAddressId
- Do NOT persist items (fetch from API)
- Implement all CRUD actions

**Testing Requirements**:
- [ ] Unit test: All actions update state correctly
- [ ] Unit test: Persist middleware saves correct fields
- [ ] Unit test: clearCart resets to initial state

---

#### Subphase 1.1.4: Store Provider Integration

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools` (provider debugging)

**Deliverables**:
```
components/providers/
  global-store-provider.tsx   # Combined store provider
app/
  layout.tsx                  # Updated with provider
```

**Requirements**:
- Create unified provider that initializes all stores
- Handle hydration for all stores
- Ensure stores are available before rendering

**Testing Requirements**:
- [ ] Integration test: All stores initialize correctly
- [ ] Integration test: Hydration completes before render
- [ ] E2E test: Stores accessible in all routes

---

### Phase 1.2: Cart Store Implementation

**Objective**: Implement full cart store functionality with optimistic updates and error handling.

#### Subphase 1.2.1: Cart Selectors

**Agents**:
- `nextjs-component-architect`

**MCPs**: None

**Deliverables**:
```
store/cart-store.ts (updated)
  - useCartItems selector
  - useCartCount selector
  - useCartSummary selector
  - useCartTotal selector
  - useIsCartEmpty selector
  - useCartLoading selector
```

**Implementation Details**:
```typescript
// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartCount = () => useCartStore((state) =>
  state.items.reduce((acc, item) => acc + item.quantity, 0)
);
export const useCartSummary = () => useCartStore((state) => state.summary);
export const useCartTotal = () => useCartStore((state) => state.summary?.total ?? 0);
export const useIsCartEmpty = () => useCartStore((state) => state.items.length === 0);
export const useCartLoading = () => useCartStore((state) => state.isLoading);
export const useDeliveryType = () => useCartStore((state) => state.deliveryType);
export const useSelectedAddress = () => useCartStore((state) => state.selectedAddressId);
export const useSelectedDiscounts = () => useCartStore((state) => state.selectedDiscountIds);
```

**Requirements**:
- Memoized selectors for performance
- Type-safe return values
- Shallow equality checks where needed

**Testing Requirements**:
- [ ] Unit test: Each selector returns correct data shape
- [ ] Unit test: Selectors memoize correctly
- [ ] Performance test: No unnecessary re-renders

---

#### Subphase 1.2.2: Optimistic Update Handlers

**Agents**:
- `nextjs-component-architect`

**MCPs**: None

**Deliverables**:
```
store/cart-store.ts (updated)
  - optimisticAddItem
  - optimisticUpdateItem
  - optimisticRemoveItem
lib/utils/
  cart-utils.ts            # Cart calculation utilities
```

**Implementation Details**:
```typescript
// Optimistic update pattern
optimisticUpdateItem: (id, updates, apiCall) => {
  const previousItems = get().items;

  // Optimistic update
  set((state) => ({
    items: state.items.map(item =>
      item._id === id ? { ...item, ...updates } : item
    )
  }));

  // API call with rollback on failure
  try {
    await apiCall();
  } catch (error) {
    set({ items: previousItems, error: error.message });
    throw error;
  }
}
```

**Requirements**:
- Immediate UI feedback
- Rollback on API failure
- Error state management
- Loading state per item (optional)

**Testing Requirements**:
- [ ] Unit test: Optimistic update applies immediately
- [ ] Unit test: Failed API call rolls back state
- [ ] Unit test: Error state is set correctly

---

#### Subphase 1.2.3: Summary Recalculation Logic

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools` (API debugging)

**Deliverables**:
```
hooks/
  use-cart-summary.ts      # Summary fetch hook with debounce
```

**Implementation Details**:
```typescript
// hooks/use-cart-summary.ts
export function useCartSummaryRefresh() {
  const { items, selectedDiscountIds, deliveryType, selectedAddressId } = useCartStore();
  const storeId = useStoreSelector((s) => s.selectedStoreId);

  const debouncedRefresh = useDebouncedCallback(async () => {
    if (items.length === 0) {
      useCartStore.getState().setSummary(null);
      return;
    }

    const params: PricingForCartParams = {
      cartIds: items.map(i => i._id),
      storeId: storeId!,
      discountIds: selectedDiscountIds.length > 0 ? selectedDiscountIds : undefined,
      deliveryType,
      addressId: selectedAddressId ?? undefined,
    };

    const response = await getCartSummary(params);
    if (response.statusCode === 200) {
      useCartStore.getState().setSummary(response.data);
    }
  }, 300);

  useEffect(() => {
    debouncedRefresh();
  }, [items, selectedDiscountIds, deliveryType, selectedAddressId]);
}
```

**Requirements**:
- Debounce API calls (300ms)
- Call on any cart change (items, discounts, delivery type, address)
- Handle empty cart case
- Error handling with toast notifications

**Testing Requirements**:
- [ ] Unit test: Debounce prevents rapid API calls
- [ ] Unit test: Summary updates on cart changes
- [ ] Integration test: API called with correct params

---

### Phase 1.3: API Integration Layer

**Objective**: Create React hooks for all cart-related API operations with proper error handling and caching.

#### Subphase 1.3.1: Cart API Hooks

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools` (API debugging)

**Deliverables**:
```
hooks/api/
  use-cart.ts              # Cart CRUD hooks
  use-cart-mutations.ts    # Mutation hooks with optimistic updates
```

**Implementation Details**:
```typescript
// hooks/api/use-cart.ts
export function useCart() {
  const deviceId = useDeviceId();
  const storeId = useSelectedStoreId();
  const setItems = useCartStore((s) => s.setItems);
  const setLoading = useCartStore((s) => s.setLoading);
  const setError = useCartStore((s) => s.setError);

  const fetchCart = useCallback(async () => {
    if (!deviceId || !storeId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await getCart(deviceId, storeId);
      if (response.statusCode === 200) {
        setItems(response.data);
      } else {
        setError(response.errorMessage ?? 'Failed to fetch cart');
      }
    } catch (error) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [deviceId, storeId, setItems, setLoading, setError]);

  return { fetchCart };
}

// hooks/api/use-cart-mutations.ts
export function useAddToCart() {
  const deviceId = useDeviceId();
  const storeId = useSelectedStoreId();
  const addItem = useCartStore((s) => s.addItem);

  const mutate = useCallback(async (payload: Omit<AddToCartPayload, 'sessionId' | 'storeId'>) => {
    const fullPayload: AddToCartPayload = {
      ...payload,
      sessionId: deviceId!,
      storeId: storeId!,
    };

    const response = await addToCart(fullPayload);
    if (response.statusCode === 200 && response.data) {
      addItem(response.data);
      toast.success('Item added to cart');
      return response.data;
    } else {
      toast.error(response.errorMessage ?? 'Failed to add item');
      throw new Error(response.errorMessage);
    }
  }, [deviceId, storeId, addItem]);

  return { mutate };
}
```

**Requirements**:
- Automatic deviceId/storeId injection
- Toast notifications for success/error
- Return typed responses
- Integrate with cart store

**Testing Requirements**:
- [ ] Unit test: API hooks inject correct parameters
- [ ] Unit test: Success updates store correctly
- [ ] Unit test: Error shows toast notification
- [ ] Integration test: Full CRUD cycle works

---

#### Subphase 1.3.2: Address API Hooks

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
hooks/api/
  use-addresses.ts         # Address fetch hook
  use-address-mutations.ts # Address CRUD hooks
store/
  address-store.ts         # Address Zustand store
```

**Implementation Details**:
```typescript
// store/address-store.ts
interface AddressStore {
  addresses: AddressResponse[];
  isLoading: boolean;
  error: string | null;
  defaultAddressId: string | null;
  setAddresses: (addresses: AddressResponse[]) => void;
  addAddress: (address: AddressResponse) => void;
  updateAddress: (id: string, address: AddressResponse) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}
```

**Requirements**:
- Separate store for addresses (used in multiple places)
- Compute defaultAddressId from addresses
- Handle empty state gracefully

**Testing Requirements**:
- [ ] Unit test: Address CRUD operations work
- [ ] Unit test: Default address is computed correctly
- [ ] Integration test: API operations sync with store

---

#### Subphase 1.3.3: Discount API Hooks

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
hooks/api/
  use-discounts.ts         # Discount fetch hook with search
store/
  discount-store.ts        # Available discounts store
```

**Implementation Details**:
```typescript
// hooks/api/use-discounts.ts
export function useDiscounts(search?: string) {
  const storeId = useSelectedStoreId();
  const cartItems = useCartItems();
  const [discounts, setDiscounts] = useState<DiscountResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDiscounts = useCallback(async () => {
    if (!storeId || cartItems.length === 0) {
      setDiscounts([]);
      return;
    }

    setIsLoading(true);
    const params: GetApplicableDiscountsParams = {
      cartIds: cartItems.map(i => i._id),
      storeId,
      search,
    };

    const response = await getDiscounts(params);
    if (response.statusCode === 200) {
      setDiscounts(response.data);
    }
    setIsLoading(false);
  }, [storeId, cartItems, search]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  return { discounts, isLoading, refetch: fetchDiscounts };
}
```

**Requirements**:
- Search/filter support
- Debounced search input
- Show discount validity info
- Handle no discounts state

**Testing Requirements**:
- [ ] Unit test: Search filters results correctly
- [ ] Unit test: Empty state handled
- [ ] Integration test: Discount application updates summary

---

### Phase 1.4: Authentication Integration

**Objective**: Update authentication flow to support cart merging and protected cart routes.

#### Subphase 1.4.1: Login/Register Cart Merge

**Agents**:
- `nextjs-forms-expert`
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
lib/api/auth.ts (updated)
  - loginWithCartMerge
  - registerWithCartMerge
hooks/
  use-auth-with-cart.ts    # Auth hooks that handle cart merge
```

**Implementation Details**:
```typescript
// lib/api/auth.ts
export async function loginWithCartMerge(
  credentials: LoginUserPayload,
  cartIds: string[]
): Promise<APIResponse<UserResponseWithToken>> {
  const payload = {
    ...credentials,
    cartIds: cartIds.length > 0 ? cartIds : undefined,
  };
  // ... existing login logic with cartIds in body
}

// hooks/use-auth-with-cart.ts
export function useLoginWithCart() {
  const login = useAuthStore((s) => s.login);
  const cartItems = useCartItems();
  const fetchCart = useCart().fetchCart;

  const mutate = useCallback(async (credentials: LoginUserPayload) => {
    const cartIds = cartItems.map(i => i._id);
    const response = await loginWithCartMerge(credentials, cartIds);

    if (response.statusCode === 200 && response.data) {
      login(response.data.user, response.data.token);
      // Refetch cart to get merged items
      await fetchCart();
      return response.data;
    }
    throw new Error(response.errorMessage);
  }, [cartItems, login, fetchCart]);

  return { mutate };
}
```

**Requirements**:
- Pass cartIds array in login/register body
- Refetch cart after successful auth
- Handle merge conflicts gracefully
- Clear guest cart state after merge

**Testing Requirements**:
- [ ] Unit test: cartIds included in auth payload
- [ ] Integration test: Guest cart merges with user cart
- [ ] E2E test: Full login flow with cart preservation

---

#### Subphase 1.4.2: Cart Route Protection

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
app/(protected)/cart/
  page.tsx                 # Cart page (protected)
  layout.tsx               # Cart-specific layout
components/auth/
  cart-auth-guard.tsx      # Cart-specific auth guard
```

**Implementation Details**:
```typescript
// components/auth/cart-auth-guard.tsx
export function CartAuthGuard({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useIsHydrated();
  const cartItems = useCartItems();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isHydrated && !isAuthenticated && cartItems.length > 0) {
      // Store intended destination
      sessionStorage.setItem('cart-redirect', pathname);
      router.push('/login?redirect=cart');
    }
  }, [isHydrated, isAuthenticated, cartItems.length, router, pathname]);

  if (!isHydrated) {
    return <CartSkeleton />;
  }

  if (!isAuthenticated) {
    return <CartSkeleton />;
  }

  return <>{children}</>;
}
```

**Requirements**:
- Redirect to login if not authenticated
- Pass redirect URL to login page
- Show skeleton during hydration
- Handle deep linking to cart

**Testing Requirements**:
- [ ] E2E test: Unauthenticated user redirected to login
- [ ] E2E test: After login, user returns to cart
- [ ] E2E test: Cart items preserved after auth flow

---

#### Subphase 1.4.3: Auth Flow UI Updates

**Agents**:
- `nextjs-forms-expert`
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/auth/
  login-form.tsx (updated)  # Add cart merge support
  register-form.tsx (updated)
app/(auth)/login/
  page.tsx (updated)        # Handle redirect param
```

**Requirements**:
- Show cart item count on login page if redirected from cart
- "Continue to checkout" messaging
- Smooth transition back to cart
- Loading state during auth + cart merge

**Testing Requirements**:
- [ ] E2E test: Login page shows cart context
- [ ] E2E test: Successful login redirects to cart
- [ ] E2E test: Register flow also supports cart merge

---

## SPRINT 2: Cart Core Features

**Goal**: Build the main cart page with all core functionality including item management, quantity controls, and order summary.

**Complexity**: High
**Dependencies**: Sprint 1 complete

---

### Phase 2.1: Cart Page Layout

**Objective**: Create the responsive two-column cart page layout with loading and empty states.

#### Subphase 2.1.1: Page Structure & Layout

**Agents**:
- `nextjs-component-architect`
- `nextjs-responsive-design`

**MCPs**:
- `shadcn` (layout components)
- `next-devtools` (server component debugging)

**Deliverables**:
```
app/(protected)/cart/
  page.tsx                 # Main cart page (Server Component)
  loading.tsx              # Loading skeleton
  error.tsx                # Error boundary
components/cart/
  cart-layout.tsx          # Two-column layout wrapper
  cart-content.tsx         # Left column container
  cart-sidebar.tsx         # Right column container
```

**Component Hierarchy**:
```
CartPage (Server Component)
  +-- CartLayout
        +-- CartContent (left column)
        |     +-- CartHeader
        |     +-- CartItemsList
        |     +-- DiscountsSection
        |     +-- DeliveryTypeSection
        |     +-- AddressSection
        |
        +-- CartSidebar (right column, sticky)
              +-- OrderSummary
              +-- PaymentMethod
              +-- PlaceOrderButton
```

**Requirements**:
- Mobile: Single column, summary at bottom
- Desktop: Two columns (70/30 split)
- Sticky sidebar on desktop
- Smooth scroll behavior
- SEO: noindex, nofollow for cart page

**Testing Requirements**:
- [ ] Visual test: Desktop layout matches design
- [ ] Visual test: Mobile layout stacks correctly
- [ ] Unit test: Server component renders
- [ ] Accessibility test: Landmark regions correct

---

#### Subphase 2.1.2: Loading States

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/
  cart-skeleton.tsx        # Full page skeleton
  cart-item-skeleton.tsx   # Single item skeleton
  summary-skeleton.tsx     # Summary panel skeleton
```

**Implementation Details**:
```typescript
// components/cart/cart-skeleton.tsx
export function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
      <div className="space-y-4">
        <Skeleton className="h-12 w-48" /> {/* Header */}
        {Array.from({ length: 3 }).map((_, i) => (
          <CartItemSkeleton key={i} />
        ))}
        <Skeleton className="h-32 w-full" /> {/* Discounts */}
        <Skeleton className="h-24 w-full" /> {/* Delivery */}
      </div>
      <div className="lg:sticky lg:top-24">
        <SummarySkeleton />
      </div>
    </div>
  );
}
```

**Requirements**:
- Pulse animation on skeletons
- Match actual component dimensions
- Show during initial load and hydration
- Smooth transition to content

**Testing Requirements**:
- [ ] Visual test: Skeletons match component sizes
- [ ] Performance test: No layout shift on load

---

#### Subphase 2.1.3: Empty State

**Agents**:
- `shadcn-implementation-builder`
- `premium-ux-designer`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/
  cart-empty-state.tsx     # Empty cart illustration + CTA
```

**Implementation Details**:
```typescript
// components/cart/cart-empty-state.tsx
export function CartEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-48 h-48 mb-6">
        <CustomImage
          src="/images/empty-cart.svg"
          alt="Empty cart"
          width={192}
          height={192}
        />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Your cart is empty
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Looks like you haven't added anything to your cart yet.
        Browse our menu to find something delicious!
      </p>
      <Button asChild size="lg" className="gap-2">
        <Link href="/menu">
          <UtensilsCrossed className="w-5 h-5" />
          Browse Menu
        </Link>
      </Button>
    </div>
  );
}
```

**Requirements**:
- Engaging illustration
- Clear messaging
- Prominent CTA to menu
- Mobile optimized

**Testing Requirements**:
- [ ] Visual test: Empty state displays correctly
- [ ] E2E test: CTA navigates to menu
- [ ] Accessibility test: Image has alt text

---

#### Subphase 2.1.4: Error Boundary

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
app/(protected)/cart/
  error.tsx                # Error boundary
components/cart/
  cart-error.tsx           # Error display component
```

**Requirements**:
- Catch and display API errors
- Retry button functionality
- Log errors to monitoring (console for now)
- User-friendly error messages

**Testing Requirements**:
- [ ] Unit test: Error boundary catches errors
- [ ] E2E test: Error state shows retry option
- [ ] E2E test: Retry refetches cart

---

### Phase 2.2: Cart Item Components

**Objective**: Build cart item cards with full functionality including edit, quantity, and remove.

#### Subphase 2.2.1: Cart Item Card

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-responsive-design`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/item/
  cart-item-card.tsx       # Main item card component
  item-image.tsx           # Product image with fallback
  item-details.tsx         # Name, variant, price
  item-actions.tsx         # Edit, remove buttons
```

**Implementation Details**:
```typescript
// components/cart/item/cart-item-card.tsx
interface CartItemCardProps {
  item: CartResponse;
  productDetails: ProductDetailsResponse; // Fetched separately
  onEdit: () => void;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

export function CartItemCard({
  item,
  productDetails,
  onEdit,
  onRemove,
  onQuantityChange,
}: CartItemCardProps) {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <ItemImage
          src={productDetails.product.photoList[0]}
          alt={productDetails.product.name}
        />
        <div className="flex-1 min-w-0">
          <ItemDetails
            product={productDetails.product}
            variant={getSelectedVariant(item, productDetails)}
            pricing={item.pricing}
          />
          <div className="flex items-center justify-between mt-3">
            <QuantityControls
              quantity={item.quantity}
              onChange={onQuantityChange}
            />
            <ItemActions onEdit={onEdit} onRemove={onRemove} />
          </div>
        </div>
        <div className="text-right">
          <span className="font-semibold">
            {formatCurrency(calculateItemTotal(item, productDetails))}
          </span>
        </div>
      </div>
    </Card>
  );
}
```

**Requirements**:
- Show product image, name, variant/size selection
- Display per-item total
- Compact mobile layout
- Edit icon opens modal
- Delete with confirmation

**Testing Requirements**:
- [ ] Visual test: Card matches design reference
- [ ] Unit test: Item total calculated correctly
- [ ] Accessibility test: Buttons have labels

---

#### Subphase 2.2.2: Quantity Controls

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-accessibility-expert`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/item/
  quantity-controls.tsx    # +/- buttons with input
```

**Implementation Details**:
```typescript
// components/cart/item/quantity-controls.tsx
interface QuantityControlsProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export function QuantityControls({
  quantity,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
}: QuantityControlsProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </IconButton>

      <span
        className="w-8 text-center font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>

      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </IconButton>
    </div>
  );
}
```

**Requirements**:
- Minimum quantity: 1
- Maximum quantity: 99 (or API limit)
- Disabled state during API call
- Keyboard accessible (+/- keys)
- Screen reader announcements

**Testing Requirements**:
- [ ] Unit test: Quantity bounded correctly
- [ ] Unit test: Disabled state prevents changes
- [ ] Accessibility test: Keyboard navigation works
- [ ] Accessibility test: Screen reader announces changes

---

#### Subphase 2.2.3: Remove Item Flow

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/item/
  remove-item-dialog.tsx   # Confirmation dialog
```

**Implementation Details**:
```typescript
// components/cart/item/remove-item-dialog.tsx
interface RemoveItemDialogProps {
  item: CartResponse;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function RemoveItemDialog({
  item,
  productName,
  open,
  onOpenChange,
  onConfirm,
}: RemoveItemDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove item from cart?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove "{productName}" from your cart?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Requirements**:
- Confirmation dialog before removal
- Show item name in dialog
- Loading state during API call
- Toast notification on success

**Testing Requirements**:
- [ ] E2E test: Confirm removes item
- [ ] E2E test: Cancel closes dialog
- [ ] Accessibility test: Focus management correct

---

#### Subphase 2.2.4: Edit Item Modal (Customize Order)

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-forms-expert`
- `nextjs-animation-specialist`

**MCPs**:
- `shadcn`
- `next-devtools`

**Deliverables**:
```
components/cart/item/
  edit-item-modal.tsx      # Full edit modal
  edit-item-form.tsx       # Form content
  variant-selector.tsx     # Variant selection (reuse from product-details)
  addon-selector.tsx       # Addon selection (reuse from product-details)
```

**Implementation Details**:
```typescript
// components/cart/item/edit-item-modal.tsx
interface EditItemModalProps {
  item: CartResponse;
  productDetails: ProductDetailsResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (updates: UpdateCartPayload) => Promise<void>;
}

export function EditItemModal({
  item,
  productDetails,
  open,
  onOpenChange,
  onUpdate,
}: EditItemModalProps) {
  // Reuse variant/addon selection logic from product details
  const [selectedVariant, setSelectedVariant] = useState(item.variantId);
  const [selectedPricing, setSelectedPricing] = useState(item.pricing);
  const [quantity, setQuantity] = useState(item.quantity);

  const calculatedTotal = useMemo(() => {
    return calculateItemPrice(
      productDetails,
      selectedVariant,
      selectedPricing,
      quantity
    );
  }, [productDetails, selectedVariant, selectedPricing, quantity]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 -m-6 mb-0 p-6 text-white rounded-t-lg">
          <DialogTitle>Customize Order</DialogTitle>
          <DialogDescription className="text-white/80">
            Make it perfect for you
          </DialogDescription>
        </DialogHeader>

        {/* Product info */}
        <div className="flex gap-4 py-4 border-b">
          <CustomImage ... />
          <div>
            <h3>{productDetails.product.name}</h3>
            <p className="text-muted-foreground">
              {productDetails.product.description}
            </p>
            <p className="text-primary font-semibold">
              {formatCurrency(productDetails.product.basePrice)}
            </p>
          </div>
        </div>

        {/* Variant groups */}
        <VariantGroupsSection
          variantGroups={productDetails.variantGroupList}
          variants={productDetails.variantList}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
        />

        {/* Addon groups */}
        <AddonGroupsSection
          addonGroups={productDetails.addonGroupList}
          addons={productDetails.addonList}
          pricing={productDetails.pricing}
          selectedPricing={selectedPricing}
          onPricingChange={setSelectedPricing}
        />

        {/* Footer with quantity and update button */}
        <div className="sticky bottom-0 bg-background border-t pt-4 mt-4 -mx-6 px-6 -mb-6 pb-6">
          <div className="flex items-center justify-between">
            <QuantityControls
              quantity={quantity}
              onChange={setQuantity}
            />
            <Button onClick={handleUpdate} size="lg" className="gap-2">
              <ShoppingCart className="h-5 w-5" />
              Update Cart - {formatCurrency(calculatedTotal)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Requirements**:
- Mirror product details modal design
- Pre-populate current selections
- Real-time price calculation
- Smooth animations
- Mobile: Bottom sheet variant

**Testing Requirements**:
- [ ] E2E test: Edit modal opens with current values
- [ ] E2E test: Changes update cart correctly
- [ ] E2E test: Price recalculates on changes
- [ ] Visual test: Modal matches design reference

---

### Phase 2.3: Order Summary Panel

**Objective**: Build the sticky order summary panel with real-time updates and place order functionality.

#### Subphase 2.3.1: Summary Component

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-responsive-design`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/summary/
  order-summary.tsx        # Main summary component
  summary-line-item.tsx    # Individual line item
  summary-total.tsx        # Grand total section
  savings-badge.tsx        # "You saved" highlight
```

**Implementation Details**:
```typescript
// components/cart/summary/order-summary.tsx
interface OrderSummaryProps {
  summary: CustomerBillingOnCart | null;
  isLoading: boolean;
}

export function OrderSummary({ summary, isLoading }: OrderSummaryProps) {
  if (isLoading) {
    return <SummarySkeleton />;
  }

  if (!summary) {
    return null;
  }

  const hasSavings = summary.totalDiscount > 0;

  return (
    <Card className="p-6 lg:sticky lg:top-24">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-3">
        <SummaryLineItem
          label="Item total"
          value={summary.itemTotal}
        />
        <SummaryLineItem
          label="Packing charges"
          value={summary.packingCharges}
        />
        <SummaryLineItem
          label="Delivery fee"
          value={summary.deliveryCharges}
          tooltip="Delivery charges based on distance"
        />
        <SummaryLineItem
          label="Platform Fee"
          value={summary.tax.total}
          originalValue={summary.tax.total * 1.2} // Show strikethrough if discounted
        />
        <SummaryLineItem
          label="Handling Charges"
          value={summary.extraCharges}
        />
        <SummaryLineItem
          label="Tax"
          value={summary.tax.total}
          tooltip="Includes all applicable taxes"
        />
      </div>

      {hasSavings && (
        <SavingsBadge amount={summary.totalDiscount} />
      )}

      <Separator className="my-4" />

      <SummaryTotal total={summary.total} />
    </Card>
  );
}
```

**Requirements**:
- Display all billing line items
- Strikethrough for discounted values
- Tooltip for delivery fee info
- "You saved" highlight banner
- Sticky on desktop

**Testing Requirements**:
- [ ] Unit test: Line items render correctly
- [ ] Unit test: Savings badge shows when discount > 0
- [ ] Visual test: Summary matches design
- [ ] Accessibility test: Tooltips accessible

---

#### Subphase 2.3.2: Real-time Summary Updates

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
components/cart/summary/
  summary-provider.tsx     # Summary update context
hooks/
  use-summary-refresh.ts   # Summary refresh hook
```

**Implementation Details**:
```typescript
// hooks/use-summary-refresh.ts
export function useSummaryRefresh() {
  const items = useCartItems();
  const discountIds = useSelectedDiscounts();
  const deliveryType = useDeliveryType();
  const addressId = useSelectedAddress();
  const storeId = useSelectedStoreId();
  const setSummary = useCartStore((s) => s.setSummary);

  const refreshSummary = useCallback(async () => {
    if (items.length === 0) {
      setSummary(null);
      return;
    }

    const params: PricingForCartParams = {
      cartIds: items.map(i => i._id),
      storeId: storeId!,
      discountIds: discountIds.length > 0 ? discountIds : undefined,
      deliveryType,
      addressId: addressId ?? undefined,
    };

    try {
      const response = await getCartSummary(params);
      if (response.statusCode === 200) {
        setSummary(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh summary:', error);
    }
  }, [items, discountIds, deliveryType, addressId, storeId, setSummary]);

  // Debounce to prevent rapid API calls
  const debouncedRefresh = useMemo(
    () => debounce(refreshSummary, 300),
    [refreshSummary]
  );

  // Trigger refresh on dependencies change
  useEffect(() => {
    debouncedRefresh();
    return () => debouncedRefresh.cancel();
  }, [debouncedRefresh]);

  return { refreshSummary: debouncedRefresh };
}
```

**Requirements**:
- Debounced API calls (300ms)
- Trigger on: items change, discount change, delivery type change, address change
- Loading state during refresh
- Error handling with retry

**Testing Requirements**:
- [ ] Unit test: Debounce prevents rapid calls
- [ ] Integration test: Summary updates on cart changes
- [ ] Integration test: Summary updates on discount apply

---

#### Subphase 2.3.3: Payment Method Selection

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/summary/
  payment-method.tsx       # Payment method radio group
```

**Implementation Details**:
```typescript
// components/cart/summary/payment-method.tsx
type PaymentMethod = 'online' | 'cod';

interface PaymentMethodProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export function PaymentMethodSection({ value, onChange }: PaymentMethodProps) {
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-3 flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Payment Method
      </h3>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
          <RadioGroupItem value="online" id="online" />
          <Label htmlFor="online" className="flex-1 cursor-pointer flex items-center gap-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            Online Payment
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer mt-2">
          <RadioGroupItem value="cod" id="cod" />
          <Label htmlFor="cod" className="flex-1 cursor-pointer flex items-center gap-2">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            Cash on Delivery
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
```

**Requirements**:
- Two options: Online Payment, Cash on Delivery
- Radio group with icons
- Persist selection in store
- Visual feedback on selection

**Testing Requirements**:
- [ ] Unit test: Selection persists
- [ ] Accessibility test: Radio group keyboard accessible

---

#### Subphase 2.3.4: Place Order Button

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/summary/
  place-order-button.tsx   # CTA button with validation
```

**Implementation Details**:
```typescript
// components/cart/summary/place-order-button.tsx
interface PlaceOrderButtonProps {
  total: number;
  disabled?: boolean;
  onPlaceOrder: () => Promise<void>;
}

export function PlaceOrderButton({
  total,
  disabled,
  onPlaceOrder
}: PlaceOrderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const deliveryType = useDeliveryType();
  const selectedAddress = useSelectedAddress();

  // Validation
  const needsAddress = deliveryType === 'delivery';
  const isAddressMissing = needsAddress && !selectedAddress;

  const handleClick = async () => {
    if (isAddressMissing) {
      toast.error('Please select a delivery address');
      return;
    }

    setIsLoading(true);
    try {
      await onPlaceOrder();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading || total === 0}
      size="lg"
      className="w-full mt-6 gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <ShoppingBag className="h-5 w-5" />
      )}
      Place Order - {formatCurrency(total)}
    </Button>
  );
}
```

**Requirements**:
- Display total in button
- Validate address selected for delivery
- Loading state during processing
- Disabled when cart empty
- Navigate to checkout/payment flow

**Testing Requirements**:
- [ ] E2E test: Button disabled when cart empty
- [ ] E2E test: Shows error if address missing for delivery
- [ ] E2E test: Navigates to checkout on click

---

### Phase 2.4: Delivery Type Selection

**Objective**: Implement delivery type selection with conditional address display.

#### Subphase 2.4.1: Delivery Type Tabs

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/delivery/
  delivery-type-section.tsx   # Main section component
  delivery-type-tabs.tsx      # Tab-style selection
  delivery-type-info.tsx      # Description for selected type
```

**Implementation Details**:
```typescript
// components/cart/delivery/delivery-type-tabs.tsx
const deliveryTypes: Array<{
  value: OrderDeliveryType;
  label: string;
  icon: LucideIcon;
  description: string;
}> = [
  {
    value: 'dineIn',
    label: 'Dine In',
    icon: UtensilsCrossed,
    description: 'Enjoy your meal at our restaurant',
  },
  {
    value: 'pickup',
    label: 'Pickup',
    icon: Package,
    description: 'Pick up your order from the store',
  },
  {
    value: 'delivery',
    label: 'Delivery',
    icon: Truck,
    description: 'Get your order delivered to your doorstep',
  },
];

export function DeliveryTypeTabs() {
  const deliveryType = useDeliveryType();
  const setDeliveryType = useCartStore((s) => s.setDeliveryType);

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Select Delivery Type</h3>
      <div className="grid grid-cols-3 gap-2">
        {deliveryTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setDeliveryType(type.value)}
            className={cn(
              "flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all",
              deliveryType === type.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border hover:border-primary/50"
            )}
          >
            <type.icon className="h-6 w-6 mb-2" />
            <span className="text-sm font-medium">{type.label}</span>
          </button>
        ))}
      </div>

      <DeliveryTypeInfo type={deliveryType} />
    </Card>
  );
}
```

**Requirements**:
- Three options: Dine In, Pickup, Delivery
- Visual icons for each
- Selected state styling
- Description text below
- Triggers summary recalculation

**Testing Requirements**:
- [ ] Unit test: Selection updates store
- [ ] Unit test: Summary refreshes on change
- [ ] Visual test: Tabs match design

---

#### Subphase 2.4.2: Conditional Address Display

**Agents**:
- `nextjs-component-architect`

**MCPs**: None

**Deliverables**:
```
components/cart/delivery/
  address-section-wrapper.tsx  # Conditional render wrapper
```

**Implementation Details**:
```typescript
// components/cart/delivery/address-section-wrapper.tsx
export function AddressSectionWrapper() {
  const deliveryType = useDeliveryType();

  if (deliveryType !== 'delivery') {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      <AddressSelectionSection />
    </motion.div>
  );
}
```

**Requirements**:
- Only show address section when delivery type is "delivery"
- Animate in/out smoothly
- Clear selected address when switching away from delivery

**Testing Requirements**:
- [ ] E2E test: Address section shows only for delivery
- [ ] E2E test: Address section hides for dine-in/pickup

---

#### Subphase 2.4.3: Address Selection Section

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/delivery/
  address-selection-section.tsx  # Address list for cart
  address-selection-card.tsx     # Selectable address card
  add-address-inline.tsx         # Quick add address button
```

**Implementation Details**:
```typescript
// components/cart/delivery/address-selection-section.tsx
export function AddressSelectionSection() {
  const addresses = useAddresses();
  const selectedAddressId = useSelectedAddress();
  const setSelectedAddress = useCartStore((s) => s.setSelectedAddress);
  const [showAddModal, setShowAddModal] = useState(false);

  // Auto-select default address
  useEffect(() => {
    if (!selectedAddressId && addresses.length > 0) {
      const defaultAddress = addresses.find(a => a.isDefault) ?? addresses[0];
      setSelectedAddress(defaultAddress._id);
    }
  }, [addresses, selectedAddressId, setSelectedAddress]);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Delivery Address
        </h4>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        Get your order delivered to your doorstep. Please select a delivery address below.
      </p>

      <div className="space-y-2">
        {addresses.map((address) => (
          <AddressSelectionCard
            key={address._id}
            address={address}
            isSelected={selectedAddressId === address._id}
            onSelect={() => setSelectedAddress(address._id)}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full mt-3 gap-2"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="h-4 w-4" />
        Add New Address
      </Button>

      <AddAddressModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
}
```

**Requirements**:
- List user's saved addresses
- Radio selection (single select)
- Show default badge on default address
- "Add New Address" opens modal
- Auto-select default address initially

**Testing Requirements**:
- [ ] E2E test: Addresses load and display
- [ ] E2E test: Selection updates store and summary
- [ ] E2E test: Add address modal opens

---

#### Subphase 2.4.4: Mobile Optimizations

**Agents**:
- `nextjs-responsive-design`
- `nextjs-animation-specialist`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/delivery/
  delivery-type-mobile.tsx   # Mobile-optimized delivery selection
components/cart/
  cart-mobile-summary.tsx    # Bottom sheet summary for mobile
```

**Requirements**:
- Compact delivery type pills on mobile
- Bottom sheet for order summary on mobile
- Touch-friendly address cards
- Swipe to remove on mobile

**Testing Requirements**:
- [ ] Visual test: Mobile layout is usable
- [ ] E2E test: Touch interactions work
- [ ] Performance test: Smooth animations on mobile

---

## SPRINT 3: Address & Discount Features

**Goal**: Build complete address management and discount system functionality.

**Complexity**: Medium-High
**Dependencies**: Sprint 2 complete

---

### Phase 3.1: Address Management

**Objective**: Create full address CRUD functionality with Google Maps integration.

#### Subphase 3.1.1: Address List Component

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-responsive-design`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  address-list.tsx         # Grid of address cards
  address-list-header.tsx  # Title and add button
  address-list-empty.tsx   # Empty state
```

**Implementation Details**:
```typescript
// components/address/address-list.tsx
export function AddressList() {
  const addresses = useAddresses();
  const isLoading = useAddressLoading();

  if (isLoading) {
    return <AddressListSkeleton />;
  }

  if (addresses.length === 0) {
    return <AddressListEmpty />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {addresses.map((address) => (
        <AddressCard key={address._id} address={address} />
      ))}
    </div>
  );
}
```

**Requirements**:
- Responsive grid (1/2/3 columns)
- Show default address first
- Loading skeleton state
- Empty state with CTA

**Testing Requirements**:
- [ ] Visual test: Grid layout responsive
- [ ] Unit test: Default address sorted first

---

#### Subphase 3.1.2: Address Card Component

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  address-card.tsx         # Individual address card
  address-actions.tsx      # Edit/Delete/SetDefault buttons
  address-type-badge.tsx   # Home/Work/Other badge
```

**Implementation Details**:
```typescript
// components/address/address-card.tsx
interface AddressCardProps {
  address: AddressResponse;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  selectable = false,
  selected = false,
  onSelect,
}: AddressCardProps) {
  return (
    <Card
      className={cn(
        "p-4 relative",
        selectable && "cursor-pointer hover:border-primary",
        selected && "border-primary ring-2 ring-primary/20"
      )}
      onClick={selectable ? onSelect : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <AddressTypeBadge type={address.type} />
          {address.isDefault && (
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Default
            </Badge>
          )}
        </div>

        {!selectable && (
          <AddressActions
            onEdit={onEdit}
            onDelete={onDelete}
            onSetDefault={onSetDefault}
            isDefault={address.isDefault}
          />
        )}
      </div>

      <div className="flex items-start gap-3">
        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
        <div>
          <p className="font-medium">{address.line1}</p>
          {address.line2 && (
            <p className="text-sm text-muted-foreground">{address.line2}</p>
          )}
          <p className="text-sm text-muted-foreground">
            {address.area}, {address.county}
          </p>
          <p className="text-sm text-muted-foreground">
            {address.country}, {address.zip}
          </p>
        </div>
      </div>

      {selectable && selected && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="h-5 w-5 text-primary" />
        </div>
      )}
    </Card>
  );
}
```

**Requirements**:
- Display full address details
- Type badge (Home/Work/Other)
- Default badge
- Action buttons (star/edit/delete)
- Selectable variant for cart
- Selected state styling

**Testing Requirements**:
- [ ] Visual test: Card matches design
- [ ] Unit test: Actions trigger callbacks
- [ ] Accessibility test: Card is keyboard accessible

---

#### Subphase 3.1.3: Add/Edit Address Modal

**Agents**:
- `nextjs-forms-expert`
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  address-modal.tsx        # Add/Edit modal container
  address-form.tsx         # Form fields
  address-map.tsx          # Google Maps integration
  location-search.tsx      # Place search autocomplete
```

**Implementation Details**:
```typescript
// components/address/address-form.tsx
const addressFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  line1: z.string().min(1, 'Street address is required'),
  line2: z.string().optional(),
  area: z.string().min(1, 'Area is required'),
  county: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  zip: z.string().min(1, 'Postcode is required'),
  lat: z.number().optional(),
  long: z.number().optional(),
  type: z.enum(['home', 'work', 'other']),
  otherAddressLabel: z.string().optional(),
  isDefault: z.boolean(),
});

export function AddressForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: AddressFormProps) {
  const form = useForm<z.infer<typeof addressFormSchema>>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: defaultValues ?? {
      name: '',
      phone: '',
      line1: '',
      line2: '',
      area: '',
      county: '',
      country: '',
      zip: '',
      type: 'home',
      isDefault: false,
    },
  });

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    // Auto-fill address fields from Google Places
    form.setValue('line1', place.formatted_address ?? '');
    form.setValue('lat', place.geometry?.location?.lat());
    form.setValue('long', place.geometry?.location?.lng());
    // Parse address components...
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Map section */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Select Delivery Location
          </h4>
          <LocationSearch onSelect={handleLocationSelect} />
          <AddressMap
            lat={form.watch('lat')}
            lng={form.watch('long')}
            onPositionChange={(lat, lng) => {
              form.setValue('lat', lat);
              form.setValue('long', lng);
            }}
          />
          <p className="text-sm text-muted-foreground">
            Drag the map to position the pin at your exact delivery location.
          </p>
        </div>

        {/* Address fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField name="line1" label="Street Address *" />
          <FormField name="line2" label="Flat/Unit (Optional)" />
          <FormField name="area" label="Town/Area *" />
          <FormField name="county" label="City *" />
          <FormField name="country" label="Country *" />
          <FormField name="zip" label="Postcode *" />
        </div>

        {/* Lat/Long (read-only) */}
        <div className="grid grid-cols-2 gap-4">
          <FormField name="lat" label="Latitude" disabled />
          <FormField name="long" label="Longitude" disabled />
        </div>

        {/* Address type */}
        <FormField name="type" label="Address Type">
          <Select>
            <SelectItem value="home">Home</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </Select>
        </FormField>

        {/* Toggles */}
        <div className="flex items-center justify-between">
          <FormField name="isDefault" label="Default">
            <Switch />
          </FormField>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? <Loader2 className="animate-spin" /> : null}
            Save Address
          </Button>
          <Button type="button" variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

**Requirements**:
- Google Maps embed with draggable pin
- Location search with autocomplete
- Auto-fill fields from Google Places
- Manual field editing
- Address type selection
- Default toggle
- Form validation with Zod
- Edit mode pre-fills existing data

**Testing Requirements**:
- [ ] Unit test: Form validation works
- [ ] E2E test: Create address flow
- [ ] E2E test: Edit address flow
- [ ] E2E test: Map interaction updates coordinates

---

#### Subphase 3.1.4: Delete Address Confirmation

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  delete-address-dialog.tsx  # Confirmation dialog
```

**Requirements**:
- Confirm before delete
- Show address being deleted
- Cannot delete if only one address (optional)
- Warn if deleting default address

**Testing Requirements**:
- [ ] E2E test: Delete flow with confirmation
- [ ] E2E test: Cancel does not delete

---

### Phase 3.2: Discount System

**Objective**: Build the discount search, display, and apply functionality.

#### Subphase 3.2.1: Discount Input Section

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-section.tsx     # Main discount section
  discount-input.tsx       # Code input with apply button
  applied-discount.tsx     # Show applied discount(s)
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-section.tsx
export function DiscountSection() {
  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState('');
  const selectedDiscounts = useSelectedDiscounts();
  const addDiscount = useCartStore((s) => s.addDiscount);

  const handleApplyCode = async () => {
    // Validate code against available discounts
    const discounts = await fetchDiscountByCode(code);
    if (discounts.length > 0) {
      addDiscount(discounts[0]._id);
      setCode('');
      toast.success('Discount applied!');
    } else {
      toast.error('Invalid discount code');
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center gap-2">
          <Tag className="h-5 w-5" />
          Discounts & Offers
        </h3>
        <Button
          variant="link"
          className="text-sm p-0 h-auto"
          onClick={() => setShowModal(true)}
        >
          View All
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Enter discount code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleApplyCode} disabled={!code}>
          Apply
        </Button>
      </div>

      {selectedDiscounts.length > 0 && (
        <div className="mt-3 space-y-2">
          {selectedDiscounts.map((id) => (
            <AppliedDiscount key={id} discountId={id} />
          ))}
        </div>
      )}

      <DiscountModal open={showModal} onOpenChange={setShowModal} />
    </Card>
  );
}
```

**Requirements**:
- Text input for discount code
- Apply button
- Show applied discounts below
- "View All" opens modal
- Remove applied discount

**Testing Requirements**:
- [ ] E2E test: Valid code applies discount
- [ ] E2E test: Invalid code shows error
- [ ] E2E test: Remove discount works

---

#### Subphase 3.2.2: Discount Modal

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-modal.tsx       # Modal container
  discount-search.tsx      # Search input
  discount-list.tsx        # List of available discounts
  discount-card.tsx        # Individual discount display
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-modal.tsx
export function DiscountModal({ open, onOpenChange }: DiscountModalProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const { discounts, isLoading } = useDiscounts(debouncedSearch);
  const selectedDiscounts = useSelectedDiscounts();
  const addDiscount = useCartStore((s) => s.addDiscount);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="bg-gradient-to-r from-primary to-orange-400 -m-6 mb-4 p-6 rounded-t-lg">
          <DialogTitle className="text-white">Available Discounts</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search discounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <DiscountListSkeleton />
          ) : discounts.length === 0 ? (
            <DiscountEmptyState />
          ) : (
            discounts.map((discount) => (
              <DiscountCard
                key={discount._id}
                discount={discount}
                isApplied={selectedDiscounts.includes(discount._id)}
                onApply={() => {
                  addDiscount(discount._id);
                  onOpenChange(false);
                }}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Requirements**:
- Search input with debounce
- List of applicable discounts
- Show discount details (code, %, max amount, validity)
- Apply button per discount
- Empty state when no discounts
- Loading state

**Testing Requirements**:
- [ ] E2E test: Search filters discounts
- [ ] E2E test: Apply from modal works
- [ ] Visual test: Modal matches design

---

#### Subphase 3.2.3: Discount Card Design

**Agents**:
- `shadcn-implementation-builder`
- `premium-ux-designer`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-card.tsx        # Styled discount card
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-card.tsx
interface DiscountCardProps {
  discount: DiscountResponse;
  isApplied: boolean;
  onApply: () => void;
}

export function DiscountCard({ discount, isApplied, onApply }: DiscountCardProps) {
  const discountValue = discount.discountAmountType === 'percentage'
    ? `${discount.discountAmount}% OFF`
    : `${formatCurrency(discount.discountAmount)} OFF`;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-primary">{discount.couponCode}</span>
          <Badge variant="secondary" className="text-xs">
            {discount.discountType === 'normal' ? 'Normal' : discount.discountType}
          </Badge>
        </div>
        <p className="text-sm font-medium">{discount.name}</p>
        <p className="text-xs text-muted-foreground">{discount.description}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span>Max: {formatCurrency(discount.maximumAmount)}</span>
          <span>Valid till: {formatDate(discount.endTime)}</span>
          <span>{discount.conditionType === 'allProducts' ? 'All Products' : 'Selected Items'}</span>
        </div>
      </div>

      <div className="text-right ml-4">
        <p className="text-lg font-bold text-green-600">{discountValue}</p>
        <Button
          size="sm"
          variant={isApplied ? "outline" : "default"}
          onClick={onApply}
          disabled={isApplied}
        >
          {isApplied ? 'Applied' : 'Apply'}
        </Button>
      </div>
    </div>
  );
}
```

**Requirements**:
- Show coupon code prominently
- Display discount amount/percentage
- Show max discount limit
- Show validity date
- Show applicable items info
- Applied state styling

**Testing Requirements**:
- [ ] Visual test: Card displays all info
- [ ] Unit test: Percentage vs fixed formatting

---

#### Subphase 3.2.4: Applied Discount Display

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  applied-discount.tsx     # Applied discount chip
```

**Implementation Details**:
```typescript
// components/cart/discount/applied-discount.tsx
interface AppliedDiscountProps {
  discountId: string;
}

export function AppliedDiscount({ discountId }: AppliedDiscountProps) {
  const [discount, setDiscount] = useState<DiscountResponse | null>(null);
  const removeDiscount = useCartStore((s) => s.removeDiscount);

  useEffect(() => {
    // Fetch discount details if needed
    // Or get from a discount cache store
  }, [discountId]);

  if (!discount) return null;

  return (
    <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium">{discount.couponCode}</span>
        <span className="text-sm text-green-600">
          {discount.discountAmountType === 'percentage'
            ? `${discount.discountAmount}% off`
            : `${formatCurrency(discount.discountAmount)} off`}
        </span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => removeDiscount(discountId)}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**Requirements**:
- Green highlight for applied discount
- Show code and discount value
- Remove button
- Removal triggers summary refresh

**Testing Requirements**:
- [ ] E2E test: Applied discount displays correctly
- [ ] E2E test: Remove updates summary

---

### Phase 3.3: Address Page

**Objective**: Create the standalone address management page.

#### Subphase 3.3.1: Address Page Structure

**Agents**:
- `nextjs-component-architect`
- `nextjs-responsive-design`

**MCPs**:
- `next-devtools`
- `shadcn`

**Deliverables**:
```
app/(protected)/addresses/
  page.tsx                 # Address management page
  loading.tsx              # Loading skeleton
components/address/
  address-page-header.tsx  # Page title and add button
```

**Implementation Details**:
```typescript
// app/(protected)/addresses/page.tsx
export default function AddressesPage() {
  return (
    <div className="container py-8">
      <AddressPageHeader />

      <div className="mt-6">
        <h2 className="text-lg font-medium mb-4">Your Addresses</h2>
        <p className="text-sm text-muted-foreground mb-2">
          Default: {defaultAddress?.line1 ?? 'None set'}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-4">My Addresses</h3>
        <AddressList />
      </div>
    </div>
  );
}
```

**Requirements**:
- Protected route (requires auth)
- Display default address info
- Grid of all addresses
- Add address button in header
- Responsive layout

**Testing Requirements**:
- [ ] E2E test: Page loads with addresses
- [ ] E2E test: Protected route redirects if not logged in

---

#### Subphase 3.3.2: Address CRUD Operations

**Agents**:
- `nextjs-forms-expert`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
hooks/
  use-address-mutations.ts   # Updated with all operations
```

**Implementation Details**:
```typescript
// hooks/use-address-mutations.ts
export function useCreateAddress() {
  const addAddress = useAddressStore((s) => s.addAddress);

  const mutate = async (data: AddAddressData) => {
    const response = await createAddress(data);
    if (response.statusCode === 200 && response.data) {
      addAddress(response.data);
      toast.success('Address added successfully');
      return response.data;
    }
    toast.error(response.errorMessage ?? 'Failed to add address');
    throw new Error(response.errorMessage);
  };

  return { mutate };
}

export function useUpdateAddress() {
  const updateAddress = useAddressStore((s) => s.updateAddress);

  const mutate = async (id: string, data: AddAddressData) => {
    const response = await updateAddress(id, data);
    if (response.statusCode === 200 && response.data) {
      updateAddress(id, response.data);
      toast.success('Address updated successfully');
      return response.data;
    }
    toast.error(response.errorMessage ?? 'Failed to update address');
    throw new Error(response.errorMessage);
  };

  return { mutate };
}

export function useDeleteAddress() {
  const removeAddress = useAddressStore((s) => s.removeAddress);

  const mutate = async (id: string) => {
    const response = await deleteAddress(id);
    if (response.statusCode === 200) {
      removeAddress(id);
      toast.success('Address deleted successfully');
      return true;
    }
    toast.error(response.errorMessage ?? 'Failed to delete address');
    throw new Error(response.errorMessage);
  };

  return { mutate };
}

export function useSetDefaultAddress() {
  const updateAddress = useAddressStore((s) => s.updateAddress);
  const addresses = useAddresses();

  const mutate = async (id: string) => {
    // Unset current default first
    const currentDefault = addresses.find(a => a.isDefault);
    if (currentDefault && currentDefault._id !== id) {
      await patchAddress(currentDefault._id, { isDefault: false });
    }

    // Set new default
    const response = await patchAddress(id, { isDefault: true });
    if (response.statusCode === 200 && response.data) {
      // Refresh all addresses to get updated isDefault flags
      await fetchAddresses();
      toast.success('Default address updated');
      return response.data;
    }
    toast.error(response.errorMessage ?? 'Failed to set default');
    throw new Error(response.errorMessage);
  };

  return { mutate };
}
```

**Requirements**:
- Create new address
- Update existing address
- Delete address
- Set default address
- Toast notifications for all operations
- Optimistic updates where possible

**Testing Requirements**:
- [ ] E2E test: Create address flow
- [ ] E2E test: Update address flow
- [ ] E2E test: Delete address flow
- [ ] E2E test: Set default flow

---

#### Subphase 3.3.3: Default Address Logic

**Agents**:
- `nextjs-component-architect`

**MCPs**: None

**Deliverables**:
```
lib/utils/
  address-utils.ts         # Address helper functions
```

**Implementation Details**:
```typescript
// lib/utils/address-utils.ts
export function getDefaultAddress(addresses: AddressResponse[]): AddressResponse | null {
  return addresses.find(a => a.isDefault) ?? addresses[0] ?? null;
}

export function sortAddresses(addresses: AddressResponse[]): AddressResponse[] {
  return [...addresses].sort((a, b) => {
    // Default first
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    // Then by type (home > work > other)
    const typeOrder = { home: 0, work: 1, other: 2 };
    return typeOrder[a.type] - typeOrder[b.type];
  });
}

export function formatAddress(address: AddressResponse): string {
  const parts = [
    address.line1,
    address.line2,
    address.area,
    address.county,
    address.country,
    address.zip,
  ].filter(Boolean);
  return parts.join(', ');
}
```

**Requirements**:
- Get default address helper
- Sort addresses (default first)
- Format address for display
- Handle edge cases (no addresses, no default)

**Testing Requirements**:
- [ ] Unit test: Default address selection logic
- [ ] Unit test: Sorting works correctly
- [ ] Unit test: Format handles missing fields

---

## SPRINT 4: Integration & Polish

**Goal**: Integrate all components, implement global cart provider, comprehensive testing, and final polish.

**Complexity**: Medium
**Dependencies**: Sprint 3 complete

---

### Phase 4.1: Global Cart Provider

**Objective**: Create a global cart context that initializes cart on every page load and updates header badge.

#### Subphase 4.1.1: Cart Context Provider

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
components/providers/
  cart-provider.tsx        # Global cart provider
app/
  layout.tsx (updated)     # Include cart provider
```

**Implementation Details**:
```typescript
// components/providers/cart-provider.tsx
interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const deviceId = useDeviceId();
  const storeId = useSelectedStoreId();
  const isHydrated = useIsHydrated();
  const setItems = useCartStore((s) => s.setItems);
  const setLoading = useCartStore((s) => s.setLoading);

  // Fetch cart on initial load
  useEffect(() => {
    if (!isHydrated || !deviceId || !storeId) return;

    const fetchInitialCart = async () => {
      setLoading(true);
      try {
        const response = await getCart(deviceId, storeId);
        if (response.statusCode === 200) {
          setItems(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialCart();
  }, [isHydrated, deviceId, storeId, setItems, setLoading]);

  // Refetch cart when store changes
  useEffect(() => {
    if (!isHydrated || !deviceId || !storeId) return;

    const refetchCart = async () => {
      const response = await getCart(deviceId, storeId);
      if (response.statusCode === 200) {
        setItems(response.data);
      }
    };

    refetchCart();
  }, [storeId]); // Only on storeId change

  return <>{children}</>;
}
```

**Requirements**:
- Fetch cart on app initialization
- Wait for deviceId and storeId to be available
- Refetch when storeId changes
- Handle loading and error states
- Don't block rendering

**Testing Requirements**:
- [ ] Integration test: Cart fetches on page load
- [ ] Integration test: Cart refetches on store change
- [ ] E2E test: Cart data available globally

---

#### Subphase 4.1.2: Header Cart Badge

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/layout/header/
  cart-badge.tsx (updated)   # Live cart count badge
```

**Implementation Details**:
```typescript
// components/layout/header/cart-badge.tsx
export function CartBadge() {
  const cartCount = useCartCount();
  const isHydrated = useCartHydrated();

  return (
    <Link href="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {isHydrated && cartCount > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium"
        >
          {cartCount > 99 ? '99+' : cartCount}
        </motion.span>
      )}
    </Link>
  );
}
```

**Requirements**:
- Show total item count (sum of quantities)
- Animate badge on count change
- Max display: 99+
- Hide badge when cart empty
- Wait for hydration to prevent flash

**Testing Requirements**:
- [ ] Unit test: Count calculation correct
- [ ] Visual test: Badge animates on change
- [ ] E2E test: Badge updates on add/remove

---

#### Subphase 4.1.3: Store Change Handler

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
hooks/
  use-store-change.ts      # Handle store selection changes
```

**Implementation Details**:
```typescript
// hooks/use-store-change.ts
export function useStoreChange() {
  const setSelectedStore = useStoreSelectorStore((s) => s.setSelectedStore);
  const clearCart = useCartStore((s) => s.clearCart);
  const fetchCart = useCart().fetchCart;

  const handleStoreChange = useCallback(async (storeId: string) => {
    // Clear current cart (different store = different cart)
    clearCart();

    // Update selected store
    setSelectedStore(storeId);

    // Fetch new cart for this store
    await fetchCart();

    toast.info('Store changed. Your cart has been updated.');
  }, [setSelectedStore, clearCart, fetchCart]);

  return { handleStoreChange };
}
```

**Requirements**:
- Clear cart when store changes
- Fetch new cart for selected store
- Show notification to user
- Update all dependent components

**Testing Requirements**:
- [ ] E2E test: Store change clears cart
- [ ] E2E test: New store cart loads

---

#### Subphase 4.1.4: Address Provider

**Agents**:
- `nextjs-component-architect`

**MCPs**: None

**Deliverables**:
```
components/providers/
  address-provider.tsx     # Global address provider
```

**Implementation Details**:
```typescript
// components/providers/address-provider.tsx
export function AddressProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useIsHydrated();
  const setAddresses = useAddressStore((s) => s.setAddresses);
  const setLoading = useAddressStore((s) => s.setLoading);

  // Fetch addresses when authenticated
  useEffect(() => {
    if (!isHydrated || !isAuthenticated) {
      setAddresses([]);
      return;
    }

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const response = await getAddresses();
        if (response.statusCode === 200) {
          setAddresses(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [isHydrated, isAuthenticated, setAddresses, setLoading]);

  return <>{children}</>;
}
```

**Requirements**:
- Fetch addresses when authenticated
- Clear addresses when logged out
- Handle loading state
- Available globally

**Testing Requirements**:
- [ ] Integration test: Addresses fetch on login
- [ ] Integration test: Addresses clear on logout

---

### Phase 4.2: End-to-End Testing

**Objective**: Comprehensive testing coverage for all cart functionality.

#### Subphase 4.2.1: Playwright Test Setup

**Agents**:
- `nextjs-ui-reviewer`

**MCPs**:
- `playwright`

**Deliverables**:
```
e2e/
  cart/
    cart.spec.ts           # Cart page tests
    cart-items.spec.ts     # Item management tests
    cart-summary.spec.ts   # Summary tests
  address/
    address.spec.ts        # Address page tests
    address-modal.spec.ts  # Add/edit modal tests
  discount/
    discount.spec.ts       # Discount flow tests
  fixtures/
    cart-fixtures.ts       # Test data and helpers
```

**Test Scenarios**:
```typescript
// e2e/cart/cart.spec.ts
test.describe('Cart Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login and add item to cart
  });

  test('displays cart items correctly', async ({ page }) => {
    await page.goto('/cart');
    await expect(page.getByText('Your Cart')).toBeVisible();
    // ... more assertions
  });

  test('updates quantity', async ({ page }) => {
    await page.goto('/cart');
    await page.getByRole('button', { name: 'Increase quantity' }).click();
    await expect(page.getByText('2')).toBeVisible();
  });

  test('removes item from cart', async ({ page }) => {
    await page.goto('/cart');
    await page.getByRole('button', { name: 'Remove' }).click();
    await page.getByRole('button', { name: 'Confirm' }).click();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

  test('redirects to login if not authenticated', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/login/);
  });
});
```

**Requirements**:
- Test all user flows
- Test error states
- Test edge cases
- Test responsive behavior
- Test accessibility

**Testing Requirements**:
- [ ] All cart CRUD operations
- [ ] All address CRUD operations
- [ ] Discount apply/remove
- [ ] Delivery type selection
- [ ] Auth flow with cart
- [ ] Store change behavior

---

#### Subphase 4.2.2: API Integration Tests

**Agents**:
- `nextjs-ui-reviewer`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
__tests__/
  api/
    cart-api.test.ts       # Cart API tests
    address-api.test.ts    # Address API tests
    discount-api.test.ts   # Discount API tests
```

**Test Scenarios**:
```typescript
// __tests__/api/cart-api.test.ts
describe('Cart API', () => {
  it('fetches cart with correct parameters', async () => {
    const deviceId = 'test-device-id';
    const storeId = 'test-store-id';

    const response = await getCart(deviceId, storeId);

    expect(response.statusCode).toBe(200);
    expect(response.data).toBeInstanceOf(Array);
  });

  it('adds item to cart', async () => {
    const payload: AddToCartPayload = {
      itemId: 'test-item',
      categoryId: 'test-category',
      variantId: 'test-variant',
      pricing: [],
      quantity: 1,
      sessionId: 'test-device',
      storeId: 'test-store',
    };

    const response = await addToCart(payload);

    expect(response.statusCode).toBe(200);
    expect(response.data).toHaveProperty('_id');
  });
});
```

**Requirements**:
- Test all API functions
- Test error responses
- Mock API for unit tests
- Integration tests with real API (optional)

**Testing Requirements**:
- [ ] All cart API functions
- [ ] All address API functions
- [ ] All discount API functions
- [ ] Error handling

---

#### Subphase 4.2.3: Component Unit Tests

**Agents**:
- `nextjs-ui-reviewer`

**MCPs**: None

**Deliverables**:
```
__tests__/
  components/
    cart/
      cart-item-card.test.tsx
      quantity-controls.test.tsx
      order-summary.test.tsx
    address/
      address-card.test.tsx
      address-form.test.tsx
    discount/
      discount-card.test.tsx
```

**Test Scenarios**:
```typescript
// __tests__/components/cart/quantity-controls.test.tsx
describe('QuantityControls', () => {
  it('renders with correct quantity', () => {
    render(<QuantityControls quantity={3} onChange={vi.fn()} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('increments quantity', async () => {
    const onChange = vi.fn();
    render(<QuantityControls quantity={1} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Increase quantity'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('decrements quantity', async () => {
    const onChange = vi.fn();
    render(<QuantityControls quantity={3} onChange={onChange} />);

    await userEvent.click(screen.getByLabelText('Decrease quantity'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables decrement at minimum', () => {
    render(<QuantityControls quantity={1} min={1} onChange={vi.fn()} />);
    expect(screen.getByLabelText('Decrease quantity')).toBeDisabled();
  });
});
```

**Requirements**:
- Test component rendering
- Test user interactions
- Test prop variations
- Test edge cases

**Testing Requirements**:
- [ ] All major components tested
- [ ] 80%+ code coverage target
- [ ] Snapshot tests for UI consistency

---

#### Subphase 4.2.4: Store Unit Tests

**Agents**:
- `nextjs-ui-reviewer`

**MCPs**: None

**Deliverables**:
```
__tests__/
  store/
    cart-store.test.ts
    address-store.test.ts
    device-store.test.ts
```

**Test Scenarios**:
```typescript
// __tests__/store/cart-store.test.ts
describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('adds item to cart', () => {
    const item: CartResponse = { /* ... */ };
    useCartStore.getState().addItem(item);

    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0]).toEqual(item);
  });

  it('removes item from cart', () => {
    const item: CartResponse = { _id: 'test-id', /* ... */ };
    useCartStore.getState().addItem(item);
    useCartStore.getState().removeItem('test-id');

    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it('updates item quantity', () => {
    const item: CartResponse = { _id: 'test-id', quantity: 1, /* ... */ };
    useCartStore.getState().addItem(item);
    useCartStore.getState().updateItem('test-id', { quantity: 5 });

    expect(useCartStore.getState().items[0].quantity).toBe(5);
  });
});
```

**Requirements**:
- Test all store actions
- Test selectors
- Test persistence
- Test hydration

**Testing Requirements**:
- [ ] All store actions tested
- [ ] Persistence tested
- [ ] Selector memoization tested

---

### Phase 4.3: Performance & Accessibility

**Objective**: Optimize performance and ensure WCAG compliance.

#### Subphase 4.3.1: Performance Optimization

**Agents**:
- `nextjs-performance-optimizer`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
components/cart/
  (all components reviewed for performance)
hooks/
  use-optimized-cart.ts    # Optimized cart hook
lib/utils/
  cart-memoization.ts      # Memoization helpers
```

**Optimization Targets**:
- Memoize expensive calculations
- Virtualize long lists (if >20 items)
- Lazy load edit modal content
- Debounce API calls
- Optimize re-renders with selectors
- Image optimization with CustomImage

**Performance Metrics**:
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

**Testing Requirements**:
- [ ] Lighthouse score >90
- [ ] No unnecessary re-renders
- [ ] API calls debounced

---

#### Subphase 4.3.2: Accessibility Audit

**Agents**:
- `nextjs-accessibility-expert`

**MCPs**:
- `playwright` (a11y testing)

**Deliverables**:
```
docs/cart/
  accessibility-report.md  # Accessibility findings
components/
  (all components updated for a11y)
```

**Accessibility Checklist**:
- [ ] All interactive elements keyboard accessible
- [ ] Focus management in modals
- [ ] ARIA labels on all buttons
- [ ] Screen reader announcements for cart updates
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets minimum 44x44px
- [ ] Error messages associated with inputs
- [ ] Skip links for cart content
- [ ] Reduced motion preference respected

**Testing Requirements**:
- [ ] axe-core audit passes
- [ ] Manual keyboard navigation test
- [ ] VoiceOver/NVDA testing

---

#### Subphase 4.3.3: Final Code Review

**Agents**:
- `nextjs-ui-reviewer`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
docs/cart/
  review-checklist.md      # Review findings
  implementation-notes.md  # Developer notes
```

**Review Checklist**:
- [ ] TypeScript strict mode compliance
- [ ] No console.log in production
- [ ] Error boundaries in place
- [ ] Loading states for all async operations
- [ ] Empty states for all lists
- [ ] Proper error messages
- [ ] Consistent code style
- [ ] No duplicate code
- [ ] Proper component composition
- [ ] Hooks follow rules of hooks
- [ ] No memory leaks
- [ ] Cleanup in useEffect

**Testing Requirements**:
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Build succeeds

---

## Component Hierarchy Diagram

```
App Layout
  +-- GlobalStoreProvider
        +-- CartProvider
        +-- AddressProvider
        +-- DeviceProvider

Header
  +-- Logo
  +-- Navigation
  +-- StoreSelector
  +-- SearchCommand
  +-- CartBadge (uses useCartCount)
  +-- UserMenu

Cart Page (/cart)
  +-- CartLayout
        +-- CartContent
        |     +-- CartHeader
        |     |     +-- Title
        |     |     +-- AddMoreItemsLink
        |     |
        |     +-- CartItemsList
        |     |     +-- CartItemCard[]
        |     |           +-- ItemImage
        |     |           +-- ItemDetails
        |     |           +-- QuantityControls
        |     |           +-- ItemActions
        |     |                 +-- EditButton
        |     |                 +-- RemoveButton
        |     |
        |     +-- DiscountSection
        |     |     +-- DiscountInput
        |     |     +-- AppliedDiscount[]
        |     |     +-- ViewAllButton
        |     |
        |     +-- DeliveryTypeSection
        |     |     +-- DeliveryTypeTabs
        |     |     +-- DeliveryTypeInfo
        |     |
        |     +-- AddressSection (conditional)
        |           +-- AddressSelectionCard[]
        |           +-- AddAddressButton
        |
        +-- CartSidebar
              +-- OrderSummary
              |     +-- SummaryLineItem[]
              |     +-- SavingsBadge
              |     +-- SummaryTotal
              |
              +-- PaymentMethodSection
              |     +-- RadioGroup
              |
              +-- PlaceOrderButton

Modals
  +-- EditItemModal
  |     +-- ProductInfo
  |     +-- VariantGroupsSection
  |     +-- AddonGroupsSection
  |     +-- QuantityControls
  |     +-- UpdateButton
  |
  +-- DiscountModal
  |     +-- SearchInput
  |     +-- DiscountCard[]
  |
  +-- AddAddressModal
  |     +-- LocationSearch
  |     +-- AddressMap
  |     +-- AddressForm
  |
  +-- RemoveItemDialog
  +-- DeleteAddressDialog

Address Page (/addresses)
  +-- AddressPageHeader
  +-- AddressList
        +-- AddressCard[]
              +-- AddressTypeBadge
              +-- AddressDetails
              +-- AddressActions
```

---

## State Management Plan

### Stores Overview

| Store | Purpose | Persisted | Key State |
|-------|---------|-----------|-----------|
| `device-store` | Device ID management | Yes (localStorage) | deviceId |
| `store-selector-store` | Selected store | Yes (localStorage) | selectedStoreId |
| `auth-store` | Authentication | Yes (localStorage) | user, token, isAuthenticated |
| `cart-store` | Cart state | Partial | items (no), summary (no), discountIds (yes), deliveryType (yes), addressId (yes) |
| `address-store` | User addresses | No | addresses, defaultAddressId |

### Data Flow

```
User Action
    |
    v
Component Event Handler
    |
    v
Zustand Action (optimistic update)
    |
    +---> Update UI immediately
    |
    v
API Call
    |
    +---> Success: Keep optimistic state
    |
    +---> Failure: Rollback + Show error toast
    |
    v
Summary Refresh (debounced)
    |
    v
Update Summary in Store
    |
    v
UI Updates (selectors)
```

---

## API Integration Matrix

| Feature | API Function | Hook | Store Action | Triggers Summary |
|---------|--------------|------|--------------|------------------|
| Fetch Cart | `getCart` | `useCart` | `setItems` | No |
| Add Item | `addToCart` | `useAddToCart` | `addItem` | Yes |
| Update Item | `updateCart` | `useUpdateCart` | `updateItem` | Yes |
| Remove Item | `removeFromCart` | `useRemoveFromCart` | `removeItem` | Yes |
| Get Summary | `getCartSummary` | `useSummaryRefresh` | `setSummary` | N/A |
| Fetch Addresses | `getAddresses` | `useAddresses` | `setAddresses` | No |
| Create Address | `createAddress` | `useCreateAddress` | `addAddress` | Yes (if delivery) |
| Update Address | `updateAddress` | `useUpdateAddress` | `updateAddress` | Yes (if selected) |
| Delete Address | `deleteAddress` | `useDeleteAddress` | `removeAddress` | Yes (if selected) |
| Fetch Discounts | `getDiscounts` | `useDiscounts` | N/A | No |
| Apply Discount | N/A (store only) | N/A | `addDiscount` | Yes |
| Remove Discount | N/A (store only) | N/A | `removeDiscount` | Yes |

---

## Testing Strategy Per Phase

### Sprint 1: Infrastructure
- **Focus**: Unit tests for stores and hooks
- **Coverage Target**: 90% for store logic
- **Tools**: Vitest, React Testing Library

### Sprint 2: Cart Core
- **Focus**: Component tests + E2E flows
- **Coverage Target**: 80% for components
- **Tools**: Vitest, Playwright

### Sprint 3: Address & Discount
- **Focus**: Integration tests + E2E flows
- **Coverage Target**: 80% for features
- **Tools**: Playwright, API mocking

### Sprint 4: Integration
- **Focus**: E2E, performance, accessibility
- **Coverage Target**: Full flow coverage
- **Tools**: Playwright, Lighthouse, axe-core

---

## Estimated Complexity Indicators

| Component | Complexity | Effort | Risk |
|-----------|------------|--------|------|
| Device Store | Low | 2h | Low |
| Store Selector Store | Low | 2h | Low |
| Cart Store | High | 8h | Medium |
| Cart Page Layout | Medium | 4h | Low |
| Cart Item Card | Medium | 4h | Low |
| Edit Item Modal | High | 8h | Medium |
| Quantity Controls | Low | 2h | Low |
| Order Summary | Medium | 4h | Low |
| Delivery Type Selection | Low | 2h | Low |
| Address Selection | Medium | 4h | Low |
| Discount Section | Medium | 4h | Low |
| Discount Modal | Medium | 4h | Medium |
| Address Page | Medium | 4h | Low |
| Address Modal + Map | High | 12h | High |
| Auth Integration | Medium | 6h | Medium |
| Global Cart Provider | Medium | 4h | Low |
| Testing Suite | High | 16h | Low |
| Performance Optimization | Medium | 4h | Low |
| Accessibility Audit | Medium | 4h | Low |

**Total Estimated Effort**: ~100 hours

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Google Maps API issues | Medium | High | Fallback to manual input, test with mock |
| Cart merge conflicts | Low | Medium | Clear conflict resolution logic, show user choice |
| Performance with large carts | Low | Medium | Virtualization, pagination |
| State sync issues | Medium | High | Centralized store, careful action ordering |
| Auth flow complexity | Medium | High | Thorough E2E testing, clear redirect handling |

---

## Quick Start Commands

```bash
# Install dependencies (if any new ones needed)
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Build for production
npm run build
```

---

## File Structure Summary

```
/Users/vrajpatel/Documents/personal/pizzaspace_web/
  app/
    (protected)/
      cart/
        page.tsx
        loading.tsx
        error.tsx
      addresses/
        page.tsx
        loading.tsx
  components/
    cart/
      cart-layout.tsx
      cart-content.tsx
      cart-sidebar.tsx
      cart-header.tsx
      cart-empty-state.tsx
      cart-skeleton.tsx
      item/
        cart-item-card.tsx
        quantity-controls.tsx
        item-actions.tsx
        edit-item-modal.tsx
        remove-item-dialog.tsx
      summary/
        order-summary.tsx
        summary-line-item.tsx
        payment-method.tsx
        place-order-button.tsx
      delivery/
        delivery-type-section.tsx
        delivery-type-tabs.tsx
        address-selection-section.tsx
        address-selection-card.tsx
      discount/
        discount-section.tsx
        discount-input.tsx
        discount-modal.tsx
        discount-card.tsx
        applied-discount.tsx
    address/
      address-list.tsx
      address-card.tsx
      address-modal.tsx
      address-form.tsx
      address-map.tsx
      location-search.tsx
    providers/
      cart-provider.tsx
      address-provider.tsx
      global-store-provider.tsx
  store/
    cart-store.ts
    device-store.ts
    store-selector-store.ts
    address-store.ts
  hooks/
    api/
      use-cart.ts
      use-cart-mutations.ts
      use-addresses.ts
      use-address-mutations.ts
      use-discounts.ts
    use-summary-refresh.ts
    use-store-change.ts
    use-auth-with-cart.ts
  lib/
    utils/
      cart-utils.ts
      address-utils.ts
      device-id.ts
  types/
    cart-store.ts
    store-selector.ts
  e2e/
    cart/
      cart.spec.ts
    address/
      address.spec.ts
    discount/
      discount.spec.ts
  __tests__/
    components/
    store/
    api/
  docs/
    cart/
      plan.md (this file)
      accessibility-report.md
      review-checklist.md
```

---

## SPRINT 5: Address Feature Deep Dive (EXPANDED)

**Goal**: Complete address management system with full CRUD operations, Google Maps integration, and seamless cart integration.

**Complexity**: High
**Dependencies**: Sprint 1, Sprint 3 (partial)

---

### Phase 5.1: Address Page Infrastructure

**Objective**: Set up the address management page with proper routing, layouts, and base structure.

#### Subphase 5.1.1: Address Page Route Setup

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
app/(protected)/addresses/
  page.tsx                 # Main address page
  layout.tsx               # Address-specific layout
  loading.tsx              # Loading skeleton
  error.tsx                # Error boundary
```

**Implementation Details**:
```typescript
// app/(protected)/addresses/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manage Addresses - Pizza Space',
  description: 'Manage your delivery addresses',
  robots: { index: false, follow: false },
};

export default function AddressesPage() {
  return (
    <div className="container py-8 max-w-6xl mx-auto">
      <AddressPageContent />
    </div>
  );
}
```

**Requirements**:
- Protected route (requires authentication)
- SEO: noindex, nofollow
- Proper metadata
- Error boundary for graceful failures

**Testing Requirements**:
- [ ] Route accessible when authenticated
- [ ] Redirects to login when not authenticated
- [ ] Metadata renders correctly

---

#### Subphase 5.1.2: Address Page Layout Structure

**Agents**:
- `nextjs-responsive-design`
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/page/
  address-page-content.tsx    # Main content wrapper
  address-page-layout.tsx     # Layout structure
```

**Implementation Details**:
```typescript
// components/address/page/address-page-content.tsx
export function AddressPageContent() {
  const { addresses, isLoading } = useAddresses();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <AddressPageHeader addressCount={addresses.length} />

      {/* Your Addresses Section */}
      <section>
        <AddressSectionHeader
          title="Your Addresses"
          subtitle={`Default: ${getDefaultAddress(addresses)?.line1 ?? 'None set'}`}
        />

        {isLoading ? (
          <AddressListSkeleton />
        ) : addresses.length === 0 ? (
          <AddressEmptyState />
        ) : (
          <AddressList addresses={addresses} />
        )}
      </section>
    </div>
  );
}
```

**Requirements**:
- Responsive container with max-width
- Clear visual sections
- Loading/empty/error states
- Consistent spacing

**Testing Requirements**:
- [ ] Layout renders correctly on mobile/tablet/desktop
- [ ] All states render properly

---

#### Subphase 5.1.3: Address Page Header

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/page/
  address-page-header.tsx     # Page header with title and action
```

**Implementation Details**:
```typescript
// components/address/page/address-page-header.tsx
interface AddressPageHeaderProps {
  addressCount: number;
}

export function AddressPageHeader({ addressCount }: AddressPageHeaderProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Addresses</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage all your delivery addresses in one place.
          </p>
          {addressCount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              {addressCount} address{addressCount !== 1 ? 'es' : ''} saved
            </p>
          )}
        </div>

        <Button onClick={() => setShowAddModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Address
        </Button>
      </div>

      <AddAddressModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </>
  );
}
```

**Requirements**:
- Responsive header layout
- Address count display
- Add address button opens modal
- Clear hierarchy

**Testing Requirements**:
- [ ] Header displays correct count
- [ ] Add button opens modal
- [ ] Responsive on mobile

---

#### Subphase 5.1.4: Address Empty State

**Agents**:
- `shadcn-implementation-builder`
- `premium-ux-designer`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  address-empty-state.tsx     # Empty state with CTA
```

**Implementation Details**:
```typescript
// components/address/address-empty-state.tsx
export function AddressEmptyState() {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <>
      <Card className="p-12 text-center border-dashed">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">No addresses yet</h3>
            <p className="text-muted-foreground max-w-sm">
              Add your first delivery address to get started with ordering delicious food.
            </p>
          </div>

          <Button onClick={() => setShowAddModal(true)} className="gap-2 mt-2">
            <Plus className="h-4 w-4" />
            Add Your First Address
          </Button>
        </div>
      </Card>

      <AddAddressModal open={showAddModal} onOpenChange={setShowAddModal} />
    </>
  );
}
```

**Requirements**:
- Visually appealing empty state
- Clear call-to-action
- Icon illustration
- Dashed border to indicate empty area

**Testing Requirements**:
- [ ] Empty state displays when no addresses
- [ ] CTA button opens add modal

---

#### Subphase 5.1.5: Address Loading Skeleton

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  address-list-skeleton.tsx    # Loading skeleton for list
  address-card-skeleton.tsx    # Single card skeleton
```

**Implementation Details**:
```typescript
// components/address/address-list-skeleton.tsx
export function AddressListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <AddressCardSkeleton key={i} />
      ))}
    </div>
  );
}

// components/address/address-card-skeleton.tsx
export function AddressCardSkeleton() {
  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-16" /> {/* Type badge */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
        <Skeleton className="h-5 w-3/4" /> {/* Address line 1 */}
        <Skeleton className="h-4 w-1/2" /> {/* Address line 2 */}
        <Skeleton className="h-4 w-2/3" /> {/* City, postcode */}
      </div>
    </Card>
  );
}
```

**Requirements**:
- Match actual card layout
- Smooth skeleton animation
- Correct grid layout

**Testing Requirements**:
- [ ] Skeleton matches card dimensions
- [ ] Animation is smooth

---

### Phase 5.2: Address Card Component (Complete)

**Objective**: Build a comprehensive address card with all actions and states.

#### Subphase 5.2.1: Address Card Base Structure

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-component-architect`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/card/
  address-card.tsx            # Main card component
  index.ts                    # Exports
```

**Implementation Details**:
```typescript
// components/address/card/address-card.tsx
interface AddressCardProps {
  address: AddressResponse;
  variant?: 'default' | 'selectable' | 'compact';
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export function AddressCard({
  address,
  variant = 'default',
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  const isSelectable = variant === 'selectable';
  const isCompact = variant === 'compact';

  return (
    <Card
      className={cn(
        'relative transition-all duration-200',
        isSelectable && 'cursor-pointer hover:border-primary hover:shadow-md',
        selected && 'border-primary ring-2 ring-primary/20 bg-primary/5',
        address.isDefault && !selected && 'border-primary/50'
      )}
      onClick={isSelectable ? onSelect : undefined}
      role={isSelectable ? 'radio' : undefined}
      aria-checked={isSelectable ? selected : undefined}
      tabIndex={isSelectable ? 0 : undefined}
      onKeyDown={isSelectable ? handleKeyDown : undefined}
    >
      <CardContent className={cn('p-4', isCompact && 'p-3')}>
        {/* Header with type badge and actions */}
        <AddressCardHeader
          address={address}
          showActions={variant === 'default'}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />

        {/* Address details */}
        <AddressCardBody address={address} compact={isCompact} />

        {/* Selection indicator */}
        {isSelectable && (
          <AddressSelectionIndicator selected={selected} />
        )}
      </CardContent>
    </Card>
  );
}
```

**Requirements**:
- Three variants: default, selectable, compact
- Keyboard accessible when selectable
- Visual feedback on hover/focus
- Default address highlight

**Testing Requirements**:
- [ ] All variants render correctly
- [ ] Keyboard navigation works
- [ ] Click/select works
- [ ] Visual states correct

---

#### Subphase 5.2.2: Address Type Badge

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/card/
  address-type-badge.tsx      # Type badge (home/work/other)
```

**Implementation Details**:
```typescript
// components/address/card/address-type-badge.tsx
interface AddressTypeBadgeProps {
  type: 'home' | 'work' | 'other';
  otherLabel?: string;
}

const typeConfig = {
  home: { icon: Home, label: 'Home', variant: 'default' as const },
  work: { icon: Building2, label: 'Work', variant: 'secondary' as const },
  other: { icon: MapPin, label: 'Other', variant: 'outline' as const },
};

export function AddressTypeBadge({ type, otherLabel }: AddressTypeBadgeProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const label = type === 'other' && otherLabel ? otherLabel : config.label;

  return (
    <Badge variant={config.variant} className="gap-1 px-2 py-1">
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{label}</span>
    </Badge>
  );
}
```

**Requirements**:
- Icons for each type
- Custom label for "other" type
- Consistent badge styling
- Accessible

**Testing Requirements**:
- [ ] All types render correctly
- [ ] Custom label shows for "other"

---

#### Subphase 5.2.3: Address Action Buttons

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/card/
  address-card-actions.tsx    # Edit/Delete/SetDefault buttons
```

**Implementation Details**:
```typescript
// components/address/card/address-card-actions.tsx
interface AddressCardActionsProps {
  address: AddressResponse;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
}

export function AddressCardActions({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Set as Default */}
      {!address.isDefault && onSetDefault && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault();
              }}
              aria-label="Set as default address"
            >
              <Star className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Set as default</TooltipContent>
        </Tooltip>
      )}

      {/* Default indicator (non-clickable) */}
      {address.isDefault && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="h-8 w-8 flex items-center justify-center">
              <Star className="h-4 w-4 fill-primary text-primary" />
            </div>
          </TooltipTrigger>
          <TooltipContent>Default address</TooltipContent>
        </Tooltip>
      )}

      {/* Edit */}
      {onEdit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              aria-label="Edit address"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Edit</TooltipContent>
        </Tooltip>
      )}

      {/* Delete */}
      {onDelete && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Delete address"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete</TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
```

**Requirements**:
- Icon buttons with tooltips
- Stop propagation for selectable cards
- Visual distinction for default star
- Destructive styling for delete
- Accessible labels

**Testing Requirements**:
- [ ] All buttons trigger callbacks
- [ ] Tooltips show on hover
- [ ] Stop propagation works

---

#### Subphase 5.2.4: Address Card Body Content

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/card/
  address-card-body.tsx       # Address details display
```

**Implementation Details**:
```typescript
// components/address/card/address-card-body.tsx
interface AddressCardBodyProps {
  address: AddressResponse;
  compact?: boolean;
}

export function AddressCardBody({ address, compact }: AddressCardBodyProps) {
  return (
    <div className={cn('space-y-1', compact ? 'mt-2' : 'mt-3')}>
      {/* Primary line - Street address */}
      <div className="flex items-start gap-2">
        <MapPin className={cn(
          'text-primary shrink-0 mt-0.5',
          compact ? 'h-3 w-3' : 'h-4 w-4'
        )} />
        <div className="min-w-0 flex-1">
          <p className={cn(
            'font-medium truncate',
            compact ? 'text-sm' : 'text-base'
          )}>
            {address.line1}
          </p>
          {address.line2 && (
            <p className={cn(
              'text-muted-foreground truncate',
              compact ? 'text-xs' : 'text-sm'
            )}>
              {address.line2}
            </p>
          )}
        </div>
      </div>

      {/* Secondary lines */}
      <div className={cn(
        'text-muted-foreground pl-6',
        compact ? 'text-xs space-y-0.5' : 'text-sm space-y-1'
      )}>
        <p>{address.area}, {address.county}</p>
        <p>{address.country}, {address.zip}</p>
      </div>

      {/* Contact info */}
      {!compact && (
        <div className="flex items-center gap-4 pt-2 text-sm text-muted-foreground pl-6">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {address.name}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            {address.phone}
          </span>
        </div>
      )}
    </div>
  );
}
```

**Requirements**:
- Clear address formatting
- Truncation for long text
- Compact variant for cart
- Contact info display
- Icon indicators

**Testing Requirements**:
- [ ] All address fields display
- [ ] Compact variant works
- [ ] Long text truncates

---

#### Subphase 5.2.5: Delete Address Confirmation Dialog

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  delete-address-dialog.tsx   # Confirmation dialog
```

**Implementation Details**:
```typescript
// components/address/delete-address-dialog.tsx
interface DeleteAddressDialogProps {
  address: AddressResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAddressDialog({
  address,
  open,
  onOpenChange,
  onConfirm,
}: DeleteAddressDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Address</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this address?
            {address && (
              <span className="block mt-2 font-medium text-foreground">
                {address.line1}, {address.area}
              </span>
            )}
            {address?.isDefault && (
              <span className="block mt-2 text-amber-600">
                This is your default address. A new default will be selected automatically.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

**Requirements**:
- Show address being deleted
- Warning for default address
- Loading state during delete
- Accessible dialog
- Proper focus management

**Testing Requirements**:
- [ ] Dialog shows correct address
- [ ] Default warning displays
- [ ] Delete action works
- [ ] Cancel closes dialog

---

### Phase 5.3: Add Address Modal (Complete)

**Objective**: Full-featured add address modal with Google Maps integration.

#### Subphase 5.3.1: Add Address Modal Structure

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-component-architect`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/modal/
  add-address-modal.tsx       # Main modal wrapper
  add-address-content.tsx     # Modal content
  index.ts
```

**Implementation Details**:
```typescript
// components/address/modal/add-address-modal.tsx
interface AddAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (address: AddressResponse) => void;
}

export function AddAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAddressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-white">
          <DialogTitle className="text-lg font-semibold">Add New Address</DialogTitle>
          <DialogDescription className="text-white/80">
            Select your delivery location on the map or search for an address.
          </DialogDescription>
        </DialogHeader>

        <AddAddressContent
          onSuccess={(address) => {
            onSuccess?.(address);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
```

**Requirements**:
- Branded header matching app style
- Max height with scroll
- Close on success
- Proper callbacks

**Testing Requirements**:
- [ ] Modal opens/closes
- [ ] Header renders correctly
- [ ] Success callback fires

---

#### Subphase 5.3.2: Location Search Input

**Agents**:
- `nextjs-forms-expert`
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/modal/
  location-search-input.tsx   # Google Places autocomplete
```

**Implementation Details**:
```typescript
// components/address/modal/location-search-input.tsx
interface LocationSearchInputProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
}

export function LocationSearchInput({
  onPlaceSelect,
  placeholder = 'Search for postcode, street, or landmark',
}: LocationSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'gb' }, // UK only
      fields: ['address_components', 'geometry', 'formatted_address', 'name'],
      types: ['address'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place) {
        onPlaceSelect(place);
      }
    });

    return () => {
      google.maps.event.clearInstanceListeners(autocompleteRef.current!);
    };
  }, [onPlaceSelect]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="pl-10"
        aria-label="Search for address"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Search by UK postcode (e.g., SW1A 1AA) or street address
      </p>
    </div>
  );
}
```

**Requirements**:
- Google Places Autocomplete
- UK country restriction
- Clear placeholder text
- Helper text for users
- Clean up listeners

**Testing Requirements**:
- [ ] Autocomplete initializes
- [ ] Place selection triggers callback
- [ ] Input is accessible

---

#### Subphase 5.3.3: Google Maps Component with Draggable Pin

**Agents**:
- `nextjs-component-architect`
- `shadcn-implementation-builder`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
components/address/modal/
  address-map.tsx             # Google Map with marker
  use-google-maps.ts          # Map initialization hook
```

**Implementation Details**:
```typescript
// components/address/modal/address-map.tsx
interface AddressMapProps {
  center: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  onAddressResolve: (address: ResolvedAddress) => void;
}

export function AddressMap({
  center,
  onLocationChange,
  onAddressResolve,
}: AddressMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom: 16,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAP_ID,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: 'greedy',
    });

    // Initialize geocoder
    geocoderRef.current = new google.maps.Geocoder();

    // Initialize draggable marker
    const pinElement = new google.maps.marker.PinElement({
      scale: 1.2,
      background: '#ea580c', // Primary orange
      glyphColor: '#ffffff',
    });

    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstanceRef.current,
      position: center,
      gmpDraggable: true,
      content: pinElement.element,
    });

    // Handle drag end
    markerRef.current.addListener('dragend', async () => {
      const position = markerRef.current?.position;
      if (position) {
        const lat = typeof position.lat === 'function' ? position.lat() : position.lat;
        const lng = typeof position.lng === 'function' ? position.lng() : position.lng;

        onLocationChange({ lat, lng });

        // Reverse geocode
        const address = await reverseGeocode({ lat, lng });
        if (address) {
          onAddressResolve(address);
        }
      }
    });

    return () => {
      if (markerRef.current) {
        google.maps.event.clearInstanceListeners(markerRef.current);
      }
    };
  }, []);

  // Update marker when center changes
  useEffect(() => {
    if (markerRef.current && mapInstanceRef.current) {
      markerRef.current.position = center;
      mapInstanceRef.current.panTo(center);
    }
  }, [center]);

  const reverseGeocode = async (location: { lat: number; lng: number }): Promise<ResolvedAddress | null> => {
    if (!geocoderRef.current) return null;

    try {
      const response = await geocoderRef.current.geocode({ location });
      if (response.results[0]) {
        return parseAddressComponents(response.results[0].address_components);
      }
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
    return null;
  };

  return (
    <div className="relative rounded-lg overflow-hidden border">
      <div ref={mapRef} className="h-[250px] w-full" />

      {/* Help overlay */}
      <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-sm rounded-md p-2 text-xs text-center">
        <MapPin className="h-3 w-3 inline mr-1 text-primary" />
        Drag the map to position the pin at your exact delivery location.
        The address will be automatically detected when you stop moving the map.
      </div>
    </div>
  );
}
```

**Requirements**:
- Draggable marker
- Reverse geocoding on drag end
- Custom pin styling (brand colors)
- Help text overlay
- Responsive height
- Center updates from search

**Testing Requirements**:
- [ ] Map renders
- [ ] Marker is draggable
- [ ] Reverse geocode works
- [ ] Address updates on drag

---

#### Subphase 5.3.4: Use Current Location Feature

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
components/address/modal/
  use-current-location-button.tsx  # Geolocation button
hooks/
  use-geolocation.ts               # Geolocation hook
```

**Implementation Details**:
```typescript
// components/address/modal/use-current-location-button.tsx
interface UseCurrentLocationButtonProps {
  onLocationFound: (coords: { lat: number; lng: number }) => void;
}

export function UseCurrentLocationButton({ onLocationFound }: UseCurrentLocationButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoading(false);
        onLocationFound({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        toast.success('Location found');
      },
      (err) => {
        setIsLoading(false);
        let message = 'Unable to get your location';
        if (err.code === err.PERMISSION_DENIED) {
          message = 'Location permission denied. Please enable it in your browser settings.';
        }
        setError(message);
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LocateFixed className="h-4 w-4" />
      )}
      Use my current location
    </Button>
  );
}
```

**Requirements**:
- Geolocation API integration
- Loading state
- Error handling with clear messages
- Permission denial handling
- Toast notifications

**Testing Requirements**:
- [ ] Button triggers geolocation
- [ ] Loading state shows
- [ ] Error messages display
- [ ] Success updates map

---

#### Subphase 5.3.5: Address Form Fields

**Agents**:
- `nextjs-forms-expert`
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/modal/
  address-form.tsx            # Complete form
  address-form-fields.tsx     # Individual field components
schemas/
  address-schema.ts           # Zod validation schema
```

**Implementation Details**:
```typescript
// schemas/address-schema.ts
import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\d\s+-]+$/, 'Invalid phone number format'),
  line1: z.string().min(5, 'Street address is required'),
  line2: z.string().optional(),
  area: z.string().min(2, 'Town/Area is required'),
  county: z.string().min(2, 'City is required'),
  country: z.string().min(2, 'Country is required'),
  zip: z.string()
    .min(5, 'Postcode is required')
    .regex(/^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i, 'Invalid UK postcode'),
  type: z.enum(['home', 'work', 'other']),
  otherAddressLabel: z.string().optional(),
  isDefault: z.boolean(),
  lat: z.number().optional(),
  long: z.number().optional(),
}).refine((data) => {
  if (data.type === 'other' && !data.otherAddressLabel) {
    return false;
  }
  return true;
}, {
  message: 'Please provide a label for this address',
  path: ['otherAddressLabel'],
});

// components/address/modal/address-form.tsx
export function AddressForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
}: AddressFormProps) {
  const form = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: initialData ?? {
      name: '',
      phone: '',
      line1: '',
      line2: '',
      area: '',
      county: '',
      country: 'United Kingdom',
      zip: '',
      type: 'home',
      otherAddressLabel: '',
      isDefault: false,
    },
  });

  const watchType = form.watch('type');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Street Address */}
        <FormField
          control={form.control}
          name="line1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Street Address *</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 High Street" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Flat/Unit (Optional) */}
        <FormField
          control={form.control}
          name="line2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flat/Unit (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Flat 4B, Unit 2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Town/Area and City - Side by side */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Town/Area *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Westminster" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="county"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., London" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* County and Postcode - Side by side */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input {...field} disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postcode *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., SW1A 1AA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone *</FormLabel>
                <FormControl>
                  <Input placeholder="+44 7700 900000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address Type */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="home" id="type-home" />
                    <Label htmlFor="type-home" className="flex items-center gap-1">
                      <Home className="h-4 w-4" /> Home
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="work" id="type-work" />
                    <Label htmlFor="type-work" className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" /> Work
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="type-other" />
                    <Label htmlFor="type-other" className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Other
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Other Label (conditional) */}
        {watchType === 'other' && (
          <FormField
            control={form.control}
            name="otherAddressLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Label *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Gym, Parents' House" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* Set as Default */}
        <FormField
          control={form.control}
          name="isDefault"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal">
                Set as default delivery address
              </FormLabel>
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Address'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
```

**Requirements**:
- React Hook Form + Zod validation
- UK postcode validation
- Conditional "other" label field
- Set as default checkbox
- Pre-fill from map selection
- Clear error messages
- Loading state on submit

**Testing Requirements**:
- [ ] All fields validate correctly
- [ ] Postcode regex works for UK
- [ ] Other label shows conditionally
- [ ] Form submits with valid data
- [ ] Errors display correctly

---

#### Subphase 5.3.6: Auto-fill from Map Selection

**Agents**:
- `nextjs-component-architect`

**MCPs**:
- `next-devtools`

**Deliverables**:
```
lib/utils/
  address-parser.ts           # Parse Google address components
```

**Implementation Details**:
```typescript
// lib/utils/address-parser.ts
export interface ResolvedAddress {
  line1: string;
  line2?: string;
  area: string;
  county: string;
  country: string;
  zip: string;
}

export function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[]
): ResolvedAddress {
  const get = (type: string) =>
    components.find(c => c.types.includes(type))?.long_name ?? '';

  const streetNumber = get('street_number');
  const route = get('route');
  const premise = get('premise');
  const subpremise = get('subpremise');

  let line1 = '';
  if (streetNumber && route) {
    line1 = `${streetNumber} ${route}`;
  } else if (route) {
    line1 = route;
  } else if (premise) {
    line1 = premise;
  }

  return {
    line1,
    line2: subpremise || undefined,
    area: get('locality') || get('postal_town') || get('sublocality'),
    county: get('administrative_area_level_2') || get('administrative_area_level_1'),
    country: get('country') || 'United Kingdom',
    zip: get('postal_code'),
  };
}

// Usage in modal
const handleAddressResolve = (resolved: ResolvedAddress) => {
  form.setValue('line1', resolved.line1);
  form.setValue('line2', resolved.line2 ?? '');
  form.setValue('area', resolved.area);
  form.setValue('county', resolved.county);
  form.setValue('country', resolved.country);
  form.setValue('zip', resolved.zip);
};
```

**Requirements**:
- Parse all Google address component types
- Handle missing components gracefully
- Map to form field names correctly
- Trigger form re-render

**Testing Requirements**:
- [ ] Parser handles all UK address formats
- [ ] Form fields update correctly
- [ ] Missing components don't break

---

### Phase 5.4: Edit Address Feature

**Objective**: Complete edit address functionality reusing add modal components.

#### Subphase 5.4.1: Edit Address Modal

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/modal/
  edit-address-modal.tsx      # Edit modal (reuses form)
```

**Implementation Details**:
```typescript
// components/address/modal/edit-address-modal.tsx
interface EditAddressModalProps {
  address: AddressResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (address: AddressResponse) => void;
}

export function EditAddressModal({
  address,
  open,
  onOpenChange,
  onSuccess,
}: EditAddressModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: updateAddressMutation } = useUpdateAddress();

  const handleSubmit = async (data: AddAddressData) => {
    if (!address) return;

    setIsSubmitting(true);
    try {
      const updated = await updateAddressMutation(address._id, data);
      toast.success('Address updated successfully');
      onSuccess?.(updated);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update address');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Convert AddressResponse to form data
  const initialData: AddAddressData | undefined = address ? {
    name: address.name,
    phone: address.phone,
    line1: address.line1,
    line2: address.line2,
    area: address.area,
    county: address.county,
    country: address.country,
    zip: address.zip,
    type: address.type,
    otherAddressLabel: address.otherAddressLabel,
    isDefault: address.isDefault,
    lat: address.lat,
    long: address.long,
  } : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="bg-gradient-to-r from-primary to-primary/80 px-6 py-4 text-white">
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription className="text-white/80">
            Update your delivery address details.
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {address && (
            <EditAddressContent
              address={address}
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

**Requirements**:
- Pre-populate all fields
- Center map on existing coordinates
- Reuse address form component
- Handle update API call
- Success/error notifications

**Testing Requirements**:
- [ ] Form pre-populates correctly
- [ ] Map centers on address
- [ ] Update saves changes
- [ ] Cancel reverts changes

---

### Phase 5.5: Address List with Full CRUD

**Objective**: Complete address list with all operations wired up.

#### Subphase 5.5.1: Address List Component

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-responsive-design`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/address/
  address-list.tsx            # Complete list with handlers
```

**Implementation Details**:
```typescript
// components/address/address-list.tsx
export function AddressList() {
  const { addresses, isLoading } = useAddresses();
  const { mutate: deleteAddressMutation } = useDeleteAddress();
  const { mutate: setDefaultMutation } = useSetDefaultAddress();

  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
  const [deletingAddress, setDeletingAddress] = useState<AddressResponse | null>(null);

  // Sort addresses: default first, then by created date
  const sortedAddresses = useMemo(() => {
    return [...addresses].sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [addresses]);

  const handleDelete = async () => {
    if (!deletingAddress) return;

    try {
      await deleteAddressMutation(deletingAddress._id);
      toast.success('Address deleted');
      setDeletingAddress(null);
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  const handleSetDefault = async (address: AddressResponse) => {
    try {
      await setDefaultMutation(address._id);
      toast.success('Default address updated');
    } catch (error) {
      toast.error('Failed to set default address');
    }
  };

  if (isLoading) {
    return <AddressListSkeleton />;
  }

  if (addresses.length === 0) {
    return <AddressEmptyState />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAddresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            onEdit={() => setEditingAddress(address)}
            onDelete={() => setDeletingAddress(address)}
            onSetDefault={() => handleSetDefault(address)}
          />
        ))}
      </div>

      <EditAddressModal
        address={editingAddress}
        open={!!editingAddress}
        onOpenChange={(open) => !open && setEditingAddress(null)}
      />

      <DeleteAddressDialog
        address={deletingAddress}
        open={!!deletingAddress}
        onOpenChange={(open) => !open && setDeletingAddress(null)}
        onConfirm={handleDelete}
      />
    </>
  );
}
```

**Requirements**:
- Responsive grid layout
- Default address first
- All CRUD operations
- Modal/dialog management
- Optimistic updates

**Testing Requirements**:
- [ ] List renders all addresses
- [ ] Default sorts first
- [ ] Edit opens modal with data
- [ ] Delete shows confirmation
- [ ] Set default works

---

## SPRINT 6: Discount Feature Deep Dive (EXPANDED)

**Goal**: Complete discount system with search, apply, and summary integration.

**Complexity**: Medium-High
**Dependencies**: Sprint 1, Sprint 2

---

### Phase 6.1: Discount Section in Cart

**Objective**: Build the discount input section for the cart page.

#### Subphase 6.1.1: Discount Section Container

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-section.tsx        # Main section container
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-section.tsx
export function DiscountSection() {
  const appliedDiscounts = useAppliedDiscounts();
  const [showModal, setShowModal] = useState(false);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Discounts & Offers</h3>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={() => setShowModal(true)}
          className="text-primary"
        >
          View All
        </Button>
      </div>

      {/* Discount code input */}
      <DiscountCodeInput />

      {/* Applied discounts */}
      {appliedDiscounts.length > 0 && (
        <div className="mt-4 space-y-2">
          {appliedDiscounts.map((discountId) => (
            <AppliedDiscountChip key={discountId} discountId={discountId} />
          ))}
        </div>
      )}

      {/* Discount modal */}
      <DiscountModal open={showModal} onOpenChange={setShowModal} />
    </Card>
  );
}
```

**Requirements**:
- Clear section header with icon
- View All button to open modal
- Input field for manual code entry
- Display applied discounts
- Clean card styling

**Testing Requirements**:
- [ ] Section renders correctly
- [ ] View All opens modal
- [ ] Applied discounts display

---

#### Subphase 6.1.2: Discount Code Input Field

**Agents**:
- `nextjs-forms-expert`
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-code-input.tsx     # Code input with apply button
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-code-input.tsx
export function DiscountCodeInput() {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { applyDiscountByCode } = useDiscountActions();

  const handleApply = async () => {
    if (!code.trim()) {
      setError('Please enter a discount code');
      return;
    }

    setIsApplying(true);
    setError(null);

    try {
      const result = await applyDiscountByCode(code.trim().toUpperCase());
      if (result.success) {
        setCode('');
        toast.success('Discount applied!');
      } else {
        setError(result.error ?? 'Invalid discount code');
      }
    } catch (err) {
      setError('Failed to apply discount');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            placeholder="Enter discount code"
            className={cn(
              'uppercase',
              error && 'border-destructive focus-visible:ring-destructive'
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApply();
              }
            }}
            aria-invalid={!!error}
            aria-describedby={error ? 'discount-error' : undefined}
          />
        </div>
        <Button
          onClick={handleApply}
          disabled={isApplying || !code.trim()}
          className="shrink-0"
        >
          {isApplying ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>

      {error && (
        <p id="discount-error" className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
}
```

**Requirements**:
- Input with uppercase transformation
- Apply button with loading state
- Enter key to submit
- Error message display
- Clear on success
- Accessible error state

**Testing Requirements**:
- [ ] Input transforms to uppercase
- [ ] Apply triggers API call
- [ ] Error displays correctly
- [ ] Success clears input
- [ ] Enter key works

---

#### Subphase 6.1.3: Input Validation

**Agents**:
- `nextjs-forms-expert`

**MCPs**: None

**Deliverables**:
```
lib/utils/
  discount-validation.ts      # Validation utilities
```

**Implementation Details**:
```typescript
// lib/utils/discount-validation.ts
export interface DiscountValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateDiscountCode(code: string): DiscountValidationResult {
  if (!code.trim()) {
    return { isValid: false, error: 'Discount code is required' };
  }

  if (code.length < 3) {
    return { isValid: false, error: 'Discount code must be at least 3 characters' };
  }

  if (code.length > 20) {
    return { isValid: false, error: 'Discount code is too long' };
  }

  if (!/^[A-Z0-9]+$/.test(code)) {
    return { isValid: false, error: 'Discount code can only contain letters and numbers' };
  }

  return { isValid: true };
}

export function getDiscountErrorMessage(apiError: string): string {
  const errorMap: Record<string, string> = {
    'INVALID_CODE': 'This discount code is invalid',
    'EXPIRED': 'This discount code has expired',
    'NOT_APPLICABLE': 'This discount is not applicable to your cart items',
    'MINIMUM_NOT_MET': 'Your order does not meet the minimum amount for this discount',
    'ALREADY_USED': 'You have already used this discount code',
    'MAX_USES_REACHED': 'This discount code has reached its maximum uses',
  };

  return errorMap[apiError] ?? 'Unable to apply this discount code';
}
```

**Requirements**:
- Client-side validation
- Error message mapping
- Format checking
- Length limits

**Testing Requirements**:
- [ ] Empty code fails
- [ ] Short code fails
- [ ] Invalid characters fail
- [ ] Valid code passes

---

#### Subphase 6.1.4: Success Animation

**Agents**:
- `nextjs-animation-specialist`

**MCPs**: None

**Deliverables**:
```
components/cart/discount/
  discount-success-animation.tsx  # Success checkmark animation
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-success-animation.tsx
export function DiscountSuccessAnimation({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute inset-0 flex items-center justify-center bg-green-50 rounded-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.4 }}
          >
            <CheckCircle className="h-6 w-6 text-green-600" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

**Requirements**:
- Smooth check animation
- Brief display duration
- Non-blocking
- Green success color

**Testing Requirements**:
- [ ] Animation plays on success
- [ ] Animation exits smoothly

---

### Phase 6.2: Discount Modal

**Objective**: Build the searchable discount modal with all available offers.

#### Subphase 6.2.1: Discount Modal Structure

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-modal.tsx          # Modal wrapper
  discount-modal-content.tsx  # Modal content
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-modal.tsx
interface DiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DiscountModal({ open, onOpenChange }: DiscountModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-hidden p-0">
        <DialogHeader className="bg-gradient-to-r from-primary to-orange-500 px-6 py-4 text-white">
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5" />
            Available Discounts
          </DialogTitle>
          <DialogDescription className="text-white/80">
            Search and apply discount codes to your order
          </DialogDescription>
        </DialogHeader>

        <DiscountModalContent onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
```

**Requirements**:
- Branded gradient header
- Max height with scroll
- Clean modal styling
- Close callback

**Testing Requirements**:
- [ ] Modal opens/closes
- [ ] Header displays correctly

---

#### Subphase 6.2.2: Discount Search Input

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-search-input.tsx   # Search field with debounce
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-search-input.tsx
interface DiscountSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  isSearching: boolean;
}

export function DiscountSearchInput({
  value,
  onChange,
  isSearching,
}: DiscountSearchInputProps) {
  return (
    <div className="relative px-6 py-4 border-b">
      <Search className="absolute left-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search discounts..."
        className="pl-10 pr-10"
        aria-label="Search discount codes"
      />
      {isSearching && (
        <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
      )}
    </div>
  );
}
```

**Requirements**:
- Search icon
- Loading indicator
- Accessible label
- Clean styling

**Testing Requirements**:
- [ ] Input triggers onChange
- [ ] Loading shows during search

---

#### Subphase 6.2.3: Discount List with Search Results

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-component-architect`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-list.tsx           # Scrollable discount list
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-list.tsx
interface DiscountListProps {
  discounts: DiscountResponse[];
  appliedIds: string[];
  isLoading: boolean;
  onApply: (discount: DiscountResponse) => void;
  searchQuery: string;
}

export function DiscountList({
  discounts,
  appliedIds,
  isLoading,
  onApply,
  searchQuery,
}: DiscountListProps) {
  if (isLoading) {
    return (
      <div className="px-6 py-8 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <DiscountCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (discounts.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h4 className="font-medium text-lg">No discounts found</h4>
        <p className="text-muted-foreground text-sm mt-1">
          {searchQuery
            ? `No discounts match "${searchQuery}"`
            : 'There are no available discounts for your cart'}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="px-6 py-4 space-y-3">
        {discounts.map((discount) => (
          <DiscountCard
            key={discount._id}
            discount={discount}
            isApplied={appliedIds.includes(discount._id)}
            onApply={() => onApply(discount)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
```

**Requirements**:
- Scrollable list with fixed height
- Loading skeleton state
- Empty state with message
- Search-specific empty message
- Pass applied state to cards

**Testing Requirements**:
- [ ] Loading shows skeletons
- [ ] Empty state displays
- [ ] Discounts render
- [ ] Applied state passed

---

#### Subphase 6.2.4: Empty Search Results State

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-empty-state.tsx    # Empty state component
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-empty-state.tsx
interface DiscountEmptyStateProps {
  type: 'no-results' | 'no-discounts';
  searchQuery?: string;
}

export function DiscountEmptyState({ type, searchQuery }: DiscountEmptyStateProps) {
  return (
    <div className="py-12 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        {type === 'no-results' ? (
          <SearchX className="h-8 w-8 text-muted-foreground" />
        ) : (
          <Ticket className="h-8 w-8 text-muted-foreground" />
        )}
      </div>

      <h4 className="font-semibold text-lg">
        {type === 'no-results' ? 'No discounts found' : 'No discounts available'}
      </h4>

      <p className="text-muted-foreground text-sm mt-2 max-w-xs mx-auto">
        {type === 'no-results' && searchQuery ? (
          <>
            We couldn't find any discounts matching "<span className="font-medium">{searchQuery}</span>".
            Try a different search term.
          </>
        ) : (
          'There are no discounts available for your current cart items. Check back later!'
        )}
      </p>
    </div>
  );
}
```

**Requirements**:
- Different states for no results vs no discounts
- Search query display
- Friendly messaging
- Visual illustration

**Testing Requirements**:
- [ ] No results state shows
- [ ] No discounts state shows
- [ ] Search query displayed

---

### Phase 6.3: Discount Card Component

**Objective**: Build comprehensive discount card with all details.

#### Subphase 6.3.1: Discount Card Layout

**Agents**:
- `shadcn-implementation-builder`
- `premium-ux-designer`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  discount-card.tsx           # Complete discount card
```

**Implementation Details**:
```typescript
// components/cart/discount/discount-card.tsx
interface DiscountCardProps {
  discount: DiscountResponse;
  isApplied: boolean;
  onApply: () => void;
}

export function DiscountCard({ discount, isApplied, onApply }: DiscountCardProps) {
  const discountValue = discount.discountAmountType === 'percentage'
    ? `${discount.discountAmount}% OFF`
    : `${formatCurrency(discount.discountAmount)} OFF`;

  const isExpiringSoon = isWithinDays(new Date(discount.endTime), 3);

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border transition-all',
        isApplied
          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
          : 'border-border hover:border-primary/50 hover:shadow-sm'
      )}
    >
      {/* Discount value badge */}
      <div className="absolute -top-2 -right-2">
        <Badge
          variant={isApplied ? 'default' : 'secondary'}
          className={cn(
            'text-sm font-bold',
            !isApplied && 'bg-green-600 text-white hover:bg-green-600'
          )}
        >
          {discountValue}
        </Badge>
      </div>

      <div className="flex gap-4">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Code and type */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono font-bold text-lg text-primary">
              {discount.couponCode}
            </span>
            <DiscountTypeBadge type={discount.discountType} />
          </div>

          {/* Name */}
          <p className="font-medium truncate">{discount.name}</p>

          {/* Description */}
          {discount.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {discount.description}
            </p>
          )}

          {/* Details tags */}
          <div className="flex flex-wrap gap-2 mt-3">
            <DiscountDetailTag
              icon={Wallet}
              label={`Max: ${formatCurrency(discount.maximumAmount)}`}
            />
            <DiscountDetailTag
              icon={Calendar}
              label={`Valid till: ${formatDate(discount.endTime)}`}
              highlight={isExpiringSoon}
            />
            <DiscountDetailTag
              icon={ShoppingBag}
              label={getConditionLabel(discount.conditionType)}
            />
          </div>
        </div>

        {/* Apply button */}
        <div className="flex items-center">
          <Button
            onClick={onApply}
            disabled={isApplied}
            variant={isApplied ? 'outline' : 'default'}
            size="sm"
            className={cn(
              'min-w-[80px]',
              isApplied && 'text-green-600 border-green-600'
            )}
          >
            {isApplied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Applied
              </>
            ) : (
              'Apply'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper components
function DiscountTypeBadge({ type }: { type: DiscountType }) {
  const config: Record<DiscountType, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    normal: { label: 'Normal', variant: 'secondary' },
    packaging: { label: 'Packaging', variant: 'outline' },
    deliveryCharges: { label: 'Delivery', variant: 'outline' },
    extraCharges: { label: 'Extra', variant: 'outline' },
  };

  const { label, variant } = config[type];
  return <Badge variant={variant} className="text-xs">{label}</Badge>;
}

function DiscountDetailTag({
  icon: Icon,
  label,
  highlight,
}: {
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-muted',
        highlight && 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500'
      )}
    >
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}
```

**Requirements**:
- Prominent coupon code display
- Discount value badge (corner)
- Discount type indicator
- Max amount display
- Validity date with expiring soon highlight
- Applicable items info
- Apply button with states
- Applied state styling

**Testing Requirements**:
- [ ] All discount info displays
- [ ] Percentage vs fixed formatting
- [ ] Expiring soon highlight
- [ ] Apply/applied states work

---

### Phase 6.4: Applied Discounts Display

**Objective**: Show applied discounts in cart with remove functionality.

#### Subphase 6.4.1: Applied Discount Chip

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/discount/
  applied-discount-chip.tsx   # Applied discount display
```

**Implementation Details**:
```typescript
// components/cart/discount/applied-discount-chip.tsx
interface AppliedDiscountChipProps {
  discountId: string;
}

export function AppliedDiscountChip({ discountId }: AppliedDiscountChipProps) {
  const discount = useDiscountById(discountId);
  const { removeDiscount } = useDiscountActions();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await removeDiscount(discountId);
      toast.success('Discount removed');
    } catch (error) {
      toast.error('Failed to remove discount');
    } finally {
      setIsRemoving(false);
    }
  };

  if (!discount) return null;

  const discountValue = discount.discountAmountType === 'percentage'
    ? `${discount.discountAmount}%`
    : formatCurrency(discount.discountAmount);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
    >
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-800 flex items-center justify-center">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-green-700 dark:text-green-400">
              {discount.couponCode}
            </span>
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              {discountValue} off
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{discount.name}</p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleRemove}
        disabled={isRemoving}
        aria-label={`Remove ${discount.couponCode} discount`}
      >
        {isRemoving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <X className="h-4 w-4" />
        )}
      </Button>
    </motion.div>
  );
}
```

**Requirements**:
- Green success styling
- Coupon code display
- Discount value badge
- Remove button
- Loading state on remove
- Entry/exit animation
- Accessible remove button

**Testing Requirements**:
- [ ] Chip displays correctly
- [ ] Remove triggers API
- [ ] Animation plays

---

#### Subphase 6.4.2: Multiple Discounts Display

**Agents**:
- `nextjs-component-architect`

**MCPs**: None

**Deliverables**:
```
components/cart/discount/
  applied-discounts-list.tsx  # List of applied discounts
```

**Implementation Details**:
```typescript
// components/cart/discount/applied-discounts-list.tsx
export function AppliedDiscountsList() {
  const appliedDiscountIds = useAppliedDiscounts();

  if (appliedDiscountIds.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {appliedDiscountIds.map((discountId) => (
          <AppliedDiscountChip key={discountId} discountId={discountId} />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

**Requirements**:
- Handle multiple discounts
- AnimatePresence for smooth transitions
- Stack vertically

**Testing Requirements**:
- [ ] Multiple discounts display
- [ ] Removal animates correctly

---

### Phase 6.5: Discount Integration with Summary

**Objective**: Show discount effects in order summary.

#### Subphase 6.5.1: Discount Line in Summary

**Agents**:
- `shadcn-implementation-builder`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/summary/
  summary-discount-line.tsx   # Discount row in summary
```

**Implementation Details**:
```typescript
// components/cart/summary/summary-discount-line.tsx
interface SummaryDiscountLineProps {
  totalDiscount: number;
  discountIds: string[];
}

export function SummaryDiscountLine({
  totalDiscount,
  discountIds,
}: SummaryDiscountLineProps) {
  if (totalDiscount === 0) return null;

  return (
    <div className="flex items-center justify-between py-2 text-green-600 dark:text-green-400">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4" />
        <span className="text-sm">
          Discount{discountIds.length > 1 ? 's' : ''} Applied
          {discountIds.length > 1 && (
            <span className="text-xs ml-1">({discountIds.length})</span>
          )}
        </span>
      </div>
      <span className="font-medium">-{formatCurrency(totalDiscount)}</span>
    </div>
  );
}
```

**Requirements**:
- Green discount color
- Show count if multiple
- Negative value formatting
- Icon indicator

**Testing Requirements**:
- [ ] Line shows when discount applied
- [ ] Amount formats correctly
- [ ] Multiple count shows

---

#### Subphase 6.5.2: Savings Badge Display

**Agents**:
- `shadcn-implementation-builder`
- `nextjs-animation-specialist`

**MCPs**:
- `shadcn`

**Deliverables**:
```
components/cart/summary/
  savings-badge.tsx           # "You saved" badge
```

**Implementation Details**:
```typescript
// components/cart/summary/savings-badge.tsx
interface SavingsBadgeProps {
  amount: number;
}

export function SavingsBadge({ amount }: SavingsBadgeProps) {
  if (amount === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg p-3 text-center"
    >
      <div className="flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4" />
        <span className="font-medium">
          You saved {formatCurrency(amount)} on this order!
        </span>
      </div>
    </motion.div>
  );
}
```

**Requirements**:
- Celebratory styling
- Entry animation
- Clear savings amount
- Icon decoration

**Testing Requirements**:
- [ ] Badge shows when savings > 0
- [ ] Amount displays correctly
- [ ] Animation plays

---

## Updated Sprint Overview

| Sprint | Focus Area | Phases | Subphases | Complexity |
|--------|------------|--------|-----------|------------|
| **Sprint 1** | Global State & Infrastructure | 4 | 14 | High |
| **Sprint 2** | Cart Core Features | 4 | 16 | High |
| **Sprint 3** | Address & Discount (Basic) | 3 | 10 | Medium-High |
| **Sprint 4** | Integration & Polish | 3 | 12 | Medium |
| **Sprint 5** | Address Feature Deep Dive | 5 | 22 | High |
| **Sprint 6** | Discount Feature Deep Dive | 5 | 15 | Medium-High |

**Total: 24 Phases, 89 Subphases**

---

## Conclusion

This comprehensive development plan provides a structured approach to implementing the PizzaSpace cart feature. By following the sprint-based organization with clear phases and subphases, the development team can work efficiently while maintaining high code quality and test coverage.

Key success factors:
1. Follow the agent assignments for specialized expertise
2. Complete each sprint before moving to the next
3. Maintain test coverage throughout development
4. Regular code reviews at phase boundaries
5. Performance and accessibility as first-class concerns

The plan is designed to be executed over multiple development cycles, with each sprint building on the previous one's foundation.
