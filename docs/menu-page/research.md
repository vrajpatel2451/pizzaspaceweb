# Menu Page Component Research

**Phase**: Sub-Phase 1.2: Shadcn Component Research
**Date**: December 1, 2025
**Registry**: @shadcn (default shadcn/ui registry)
**Project**: Pizza Space Web - Menu Page Feature

---

## Executive Summary

This document provides comprehensive research on shadcn/ui components required for the Menu Page feature implementation. All 8 required components are available in the @shadcn registry with full accessibility support and customization capabilities.

**Installation Command:**
```bash
npx shadcn@latest add @shadcn/accordion @shadcn/sheet @shadcn/skeleton @shadcn/pagination @shadcn/badge @shadcn/button @shadcn/card @shadcn/separator
```

---

## Component Availability Status

| Component | Registry | Type | Status | Dependencies |
|-----------|----------|------|--------|--------------|
| Accordion | @shadcn | ui | Available | @radix-ui/react-accordion |
| Sheet | @shadcn | ui | Available | @radix-ui/react-dialog |
| Skeleton | @shadcn | ui | Available | None |
| Pagination | @shadcn | ui | Available | None |
| Badge | @shadcn | ui | Available | @radix-ui/react-slot |
| Button | @shadcn | ui | Available | @radix-ui/react-slot |
| Card | @shadcn | ui | Available | None |
| Separator | @shadcn | ui | Available | @radix-ui/react-separator |

**Status**: All 8 components are available and ready for installation.

---

## 1. Accordion Component

### Overview
The Accordion component is built on Radix UI's accordion primitive and provides accessible, keyboard-navigable expanding/collapsing sections. Perfect for the category/subcategory navigation sidebar.

**Component Name**: `accordion`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: `@radix-ui/react-accordion`

### Key Props Interface

```typescript
// Core Accordion Props
interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: "single" | "multiple"; // single: only one expanded, multiple: multiple expanded
  collapsible?: boolean; // Allow collapsing when clicking expanded item
  value?: string | string[]; // Controlled value
  defaultValue?: string | string[]; // Initial expanded items
  disabled?: boolean; // Disable all items
  className?: string;
}

// AccordionItem Props
interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string; // Unique identifier
  disabled?: boolean;
  className?: string;
}

// AccordionTrigger Props
interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

// AccordionContent Props
interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

### Basic Usage Example

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function CategoryAccordion() {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Pizzas</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <p>Margherita</p>
          <p>Pepperoni</p>
          <p>Vegetarian</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Pastas</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <p>Carbonara</p>
          <p>Alfredo</p>
          <p>Marinara</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Desserts</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          <p>Tiramisu</p>
          <p>Panna Cotta</p>
          <p>Gelato</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
```

### Pizza Space Customization Points

**Branding Integration** (orange-500 primary color):
```tsx
// Active state styling
<AccordionTrigger className="
  hover:text-orange-500
  data-[state=open]:text-orange-500
  data-[state=open]:bg-orange-50
  dark:data-[state=open]:bg-orange-950
">
  Category Name
</AccordionTrigger>

// Active indicator
<AccordionTrigger className="
  relative
  before:absolute before:left-0 before:top-0 before:bottom-0
  before:w-1 before:bg-orange-500
  data-[state=closed]:before:hidden
">
  Category Name
</AccordionTrigger>
```

### Accessibility Features

- **ARIA Attributes**: `aria-expanded`, `aria-controls` automatically managed
- **Keyboard Navigation**:
  - Tab to focus triggers
  - Space/Enter to toggle
  - Arrow keys to navigate between items (optional)
- **Focus Management**: Visual focus indicators with customizable styling
- **Screen Reader Support**: Proper semantic structure with heading hierarchy

### For Menu Page Implementation

**Recommended Configuration**:
```tsx
// Category Sidebar - Single collapsible
<Accordion
  type="single"
  collapsible={true}
  defaultValue="category-1"
  className="w-full space-y-2"
>
  {categories.map((category) => (
    <AccordionItem key={category.id} value={`category-${category.id}`}>
      <AccordionTrigger
        onClick={() => updateURLParams({ categoryId: category.id })}
        className={cn(
          "hover:text-orange-500",
          activeCategory === category.id && "text-orange-500"
        )}
      >
        {category.name}
      </AccordionTrigger>
      <AccordionContent>
        <SubcategoryList subcategories={category.subcategories} />
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

**Key Features for Menu Page**:
- Type: `single` (only one category expanded at a time)
- `collapsible={true}` (allow closing category)
- URL-driven state (update URL on selection)
- Smooth expand/collapse animations (included by default)

---

## 2. Sheet Component

### Overview
Sheet (also called Drawer) is a side panel that slides out from the edge of the screen. Perfect for mobile filter panels in responsive design.

**Component Name**: `sheet`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: `@radix-ui/react-dialog`

### Key Props Interface

```typescript
// Root Sheet Props
interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

// SheetTrigger Props
interface SheetTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  className?: string;
}

// SheetContent Props
interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"; // default: "right"
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
  className?: string;
}

// SheetHeader/Footer/Title/Description/Close
interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SheetFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SheetTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
interface SheetDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
interface SheetCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
```

### Basic Usage Example

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function FilterSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Filters</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Products</SheetTitle>
          <SheetDescription>
            Select categories and filters to refine your search.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <select id="category" className="border rounded px-3 py-2">
              <option>All Categories</option>
              <option>Pizzas</option>
              <option>Pastas</option>
            </select>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Apply Filters</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
```

### Pizza Space Customization Points

**Mobile Filter Panel Styling**:
```tsx
// From bottom on mobile (menu-page use case)
<SheetContent
  side="bottom"
  className="
    rounded-t-lg
    bg-white dark:bg-slate-950
    border-t border-orange-200
    dark:border-orange-900
    max-h-[80vh]
    overflow-y-auto
  "
>
  {/* Filter content */}
</SheetContent>

// Active filter count badge
<SheetTrigger asChild>
  <Button variant="outline" className="relative">
    Filters
    {activeFilterCount > 0 && (
      <Badge
        className="absolute -top-2 -right-2 bg-orange-500"
      >
        {activeFilterCount}
      </Badge>
    )}
  </Button>
</SheetTrigger>
```

### Accessibility Features

- **Focus Trap**: Focus contained within sheet when open
- **Escape Handling**: Press Escape to close
- **ARIA Modal**: `aria-modal="true"` automatically applied
- **Backdrop**: Click outside to close (customizable)
- **Screen Reader Support**: Proper heading and description associations

### For Menu Page Implementation

**Recommended Configuration for Mobile Filters**:
```tsx
// Mobile Filter Sheet
const [filterOpen, setFilterOpen] = useState(false);

<Sheet open={filterOpen} onOpenChange={setFilterOpen}>
  <SheetTrigger asChild>
    <Button
      variant="outline"
      size="icon"
      className="lg:hidden" // Hide on desktop
      aria-label="Open filters"
    >
      <FilterIcon className="w-4 h-4" />
      {activeFilterCount > 0 && (
        <Badge className="absolute -top-2 -right-2 bg-orange-500 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  </SheetTrigger>

  <SheetContent
    side="bottom"
    className="rounded-t-2xl max-h-[80vh] overflow-y-auto"
  >
    <SheetHeader>
      <SheetTitle>Filter Menu</SheetTitle>
      <SheetDescription>
        Select categories and subcategories to filter products
      </SheetDescription>
    </SheetHeader>

    <div className="mt-6 space-y-4">
      {/* Accordion with categories */}
      <CategoryAccordion
        onSelect={(categoryId) => {
          updateURLParams({ categoryId });
          setFilterOpen(false); // Close sheet on selection
        }}
      />
    </div>

    <SheetFooter className="mt-6">
      <SheetClose asChild>
        <Button variant="outline" className="w-full">
          Close
        </Button>
      </SheetClose>
      <Button
        className="w-full bg-orange-500 hover:bg-orange-600"
        onClick={() => {
          // Clear all filters
          updateURLParams({ categoryId: undefined, subcategoryId: undefined });
          setFilterOpen(false);
        }}
      >
        Clear All Filters
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

**Key Features for Menu Page**:
- Side: `"bottom"` (slides up from bottom on mobile)
- Rounded top corners for modern look
- Contains CategoryAccordion inside
- Auto-close on filter selection
- Active filter count badge on trigger button

---

## 3. Skeleton Component

### Overview
Skeleton provides a loading placeholder with shimmer animation. Used for loading states while API data is being fetched.

**Component Name**: `skeleton`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: None

### Key Props Interface

```typescript
// Skeleton Props
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
```

### Basic Usage Example

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}
```

### Pizza Space Customization Points

**Product Card Skeleton**:
```tsx
// Matches ProductCard dimensions
export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Image skeleton */}
      <Skeleton className="w-full aspect-square rounded-lg" />

      {/* Title skeleton */}
      <Skeleton className="h-4 w-3/4" />

      {/* Description skeleton */}
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />

      {/* Price skeleton */}
      <Skeleton className="h-5 w-1/2 mt-auto" />
    </div>
  )
}

// Grid of skeletons
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {Array.from({ length: 12 }).map((_, i) => (
    <ProductCardSkeleton key={i} />
  ))}
</div>
```

**Sidebar Skeleton**:
```tsx
export function CategorySidebarSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-2">
          {/* Category title */}
          <Skeleton className="h-5 w-[180px]" />

          {/* Subcategory items */}
          <div className="space-y-1 pl-4">
            <Skeleton className="h-4 w-[140px]" />
            <Skeleton className="h-4 w-[160px]" />
            <Skeleton className="h-4 w-[130px]" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Accessibility Features

- **Semantic HTML**: Uses `<div>` role with proper ARIA attributes
- **Motion Preference**: Respects `prefers-reduced-motion` (shimmer disabled)
- **Screen Reader**: Announced as loading/placeholder content with `aria-label` when needed

### For Menu Page Implementation

**Key Uses**:
1. **Product Grid Loading**: Show grid of product card skeletons while fetching
2. **Sidebar Loading**: Show category skeleton while fetching categories
3. **Pagination Loading**: Show skeleton buttons during state transition

**Best Practices for Menu Page**:
- Match exact dimensions of actual components
- Use `aspect-square` for image placeholders
- Show shimmer animation (included in styles)
- Render same number of items as will appear in final state
- Clear skeletons once data loads

---

## 4. Pagination Component

### Overview
Pagination provides navigation between pages of content. Essential for product grid pagination with previous/next buttons and page numbers.

**Component Name**: `pagination`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: None

### Key Props Interface

```typescript
// Pagination Props
interface PaginationProps extends React.HTMLAttributes<HTMLElement> {}

// PaginationContent Props
interface PaginationContentProps extends React.HTMLAttributes<HTMLUListElement> {}

// PaginationItem Props
interface PaginationItemProps extends React.HTMLAttributes<HTMLLIElement> {}

// PaginationLink Props
interface PaginationLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  isActive?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
}

// PaginationEllipsis Props
interface PaginationEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {}

// PaginationPrevious/Next Props
interface PaginationPreviousProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "default" | "sm" | "lg" | "icon";
}
interface PaginationNextProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "default" | "sm" | "lg" | "icon";
}
```

### Basic Usage Example

```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function PaginationDemo() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

### Pizza Space Customization Points

**Active Page Styling** (orange-500):
```tsx
// Active page indicator
<PaginationLink
  href={`?page=${pageNum}`}
  isActive={currentPage === pageNum}
  className={cn(
    "border border-slate-200 dark:border-slate-800",
    currentPage === pageNum &&
      "bg-orange-500 text-white border-orange-500 dark:bg-orange-600 dark:border-orange-600"
  )}
>
  {pageNum}
</PaginationLink>

// Hover state
className="
  hover:bg-orange-50 dark:hover:bg-orange-950
  hover:border-orange-200 dark:hover:border-orange-800
  hover:text-orange-600
"
```

### Accessibility Features

- **ARIA Current Page**: `aria-current="page"` on active link
- **ARIA Labels**: Descriptive labels for next/previous
- **Keyboard Navigation**: Tab to navigate, Enter to select
- **Focus Indicators**: Clear visual focus styles
- **Semantic HTML**: `<nav>` and `<ul>`/`<li>` structure

### For Menu Page Implementation

**Recommended Implementation**:
```tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const maxVisible = 5; // Show max 5 page numbers
  const getPageNumbers = () => {
    // Logic to show: [1, 2, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages]
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`?page=${currentPage - 1}`}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNum, idx) => (
          pageNum === "ellipsis" ? (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href={`?page=${pageNum}`}
                isActive={currentPage === pageNum}
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "cursor-pointer",
                  currentPage === pageNum &&
                    "bg-orange-500 text-white hover:bg-orange-600"
                )}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          )
        ))}

        <PaginationItem>
          <PaginationNext
            href={`?page=${currentPage + 1}`}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
```

**Key Features for Menu Page**:
- Show 5 page numbers maximum
- Use ellipsis for large page numbers
- Previous/Next buttons at edges
- Active page highlighted in orange
- URL-driven state (`?page=N`)
- Disabled state for first/last pages

---

## 5. Badge Component

### Overview
Badge displays small labels or tags. Used for filter chips, active filter indicators, and product labels.

**Component Name**: `badge`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: `@radix-ui/react-slot`

### Key Props Interface

```typescript
// Badge Props
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
  className?: string;
}
```

### Basic Usage Example

```tsx
import { AlertCircleIcon, BadgeCheckIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-full flex-wrap gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <div className="flex w-full flex-wrap gap-2">
        <Badge
          variant="secondary"
          className="bg-blue-500 text-white dark:bg-blue-600"
        >
          <BadgeCheckIcon />
          Verified
        </Badge>
        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
          8
        </Badge>
      </div>
    </div>
  )
}
```

### Pizza Space Customization Points

**Active Filter Badges** (orange-500):
```tsx
// Custom orange badge variant
const filterBadgeVariants = {
  active: "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600",
  inactive: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300",
};

// Active category indicator
<Badge
  variant={activeCategory === category.id ? "default" : "outline"}
  className={cn(
    "cursor-pointer transition-colors",
    activeCategory === category.id && filterBadgeVariants.active
  )}
  onClick={() => setActiveCategory(category.id)}
>
  {category.name}
</Badge>

// Filter chip with remove button
<Badge className="gap-2 pr-1">
  {filterName}
  <button
    onClick={() => removeFilter(filterId)}
    className="ml-1 hover:text-orange-600"
  >
    ×
  </button>
</Badge>
```

**Count Badges**:
```tsx
// Filter count indicator
<Badge
  className="
    absolute -top-2 -right-2
    h-5 w-5 rounded-full p-0
    flex items-center justify-center
    text-xs font-bold
    bg-orange-500 text-white
  "
>
  {filterCount}
</Badge>
```

### Accessibility Features

- **Semantic HTML**: Uses appropriate heading levels with badge content
- **Color Not Sole Indicator**: Include text labels alongside color
- **Contrast**: Sufficient color contrast (WCAG AA compliant)
- **Interactive Badges**: Should have proper button semantics if clickable

### For Menu Page Implementation

**Active Filter Display**:
```tsx
export function ActiveFilters({
  activeCategory,
  activeSubcategory,
  onRemoveFilter
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {activeCategory && (
        <Badge className="gap-2 bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100">
          Category: {activeCategory}
          <button
            onClick={() => onRemoveFilter('category')}
            className="ml-1 text-xs font-bold hover:text-orange-600"
            aria-label="Remove category filter"
          >
            ×
          </button>
        </Badge>
      )}
      {activeSubcategory && (
        <Badge className="gap-2 bg-orange-100 text-orange-900 dark:bg-orange-900 dark:text-orange-100">
          Subcategory: {activeSubcategory}
          <button
            onClick={() => onRemoveFilter('subcategory')}
            className="ml-1 text-xs font-bold hover:text-orange-600"
            aria-label="Remove subcategory filter"
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  )
}
```

**Key Features for Menu Page**:
- Show active filters above product grid
- Use orange-500 for active filters
- Include remove (×) button
- Horizontal scroll on mobile if many filters

---

## 6. Button Component

### Overview
Button provides clickable action triggers with multiple variants and sizes. Used throughout for CTAs, pagination, filter actions.

**Component Name**: `button`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: `@radix-ui/react-slot`

### Key Props Interface

```typescript
// Button Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean; // Render as child component (for links, etc.)
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}
```

### Basic Usage Example

```tsx
import { ArrowUpIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button variant="outline">Button</Button>
      <Button variant="outline" size="icon" aria-label="Submit">
        <ArrowUpIcon />
      </Button>
    </div>
  )
}
```

### Pizza Space Customization Points

**Primary Button** (orange-500):
```tsx
// Default variant - orange primary
<Button className="
  bg-orange-500
  hover:bg-orange-600
  dark:bg-orange-600
  dark:hover:bg-orange-700
  text-white
">
  Add to Cart
</Button>

// Secondary variant - outline orange
<Button variant="outline" className="
  border-orange-500
  text-orange-500
  hover:bg-orange-50 dark:hover:bg-orange-950
">
  View Details
</Button>

// Ghost variant - subtle orange
<Button variant="ghost" className="
  text-orange-600
  hover:text-orange-700
  hover:bg-orange-50
">
  Learn More
</Button>
```

**Filter Action Buttons**:
```tsx
// Apply filters button
<Button className="w-full bg-orange-500 hover:bg-orange-600">
  Apply Filters
</Button>

// Clear filters button
<Button variant="outline" className="w-full">
  Clear All
</Button>

// Pagination navigation
<Button
  variant="outline"
  size="icon"
  disabled={currentPage === 1}
  onClick={() => previousPage()}
>
  <ChevronLeftIcon className="w-4 h-4" />
</Button>
```

### Accessibility Features

- **Semantic Button**: Uses native `<button>` element
- **Type Attribute**: Proper type for form submission, reset, or action
- **Disabled State**: Visual and interactive disabled state
- **Focus Indicators**: Clear focus states for keyboard navigation
- **ARIA Labels**: `aria-label` for icon-only buttons
- **Loading States**: Can show loading spinner with disabled state

### For Menu Page Implementation

**Key Button Uses**:
1. **Filter Trigger**: Show active filter count
2. **Sheet Actions**: Apply/Clear filters in mobile sheet
3. **Pagination**: Previous/Next page navigation
4. **Empty State**: CTA to clear filters or browse all

**Size Variants**:
- `sm`: For pagination, filter chips
- `default`: For most actions (Apply Filters, Clear)
- `lg`: For primary CTAs (Add to Cart from product details)
- `icon`: For icon-only buttons (filter FAB, pagination arrows)

---

## 7. Card Component

### Overview
Card provides a container for related content with header, content, and footer sections. Used for empty states, error states, and product information.

**Component Name**: `card`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: None

### Key Props Interface

```typescript
// Card Props
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// CardHeader Props
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

// CardTitle Props
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

// CardDescription Props
interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

// CardContent Props
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

// CardFooter Props
interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
```

### Basic Usage Example

```tsx
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Form or content */}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Pizza Space Customization Points

**Empty State Card**:
```tsx
export function EmptyStateCard({
  title = "No products found",
  description = "Try adjusting your filters or browse all products",
  onClearFilters,
}: Props) {
  return (
    <Card className="w-full max-w-md mx-auto text-center border-2 border-dashed border-orange-200 dark:border-orange-800">
      <CardHeader>
        <div className="flex justify-center mb-4">
          {/* Pizza icon or illustration */}
          <PizzaIcon className="w-12 h-12 text-orange-500" />
        </div>
        <CardTitle className="text-orange-900 dark:text-orange-100">
          {title}
        </CardTitle>
        <CardDescription className="text-orange-700 dark:text-orange-300">
          {description}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2 justify-center">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={onClearFilters}
        >
          View All Products
        </Button>
      </CardFooter>
    </Card>
  )
}
```

**Error State Card**:
```tsx
export function ErrorStateCard({
  error,
  onRetry,
}: Props) {
  return (
    <Card className="w-full max-w-md mx-auto border-destructive">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <AlertTriangleIcon className="w-12 h-12 text-red-500" />
        </div>
        <CardTitle className="text-red-900 dark:text-red-100">
          Something went wrong
        </CardTitle>
        <CardDescription className="text-red-700 dark:text-red-300">
          {error?.message || "Failed to load products. Please try again."}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2 justify-center">
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600"
          onClick={onRetry}
        >
          Try Again
        </Button>
      </CardFooter>
    </Card>
  )
}
```

### Accessibility Features

- **Semantic HTML**: Card is a `<div>` with proper structure
- **Heading Hierarchy**: Use `<h2>` or `<h3>` for CardTitle
- **Button Semantics**: Buttons inside cards are proper `<button>` elements
- **Link Handling**: Use semantic links within cards
- **Focus Management**: Tab through interactive elements

### For Menu Page Implementation

**Empty State Pattern**:
- Shows when filters result in 0 products
- Central placement on page
- Friendly message with icon
- CTA to clear filters or browse all

**Error State Pattern**:
- Shows when API request fails
- Error message from server
- Retry button to attempt again
- Option to go back/clear filters

---

## 8. Separator Component

### Overview
Separator provides a visual divider line, vertical or horizontal. Used for visual organization in sidebars, between sections, and in filter lists.

**Component Name**: `separator`
**Registry**: @shadcn
**Type**: UI Component
**Dependencies**: `@radix-ui/react-separator`

### Key Props Interface

```typescript
// Separator Props
interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical"; // default: "horizontal"
  decorative?: boolean; // If true, role="none" for purely decorative
  className?: string;
}
```

### Basic Usage Example

```tsx
import { Separator } from "@/components/ui/separator"

export default function SeparatorDemo() {
  return (
    <div>
      <div className="space-y-1">
        <h4 className="text-sm leading-none font-medium">Radix Primitives</h4>
        <p className="text-muted-foreground text-sm">
          An open-source UI component library.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center space-x-4 text-sm">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  )
}
```

### Pizza Space Customization Points

**Horizontal Separators** (in sidebars):
```tsx
// Between category groups
<div className="space-y-4">
  <CategorySection title="Pizzas" items={pizzas} />
  <Separator className="my-3 bg-orange-200 dark:bg-orange-800" />
  <CategorySection title="Pastas" items={pastas} />
</div>

// Between sections in filter sidebar
<Separator className="my-4 bg-slate-200 dark:bg-slate-700" />
```

**Vertical Separators** (in metadata rows):
```tsx
// Between price and rating
<div className="flex items-center gap-3 text-sm">
  <span className="font-semibold text-orange-600">$12.99</span>
  <Separator orientation="vertical" className="h-4" />
  <span className="text-slate-600">★★★★★ (24)</span>
</div>
```

### Accessibility Features

- **Semantic Separator**: Uses `<hr>` for meaningful separators
- **Decorative**: `decorative={true}` for purely visual separators (hides from screen readers)
- **ARIA Role**: Properly marked for screen reader interpretation
- **Contrast**: Sufficient color contrast as per WCAG

### For Menu Page Implementation

**Key Uses**:
1. **Sidebar Organization**: Between category groups
2. **Filter Sections**: Separate different filter types
3. **Product Metadata**: Between price and ratings
4. **Mobile Sheet**: Between sections in filter panel

**Styling Pattern**:
```tsx
// Consistent separator styling
<Separator
  className="my-3 bg-slate-200 dark:bg-slate-700"
  decorative={false}
  role="presentation"
/>

// With custom color for branding
<Separator
  className="my-3 bg-orange-100 dark:bg-orange-900/30"
/>
```

---

## Installation & Setup Guide

### Prerequisites
- Next.js 16+ with App Router
- React 19+
- Tailwind CSS 4+
- TypeScript (strict mode)

### Installation Command

Run the following command to install all required components:

```bash
npx shadcn@latest add @shadcn/accordion @shadcn/sheet @shadcn/skeleton @shadcn/pagination @shadcn/badge @shadcn/button @shadcn/card @shadcn/separator
```

### Post-Installation Verification

After running the install command:

1. **Check Files Created** in `/components/ui/`:
   - `accordion.tsx`
   - `sheet.tsx`
   - `skeleton.tsx`
   - `pagination.tsx`
   - `badge.tsx`
   - `button.tsx`
   - `card.tsx`
   - `separator.tsx`

2. **Check Dependencies** in `package.json`:
   ```json
   {
     "dependencies": {
       "@radix-ui/react-accordion": "^1.x.x",
       "@radix-ui/react-dialog": "^1.x.x",
       "@radix-ui/react-separator": "^1.x.x",
       "@radix-ui/react-slot": "^2.x.x"
     }
   }
   ```

3. **Test Import**:
   ```tsx
   import { Button } from "@/components/ui/button"
   import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
   import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
   import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
   import { Skeleton } from "@/components/ui/skeleton"
   import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination"
   import { Badge } from "@/components/ui/badge"
   import { Separator } from "@/components/ui/separator"
   ```

### TypeScript Configuration

All components use TypeScript strict mode. No additional configuration needed as they extend React component interfaces properly.

---

## Customization for Pizza Space Design

### Color Integration

**Primary Orange (orange-500)**:
- Active states on accordion items
- Primary buttons (Apply, Submit)
- Pagination active page
- Active filter badges
- Hover states on interactive elements

**Example Override in Component**:
```tsx
// In your component file
import { Button } from "@/components/ui/button"

export function PrimaryButton(props) {
  return (
    <Button
      {...props}
      className={cn(
        "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
        props.className
      )}
    />
  )
}
```

### Dark Mode Support

All components automatically support dark mode through Tailwind's `dark:` prefix. Components already include dark mode styles:
- `dark:bg-slate-950` for backgrounds
- `dark:border-slate-800` for borders
- `dark:text-white` for text
- `dark:bg-orange-600` for orange elements

### Responsive Design

Components are mobile-first with responsive classes:
- `sm:` for small screens (640px+)
- `md:` for medium screens (768px+)
- `lg:` for large screens (1024px+)
- `xl:` for extra large screens (1280px+)

---

## Dependency Tree

```
Menu Page Components
├── Accordion
│   └── @radix-ui/react-accordion
├── Sheet
│   └── @radix-ui/react-dialog
├── Skeleton
│   └── (no external deps)
├── Pagination
│   └── (no external deps)
├── Badge
│   └── @radix-ui/react-slot
├── Button
│   ├── @radix-ui/react-slot
│   └── class-variance-authority (for variants)
├── Card
│   └── (no external deps)
└── Separator
    └── @radix-ui/react-separator
```

---

## Accessibility Checklist

- [x] All components have ARIA attributes where needed
- [x] Keyboard navigation supported (Tab, Enter, Escape, Arrow keys)
- [x] Focus indicators visible and clear
- [x] Color not sole indicator (text labels included)
- [x] Sufficient color contrast (WCAG AA)
- [x] Semantic HTML structure
- [x] Screen reader announcements where appropriate
- [x] Focus management for modals/sheets
- [x] Reduced motion support

---

## Implementation Notes for Menu Page

### Component Organization

1. **Sidebar (Desktop)**:
   - Use `Accordion` for categories
   - Nested categories in accordion content
   - Use `Separator` between category groups
   - Fixed positioning on desktop

2. **Mobile Filter Sheet**:
   - Trigger button with filter count `Badge`
   - `Sheet` component sliding from bottom
   - Contains same `Accordion` as sidebar
   - Apply/Clear buttons at footer

3. **Product Grid**:
   - Grid layout with responsive columns
   - `Skeleton` placeholders during loading
   - `Card` for empty states
   - `Card` for error states

4. **Pagination**:
   - `Pagination` component at bottom
   - Show max 5 page numbers with ellipsis
   - Active page highlighted in orange
   - Previous/Next navigation

5. **Active Filters**:
   - Display as `Badge` components
   - Include remove buttons
   - Horizontal scroll on mobile

### Performance Considerations

- **Code Splitting**: Components loaded on-demand by Next.js
- **Memoization**: Wrap components that don't need re-renders with `React.memo`
- **Skeleton Match**: Dimensions must match actual components to prevent layout shift
- **Image Lazy Loading**: Use for product images in grid

---

## Known Limitations & Workarounds

### Sheet Component
- **Limitation**: Cannot customize slide direction without forking
- **Workaround**: Use CSS transforms to change direction
- **For Menu Page**: Bottom sheet works well for mobile, right sheet for desktop

### Accordion
- **Limitation**: No built-in support for nested accordions
- **Workaround**: Render subcategories as list items inside accordion content
- **For Menu Page**: Use subcategory list component inside accordion content

### Pagination
- **Limitation**: No built-in ellipsis placement logic
- **Workaround**: Implement custom pagination logic to calculate page numbers
- **For Menu Page**: Create wrapper component with ellipsis logic

---

## Testing Considerations

- **Unit Tests**: Test component prop variations
- **Integration Tests**: Test with actual API data
- **Accessibility Tests**: Use axe-core or lighthouse
- **Visual Regression**: Compare screenshots across breakpoints
- **Keyboard Navigation**: Test Tab, Enter, Escape flows
- **Screen Reader**: Test with NVDA or JAWS

---

## Migration Path

If replacing existing components:

1. **Existing Accordion**: Already using shadcn/ui accordion
2. **ProductCard**: Reuse existing, no changes needed
3. **New Components**: Sheet, Skeleton, Pagination, Badge, Separator are net-new

No breaking changes expected from using these components.

---

## References

- [shadcn/ui Official Docs](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Next.js App Router Docs](https://nextjs.org/docs/app)

---

## Next Steps

This research document feeds into:
1. **Phase 2.1**: Component architecture decisions
2. **Phase 3.1-3.4**: Implementation using these components
3. **Phase 4.1**: Animation enhancements
4. **Phase 5.1**: Accessibility audit
5. **Phase 5.2**: Performance optimization

Proceed to architecture planning with confidence that all required components are available and well-documented.

---

**Document Version**: 1.0
**Last Updated**: December 1, 2025
**Status**: Complete - Ready for Architecture Phase
