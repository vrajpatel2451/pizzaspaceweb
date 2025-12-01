# Task 1.2.1: Fix storeId "default-store" in Summary API

## Summary
Fixed the cart page to use the actual selected store ID from the store context instead of hardcoded "default-store" value.

## Changes Made

### File: `/app/(protected)/cart/page.tsx`

#### 1. Added Store Context Import
```typescript
import { useStore } from "@/lib/contexts/store-context";
```

#### 2. Replaced localStorage-based storeId with Context
**Before:**
```typescript
const [storeId] = useState(() => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("selectedStoreId") || "default-store";
  }
  return "default-store";
});
```

**After:**
```typescript
// Get store context
const { selectedStore, isLoading: isLoadingStore } = useStore();
const storeId = selectedStore?._id;
```

#### 3. Updated Cart Hooks to Guard Against Missing Store
**Before:**
```typescript
const { isLoading: isLoadingCart, refetch: refetchCart } = useCart(
  deviceId,
  storeId,
  true
);

const { summary, isLoading: isLoadingSummary } = useCartSummaryHook(
  { storeId },
  true,
  300
);
```

**After:**
```typescript
// Cart hooks - only fetch if we have a store selected
const { isLoading: isLoadingCart, refetch: refetchCart } = useCart(
  deviceId,
  storeId || "",
  !!storeId // Only enable query if storeId exists
);

// Cart summary hook with auto-refresh - only fetch if we have a store selected
const { summary, isLoading: isLoadingSummary } = useCartSummaryHook(
  { storeId: storeId || "" },
  !!storeId, // Only enable auto-refresh if storeId exists
  300 // 300ms debounce
);
```

#### 4. Added Error State for Missing Store
Added early return with error UI when no store is selected:

```typescript
// Show error state if no store selected
if (!isLoadingStore && !storeId) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">No Store Selected</h2>
          <p className="text-muted-foreground">
            Please select a store location to view your cart.
          </p>
        </div>
        <Button onClick={() => router.push("/")}>
          Select Store
        </Button>
      </div>
    </div>
  );
}
```

#### 5. Added Loading State for Store Context
```typescript
// Show loading state while store is being loaded
if (isLoadingStore) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
```

## Benefits

1. **Correct Store ID**: The cart summary API now receives the actual selected store ID instead of "default-store"
2. **Type Safety**: Using TypeScript optional chaining (`selectedStore?._id`) prevents runtime errors
3. **Better UX**: Users see a clear error message when no store is selected
4. **Performance**: Cart and summary queries are disabled when no store is selected, preventing unnecessary API calls
5. **Centralized State**: Store selection is managed in one place (store context) instead of multiple localStorage accesses

## Testing Criteria

- ✅ Summary API receives actual store ID (not "default-store")
- ✅ Error state shown when no store is selected
- ✅ Loading state shown while store context is initializing
- ✅ Cart and summary queries only run when store is available
- ✅ Selecting store enables cart and summary fetching

## API Behavior

### Before Fix
- Summary API request: `storeId: "default-store"`
- Always attempted to fetch cart/summary even without valid store

### After Fix
- Summary API request: `storeId: "673fab7b3eb7f39c33826f9e"` (actual store ID)
- Cart/summary queries disabled until valid store is selected
- Graceful error handling for missing store selection
