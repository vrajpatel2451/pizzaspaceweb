# Cart Feature Architecture

## Layer Overview

```
┌────────────────────────────────────────────────────────────────┐
│                        React Components                         │
│                    (UI Layer - Client-side)                     │
└────────────────────────┬───────────────────────────────────────┘
                         │ imports & uses
                         ▼
┌────────────────────────────────────────────────────────────────┐
│                     Custom Hooks Layer                          │
│         /lib/hooks/ - API Integration & State Sync             │
│                                                                 │
│  useCart          useAddToCart       useCartSummary            │
│  useAddresses     useCreateAddress   useUpdateAddress          │
│  useDiscounts     useApplyDiscount   useRemoveDiscount         │
└────────┬───────────────────────────────────┬───────────────────┘
         │ calls API                         │ updates state
         ▼                                   ▼
┌─────────────────────────┐    ┌────────────────────────────────┐
│    API Functions Layer   │    │      Zustand Stores Layer      │
│    /lib/api/            │    │         /store/                │
│                         │    │                                │
│  getCart()              │    │  cart-store.ts                 │
│  addToCart()            │    │  address-store.ts              │
│  updateCart()           │    │  discount-store.ts             │
│  removeFromCart()       │    │  device-store.ts               │
│  getCartSummary()       │    │                                │
│                         │    │  Persisted to localStorage:    │
│  getAddresses()         │    │  - Device ID                   │
│  createAddress()        │    │  - Selected discounts          │
│  updateAddress()        │    │  - Delivery type               │
│  deleteAddress()        │    │  - Selected address            │
│                         │    │                                │
│  getDiscounts()         │    │  Not persisted (API-driven):   │
│                         │    │  - Cart items                  │
└────────┬────────────────┘    │  - Addresses                   │
         │ HTTP requests        │  - Available discounts         │
         ▼                      └────────────────────────────────┘
┌─────────────────────────┐
│    Backend API          │
│  (Next.js API Routes)   │
└─────────────────────────┘
```

## Data Flow Diagrams

### 1. Cart Data Flow

```
User Action (Add to Cart)
         │
         ▼
┌────────────────────┐
│  useAddToCart()    │ ◄── Component calls hook
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  addToCart() API   │ ◄── Hook calls API function
└────────┬───────────┘
         │ HTTP POST
         ▼
┌────────────────────┐
│   Backend API      │ ◄── API processes request
└────────┬───────────┘
         │ Response
         ▼
┌────────────────────┐
│  useAddToCart()    │ ◄── Hook receives response
└────────┬───────────┘
         │ Success?
         ├── Yes ─────┬─────────────────────────────┐
         │            │                             │
         │            ▼                             ▼
         │    ┌───────────────┐           ┌──────────────┐
         │    │  Update Store │           │ Show Toast   │
         │    │ (optimistic)  │           │  "Added!"    │
         │    └───────┬───────┘           └──────────────┘
         │            │
         │            ▼
         │    ┌───────────────┐
         │    │ Trigger Auto- │
         │    │ Refetch Summary│
         │    └───────────────┘
         │
         └── No ─────┐
                     ▼
             ┌──────────────┐
             │ Show Error   │
             │    Toast     │
             └──────────────┘
```

### 2. Cart Summary Auto-Refetch Flow

```
Cart Changes Detected
(items/discounts/delivery/address)
         │
         ▼
┌────────────────────┐
│ useCartSummary()   │ ◄── Hook detects change in useEffect
│    useEffect       │
└────────┬───────────┘
         │ setTimeout(0)
         ▼
┌────────────────────┐
│ fetchSummary()     │ ◄── Async fetch function called
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│getCartSummary API  │ ◄── API call with all params
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   Backend API      │ ◄── Calculate pricing, taxes, discounts
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  setSummary()      │ ◄── Update cart store with new summary
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Component         │ ◄── UI re-renders with new summary
│  Re-renders        │
└────────────────────┘
```

### 3. Discount Search with Debounce

```
User types in search box
         │
         ▼
┌────────────────────┐
│  setSearch(value)  │ ◄── Component state updates
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ useSearchDiscounts │ ◄── Hook receives search prop
│    useEffect       │
└────────┬───────────┘
         │ setTimeout(300ms)
         ▼
┌────────────────────┐
│setDebouncedSearch  │ ◄── Debounced value updates after delay
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│ useEffect triggers │ ◄── Second effect detects debounced change
│ searchDiscounts()  │
└────────┬───────────┘
         │ setTimeout(0)
         ▼
┌────────────────────┐
│  getDiscounts API  │ ◄── API call with search param
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│setSearchResults()  │ ◄── Update local state with results
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Component         │ ◄── UI shows search results
│  Re-renders        │
└────────────────────┘

Note: If user types again within 300ms,
the previous timer is cleared and restarted.
```

### 4. Address Management Flow

```
User clicks "Add Address"
         │
         ▼
┌────────────────────┐
│  openAddModal()    │ ◄── Address store action
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Modal opens       │ ◄── Component reads isAddModalOpen
└────────┬───────────┘
         │
User fills form      │
         │
         ▼
┌────────────────────┐
│useCreateAddress()  │ ◄── Form submission calls hook
│    mutate(data)    │
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│createAddress() API │ ◄── Hook calls API function
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│   Backend API      │ ◄── Creates address in database
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  addAddress()      │ ◄── Update store with new address
│  closeAddModal()   │ ◄── Auto-close modal on success
│  toast.success()   │ ◄── Show success notification
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Component         │ ◄── UI shows new address in list
│  Re-renders        │     Modal closes
└────────────────────┘
```

## Hook Responsibilities

### Cart Hooks (`use-cart.ts`)

| Hook | Responsibility | Store Updated | Auto-refetch Trigger |
|------|---------------|---------------|---------------------|
| `useCart` | Fetch cart items | `setItems()` | Mount, deviceId/storeId change |
| `useAddToCart` | Add item to cart | `addItem()` | Manual mutation |
| `useUpdateCartItem` | Update item quantity/variant | `updateItem()` | Manual mutation |
| `useRemoveCartItem` | Remove item from cart | `removeItem()` | Manual mutation |
| `useCartSummary` | Calculate pricing/taxes | `setSummary()` | Cart/discount/delivery/address change |

### Address Hooks (`use-address.ts`)

| Hook | Responsibility | Store Updated | Modal Action |
|------|---------------|---------------|-------------|
| `useAddresses` | Fetch all addresses | `setAddresses()` | - |
| `useCreateAddress` | Create new address | `addAddress()` | Closes add modal |
| `useUpdateAddress` | Update existing address | `updateAddress()` | Closes edit modal |
| `useDeleteAddress` | Delete address | `removeAddress()` | Closes delete dialog |
| `useSetDefaultAddress` | Set default address | `setDefaultAddress()` | - |

### Discount Hooks (`use-discount.ts`)

| Hook | Responsibility | Store Updated | Features |
|------|---------------|---------------|----------|
| `useAvailableDiscounts` | Fetch applicable discounts | `setDiscounts()` | Auto-refetch on cart change |
| `useSearchDiscounts` | Search discounts | Local state | 300ms debounce |
| `useApplyDiscount` | Add discount to cart | Cart: `addDiscount()` | Duplicate prevention |
| `useRemoveDiscount` | Remove discount from cart | Cart: `removeDiscount()` | - |

## Store State Structure

### Cart Store

```typescript
interface CartState {
  items: CartResponse[];              // Current cart items
  summary: CustomerBillingOnCart | null; // Pricing summary
  selectedDiscountIds: string[];      // Applied discount IDs
  deliveryType: OrderDeliveryType;    // pickup/delivery/dineIn
  selectedAddressId: string | null;   // Selected delivery address
  isLoading: boolean;                 // Global loading state
  isSummaryLoading: boolean;          // Summary loading state
  error: string | null;               // Error message
  isHydrated: boolean;                // Rehydration complete
}

// Persisted to localStorage:
// - selectedDiscountIds
// - deliveryType
// - selectedAddressId
```

### Address Store

```typescript
interface AddressState {
  addresses: AddressResponse[];       // User's addresses
  selectedAddress: AddressResponse | null; // For edit/delete
  isAddModalOpen: boolean;            // Add modal state
  isEditModalOpen: boolean;           // Edit modal state
  isDeleteDialogOpen: boolean;        // Delete dialog state
  isLoading: boolean;                 // Loading state
  error: string | null;               // Error message
}

// Not persisted (API-driven)
```

### Discount Store

```typescript
interface DiscountState {
  availableDiscounts: DiscountResponse[]; // Applicable discounts
  isModalOpen: boolean;               // Discount modal state
  searchQuery: string;                // Search input value
  isLoading: boolean;                 // Loading state
  error: string | null;               // Error message
}

// Not persisted (API-driven)
```

### Device Store

```typescript
interface DeviceState {
  deviceId: string | null;            // UUID for anonymous carts
  isHydrated: boolean;                // Rehydration complete
}

// Persisted to localStorage:
// - deviceId
```

## API Endpoints Used

| Endpoint | Method | Hook | Purpose |
|----------|--------|------|---------|
| `/customer/cart` | GET | useCart | Fetch cart items |
| `/customer/cart/add` | POST | useAddToCart | Add item to cart |
| `/customer/cart/update/:id` | PUT | useUpdateCartItem | Update cart item |
| `/customer/cart/update/:id` | DELETE | useRemoveCartItem | Remove from cart |
| `/customer/cart/summary` | POST | useCartSummary | Calculate pricing |
| `/user/address/list` | GET | useAddresses | Fetch addresses |
| `/user/address/create` | POST | useCreateAddress | Create address |
| `/user/address/:id` | PUT | useUpdateAddress | Update address |
| `/user/address/:id` | PATCH | useSetDefaultAddress | Partial update |
| `/user/address/:id` | DELETE | useDeleteAddress | Delete address |
| `/discount/applicable-for-user-by-user` | POST | useAvailableDiscounts | Fetch discounts |
| `/discount/applicable-for-user-by-user` | POST | useSearchDiscounts | Search discounts |

## Component Integration Patterns

### Pattern 1: Simple Display

```typescript
// Just display data, no mutations
const { items, isLoading } = useCart(deviceId, storeId);
```

### Pattern 2: Display + Mutations

```typescript
// Display data + handle mutations
const { items } = useCart(deviceId, storeId);
const { mutate: removeItem } = useRemoveCartItem();
```

### Pattern 3: Auto-synchronized Summary

```typescript
// Summary auto-refetches when cart changes
const { items } = useCart(deviceId, storeId);
const { summary } = useCartSummary({ storeId });
// No manual refetch needed!
```

### Pattern 4: Search with Debounce

```typescript
// Search automatically debounces
const [search, setSearch] = useState('');
const { results } = useSearchDiscounts(cartIds, storeId, search);
// API called only after 300ms of no typing
```

### Pattern 5: Modal Management

```typescript
// Store manages modal state
const { openAddModal } = useAddressStore();
const { mutate: createAddress } = useCreateAddress();
// createAddress() auto-closes modal on success
```

## Performance Optimizations

1. **Selector Hooks**: Each store exports specific selectors to prevent unnecessary re-renders
2. **useCallback**: All fetch functions use `useCallback` for stable references
3. **Debouncing**: Search is debounced to prevent excessive API calls
4. **Optimistic Updates**: Store updates immediately, no waiting for refetch
5. **Conditional Auto-fetch**: Only fetch when dependencies are valid
6. **setTimeout(0)**: Prevents synchronous state updates in effects

## Error Recovery

All hooks handle errors at multiple levels:

1. **Network Errors**: Caught in try-catch blocks
2. **API Errors**: Checked via response.statusCode
3. **User Feedback**: Toast notifications show errors
4. **Component State**: Error state returned for custom UI
5. **Console Logging**: Errors logged for debugging

## Testing Strategy

```
┌─────────────────────┐
│   Unit Tests        │  Mock API, test individual hooks
├─────────────────────┤
│ Integration Tests   │  Mock stores, test hook + store interaction
├─────────────────────┤
│   E2E Tests         │  Real browser, test complete flows
└─────────────────────┘
```

## Future Enhancements

Potential improvements to consider:

1. **React Query Integration**: Replace custom hooks with React Query for caching
2. **Pagination**: Add pagination support for large cart/address lists
3. **Infinite Scroll**: For discount lists
4. **Real-time Updates**: WebSocket integration for live cart updates
5. **Offline Support**: Queue mutations when offline
6. **Retry Logic**: Auto-retry failed API calls
7. **Request Cancellation**: Cancel in-flight requests on unmount
8. **Optimistic Rollback**: Revert optimistic updates on API failure
