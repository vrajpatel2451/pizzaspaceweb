# Menu Section - Component Architecture

## Overview

The Menu Section is a feature-complete, production-ready component system for displaying product catalogs with category filtering and infinite scrolling pagination. It demonstrates best practices for Next.js 16 App Router architecture with optimal separation of Server and Client Components.

## Architecture Philosophy

### Design Principles

1. **Server-First Data Fetching**: Initial data loads server-side for optimal performance and SEO
2. **Client-Side Interactivity**: Category filtering and pagination handled client-side for responsive UX
3. **Clear Separation of Concerns**: Each component has a single, well-defined responsibility
4. **Progressive Enhancement**: Works without JavaScript, enhanced with client-side features
5. **Type Safety**: Strict TypeScript interfaces for all data structures
6. **Composition Over Configuration**: Components compose naturally without complex prop drilling

### Component Classification

#### Server Components
- **MenuSection** (`index.tsx`): Data fetching and initial render

#### Client Components
- **MenuContent** (`menu-content.tsx`): State management and coordination
- **MenuTabs** (`menu-tabs.tsx`): Interactive category filter
- **ProductGrid** (`product-grid.tsx`): Pagination state management

#### Presentational Components
- **ProductCard** (`product-card.tsx`): Pure display component
- **MenuSkeleton** (`menu-skeleton.tsx`): Loading state component

## Component Hierarchy & Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│ MenuSection (Server Component)                              │
│ - Fetches initial products & categories                     │
│ - Runs on server, no useState/useEffect                     │
└─────────────┬───────────────────────────────────────────────┘
              │
              │ Props: initialProducts, categories, initialMeta
              ↓
┌─────────────────────────────────────────────────────────────┐
│ MenuContent (Client Component)                              │
│ State: activeCategory, products, meta, loading              │
│ - Manages category filtering state                          │
│ - Refetches products when category changes                  │
│ - Coordinates child components                              │
└─────┬───────────────────────────────────┬───────────────────┘
      │                                   │
      │ Props: categories,                │ Props: products,
      │        activeCategory,            │        meta,
      │        onCategoryChange            │        categoryId
      ↓                                   ↓
┌─────────────────────┐           ┌─────────────────────────┐
│ MenuTabs            │           │ ProductGrid             │
│ (Client Component)  │           │ (Client Component)      │
│ - Renders tabs      │           │ State: products, meta   │
│ - Handles clicks    │           │ - Displays products     │
└─────────────────────┘           │ - Handles "Load More"   │
                                  └───────┬─────────────────┘
                                          │
                                          │ Props: product
                                          ↓
                                  ┌─────────────────────────┐
                                  │ ProductCard             │
                                  │ (Presentational)        │
                                  │ - Pure display          │
                                  │ - No state/logic        │
                                  └─────────────────────────┘
```

## Detailed Component Specifications

### 1. MenuSection (Server Component)

**File**: `index.tsx`

**Purpose**: Server-side data fetching and initial render

**Type**: Container Component (Server)

**Responsibilities**:
- Fetch initial products and categories from API
- Perform server-side data loading
- Pass data to client components
- Handle API errors at the server level (via Next.js error boundaries)

**Props**: None (root component)

**Return Type**: `Promise<JSX.Element>`

**Data Fetching**:
```typescript
const [productsRes, categoriesRes] = await Promise.all([
  getProducts({ limit: 8, page: 1 }),
  getCategories({ limit: 10 }),
]);
```

**Key Design Decisions**:
- Uses `Promise.all()` for parallel data fetching
- No try/catch around JSX to comply with React error boundaries
- Errors bubble up to Next.js error.tsx boundary
- Passes raw API response data to client components

**TypeScript Interface**:
```typescript
export async function MenuSection(): Promise<JSX.Element>
```

---

### 2. MenuContent (Client Component)

**File**: `menu-content.tsx`

**Purpose**: State management hub for filtering and product updates

**Type**: Container Component (Client)

**Responsibilities**:
- Manage active category state
- Fetch products when category changes
- Pass state and callbacks to child components
- Handle loading states during category changes
- Coordinate MenuTabs and ProductGrid

**Props**:
```typescript
interface MenuContentProps {
  initialProducts: ProductResponse[];
  categories: CategoryResponse[];
  initialMeta: PaginationMeta;
}
```

**State**:
```typescript
const [activeCategory, setActiveCategory] = useState<string>("all");
const [products, setProducts] = useState(initialProducts);
const [meta, setMeta] = useState(initialMeta);
const [loading, setLoading] = useState(false);
```

**Effects**:
- `useEffect` triggered on `activeCategory` change
- Fetches products via `/api/products` route
- Updates `products` and `meta` state

**Key Design Decisions**:
- Single source of truth for category state
- Replaces products array on category change (not append)
- Loading state prevents race conditions
- Error handling with console logging (could be enhanced with toast)

---

### 3. MenuTabs (Client Component)

**File**: `menu-tabs.tsx`

**Purpose**: Interactive category filter tabs

**Type**: UI Component (Client)

**Responsibilities**:
- Render "ALL" tab plus dynamic category tabs
- Handle tab clicks
- Apply active/inactive styling
- Support horizontal scrolling on mobile

**Props**:
```typescript
interface MenuTabsProps {
  categories: CategoryResponse[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}
```

**Styling Logic**:
```typescript
activeCategory === "all"
  ? "bg-orange-500 text-white shadow-md"
  : "border-2 border-slate-800 text-slate-800 hover:bg-slate-50"
```

**Key Design Decisions**:
- Controlled component (parent owns state)
- Uses callback pattern for state updates
- All uppercase text for visual consistency
- Pill-shaped buttons with rounded-full
- Flex-wrap for responsive layout

**Accessibility**:
- Uses semantic `<button>` elements
- Clear focus states
- Keyboard navigable

---

### 4. ProductGrid (Client Component)

**File**: `product-grid.tsx`

**Purpose**: Display products in grid with pagination

**Type**: Container Component (Client)

**Responsibilities**:
- Display products in responsive grid
- Manage "Load More" pagination
- Handle loading states
- Append new products to existing list
- Show empty state when no products

**Props**:
```typescript
interface ProductGridProps {
  initialProducts: ProductResponse[];
  initialMeta: PaginationMeta;
  categoryId?: string;
}
```

**State**:
```typescript
const [products, setProducts] = useState(initialProducts);
const [meta, setMeta] = useState(initialMeta);
const [loading, setLoading] = useState(false);
```

**Pagination Logic**:
```typescript
const loadMore = async () => {
  if (!meta.hasNextPage || loading) return;

  // Fetch next page
  const res = await fetch(`/api/products?page=${meta.currentPage + 1}...`);

  // Append new products
  setProducts((prev) => [...prev, ...data.data.data]);
  setMeta(data.data.meta);
};
```

**Key Design Decisions**:
- Separate state from parent (MenuContent)
- Appends products on "Load More" (not replace)
- Guards against multiple simultaneous requests
- Passes `categoryId` to API for filtered pagination
- Shows skeleton during loading
- Hides button when no more pages

**Grid Responsive Classes**:
```
grid-cols-1        // Mobile: 1 column
md:grid-cols-2     // Tablet: 2 columns
lg:grid-cols-4     // Desktop: 4 columns
gap-6              // Consistent spacing
```

---

### 5. ProductCard (Presentational Component)

**File**: `product-card.tsx`

**Purpose**: Display individual product

**Type**: UI Component (Presentational)

**Responsibilities**:
- Render product image, name, description, price
- Apply hover effects
- Handle missing images gracefully

**Props**:
```typescript
interface ProductCardProps {
  product: ProductResponse;
}
```

**Layout Structure**:
```
┌──────────────────────┐
│   Circular Image     │ 128x128px
│   (Dark bg)          │
├──────────────────────┤
│   Product Name       │ Bold, slate-900
├──────────────────────┤
│   Description        │ 2-line clamp, gray-500
├──────────────────────┤
│   $Price             │ Orange, bold
└──────────────────────┘
```

**Key Design Decisions**:
- Pure presentational component (no state)
- Uses Next.js Image for optimization
- Circular image with dark background for visual consistency
- Line-clamp-2 prevents layout shift
- Min-height on description for alignment
- Fallback to placeholder image
- Hover shadow for interactivity feedback

**Styling Details**:
- Image: `rounded-full overflow-hidden bg-slate-800`
- Hover: `hover:shadow-lg transition-shadow duration-300`
- Price formatting: `toFixed(2)` for consistent decimals

---

### 6. MenuSkeleton (Presentational Component)

**File**: `menu-skeleton.tsx`

**Purpose**: Loading state placeholder

**Type**: UI Component (Presentational)

**Responsibilities**:
- Show loading skeleton matching ProductCard layout
- Provide visual feedback during data fetching
- Prevent layout shift

**Props**: None

**Key Design Decisions**:
- Renders 8 skeleton cards (matches initial page size)
- Pulse animation for loading feedback
- Matches ProductCard dimensions exactly
- Gray-200 background for subtle appearance
- No state or logic

**Animation**:
```typescript
className="animate-pulse"
```

---

## Data Flow Patterns

### Initial Server-Side Render (SSR)

```
1. User requests page
2. Next.js renders MenuSection on server
3. MenuSection fetches products & categories
4. Server renders HTML with initial data
5. HTML sent to browser
6. Client hydrates with initial data
7. MenuContent becomes interactive
```

### Category Filter Flow

```
1. User clicks category tab
2. MenuTabs calls onCategoryChange(categoryId)
3. MenuContent updates activeCategory state
4. useEffect triggers on activeCategory change
5. Fetch products from /api/products?categoryId=X
6. Update products and meta state
7. ProductGrid receives new products
8. Re-render with filtered products
```

### Load More Pagination Flow

```
1. User clicks "Load More" button
2. ProductGrid checks meta.hasNextPage
3. Set loading state to true
4. Fetch next page from /api/products?page=X
5. Append new products to existing array
6. Update meta with new pagination data
7. Set loading state to false
8. Hide button if no more pages
```

## State Management Strategy

### Why No Global State?

This component uses local React state because:
1. State is localized to this feature
2. No other components need this data
3. Avoids unnecessary complexity
4. Easier to test and maintain
5. Better performance (no global re-renders)

### State Ownership

| State | Owner | Why |
|-------|-------|-----|
| activeCategory | MenuContent | Needs to coordinate both tabs and grid |
| products (filter) | MenuContent | Updated on category change |
| meta (filter) | MenuContent | Updated with products |
| products (pagination) | ProductGrid | Independent pagination state |
| meta (pagination) | ProductGrid | Manages "Load More" |

### Key Insight: Two Product States

**MenuContent** manages products for filtering:
- Replaces entire array on category change
- Resets to page 1

**ProductGrid** manages products for pagination:
- Appends to array on "Load More"
- Maintains current page

This separation allows independent concerns:
- Filtering resets pagination
- Pagination doesn't affect filter

## API Integration Architecture

### Server-Side API Calls

**Location**: `index.tsx` (MenuSection)

**Function**: `getProducts()` from `@/lib/api`

**Characteristics**:
- Runs on Node.js server
- Can access environment variables
- Direct API calls (no /api route)
- Better performance (no extra hop)
- SEO-friendly (data in initial HTML)

### Client-Side API Calls

**Location**: `menu-content.tsx`, `product-grid.tsx`

**Endpoint**: `/api/products` (Next.js API route)

**Characteristics**:
- Runs in browser
- Uses fetch() to call Next.js API route
- API route proxies to backend
- Supports client-side filtering/pagination

### API Route Structure

**File**: `app/api/products/route.ts`

```typescript
export async function GET(request: NextRequest) {
  // Parse query params
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const categoryId = searchParams.get("categoryId") || undefined;

  // Call backend service
  const response = await getProducts({ page, limit, categoryId });

  // Return JSON
  return NextResponse.json(response);
}
```

**Why API Route?**
- Keeps API keys secure on server
- Provides consistent interface
- Can add caching/rate limiting
- Works across client/server boundary

## TypeScript Type System

### Type Hierarchy

```
APIResponse<T>
├── PaginatedResponse<T>
│   ├── data: T[]
│   └── meta: PaginationMeta
└── statusCode: number

ProductResponse
├── _id: string
├── name: string
├── description: string
├── photoList: string[]
├── basePrice: number
└── ... (30+ fields)

CategoryResponse
├── _id: string
├── name: string
├── imageUrl: string
└── sortOrder: number
```

### Type Safety Benefits

1. **Compile-time errors**: Catch bugs before runtime
2. **IntelliSense**: IDE autocomplete for all props
3. **Refactoring safety**: Rename fields confidently
4. **Documentation**: Types serve as inline docs
5. **Contract enforcement**: API matches expectations

### Generic Types Usage

```typescript
// API service returns generic response
function getProducts(): Promise<APIResponse<PaginatedResponse<ProductResponse>>>

// Component props use specific types
interface ProductCardProps {
  product: ProductResponse;
}
```

## Performance Optimizations

### 1. Server-Side Rendering (SSR)
- Initial data loads on server
- HTML includes products (no loading state)
- Better for SEO and perceived performance

### 2. Parallel Data Fetching
```typescript
await Promise.all([getProducts(), getCategories()])
```
- Fetches both datasets simultaneously
- Reduces total loading time

### 3. Pagination (Not Infinite Scroll)
- Only loads 8 products at a time
- User controls when to load more
- Reduces initial payload

### 4. Next.js Image Optimization
```typescript
<Image src={url} fill className="object-cover" sizes="128px" />
```
- Automatic image optimization
- Lazy loading by default
- Responsive images
- WebP format when supported

### 5. Optimistic UI Updates
- Category tab becomes active immediately
- Products update after fetch completes
- Loading skeleton provides feedback

### 6. Request Deduplication
- `loading` state prevents duplicate requests
- Disables "Load More" during fetch
- Guards in `loadMore()` function

## Styling Architecture

### Design System Integration

**Primary Colors**:
- Orange: `#f97316` (Tailwind orange-500) - Primary CTA
- Navy: `#1e293b` (Tailwind slate-800) - Text/Borders
- Gray: `#6b7280` (Tailwind gray-500) - Secondary text
- White: `#ffffff` - Backgrounds

**Typography Scale**:
- Heading: `text-3xl font-bold` (30px)
- Product Name: `font-semibold` (14px)
- Description: `text-sm` (12px)
- Price: `text-lg font-bold` (18px)

### Responsive Design Strategy

**Mobile-First Approach**:
```css
/* Base: Mobile */
.grid { grid-template-columns: 1fr; }

/* Tablet */
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(4, 1fr); }
}
```

**Container Width**:
- Mobile: Full width minus padding
- Desktop: Max 1280px centered

### Animation & Transitions

**Hover Effects**:
```typescript
className="hover:shadow-lg transition-shadow duration-300"
```

**Loading States**:
```typescript
className="animate-pulse"
```

**Button Active State**:
```typescript
className="transition-all duration-200"
```

## Error Handling Strategy

### Server Component Errors

Next.js error boundaries catch errors in MenuSection:
- Create `app/error.tsx` for custom error UI
- Errors during data fetching trigger error boundary
- User sees fallback UI with retry option

### Client Component Errors

**Console Logging**:
```typescript
catch (error) {
  console.error("Error loading products:", error);
}
```

**Graceful Degradation**:
- Empty state message when no products
- Loading button disabled during fetch
- UI remains functional despite errors

### Potential Enhancements

1. **Toast Notifications**: Show error messages to user
2. **Retry Logic**: Automatic retry with exponential backoff
3. **Error Boundary**: Wrap client components
4. **Fallback Data**: Show cached data on error
5. **Network Detection**: Warn user when offline

## Testing Strategy

### Unit Tests

**ProductCard.test.tsx**:
```typescript
test("renders product name and price", () => {
  render(<ProductCard product={mockProduct} />);
  expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  expect(screen.getByText(`$${mockProduct.basePrice}`)).toBeInTheDocument();
});
```

**MenuTabs.test.tsx**:
```typescript
test("calls onCategoryChange when tab clicked", () => {
  const handleChange = jest.fn();
  render(<MenuTabs categories={mockCategories} activeCategory="all" onCategoryChange={handleChange} />);
  fireEvent.click(screen.getByText("PIZZA"));
  expect(handleChange).toHaveBeenCalledWith("pizza-id");
});
```

### Integration Tests

**MenuContent.test.tsx**:
```typescript
test("updates products when category changes", async () => {
  render(<MenuContent {...mockProps} />);

  fireEvent.click(screen.getByText("PIZZA"));

  await waitFor(() => {
    expect(screen.getByText("Pizza Product 1")).toBeInTheDocument();
  });
});
```

### E2E Tests

**Playwright/Cypress**:
```typescript
test("can filter and paginate products", async () => {
  await page.goto("/menu-demo");

  // Filter by category
  await page.click('button:has-text("PIZZA")');
  await page.waitForSelector('[data-testid="product-card"]');

  // Load more
  await page.click('button:has-text("Load More")');

  // Verify more products loaded
  const products = await page.$$('[data-testid="product-card"]');
  expect(products.length).toBeGreaterThan(8);
});
```

## Accessibility (a11y)

### Semantic HTML
- Uses `<section>` for main container
- `<button>` for interactive elements
- `<h2>` for section heading

### Keyboard Navigation
- All tabs keyboard accessible
- "Load More" button focusable
- Focus styles visible

### Screen Readers
- Alt text on all images
- Clear button labels
- Semantic heading structure

### Potential Improvements
1. Add ARIA labels to tabs
2. Announce loading states
3. Skip link to main content
4. Focus management after category change

## Future Enhancements

### Phase 2 Features
1. **Search Bar**: Filter products by name/description
2. **Sort Options**: Price, popularity, newest
3. **Quick View Modal**: Product details without navigation
4. **Add to Cart**: Direct from product card
5. **Wishlist**: Save favorite products

### Advanced Features
1. **Infinite Scroll**: Alternative to "Load More"
2. **URL State**: Persist category in URL params
3. **Caching**: Cache products with SWR or React Query
4. **Optimistic Updates**: Show product in cart immediately
5. **Animations**: Framer Motion for page transitions

### Performance Optimizations
1. **Virtual Scrolling**: For very long product lists
2. **Image Preloading**: Preload next page images
3. **Service Worker**: Offline support
4. **Edge Caching**: Cache product data at CDN
5. **Partial Prerendering**: Mix static and dynamic content

## Key Takeaways

### Architecture Decisions

1. **Server Components First**: Default to server components, add "use client" only when needed
2. **Props Down, Events Up**: Data flows down, callbacks flow up
3. **Separation of Concerns**: Each component has one job
4. **Composition > Configuration**: Build complex UIs from simple components
5. **Type Safety**: TypeScript ensures correctness

### Best Practices Demonstrated

- Server-side data fetching for initial load
- Client-side state management for interactivity
- Progressive enhancement
- Loading states and empty states
- Error boundaries
- Responsive design
- TypeScript strict mode
- Clean component hierarchy

### Scalability Considerations

This architecture scales well because:
- Components are independent and reusable
- State is localized (no global store pollution)
- Easy to add new features (search, sort, filters)
- Performance stays constant with more categories
- Type safety prevents regressions
- Clear patterns for new developers

---

**Document Version**: 1.0
**Last Updated**: 2025-11-27
**Author**: Component Architecture Specialist
