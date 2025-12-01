# PizzaSpace Product Details - shadcn/ui Component Research

**Date:** December 1, 2024
**Task:** Research accordion/collapsible and carousel components for product details redesign
**Status:** Complete

---

## Executive Summary

This document provides comprehensive research findings for two key shadcn/ui components needed for the PizzaSpace product details modal redesign:

1. **Accordion** - For displaying product descriptions with collapsible sections
2. **Carousel** - For multi-image product sliders

Both components are battle-tested, accessible, and production-ready.

---

## Part 1: Accordion Component Research

### Overview

The Accordion component from shadcn/ui is built on top of Radix UI's `@radix-ui/react-accordion` primitive and provides an accessible, composable accordion interface.

**Best For:** Single product detail section expansion (description, details, reviews, etc.)

### Dependencies

```json
{
  "@radix-ui/react-accordion": "^1.0.0+",
  "lucide-react": "^0.x.x"
}
```

### Component Architecture

The accordion in PizzaSpace consists of 4 composable parts:

```
├── Accordion (Root Container)
│   └── AccordionItem
│       ├── AccordionTrigger
│       └── AccordionContent
```

### API Reference

#### Accordion (Root)

```typescript
interface AccordionProps extends React.ComponentProps<typeof AccordionPrimitive.Root> {
  type: "single" | "multiple";      // Required: single allows one open, multiple allows many
  collapsible?: boolean;             // Optional: allows closing all items (single mode only)
  defaultValue?: string | string[];  // Optional: initially expanded items
  value?: string | string[];         // Optional: controlled open state
  onValueChange?: (value: string | string[]) => void;  // Optional: change callback
}
```

#### AccordionItem

```typescript
interface AccordionItemProps extends React.ComponentProps<typeof AccordionPrimitive.Item> {
  value: string;      // Unique identifier for this item (required)
  className?: string; // Optional: custom Tailwind classes
}
```

#### AccordionTrigger

```typescript
interface AccordionTriggerProps extends React.ComponentProps<typeof AccordionPrimitive.Trigger> {
  children: React.ReactNode;  // Trigger text/content
  className?: string;         // Optional: custom Tailwind classes
}
// Features built-in:
// - ChevronDownIcon that rotates on open
// - Focus states with ring indicators
// - Hover underline effect
// - Smooth transitions
```

#### AccordionContent

```typescript
interface AccordionContentProps extends React.ComponentProps<typeof AccordionPrimitive.Content> {
  children: React.ReactNode;  // Content to show when expanded
  className?: string;         // Optional: custom Tailwind classes
}
// Features built-in:
// - Smooth animate-accordion-down/animate-accordion-up animations
// - Proper overflow handling
```

### Current Implementation in PizzaSpace

**File:** `/components/ui/accordion.tsx`

The accordion component is already installed and has these features:

- ✅ Smooth chevron rotation animation
- ✅ Focus visible states with ring indicators
- ✅ Keyboard navigation support (built-in via Radix)
- ✅ ARIA labels and roles (built-in via Radix)
- ✅ Responsive padding and margins
- ✅ Dark mode support via Tailwind
- ✅ Last item border removal

### Installation Status

**Already Installed** ✅

The accordion component is already in your codebase. No additional installation needed.

### Usage Example: Product Description Section

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface ProductDescriptionProps {
  productName: string;
  price: string;
  description: string;
  details?: {
    ingredients?: string;
    allergens?: string;
    calories?: string;
    prepTime?: string;
  };
}

export function ProductDescriptionSection({
  productName,
  price,
  description,
  details,
}: ProductDescriptionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="item-1"
      className="w-full"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger className="flex items-center justify-between px-4 py-3">
          <div className="flex flex-1 items-center justify-between gap-4">
            <span className="font-semibold text-base">{productName}</span>
            <span className="ml-auto font-semibold text-sm">{price}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pt-0 pb-4">
          <div className="flex flex-col gap-4">
            {/* Main Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>

            {/* Details Grid */}
            {details && (
              <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                {details.prepTime && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Prep Time:</span>
                    <p className="font-medium">{details.prepTime}</p>
                  </div>
                )}
                {details.calories && (
                  <div className="text-xs">
                    <span className="text-muted-foreground">Calories:</span>
                    <p className="font-medium">{details.calories}</p>
                  </div>
                )}
                {details.ingredients && (
                  <div className="col-span-2 text-xs">
                    <span className="text-muted-foreground">Ingredients:</span>
                    <p className="font-medium">{details.ingredients}</p>
                  </div>
                )}
                {details.allergens && (
                  <div className="col-span-2 text-xs">
                    <span className="text-muted-foreground">Allergens:</span>
                    <p className="font-medium text-orange-600">
                      {details.allergens}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Key Props for Product Details

| Prop | Value | Purpose |
|------|-------|---------|
| `type` | "single" | Only one section open at a time |
| `collapsible` | true | Allow closing the section |
| `defaultValue` | "item-1" | Start with section expanded |
| `className` | "w-full" | Full width in container |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Navigate to next trigger |
| `Shift+Tab` | Navigate to previous trigger |
| `Space` | Toggle current accordion item |
| `Enter` | Toggle current accordion item |
| `ArrowDown` | Focus next trigger (if focused) |
| `ArrowUp` | Focus previous trigger (if focused) |
| `Home` | Focus first trigger |
| `End` | Focus last trigger |

### Accessibility Features

- ✅ Built on Radix UI primitives (WCAG compliant)
- ✅ Semantic HTML with proper `<header>` elements
- ✅ `aria-expanded` states automatically managed
- ✅ `aria-controls` linking triggers to content
- ✅ Keyboard accessible (Tab, Space, Enter, Arrows)
- ✅ Focus visible indicators with ring styling
- ✅ Screen reader announcements of state changes
- ✅ Minimum 44px touch target height

### Styling & Customization

#### Default Styles
- Border-bottom separator between items
- 4px padding top/bottom on trigger
- 4px padding on content
- ChevronDownIcon rotates 180deg on open
- Hover underline effect
- Focus ring with 3px width

#### Custom Styling Example
```tsx
// Compact spacing for mobile
<Accordion className="space-y-2">
  <AccordionItem value="item-1" className="border-0 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
    <AccordionTrigger className="px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-800">
      Product Details
    </AccordionTrigger>
    <AccordionContent className="px-4 py-4">
      Content here
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Dark Mode
The component automatically supports dark mode through Tailwind CSS:
```tsx
// These classes handle dark mode automatically
className="text-muted-foreground" // Adjusts color in dark mode
className="border-b"              // Adjusts border color in dark mode
className="hover:underline"       // Works in both light and dark
```

### Animations

The accordion includes two built-in animations:

```css
/* In your tailwind.config.ts animations are defined as: */
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

/* Applied to content via data attributes: */
.data-[state=open]:animate-accordion-down
.data-[state=closed]:animate-accordion-up
```

Performance: Animations use CSS and Radix animations, not JavaScript.

### Why Accordion is Better Than Collapsible for This Use Case

| Feature | Accordion | Collapsible |
|---------|-----------|------------|
| Multiple items | ✅ Yes | ⚠️ Manual management |
| Built-in styling | ✅ Yes | ❌ No |
| ARIA labels | ✅ Auto | ❌ Manual |
| Animation | ✅ Built-in | ❌ Manual |
| Touch-friendly | ✅ Large targets | ⚠️ Need customization |
| Single-item use | ✅ Yes | ✅ Yes |

**Recommendation:** Use Accordion for the product description section as it provides better UX with automatic state management and built-in animations.

---

## Part 2: Carousel Component Research

### Overview

The Carousel component from shadcn/ui is built on top of Embla Carousel, a vanilla JavaScript carousel library optimized for performance and simplicity. It's production-ready and supports touch gestures out of the box.

**Best For:** Multi-image product sliders with swipe support on mobile

### Dependencies

```json
{
  "embla-carousel-react": "^7.0.0+",
  "embla-carousel-autoplay": "^7.0.0+" // Optional, for auto-advance
}
```

### Installation Command

**Not yet installed** - You'll need to add this component:

```bash
npx shadcn@latest add carousel
```

This will:
1. Install `embla-carousel-react` dependency
2. Add `/components/ui/carousel.tsx` to your project
3. Include all necessary TypeScript types

### Component Architecture

The carousel consists of 4 composable parts:

```
├── Carousel (Root Container)
│   ├── CarouselContent (Wrapper for items)
│   │   └── CarouselItem (Individual slide)
│   ├── CarouselPrevious (Left arrow button)
│   └── CarouselNext (Right arrow button)
```

### API Reference

#### Carousel (Root)

```typescript
interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: EmblaCarouselOptions;
  setApi?: (api: CarouselApi) => void;
  plugins?: EmblaPlugin[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

interface EmblaCarouselOptions {
  align?: "start" | "center" | "end";      // Item alignment in viewport
  axis?: "x" | "y";                        // Scroll direction
  containScroll?: "trimSnaps" | "keepSnaps"; // Snap behavior
  direction?: "ltr" | "rtl";               // Text direction
  dragFree?: boolean;                      // Free drag or snap to slides
  loop?: boolean;                          // Infinite loop
  skipSnaps?: boolean;                     // Skip certain snap points
  speed?: number;                          // Deceleration speed
  startIndex?: number;                     // Initial slide index
}
```

#### CarouselContent

```typescript
interface CarouselContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;  // Usually: "flex -ml-4"
}
```

#### CarouselItem

```typescript
interface CarouselItemProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;  // Usually: "pl-4 md:basis-1/2 lg:basis-1/3"
}
```

#### CarouselNext / CarouselPrevious

```typescript
interface CarouselNavButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "outline" | "ghost";  // Button style
  size?: "default" | "sm" | "lg";  // Button size
  className?: string;              // Custom classes
}
```

### Installation Status

**Not Yet Installed** ⚠️

### Usage Example: Product Image Carousel

```tsx
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { CustomImage } from "@/components/ui/custom-image"

interface ProductImageCarouselProps {
  images: {
    url: string;
    alt: string;
  }[];
  productName: string;
}

export function ProductImageCarousel({
  images,
  productName,
}: ProductImageCarouselProps) {
  const [current, setCurrent] = React.useState(0)
  const [api, setApi] = React.useState<any>(null)

  React.useEffect(() => {
    if (!api) return

    const handleSelect = () => {
      setCurrent(api.selectedIndex())
    }

    api.on("select", handleSelect)
    return () => {
      api.off("select", handleSelect)
    }
  }, [api])

  // Only show carousel if multiple images
  if (images.length <= 1) {
    return (
      <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
        <CustomImage
          src={images[0]?.url || ""}
          alt={productName}
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <Carousel
        opts={{
          align: "center",
          loop: true,
          dragFree: false, // Snap to slides
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="basis-full">
              <div className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-lg overflow-hidden">
                <CustomImage
                  src={image.url}
                  alt={image.alt || `${productName} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Buttons */}
        <CarouselPrevious
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 backdrop-blur-sm z-10"
        />
        <CarouselNext
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black/80 backdrop-blur-sm z-10"
        />

        {/* Dot Indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 dark:bg-white/20 px-3 py-2 rounded-full backdrop-blur-sm z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`transition-all rounded-full ${
                index === current
                  ? "bg-white w-2 h-2"
                  : "bg-white/50 w-1.5 h-1.5 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  )
}
```

### Key Props for Product Carousel

| Prop | Value | Purpose |
|------|-------|---------|
| `opts.align` | "center" | Center items in viewport |
| `opts.loop` | true | Infinite loop when reaching end |
| `opts.dragFree` | false | Snap to slides (not free-scroll) |
| `setApi` | callback | Get carousel API for dot indicators |
| `orientation` | "horizontal" | Left-to-right scrolling |

### API Methods

Once you have the `api` reference from `setApi`, you can use:

```typescript
// Navigation
api.scrollTo(index)          // Jump to specific slide
api.scrollNext()             // Go to next slide
api.scrollPrev()             // Go to previous slide

// State
api.selectedIndex()          // Get current slide index
api.scrollSnapList()         // Get all snap points
api.slideNodes()             // Get all slide DOM elements
api.containerNode()          // Get container element

// Events
api.on("select", callback)   // Slide changed
api.on("settle", callback)   // Scrolling finished
api.off("select", callback)  // Remove listener
```

### Touch & Gesture Support

Embla Carousel provides native support for:

- ✅ **Swipe gestures** - Touch and drag to navigate
- ✅ **Momentum scrolling** - Inertia-based scrolling on touch devices
- ✅ **Mouse drag** - Desktop drag to navigate
- ✅ **Wheel events** - Scroll wheel navigation (optional)
- ✅ **Keyboard navigation** - Arrow keys (with proper setup)

### Keyboard Navigation Setup

To add keyboard support to the carousel:

```tsx
import { Keyboard } from "embla-carousel-autoplay"

<Carousel
  opts={{ loop: true }}
  plugins={[Keyboard()]} // Add keyboard plugin
>
  {/* Carousel content */}
</Carousel>
```

### Accessibility Features

- ✅ Semantic button elements with proper roles
- ✅ ARIA labels for navigation buttons
- ✅ `aria-label` on dot indicators
- ✅ Focus visible states on buttons
- ✅ Keyboard accessible (Tab to navigate)
- ✅ Touch accessible (44px minimum button size)
- ✅ Proper semantic `<div>` structure
- ✅ Image alt text support

### Responsive Design

Embla Carousel is inherently responsive through Tailwind CSS basis classes:

```tsx
// Example: Different slide widths for different screen sizes
<CarouselItem className="basis-full md:basis-1/2 lg:basis-1/3">
  {/* Slide content */}
</CarouselItem>
```

For product images (full-width slides):
```tsx
<CarouselItem className="basis-full"> {/* Always full width */}
```

### Advanced: Dot Indicators Implementation

The example above includes dot indicators. Here's what makes it work:

1. **State Management:**
   ```tsx
   const [current, setCurrent] = React.useState(0)
   const [api, setApi] = React.useState<any>(null)
   ```

2. **Track Changes:**
   ```tsx
   api.on("select", () => {
     setCurrent(api.selectedIndex())
   })
   ```

3. **Click Handler:**
   ```tsx
   onClick={() => api?.scrollTo(index)}
   ```

4. **Dynamic Styling:**
   ```tsx
   className={`${
     index === current
       ? "bg-white w-2 h-2"     // Active
       : "bg-white/50 w-1.5 h-1.5" // Inactive
   }`}
   ```

### Performance Considerations

Embla Carousel is optimized for performance:

- ✅ Pure CSS transforms (GPU accelerated)
- ✅ No re-renders on scroll by default
- ✅ Vanilla JavaScript (no heavy dependencies)
- ✅ Small bundle size (~8KB minified)
- ✅ Handles large numbers of slides efficiently

### Browser Support

- ✅ Chrome/Edge: Latest 2 versions
- ✅ Safari: Latest 2 versions (including iOS Safari)
- ✅ Firefox: Latest 2 versions
- ✅ iOS: Safari 10+
- ✅ Android: Chrome Mobile, Firefox Mobile

### Common Issues & Solutions

#### Issue: Carousel doesn't scroll on mobile
**Solution:** Ensure `dragFree: false` for snapping, add pointer events:
```tsx
opts={{ dragFree: false, axis: "x" }}
```

#### Issue: Images are blurry or slow to load
**Solution:** Use `CustomImage` with proper sizing and priority:
```tsx
<CustomImage
  src={image.url}
  alt={image.alt}
  fill
  className="object-cover"
  priority={index === 0}
/>
```

#### Issue: Dot indicators don't update
**Solution:** Ensure you're using the effect hook:
```tsx
useEffect(() => {
  if (!api) return
  api.on("select", () => setCurrent(api.selectedIndex()))
}, [api])
```

#### Issue: Too many re-renders
**Solution:** Use `useCallback` for handlers:
```tsx
const handleDotClick = useCallback((index: number) => {
  api?.scrollTo(index)
}, [api])
```

---

## Comparison: Accordion vs Collapsible

For the product description section, you have two options:

| Feature | Accordion | Collapsible |
|---------|-----------|-------------|
| **Purpose** | Multiple sections | Single section |
| **State** | Built-in management | Manual management |
| **ARIA** | Auto labels | Manual labels |
| **Animations** | Built-in | Manual setup required |
| **Styling** | Default provided | Custom required |
| **Touch targets** | 44px+ | Depends on implementation |
| **Keyboard** | Full support | Basic support |
| **Use case fit** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation:** Use **Accordion** even for a single item. It provides better UX, accessibility, and requires less custom code.

---

## Implementation Checklist

### Before Implementation

- [ ] Read this research document completely
- [ ] Review component architecture diagrams
- [ ] Check existing `/components/ui/accordion.tsx` implementation
- [ ] Install carousel: `npx shadcn@latest add carousel`
- [ ] Verify dependencies are installed

### Accordion Implementation

- [ ] Plan description section content (name, price, details)
- [ ] Create ProductDescriptionSection component
- [ ] Add proper styling for product header layout
- [ ] Test expand/collapse behavior
- [ ] Verify keyboard navigation works
- [ ] Test on mobile (swipe if needed)
- [ ] Test dark mode appearance
- [ ] Verify accessibility with screen reader

### Carousel Implementation

- [ ] Install carousel component
- [ ] Create ProductImageCarousel component
- [ ] Implement dot indicators with click handlers
- [ ] Test swipe/drag on mobile
- [ ] Test with CustomImage component
- [ ] Verify image loading (priority, lazy load)
- [ ] Test with 1, 2, and many images
- [ ] Test dark mode appearance
- [ ] Verify accessibility (alt text, keyboard)

### Integration

- [ ] Import both components in product details modal
- [ ] Combine with existing VariantGroupCard, AddonGroupCard
- [ ] Test full modal flow
- [ ] Verify all animations smooth
- [ ] Test on various screen sizes
- [ ] Performance testing (console network tab)
- [ ] Accessibility audit (Wave tool, screen reader)

---

## File Locations & Commands

### Existing Component
```
/components/ui/accordion.tsx          ✅ Already installed
```

### Installation Command
```bash
# Install carousel component
npx shadcn@latest add carousel
```

### New Component Files to Create
```
/components/product-details/sections/product-description-section.tsx    (NEW)
/components/product-details/sections/product-image-carousel.tsx         (NEW)
```

---

## Dependencies Summary

### Already Installed
- `@radix-ui/react-accordion` - Accordion primitives
- `lucide-react` - Icons (ChevronDown)
- `class-variance-authority` - For styling variants
- `tailwind-merge` - Class merging utility

### Need to Install
```bash
npx shadcn@latest add carousel
# This installs:
# - embla-carousel-react
# - embla-carousel-autoplay (optional)
```

---

## Next Steps

1. **Install Carousel Component:**
   ```bash
   cd /Users/vrajpatel/Documents/personal/pizzaspace_web
   npx shadcn@latest add carousel
   ```

2. **Create ProductImageCarousel Component:**
   - Use the code example provided above
   - Save to `/components/product-details/sections/product-image-carousel.tsx`
   - Test with sample product data

3. **Create ProductDescriptionSection Component:**
   - Use the code example provided above
   - Save to `/components/product-details/sections/product-description-section.tsx`
   - Test with sample product data

4. **Integration:**
   - Add both to your product details modal
   - Test together with other product detail components
   - Verify responsive design on mobile

5. **Testing:**
   - Create demo page or update existing demo
   - Test keyboard navigation
   - Test touch/swipe interactions
   - Verify dark mode
   - Accessibility audit

---

## Resources

### Official Documentation
- [Radix UI Accordion](https://www.radix-ui.com/docs/primitives/components/accordion)
- [Embla Carousel Docs](https://www.embla-carousel.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Related Components
- **Button** - For carousel navigation buttons
- **CustomImage** - For product images (use instead of `next/image`)
- **Dialog** - For full-screen carousel on mobile

### Testing Tools
- [WAVE Accessibility Tool](https://wave.webaim.org/) - A11y audit
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- Your browser's DevTools - Responsive design testing

---

## Questions & Support

If you have questions about:

- **Accordion customization**: Check `/components/ui/accordion.tsx` and Radix UI docs
- **Carousel animations**: Review Embla Carousel plugins and API
- **Accessibility concerns**: Refer to WCAG 2.1 AA standards and Radix UI accessibility guides
- **Performance issues**: Check Lighthouse audit and React DevTools profiler

---

**Research completed by:** Claude Code
**Last updated:** December 1, 2024
**Status:** Ready for implementation

