# Quick Reference Card

**Print this or bookmark for quick access during implementation**

---

## At a Glance

| Component | Status | Install | Best For | Time |
|-----------|--------|---------|----------|------|
| **Accordion** | ✅ Ready | None | Product description | 20 min |
| **Carousel** | ⚠️ Install | `npx shadcn@latest add carousel` | Image gallery | 20 min |

---

## One-Minute Summary

### Accordion
- **What:** Expandable product description section
- **Status:** Already in `/components/ui/accordion.tsx`
- **Use:** `<Accordion type="single" collapsible>`
- **Features:** Smooth animations, keyboard nav, ARIA labels
- **Why:** Better than collapsible, built-in styling

### Carousel
- **What:** Swipeable image gallery with dots
- **Status:** Install with `npx shadcn@latest add carousel`
- **Use:** `<Carousel opts={{ loop: true, dragFree: false }}>`
- **Features:** Touch/swipe, dot indicators, image counter
- **Why:** Small (8KB), battle-tested, mobile-optimized

---

## Installation Checklist

- [ ] Accordion: Already installed ✅
- [ ] Carousel: `npx shadcn@latest add carousel`
- [ ] Verify both components in `/components/ui/`

---

## Import Statements

### Accordion
```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
```

### Carousel
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

## Code Snippets (Copy-Paste Ready)

### Accordion Example
```tsx
<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>
      <div className="flex justify-between w-full">
        <span>Product Name</span>
        <span>£12.99</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>
      Product description and details here
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Carousel Example
```tsx
const [api, setApi] = React.useState<CarouselApi>()
const [current, setCurrent] = React.useState(0)

React.useEffect(() => {
  if (!api) return
  api.on("select", () => setCurrent(api.selectedIndex()))
}, [api])

<Carousel opts={{ loop: true }} setApi={setApi}>
  <CarouselContent>
    {images.map((img) => (
      <CarouselItem key={img.id} className="basis-full">
        <img src={img.url} alt={img.alt} />
      </CarouselItem>
    ))}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  {/* Dots */}
  {images.map((_, i) => (
    <button
      key={i}
      onClick={() => api?.scrollTo(i)}
      className={i === current ? "bg-white" : "bg-gray-400"}
    />
  ))}
</Carousel>
```

---

## Files to Create

### 1. ProductImageCarousel.tsx
**Path:** `/components/product-details/sections/product-image-carousel.tsx`
**Source:** CODE_SNIPPETS.md (lines 5-106)
**Copy-paste:** Yes, ready to use

### 2. ProductDescriptionSection.tsx
**Path:** `/components/product-details/sections/product-description-section.tsx`
**Source:** CODE_SNIPPETS.md (lines 109-233)
**Copy-paste:** Yes, ready to use

---

## Keyboard Navigation

### Accordion
| Key | Action |
|-----|--------|
| Tab | Next item |
| Shift+Tab | Previous item |
| Space/Enter | Toggle expand |
| ArrowDown/Up | Next/prev in list |
| Home/End | First/last item |

### Carousel
| Key | Action |
|-----|--------|
| Tab | Navigate buttons |
| ArrowLeft | Previous image |
| ArrowRight | Next image |
| Touch | Swipe to navigate |

---

## Dark Mode Classes

Both components automatically support dark mode. Use these classes:

```tsx
className="dark:bg-neutral-900"
className="dark:text-white"
className="dark:border-neutral-800"
className="dark:hover:bg-black/80"
```

---

## Common Issues & Quick Fixes

### Carousel not swiping on mobile
**Fix:** Ensure `dragFree: false` in options
```tsx
<Carousel opts={{ dragFree: false, loop: true }} />
```

### Dot indicators not updating
**Fix:** Add useEffect with api.on("select")
```tsx
useEffect(() => {
  if (!api) return
  api.on("select", () => setCurrent(api.selectedIndex()))
}, [api])
```

### Images blurry
**Fix:** Use CustomImage with correct sizing
```tsx
<CustomImage src={url} fill className="object-cover" />
```

### Accordion animations not smooth
**Fix:** Ensure Tailwind config has animate-accordion-* animations (should be default)

---

## Quick Testing Checklist

After implementation, test:

- [ ] **Mobile:** Swipe through carousel
- [ ] **Desktop:** Click next/prev buttons
- [ ] **Keyboard:** Tab through, use Space to expand/collapse
- [ ] **Dark Mode:** Toggle and verify appearance
- [ ] **Accessibility:** Use screen reader to verify
- [ ] **Images:** All load without errors
- [ ] **Responsive:** Test on 375px, 768px, 1024px widths

---

## Performance Tips

1. **Images:** Use `priority={index === 0}` for first image
2. **Lazy Load:** Set `lazyBoundary="50px"` for carousel
3. **Memoization:** Wrap handlers with `useCallback` if re-renders excessive
4. **Bundle Size:** Carousel adds ~8KB (minified)

---

## Useful Links

- **Full Research:** SHADCN_COMPONENT_RESEARCH.md
- **Code Examples:** CODE_SNIPPETS.md
- **Setup Guide:** INSTALLATION_COMMANDS.md
- **Overview:** RESEARCH_SUMMARY.md
- **Navigation:** RESEARCH_INDEX.md

---

## Estimated Time

| Task | Time |
|------|------|
| Install carousel | 5 min |
| Read CODE_SNIPPETS.md | 10 min |
| Create ProductImageCarousel | 15 min |
| Create ProductDescriptionSection | 15 min |
| Test & integrate | 20 min |
| **Total** | **~65 min (1 hour)** |

---

## Success Criteria

After implementation:
- ✅ Accordion opens/closes smoothly
- ✅ Carousel swipes on mobile
- ✅ Dot indicators work correctly
- ✅ Keyboard navigation works
- ✅ Dark mode looks good
- ✅ No console errors
- ✅ Accessibility score 90+

---

**Last Updated:** December 1, 2024
**Project:** PizzaSpace Product Details Redesign
**Status:** Ready to Implement

