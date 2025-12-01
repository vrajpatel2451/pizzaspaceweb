# Product Details Skeleton - Usage Guide

## Quick Start

The product details loading skeleton is already integrated and works automatically. No additional setup is required.

## How It Works

### Automatic Loading Detection

The skeleton automatically displays when:
1. `isLoading` prop is `true`
2. `data` prop is `null` or `undefined`

```tsx
// In ProductDetailsContent component
if (isLoading || !data) {
  return <ProductDetailsSkeleton />;
}
```

### Component Hierarchy

```
ProductDetailsContainer (manages state)
  └── ProductDetailsDialog (desktop) OR ProductDetailsBottomsheet (mobile)
      └── ProductDetailsContent (handles loading states)
          └── ProductDetailsSkeleton (loading UI)
          OR
          └── Actual Product Content (loaded UI)
```

## Using the Skeleton Component

### Direct Usage (Not Typical)

If you need to use the skeleton component directly in other contexts:

```tsx
import { ProductDetailsSkeleton } from "@/components/product-details/product-details-skeleton";

function MyComponent() {
  return (
    <div>
      <ProductDetailsSkeleton />
    </div>
  );
}
```

### With Custom Styling

```tsx
import { ProductDetailsSkeleton } from "@/components/product-details/product-details-skeleton";

function MyComponent() {
  return (
    <ProductDetailsSkeleton className="my-custom-class" />
  );
}
```

## Customization Options

### 1. Adjust Spacing

Modify the `className` prop to change spacing:

```tsx
// Default
<ProductDetailsSkeleton className="space-y-6 p-6" />

// Compact
<ProductDetailsSkeleton className="space-y-4 p-4" />

// Spacious
<ProductDetailsSkeleton className="space-y-8 p-8" />
```

### 2. Change Animation Speed

Modify `shimmerVariants` in `/lib/animations.ts`:

```tsx
// Faster shimmer (1s instead of 1.5s)
export const shimmerVariants: Variants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.0, // Changed from 1.5
      repeat: Infinity,
      ease: "linear",
    },
  },
};
```

### 3. Customize Colors

The skeleton uses CSS variables for theming. Modify in your theme configuration:

```css
/* Light mode */
:root {
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
}

/* Dark mode */
.dark {
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
}
```

### 4. Number of Skeleton Items

Edit the component file to adjust counts:

```tsx
// In product-details-skeleton.tsx

// Variant Groups (change from 2 to 3)
{Array.from({ length: 3 }).map((_, i) => (
  // ...
))}

// Addon Items (change from 4 to 6)
{Array.from({ length: 6 }).map((_, i) => (
  // ...
))}
```

## Advanced Customization

### Creating a Custom AnimatedSkeleton

If you need different skeleton shapes:

```tsx
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { shimmerVariants } from "@/lib/animations";

function CustomSkeleton({
  className,
  shape = "rectangle"
}: {
  className?: string;
  shape?: "rectangle" | "circle" | "pill";
}) {
  const shapeClass = {
    rectangle: "rounded-lg",
    circle: "rounded-full",
    pill: "rounded-full",
  }[shape];

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-muted",
        shapeClass,
        className
      )}
      animate="shimmer"
      variants={shimmerVariants}
      style={{
        background: "linear-gradient(90deg, hsl(var(--muted)) 0%, hsl(var(--muted-foreground) / 0.1) 50%, hsl(var(--muted)) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}
```

Usage:
```tsx
<CustomSkeleton className="w-12 h-12" shape="circle" />
<CustomSkeleton className="w-full h-4" shape="pill" />
```

### Conditional Skeleton Sections

Show different skeleton layouts based on product type:

```tsx
interface ProductDetailsSkeletonProps {
  className?: string;
  showVariants?: boolean;
  showAddons?: boolean;
}

export function ProductDetailsSkeleton({
  className,
  showVariants = true,
  showAddons = true,
}: ProductDetailsSkeletonProps) {
  return (
    <div className={cn("space-y-6 p-6", className)}>
      {/* Image and info - always shown */}
      <AnimatedSkeleton className="aspect-[4/3] w-full rounded-2xl" />

      {/* Product info */}
      {/* ... */}

      {/* Conditional variant groups */}
      {showVariants && (
        <>
          {/* Variant skeleton */}
        </>
      )}

      {/* Conditional addon groups */}
      {showAddons && (
        <>
          {/* Addon skeleton */}
        </>
      )}
    </div>
  );
}
```

## Performance Optimization

### 1. Memoization

For better performance in lists:

```tsx
import { memo } from "react";

export const ProductDetailsSkeleton = memo(function ProductDetailsSkeleton({
  className,
}: ProductDetailsSkeletonProps) {
  // Component implementation
});
```

### 2. Lazy Loading

Load skeleton only when needed:

```tsx
import { lazy, Suspense } from "react";

const ProductDetailsSkeleton = lazy(() =>
  import("@/components/product-details/product-details-skeleton")
    .then(module => ({ default: module.ProductDetailsSkeleton }))
);

function MyComponent({ isLoading }) {
  if (isLoading) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetailsSkeleton />
      </Suspense>
    );
  }
  // ...
}
```

### 3. Disable Animation on Slow Devices

```tsx
import { useReducedMotion } from "framer-motion";

function ProductDetailsSkeleton() {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    // Use static skeleton without shimmer
    return <StaticSkeleton />;
  }

  // Use animated skeleton
  return <AnimatedSkeleton />;
}
```

## Testing

### Unit Tests

```tsx
import { render, screen } from "@testing-library/react";
import { ProductDetailsSkeleton } from "./product-details-skeleton";

describe("ProductDetailsSkeleton", () => {
  it("renders without crashing", () => {
    render(<ProductDetailsSkeleton />);
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProductDetailsSkeleton className="custom-class" />
    );
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders all skeleton sections", () => {
    const { container } = render(<ProductDetailsSkeleton />);
    // Image skeleton
    expect(container.querySelector(".aspect-\\[4\\/3\\]")).toBeInTheDocument();
    // Other assertions...
  });
});
```

### Visual Regression Tests

```tsx
import { test, expect } from "@playwright/test";

test("product details skeleton matches snapshot", async ({ page }) => {
  await page.goto("http://localhost:3000/storybook/skeleton");
  await expect(page).toHaveScreenshot("skeleton.png");
});
```

### Manual Testing Checklist

- [ ] Skeleton appears immediately when dialog/bottomsheet opens
- [ ] Shimmer animation runs smoothly at 60fps
- [ ] Layout matches actual content structure
- [ ] Responsive on mobile and desktop
- [ ] Works in light and dark mode
- [ ] Transitions smoothly to actual content
- [ ] No layout shift during transition
- [ ] Accessible with screen readers

## Troubleshooting

### Skeleton Not Appearing

**Problem**: Skeleton doesn't show when loading

**Solution**: Check that `isLoading` prop is correctly passed:
```tsx
<ProductDetailsContent
  data={data}
  isLoading={isLoading} // Make sure this is true during loading
  error={error}
  onClose={onClose}
/>
```

### Shimmer Not Animating

**Problem**: Skeleton shows but shimmer doesn't move

**Solutions**:
1. Check Framer Motion is installed:
   ```bash
   npm list framer-motion
   ```

2. Verify `shimmerVariants` is imported:
   ```tsx
   import { shimmerVariants } from "@/lib/animations";
   ```

3. Check CSS custom properties are defined in your theme

### Layout Shift During Transition

**Problem**: Content jumps when skeleton is replaced

**Solution**: Ensure skeleton sizes match actual content:
```tsx
// Match aspect ratios
<AnimatedSkeleton className="aspect-[4/3]" /> // Image
<AnimatedSkeleton className="h-14" /> // Variant cards
```

### Performance Issues

**Problem**: Animation is choppy or laggy

**Solutions**:
1. Use GPU-accelerated properties only (transform, opacity)
2. Reduce animation complexity on mobile:
   ```tsx
   const isMobile = useMediaQuery("(max-width: 768px)");

   if (isMobile) {
     // Use simpler animation or static skeleton
   }
   ```

3. Memoize the component:
   ```tsx
   export const ProductDetailsSkeleton = memo(/* ... */);
   ```

## Best Practices

### 1. Keep Skeleton Simple
- Don't over-engineer the skeleton
- Match major layout elements, not every detail
- Prioritize performance over pixel-perfect accuracy

### 2. Consistent Animation
- Use the same shimmer animation across all skeletons
- Match animation timing with brand guidelines
- Consider reduced motion preferences

### 3. Meaningful Placeholders
- Show the right number of items (2-3 variants, 4-5 addons)
- Use realistic proportions
- Maintain visual hierarchy

### 4. Accessibility First
- Don't rely on animation alone
- Provide text alternatives for screen readers
- Respect user preferences for reduced motion

### 5. Test Different States
- Test with fast network (skeleton barely visible)
- Test with slow network (skeleton shows for seconds)
- Test with network errors
- Test on different devices and browsers

## Related Resources

### Documentation
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [React Loading Skeleton Best Practices](https://github.com/dvtng/react-loading-skeleton)

### Internal Files
- `/components/product-details/product-details-skeleton.tsx` - Component implementation
- `/lib/animations.ts` - Animation variants
- `/components/product-details/product-details-content.tsx` - Usage example

### Design System
- Consult your design system for skeleton patterns
- Follow brand guidelines for animation timing
- Maintain consistency across all loading states

## FAQ

### Q: Should I show skeleton for very fast loads?
**A**: Yes, even brief skeleton flashes provide visual feedback and prevent perceived lag.

### Q: Can I use this skeleton for other product views?
**A**: Yes, but you may need to adjust the layout. Consider creating variant-specific skeletons for different contexts.

### Q: How do I test skeleton loading locally?
**A**:
1. Use Chrome DevTools Network throttling
2. Add artificial delay in your API calls:
   ```tsx
   await new Promise(resolve => setTimeout(resolve, 2000));
   ```

### Q: Should skeleton match exact content?
**A**: Match major sections and layout, but don't try to match every detail. Balance accuracy with implementation complexity.

### Q: How do I support dark mode?
**A**: The skeleton automatically uses CSS custom properties from your theme. Just ensure your theme defines `--muted` and `--muted-foreground` for both light and dark modes.

## Support

For questions or issues:
1. Check this documentation first
2. Review the implementation code
3. Test with the development server running
4. Consult with the design team for visual questions
5. Check Framer Motion docs for animation issues
