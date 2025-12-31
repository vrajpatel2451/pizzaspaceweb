# Unavailable Notice Component - Implementation Documentation

## Overview

The `UnavailableNotice` component is a specialized alert component for the product details modal/bottomsheet that clearly communicates when a product cannot be added to the cart due to delivery type restrictions.

**Component Location:** `/components/product-details/unavailable-notice.tsx`

## Features

- Clear, user-friendly messaging explaining unavailability
- Shows which delivery types ARE available for the product
- Suggests the user change their delivery type
- Warning/info styling (amber color scheme) - not destructive
- Info icon for visual clarity
- Full TypeScript type safety
- Responsive design with mobile-first approach
- Accessibility compliant with proper ARIA roles
- Dark mode support

## Installation

### Dependencies

All required dependencies are already installed in the project:

- `@/components/ui/alert` - shadcn/ui Alert component
- `lucide-react` - Icon library (Info icon)
- `@/types/cart` - OrderDeliveryType type definition

### Component Files

```
components/
└── product-details/
    └── unavailable-notice.tsx
```

## Usage

### Basic Example

```tsx
import { UnavailableNotice } from "@/components/product-details/unavailable-notice";

function ProductDetailsModal({ product, currentDeliveryType }) {
  // Check if product is available for current delivery type
  const isAvailable = product.availableDeliveryTypes.includes(currentDeliveryType);

  return (
    <div>
      {!isAvailable && (
        <UnavailableNotice
          productName={product.name}
          deliveryType={currentDeliveryType}
          availableDeliveryTypes={product.availableDeliveryTypes}
        />
      )}
      {/* Rest of product details */}
    </div>
  );
}
```

### Integration with Product Details

```tsx
import { UnavailableNotice } from "@/components/product-details/unavailable-notice";
import { useCart } from "@/hooks/use-cart";

function ProductDetailsContent({ data }) {
  const { deliveryType } = useCart();
  const isAvailable = data.product.availableDeliveryTypes.includes(deliveryType);

  return (
    <div className="space-y-4 p-4">
      {/* Product image and info */}

      {/* Show unavailable notice if product can't be added */}
      {!isAvailable && (
        <UnavailableNotice
          productName={data.product.name}
          deliveryType={deliveryType}
          availableDeliveryTypes={data.product.availableDeliveryTypes}
        />
      )}

      {/* Variants and addons - only show if available */}
      {isAvailable && (
        <>
          <VariantGroupsSection />
          <AddonGroupsSection />
          <StickyActionBar />
        </>
      )}
    </div>
  );
}
```

### All Delivery Type Combinations

```tsx
// Only available for delivery
<UnavailableNotice
  productName="Express Burger"
  deliveryType="dineIn"
  availableDeliveryTypes={["delivery"]}
/>
// Shows: "This item is available for Delivery."

// Available for delivery or pickup
<UnavailableNotice
  productName="Pizza Margherita"
  deliveryType="dineIn"
  availableDeliveryTypes={["delivery", "pickup"]}
/>
// Shows: "This item is available for Delivery or Pickup."

// Available for all types except current
<UnavailableNotice
  productName="Family Meal Deal"
  deliveryType="dineIn"
  availableDeliveryTypes={["delivery", "pickup"]}
/>
// Shows: "This item is available for Delivery or Pickup."

// Available for delivery, pickup, and dine in
<UnavailableNotice
  productName="Salad Bowl"
  deliveryType="delivery"
  availableDeliveryTypes={["pickup", "dineIn"]}
/>
// Shows: "This item is available for Pickup or Dine In."
```

## API Reference

### Props

```typescript
interface UnavailableNoticeProps {
  /**
   * The name of the product that is unavailable
   */
  productName: string;

  /**
   * The current delivery type that the user has selected
   */
  deliveryType: OrderDeliveryType;

  /**
   * The delivery types that this product is available for
   */
  availableDeliveryTypes: OrderDeliveryType[];
}
```

### Types

```typescript
type OrderDeliveryType = "dineIn" | "pickup" | "delivery";
```

## Styling

### Color Scheme

The component uses an amber (warning/info) color scheme:

- **Light Mode:**
  - Background: `bg-amber-50`
  - Border: `border-amber-200`
  - Text: `text-amber-900`
  - Icon: `text-amber-600`

- **Dark Mode:**
  - Background: `dark:bg-amber-950`
  - Border: `dark:border-amber-800`
  - Text: `dark:text-amber-100`
  - Icon: `dark:text-amber-400`

### Custom Styling

You can customize the appearance by passing additional Tailwind classes (though not exposed as a prop by default):

```tsx
// If you want to add className prop support, modify the component:
export function UnavailableNotice({
  productName,
  deliveryType,
  availableDeliveryTypes,
  className, // Add this
}: UnavailableNoticeProps & { className?: string }) {
  return (
    <Alert
      variant="default"
      className={cn(
        "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
        className
      )}
    >
      {/* ... */}
    </Alert>
  );
}
```

## Accessibility

The component follows WCAG accessibility guidelines:

- Uses semantic HTML with proper Alert role via shadcn/ui Alert component
- Clear, descriptive text that's screen reader friendly
- Sufficient color contrast in both light and dark modes
- Info icon provides visual reinforcement without being the sole indicator
- Responsive text sizing (text-xs on mobile, text-sm on desktop)

## Responsive Design

- Mobile-first approach with Tailwind responsive utilities
- Text sizing adapts: `text-xs sm:text-sm`
- Spacing and padding adjust based on viewport
- Works seamlessly in both modal (desktop) and bottomsheet (mobile) contexts

## Message Formatting

The component intelligently formats available delivery types:

| Available Types | Formatted Message |
|----------------|-------------------|
| `["delivery"]` | "available for **Delivery**" |
| `["delivery", "pickup"]` | "available for **Delivery or Pickup**" |
| `["delivery", "pickup", "dineIn"]` | "available for **Delivery, Pickup, or Dine In**" |

## Best Practices

1. **Show Only When Needed:** Only render this component when `!product.availableDeliveryTypes.includes(currentDeliveryType)`

2. **Position Strategically:** Place near the top of product details, before variant/addon sections

3. **Hide Add-to-Cart:** When showing this notice, hide or disable the add-to-cart functionality

4. **Provide Action:** Consider adding a button/link to change delivery type (future enhancement)

## Example Implementation in Product Details Context

```tsx
"use client";

import * as React from "react";
import { UnavailableNotice } from "@/components/product-details/unavailable-notice";
import { ProductImageSection } from "./sections/product-image-section";
import { ProductInfoSection } from "./sections/product-info-section";
import { VariantGroupsSection } from "./sections/variant-groups-section";
import { AddonGroupsSection } from "./sections/addon-groups-section";
import { StickyActionBar } from "./sections/sticky-action-bar";
import { useCart } from "@/hooks/use-cart";

export function ProductDetailsContent({ data }) {
  const { deliveryType } = useCart();

  // Check availability
  const isAvailableForDeliveryType = data.product.availableDeliveryTypes.includes(
    deliveryType
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="space-y-3 sm:space-y-5 p-3 sm:p-5 pb-24 sm:pb-28">
          {/* Product Image */}
          <ProductImageSection
            images={data.product.photoList ?? []}
            productName={data.product.name}
            productType={data.product.type}
          />

          {/* Product Info */}
          <ProductInfoSection product={data.product} />

          {/* Unavailable Notice */}
          {!isAvailableForDeliveryType && (
            <UnavailableNotice
              productName={data.product.name}
              deliveryType={deliveryType}
              availableDeliveryTypes={data.product.availableDeliveryTypes}
            />
          )}

          {/* Only show variants/addons if available */}
          {isAvailableForDeliveryType && (
            <>
              <VariantGroupsSection
                variantGroupList={data.variantGroupList}
                variantList={data.variantList}
              />
              <AddonGroupsSection
                addonGroupList={data.addonGroupList}
                addonList={data.addonList}
              />
            </>
          )}
        </div>
      </div>

      {/* Only show action bar if available */}
      {isAvailableForDeliveryType && <StickyActionBar />}
    </div>
  );
}
```

## Future Enhancements

Potential improvements for future iterations:

1. **Action Button:** Add a "Change Delivery Type" button that opens delivery type selector
2. **Animation:** Add subtle entrance animation for better UX
3. **Dismissible:** Make the notice dismissible if user acknowledges the message
4. **Custom Messages:** Support custom messages via props for special cases
5. **Store-Specific:** Show if product is available at different store locations

## Testing

### Unit Test Example (Jest/React Testing Library)

```tsx
import { render, screen } from "@testing-library/react";
import { UnavailableNotice } from "./unavailable-notice";

describe("UnavailableNotice", () => {
  it("renders correct message for single available type", () => {
    render(
      <UnavailableNotice
        productName="Test Pizza"
        deliveryType="dineIn"
        availableDeliveryTypes={["delivery"]}
      />
    );

    expect(screen.getByText(/not available for Dine In/i)).toBeInTheDocument();
    expect(screen.getByText(/available for Delivery/i)).toBeInTheDocument();
  });

  it("formats multiple delivery types correctly", () => {
    render(
      <UnavailableNotice
        productName="Test Pizza"
        deliveryType="dineIn"
        availableDeliveryTypes={["delivery", "pickup"]}
      />
    );

    expect(screen.getByText(/Delivery or Pickup/i)).toBeInTheDocument();
  });

  it("has proper accessibility attributes", () => {
    const { container } = render(
      <UnavailableNotice
        productName="Test Pizza"
        deliveryType="dineIn"
        availableDeliveryTypes={["delivery"]}
      />
    );

    const alert = container.querySelector('[role="alert"]');
    expect(alert).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Issue: Component not showing

**Solution:** Verify that:
1. `availableDeliveryTypes` does NOT include `deliveryType`
2. Component is being conditionally rendered based on availability check
3. Data is properly loaded from API

### Issue: Incorrect message formatting

**Solution:** Check that:
1. `availableDeliveryTypes` is an array of valid OrderDeliveryType values
2. Types are exactly: "delivery", "pickup", or "dineIn" (case-sensitive)

### Issue: Styling not matching design

**Solution:** Ensure:
1. Tailwind CSS is properly configured
2. Dark mode classes are supported in your Tailwind config
3. Color classes (amber-*) are not purged from production build

## Related Components

- `/components/ui/alert.tsx` - Base Alert component from shadcn/ui
- `/components/product-details/product-details-content.tsx` - Main product details content
- `/components/product-details/sections/sticky-action-bar.tsx` - Add to cart action bar

## References

- [shadcn/ui Alert Component](https://ui.shadcn.com/docs/components/alert)
- [Lucide Icons - Info](https://lucide.dev/icons/info)
- [WCAG Alert Role](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
