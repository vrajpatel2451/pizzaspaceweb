# Price Display Component - Phase 3.2 Implementation

## Overview

A production-ready, reusable React component for displaying product prices with optional packaging charge breakdown. Built with TypeScript, proper accessibility, and optional animations following shadcn/ui patterns.

## Component Location

- **Main Component**: `/components/product/price-display.tsx`
- **Exports**: `/components/product/index.ts`

## Features

### Core Functionality
- Automatic price calculation using existing price utilities
- Conditional packaging charge display for delivery orders
- Multiple size variants (sm, md, lg)
- Optional animated price transitions
- Full TypeScript type safety
- WCAG accessibility compliance

### Price Calculation
The component automatically calculates the total price by:
1. Using the `calculateDisplayPrice()` utility from `/lib/utils/price.ts`
2. Adding packaging charges only for "delivery" order type
3. Showing breakdown when `showBreakdown` prop is true

### Responsive Design
- Mobile-first typography scaling
- Size-specific font weights and sizes
- Tailwind CSS utility classes
- Dark mode support with proper color contrast

## Installation

No additional dependencies required. The component uses:
- Existing price utilities (`/lib/utils/price.ts`)
- Type definitions from `/types/cart.ts`
- Standard UI utilities (`cn` from `/lib/utils`)

## Usage

### Basic Usage

```tsx
import { PriceDisplay } from "@/components/product";

// Simple price display for pickup
<PriceDisplay
  basePrice={12.50}
  deliveryType="pickup"
/>
```

### With Packaging Breakdown

```tsx
// Show packaging breakdown for delivery orders
<PriceDisplay
  basePrice={12.50}
  packagingCharges={0.50}
  deliveryType="delivery"
  showBreakdown
/>
```

### Size Variants

```tsx
// Small size for product cards
<PriceDisplay
  basePrice={10.00}
  deliveryType="dineIn"
  size="sm"
/>

// Medium size (default)
<PriceDisplay
  basePrice={15.00}
  deliveryType="pickup"
  size="md"
/>

// Large size for CTAs and action bars
<PriceDisplay
  basePrice={20.00}
  deliveryType="delivery"
  size="lg"
/>
```

### Compact Variant

```tsx
import { CompactPriceDisplay } from "@/components/product";

// Simplified version without breakdown
<CompactPriceDisplay
  basePrice={12.50}
  packagingCharges={0.50}
  deliveryType="delivery"
/>
```

### With Custom Styling

```tsx
<PriceDisplay
  basePrice={18.00}
  deliveryType="pickup"
  size="md"
  className="my-4"
  animate={false}
/>
```

## Props API

### PriceDisplayProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `basePrice` | `number` | **Required** | Base price of the product in pounds |
| `packagingCharges` | `number` | `0` | Additional packaging charges (only for delivery) |
| `deliveryType` | `OrderDeliveryType` | **Required** | Order delivery type: "delivery", "pickup", or "dineIn" |
| `showBreakdown` | `boolean` | `false` | Show base price + packaging breakdown |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Typography size variant |
| `className` | `string` | `undefined` | Additional CSS classes |
| `animate` | `boolean` | `true` | Enable price change animations |

### CompactPriceDisplay

Same as `PriceDisplayProps` but excludes:
- `showBreakdown` (always false)
- `size` (always "sm")
- `animate` (always false)

## Size Configuration

The component uses three size variants with responsive typography:

### Small (`size="sm"`)
- Total price: `text-base font-bold`
- Breakdown: `text-sm font-medium`
- Packaging: `text-[10px] font-medium`
- **Use case**: Product cards, list items, compact layouts

### Medium (`size="md"`) - Default
- Total price: `text-xl sm:text-2xl font-bold`
- Breakdown: `text-base sm:text-lg font-semibold`
- Packaging: `text-xs font-medium`
- **Use case**: Product details, general displays

### Large (`size="lg"`)
- Total price: `text-2xl sm:text-3xl font-bold`
- Breakdown: `text-lg sm:text-xl font-semibold`
- Packaging: `text-sm font-medium`
- **Use case**: CTAs, sticky action bars, primary actions

## Animation Behavior

When `animate={true}` (default):
- Price changes trigger a subtle fade-in and slide-up animation
- Animation duration: 200ms
- Uses Tailwind's built-in `animate-in` utilities
- Automatically detects price changes via component key

To disable animations:
```tsx
<PriceDisplay animate={false} {...otherProps} />
```

## Accessibility Features

### Screen Reader Support
- Semantic HTML with proper `role` attributes
- `aria-label` provides full price context
- `aria-live="polite"` for price updates
- Hidden breakdown details for screen readers

### ARIA Labels
The component generates comprehensive labels:
```
"Total price £13.00, including £12.50 base price and £0.50 packaging charge"
```

### Keyboard Navigation
- Component is not interactive (display only)
- Proper focus management in parent containers

## Color Scheme

### Light Mode
- Total price: `text-orange-500`
- Breakdown text: `text-muted-foreground`

### Dark Mode
- Total price: `text-orange-400`
- Breakdown text: `text-muted-foreground` (auto-adjusts)

## Integration Examples

### In Product Card

```tsx
import { PriceDisplay } from "@/components/product";

function ProductCard({ product, deliveryType }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <PriceDisplay
        basePrice={product.basePrice}
        packagingCharges={product.packagingCharges}
        deliveryType={deliveryType}
        size="sm"
      />
    </div>
  );
}
```

### In Sticky Action Bar

```tsx
import { PriceDisplay } from "@/components/product";

function StickyActionBar({ totalPrice, deliveryType }) {
  return (
    <div className="sticky bottom-0">
      <PriceDisplay
        basePrice={totalPrice}
        deliveryType={deliveryType}
        size="lg"
      />
      <button>Add to Cart</button>
    </div>
  );
}
```

### With Breakdown in Checkout

```tsx
import { PriceDisplay } from "@/components/product";

function CheckoutItem({ item, deliveryType }) {
  return (
    <div className="checkout-item">
      <span>{item.name}</span>
      <PriceDisplay
        basePrice={item.basePrice}
        packagingCharges={item.packagingCharges}
        deliveryType={deliveryType}
        showBreakdown
        size="md"
      />
    </div>
  );
}
```

## Type Definitions

The component exports the following types:

```typescript
// Main props interface
export interface PriceDisplayProps {
  basePrice: number;
  packagingCharges?: number;
  deliveryType: OrderDeliveryType;
  showBreakdown?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  animate?: boolean;
}

// Available from @/types/cart
type OrderDeliveryType = "dineIn" | "pickup" | "delivery";
```

## Dependencies

### Internal Dependencies
- `@/lib/utils/price` - Price calculation utilities
  - `calculateDisplayPrice()` - Calculate total with packaging
  - `formatPrice()` - Format price for display
- `@/types/cart` - Type definitions
  - `OrderDeliveryType` - Delivery type enum
- `@/lib/utils` - Utility functions
  - `cn()` - Class name merging

### External Dependencies
- `react` - React library (no hooks needed except for animations)
- `tailwindcss` - Styling framework

## Performance Considerations

### Rendering Optimization
- Pure functional component
- Minimal re-renders (only on prop changes)
- No expensive computations
- Lightweight animation triggers

### Memory Usage
- No internal state management (except for animations)
- No event listeners
- Small component bundle size

## Browser Support

Follows Next.js 16 browser support:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- iOS Safari 12.2+
- Android Chrome

## Testing Recommendations

### Unit Tests
```typescript
describe("PriceDisplay", () => {
  it("should display base price for pickup", () => {
    // Test basic rendering
  });

  it("should add packaging for delivery", () => {
    // Test delivery calculation
  });

  it("should show breakdown when enabled", () => {
    // Test breakdown display
  });

  it("should apply correct size classes", () => {
    // Test size variants
  });
});
```

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast ratios
- ARIA label accuracy

## Customization

### Custom Colors
```tsx
<PriceDisplay
  basePrice={15.00}
  deliveryType="pickup"
  className="[&>div:first-child]:text-blue-500"
/>
```

### Custom Fonts
```tsx
<PriceDisplay
  basePrice={15.00}
  deliveryType="pickup"
  className="font-mono"
/>
```

## Troubleshooting

### Price Not Updating
- Ensure parent component is passing updated `basePrice` prop
- Check if `animate` prop is causing visual delay

### Breakdown Not Showing
- Verify `showBreakdown={true}` is set
- Check `deliveryType === "delivery"`
- Confirm `packagingCharges > 0`

### Styling Issues
- Use `className` prop for custom styles
- Check Tailwind CSS class conflicts
- Verify dark mode theme setup

## Future Enhancements

Potential improvements for future iterations:
- Currency support (multi-currency)
- Discount/strikethrough pricing
- Tax breakdown display
- Custom animation configurations
- Percentage discount badges

## Related Components

- `AvailabilityBadge` - Show delivery type availability
- `StickyActionBar` - Uses PriceDisplay for cart actions
- `ProductCard` - Product card with pricing

## Changelog

### v1.0.0 (2025-12-31)
- Initial implementation
- Support for 3 size variants
- Packaging breakdown feature
- Animation support
- Full accessibility compliance
- TypeScript type safety
- Dark mode support

## Support

For questions or issues:
1. Check this documentation
2. Review `/lib/utils/price.ts` for calculation logic
3. Examine existing usage in product components
4. Verify prop types match interface

## License

Part of PizzaSpace Web application. Internal use only.
