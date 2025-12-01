# Product Details Skeleton - Visual Reference

## Layout Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │                                       │ │
│  │     Product Image Skeleton            │ │
│  │     (aspect-ratio: 4/3)               │ │
│  │     with shimmer animation            │ │
│  │                                       │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ┌─────────────────────┐  ┌──────────┐    │
│  │ Product Title       │  │  Price   │    │
│  └─────────────────────┘  └──────────┘    │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ Description line 1 (full width)       │ │
│  └───────────────────────────────────────┘ │
│  ┌──────────────────────────────────┐     │
│  │ Description line 2 (5/6 width)   │     │
│  └──────────────────────────────────┘     │
│  ┌─────────────────────────┐              │
│  │ Description line 3      │              │
│  └─────────────────────────┘              │
│                                             │
│  Variant Group Title                       │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │Variant │ │Variant │ │Variant │         │
│  │   1    │ │   2    │ │   3    │         │
│  └────────┘ └────────┘ └────────┘         │
│                                             │
│  Variant Group Title                       │
│  ┌────────┐ ┌────────┐ ┌────────┐         │
│  │Variant │ │Variant │ │Variant │         │
│  │   1    │ │   2    │ │   3    │         │
│  └────────┘ └────────┘ └────────┘         │
│                                             │
│  Addon Group Title                         │
│  ┌───────────────────────────────────────┐ │
│  │ Addon Option 1                        │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ Addon Option 2                        │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ Addon Option 3                        │ │
│  └───────────────────────────────────────┘ │
│  ┌───────────────────────────────────────┐ │
│  │ Addon Option 4                        │ │
│  └───────────────────────────────────────┘ │
│                                             │
│ ─────────────────────────────────────────  │
│                                             │
│  ┌──────────┐  ┌────┐  ┌────────────────┐ │
│  │  Total   │  │Qty │  │  Add to Cart   │ │
│  └──────────┘  └────┘  └────────────────┘ │
└─────────────────────────────────────────────┘
```

## Skeleton Element Sizes

### Image Section
- Width: `w-full` (100%)
- Aspect Ratio: `aspect-[4/3]`
- Border Radius: `rounded-2xl`

### Product Info Section
- Title: `h-7 w-2/3`
- Price: `h-7 w-20`
- Description Lines:
  - Line 1: `h-4 w-full`
  - Line 2: `h-4 w-5/6`
  - Line 3: (implied from actual content)

### Variant Groups (2 groups)
- Group Title: `h-5 w-32`
- Variant Options (3 per group): `h-14 w-full rounded-xl`

### Addon Groups
- Group Title: `h-5 w-40`
- Addon Items (4 items): `h-12 w-full rounded-lg`

### Footer (Sticky Action Bar)
- Total Price: `h-12 w-32`
- Quantity: `h-10 w-24`
- Add to Cart: `h-12 flex-1`

## Animation Details

### Shimmer Effect
```css
/* Gradient Animation */
background: linear-gradient(
  90deg,
  hsl(var(--muted)) 0%,
  hsl(var(--muted-foreground) / 0.1) 50%,
  hsl(var(--muted)) 100%
);
background-size: 200% 100%;

/* Animation */
animation: shimmer 1.5s linear infinite;

@keyframes shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
```

### Framer Motion Variants
```typescript
shimmerVariants: {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear",
    },
  },
}
```

## Spacing System

- **Container Padding**: `p-6` (24px)
- **Section Spacing**: `space-y-6` (24px between major sections)
- **Group Item Spacing**: `space-y-3` (12px)
- **Sub-item Spacing**: `space-y-2` (8px)

## Color Tokens

### Light Mode
- Base Skeleton: `hsl(var(--muted))` → Light gray background
- Shimmer Highlight: `hsl(var(--muted-foreground) / 0.1)` → Slightly lighter gray

### Dark Mode
- Base Skeleton: `hsl(var(--muted))` → Dark gray background
- Shimmer Highlight: `hsl(var(--muted-foreground) / 0.1)` → Slightly lighter dark gray

## Border Radius System

- Large Elements (Image): `rounded-2xl` (16px)
- Medium Elements (Variants): `rounded-xl` (12px)
- Small Elements (Addons, Default): `rounded-lg` (8px)

## Responsive Behavior

### Desktop (Dialog)
- Max Width: `max-w-2xl` (672px)
- Height: `h-[85vh]` (85% viewport height)
- Padding: `p-6` (24px)

### Mobile (Bottomsheet)
- Full Width: `w-full`
- Height: `h-[calc(100vh-56px)]` (Full height minus header)
- Padding: `p-6` (24px)

## Accessibility Features

### Screen Reader Support
- All skeleton elements are decorative
- Parent components provide proper ARIA labels
- Loading state announced by assistive technology

### Motion Preferences
- Respects `prefers-reduced-motion`
- Falls back to simple fade for users who prefer reduced motion
- Implemented in parent dialog/bottomsheet components

## Performance Characteristics

### Animation Performance
- GPU-accelerated (uses transform/opacity)
- Constant memory usage (no DOM manipulation during animation)
- 60fps target on modern devices

### Rendering Performance
- Lightweight component tree
- No re-renders during shimmer animation
- Efficient Framer Motion implementation

## State Transitions

### Loading → Content
```
1. Skeleton renders immediately (no delay)
2. API request in progress
3. Data received
4. Smooth fade transition (0.3s)
5. Content rendered with stagger animation
```

### Error State
```
1. Skeleton renders
2. API request fails
3. Error message displayed
4. "Close" button available
```

## Testing Scenarios

### 1. Fast Network
- Skeleton visible for < 100ms
- Quick transition to content
- Minimal visual disruption

### 2. Slow Network (Throttled)
- Skeleton visible for several seconds
- Provides visual feedback during wait
- Prevents perception of app freeze

### 3. Network Error
- Skeleton replaced with error message
- User can dismiss and retry

### 4. Multiple Opens
- Skeleton shows each time dialog opens
- Consistent behavior on repeated interactions

## Browser Compatibility

| Browser | Shimmer Animation | Layout | Performance |
|---------|------------------|--------|-------------|
| Chrome 90+ | ✓ Full Support | ✓ | Excellent |
| Firefox 88+ | ✓ Full Support | ✓ | Excellent |
| Safari 14+ | ✓ Full Support | ✓ | Excellent |
| Edge 90+ | ✓ Full Support | ✓ | Excellent |
| Mobile Safari | ✓ Full Support | ✓ | Good |
| Chrome Android | ✓ Full Support | ✓ | Good |

## Design Rationale

### Why Shimmer vs Pulse?
- More engaging and modern
- Directional flow suggests progress
- Better perceived performance
- Industry standard (Facebook, LinkedIn, etc.)

### Why Accurate Layout Matching?
- Reduces layout shift
- Sets correct user expectations
- Professional polish
- Better perceived performance

### Why Framer Motion?
- Already in project dependencies
- Consistent with other animations
- Better performance than CSS alone
- Easier to maintain and modify

## Implementation Code Reference

See actual implementation in:
- `/components/product-details/product-details-skeleton.tsx`
- `/lib/animations.ts` (shimmerVariants)
- `/components/product-details/product-details-content.tsx` (usage)
