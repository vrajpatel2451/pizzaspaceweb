# Invalid Items Warning Component - Quick Start

## TL;DR

Alert component that warns users about cart items incompatible with selected delivery type, with collapsible list and action buttons.

## Files Created

1. `/components/cart/invalid-items-warning.tsx` - Main component
2. `/design-docs/phase-5-2-invalid-items-warning/implementation.md` - Full documentation
3. `/design-docs/phase-5-2-invalid-items-warning/usage-example.tsx` - Usage examples

## Quick Usage

```tsx
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";

<InvalidItemsWarning
  invalidItems={[
    { id: "1", name: "Dine-In Special Pizza" },
    { id: "2", name: "Restaurant Burger" },
  ]}
  deliveryType="delivery"
  onRemoveItems={() => console.log("Remove items")}
  onChangeDeliveryType={() => console.log("Change delivery type")}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `invalidItems` | `Array<{id: string, name: string}>` | Yes | Items incompatible with current delivery type |
| `deliveryType` | `OrderDeliveryType` | Yes | Current delivery type: `"dineIn"`, `"pickup"`, or `"delivery"` |
| `onRemoveItems` | `() => void` | No | Callback for "Remove Items" button |
| `onChangeDeliveryType` | `() => void` | No | Callback for "Change Delivery Type" button |
| `className` | `string` | No | Additional CSS classes |

## Features

- Shadcn Alert component with destructive variant
- AlertTriangle icon from lucide-react
- Automatic collapsing when > 3 items
- Two action buttons (conditionally rendered)
- Full TypeScript type safety
- Complete accessibility (WCAG compliant)
- Mobile-responsive design

## Key Behaviors

1. Returns `null` when `invalidItems` is empty
2. Shows first 3 items initially, rest collapsible
3. "Show N more items" button appears when > 3 items
4. Buttons only appear if callbacks are provided
5. Delivery type labels: dineIn → "Dine In", pickup → "Takeaway", delivery → "Delivery"

## Dependencies

All should be installed:
- `lucide-react`
- `@radix-ui/react-collapsible`
- shadcn components: alert, button, collapsible

## Integration Points

Use in:
- Cart pages when items are invalid for selected delivery type
- Checkout flow to warn before payment
- Delivery type selector to show immediate feedback

## Example Integration

```tsx
function CartPage() {
  const { cart, deliveryType, removeInvalidItems } = useCart();

  const invalidItems = cart
    .filter(item => !item.availableDeliveryTypes.includes(deliveryType))
    .map(item => ({ id: item.id, name: item.name }));

  return (
    <div className="space-y-4">
      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType={deliveryType}
        onRemoveItems={removeInvalidItems}
        onChangeDeliveryType={() => router.push('/cart?tab=delivery')}
      />
      {/* Rest of cart UI */}
    </div>
  );
}
```

## Testing Checklist

- [ ] Test with 0 items (should not render)
- [ ] Test with 1-3 items (no collapse button)
- [ ] Test with 4+ items (collapse button appears)
- [ ] Test collapsible expand/collapse
- [ ] Test "Remove Items" button callback
- [ ] Test "Change Delivery Type" button callback
- [ ] Test keyboard navigation
- [ ] Test screen reader announcements
- [ ] Test on mobile devices
- [ ] Test with different delivery types

## Common Use Cases

1. **Cart Validation**: Show at top of cart when delivery type changes
2. **Checkout Gate**: Block checkout until resolved
3. **Proactive Warning**: Show immediately when incompatible items detected
4. **Bulk Actions**: Allow removing all invalid items at once

## Next Steps

1. Integrate into your cart/checkout pages
2. Connect to cart state management
3. Add toast notifications for user feedback after actions
4. Consider analytics tracking for warning appearances

## Related Documentation

- Full implementation guide: `implementation.md`
- Usage examples: `usage-example.tsx`
- Component source: `/components/cart/invalid-items-warning.tsx`
