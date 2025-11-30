# Menu Section - Component Architecture

## Overview
The Menu Section follows a hybrid rendering approach with Server Components for initial SEO-optimized data fetching and Client Components for interactive features.

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────┐
│ MenuSection (Server Component) - ASYNC             │
│                                                     │
│ ✓ Fetches categories via getCategories()           │
│ ✓ Fetches products via getProducts()               │
│ ✓ Server-side rendered for SEO                     │
│ ✓ Initial HTML includes all menu items             │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ passes: initialProducts, categories, initialMeta
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ MenuContent (Client Component) - "use client"       │
│                                                     │
│ ✓ Manages active category state                    │
│ ✓ Handles category switching                       │
│ ✓ Fetches filtered products on category change     │
│ ✓ Shows loading skeleton during transitions        │
└──────────────────┬──────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────────┐  ┌──────────────────────────────┐
│ MenuTabs         │  │ ProductGrid                  │
│ (Client)         │  │ (Client)                     │
│                  │  │                              │
│ ✓ Tab UI         │  │ ✓ Product cards grid         │
│ ✓ Active state   │  │ ✓ Load more button           │
│ ✓ Indicator      │  │ ✓ Animation variants         │
│ ✓ Keyboard nav   │  │ ✓ Empty state                │
└──────────────────┘  └──────────┬───────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ ProductCard     │
                        │ (Client)        │
                        │                 │
                        │ ✓ Card UI       │
                        │ ✓ Image         │
                        │ ✓ Price         │
                        │ ✓ Description   │
                        └─────────────────┘
```

---

## Data Flow

### Initial Server-Side Render (SSR)
```
1. Page Request
   ↓
2. MenuSection (Server Component)
   ↓
3. Promise.all([getCategories(), getProducts()])
   ↓
4. Render with initial data
   ↓
5. Send HTML to browser (includes all products for SEO)
```

### Client-Side Category Filtering
```
1. User clicks category tab
   ↓
2. MenuTabs calls onCategoryChange()
   ↓
3. MenuContent updates activeCategory state
   ↓
4. useEffect triggers fetchProducts(categoryId)
   ↓
5. Fetch /api/products?categoryId=xxx
   ↓
6. Update products state
   ↓
7. ProductGrid re-renders with new products
```

### Load More Flow
```
1. User clicks "Load More" button
   ↓
2. ProductGrid checks meta.hasNextPage
   ↓
3. Fetch /api/products?page=N&categoryId=xxx
   ↓
4. Append to existing products array
   ↓
5. Update meta with new pagination info
```

---

## API Integration

### Categories API
```typescript
// Server Component
const categoriesRes = await getCategories({ limit: 10 });
const categories = categoriesRes.data.data;
// → [{_id: "xxx", name: "Pizza"}, ...]
```

### Products API
```typescript
// Server Component - Initial Load
const productsRes = await getProducts({ limit: 8, page: 1 });
const products = productsRes.data.data;
const meta = productsRes.data.meta;

// Client Component - Category Filter
const res = await fetch(`/api/products?categoryId=${id}&limit=8&page=1`);
const data = await res.json();

// Client Component - Load More
const res = await fetch(`/api/products?categoryId=${id}&limit=8&page=${N}`);
```

---

## State Management

### Server State
- **Location:** MenuSection component
- **Data:** Initial categories and products
- **Lifecycle:** Fetched once per page load

### Client State
```typescript
// MenuContent
const [activeCategory, setActiveCategory] = useState<string>("all");
const [products, setProducts] = useState(initialProducts);
const [meta, setMeta] = useState(initialMeta);
const [loading, setLoading] = useState(false);

// ProductGrid
const [products, setProducts] = useState(initialProducts);
const [meta, setMeta] = useState(initialMeta);
const [loading, setLoading] = useState(false);

// MenuTabs
const [activeTabRect, setActiveTabRect] = useState<DOMRect | null>(null);
const [containerRect, setContainerRect] = useState<DOMRect | null>(null);
```

---

## Key Features

### 1. Tab Navigation
- **Component:** MenuTabs
- **Features:**
  - Animated background indicator
  - Keyboard navigation (Arrow keys, Home, End)
  - Mobile-friendly scrollable tabs
  - Desktop-friendly flexbox wrap
  - Smooth spring animations
  - ARIA attributes for accessibility

### 2. Product Grid
- **Component:** ProductGrid
- **Features:**
  - Responsive grid (1 col → 2 cols → 4 cols)
  - Staggered fade-in animations
  - Load more pagination
  - Empty state handling
  - Smooth transitions between categories

### 3. Category Filtering
- **Component:** MenuContent
- **Features:**
  - Client-side filtering with loading state
  - Skeleton loading during fetch
  - Skip initial fetch (uses server data)
  - Error handling with console logging

---

## SEO Optimizations

1. **Server-Side Rendering**
   - All products rendered in initial HTML
   - No client-side JavaScript required for content
   - Fast First Contentful Paint (FCP)

2. **Semantic HTML**
   - `<section>` with `aria-labelledby`
   - `<h2>` with proper heading hierarchy
   - `role="tablist"` and `role="tab"` for tabs
   - `role="tabpanel"` for content area

3. **Structured Data**
   - Product cards in initial HTML
   - Proper heading structure
   - Accessible navigation

4. **Performance**
   - Server-side API calls (no client waterfalls)
   - Progressive enhancement
   - Lazy loading for additional products

---

## CSS Positioning Fix

### Issue
Active tab indicator was using `x` transform which caused misalignment when tabs wrapped on smaller screens.

### Solution
Changed to absolute positioning with `left` property:
```typescript
// Before
animate={{ x: activeTabRect.left - containerRect.left }}
style={{ top: activeTabRect.top - containerRect.top }}

// After
animate={{
  left: activeTabRect.left - containerRect.left,
  top: activeTabRect.top - containerRect.top,
}}
```

### Benefits
- Accurate positioning on all screen sizes
- Proper alignment when tabs wrap
- Smooth spring animations
- No transform conflicts

---

## Removed Features

1. **Mock Data Fallback**
   - ❌ No fallback to getMockProducts/getMockCategories
   - ✓ Pure API-driven data
   - ✓ Errors propagate naturally

2. **Dish Count Display**
   - ❌ No "Showing X of Y dishes" text
   - ✓ Cleaner UI
   - ✓ Focus on content

---

## Testing Checklist

- [ ] Categories load from API
- [ ] Products load from API
- [ ] Tab switching works smoothly
- [ ] Active tab indicator positions correctly
- [ ] Load more button works
- [ ] Empty state displays when no products
- [ ] Mobile view: tabs scroll horizontally
- [ ] Desktop view: tabs wrap and center
- [ ] Keyboard navigation works (arrow keys)
- [ ] Page source shows products (SEO)
- [ ] No mock data in code
- [ ] No dish count displayed
- [ ] Animations are smooth
- [ ] Dark mode works correctly
