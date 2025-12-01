# Discount Feature - Quick Reference

## TL;DR

```tsx
import { DiscountSection } from "@/components/cart";

// That's it!
<DiscountSection />
```

## What It Does

- ✅ Input field for discount codes
- ✅ "View All" button to browse available discounts
- ✅ Applied discounts with remove buttons
- ✅ Total savings calculation
- ✅ Success/error feedback
- ✅ Automatic cart summary updates
- ✅ Persistence across sessions

## Key Files

```
/components/cart/discount-section.tsx  → Main component
/components/discount/*                 → Reusable discount components
/lib/api/discount.ts                   → API functions
/store/cart-store.ts                   → State management
```

## Store Methods

```typescript
import { useCartStore } from "@/store/cart-store";

const {
  selectedDiscountIds,  // string[] - Applied discount IDs
  addDiscount,          // (id: string) => void
  removeDiscount,       // (id: string) => void
  clearDiscounts,       // () => void
} = useCartStore();
```

## API Function

```typescript
import { getDiscounts } from "@/lib/api/discount";

const response = await getDiscounts({
  cartIds: ["cart1", "cart2"],
  storeId: "store123",
  search: "SAVE20",  // Optional: filter by code
});
```

## Common Tasks

### Add discount programmatically
```tsx
addDiscount("discount-id-123");
```

### Remove discount
```tsx
removeDiscount("discount-id-123");
```

### Clear all discounts
```tsx
clearDiscounts();
```

### Check if discount applied
```tsx
const isApplied = selectedDiscountIds.includes("discount-id-123");
```

### Get discount count
```tsx
const count = selectedDiscountIds.length;
```

## Component Features

### Input Validation
- ✅ Required field check
- ✅ Exact code matching (case-insensitive)
- ✅ Duplicate detection
- ✅ Invalid code handling

### User Feedback
- ✅ Success animation (confetti)
- ✅ Toast notifications
- ✅ Loading states
- ✅ Error messages

### Modal Features
- ✅ Search/filter discounts
- ✅ Responsive (dialog/drawer)
- ✅ Shows applied status
- ✅ Detailed discount info

## Auto-refresh Behavior

When you add/remove discounts:
1. Store updates immediately ✓
2. Cart summary refetches (300ms debounce) ✓
3. Order summary updates ✓
4. No manual refresh needed ✓

## Testing Checklist

- [ ] Enter valid code → applies, success toast
- [ ] Enter invalid code → error toast, stays in input
- [ ] Enter duplicate code → info toast, no duplicate
- [ ] Click "View All" → modal opens with discounts
- [ ] Apply from modal → closes, success feedback
- [ ] Remove discount → removed, summary updates
- [ ] Refresh page → discounts persist
- [ ] Navigate away and back → discounts persist

## Props

```typescript
interface DiscountSectionProps {
  className?: string; // Optional
}
```

No other props needed!

## Dependencies

```json
{
  "zustand": "^4.x",
  "framer-motion": "^10.x",
  "sonner": "^1.x",
  "lucide-react": "^0.x"
}
```

## Error Messages

| Scenario | Message |
|----------|---------|
| Empty input | "Please enter a coupon code" |
| Invalid code | "Invalid or expired discount code" |
| Already applied | "This discount is already applied" |
| No store | "No store selected" |
| API error | "Failed to apply discount" |

## Toast Notifications

| Action | Type | Message |
|--------|------|---------|
| Apply success | Success | "Discount '[CODE]' applied!" |
| Remove success | Success | "Discount removed" |
| Invalid code | Error | "Invalid discount code" |
| Duplicate | Info | "Discount already applied" |
| API error | Error | "Error applying discount" |

## Accessibility

- ✅ All inputs labeled
- ✅ Error messages linked (aria-describedby)
- ✅ Loading states announced
- ✅ Keyboard navigable
- ✅ Screen reader friendly

## Performance

- ✅ Debounced summary updates (300ms)
- ✅ Lazy loading (discounts fetched on modal open)
- ✅ Optimistic updates
- ✅ Memoized callbacks
- ✅ Conditional fetching

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+

## Need Help?

- [Full Implementation Guide](./discount-implementation-summary.md)
- [Usage Examples](./discount-usage-examples.md)
- [Cart Store Guide](./cart-store-guide.md)
- [API Documentation](../api/discount.md)
