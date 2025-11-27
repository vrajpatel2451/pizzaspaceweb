# Component Fixes Plan

This document outlines the fixes needed for the Pizzaspace UI component library based on identified issues.

---

## Issue 1: Missing Cursor Pointer on Interactive Elements

**Problem:** Interactive elements (buttons, clickable items, form controls) are missing `cursor-pointer` class, making them feel unresponsive.

**Files to Update:**

| File | Changes |
|------|---------|
| `components/ui/button.tsx` | Add `cursor-pointer` to base cva class |
| `components/ui/icon-button.tsx` | Add `cursor-pointer` to base cva class |
| `components/ui/checkbox.tsx` | Add `cursor-pointer` to root element |
| `components/ui/radio-group.tsx` | Add `cursor-pointer` to RadioGroupItem |
| `components/ui/switch.tsx` | Add `cursor-pointer` to root element |
| `components/ui/select.tsx` | Add `cursor-pointer` to SelectTrigger |
| `components/ui/tabs.tsx` | Add `cursor-pointer` to TabsTrigger |
| `components/ui/accordion.tsx` | Add `cursor-pointer` to AccordionTrigger |
| `components/composite/quantity-incrementor.tsx` | Add `cursor-pointer` to increment/decrement buttons |
| `components/composite/rating.tsx` | Add `cursor-pointer` to star buttons |
| `components/composite/search-select.tsx` | Add `cursor-pointer` to trigger and items |
| `components/composite/async-search-select.tsx` | Add `cursor-pointer` to trigger and items |
| `components/composite/creatable-select.tsx` | Add `cursor-pointer` to trigger and items |

---

## Issue 2: Badge Styling Improvements

**Problem:** Current badge styling doesn't match the food commerce aesthetic and lacks visual appeal.

**File:** `components/ui/badge.tsx`

**Changes:**
1. Improve border radius (more rounded/pill shape)
2. Better color contrast for variants
3. Add subtle shadow or depth
4. Improve padding and typography
5. Add new food-specific variants (new, popular, spicy, veg, non-veg)

**New Variants to Add:**
- `new` - For new items (green highlight)
- `popular` - For popular items (orange/primary)
- `spicy` - Red badge for spicy items
- `veg` - Green badge for vegetarian
- `nonveg` - Red badge for non-vegetarian
- `offer` - Yellow/gold for offers/discounts

**Updated Badge Design:**
```tsx
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        outline: "text-foreground border-border",
        success: "border-transparent bg-green-500 text-white shadow-sm",
        warning: "border-transparent bg-amber-500 text-white shadow-sm",
        // Food-specific
        new: "border-transparent bg-emerald-500 text-white shadow-sm",
        popular: "border-transparent bg-primary text-primary-foreground shadow-sm",
        spicy: "border-transparent bg-red-500 text-white shadow-sm",
        veg: "border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        nonveg: "border-red-600 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        offer: "border-transparent bg-amber-400 text-amber-900 shadow-sm",
      },
    },
  }
);
```

---

## Issue 3: Convert Formatter Components to Utilities

**Problem:** `PriceWrapper` and `DateWrapper` are components but should be utility functions for flexibility.

**Current Files to Remove:**
- `components/formatters/price-wrapper.tsx`
- `components/formatters/date-wrapper.tsx`
- `components/formatters/index.ts`

**New File to Create:** `lib/formatters.ts`

**Implementation:**
```tsx
// lib/formatters.ts

/**
 * Format a number as UK price (GBP)
 */
export function formatPrice(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimals?: number;
  }
): string {
  const { showSymbol = true, decimals = 2 } = options ?? {};

  const formatted = new Intl.NumberFormat("en-GB", {
    style: showSymbol ? "currency" : "decimal",
    currency: "GBP",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return formatted;
}

/**
 * Format a date in UK format (DD/MM/YYYY or custom)
 */
export function formatDate(
  date: Date | string | number,
  options?: {
    format?: "short" | "medium" | "long" | "relative";
    includeTime?: boolean;
  }
): string {
  const { format = "short", includeTime = false } = options ?? {};
  const dateObj = date instanceof Date ? date : new Date(date);

  if (format === "relative") {
    return formatRelativeTime(dateObj);
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: format === "short" ? "2-digit" : format === "medium" ? "short" : "long",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return new Intl.DateTimeFormat("en-GB", formatOptions).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return formatDate(date, { format: "short" });
}

/**
 * Format time only (HH:MM)
 */
export function formatTime(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
}
```

**Update Exports:** Update `lib/index.ts` or create if not exists to export formatters.

**Update Showcase:** Update `app/components/page.tsx` to use utility functions instead of components.

---

## Issue 4: Rewrite Overlay Components (Modal, Drawer, Dropdown)

**Problem:** Current Dialog, Sheet, and Popover use shadcn defaults which don't follow the controlled component pattern from the reference design.

### 4.1 Modal Component (replacing Dialog)

**New File:** `components/ui/modal.tsx`

**API Design:**
```tsx
interface ModalAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

interface ModalActions {
  primary?: ModalAction;
  secondary?: ModalAction;
  tertiary?: ModalAction;
  prefix?: React.ReactNode;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  actions?: ModalActions;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

**Key Features:**
- Uses `createPortal` to render to document.body
- Controlled via `isOpen` and `onClose` props
- Built-in header with title, subtitle, close button
- Built-in footer with action buttons (primary, secondary, tertiary)
- Smooth fade/slide animations
- Body scroll lock when open
- Focus trap for accessibility
- ESC key to close

### 4.2 Drawer Component (replacing Sheet)

**New File:** `components/ui/drawer.tsx`

**API Design:**
```tsx
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  actions?: ModalActions; // Same as Modal
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}
```

**Key Features:**
- Same as Modal but slides from edge
- Side prop for direction (default: right)
- Mobile-optimized for bottom drawers
- Swipe to close on mobile (optional)

### 4.3 Dropdown Component (replacing Popover)

**New File:** `components/ui/dropdown.tsx`

**API Design:**
```tsx
interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
}

// Helper components
interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}
```

**Key Features:**
- Can be controlled or uncontrolled
- Proper positioning with collision detection
- Dropdown items with icons
- Separator support
- Keyboard navigation

---

## Execution Order

### Phase 1: Cursor Pointer Fixes (Quick wins)

**Agent:** `@agent-shadcn-implementation-builder`

**Command:**
```
@agent-shadcn-implementation-builder Add cursor-pointer class to all interactive elements across the component library. Update the following files: button.tsx, icon-button.tsx, checkbox.tsx, radio-group.tsx, switch.tsx, select.tsx, tabs.tsx, accordion.tsx, quantity-incrementor.tsx, rating.tsx, search-select.tsx, async-search-select.tsx, creatable-select.tsx. Add cursor-pointer to base cva classes and interactive elements.
```

**Tasks:**
- Update all interactive component files
- Test interactions

---

### Phase 2: Badge Improvements

**Agent:** `@agent-shadcn-implementation-builder`

**Command:**
```
@agent-shadcn-implementation-builder Update components/ui/badge.tsx with improved styling: rounded-full shape, better color contrast, shadow-sm depth. Add food-specific variants: new (emerald), popular (primary), spicy (red), veg (green border/bg), nonveg (red border/bg), offer (amber). Reference the badge design in docs/component-fixes/fix-plan.md.
```

**Tasks:**
- Update badge.tsx with new variants and styling
- Update showcase to demonstrate new variants

---

### Phase 3: Formatter Utilities

**Agent:** `@agent-shadcn-implementation-builder`

**Command:**
```
@agent-shadcn-implementation-builder Create lib/formatters.ts with UK localization utility functions: formatPrice (GBP), formatDate (DD/MM/YYYY), formatRelativeTime, formatTime. Remove components/formatters/ directory. Update app/components/page.tsx to use utility functions instead of PriceWrapper/DateWrapper components. Reference implementation in docs/component-fixes/fix-plan.md.
```

**Tasks:**
- Create lib/formatters.ts
- Remove old component files (components/formatters/)
- Update showcase to use utilities

---

### Phase 4: Overlay Components

**Agent:** `@agent-shadcn-implementation-builder`

**Command:**
```
@agent-shadcn-implementation-builder Create new controlled overlay components following the pattern in spec/spec1_fixes.md:

1. components/ui/modal.tsx - Controlled modal with isOpen/onClose props, createPortal, built-in header (title, subtitle, close button), built-in footer with actions (primary, secondary, tertiary), size variants, body scroll lock, ESC to close.

2. components/ui/drawer.tsx - Same as Modal but slides from edge (left/right/top/bottom), mobile-optimized for bottom drawers.

3. components/ui/dropdown.tsx - Controlled/uncontrolled popover with trigger, DropdownItem, DropdownSeparator components, proper positioning.

Update components/ui/index.ts exports and app/components/page.tsx showcase. Reference API designs in docs/component-fixes/fix-plan.md.
```

**Tasks:**
- Create modal.tsx
- Create drawer.tsx
- Create dropdown.tsx
- Update index.ts exports
- Update showcase with new components

---

### Phase 5: Final Review & Cleanup

**Agent:** `@agent-nextjs-ui-reviewer`

**Command:**
```
@agent-nextjs-ui-reviewer Review all updated components in components/ui/ and components/composite/ for:
1. Consistent cursor-pointer on all interactive elements
2. Proper TypeScript types exported
3. Accessibility (ARIA attributes, keyboard navigation)
4. Dark mode support
5. Animation/transition consistency
```

**Tasks:**
- Review all components
- Fix any issues found
- Verify showcase page works correctly

---

## Files Summary

**Files to Create:**
- `lib/formatters.ts`
- `components/ui/modal.tsx`
- `components/ui/drawer.tsx`
- `components/ui/dropdown.tsx`

**Files to Update:**
- `components/ui/button.tsx`
- `components/ui/icon-button.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/radio-group.tsx`
- `components/ui/switch.tsx`
- `components/ui/select.tsx`
- `components/ui/tabs.tsx`
- `components/ui/accordion.tsx`
- `components/ui/badge.tsx`
- `components/ui/index.ts`
- `components/composite/quantity-incrementor.tsx`
- `components/composite/rating.tsx`
- `components/composite/search-select.tsx`
- `components/composite/async-search-select.tsx`
- `components/composite/creatable-select.tsx`
- `app/components/page.tsx`

**Files to Remove:**
- `components/formatters/price-wrapper.tsx`
- `components/formatters/date-wrapper.tsx`
- `components/formatters/index.ts`
- `components/formatters/` (directory)

---

## Notes

- Keep existing shadcn Dialog/Sheet/Popover for backwards compatibility until new components are tested
- The new Modal/Drawer/Dropdown follow the pattern from `spec/spec1_fixes.md`
- All components use Tailwind CSS with the existing design tokens
- Dark mode support is maintained through CSS custom properties
