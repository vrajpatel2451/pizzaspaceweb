# Menu Page Component Architecture

**Project**: Pizza Space Web - Menu Page Feature
**Phase**: Sub-Phase 2.1 - Component Architecture Design
**Date**: 2025-12-01
**Framework**: Next.js 16 with App Router
**Status**: Architecture Design Complete

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Component Tree Hierarchy](#component-tree-hierarchy)
3. [Component Specifications](#component-specifications)
4. [Server vs Client Component Strategy](#server-vs-client-component-strategy)
5. [Data Fetching Architecture](#data-fetching-architecture)
6. [State Management Strategy](#state-management-strategy)
7. [Suspense Boundary Placement](#suspense-boundary-placement)
8. [Error Boundary Strategy](#error-boundary-strategy)
9. [Props Interface Definitions](#props-interface-definitions)
10. [File Structure](#file-structure)
11. [Implementation Patterns](#implementation-patterns)

---

## Architecture Overview

### Design Principles

The Menu Page architecture follows Next.js 16 App Router best practices with a clear separation between Server and Client Components:

**Key Architectural Decisions:**

1. **Server-First Data Fetching**: All data fetching happens on the server for optimal SEO and performance
2. **URL-Driven State**: Search parameters drive all filter state (shareable URLs, browser history support)
3. **Minimal Client JavaScript**: Only interactive elements are Client Components
4. **Parallel Data Fetching**: Categories, subcategories, and products fetch in parallel
5. **Composition Over Props Drilling**: Server Components pass data to Client Components via props, maximum 2 levels deep

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    App Router Layer                          │
│  /app/menu/page.tsx (Server Component - Data Orchestration) │
│  /app/menu/loading.tsx (Suspense Fallback)                  │
│  /app/menu/error.tsx (Error Boundary)                       │
└─────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│                  Client Orchestration Layer                  │
│  MenuPageClient (Client Component - Layout & State)         │
└─────────────────────────────────────────────────────────────┘
                             ↓
         ┌──────────────────┴──────────────────┐
         ↓                                      ↓
┌────────────────────┐              ┌─────────────────────────┐
│  Sidebar Module    │              │  Product Grid Module    │
│  (Desktop/Mobile)  │              │  (Filtering & Display)  │
└────────────────────┘              └─────────────────────────┘
```

---

## Component Tree Hierarchy

### Complete Component Tree

```
/app/menu/page.tsx (Server - Root Page)
│
├── generateMetadata() (Server Function)
│   └── Dynamic SEO metadata generation
│
├── MenuPageContent (Server - Data Fetching)
│   │
│   ├── Parallel Data Fetching
│   │   ├── getCategories({ all: true })
│   │   ├── getSubCategories({ all: true })
│   │   └── getProducts({ ...filters, page, limit: 12 })
│   │
│   └── MenuPageClient (Client - Layout Orchestrator)
│       │
│       ├── Desktop Layout (lg:flex) [hidden on mobile]
│       │   │
│       │   ├── CategorySidebar (Server - Data Provider)
│       │   │   └── CategoryAccordion (Client - Interactive)
│       │   │       ├── AccordionItem × N (per category)
│       │   │       │   ├── AccordionTrigger (Client)
│       │   │       │   │   ├── Category Image
│       │   │       │   │   ├── Category Name
│       │   │       │   │   └── Active Indicator
│       │   │       │   │
│       │   │       │   └── AccordionContent (Client)
│       │   │       │       └── SubcategoryList (Client)
│       │   │       │           └── SubcategoryItem × N (buttons)
│       │   │       │               ├── Subcategory Name
│       │   │       │               └── Active Indicator
│       │   │       │
│       │   │       └── Clear Filters Button (Client)
│       │   │
│       │   └── Main Content Area (flex-1)
│       │       ├── ProductGridContainer (Server - Data Provider)
│       │       │   ├── Empty State Logic
│       │       │   └── ProductGrid (Client - Display)
│       │       │       ├── motion.div (Framer Motion container)
│       │       │       └── ProductCard × N (Client - from existing)
│       │       │           ├── Product Image (CustomImage)
│       │       │           ├── Product Details
│       │       │           ├── Price Display
│       │       │           └── Quick Add Button
│       │       │
│       │       └── ProductPagination (Client - Navigation)
│       │           ├── Previous Button
│       │           ├── Page Numbers (with ellipsis)
│       │           └── Next Button
│       │
│       └── Mobile Layout (lg:hidden) [visible on mobile/tablet]
│           │
│           ├── FilterTrigger (Client - FAB)
│           │   ├── Filter Icon
│           │   └── Active Filter Badge (count)
│           │
│           ├── MobileFilterSheet (Client - Bottom Drawer)
│           │   ├── Sheet Component (shadcn)
│           │   ├── SheetHeader
│           │   │   └── SheetTitle
│           │   ├── SheetContent (ScrollArea)
│           │   │   └── CategoryAccordion (Reused)
│           │   └── SheetFooter
│           │       ├── Clear All Button
│           │       └── Apply Button (Close Sheet)
│           │
│           ├── ActiveFilters (Client - Filter Chips)
│           │   └── Badge × N (removable chips)
│           │       ├── Filter Label
│           │       └── Remove Button (×)
│           │
│           ├── ProductGridContainer (Reused from Desktop)
│           └── ProductPagination (Reused from Desktop)

/app/menu/loading.tsx (Suspense Fallback)
└── MenuLoading (React Component)
    ├── SidebarSkeleton (Desktop only)
    │   └── Skeleton × 6 (category placeholders)
    └── ProductGridSkeleton
        └── ProductCardSkeleton × 12
            ├── Image Skeleton (aspect-square)
            ├── Title Skeleton
            ├── Description Skeleton
            └── Price Skeleton

/app/menu/error.tsx (Error Boundary)
└── MenuError (Client Component)
    └── Card (shadcn)
        ├── CardHeader
        │   ├── Error Icon
        │   └── CardTitle
        ├── CardContent
        │   ├── Error Message
        │   └── Error Details
        └── CardFooter
            └── Retry Button

/components/menu/states/menu-empty.tsx
└── MenuEmpty (Client Component)
    └── Card (shadcn)
        ├── CardHeader
        │   ├── Empty Icon/Illustration
        │   └── CardTitle
        ├── CardContent
        │   └── Description
        └── CardFooter
            ├── Clear Filters Button
            └── Browse All Button
```

### Component Responsibilities Summary

| Component | Type | Responsibility |
|-----------|------|----------------|
| **page.tsx** | Server | Data orchestration, SEO metadata, URL parsing |
| **MenuPageClient** | Client | Desktop/mobile layout switching, filter sheet state |
| **CategorySidebar** | Server | Receive and structure category data |
| **CategoryAccordion** | Client | Interactive accordion, URL updates on selection |
| **SubcategoryList** | Client | Render clickable subcategory items |
| **MobileFilterSheet** | Client | Mobile drawer for filters |
| **FilterTrigger** | Client | FAB button with active filter count |
| **ActiveFilters** | Client | Display and remove active filter chips |
| **ProductGridContainer** | Server | Receive product data, empty state logic |
| **ProductGrid** | Client | Render product grid with animations |
| **ProductPagination** | Client | Page navigation, URL updates |
| **MenuLoading** | Either | Skeleton loading state |
| **MenuError** | Client | Error UI with retry button |
| **MenuEmpty** | Client | Empty state with CTAs |

---

## Component Specifications

### 1. MenuPage (`/app/menu/page.tsx`)

**Type**: Server Component (async)

**Purpose**: Root page component - handles data fetching, SEO, and routing

```typescript
interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    subcategory?: string;
    search?: string;
    page?: string;
  }>;
}
```

**Responsibilities**:
- Parse and await searchParams (Next.js 16 async pattern)
- Fetch categories, subcategories, and products in parallel
- Generate dynamic metadata based on active filters
- Handle empty/error states at data level
- Pass fetched data to MenuPageClient

**Data Fetching Pattern**:
```typescript
const [categoriesResult, subcategoriesResult, productsResult] =
  await Promise.all([
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

**Metadata Generation**:
```typescript
export async function generateMetadata({
  searchParams
}: MenuPageProps): Promise<Metadata> {
  const params = await searchParams;

  // Fetch category/subcategory names for dynamic title
  const title = params.category
    ? `${categoryName} - Pizza Space Menu`
    : 'Menu - Pizza Space';

  return {
    title,
    description: '...',
    openGraph: { ... },
    alternates: {
      canonical: `/menu${buildQueryString(params)}`,
    },
  };
}
```

**Key Patterns**:
- Always await searchParams (Next.js 16 requirement)
- Use Promise.all for parallel data fetching
- Handle API errors by throwing (triggers error.tsx)
- Pass serializable props only to Client Components

---

### 2. MenuPageClient (`/components/menu/menu-page-client.tsx`)

**Type**: Client Component

**Purpose**: Orchestrates responsive layout and manages ephemeral UI state

```typescript
'use client';

interface MenuPageClientProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  products: ProductResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  initialFilters: {
    categoryId?: string;
    subCategoryId?: string;
    search?: string;
    page: number;
  };
}
```

**Responsibilities**:
- Manage mobile filter sheet open/close state
- Provide URL update functions to children
- Handle desktop/mobile layout switching
- Coordinate scroll behavior on filter/page change (optional)

**State Management**:
```typescript
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
const searchParams = useSearchParams();
const router = useRouter();

const updateFilters = useCallback((updates: Partial<FilterParams>) => {
  const params = new URLSearchParams(searchParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });

  // Reset to page 1 when filters change
  if (Object.keys(updates).some(k => k !== 'page')) {
    params.set('page', '1');
  }

  router.push(`/menu?${params.toString()}`, { scroll: false });
}, [router, searchParams]);
```

**Layout Structure**:
```tsx
return (
  <div className="container mx-auto px-4 py-8">
    {/* Desktop Layout */}
    <div className="hidden lg:flex gap-6">
      <aside className="w-64 shrink-0 sticky top-20 h-fit">
        <CategorySidebar {...sidebarProps} />
      </aside>
      <main className="flex-1 min-w-0">
        <ProductGridContainer {...gridProps} />
        <ProductPagination {...paginationProps} />
      </main>
    </div>

    {/* Mobile Layout */}
    <div className="lg:hidden">
      <FilterTrigger {...fabProps} />
      <MobileFilterSheet {...sheetProps} />
      <ActiveFilters {...chipProps} />
      <ProductGridContainer {...gridProps} />
      <ProductPagination {...paginationProps} />
    </div>
  </div>
);
```

**Key Patterns**:
- Use 'use client' directive at top
- Minimal local state (only UI ephemeral state)
- URL is source of truth for filters
- Reuse components between desktop/mobile
- Use Tailwind responsive classes (lg:)

---

### 3. CategorySidebar (`/components/menu/sidebar/category-sidebar.tsx`)

**Type**: Server Component

**Purpose**: Structures category data and passes to accordion

```typescript
interface CategorySidebarProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  activeCategory?: string;
  activeSubcategory?: string;
}
```

**Responsibilities**:
- Map subcategories to their parent categories
- Apply active states based on URL params
- Pass structured data to CategoryAccordion

**Implementation**:
```typescript
export default function CategorySidebar({
  categories,
  subcategories,
  activeCategory,
  activeSubcategory,
}: CategorySidebarProps) {
  // Group subcategories by category ID
  const subcategoriesByCategory = new Map<string, SubCategoryResponse[]>();
  subcategories.forEach(sub => {
    const existing = subcategoriesByCategory.get(sub.categoryId) || [];
    subcategoriesByCategory.set(sub.categoryId, [...existing, sub]);
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Categories</h2>
      <CategoryAccordion
        categories={categories}
        subcategoriesByCategory={subcategoriesByCategory}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
      />
    </div>
  );
}
```

**Key Patterns**:
- No 'use client' directive (Server Component)
- Pure data transformation (grouping)
- No event handlers (passes callbacks from parent)

---

### 4. CategoryAccordion (`/components/menu/sidebar/category-accordion.tsx`)

**Type**: Client Component

**Purpose**: Interactive accordion for category/subcategory navigation

```typescript
'use client';

interface CategoryAccordionProps {
  categories: CategoryResponse[];
  subcategoriesByCategory: Map<string, SubCategoryResponse[]>;
  activeCategory?: string;
  activeSubcategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onClearFilters?: () => void;
}
```

**Responsibilities**:
- Render Radix Accordion with categories
- Handle category/subcategory selection
- Show active states
- Update URL on selection

**Implementation**:
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { CustomImage } from '@/components/ui/custom-image';

export default function CategoryAccordion({
  categories,
  subcategoriesByCategory,
  activeCategory,
  activeSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  onClearFilters,
}: CategoryAccordionProps) {
  return (
    <div className="space-y-2">
      <Accordion
        type="single"
        collapsible
        value={activeCategory}
        onValueChange={(value) => onCategorySelect?.(value)}
      >
        {categories.map((category) => (
          <AccordionItem key={category._id} value={category._id}>
            <AccordionTrigger
              className={cn(
                "text-base font-semibold transition-colors",
                "hover:text-orange-500",
                activeCategory === category._id && "text-orange-500"
              )}
            >
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

      {(activeCategory || activeSubcategory) && (
        <button
          onClick={onClearFilters}
          className="w-full px-3 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-md transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}
```

**Key Patterns**:
- Use shadcn Accordion component
- Single type: only one category expanded at a time
- Controlled component: value driven by activeCategory
- Active styling with orange-500 brand color
- Callbacks for URL updates

---

### 5. SubcategoryList (`/components/menu/sidebar/subcategory-list.tsx`)

**Type**: Client Component

**Purpose**: Renders clickable subcategory items

```typescript
'use client';

interface SubcategoryListProps {
  subcategories: SubCategoryResponse[];
  activeSubcategory?: string;
  onSelect?: (subcategoryId: string) => void;
}
```

**Implementation**:
```tsx
export default function SubcategoryList({
  subcategories,
  activeSubcategory,
  onSelect,
}: SubcategoryListProps) {
  return (
    <ul className="space-y-2 pl-8">
      {subcategories.map((sub) => (
        <li key={sub._id}>
          <button
            onClick={() => onSelect?.(sub._id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              "hover:bg-slate-100 dark:hover:bg-slate-800",
              activeSubcategory === sub._id
                ? "bg-orange-50 text-orange-600 font-semibold dark:bg-orange-950"
                : "text-slate-700 dark:text-slate-300"
            )}
            aria-current={activeSubcategory === sub._id ? "page" : undefined}
          >
            {sub.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
```

**Key Patterns**:
- Simple button list
- Active state styling
- ARIA attributes for accessibility
- Callback for URL updates

---

### 6. MobileFilterSheet (`/components/menu/sidebar/mobile-filter-sheet.tsx`)

**Type**: Client Component

**Purpose**: Mobile bottom drawer for filters

```typescript
'use client';

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

**Implementation**:
```tsx
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function MobileFilterSheet({
  categories,
  subcategories,
  activeCategory,
  activeSubcategory,
  onCategorySelect,
  onSubcategorySelect,
  onClearFilters,
  open,
  onOpenChange,
}: MobileFilterSheetProps) {
  const subcategoriesByCategory = new Map<string, SubCategoryResponse[]>();
  subcategories.forEach(sub => {
    const existing = subcategoriesByCategory.get(sub.categoryId) || [];
    subcategoriesByCategory.set(sub.categoryId, [...existing, sub]);
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[80vh] rounded-t-2xl"
      >
        <SheetHeader>
          <SheetTitle>Filter Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(80vh-120px)] pr-4 mt-6">
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
            onClearFilters={() => {
              onClearFilters();
              onOpenChange(false);
            }}
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
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            Apply Filters
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

**Key Patterns**:
- Reuses CategoryAccordion component
- Slides from bottom (side="bottom")
- Auto-closes on filter selection
- ScrollArea for long category lists

---

### 7. FilterTrigger (`/components/menu/sidebar/filter-trigger.tsx`)

**Type**: Client Component

**Purpose**: Floating action button to open mobile filters

```typescript
'use client';

interface FilterTriggerProps {
  activeFilterCount: number;
  onClick: () => void;
}
```

**Implementation**:
```tsx
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FilterTrigger({
  activeFilterCount,
  onClick,
}: FilterTriggerProps) {
  return (
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
          className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-red-500"
        >
          {activeFilterCount}
        </Badge>
      )}
    </Button>
  );
}
```

**Key Patterns**:
- Fixed positioning (bottom-right)
- Hidden on desktop (lg:hidden)
- Active filter count badge
- Orange brand color

---

### 8. ProductGridContainer (`/components/menu/product-grid/product-grid-container.tsx`)

**Type**: Server Component

**Purpose**: Wraps product grid with data and empty state logic

```typescript
interface ProductGridContainerProps {
  products: ProductResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  filters: {
    categoryId?: string;
    subCategoryId?: string;
    search?: string;
  };
}
```

**Implementation**:
```tsx
import { MenuEmpty } from '@/components/menu/states/menu-empty';
import { ProductGrid } from './product-grid';

export default function ProductGridContainer({
  products,
  pagination,
  filters,
}: ProductGridContainerProps) {
  const hasActiveFilters = Boolean(
    filters.categoryId || filters.subCategoryId || filters.search
  );

  if (products.length === 0) {
    return (
      <MenuEmpty
        hasActiveFilters={hasActiveFilters}
        onClearFilters={() => {
          // Will be a client component wrapper
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Showing {products.length} of {pagination.totalItems} products
        </p>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
```

**Key Patterns**:
- Empty state handling
- Product count display
- Passes data to client ProductGrid

---

### 9. ProductGrid (`/components/menu/product-grid/product-grid.tsx`)

**Type**: Client Component

**Purpose**: Renders product cards in responsive grid with animations

```typescript
'use client';

interface ProductGridProps {
  products: ProductResponse[];
}
```

**Implementation**:
```tsx
import { motion } from 'framer-motion';
import { ProductCard } from '@/components/home/menu-section/product-card';

const gridContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const gridItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      variants={gridContainer}
      initial="hidden"
      animate="show"
    >
      {products.map((product, index) => (
        <motion.div key={product._id} variants={gridItem}>
          <ProductCard product={product} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}
```

**Key Patterns**:
- Framer Motion for stagger animation
- Reuses existing ProductCard component
- Responsive grid (1/2/3 columns)
- Motion variants for animation

---

### 10. ProductPagination (`/components/menu/product-grid/product-pagination.tsx`)

**Type**: Client Component

**Purpose**: Page navigation with URL updates

```typescript
'use client';

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
```

**Implementation**:
```tsx
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProductPaginationProps) {
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [1];

    if (currentPage > 3) pages.push('...');

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');

    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <Pagination className="mt-8">
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

        {getPageNumbers().map((page, idx) => (
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
                className={cn(
                  currentPage === Number(page) &&
                    "bg-orange-500 text-white hover:bg-orange-600"
                )}
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
  );
}
```

**Key Patterns**:
- Smart ellipsis logic
- Active page styling (orange-500)
- Disabled state for first/last page
- Callback for URL updates

---

## Server vs Client Component Strategy

### Decision Matrix

| Component | Type | Reasoning |
|-----------|------|-----------|
| **page.tsx** | Server | Data fetching, SEO metadata, async searchParams |
| **MenuPageClient** | Client | Layout state, mobile sheet toggle, URL navigation |
| **CategorySidebar** | Server | Data transformation only, no interactivity |
| **CategoryAccordion** | Client | Accordion behavior, click handlers |
| **SubcategoryList** | Client | Button click handlers, active states |
| **MobileFilterSheet** | Client | Sheet open/close state, interactions |
| **FilterTrigger** | Client | Button click handler, FAB |
| **ActiveFilters** | Client | Remove filter click handlers |
| **ProductGridContainer** | Server | Data provision, empty state logic |
| **ProductGrid** | Client | Framer Motion animations |
| **ProductCard** | Client | Hover states, interactions (existing) |
| **ProductPagination** | Client | Page change handlers, URL updates |
| **MenuLoading** | Either | Pure UI, no state or interactivity |
| **MenuError** | Client | Reset button handler |
| **MenuEmpty** | Client | CTA button handlers |

### Key Principles

**Use Server Components for:**
- Data fetching (categories, products)
- SEO metadata generation
- Static content rendering
- Data transformation/structuring
- Reducing client bundle size

**Use Client Components for:**
- Event handlers (onClick, onChange)
- Browser APIs (useSearchParams, useRouter)
- State management (useState, useReducer)
- Animations (Framer Motion)
- Third-party interactive libraries

### Component Composition Pattern

```typescript
// Server Component (page.tsx)
async function MenuPage() {
  const data = await fetchData();

  return (
    <MenuPageClient data={data}>  {/* Client boundary */}
      <CategorySidebar>           {/* Server - data transform */}
        <CategoryAccordion />     {/* Client - interactive */}
      </CategorySidebar>
    </MenuPageClient>
  );
}
```

**Rule**: Maximum 2 levels of Server → Client → Server nesting

---

## Data Fetching Architecture

### Parallel Fetching Strategy

```typescript
// /app/menu/page.tsx
export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || '1');

  // PARALLEL FETCHING - All requests start simultaneously
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

### API Response Structure

```typescript
// Expected API response format
interface APIResponse<T> {
  statusCode: number;
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│            User navigates to /menu?category=X       │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  MenuPage (Server) - Parse searchParams (async)     │
│  Extract: category, subcategory, search, page       │
└────────────────────┬────────────────────────────────┘
                     ↓
      ┌──────────────┴──────────────┐
      ↓                              ↓
┌──────────────┐           ┌─────────────────┐
│ getCategories│           │ getSubCategories│
│ ({ all })    │           │ ({ all })       │
└──────┬───────┘           └────────┬────────┘
       │                            │
       └────────────┬───────────────┘
                    ↓
            ┌───────────────┐
            │  getProducts  │
            │  ({ filters }) │
            └───────┬───────┘
                    ↓
┌─────────────────────────────────────────────────────┐
│  Promise.all resolves - all data fetched in parallel│
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Pass data as props to MenuPageClient               │
│  {categories, subcategories, products, pagination}  │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  MenuPageClient (Client) - Render UI                │
│  No data fetching - only URL updates via router     │
└─────────────────────────────────────────────────────┘
```

### Performance Considerations

1. **Parallel Fetching**: All API calls start simultaneously (Promise.all)
2. **Single Round Trip**: One server render cycle per navigation
3. **Static Categories**: Categories/subcategories rarely change (potential for static generation future)
4. **Dynamic Products**: Products always fetched based on current filters

---

## State Management Strategy

### URL as Single Source of Truth

**All filter state lives in URL searchParams**:

```typescript
// URL structure
/menu?category=cat123&subcategory=sub456&search=pizza&page=2

// Parsed params
{
  category: 'cat123',
  subcategory: 'sub456',
  search: 'pizza',
  page: '2'
}
```

**Benefits**:
- Shareable links (copy URL to share exact view)
- Browser back/forward support
- SEO-friendly (crawlable filter states)
- No state synchronization issues
- Deep linking support
- No need for global state management

### Client State (Minimal)

**Only ephemeral UI state in Client Components**:

```typescript
// MenuPageClient
const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

// Optional: Loading state during transitions
const [isTransitioning, setIsTransitioning] = useState(false);
```

### Navigation Pattern

```typescript
// /hooks/use-menu-navigation.ts
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface FilterParams {
  category?: string;
  subcategory?: string;
  search?: string;
  page?: string;
}

export function useMenuNavigation() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = useCallback(
    (updates: Partial<FilterParams>) => {
      const params = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // Always reset to page 1 when filters change (except page param itself)
      if (Object.keys(updates).some((k) => k !== 'page')) {
        params.set('page', '1');
      }

      router.push(`/menu?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const clearAllFilters = useCallback(() => {
    router.push('/menu');
  }, [router]);

  const goToPage = useCallback(
    (page: number) => {
      updateFilters({ page: page.toString() });
    },
    [updateFilters]
  );

  return {
    updateFilters,
    clearAllFilters,
    goToPage,
  };
}
```

### State Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│  User clicks "Margherita" subcategory               │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  SubcategoryList calls onSelect(subcategoryId)      │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  MenuPageClient.updateFilters({ subcategory: 'xyz'})│
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  URL updates: /menu?category=abc&subcategory=xyz    │
│  (Also resets page to 1)                            │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Next.js automatically re-fetches MenuPage (Server) │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  New products fetched with updated filters          │
└────────────────────┬────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────────────┐
│  Page re-renders with new product data              │
│  (Streaming/transition state handled by Next.js)    │
└─────────────────────────────────────────────────────┘
```

---

## Suspense Boundary Placement

### Suspense Strategy

Next.js 16 App Router automatically handles Suspense with loading.tsx. We add manual Suspense for granular control.

### Boundary Placement

```typescript
// /app/menu/page.tsx
import { Suspense } from 'react';
import { MenuLoading } from './loading';

export default async function MenuPage({ searchParams }: MenuPageProps) {
  return (
    <Suspense fallback={<MenuLoading />}>
      <MenuPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MenuPageContent({ searchParams }: MenuPageProps) {
  const params = await searchParams;

  // Data fetching happens here
  const [categories, subcategories, products] = await Promise.all([...]);

  return <MenuPageClient {...data} />;
}
```

### Loading States

```typescript
// /app/menu/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function MenuLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-6">
        {/* Sidebar skeleton - desktop only */}
        <div className="hidden lg:block w-64 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
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
            {Array.from({ length: 12 }).map((_, i) => (
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

### Suspense Principles

1. **Automatic Loading**: loading.tsx shows during initial page load
2. **Manual Suspense**: Wrap async components for granular control
3. **Skeleton Match**: Loading state dimensions must match actual content
4. **No Layout Shift**: Prevent CLS by matching skeleton to real content
5. **Progressive Loading**: Show shell immediately, stream data

---

## Error Boundary Strategy

### Error Boundary Placement

```typescript
// /app/menu/error.tsx
'use client';

import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Menu page error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
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
          {error.digest && (
            <p className="text-xs text-slate-500">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button onClick={reset} className="w-full bg-orange-500 hover:bg-orange-600">
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
```

### Error Handling Levels

1. **Page Level** (`error.tsx`): Catches all errors in page and children
2. **Data Fetching**: Throw errors from Server Components (triggers error.tsx)
3. **Client Errors**: Try-catch in event handlers, show inline error states
4. **Network Errors**: API errors throw to trigger error boundary

### Error Propagation

```typescript
// In page.tsx
const categoriesResult = await getCategories({ all: true });

if (categoriesResult.statusCode !== 200) {
  // This throws and triggers error.tsx
  throw new Error(
    categoriesResult.message || 'Failed to load categories'
  );
}
```

---

## Props Interface Definitions

### Complete TypeScript Interfaces

```typescript
// /types/menu.ts

export interface MenuPageSearchParams {
  category?: string;
  subcategory?: string;
  search?: string;
  page?: string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface MenuFilters {
  categoryId?: string;
  subCategoryId?: string;
  search?: string;
  page: number;
}

// Component Props

export interface MenuPageProps {
  searchParams: Promise<MenuPageSearchParams>;
}

export interface MenuPageClientProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  products: ProductResponse[];
  pagination: PaginationMeta;
  initialFilters: MenuFilters;
}

export interface CategorySidebarProps {
  categories: CategoryResponse[];
  subcategories: SubCategoryResponse[];
  activeCategory?: string;
  activeSubcategory?: string;
}

export interface CategoryAccordionProps {
  categories: CategoryResponse[];
  subcategoriesByCategory: Map<string, SubCategoryResponse[]>;
  activeCategory?: string;
  activeSubcategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  onSubcategorySelect?: (subcategoryId: string) => void;
  onClearFilters?: () => void;
}

export interface SubcategoryListProps {
  subcategories: SubCategoryResponse[];
  activeSubcategory?: string;
  onSelect?: (subcategoryId: string) => void;
}

export interface MobileFilterSheetProps {
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

export interface FilterTriggerProps {
  activeFilterCount: number;
  onClick: () => void;
}

export interface ActiveFiltersProps {
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

export interface ProductGridContainerProps {
  products: ProductResponse[];
  pagination: PaginationMeta;
  filters: MenuFilters;
}

export interface ProductGridProps {
  products: ProductResponse[];
}

export interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface MenuEmptyProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export interface MenuErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}
```

---

## File Structure

### Complete Directory Structure

```
/app/menu/
├── page.tsx                          # Server Component - Main page
├── loading.tsx                       # Suspense fallback
└── error.tsx                         # Error boundary

/components/menu/
├── menu-page-client.tsx              # Client - Root container
│
├── sidebar/
│   ├── category-sidebar.tsx         # Server - Category data provider
│   ├── category-accordion.tsx       # Client - Accordion UI
│   ├── subcategory-list.tsx         # Client - Subcategory items
│   ├── mobile-filter-sheet.tsx      # Client - Mobile drawer
│   ├── filter-trigger.tsx           # Client - FAB button
│   └── active-filters.tsx           # Client - Filter chips
│
├── product-grid/
│   ├── product-grid-container.tsx   # Server - Product data provider
│   ├── product-grid.tsx             # Client - Grid layout
│   └── product-pagination.tsx       # Client - Pagination controls
│
└── states/
    ├── menu-loading.tsx             # Loading skeleton (full page)
    ├── menu-error.tsx               # Error state (if needed separate from error.tsx)
    └── menu-empty.tsx               # Empty state

/hooks/
└── use-menu-navigation.ts           # URL navigation hook (Client)

/types/
└── menu.ts                          # Menu-specific type definitions

/lib/utils/
└── menu-utils.ts                    # Helper functions (buildQueryString, etc.)
```

---

## Implementation Patterns

### Pattern 1: Server Component Data Fetching

```typescript
// Always in async Server Components
async function ServerComponent() {
  const data = await fetchData();

  return <ClientComponent data={data} />;
}
```

### Pattern 2: URL Parameter Updates

```typescript
// Always in Client Components
'use client';

const { updateFilters } = useMenuNavigation();

const handleClick = () => {
  updateFilters({ category: 'newCategoryId' });
};
```

### Pattern 3: Prop Callbacks

```typescript
// Pass callbacks from Client parent to Client children
<SubcategoryList
  subcategories={items}
  onSelect={(id) => updateFilters({ subcategory: id })}
/>
```

### Pattern 4: Conditional Rendering

```typescript
// Empty state handling
if (products.length === 0) {
  return <MenuEmpty hasActiveFilters={hasFilters} />;
}

return <ProductGrid products={products} />;
```

### Pattern 5: Responsive Layout

```typescript
// Desktop/mobile split
<div className="hidden lg:flex gap-6">
  {/* Desktop layout */}
</div>

<div className="lg:hidden">
  {/* Mobile layout */}
</div>
```

### Pattern 6: Animation Variants

```typescript
// Framer Motion variants
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};
```

---

## Next Steps

This architecture document feeds into the implementation phase:

1. **Phase 3.1**: Implement Server Components (page.tsx, containers)
2. **Phase 3.2**: Implement Client Components (interactive elements)
3. **Phase 3.3**: Implement loading and error states
4. **Phase 3.4**: Integrate with existing ProductCard component
5. **Phase 4.1**: Add animations and micro-interactions
6. **Phase 5.1**: Accessibility audit
7. **Phase 5.2**: Performance optimization

---

**Document Version**: 1.0
**Last Updated**: 2025-12-01
**Status**: Architecture Design Complete - Ready for Implementation
