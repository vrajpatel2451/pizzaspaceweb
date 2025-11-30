# Product Grid Implementation Documentation

**Feature**: Menu Page - Product Grid (Sub-Phase 3.3)
**Date**: 2025-12-01
**Status**: Complete

---

## Overview

This document describes the implementation of the Product Grid module for the Menu Page. This includes the product grid layout, pagination controls, and all state components (loading, error, empty).

---

## Components Implemented

### 1. ProductGridContainer (Server Component)

**Location**: `/components/menu/product-grid/product-grid-container.tsx`

**Type**: Server Component

**Purpose**: Receives product data from parent page and handles empty state logic before passing to client-side grid.

**Props**:
```typescript
interface ProductGridContainerProps {
  products: ProductResponse[];
  pagination: PaginationMeta;
  filters: MenuFilters;
}
```

**Features**:
- Empty state detection
- Product count display
- Server-side empty state logic
- Passes data to ProductGrid client component

**Usage**:
```tsx
import ProductGridContainer from '@/components/menu/product-grid/product-grid-container';

// In server component
<ProductGridContainer
  products={productsData}
  pagination={paginationMeta}
  filters={{ categoryId, subCategoryId, search }}
/>
```

---

### 2. ProductGrid (Client Component)

**Location**: `/components/menu/product-grid/product-grid.tsx`

**Type**: Client Component

**Purpose**: Renders the product grid with Framer Motion stagger animation.

**Props**:
```typescript
interface ProductGridProps {
  products: ProductResponse[];
}
```

**Features**:
- Responsive grid layout (1 col mobile, 2 tablet, 3 desktop)
- Framer Motion stagger animation
- Reuses existing ProductCard component
- Accessibility (ARIA roles)

**Grid Classes**:
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6
```

**Animation Variants**:
```typescript
const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,  // 50ms delay between items
      delayChildren: 0.1      // Initial 100ms delay
    }
  }
};

const gridItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};
```

---

### 3. ProductPagination (Client Component)

**Location**: `/components/menu/product-grid/product-pagination.tsx`

**Type**: Client Component

**Purpose**: Provides pagination controls using shadcn Pagination component.

**Props**:
```typescript
interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

**Features**:
- Smart ellipsis logic (shows max 7 pages)
- Previous/Next buttons with disabled states
- URL-based navigation (updates search params)
- Active page highlighting with orange-500
- Full accessibility (aria-current, aria-label, aria-disabled)
- Does not render if totalPages <= 1

**Ellipsis Logic**:
- Total pages <= 7: Show all pages
- Total pages > 7: [1] ... [n-1] [n] [n+1] ... [total]

**URL Update Pattern**:
```typescript
const handlePageChange = (page: number) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("page", page.toString());
  router.push(`${pathname}?${params.toString()}`, { scroll: false });
};
```

**Styling**:
- Active page: `bg-orange-500 text-white`
- Hover: `hover:bg-orange-50 hover:scale-105 hover:shadow-md`
- Disabled: `opacity-50 pointer-events-none`

---

### 4. MenuEmpty (Client Component)

**Location**: `/components/menu/states/menu-empty.tsx`

**Type**: Client Component

**Purpose**: Empty state component shown when no products match filters.

**Props**:
```typescript
interface MenuEmptyProps {
  hasActiveFilters: boolean;
  filterContext?: string;
}
```

**Features**:
- Context-aware messaging (filters active vs no products)
- Pizza-themed illustration using lucide-react icons
- Clear filters CTA button
- Browse all products CTA
- Responsive layout
- Dashed border styling

**Messages**:
- **With Filters**: "We couldn't find any products matching your criteria. Try adjusting your filters."
- **No Filters**: "No products are available at the moment. Check back soon!"

**Icon Selection**:
- With filters: `SearchX` icon
- No filters: `Pizza` icon

---

### 5. MenuError (Client Component)

**Location**: `/components/menu/states/menu-error.tsx`

**Type**: Client Component

**Purpose**: Error state component for API errors or data fetching failures.

**Props**:
```typescript
interface MenuErrorProps {
  error?: Error;
  reset?: () => void;
  message?: string;
  showRetry?: boolean;
}
```

**Features**:
- Friendly error message
- Optional retry button
- Error details display
- Helpful suggestions list
- Go to homepage fallback
- Red color scheme for error state

**Retry Behavior**:
- If `reset` provided: Calls reset function
- Otherwise: Reloads the page

**Suggestions**:
- Check internet connection
- Refresh the page
- Try again in a few moments
- Contact support if issue persists

---

### 6. MenuLoading (Loading Component)

**Location**: `/components/menu/states/menu-loading.tsx`

**Type**: Either (can be Server or Client)

**Purpose**: Loading skeleton that matches actual content dimensions.

**Props**:
```typescript
interface MenuLoadingProps {
  count?: number;        // Default: 12
  showSidebar?: boolean; // Default: true
}
```

**Features**:
- Full page skeleton (sidebar + grid)
- Grid-only skeleton variant (GridOnlyLoading)
- Matches ProductCard dimensions exactly
- Responsive design (same breakpoints as actual grid)
- Shimmer animation (built into shadcn Skeleton)

**Skeleton Structure**:
- **Sidebar** (desktop only):
  - Category items (5 skeletons)
  - Subcategories for first 2 categories
  - Clear filters button
- **Grid**:
  - Product count skeleton
  - Product card skeletons (12 by default)
  - Pagination skeleton

**GridOnlyLoading**:
Simplified variant for when only the grid needs to reload (during pagination/filtering):
```tsx
import { GridOnlyLoading } from '@/components/menu/states/menu-loading';

<GridOnlyLoading count={12} />
```

---

## Integration Guide

### Basic Usage (in Server Page)

```tsx
// /app/menu/page.tsx
import ProductGridContainer from '@/components/menu/product-grid/product-grid-container';
import { ProductPagination } from '@/components/menu/product-grid/product-pagination';

export default async function MenuPage({ searchParams }) {
  const params = await searchParams;

  // Fetch products
  const result = await getProducts({
    categoryId: params.category,
    subCategoryId: params.subcategory,
    search: params.search,
    page: parseInt(params.page || '1'),
    limit: 12,
  });

  return (
    <div>
      {/* Product Grid */}
      <ProductGridContainer
        products={result.data.data}
        pagination={result.data.meta}
        filters={{
          categoryId: params.category,
          subCategoryId: params.subcategory,
          search: params.search,
        }}
      />

      {/* Pagination */}
      <ProductPagination
        currentPage={result.data.meta.currentPage}
        totalPages={result.data.meta.totalPages}
        hasNextPage={result.data.meta.hasNextPage}
        hasPrevPage={result.data.meta.hasPrevPage}
      />
    </div>
  );
}
```

### Loading State Usage

```tsx
// /app/menu/loading.tsx
import { MenuLoading } from '@/components/menu/states/menu-loading';

export default function MenuLoadingPage() {
  return <MenuLoading count={12} showSidebar={true} />;
}
```

### Error State Usage

```tsx
// /app/menu/error.tsx
'use client';

import { MenuError } from '@/components/menu/states/menu-error';

export default function MenuErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <MenuError
      error={error}
      reset={reset}
      message="Failed to load menu"
      showRetry={true}
    />
  );
}
```

---

## Dependencies

### Required npm Packages

All dependencies are already installed in the project:

```json
{
  "framer-motion": "^11.x", // For animations
  "lucide-react": "^0.x",   // For icons
  "next": "16.0.5",         // Next.js framework
  "react": "^19.x"          // React
}
```

### shadcn/ui Components Used

- `Pagination` - Already installed
- `PaginationContent`
- `PaginationItem`
- `PaginationLink`
- `PaginationNext`
- `PaginationPrevious`
- `PaginationEllipsis`
- `Card` - Already installed
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `CardFooter`
- `Button` - Already installed
- `Skeleton` - Already installed

---

## Design Tokens Used

All components follow the design tokens defined in `/docs/menu-page/design-tokens.md`:

### Pagination Tokens
```css
--menu-pagination-active-bg: var(--color-primary)
--menu-pagination-active-text: #FFFFFF
--menu-pagination-hover-bg: #FFF7ED
--menu-pagination-hover-text: var(--color-primary)
--menu-pagination-button-size: 40px
```

### Empty State Tokens
```css
--menu-empty-border: 2px dashed #FED7AA
--menu-empty-icon-size: 80px
--menu-empty-icon-bg: #FFF7ED
--menu-empty-title-color: #9A3412
```

### Grid Tokens
```css
--menu-grid-gap: var(--spacing-4)      /* 16px mobile */
--menu-grid-gap-md: var(--spacing-6)   /* 24px tablet+ */
```

---

## Accessibility Features

### Pagination
- `aria-current="page"` on active page
- `aria-label` on page number buttons
- `aria-disabled` on prev/next when disabled
- Keyboard navigation support (Tab, Enter)
- Focus-visible rings with orange-500

### Product Grid
- `role="list"` on grid container
- `role="listitem"` on grid items
- Semantic HTML structure

### Empty State
- `aria-hidden="true"` on decorative icons
- Clear, descriptive error messages
- Keyboard-accessible CTAs

### Error State
- `aria-hidden="true"` on decorative icon
- Descriptive error messages
- Actionable retry buttons

---

## Performance Optimizations

### Animation Performance
- Uses `transform` and `opacity` only (GPU-accelerated)
- No layout-triggering properties
- Respects `prefers-reduced-motion` (via Framer Motion)
- Stagger delay: 50ms (optimal for perceived performance)

### Grid Layout
- CSS Grid (native browser layout)
- No unnecessary re-renders (React.memo on ProductCard)
- Proper key usage (product._id)

### Pagination
- Scroll disabled on page change (`scroll: false`)
- URL-based state (no client state management)
- No full page reload (client-side routing)

---

## Testing Checklist

### Visual Testing
- [x] Grid displays correctly on mobile (1 column)
- [x] Grid displays correctly on tablet (2 columns)
- [x] Grid displays correctly on desktop (3 columns)
- [x] Pagination renders with correct active state
- [x] Empty state shows with appropriate message
- [x] Error state displays with retry button
- [x] Loading skeleton matches actual content dimensions

### Functional Testing
- [x] Pagination updates URL correctly
- [x] Previous button disabled on page 1
- [x] Next button disabled on last page
- [x] Ellipsis shows correctly for large page sets
- [x] Empty state CTA clears filters
- [x] Error state retry button works
- [x] Grid animation plays on initial load

### Accessibility Testing
- [x] Keyboard navigation works on pagination
- [x] Screen reader announces page changes
- [x] Focus indicators visible
- [x] ARIA attributes correct
- [x] Color contrast meets WCAG AA

### Dark Mode Testing
- [x] All components render correctly in dark mode
- [x] Hover states visible in dark mode
- [x] Border colors have sufficient contrast
- [x] Icons visible in both themes

---

## Browser Compatibility

All components use modern browser features with fallbacks:

- CSS Grid: Supported in all modern browsers
- Framer Motion: Works in IE11+ (with polyfills)
- Next.js 16: Requires modern browser (Chrome 64+, Safari 12+, Firefox 67+)

---

## Known Limitations

1. **Fixed Grid Columns**: Grid is 1/2/3 columns. Cannot be customized without code change.
2. **Pagination Max Pages**: Shows max 7 page numbers. Large page sets use ellipsis.
3. **Animation Performance**: May be choppy on low-end devices (respects prefers-reduced-motion).
4. **Empty State CTAs**: Both buttons navigate to `/menu` (could be more context-aware).

---

## Future Enhancements

### Potential Improvements
1. **Virtualization**: For very large product lists (> 50 items per page)
2. **Grid View Toggle**: Add list/grid view options
3. **Sorting Controls**: Add sort by price, name, popularity
4. **Infinite Scroll**: Alternative to pagination
5. **Filter Chips**: Show active filters above grid
6. **Product Quick View**: Modal preview on hover/click

### Performance Optimizations
1. **Intersection Observer**: Lazy load below-fold products
2. **Image Priority**: Priority load for first 6 products
3. **Skeleton Matching**: Exact dimensions from ProductCard
4. **Bundle Splitting**: Dynamic import for heavy animations

---

## Troubleshooting

### Issue: Pagination doesn't update URL
**Solution**: Ensure ProductPagination is used in a Client Component with access to useRouter and useSearchParams.

### Issue: Grid animation doesn't play
**Solution**: Check that `framer-motion` is installed and ProductGrid has "use client" directive.

### Issue: Empty state always shows
**Solution**: Verify ProductGridContainer receives non-empty products array and filters are correct.

### Issue: TypeScript errors on pagination props
**Solution**: Ensure PaginationMeta type matches the props (currentPage, totalPages, hasNextPage, hasPrevPage).

### Issue: Dark mode colors incorrect
**Solution**: Check that design tokens are properly defined in globals.css and dark mode class is applied.

---

## Code Quality

### TypeScript Compliance
- All components have strict type definitions
- No `any` types used
- Proper interface exports for reusability

### ESLint Compliance
- Zero warnings or errors
- Follows Next.js ESLint config
- Proper import ordering

### Component Patterns
- Server/Client boundary properly defined
- Props interfaces documented
- Semantic HTML structure
- Proper error handling

---

## Related Files

### Component Files
- `/components/menu/product-grid/product-grid-container.tsx`
- `/components/menu/product-grid/product-grid.tsx`
- `/components/menu/product-grid/product-pagination.tsx`
- `/components/menu/states/menu-empty.tsx`
- `/components/menu/states/menu-error.tsx`
- `/components/menu/states/menu-loading.tsx`

### Existing Dependencies
- `/components/home/menu-section/product-card.tsx` (reused)
- `/components/ui/custom-image.tsx` (used in ProductCard)
- `/components/ui/pagination.tsx` (shadcn)
- `/components/ui/card.tsx` (shadcn)
- `/components/ui/button.tsx` (shadcn)
- `/components/ui/skeleton.tsx` (shadcn)

### Type Definitions
- `/types/product.ts` (ProductResponse, ProductQueryParams)
- `/types/api.ts` (PaginationMeta, APIResponse)

### Documentation
- `/docs/menu-page/architecture.md` (Architecture overview)
- `/docs/menu-page/design-tokens.md` (Design tokens)
- `/docs/menu-page-execution-plan.md` (Full execution plan)

---

## Changelog

### Version 1.0 (2025-12-01)
- Initial implementation of Product Grid module
- Created 6 components: ProductGridContainer, ProductGrid, ProductPagination, MenuEmpty, MenuError, MenuLoading
- Integrated shadcn Pagination component
- Added Framer Motion stagger animation
- Implemented full accessibility support
- Added dark mode support
- Fixed all TypeScript and ESLint warnings

---

**Document Version**: 1.0
**Last Updated**: 2025-12-01
**Status**: Complete
**Next Phase**: Sub-Phase 3.4 - Mobile Filter Implementation
