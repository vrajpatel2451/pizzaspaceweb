# Discount Components Structure

## Component Hierarchy

```
DiscountSection (Main Component)
├── AppliedDiscounts
│   └── Badge (with X button)
│       ├── Tag Icon
│       └── Remove Button
│
├── DiscountInput
│   ├── Ticket Icon
│   ├── Input Field
│   ├── Clear Button (X)
│   └── Apply Button
│
├── View All Button
│
└── DiscountModal
    ├── Search Input
    │   ├── Search Icon
    │   └── Clear Button
    │
    └── DiscountCard[] (list)
        ├── DiscountTypeBadge
        │   └── Icon (Tag/Package/Truck/Plus)
        │
        ├── Coupon Code
        │   └── Copy Button
        │
        ├── DiscountAmount
        │   ├── Amount Display
        │   └── Maximum Cap (optional)
        │
        ├── DiscountValidity
        │   ├── Calendar/Clock Icon
        │   └── Date/Countdown Text
        │
        ├── Apply Button
        │
        └── Expandable Details
            ├── Description
            ├── Applicable Items
            └── Customer Type
```

## Component Dependencies

### DiscountSection
**Depends on:**
- AppliedDiscounts
- DiscountInput
- DiscountModal

**External:**
- shadcn/ui: Card, Button
- framer-motion: motion, AnimatePresence
- sonner: toast
- lucide-react: Tag, Sparkles

### DiscountModal
**Depends on:**
- DiscountCard
- EmptyDiscounts

**External:**
- shadcn/ui: Dialog, Drawer, Input, ScrollArea, Skeleton
- lucide-react: Search, X
- hooks: useMediaQuery

### DiscountCard
**Depends on:**
- DiscountTypeBadge
- DiscountAmount
- DiscountValidity

**External:**
- shadcn/ui: Card, Button, Badge
- framer-motion: motion, AnimatePresence
- sonner: toast
- lucide-react: Copy, Check, ChevronDown, ChevronUp, Info

### AppliedDiscounts
**Depends on:**
- None (atomic component)

**External:**
- shadcn/ui: Badge, Button
- framer-motion: motion, AnimatePresence
- lucide-react: X, Tag, Sparkles

### DiscountInput
**Depends on:**
- None (atomic component)

**External:**
- shadcn/ui: Input, Button
- lucide-react: X, Ticket

### DiscountTypeBadge
**Depends on:**
- None (atomic component)

**External:**
- shadcn/ui: Badge
- lucide-react: Package, Truck, Plus, Tag

### DiscountAmount
**Depends on:**
- None (atomic component)

**External:**
- None (pure formatting component)

### DiscountValidity
**Depends on:**
- None (atomic component)

**External:**
- lucide-react: Calendar, Clock, Infinity
- date-fns: format, formatDistanceToNow, isPast, isFuture, differenceInDays

### EmptyDiscounts
**Depends on:**
- None (atomic component)

**External:**
- lucide-react: Ticket, Sparkles

## Data Flow

```
Cart Page
    ↓ (fetches discounts)
API (getDiscounts)
    ↓ (returns DiscountResponse[])
DiscountSection
    ├→ AppliedDiscounts (displays applied discounts)
    │   └→ User removes discount
    │       └→ onRemoveDiscount callback
    │
    ├→ DiscountInput (user enters code)
    │   └→ User clicks apply
    │       └→ onApplyCode callback
    │           └→ API validation
    │               └→ Success animation
    │
    └→ DiscountModal (shows all discounts)
        └→ DiscountCard (user browses)
            └→ User clicks apply
                └→ onApplyDiscount callback
                    └→ Update applied discounts
                        └→ Close modal
                            └→ Success animation
```

## State Management

### DiscountSection State
```typescript
- couponCode: string
- isApplying: boolean
- isRemoving: boolean
- error: string | undefined
- showModal: boolean
- showSuccess: boolean
```

### DiscountModal State
```typescript
- searchQuery: string
- debouncedSearch: string
```

### DiscountCard State
```typescript
- isCopied: boolean
- isExpanded: boolean
- isApplying: boolean
```

### DiscountValidity State
```typescript
- currentTime: Date (updates every minute)
```

## Event Flow

### Apply Coupon Code
```
User types code
    ↓
DiscountInput onChange
    ↓
Parent updates couponCode state
    ↓
User clicks Apply or presses Enter
    ↓
DiscountInput onApply
    ↓
DiscountSection handleApplyCode
    ↓
API call (onApplyCode prop)
    ↓
Success: Show confetti + toast
    ↓
Clear input
    ↓
Update applied discounts
```

### Apply from Modal
```
User clicks "View All Discounts"
    ↓
DiscountSection opens modal
    ↓
User searches (debounced 300ms)
    ↓
Filter discounts locally
    ↓
User clicks Apply on card
    ↓
DiscountCard onApply
    ↓
DiscountModal onApply
    ↓
DiscountSection handleApplyFromModal
    ↓
API call (onApplyDiscount prop)
    ↓
Success: Show confetti + toast
    ↓
Close modal (500ms delay)
    ↓
Update applied discounts
```

### Remove Discount
```
User clicks X on discount chip
    ↓
AppliedDiscounts onRemove
    ↓
DiscountSection handleRemoveDiscount
    ↓
API call (onRemoveDiscount prop)
    ↓
Success: Show toast
    ↓
Remove from applied list
    ↓
Re-render section
```

## Component Communication

### Props Down
```
DiscountSection
    ├→ availableDiscounts: DiscountResponse[]
    ├→ appliedDiscounts: DiscountResponse[]
    ├→ totalSavings: number
    └→ handlers: onApplyCode, onApplyDiscount, onRemoveDiscount
        ↓
    Child components receive specific props
```

### Events Up
```
User interactions
    ↓
Child component handlers
    ↓
Parent callbacks (async)
    ↓
State updates in parent
    ↓
Re-render with new props
```

## Styling Architecture

### Shared Styles
- All components use Tailwind CSS
- shadcn/ui provides base component styles
- Custom variants for ticket-style borders
- Consistent spacing and sizing
- Dark mode support throughout

### Color Palette
```
Discount Types:
- Normal: Blue (bg-blue-100/text-blue-800)
- Packaging: Green (bg-green-100/text-green-800)
- Delivery: Purple (bg-purple-100/text-purple-800)
- Extras: Orange (bg-orange-100/text-orange-800)

States:
- Applied: Green (bg-green-100/border-green-500)
- Expired: Red (text-destructive)
- Upcoming: Muted (text-muted-foreground)
- Active: Primary (border-primary)
```

### Animation Patterns
```
Confetti: Burst animation (1s duration)
Expand/Collapse: Height animation (0.2s duration)
Enter/Exit: Opacity + scale (0.2s duration)
Hover: Transform scale (instant)
```

## Responsive Breakpoints

```
Mobile (< 768px):
- Drawer for modal
- Full-width cards
- Smaller text sizes
- Touch-optimized buttons

Desktop (≥ 768px):
- Dialog for modal
- Max-width constraints
- Larger text sizes
- Hover states enabled
```

## File Organization

```
/components
├── /discount              # Reusable discount components
│   ├── applied-discounts.tsx
│   ├── discount-amount.tsx
│   ├── discount-card.tsx
│   ├── discount-input.tsx
│   ├── discount-modal.tsx
│   ├── discount-type-badge.tsx
│   ├── discount-validity.tsx
│   ├── empty-discounts.tsx
│   └── index.ts           # Central export
│
└── /cart                  # Cart-specific components
    └── discount-section.tsx   # Main integration component
```

## Import Patterns

### Preferred (via index)
```typescript
import {
  DiscountCard,
  DiscountInput,
  AppliedDiscounts
} from "@/components/discount";
```

### Direct (if needed)
```typescript
import { DiscountCard } from "@/components/discount/discount-card";
```

### Main Section
```typescript
import { DiscountSection } from "@/components/cart/discount-section";
```

## Testing Strategy

### Unit Tests
- Test each component in isolation
- Mock external dependencies
- Test all props variations
- Test event handlers

### Integration Tests
- Test component communication
- Test data flow
- Test state updates
- Test API calls

### E2E Tests
- Apply coupon code flow
- Browse and apply from modal
- Remove discount flow
- Search discounts
- Copy coupon code
- Responsive behavior

## Performance Considerations

### Optimizations Applied
1. Debounced search (300ms)
2. Memoized filtered lists
3. Conditional rendering
4. CSS transforms for animations
5. Lazy modal content rendering

### Bundle Size
- Total component size: ~34 KB
- Gzipped estimate: ~9 KB
- No heavy dependencies added
- Uses existing project packages

## Browser Support

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Features requiring fallbacks:
- Clipboard API (copy coupon code)
- CSS backdrop-filter (modal overlay)
- Framer Motion animations (graceful degradation)
