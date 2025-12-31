# Availability Badge Component - Implementation Guide

## Overview

The `AvailabilityBadge` component displays a warning badge when a product is not available for a specific delivery type (Delivery, Pickup, or Dine In). It provides clear visual feedback to users about product availability restrictions.

## Installation

All required dependencies are already installed in the project:

- `lucide-react` (v0.555.0) - For the XCircle icon
- `@radix-ui/react-slot` - Used by the Badge component
- `class-variance-authority` - For badge variant styling

No additional installation needed.

## Component Location

- **Main Component**: `/components/product/availability-badge.tsx`
- **Barrel Export**: `/components/product/index.ts`

## Usage

### Basic Usage

```tsx
import { AvailabilityBadge } from "@/components/product";

function ProductCard({ product, selectedDeliveryType }) {
  const isAvailable = product.availableDeliveryTypes.includes(selectedDeliveryType);

  return (
    <div className="relative">
      <AvailabilityBadge
        available={isAvailable}
        deliveryType={selectedDeliveryType}
      />
      {/* Product card content */}
    </div>
  );
}
```

### With Custom Styling

```tsx
<AvailabilityBadge
  available={false}
  deliveryType="delivery"
  className="top-4 right-4"  // Custom positioning
/>
```

### Checking Product Availability

```tsx
import { ProductResponse } from "@/types/product";
import { OrderDeliveryType } from "@/types/cart";

function checkAvailability(
  product: ProductResponse,
  deliveryType: OrderDeliveryType
): boolean {
  return product.availableDeliveryTypes.includes(deliveryType);
}

// In your component
const available = checkAvailability(product, selectedDeliveryType);
<AvailabilityBadge available={available} deliveryType={selectedDeliveryType} />
```

## Props API

### AvailabilityBadgeProps

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `available` | `boolean` | Yes | - | Whether the product is available for the selected delivery type. If `true`, the badge is not rendered. |
| `deliveryType` | `OrderDeliveryType` | Yes | - | The current delivery type (`"delivery"`, `"pickup"`, or `"dineIn"`). |
| `className` | `string` | No | - | Additional CSS classes to override default positioning or styling. |

### OrderDeliveryType

```typescript
type OrderDeliveryType = "dineIn" | "pickup" | "delivery";
```

## Features

### Conditional Rendering
The component returns `null` when `available` is `true`, ensuring it only appears when needed.

### Accessibility
- **ARIA Label**: Provides descriptive text for screen readers
- **Role**: Uses `role="status"` for assistive technology
- **Icon**: XCircle icon is marked as `aria-hidden="true"` to avoid duplicate announcements

### Styling
- Uses shadcn Badge component with `destructive` variant (red background, white text)
- Positioned absolutely for overlay on product cards (`absolute top-2 right-2`)
- Includes shadow (`shadow-md`) for better visibility
- Small size (`size="sm"`) for compact display
- Z-index (`z-10`) ensures it appears above other content

### Dynamic Labels
Automatically generates appropriate labels based on delivery type:
- `"delivery"` → "Not available for Delivery"
- `"pickup"` → "Not available for Pickup"
- `"dineIn"` → "Not available for Dine In"

## Customization

### Custom Positioning

Override the default positioning using the `className` prop:

```tsx
// Bottom left instead of top right
<AvailabilityBadge
  available={false}
  deliveryType="pickup"
  className="top-auto bottom-2 right-auto left-2"
/>

// Remove absolute positioning
<AvailabilityBadge
  available={false}
  deliveryType="dineIn"
  className="static"
/>
```

### Integration with Product Cards

The component is designed to overlay on product cards. Ensure the parent container has `relative` positioning:

```tsx
<div className="relative rounded-lg border p-4">
  <AvailabilityBadge
    available={isAvailable}
    deliveryType={deliveryType}
  />
  <img src={product.photoList[0]} alt={product.name} />
  <h3>{product.name}</h3>
  <p>{product.description}</p>
</div>
```

## TypeScript Support

The component is fully typed with TypeScript:

```typescript
interface AvailabilityBadgeProps {
  available: boolean;
  deliveryType: OrderDeliveryType;
  className?: string;
}
```

All props are type-safe and will provide autocomplete in supported editors.

## Examples

### Menu Grid with Mixed Availability

```tsx
import { AvailabilityBadge } from "@/components/product";
import { ProductResponse } from "@/types/product";
import { OrderDeliveryType } from "@/types/cart";

interface MenuGridProps {
  products: ProductResponse[];
  selectedDeliveryType: OrderDeliveryType;
}

function MenuGrid({ products, selectedDeliveryType }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => {
        const isAvailable = product.availableDeliveryTypes.includes(
          selectedDeliveryType
        );

        return (
          <div key={product._id} className="relative border rounded-lg p-4">
            <AvailabilityBadge
              available={isAvailable}
              deliveryType={selectedDeliveryType}
            />
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.description}</p>
            <button
              disabled={!isAvailable}
              className="mt-2 w-full"
            >
              Add to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
}
```

### Filtering Available Products

```tsx
// Show all products but filter out unavailable ones
const availableProducts = products.filter(product =>
  product.availableDeliveryTypes.includes(selectedDeliveryType)
);

// Or show all with badges
const allProductsWithBadges = products.map(product => ({
  ...product,
  isAvailable: product.availableDeliveryTypes.includes(selectedDeliveryType)
}));
```

## Troubleshooting

### Badge Not Appearing

**Problem**: The badge doesn't show even when product is unavailable.

**Solution**: Check that:
1. `available` prop is correctly set to `false`
2. Parent container has `relative` positioning
3. Z-index is not being overridden by other elements

```tsx
// Correct
<div className="relative">
  <AvailabilityBadge available={false} deliveryType="delivery" />
</div>

// Incorrect - missing relative positioning
<div>
  <AvailabilityBadge available={false} deliveryType="delivery" />
</div>
```

### Type Errors

**Problem**: TypeScript errors about `OrderDeliveryType`.

**Solution**: Ensure you're importing the correct type:

```typescript
import { OrderDeliveryType } from "@/types/cart";
// Not from "@/types/product"
```

### Badge Position Issues

**Problem**: Badge appears in the wrong location.

**Solution**: The default position is `absolute top-2 right-2`. Override with `className`:

```tsx
<AvailabilityBadge
  available={false}
  deliveryType="pickup"
  className="top-4 left-4"  // Custom position
/>
```

### Accessibility Warnings

**Problem**: Screen reader announces both icon and text.

**Solution**: The component already handles this with `aria-hidden="true"` on the icon. No action needed.

## Best Practices

1. **Always check availability before rendering**: Filter products or check the `availableDeliveryTypes` array
2. **Use with relative parent**: Ensure parent container has `position: relative` for proper overlay
3. **Disable interactions**: When showing the badge, consider disabling "Add to Cart" or similar actions
4. **Consistent delivery type**: Use the same delivery type across all product cards in a view
5. **Mobile responsiveness**: The badge automatically adjusts for mobile with its small size

## Related Components

- `/components/ui/badge.tsx` - Base Badge component
- `/components/address/address-type-badge.tsx` - Similar pattern for address types
- `/components/order/shared/order-status-badge.tsx` - Status badge with icon pattern
- `/components/product-details/badges/product-type-badge.tsx` - Product type indicators

## Future Enhancements

Potential improvements for future iterations:

1. **Tooltip**: Add hover tooltip with more details about availability
2. **Multiple Restrictions**: Support displaying multiple availability issues
3. **Custom Messages**: Allow custom unavailability messages
4. **Animation**: Add fade-in animation when delivery type changes
5. **Time-based Availability**: Show "Available after 5 PM" type messages
