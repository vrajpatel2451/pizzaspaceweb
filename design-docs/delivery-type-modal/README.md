# Delivery Type Modal - Phase 1.1

## Quick Start

```tsx
import { DeliveryTypeModal } from "@/components/delivery";
import { useIsDeliveryTypeSelected } from "@/store/cart-store";

export function MyPage() {
  const isDeliveryTypeSelected = useIsDeliveryTypeSelected();

  return (
    <>
      {/* Your content */}
      <DeliveryTypeModal open={!isDeliveryTypeSelected} />
    </>
  );
}
```

## Files Created

### Components
- `/components/delivery/delivery-type-modal.tsx` - Main modal component
- `/components/delivery/index.ts` - Barrel export

### Documentation
- `/design-docs/delivery-type-modal/implementation.md` - Complete implementation guide
- `/design-docs/delivery-type-modal/usage-example.tsx` - Integration examples
- `/design-docs/delivery-type-modal/README.md` - This file

## Store Updates

The cart store (`/store/cart-store.ts`) has been enhanced with:

- `isDeliveryTypeSelected: boolean` - State field
- `setDeliveryTypeSelected(selected: boolean)` - Action
- `useIsDeliveryTypeSelected()` - Selector hook

## Features

- Mandatory selection (cannot be dismissed)
- No close button
- Full-screen on mobile, centered on desktop
- Reuses existing DeliveryTypeSelector component
- Persists to Zustand store and localStorage
- WCAG accessibility compliant
- TypeScript strict mode compliant

## Key Behaviors

1. **Non-dismissible:** Users cannot close the modal without making a selection
2. **Persistent:** Selection is saved to localStorage
3. **Responsive:** Optimized layout for mobile and desktop
4. **Accessible:** Full keyboard navigation and screen reader support

## Integration Steps

1. Import the modal and hook
2. Add modal to your layout/page
3. Control visibility with `!isDeliveryTypeSelected`

See `usage-example.tsx` for detailed integration patterns.

## Dependencies

All dependencies are already installed:
- @radix-ui/react-dialog
- zustand
- lucide-react

## Testing

Run the dev server and verify:

```bash
npm run dev
```

1. Modal appears when no delivery type is selected
2. Cannot dismiss by clicking outside or pressing ESC
3. Continue button disabled until selection
4. Selection persists after page refresh

## Documentation

- [Implementation Guide](./implementation.md) - Complete technical documentation
- [Usage Examples](./usage-example.tsx) - Integration code examples

## Support

For questions or issues, refer to:
1. This README
2. Implementation guide
3. Usage examples
4. Source code in `/components/delivery/`
