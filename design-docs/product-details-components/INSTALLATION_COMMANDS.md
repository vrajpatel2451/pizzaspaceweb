# Installation Commands - Product Details Components

## Quick Reference

### Status Check

```bash
# Check if accordion is installed
ls /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/accordion.tsx

# Check if carousel is installed
ls /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/carousel.tsx
```

---

## Component Installation

### 1. Accordion Component

**Status:** ✅ Already Installed

The accordion component is already in your project at:
```
/components/ui/accordion.tsx
```

No installation needed. You can start using it immediately:

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

---

### 2. Carousel Component

**Status:** ⚠️ Not Yet Installed

To add the carousel component, run:

```bash
npx shadcn@latest add carousel
```

This command will:
1. Download and add `embla-carousel-react` dependency
2. Create `/components/ui/carousel.tsx`
3. Update your `package.json` with the new dependency
4. Provide TypeScript types automatically

---

## Dependency Installation

### If You Need to Install Dependencies Manually

```bash
# Install Embla Carousel
npm install embla-carousel-react embla-carousel-autoplay

# Or with pnpm
pnpm add embla-carousel-react embla-carousel-autoplay

# Or with yarn
yarn add embla-carousel-react embla-carousel-autoplay
```

---

## Verification Commands

### Verify Accordion Installation

```bash
# Check if accordion exists
test -f /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/accordion.tsx && echo "✅ Accordion installed" || echo "❌ Accordion not found"

# Verify imports work
grep -n "export" /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/accordion.tsx
```

### Verify Carousel Installation

```bash
# Check if carousel exists
test -f /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/carousel.tsx && echo "✅ Carousel installed" || echo "❌ Carousel not found"

# Check if embla-carousel-react is in package.json
grep -i "embla-carousel" /Users/vrajpatel/Documents/personal/pizzaspace_web/package.json
```

---

## All-in-One Installation Command

To install all product detail components at once:

```bash
npx shadcn@latest add accordion carousel
```

This will:
- Ensure accordion is up to date
- Install carousel component
- Install all required dependencies
- Update TypeScript types

---

## Import Paths

### Accordion Imports

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

### Carousel Imports

```tsx
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "embla-carousel-react"
```

---

## Component Files Created

After installation, you'll have:

```
/components/ui/
├── accordion.tsx          ✅ Already exists
└── carousel.tsx           ⬜ Will be created
```

---

## Next Steps After Installation

1. Create product image carousel component:
   ```
   /components/product-details/sections/product-image-carousel.tsx
   ```

2. Create product description section:
   ```
   /components/product-details/sections/product-description-section.tsx
   ```

3. Import and use in your product details modal

4. Test all functionality

---

## Troubleshooting

### Carousel install fails

```bash
# Clear npm cache
npm cache clean --force

# Try again
npx shadcn@latest add carousel

# If that fails, install manually
npm install embla-carousel-react embla-carousel-autoplay
```

### TypeScript errors with CarouselApi

Ensure you're importing the type:

```tsx
import type { CarouselApi } from "embla-carousel-react"

// Use it in state
const [api, setApi] = React.useState<CarouselApi>()
```

### Components not found

Make sure aliases are configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/components/ui/*": ["./components/ui/*"]
    }
  }
}
```

---

## Development Server

After installing components, start the dev server to test:

```bash
npm run dev
```

Then navigate to:
- http://localhost:3000/demo/product-details (existing demo)

---

## Build Verification

Verify everything builds correctly:

```bash
npm run build
```

This will:
- Check TypeScript compilation
- Verify all imports resolve
- Show any warnings or errors

---

**Last Updated:** December 1, 2024
**Command Status:** Ready to run

