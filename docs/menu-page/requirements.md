# Menu Page Requirements Document

**Feature Name:** Menu Page with Full Filtering & Pagination

**Date:** 2025-12-01

**Status:** Requirements Analysis Complete

---

## 1. Executive Summary

The Menu Page is a complex, SEO-optimized product browsing experience for the Pizza Space application. It enables users to explore products through category/subcategory filtering, search, and pagination while maintaining shareable URLs and optimal performance.

**Key Capabilities:**
- Server-side rendered product catalog for SEO
- Category/subcategory hierarchical navigation
- URL-based state management (shareable links)
- Responsive mobile/desktop layouts
- Loading, error, and empty states
- Pagination with URL synchronization

---

## 2. Component Hierarchy

```
/app/menu/page.tsx (Server Component)
├── Metadata Generation (generateMetadata)
├── Data Fetching Layer
│   ├── getCategories({ all: true })
│   ├── getSubCategories({ all: true })
│   └── getProducts({ categoryId?, subCategoryId?, search?, page, limit: 12 })
│
└── MenuPageClient (Client Component - Root Container)
    │
    ├── Desktop Layout (lg:flex)
    │   ├── CategorySidebar (Server Component)
    │   │   └── CategoryAccordion (Client Component)
    │   │       ├── AccordionItem per Category
    │   │       │   └── SubcategoryList (Client Component)
    │   │       │       └── SubcategoryItem × N
    │   │       └── URL Navigation Logic
    │   │
    │   └── ProductGridContainer (Server Component)
    │       ├── ProductGrid (Client Component)
    │       │   └── ProductCard × N (Reused Component)
    │       └── ProductPagination (Client Component)
    │
    └── Mobile Layout (lg:hidden)
        ├── FilterTrigger (Client - FAB Button)
        │   └── Badge (Active Filter Count)
        │
        ├── MobileFilterSheet (Client - Sheet Component)
        │   ├── Sheet Trigger
        │   ├── Sheet Content
        │   │   ├── CategoryAccordion (Reused)
        │   │   └── Sheet Footer (Apply/Clear Buttons)
        │   └── Close Logic
        │
        ├── ActiveFilters (Client - Filter Chips)
        │   └── Badge × N (Removable Chips)
        │
        ├── ProductGridContainer (Reused)
        └── ProductPagination (Reused)

/app/menu/loading.tsx (Suspense Fallback)
└── MenuLoadingSkeleton
    ├── SidebarSkeleton (Desktop)
    └── ProductGridSkeleton

/app/menu/error.tsx (Error Boundary)
└── MenuErrorState
    ├── Error Message
    └── Retry Button
```

---

## 3. Component Specifications

### 3.1 Server Components

#### **MenuPage** (`/app/menu/page.tsx`)
**Type:** Server Component (async)

**Purpose:** Root page component, handles data fetching and SEO

**Props Interface:**
```typescript
interface MenuPageProps {
  searchParams: Promise<{
    category?: string;      // Category ID
    subcategory?: string;   // Subcategory ID
    search?: string;        // Search query
    page?: string;          // Current page number
  }>;
}
```

**Responsibilities:**
- Await and parse URL searchParams
- Fetch all categories and subcategories server-side
- Fetch products based on filters
- Generate dynamic metadata (title, description, Open Graph)
- Render MenuPageClient with fetched data
- Handle Suspense boundaries

**Data Fetching Strategy:**
```typescript
// Parallel fetching for optimal performance
const [categoriesResult, subcategoriesResult, productsResult] = await Promise.all([
  getCategories({ all: true }),
  getSubCategories({ all: true }),
  getProducts({
    categoryId: params.category,
    subCategoryId: params.subcategory,
    search: params.search,
    page: parseInt(params.page || '1'),
    limit: 12,
  }),
]);
```

**Metadata Generation:**
```typescript
export async function generateMetadata({ searchParams }: MenuPageProps): Promise<Metadata> {
  const params = await searchParams;

  // Dynamic title based on filters
  const title = params.category
    ? `${categoryName} - Pizza Space Menu`
    : 'Menu - Pizza Space';

  return {
    title,
    description: 'Browse our full menu...',
    openGraph: { ... },
    alternates: {
      canonical: `/menu${buildQueryString(params)}`,
    },
  };
}
```

---

#### **CategorySidebar** (`/components/menu/sidebar/category-sidebar.tsx`)
**Type:** Server Component

**Purpose:** Fetches and provides category data to accordion

**Props Interface:**
```typescript
interface CategorySidebarProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  activeCategory?: string;
  activeSubcategory?: string;
}
```

**Responsibilities:**
- Receive categories/subcategories from parent
- Map subcategories to their parent categories
- Pass structured data to CategoryAccordion
- Apply active states based on URL params

---

#### **ProductGridContainer** (`/components/menu/product-grid/product-grid-container.tsx`)
**Type:** Server Component

**Purpose:** Wraps product grid with data

**Props Interface:**
```typescript
interface ProductGridContainerProps {
  products: ProductResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    categoryId?: string;
    subCategoryId?: string;
    search?: string;
  };
}
```

**Responsibilities:**
- Receive products and pagination metadata
- Handle empty state logic (no products)
- Pass data to client ProductGrid component

---

### 3.2 Client Components

#### **MenuPageClient** (`/components/menu/menu-page-client.tsx`)
**Type:** Client Component

**Purpose:** Orchestrates responsive layout and client-side state

**Props Interface:**
```typescript
interface MenuPageClientProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  products: ProductResponse[];
  pagination: PaginationMeta;
  initialFilters: {
    categoryId?: string;
    subCategoryId?: string;
    search?: string;
    page: number;
  };
}
```

**State Management:**
```typescript
// URL params are source of truth - no internal state needed
// Use useSearchParams() and useRouter() for navigation
const searchParams = useSearchParams();
const router = useRouter();

const updateFilter = (key: string, value: string) => {
  const params = new URLSearchParams(searchParams);
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  // Reset to page 1 when filters change
  params.set('page', '1');
  router.push(`/menu?${params.toString()}`);
};
```

**Responsibilities:**
- Manage desktop/mobile layout switching
- Coordinate filter sheet open/close state
- Pass URL navigation functions to children
- Handle scroll-to-top on page change (optional)

---

#### **CategoryAccordion** (`/components/menu/sidebar/category-accordion.tsx`)
**Type:** Client Component

**Purpose:** Interactive accordion for category/subcategory navigation

**Props Interface:**
```typescript
interface CategoryAccordionProps {
  categories: CategoryResponse[];
  subcategoriesByCategory: Map<string, SubCategoryResponse[]>;
  activeCategory?: string;
  activeSubcategory?: string;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onClearFilters: () => void;
}
```

**Shadcn Components Used:**
- `Accordion` (type="single", collapsible)
- `AccordionItem`
- `AccordionTrigger`
- `AccordionContent`

**Implementation Details:**
```typescript
<Accordion
  type="single"
  collapsible
  value={activeCategory}
  onValueChange={(value) => onCategorySelect(value)}
>
  {categories.map((category) => (
    <AccordionItem key={category._id} value={category._id}>
      <AccordionTrigger className={cn(
        "text-base font-semibold",
        activeCategory === category._id && "text-orange-500"
      )}>
        <div className="flex items-center gap-2">
          <CustomImage
            src={category.imageUrl}
            alt={category.name}
            width={24}
            height={24}
            className="rounded"
          />
          <span>{category.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <SubcategoryList
          subcategories={subcategoriesByCategory.get(category._id) || []}
          activeSubcategory={activeSubcategory}
          onSelect={onSubcategorySelect}
        />
      </AccordionContent>
    </AccordionItem>
  ))}
</Accordion>
```

**Keyboard Navigation:**
- Tab: Focus next accordion trigger
- Space/Enter: Toggle accordion
- Arrow keys: Navigate between triggers

---

#### **SubcategoryList** (`/components/menu/sidebar/subcategory-list.tsx`)
**Type:** Client Component

**Purpose:** Renders clickable subcategory items

**Props Interface:**
```typescript
interface SubcategoryListProps {
  subcategories: SubCategoryResponse[];
  activeSubcategory?: string;
  onSelect: (subcategoryId: string) => void;
}
```

**Implementation:**
```typescript
<ul className="space-y-2 pl-8">
  {subcategories.map((sub) => (
    <li key={sub._id}>
      <button
        onClick={() => onSelect(sub._id)}
        className={cn(
          "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
          "hover:bg-slate-100 dark:hover:bg-slate-800",
          activeSubcategory === sub._id
            ? "bg-orange-50 text-orange-600 font-semibold"
            : "text-slate-700 dark:text-slate-300"
        )}
        aria-current={activeSubcategory === sub._id ? "page" : undefined}
      >
        {sub.name}
      </button>
    </li>
  ))}
</ul>
```

---

#### **MobileFilterSheet** (`/components/menu/sidebar/mobile-filter-sheet.tsx`)
**Type:** Client Component

**Purpose:** Mobile drawer for filters

**Props Interface:**
```typescript
interface MobileFilterSheetProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  activeCategory?: string;
  activeSubcategory?: string;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onClearFilters: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

**Shadcn Components Used:**
- `Sheet`
- `SheetTrigger`
- `SheetContent`
- `SheetHeader`
- `SheetTitle`
- `SheetFooter`

**Implementation:**
```typescript
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent
    side="bottom"
    className="h-[80vh] rounded-t-2xl"
  >
    <SheetHeader>
      <SheetTitle>Filter Menu</SheetTitle>
    </SheetHeader>

    <ScrollArea className="h-[calc(80vh-120px)] pr-4">
      <CategoryAccordion
        categories={categories}
        subcategoriesByCategory={subcategoriesByCategory}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onCategorySelect={(id) => {
          onCategorySelect(id);
          onOpenChange(false); // Close on selection
        }}
        onSubcategorySelect={(id) => {
          onSubcategorySelect(id);
          onOpenChange(false);
        }}
        onClearFilters={onClearFilters}
      />
    </ScrollArea>

    <SheetFooter className="flex gap-2">
      <Button
        variant="outline"
        onClick={onClearFilters}
        className="flex-1"
      >
        Clear All
      </Button>
      <Button
        onClick={() => onOpenChange(false)}
        className="flex-1"
      >
        Apply Filters
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

#### **FilterTrigger** (`/components/menu/sidebar/filter-trigger.tsx`)
**Type:** Client Component

**Purpose:** Floating action button to open mobile filters

**Props Interface:**
```typescript
interface FilterTriggerProps {
  activeFilterCount: number;
  onClick: () => void;
}
```

**Shadcn Components Used:**
- `Button`
- `Badge`

**Implementation:**
```typescript
<Button
  onClick={onClick}
  size="lg"
  className={cn(
    "fixed bottom-6 right-6 z-40 rounded-full shadow-2xl",
    "w-14 h-14 lg:hidden",
    "bg-orange-500 hover:bg-orange-600"
  )}
  aria-label={`Open filters (${activeFilterCount} active)`}
>
  <Filter className="w-5 h-5" />
  {activeFilterCount > 0 && (
    <Badge
      className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center"
      variant="destructive"
    >
      {activeFilterCount}
    </Badge>
  )}
</Button>
```

---

#### **ActiveFilters** (`/components/menu/sidebar/active-filters.tsx`)
**Type:** Client Component

**Purpose:** Display active filters as removable chips

**Props Interface:**
```typescript
interface ActiveFiltersProps {
  filters: {
    categoryName?: string;
    subcategoryName?: string;
    search?: string;
  };
  onRemoveCategory: () => void;
  onRemoveSubcategory: () => void;
  onRemoveSearch: () => void;
  onClearAll: () => void;
}
```

**Shadcn Components Used:**
- `Badge`
- `Button`

**Implementation:**
```typescript
<div className="flex items-center gap-2 flex-wrap mb-4">
  {filters.categoryName && (
    <Badge variant="secondary" className="gap-1.5">
      <span>{filters.categoryName}</span>
      <button
        onClick={onRemoveCategory}
        className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
        aria-label={`Remove ${filters.categoryName} filter`}
      >
        <X className="w-3 h-3" />
      </button>
    </Badge>
  )}

  {/* Similar for subcategory and search */}

  {hasActiveFilters && (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClearAll}
      className="h-7 text-xs"
    >
      Clear All
    </Button>
  )}
</div>
```

---

#### **ProductGrid** (`/components/menu/product-grid/product-grid.tsx`)
**Type:** Client Component

**Purpose:** Renders product cards in responsive grid

**Props Interface:**
```typescript
interface ProductGridProps {
  products: ProductResponse[];
}
```

**Implementation:**
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {products.map((product, index) => (
    <ProductCard
      key={product._id}
      product={product}
      index={index}
    />
  ))}
</div>
```

**Reuses:** Existing `ProductCard` component from `/components/home/menu-section/product-card.tsx`

---

#### **ProductPagination** (`/components/menu/product-grid/product-pagination.tsx`)
**Type:** Client Component

**Purpose:** Pagination controls with URL updates

**Props Interface:**
```typescript
interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}
```

**Shadcn Components Used:**
- `Pagination`
- `PaginationContent`
- `PaginationItem`
- `PaginationLink`
- `PaginationPrevious`
- `PaginationNext`
- `PaginationEllipsis`

**Implementation:**
```typescript
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage > 1) onPageChange(currentPage - 1);
        }}
        aria-disabled={currentPage === 1}
        className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
      />
    </PaginationItem>

    {/* Page numbers with ellipsis logic */}
    {getPageNumbers(currentPage, totalPages).map((page, idx) => (
      <PaginationItem key={idx}>
        {page === '...' ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Number(page));
            }}
            isActive={currentPage === Number(page)}
            aria-current={currentPage === Number(page) ? "page" : undefined}
          >
            {page}
          </PaginationLink>
        )}
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (currentPage < totalPages) onPageChange(currentPage + 1);
        }}
        aria-disabled={currentPage === totalPages}
        className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

**Pagination Logic:**
```typescript
function getPageNumbers(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  // Show first, last, current, and neighbors
  // Example: [1, '...', 4, 5, 6, '...', 10]
  const pages: (number | string)[] = [1];

  if (current > 3) pages.push('...');

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  if (total > 1) pages.push(total);

  return pages;
}
```

---

### 3.3 State Components

#### **MenuLoadingSkeleton** (`/app/menu/loading.tsx`)
**Type:** React Component (used in Suspense)

**Purpose:** Loading state for entire page

**Shadcn Components Used:**
- `Skeleton`

**Implementation:**
```typescript
export default function MenuLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar skeleton - desktop only */}
        <div className="hidden lg:block w-64 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <div className="pl-4 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-2/3" />
              </div>
            </div>
          ))}
        </div>

        {/* Product grid skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-10 w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

#### **MenuErrorState** (`/app/menu/error.tsx`)
**Type:** Error Boundary Component

**Purpose:** Error fallback UI

**Props Interface:**
```typescript
interface MenuErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
```

**Shadcn Components Used:**
- `Card`
- `CardHeader`
- `CardTitle`
- `CardDescription`
- `CardContent`
- `Button`

**Implementation:**
```typescript
'use client';

export default function MenuError({ error, reset }: MenuErrorProps) {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            Something went wrong
          </CardTitle>
          <CardDescription>
            We encountered an error loading the menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error.message || 'An unexpected error occurred'}
          </p>
          <Button onClick={reset} className="w-full">
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

#### **MenuEmptyState** (`/components/menu/states/menu-empty.tsx`)
**Type:** React Component

**Purpose:** Empty state when no products match filters

**Props Interface:**
```typescript
interface MenuEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}
```

**Implementation:**
```typescript
export function MenuEmptyState({ hasActiveFilters, onClearFilters }: MenuEmptyStateProps) {
  return (
    <Card className="max-w-md mx-auto text-center py-12">
      <CardContent className="space-y-4">
        {/* Pizza illustration or icon */}
        <div className="w-32 h-32 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
          <Pizza className="w-16 h-16 text-slate-400" />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">
            {hasActiveFilters ? 'No items found' : 'No products available'}
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more results.'
              : 'Check back soon for new items!'}
          </p>
        </div>

        {hasActiveFilters && (
          <Button onClick={onClearFilters} variant="outline">
            Clear Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 4. State Management Strategy

### 4.1 URL as Single Source of Truth

**All filter state lives in URL searchParams:**

```typescript
// URL structure
/menu?category=cat123&subcategory=sub456&search=pizza&page=2

// Mapping
{
  category: string;      // Category ID
  subcategory: string;   // Subcategory ID
  search: string;        // Search query
  page: string;          // Current page (default: "1")
}
```

**Benefits:**
- Shareable links (copy URL to share exact view)
- Browser back/forward support
- SEO-friendly (crawlable filter states)
- No state synchronization issues
- Deep linking support

---

### 4.2 Client State (Minimal)

**Only ephemeral UI state:**

```typescript
// Mobile sheet open/close
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

// Optimistic UI updates (optional)
const [isTransitioning, setIsTransitioning] = useState(false);
```

---

### 4.3 Navigation Pattern

```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function useMenuNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback((updates: Partial<FilterParams>) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Always reset to page 1 when filters change
    if (Object.keys(updates).some(k => k !== 'page')) {
      params.set('page', '1');
    }

    router.push(`/menu?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const clearAllFilters = useCallback(() => {
    router.push('/menu');
  }, [router]);

  return { updateFilters, clearAllFilters };
}
```

---

## 5. Server vs Client Component Decisions

| Component | Type | Reasoning |
|-----------|------|-----------|
| **MenuPage** (`page.tsx`) | Server | Data fetching, SEO metadata, initial render |
| **MenuPageClient** | Client | Layout orchestration, mobile sheet state |
| **CategorySidebar** | Server | Receives data from parent, no interactivity |
| **CategoryAccordion** | Client | Interactive accordion behavior, URL updates |
| **SubcategoryList** | Client | Click handlers, active state highlighting |
| **MobileFilterSheet** | Client | Sheet open/close state, user interactions |
| **FilterTrigger** | Client | Click handler, animation state |
| **ActiveFilters** | Client | Remove filter interactions |
| **ProductGridContainer** | Server | Receives product data from parent |
| **ProductGrid** | Client | May add animations, grid interactions |
| **ProductCard** | Client | Hover states, quick-add interactions (already client) |
| **ProductPagination** | Client | Click handlers, URL updates |
| **MenuLoadingSkeleton** | Either | Pure UI, no state (can be server or client) |
| **MenuErrorState** | Client | Reset handler requires client |
| **MenuEmptyState** | Client | Clear filters handler |

**Key Principles:**
- **Server Components:** Data fetching, static content, SEO
- **Client Components:** Interactivity, animations, browser APIs
- **Hybrid Approach:** Server fetches, passes to client for interactivity

---

## 6. Data Flow Patterns

### 6.1 Initial Page Load (Server-Side)

```
1. User visits /menu?category=abc&page=2
   ↓
2. MenuPage (Server) parses searchParams
   ↓
3. Parallel data fetching:
   - getCategories({ all: true })
   - getSubCategories({ all: true })
   - getProducts({ categoryId: 'abc', page: 2, limit: 12 })
   ↓
4. Server renders initial HTML with data
   ↓
5. Client hydrates with interactive components
```

---

### 6.2 Filter Change (Client-Side)

```
1. User clicks subcategory "Margherita"
   ↓
2. SubcategoryList calls onSelect(subcategoryId)
   ↓
3. MenuPageClient.updateFilters({ subcategory: 'xyz' })
   ↓
4. URL updates to /menu?category=abc&subcategory=xyz&page=1
   ↓
5. Next.js automatically re-fetches MenuPage on server
   ↓
6. New product data fetched with updated filters
   ↓
7. Page re-renders with new products (streaming)
```

---

### 6.3 Pagination (Client-Side)

```
1. User clicks page 3
   ↓
2. ProductPagination calls onPageChange(3)
   ↓
3. MenuPageClient.updateFilters({ page: '3' })
   ↓
4. URL updates to /menu?category=abc&subcategory=xyz&page=3
   ↓
5. Server re-fetches products for page 3
   ↓
6. Grid updates with new products
   ↓
7. Optional: Scroll to top of grid
```

---

### 6.4 Mobile Filter Application

```
1. User opens MobileFilterSheet (FAB button)
   ↓
2. setIsFilterSheetOpen(true)
   ↓
3. User selects category and subcategory
   ↓
4. Each selection updates URL immediately OR on "Apply"
   ↓
5. Sheet closes: setIsFilterSheetOpen(false)
   ↓
6. Page refetches with new filters (same as desktop)
```

---

## 7. Accessibility Requirements

### 7.1 Keyboard Navigation

| Component | Keyboard Support |
|-----------|------------------|
| **CategoryAccordion** | Tab: Focus triggers<br>Space/Enter: Toggle<br>Arrow Up/Down: Navigate triggers |
| **SubcategoryList** | Tab: Focus items<br>Enter: Select subcategory |
| **ProductGrid** | Tab: Navigate cards<br>Enter: Open product (future) |
| **Pagination** | Tab: Navigate page links<br>Enter: Go to page |
| **MobileFilterSheet** | Escape: Close sheet<br>Tab: Cycle through filters<br>Focus trap when open |

---

### 7.2 Screen Reader Support

**ARIA Attributes Required:**

```typescript
// Accordion
<AccordionTrigger
  aria-expanded={isOpen}
  aria-controls={`panel-${category._id}`}
  id={`trigger-${category._id}`}
>
  ...
</AccordionTrigger>

<AccordionContent
  id={`panel-${category._id}`}
  aria-labelledby={`trigger-${category._id}`}
  role="region"
>
  ...
</AccordionContent>

// Pagination
<PaginationLink
  aria-current={currentPage === page ? "page" : undefined}
  aria-label={`Go to page ${page}`}
>
  {page}
</PaginationLink>

// Filter Sheet
<Sheet>
  <SheetContent aria-modal="true" role="dialog">
    <SheetTitle id="filter-title">Filter Menu</SheetTitle>
    ...
  </SheetContent>
</Sheet>

// Active Filters
<Badge>
  <span>{filterName}</span>
  <button
    onClick={onRemove}
    aria-label={`Remove ${filterName} filter`}
  >
    <X className="w-3 h-3" aria-hidden="true" />
  </button>
</Badge>

// Empty State
<div role="status" aria-live="polite">
  No items found. Try adjusting your filters.
</div>
```

---

### 7.3 Color Contrast

**WCAG 2.1 AA Compliance (4.5:1 minimum):**

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Body text | `slate-900` on `white` (21:1) | `white` on `slate-900` (21:1) |
| Active category | `orange-500` on `orange-50` (4.6:1) | `orange-400` on `slate-800` (6.2:1) |
| Pagination active | `white` on `orange-500` (4.8:1) | `white` on `orange-600` (5.5:1) |
| Disabled state | `slate-400` on `white` (4.5:1) | `slate-500` on `slate-900` (4.7:1) |

---

### 7.4 Focus Management

```typescript
// Focus trap in mobile sheet
import { useFocusTrap } from '@/hooks/use-focus-trap';

export function MobileFilterSheet({ open, ...props }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);

  useFocusTrap(sheetRef, open);

  return <Sheet open={open} ref={sheetRef}>...</Sheet>;
}

// Focus restoration after sheet close
const [lastFocusedElement, setLastFocusedElement] = useState<HTMLElement | null>(null);

const handleSheetOpen = () => {
  setLastFocusedElement(document.activeElement as HTMLElement);
  setIsFilterSheetOpen(true);
};

const handleSheetClose = () => {
  setIsFilterSheetOpen(false);
  lastFocusedElement?.focus();
};
```

---

### 7.5 Skip Links

```typescript
// /components/menu/skip-link.tsx
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-md"
    >
      Skip to products
    </a>
  );
}

// In MenuPage
<SkipLink />
<main id="main-content">
  {/* Product grid */}
</main>
```

---

## 8. Mobile vs Desktop Layout Differences

### 8.1 Breakpoint Strategy

```css
/* Tailwind Breakpoints */
xs: 0px       /* Mobile phones (default) */
sm: 640px     /* Large phones */
md: 768px     /* Tablets */
lg: 1024px    /* Laptops - MAIN BREAKPOINT for sidebar */
xl: 1280px    /* Desktops */
2xl: 1536px   /* Large desktops */
```

**Primary Breakpoint:** `lg` (1024px) - Desktop sidebar appears

---

### 8.2 Desktop Layout (lg and above)

```tsx
<div className="container mx-auto px-4 py-8">
  <div className="flex gap-6">
    {/* Sidebar - Fixed width, sticky */}
    <aside className="hidden lg:block w-64 shrink-0 sticky top-20 h-fit">
      <CategorySidebar {...props} />
    </aside>

    {/* Main content - Flexible */}
    <main className="flex-1 min-w-0">
      <ProductGridContainer {...props} />
      <ProductPagination {...props} />
    </main>
  </div>
</div>
```

**Characteristics:**
- Sidebar: 256px fixed width, sticky positioning
- Product grid: 3 columns (lg:grid-cols-3)
- Hover states active
- No filter FAB
- Full-size product cards

---

### 8.3 Tablet Layout (md to lg)

```tsx
<div className="container mx-auto px-4 py-8">
  {/* Mobile filter trigger */}
  <FilterTrigger className="md:top-20 md:right-8" {...props} />

  {/* Full-width product grid */}
  <main className="w-full">
    <ActiveFilters {...props} />
    <ProductGridContainer {...props} />
    <ProductPagination {...props} />
  </main>
</div>
```

**Characteristics:**
- No sidebar (hidden)
- Product grid: 2 columns (sm:grid-cols-2)
- Filter FAB visible
- Active filters displayed above grid
- Standard card size

---

### 8.4 Mobile Layout (xs to sm)

```tsx
<div className="container mx-auto px-3 py-4">
  {/* Mobile filter trigger - bottom right */}
  <FilterTrigger className="bottom-4 right-4" {...props} />

  {/* Mobile filter sheet */}
  <MobileFilterSheet {...props} />

  {/* Full-width product grid */}
  <main className="w-full">
    <ActiveFilters className="flex-nowrap overflow-x-auto" {...props} />
    <ProductGridContainer {...props} />
    <ProductPagination compact {...props} />
  </main>
</div>
```

**Characteristics:**
- No sidebar (hidden)
- Product grid: 1 column (grid-cols-1)
- Filter FAB prominent (bottom-right)
- Sheet slides from bottom (80vh height)
- Active filters: horizontal scroll
- Compact pagination (prev/next only)
- Reduced padding/spacing
- Touch-friendly targets (min 44px)

---

### 8.5 Responsive Classes Matrix

| Element | Mobile (xs-md) | Desktop (lg+) |
|---------|----------------|---------------|
| **Container** | `px-3 py-4` | `px-4 py-8` |
| **Sidebar** | `hidden` | `block w-64 sticky top-20` |
| **Product Grid** | `grid-cols-1 gap-4` | `grid-cols-3 gap-6` |
| **Product Card** | `p-4 text-sm` | `p-5 text-base` |
| **Filter FAB** | `block` | `hidden` |
| **Active Filters** | `overflow-x-auto flex-nowrap` | `flex-wrap` |
| **Pagination** | `text-sm` (compact) | `text-base` (full) |

---

## 9. Shadcn Components Required

### 9.1 Components to Install

```bash
# Core UI components
npx shadcn@latest add accordion
npx shadcn@latest add sheet
npx shadcn@latest add skeleton
npx shadcn@latest add pagination
npx shadcn@latest add badge
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add separator
npx shadcn@latest add scroll-area
```

---

### 9.2 Component Usage Map

| Shadcn Component | Used In | Purpose |
|------------------|---------|---------|
| **Accordion** | CategoryAccordion | Category/subcategory navigation |
| **Sheet** | MobileFilterSheet | Mobile filter drawer |
| **Skeleton** | MenuLoadingSkeleton | Loading states |
| **Pagination** | ProductPagination | Page navigation |
| **Badge** | FilterTrigger, ActiveFilters | Filter count, active filter chips |
| **Button** | FilterTrigger, MobileFilterSheet, EmptyState | Various CTAs |
| **Card** | MenuErrorState, MenuEmptyState | Error and empty state containers |
| **Separator** | CategorySidebar (optional) | Visual dividers |
| **ScrollArea** | MobileFilterSheet | Scrollable filter content |

---

## 10. API Integration Details

### 10.1 API Endpoints

```typescript
// Categories
GET /category?all=true
Response: APIResponse<PaginatedResponse<CategoryResponse>>

// Subcategories (all)
GET /sub-category?all=true
Response: APIResponse<PaginatedResponse<SubCategoryResponse>>

// Subcategories (by category)
GET /sub-category?categoryId=abc&all=true
Response: APIResponse<PaginatedResponse<SubCategoryResponse>>

// Products (filtered)
GET /product?categoryId=abc&subCategoryId=xyz&search=pizza&page=2&limit=12
Response: APIResponse<PaginatedResponse<ProductResponse>>
```

---

### 10.2 Server-Side Data Fetching

```typescript
// /app/menu/page.tsx
export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  // Parallel fetching
  const [categoriesResult, subcategoriesResult, productsResult] =
    await Promise.all([
      getCategories({ all: true }),
      getSubCategories({ all: true }),
      getProducts({
        categoryId: params.category,
        subCategoryId: params.subcategory,
        search: params.search,
        page,
        limit: 12,
      }),
    ]);

  // Error handling
  if (categoriesResult.statusCode !== 200) {
    throw new Error('Failed to load categories');
  }

  const categories = categoriesResult.data.data;
  const subcategories = subcategoriesResult.data.data;
  const products = productsResult.data.data;
  const pagination = productsResult.data.meta;

  return (
    <MenuPageClient
      categories={categories}
      subcategories={subcategories}
      products={products}
      pagination={pagination}
      initialFilters={{
        categoryId: params.category,
        subCategoryId: params.subcategory,
        search: params.search,
        page,
      }}
    />
  );
}
```

---

### 10.3 Error Handling

```typescript
// API error response structure
interface APIResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
}

// Handle in page.tsx
const productsResult = await getProducts(params);

if (productsResult.statusCode !== 200) {
  // This will trigger error.tsx
  throw new Error(productsResult.message || 'Failed to load products');
}

// Or handle gracefully with empty state
if (productsResult.statusCode !== 200 || productsResult.data.data.length === 0) {
  return (
    <MenuPageClient
      {...props}
      products={[]}
      isEmpty={true}
    />
  );
}
```

---

## 11. SEO Optimization

### 11.1 Dynamic Metadata

```typescript
// /app/menu/page.tsx
export async function generateMetadata({ searchParams }: MenuPageProps): Promise<Metadata> {
  const params = await searchParams;

  // Fetch category name if filtering
  let categoryName = '';
  let subcategoryName = '';

  if (params.category) {
    const categoriesResult = await getCategories({ all: true });
    const category = categoriesResult.data.data.find(c => c._id === params.category);
    categoryName = category?.name || '';

    if (params.subcategory) {
      const subcategoriesResult = await getSubCategories({ categoryId: params.category, all: true });
      const subcategory = subcategoriesResult.data.data.find(s => s._id === params.subcategory);
      subcategoryName = subcategory?.name || '';
    }
  }

  // Build title
  const titleParts = [];
  if (subcategoryName) titleParts.push(subcategoryName);
  else if (categoryName) titleParts.push(categoryName);
  titleParts.push('Menu', 'Pizza Space');

  const title = titleParts.join(' - ');

  // Build description
  const description = params.search
    ? `Search results for "${params.search}" in our menu`
    : subcategoryName
    ? `Browse our ${subcategoryName} items from the ${categoryName} category`
    : categoryName
    ? `Explore our ${categoryName} menu items`
    : 'Browse our full menu of delicious pizzas, sides, and beverages';

  // Canonical URL
  const queryString = new URLSearchParams(params as any).toString();
  const canonical = `/menu${queryString ? `?${queryString}` : ''}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [
        {
          url: '/og-menu.jpg',
          width: 1200,
          height: 630,
          alt: 'Pizza Space Menu',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
```

---

### 11.2 JSON-LD Structured Data

```typescript
// /components/seo/menu-json-ld.tsx
interface MenuJsonLdProps {
  products: ProductResponse[];
  category?: CategoryResponse;
}

export function MenuJsonLd({ products, category }: MenuJsonLdProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": category ? `${category.name} Menu` : "Pizza Space Menu",
    "description": "Browse our menu items",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "MenuItem",
        "name": product.name,
        "description": product.description,
        "image": product.photoList[0],
        "offers": {
          "@type": "Offer",
          "price": product.basePrice,
          "priceCurrency": "USD",
        },
        "nutrition": {
          "@type": "NutritionInformation",
          "calories": `${product.protein * 4 + product.carbs * 4 + product.fats * 9}`,
          "proteinContent": `${product.protein}g`,
          "carbohydrateContent": `${product.carbs}g`,
          "fatContent": `${product.fats}g`,
          "fiberContent": `${product.fiber}g`,
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Usage in page.tsx
<MenuJsonLd products={products} category={currentCategory} />
```

---

## 12. Performance Considerations

### 12.1 Image Optimization

```typescript
// In ProductCard (already exists)
<CustomImage
  src={product.photoList[0]}
  alt={product.name}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading={index < 6 ? "eager" : "lazy"}
  priority={index < 3}
/>
```

**Strategy:**
- First 3 products: `priority` (above fold)
- Products 4-6: `loading="eager"`
- Rest: `loading="lazy"`
- Responsive `sizes` for optimal image selection

---

### 12.2 Code Splitting

```typescript
// Lazy load mobile sheet (only on mobile)
const MobileFilterSheet = dynamic(
  () => import('@/components/menu/sidebar/mobile-filter-sheet'),
  {
    ssr: false,
    loading: () => <div>Loading filters...</div>
  }
);

// Conditional rendering
{isMobile && <MobileFilterSheet {...props} />}
```

---

### 12.3 Memoization

```typescript
// ProductCard is already a client component
// Add React.memo to prevent unnecessary re-renders
export const ProductCard = React.memo(function ProductCard({ product, index }: ProductCardProps) {
  // ... existing implementation
});

// Memoize category mapping
const subcategoriesByCategory = useMemo(() => {
  const map = new Map<string, SubCategoryResponse[]>();
  subcategories.forEach(sub => {
    const existing = map.get(sub.categoryId) || [];
    map.set(sub.categoryId, [...existing, sub]);
  });
  return map;
}, [subcategories]);
```

---

### 12.4 Suspense Boundaries

```typescript
// /app/menu/page.tsx
export default async function MenuPage({ searchParams }: MenuPageProps) {
  return (
    <Suspense fallback={<MenuLoadingSkeleton />}>
      <MenuPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MenuPageContent({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const [categories, subcategories, products] = await Promise.all([...]);

  return <MenuPageClient {...props} />;
}
```

---

## 13. Testing Considerations

### 13.1 Unit Tests

```typescript
// CategoryAccordion.test.tsx
describe('CategoryAccordion', () => {
  it('renders all categories', () => {
    render(<CategoryAccordion categories={mockCategories} {...props} />);
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Sides')).toBeInTheDocument();
  });

  it('highlights active category', () => {
    render(<CategoryAccordion activeCategory="cat123" {...props} />);
    expect(screen.getByText('Pizza')).toHaveClass('text-orange-500');
  });

  it('calls onCategorySelect when category clicked', () => {
    const onSelect = jest.fn();
    render(<CategoryAccordion onCategorySelect={onSelect} {...props} />);
    fireEvent.click(screen.getByText('Pizza'));
    expect(onSelect).toHaveBeenCalledWith('cat123');
  });
});
```

---

### 13.2 Integration Tests

```typescript
// MenuPage.integration.test.tsx
describe('MenuPage Integration', () => {
  it('filters products when category selected', async () => {
    render(<MenuPage searchParams={Promise.resolve({})} />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Margherita')).toBeInTheDocument();
    });

    // Click category
    fireEvent.click(screen.getByText('Pizza'));

    // Verify URL updated
    expect(window.location.search).toContain('category=');

    // Verify products filtered (mocked API)
    await waitFor(() => {
      expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
    });
  });
});
```

---

### 13.3 Accessibility Tests

```typescript
// Accessibility.test.tsx
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MenuPage Accessibility', () => {
  it('has no WCAG violations', async () => {
    const { container } = render(<MenuPage searchParams={Promise.resolve({})} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('supports keyboard navigation', () => {
    render(<CategoryAccordion {...props} />);

    const firstTrigger = screen.getByText('Pizza');
    firstTrigger.focus();
    expect(firstTrigger).toHaveFocus();

    fireEvent.keyDown(firstTrigger, { key: 'Enter' });
    expect(screen.getByText('Margherita')).toBeVisible();
  });
});
```

---

## 14. Future Enhancements

### 14.1 Phase 2 Features (Not in Initial Scope)

- **View Toggle:** Grid vs List view
- **Sort Options:** Price, popularity, name, rating
- **Quick View:** Product modal preview without navigation
- **Infinite Scroll:** Alternative to pagination
- **Filter Persistence:** Remember last filters in localStorage
- **Recently Viewed:** Track and display recently viewed products
- **Favorites:** Save favorite products (requires auth)
- **Price Range Filter:** Min/max price sliders
- **Dietary Filters:** Veg, non-veg, vegan, gluten-free
- **Spice Level Filter:** Dedicated spice filter UI

---

### 14.2 Analytics Integration

```typescript
// Track filter usage
const trackFilterChange = (filterType: string, value: string) => {
  analytics.track('Menu Filter Applied', {
    filterType,
    value,
    currentUrl: window.location.href,
  });
};

// Track pagination
const trackPageChange = (page: number) => {
  analytics.track('Menu Page Changed', {
    page,
    totalPages,
  });
};
```

---

## 15. File Structure Summary

```
/app/menu/
├── page.tsx                          # Server Component - Main page
├── layout.tsx                        # Optional shared layout
├── loading.tsx                       # Suspense fallback
└── error.tsx                         # Error boundary

/components/menu/
├── menu-page-client.tsx              # Client - Root container
├── skip-link.tsx                     # Accessibility skip link
│
├── sidebar/
│   ├── category-sidebar.tsx         # Server - Category data provider
│   ├── category-accordion.tsx       # Client - Accordion UI
│   ├── subcategory-list.tsx         # Client - Subcategory items
│   ├── mobile-filter-sheet.tsx      # Client - Mobile drawer
│   ├── filter-trigger.tsx           # Client - FAB button
│   ├── active-filters.tsx           # Client - Filter chips
│   └── sidebar-skeleton.tsx         # Loading skeleton
│
├── product-grid/
│   ├── product-grid-container.tsx   # Server - Product data provider
│   ├── product-grid.tsx             # Client - Grid layout
│   └── product-pagination.tsx       # Client - Pagination controls
│
└── states/
    ├── menu-loading.tsx             # Loading skeleton (full page)
    ├── menu-error.tsx               # Error state
    └── menu-empty.tsx               # Empty state

/components/seo/
└── menu-json-ld.tsx                 # JSON-LD structured data

/hooks/
└── use-menu-navigation.ts           # URL navigation hook

/lib/api/
├── categories.ts                    # Category API (existing)
├── subcategories.ts                 # Subcategory API (existing)
└── products.ts                      # Product API (existing)
```

---

## 16. Implementation Checklist

### Phase 1: Foundation
- [ ] Create `/app/menu/page.tsx` with metadata
- [ ] Create `/app/menu/loading.tsx` with skeleton
- [ ] Create `/app/menu/error.tsx` with error UI
- [ ] Install shadcn components (accordion, sheet, pagination, etc.)

### Phase 2: Sidebar
- [ ] Create `CategorySidebar` server component
- [ ] Create `CategoryAccordion` client component
- [ ] Create `SubcategoryList` client component
- [ ] Implement URL navigation logic
- [ ] Add active state highlighting

### Phase 3: Product Grid
- [ ] Create `ProductGridContainer` server component
- [ ] Create `ProductGrid` client component
- [ ] Integrate existing `ProductCard` component
- [ ] Create `ProductPagination` component
- [ ] Implement pagination logic

### Phase 4: Mobile Experience
- [ ] Create `MobileFilterSheet` component
- [ ] Create `FilterTrigger` FAB button
- [ ] Create `ActiveFilters` chip display
- [ ] Implement responsive breakpoints
- [ ] Test mobile interactions

### Phase 5: States
- [ ] Create `MenuEmptyState` component
- [ ] Implement error handling in `error.tsx`
- [ ] Add loading skeletons
- [ ] Test all states (loading, error, empty)

### Phase 6: Accessibility
- [ ] Add ARIA attributes
- [ ] Implement keyboard navigation
- [ ] Add focus management
- [ ] Create skip link component
- [ ] Test with screen reader

### Phase 7: SEO
- [ ] Implement dynamic metadata
- [ ] Create `MenuJsonLd` component
- [ ] Add canonical URLs
- [ ] Test structured data with Google's tool

### Phase 8: Performance
- [ ] Optimize image loading
- [ ] Add memoization
- [ ] Implement code splitting
- [ ] Test Core Web Vitals
- [ ] Run Lighthouse audit

---

## 17. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Lighthouse Performance** | > 90 | Chrome DevTools |
| **Lighthouse Accessibility** | 100 | Chrome DevTools |
| **Lighthouse SEO** | 100 | Chrome DevTools |
| **LCP** | < 2.5s | Chrome DevTools Performance |
| **FID/INP** | < 100ms | Real User Monitoring |
| **CLS** | < 0.1 | Chrome DevTools Performance |
| **Build Errors** | 0 | `npm run build` |
| **ESLint Errors** | 0 | `npm run lint` |
| **TypeScript Errors** | 0 | `tsc --noEmit` |

---

## Appendix A: Type Definitions

```typescript
// All types already exist in /types/
// Reference for implementation:

import {
  CategoryResponse,
  CategoryQueryParams,
  SubCategoryResponse,
  SubCategoryQueryParams,
  ProductResponse,
  ProductQueryParams,
  PaginatedResponse,
  APIResponse,
} from '@/types';

// Additional types for Menu Page

interface MenuPageSearchParams {
  category?: string;
  subcategory?: string;
  search?: string;
  page?: string;
}

interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface MenuFilters {
  categoryId?: string;
  subCategoryId?: string;
  search?: string;
  page: number;
}
```

---

## Appendix B: Utility Functions

```typescript
// /lib/menu-utils.ts

export function buildQueryString(params: Record<string, string | undefined>): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const str = query.toString();
  return str ? `?${str}` : '';
}

export function groupSubcategoriesByCategory(
  subcategories: SubCategoryResponse[]
): Map<string, SubCategoryResponse[]> {
  return subcategories.reduce((acc, sub) => {
    const existing = acc.get(sub.categoryId) || [];
    acc.set(sub.categoryId, [...existing, sub]);
    return acc;
  }, new Map<string, SubCategoryResponse[]>());
}

export function getActiveFilterCount(filters: MenuFilters): number {
  let count = 0;
  if (filters.categoryId) count++;
  if (filters.subCategoryId) count++;
  if (filters.search) count++;
  return count;
}

export function getPaginationRange(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [1];

  if (current > 3) pages.push('...');

  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push('...');

  if (total > 1) pages.push(total);

  return pages;
}
```

---

**End of Requirements Document**

This comprehensive requirements document serves as the complete specification for implementing the Menu Page feature. All subsequent phases (architecture, implementation, testing) should reference this document as the single source of truth for feature requirements, component structure, and technical decisions.
