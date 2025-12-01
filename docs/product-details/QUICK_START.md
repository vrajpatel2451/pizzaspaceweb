# Product Details - Quick Start Guide

## Installation Commands

Run these commands first:

```bash
# Install missing shadcn components
npx shadcn@latest add label
npx shadcn@latest add scroll-area
```

## Component Summary

### ✅ Ready to Use (10 components)
- Dialog, Drawer, Accordion, RadioGroup, Checkbox
- Skeleton, Separator, Badge, Button, QuantityIncrementor

### 📦 Need to Install (2 components)
- Label
- ScrollArea

### 🆕 Need to Create (6 components)
1. **ProductImageGallery** - Display images with thumbnails
2. **ProductTypeIndicator** - Veg/Non-veg badge with icon
3. **VariantGroupSelector** - Radio group with price display
4. **AddonGroupSelector** - Checkbox group with validation
5. **ProductDetailsFooter** - Sticky footer with pricing
6. **PriceBreakdown** - Itemized price display

## Development Order

1. **Low Complexity First:**
   - ProductTypeIndicator

2. **Medium Complexity:**
   - ProductImageGallery
   - PriceBreakdown
   - VariantGroupSelector
   - AddonGroupSelector

3. **High Complexity:**
   - ProductDetailsFooter
   - Main container components

## Key Files to Read

1. `/Users/vrajpatel/Documents/personal/pizzaspace_web/types/product.ts` - API types
2. `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/dialog.tsx` - Dialog component
3. `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/drawer.tsx` - Drawer component
4. `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/composite/quantity-incrementor.tsx` - Quantity component

## API Data Structure

```typescript
ProductDetailsResponse = {
  product: ProductResponse            // Base product info
  variantGroupList: VariantGroupResponse[]  // e.g., "Size", "Crust"
  variantList: VariantResponse[]           // e.g., "Medium", "Thin"
  addonGroupList: AddonGroupResponse[]     // e.g., "Toppings"
  addonList: AddonResponse[]               // e.g., "Extra Cheese"
  pricing: VariantPricingResponse[]        // Price lookup
}
```

## Responsive Strategy

- **Desktop (≥640px):** Use Dialog component
- **Mobile (<640px):** Use Drawer component
- Use `useMediaQuery('(min-width: 640px)')` to switch

## Quick Implementation Template

```tsx
'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ProductDetails({ product, isOpen, onClose }) {
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const content = (
    <div className="space-y-6">
      {/* Add components here */}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          {content}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer isOpen={isOpen} onClose={onClose} side="bottom" size="full">
      {content}
    </Drawer>
  );
}
```

## Next Steps

1. Run installation commands
2. Read full requirements: `docs/product-details/COMPONENT_REQUIREMENTS.md`
3. Create component directory: `components/product-details/`
4. Start with ProductTypeIndicator (easiest)
5. Build up to complex components
