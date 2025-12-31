# Invalid Items Warning Component - Implementation Guide

## Overview

The `InvalidItemsWarning` component is a production-ready React component that alerts users when cart items are incompatible with the selected delivery type. It provides clear feedback and actionable solutions, following shadcn/ui design patterns and accessibility best practices.

## Component Location

```
/components/cart/invalid-items-warning.tsx
```

## Features

- **Visual Alert**: Uses shadcn Alert component with destructive variant for clear warning indication
- **Warning Icon**: AlertTriangle icon from lucide-react for immediate visual recognition
- **Item List**: Displays all invalid items with proper formatting
- **Collapsible List**: Automatically collapses when more than 3 items for better UX
- **Action Buttons**: Two clear call-to-action buttons for resolving the issue
- **Accessibility**: Full WCAG compliance with ARIA attributes, live regions, and semantic HTML
- **Responsive**: Mobile-first design with proper spacing and layout
- **Type Safety**: Complete TypeScript implementation with no `any` types

## Installation

### Required Dependencies

All dependencies should already be installed in your project:

```bash
npm install lucide-react
npm install @radix-ui/react-collapsible
npm install class-variance-authority
npm install clsx tailwind-merge
```

### Required shadcn Components

Ensure these shadcn components are installed:

```bash
npx shadcn@latest add alert
npx shadcn@latest add button
npx shadcn@latest add collapsible
```

## Usage

### Basic Example

```tsx
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";

function CartPage() {
  const [deliveryType, setDeliveryType] = useState<OrderDeliveryType>("delivery");

  const invalidItems = [
    { id: "1", name: "Dine-In Special Pizza" },
    { id: "2", name: "Restaurant Exclusive Burger" },
  ];

  const handleRemoveItems = () => {
    // Remove invalid items from cart
    console.log("Removing invalid items from cart");
  };

  const handleChangeDeliveryType = () => {
    // Navigate to delivery type selector
    console.log("Opening delivery type selector");
  };

  return (
    <InvalidItemsWarning
      invalidItems={invalidItems}
      deliveryType={deliveryType}
      onRemoveItems={handleRemoveItems}
      onChangeDeliveryType={handleChangeDeliveryType}
    />
  );
}
```

### With Cart Integration

```tsx
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";
import { useCart } from "@/hooks/use-cart";

function CheckoutPage() {
  const { cart, deliveryType, removeInvalidItems, invalidItems } = useCart();

  if (invalidItems.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <InvalidItemsWarning
        invalidItems={invalidItems}
        deliveryType={deliveryType}
        onRemoveItems={() => removeInvalidItems()}
        onChangeDeliveryType={() => router.push("/cart?tab=delivery")}
        className="mb-4"
      />

      {/* Rest of checkout UI */}
    </div>
  );
}
```

### Collapsible Behavior Example

```tsx
// Component automatically collapses when > 3 items
const manyInvalidItems = [
  { id: "1", name: "Item 1" },
  { id: "2", name: "Item 2" },
  { id: "3", name: "Item 3" },
  { id: "4", name: "Item 4" }, // This and below will be hidden initially
  { id: "5", name: "Item 5" },
];

<InvalidItemsWarning
  invalidItems={manyInvalidItems}
  deliveryType="delivery"
  onRemoveItems={handleRemove}
  onChangeDeliveryType={handleChange}
/>
// Shows "Show 2 more items" button
```

## API Reference

### Props

#### `InvalidItemsWarningProps`

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `invalidItems` | `Array<{id: string, name: string}>` | Yes | List of items that are incompatible with current delivery type |
| `deliveryType` | `OrderDeliveryType` | Yes | Current delivery type (`"dineIn"`, `"pickup"`, or `"delivery"`) |
| `onRemoveItems` | `() => void` | No | Callback when "Remove Items" button is clicked |
| `onChangeDeliveryType` | `() => void` | No | Callback when "Change Delivery Type" button is clicked |
| `className` | `string` | No | Additional CSS classes for the Alert container |

### Type Definitions

```typescript
type OrderDeliveryType = "dineIn" | "pickup" | "delivery";

interface InvalidItemsWarningProps {
  invalidItems: Array<{
    id: string;
    name: string;
  }>;
  deliveryType: OrderDeliveryType;
  onRemoveItems?: () => void;
  onChangeDeliveryType?: () => void;
  className?: string;
}
```

## Behavior

### Visibility
- Component returns `null` when `invalidItems` is empty or undefined
- Automatically shows/hides based on cart state

### Collapsible List
- Threshold: 3 items
- Shows first 3 items initially
- "Show N more items" button appears when count > 3
- Toggles between expanded/collapsed states
- Smooth animation via Radix UI Collapsible

### Button Visibility
- "Remove Items" button only appears if `onRemoveItems` callback is provided
- "Change Delivery Type" button only appears if `onChangeDeliveryType` callback is provided
- At least one callback should be provided for meaningful user interaction

### Delivery Type Labels
- `dineIn` → "Dine In"
- `pickup` → "Takeaway"
- `delivery` → "Delivery"

## Accessibility Features

### ARIA Attributes
- `role="alert"` on Alert container
- `aria-live="polite"` for screen reader announcements
- `aria-hidden="true"` on decorative icons
- `aria-label` on all interactive buttons with descriptive text
- Proper button labels for screen readers

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus visible states with ring indicators
- Proper tab order through collapsible trigger and action buttons

### Semantic HTML
- Uses proper heading hierarchy
- List semantics (`<ul>`, `<li>`) for items
- Button elements for all clickable actions

### Screen Reader Support
- Descriptive button labels
- Live region announcements when component appears
- Clear relationship between warning and actions

## Styling

### Design Tokens
- Uses Tailwind CSS utility classes
- Follows shadcn/ui design system
- Respects theme variables (light/dark mode compatible)

### Responsive Behavior
- Mobile-first design
- Proper spacing on all screen sizes
- Flexible button layout with wrapping

### Color Scheme
- Destructive variant for warning emphasis
- Consistent with error/warning patterns
- High contrast for accessibility

## Customization

### Custom Styling

```tsx
<InvalidItemsWarning
  invalidItems={items}
  deliveryType={type}
  className="mt-6 rounded-2xl shadow-lg"
  onRemoveItems={handleRemove}
  onChangeDeliveryType={handleChange}
/>
```

### Threshold Adjustment

To change the collapse threshold, modify the constant in the component:

```tsx
// Change from 3 to your preferred number
const COLLAPSE_THRESHOLD = 5;
```

### Custom Delivery Type Labels

Modify the `deliveryTypeLabels` constant:

```tsx
const deliveryTypeLabels: Record<OrderDeliveryType, string> = {
  dineIn: "Dine In Service",
  pickup: "Pickup Order",
  delivery: "Home Delivery",
};
```

## Integration Examples

### With Cart Context

```tsx
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";
import { useCart } from "@/context/cart-context";

export function CartSummary() {
  const {
    deliveryType,
    invalidItemsForDeliveryType,
    removeInvalidItems,
    setShowDeliverySelector,
  } = useCart();

  return (
    <div className="space-y-4">
      <InvalidItemsWarning
        invalidItems={invalidItemsForDeliveryType}
        deliveryType={deliveryType}
        onRemoveItems={removeInvalidItems}
        onChangeDeliveryType={() => setShowDeliverySelector(true)}
      />
      {/* Cart content */}
    </div>
  );
}
```

### With State Management

```tsx
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { removeInvalidCartItems } from "@/store/cart-slice";

export function CheckoutFlow() {
  const dispatch = useAppDispatch();
  const { invalidItems, deliveryType } = useAppSelector((state) => state.cart);

  return (
    <InvalidItemsWarning
      invalidItems={invalidItems}
      deliveryType={deliveryType}
      onRemoveItems={() => dispatch(removeInvalidCartItems())}
      onChangeDeliveryType={() => router.push("/checkout/delivery-type")}
    />
  );
}
```

### Conditional Rendering

```tsx
function CartPage() {
  const { invalidItems, deliveryType } = useCart();

  // Only show warning if there are invalid items and user is on checkout
  const showWarning = invalidItems.length > 0 && isCheckoutPage;

  return (
    <div>
      {showWarning && (
        <InvalidItemsWarning
          invalidItems={invalidItems}
          deliveryType={deliveryType}
          onRemoveItems={handleRemove}
          onChangeDeliveryType={handleChange}
        />
      )}
    </div>
  );
}
```

## Best Practices

1. **Always Provide Context**: Include both action callbacks when possible to give users maximum flexibility
2. **Clear Item Names**: Ensure item names are descriptive and user-friendly
3. **Placement**: Show at the top of cart/checkout pages for maximum visibility
4. **Testing**: Verify behavior with 1, 3, 4, and many items to test collapsible functionality
5. **Error Handling**: Gracefully handle empty or undefined `invalidItems` arrays
6. **State Management**: Update invalid items list reactively when delivery type changes
7. **User Feedback**: Consider adding toast notifications after actions are completed

## Troubleshooting

### Warning Not Appearing

**Issue**: Component doesn't render
**Solution**: Verify `invalidItems` array is not empty and contains properly formatted objects with `id` and `name` properties

### Collapsible Not Working

**Issue**: Expand/collapse button doesn't toggle
**Solution**: Ensure `@radix-ui/react-collapsible` is properly installed and imported

### Button Callbacks Not Firing

**Issue**: Clicking buttons has no effect
**Solution**: Verify callback functions are passed as props and are not undefined

### TypeScript Errors

**Issue**: Type errors with `OrderDeliveryType`
**Solution**: Ensure types are imported from `@/types/cart` and match exactly (`"dineIn"`, `"pickup"`, `"delivery"`)

### Styling Issues

**Issue**: Component doesn't match design system
**Solution**: Verify shadcn Alert, Button, and Collapsible components are properly installed with correct variants

## Testing

### Unit Test Example

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { InvalidItemsWarning } from "@/components/cart/invalid-items-warning";

describe("InvalidItemsWarning", () => {
  const mockInvalidItems = [
    { id: "1", name: "Test Item 1" },
    { id: "2", name: "Test Item 2" },
  ];

  it("renders with invalid items", () => {
    render(
      <InvalidItemsWarning
        invalidItems={mockInvalidItems}
        deliveryType="delivery"
      />
    );

    expect(screen.getByText("Some items are not available")).toBeInTheDocument();
    expect(screen.getByText("Test Item 1")).toBeInTheDocument();
  });

  it("calls onRemoveItems when button clicked", () => {
    const handleRemove = jest.fn();

    render(
      <InvalidItemsWarning
        invalidItems={mockInvalidItems}
        deliveryType="delivery"
        onRemoveItems={handleRemove}
      />
    );

    fireEvent.click(screen.getByText("Remove Items"));
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render when no invalid items", () => {
    const { container } = render(
      <InvalidItemsWarning
        invalidItems={[]}
        deliveryType="delivery"
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("shows collapsible for more than 3 items", () => {
    const manyItems = [
      { id: "1", name: "Item 1" },
      { id: "2", name: "Item 2" },
      { id: "3", name: "Item 3" },
      { id: "4", name: "Item 4" },
    ];

    render(
      <InvalidItemsWarning
        invalidItems={manyItems}
        deliveryType="delivery"
      />
    );

    expect(screen.getByText(/Show 1 more item/i)).toBeInTheDocument();
  });
});
```

## Performance Considerations

- **Memoization**: Component re-renders only when props change
- **Conditional Rendering**: Returns early when no invalid items
- **Efficient List Rendering**: Uses React keys for optimal list updates
- **Lazy State**: Collapsible state is local and doesn't affect parent re-renders

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Screen readers (NVDA, JAWS, VoiceOver)

## Version History

- **v1.0.0** (2025-12-31): Initial implementation
  - Destructive alert variant
  - Collapsible item list (threshold: 3)
  - Two action buttons (Remove Items, Change Delivery Type)
  - Full accessibility support
  - TypeScript type safety
  - Mobile-responsive design

## Related Components

- `/components/cart/delivery-type-selector.tsx` - For changing delivery type
- `/components/cart/cart-item-card.tsx` - Cart item display
- `/components/ui/alert.tsx` - Base alert component
- `/components/ui/button.tsx` - Action buttons
- `/components/ui/collapsible.tsx` - Collapsible functionality

## Support

For issues or questions:
1. Check TypeScript types match `OrderDeliveryType` from `/types/cart.ts`
2. Verify shadcn components are installed and up to date
3. Ensure callback functions are provided for desired actions
4. Review accessibility with screen reader testing
