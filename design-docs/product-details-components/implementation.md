# Product Details Components - Implementation Guide

## Overview

Production-ready UI components for food delivery product details modal, built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and shadcn/ui.

## Installation

All required dependencies are already installed:

- framer-motion
- lucide-react
- shadcn/ui components (button, checkbox, radio-group, label, textarea)

## Component Architecture

### 1. PopularityBadge
**Location:** `/components/product-details/badges/popularity-badge.tsx`

Displays "Most Ordered", "Best Seller", or "Highly Reordered" badges with amber background.

```tsx
import { PopularityBadge } from "@/components/product-details/badges/popularity-badge";

<PopularityBadge variant="most-ordered" size="sm" />
<PopularityBadge variant="best-seller" size="md" />
```

**Props:**
- `variant`: "most-ordered" | "best-seller" | "highly-reordered"
- `size`: "sm" | "md" (default: "sm")
- `className`: Additional CSS classes

### 2. ProductTypeBadge
**Location:** `/components/product-details/badges/product-type-badge.tsx`

Displays vegetarian/non-vegetarian/vegan indicator with colored dot.

```tsx
import { ProductTypeBadge } from "@/components/product-details/badges/product-type-badge";

<ProductTypeBadge type="veg" size="sm" />
<ProductTypeBadge type="non_veg" size="md" showLabel />
```

**Props:**
- `type`: "veg" | "non_veg" | "vegan"
- `size`: "sm" | "md" (default: "sm")
- `showLabel`: boolean (default: false)
- `className`: Additional CSS classes

### 3. QuantityPill
**Location:** `/components/product-details/controls/quantity-pill.tsx`

Interactive quantity selector with increment/decrement buttons.

```tsx
import { QuantityPill } from "@/components/product-details/controls/quantity-pill";

const [quantity, setQuantity] = useState(1);

<QuantityPill
  value={quantity}
  onChange={setQuantity}
  min={1}
  max={10}
  size="md"
/>
```

**Props:**
- `value`: number (current quantity)
- `onChange`: (value: number) => void
- `min`: number (default: 1)
- `max`: number (default: 99)
- `size`: "sm" | "md" | "lg" (default: "md")
- `className`: Additional CSS classes

**Features:**
- Orange background with white text
- Animated number transitions
- Disabled states at min/max
- 44px minimum touch target (size="lg")

### 4. VariantGroupCard
**Location:** `/components/product-details/cards/variant-group-card.tsx`

Card for selecting product variants (size, crust type, etc.) with radio buttons.

```tsx
import { VariantGroupCard } from "@/components/product-details/cards/variant-group-card";

const [selectedVariant, setSelectedVariant] = useState<string>();

<VariantGroupCard
  group={{
    _id: "size-group",
    label: "Choose Size",
    description: "Select your preferred size",
    isPrimary: true,
  }}
  variants={[
    { _id: "small", label: "Small", description: "8 inch" },
    { _id: "medium", label: "Medium", description: "10 inch" },
    { _id: "large", label: "Large", description: "12 inch" },
  ]}
  selectedVariantId={selectedVariant}
  onSelect={setSelectedVariant}
  getVariantPrice={(id) => {
    const prices = { small: 0, medium: 200, large: 400 };
    return prices[id] || 0;
  }}
  mostOrderedId="medium"
/>
```

**Props:**
- `group`: Group metadata (label, description, isPrimary)
- `variants`: Array of variant options
- `selectedVariantId`: Currently selected variant ID
- `onSelect`: (variantId: string) => void
- `getVariantPrice`: (variantId: string) => number (returns price in pence)
- `mostOrderedId`: ID of most popular variant (optional)
- `className`: Additional CSS classes

**Features:**
- Shows "Required • Select any 1" or "Optional • Select any 1"
- Highlights selected variant with orange border and background
- Displays popularity badge for most ordered item
- Shows price as "+£X.XX" or "Included" for free options

### 5. AddonGroupCard
**Location:** `/components/product-details/cards/addon-group-card.tsx`

Card for selecting product add-ons with checkboxes and quantity selectors.

```tsx
import { AddonGroupCard } from "@/components/product-details/cards/addon-group-card";

const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});

const handleAddonSelect = (addonId: string, quantity: number) => {
  if (quantity === 0) {
    const { [addonId]: _, ...rest } = selectedAddons;
    setSelectedAddons(rest);
  } else {
    setSelectedAddons({ ...selectedAddons, [addonId]: quantity });
  }
};

<AddonGroupCard
  group={{
    _id: "toppings-group",
    label: "Add-ons",
    description: "Customize your pizza",
    allowMulti: true,
    min: 0,
    max: 5,
  }}
  addons={[
    { _id: "cheese", label: "Extra Cheese", description: "Mozzarella" },
    { _id: "pepperoni", label: "Pepperoni", description: "Spicy" },
    { _id: "mushrooms", label: "Mushrooms" },
  ]}
  selectedAddons={selectedAddons}
  onSelect={handleAddonSelect}
  getAddonPrice={(id) => 150} // £1.50 per addon
  mostOrderedIds={["cheese", "pepperoni"]}
  onClearAll={() => setSelectedAddons({})}
/>
```

**Props:**
- `group`: Group metadata (label, description, allowMulti, min, max)
- `addons`: Array of addon options
- `selectedAddons`: Record of selected addon IDs to quantities
- `onSelect`: (addonId: string, quantity: number) => void
- `getAddonPrice`: (addonId: string) => number (returns price in pence)
- `mostOrderedIds`: Array of popular addon IDs (optional)
- `onClearAll`: () => void (optional, enables Clear button)
- `className`: Additional CSS classes

**Features:**
- Shows "Select up to X" or "Select at least X" based on group constraints
- Expand/collapse when >4 addons (shows "+X more" button)
- Animated quantity pill appearance when addon is selected
- Popularity badges for most ordered items
- "Clear" button in header when any addons are selected

### 6. StickyActionBar
**Location:** `/components/product-details/sections/sticky-action-bar.tsx`

Sticky bottom bar with quantity selector and add-to-cart button.

```tsx
import { StickyActionBar } from "@/components/product-details/sections/sticky-action-bar";

const [quantity, setQuantity] = useState(1);
const [isLoading, setIsLoading] = useState(false);

const handleAddToCart = async () => {
  setIsLoading(true);
  // API call here
  await addToCartApi();
  setIsLoading(false);
};

<StickyActionBar
  quantity={quantity}
  onQuantityChange={setQuantity}
  totalPrice={2500} // £25.00
  originalPrice={3000} // £30.00 (optional, shows strikethrough)
  isValid={true}
  isLoading={isLoading}
  onAddToCart={handleAddToCart}
/>
```

**Props:**
- `quantity`: Current quantity
- `onQuantityChange`: (quantity: number) => void
- `totalPrice`: Total price in pence
- `originalPrice`: Original price in pence (optional, for discounts)
- `isValid`: Whether selections are valid
- `isLoading`: Loading state (optional)
- `onAddToCart`: () => void
- `className`: Additional CSS classes

**Features:**
- Sticky positioning with backdrop blur
- Safe area inset padding for iOS devices
- Button states: idle, loading (spinner), success (checkmark)
- Shows validation error if isValid is false
- Displays original price with strikethrough for discounts

### 7. CookingRequestSection
**Location:** `/components/product-details/sections/cooking-request-section.tsx`

Text area for special cooking instructions with quick selection chips.

```tsx
import { CookingRequestSection } from "@/components/product-details/sections/cooking-request-section";

const [cookingRequest, setCookingRequest] = useState("");

<CookingRequestSection
  value={cookingRequest}
  onChange={setCookingRequest}
  maxLength={100}
/>
```

**Props:**
- `value`: Current text value
- `onChange`: (value: string) => void
- `maxLength`: Maximum characters (default: 100)
- `className`: Additional CSS classes

**Features:**
- Character counter (X/100)
- Quick selection chips: "No chilli", "No onion or garlic", "No mushrooms", "Extra crispy"
- Chips toggle on/off and update textarea content
- Prevents chip selection if it would exceed max length

## Complete Usage Example

```tsx
"use client";

import { useState } from "react";
import { PopularityBadge } from "@/components/product-details/badges/popularity-badge";
import { ProductTypeBadge } from "@/components/product-details/badges/product-type-badge";
import { QuantityPill } from "@/components/product-details/controls/quantity-pill";
import { VariantGroupCard } from "@/components/product-details/cards/variant-group-card";
import { AddonGroupCard } from "@/components/product-details/cards/addon-group-card";
import { StickyActionBar } from "@/components/product-details/sections/sticky-action-bar";
import { CookingRequestSection } from "@/components/product-details/sections/cooking-request-section";

export default function ProductDetailsModal() {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>();
  const [selectedAddons, setSelectedAddons] = useState<Record<string, number>>({});
  const [cookingRequest, setCookingRequest] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddonSelect = (addonId: string, qty: number) => {
    if (qty === 0) {
      const { [addonId]: _, ...rest } = selectedAddons;
      setSelectedAddons(rest);
    } else {
      setSelectedAddons({ ...selectedAddons, [addonId]: qty });
    }
  };

  const calculateTotal = () => {
    let total = 1500; // Base price £15.00

    if (selectedVariant === "medium") total += 200;
    if (selectedVariant === "large") total += 400;

    Object.entries(selectedAddons).forEach(([addonId, qty]) => {
      total += 150 * qty; // £1.50 per addon
    });

    return total * quantity;
  };

  const isValid = !!selectedVariant;

  const handleAddToCart = async () => {
    setIsLoading(true);
    // API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Product Header */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <ProductTypeBadge type="veg" />
          <PopularityBadge variant="most-ordered" />
        </div>
        <h1 className="text-2xl font-bold">Margherita Pizza</h1>
      </div>

      {/* Variant Selection */}
      <div className="px-4 mb-4">
        <VariantGroupCard
          group={{
            _id: "size-group",
            label: "Choose Size",
            isPrimary: true,
          }}
          variants={[
            { _id: "small", label: "Small", description: "8 inch" },
            { _id: "medium", label: "Medium", description: "10 inch" },
            { _id: "large", label: "Large", description: "12 inch" },
          ]}
          selectedVariantId={selectedVariant}
          onSelect={setSelectedVariant}
          getVariantPrice={(id) => {
            const prices = { small: 0, medium: 200, large: 400 };
            return prices[id] || 0;
          }}
          mostOrderedId="medium"
        />
      </div>

      {/* Add-ons */}
      <div className="px-4 mb-4">
        <AddonGroupCard
          group={{
            _id: "toppings",
            label: "Add-ons",
            allowMulti: true,
            min: 0,
            max: 5,
          }}
          addons={[
            { _id: "cheese", label: "Extra Cheese" },
            { _id: "pepperoni", label: "Pepperoni" },
            { _id: "mushrooms", label: "Mushrooms" },
            { _id: "olives", label: "Olives" },
            { _id: "peppers", label: "Bell Peppers" },
          ]}
          selectedAddons={selectedAddons}
          onSelect={handleAddonSelect}
          getAddonPrice={() => 150}
          mostOrderedIds={["cheese"]}
          onClearAll={() => setSelectedAddons({})}
        />
      </div>

      {/* Cooking Request */}
      <div className="px-4 mb-4">
        <CookingRequestSection
          value={cookingRequest}
          onChange={setCookingRequest}
        />
      </div>

      {/* Sticky Action Bar */}
      <StickyActionBar
        quantity={quantity}
        onQuantityChange={setQuantity}
        totalPrice={calculateTotal()}
        isValid={isValid}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
```

## Styling and Customization

### Colors
All components use consistent color scheme:
- Primary: `orange-500` (#F97316)
- Success: `green-500` (#22C55E)
- Error: `red-500` (#EF4444)
- Amber: `amber-500` (#F59E0B)

### Dark Mode
All components support dark mode with `dark:` variants automatically applied.

### Accessibility
- All interactive elements have minimum 44px touch targets
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements for dynamic content

### Responsive Design
- Mobile-first approach
- Safe area insets for iOS devices
- Flexible layouts with proper overflow handling

## TypeScript Types

All components are fully typed with comprehensive interfaces. No `any` types are used.

## Animation

Components use Framer Motion for smooth animations:
- Number transitions in QuantityPill
- Selection states in VariantGroupCard
- Button state transitions in StickyActionBar
- Expand/collapse in AddonGroupCard

## Price Formatting

All prices should be passed in pence (smallest currency unit) and are automatically formatted using `formatPrice()` from `@/lib/utils/currency`.

Example:
- Pass: `1250` (represents £12.50)
- Display: "£12.50"

## Troubleshooting

### Issue: Components not rendering
- Ensure you're using "use client" directive for client components
- Check that all shadcn/ui components are installed

### Issue: Prices not formatting correctly
- Verify prices are passed in pence (multiply by 100)
- Check currency.ts utility is imported correctly

### Issue: Animations not working
- Ensure framer-motion is installed
- Check for CSS conflicts with transform properties

### Issue: Dark mode not working
- Verify Tailwind CSS dark mode is configured
- Check theme provider is set up correctly

## Performance Considerations

- All components are optimized for React 19
- Use memoization for expensive calculations
- Debounce textarea input if needed for large forms
- Lazy load components in modals for faster initial render

## Browser Support

- Chrome/Edge: Latest 2 versions
- Safari: Latest 2 versions
- Firefox: Latest 2 versions
- iOS Safari: iOS 14+
- Android Chrome: Latest version

## Next Steps

1. Integrate components into product details modal
2. Connect to API endpoints for product data
3. Add analytics tracking for user interactions
4. Implement cart management logic
5. Add loading skeletons for better UX
