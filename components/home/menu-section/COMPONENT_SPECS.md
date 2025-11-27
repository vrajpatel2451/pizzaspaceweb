# Menu Section - Component Specifications

Quick reference guide for all components in the Menu Section.

## File Structure

```
components/home/menu-section/
├── index.tsx              # MenuSection - Server Component (entry point)
├── menu-content.tsx       # MenuContent - Client Component (state hub)
├── menu-tabs.tsx          # MenuTabs - Client Component (category filter)
├── product-grid.tsx       # ProductGrid - Client Component (pagination)
├── product-card.tsx       # ProductCard - Presentational Component
├── menu-skeleton.tsx      # MenuSkeleton - Loading state
├── README.md              # Usage documentation
├── ARCHITECTURE.md        # Detailed architecture documentation
└── COMPONENT_SPECS.md     # This file - Quick reference
```

## Component Quick Reference

### 1. MenuSection

```typescript
// File: index.tsx
export async function MenuSection(): Promise<JSX.Element>
```

**Type**: Server Component
**Purpose**: Initial data fetching
**Props**: None
**Returns**: JSX with MenuContent

**Usage**:
```tsx
import { MenuSection } from '@/components/home/menu-section';

export default function Page() {
  return <MenuSection />;
}
```

---

### 2. MenuContent

```typescript
// File: menu-content.tsx
"use client"

interface MenuContentProps {
  initialProducts: ProductResponse[];
  categories: CategoryResponse[];
  initialMeta: PaginationMeta;
}

export function MenuContent(props: MenuContentProps): JSX.Element
```

**Type**: Client Component
**Purpose**: State management for filtering
**State**: activeCategory, products, meta, loading
**Children**: MenuTabs, ProductGrid

---

### 3. MenuTabs

```typescript
// File: menu-tabs.tsx
"use client"

interface MenuTabsProps {
  categories: CategoryResponse[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function MenuTabs(props: MenuTabsProps): JSX.Element
```

**Type**: Client Component
**Purpose**: Category filter tabs
**Interactive**: Yes (button clicks)
**Styling**: Orange pill (active) / Navy border (inactive)

---

### 4. ProductGrid

```typescript
// File: product-grid.tsx
"use client"

interface ProductGridProps {
  initialProducts: ProductResponse[];
  initialMeta: PaginationMeta;
  categoryId?: string;
}

export function ProductGrid(props: ProductGridProps): JSX.Element
```

**Type**: Client Component
**Purpose**: Display products with pagination
**State**: products, meta, loading
**Features**: "Load More" button, empty state
**Grid**: 1 col (mobile), 2 cols (tablet), 4 cols (desktop)

---

### 5. ProductCard

```typescript
// File: product-card.tsx

interface ProductCardProps {
  product: ProductResponse;
}

export function ProductCard(props: ProductCardProps): JSX.Element
```

**Type**: Presentational Component
**Purpose**: Display single product
**State**: None
**Layout**: Circular image, name, description, price

---

### 6. MenuSkeleton

```typescript
// File: menu-skeleton.tsx

export function MenuSkeleton(): JSX.Element
```

**Type**: Presentational Component
**Purpose**: Loading state placeholder
**State**: None
**Features**: 8 skeleton cards with pulse animation

---

## Data Flow Diagram

```
Server Request
      ↓
[MenuSection] ← getProducts() + getCategories()
      ↓
   SSR HTML
      ↓
Client Hydration
      ↓
[MenuContent] ← { initialProducts, categories, initialMeta }
      ↓
      ├──→ [MenuTabs] ← { categories, activeCategory, onCategoryChange }
      │         ↓
      │    User clicks tab
      │         ↓
      │    onCategoryChange("pizza-id")
      │         ↓
      └────────┘
      ↓
Fetch /api/products?categoryId=pizza-id
      ↓
Update products state
      ↓
[ProductGrid] ← { products, meta, categoryId }
      ↓
      ├──→ [ProductCard] ← { product }
      ├──→ [ProductCard] ← { product }
      ├──→ [ProductCard] ← { product }
      └──→ [ProductCard] ← { product }
      ↓
User clicks "Load More"
      ↓
Fetch /api/products?page=2&categoryId=pizza-id
      ↓
Append to products array
      ↓
Re-render with more ProductCards
```

---

## API Integration

### Server-Side

```typescript
// In MenuSection (index.tsx)
import { getProducts, getCategories } from '@/lib/api';

const [productsRes, categoriesRes] = await Promise.all([
  getProducts({ limit: 8, page: 1 }),
  getCategories({ limit: 10 }),
]);
```

**Characteristics**:
- Runs on Node.js server
- Direct API calls (no /api route)
- Returns APIResponse<PaginatedResponse<T>>

### Client-Side

```typescript
// In MenuContent and ProductGrid
const res = await fetch('/api/products?page=1&categoryId=abc');
const data = await res.json();
```

**API Route**: `/app/api/products/route.ts`

**Query Parameters**:
- `page`: number (default: 1)
- `limit`: number (default: 8)
- `categoryId`: string (optional)
- `search`: string (optional)
- `storeId`: string (optional)

---

## TypeScript Interfaces

### ProductResponse

```typescript
interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  type: "veg" | "non_veg" | "vegan";
  photoList: string[];
  category: string;
  basePrice: number;
  // ... 20+ more fields
}
```

### CategoryResponse

```typescript
interface CategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
  storeIds: string[];
  createdAt: string;
  updatedAt: string;
}
```

### PaginationMeta

```typescript
interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
```

### APIResponse

```typescript
interface APIResponse<T> {
  statusCode: number;
  data: T;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
```

---

## Styling Reference

### Color Palette

| Color | Tailwind Class | Hex | Usage |
|-------|---------------|-----|-------|
| Orange | `orange-500` | `#f97316` | Active tabs, prices |
| Navy | `slate-800` | `#1e293b` | Text, borders |
| Gray | `gray-500` | `#6b7280` | Secondary text |
| Dark Gray | `slate-900` | `#0f172a` | Headings |
| White | `white` | `#ffffff` | Backgrounds |
| Light Gray | `slate-200` | `#e2e8f0` | Skeletons |

### Typography Scale

| Element | Classes | Size |
|---------|---------|------|
| Section Title | `text-3xl font-bold` | 30px |
| Product Name | `font-semibold` | 14px |
| Description | `text-sm` | 12px |
| Price | `text-lg font-bold` | 18px |
| Button | `text-sm font-semibold` | 14px |

### Spacing

| Element | Classes | Value |
|---------|---------|-------|
| Section Padding | `py-16` | 4rem (64px) |
| Container Padding | `px-4` | 1rem (16px) |
| Grid Gap | `gap-6` | 1.5rem (24px) |
| Card Padding | `p-4` | 1rem (16px) |
| Button Padding | `px-6 py-2` | 1.5rem x 0.5rem |

### Responsive Breakpoints

| Breakpoint | Tailwind | Min Width | Grid Columns |
|------------|----------|-----------|--------------|
| Mobile | Base | 0px | 1 |
| Tablet | `md:` | 768px | 2 |
| Desktop | `lg:` | 1024px | 4 |

---

## State Management Map

| Component | State Variables | Purpose |
|-----------|----------------|---------|
| MenuContent | `activeCategory: string` | Currently selected category |
| MenuContent | `products: ProductResponse[]` | Filtered products |
| MenuContent | `meta: PaginationMeta` | Pagination for filtered products |
| MenuContent | `loading: boolean` | Category change loading |
| ProductGrid | `products: ProductResponse[]` | Products with pagination |
| ProductGrid | `meta: PaginationMeta` | Current page metadata |
| ProductGrid | `loading: boolean` | Load more loading |

**Why Two Product States?**
- MenuContent replaces products on category change
- ProductGrid appends products on pagination
- Keeps concerns separated

---

## Common Patterns

### Pattern 1: Server-to-Client Data Passing

```typescript
// Server Component
async function ServerComponent() {
  const data = await fetchData();
  return <ClientComponent initialData={data} />;
}

// Client Component
"use client"
function ClientComponent({ initialData }) {
  const [data, setData] = useState(initialData);
  // ...
}
```

### Pattern 2: Controlled Component

```typescript
// Parent
function Parent() {
  const [value, setValue] = useState("default");
  return <Child value={value} onChange={setValue} />;
}

// Child
function Child({ value, onChange }) {
  return <button onClick={() => onChange("new")}>Click</button>;
}
```

### Pattern 3: Pagination with Append

```typescript
const [items, setItems] = useState(initialItems);
const [page, setPage] = useState(1);

const loadMore = async () => {
  const newItems = await fetch(`/api?page=${page + 1}`);
  setItems(prev => [...prev, ...newItems]); // Append
  setPage(prev => prev + 1);
};
```

### Pattern 4: Loading Guards

```typescript
const [loading, setLoading] = useState(false);

const doAction = async () => {
  if (loading) return; // Guard

  setLoading(true);
  try {
    await fetch(...);
  } finally {
    setLoading(false);
  }
};
```

---

## Testing Checklist

### Unit Tests
- [ ] ProductCard renders all product fields
- [ ] ProductCard handles missing image
- [ ] MenuTabs renders all categories
- [ ] MenuTabs calls onCategoryChange
- [ ] MenuSkeleton renders 8 cards

### Integration Tests
- [ ] MenuContent fetches products on category change
- [ ] MenuContent updates ProductGrid props
- [ ] ProductGrid appends products on load more
- [ ] ProductGrid hides button when no more pages

### E2E Tests
- [ ] Can filter by category
- [ ] Can load more products
- [ ] Categories highlight when active
- [ ] Empty state shows when no products
- [ ] Loading states appear during fetch

---

## Troubleshooting

### Products not loading

**Check**:
1. API base URL in `lib/api/client.ts`
2. Network tab for failed requests
3. Console for error messages
4. API route at `/app/api/products/route.ts`

### Category filter not working

**Check**:
1. `categoryId` passed to ProductGrid
2. `activeCategory` state in MenuContent
3. API route handles `categoryId` param
4. Backend API supports filtering

### Load More not working

**Check**:
1. `meta.hasNextPage` value
2. `loading` state blocks duplicate requests
3. API route handles `page` param
4. Products array appending correctly

### Images not showing

**Check**:
1. `photoList[0]` exists on product
2. Image URL is valid
3. CORS headers if external images
4. Next.js Image component configured
5. Fallback to placeholder image

---

## Performance Metrics

### Target Metrics
- **Initial Load**: < 2s (3G)
- **Category Switch**: < 500ms
- **Load More**: < 500ms
- **LCP**: < 2.5s
- **FID**: < 100ms
- **CLS**: < 0.1

### Optimization Checklist
- [x] Server-side rendering
- [x] Parallel data fetching
- [x] Image optimization
- [x] Pagination (not all at once)
- [x] Loading states
- [x] Request guards
- [ ] Edge caching (future)
- [ ] Prefetching (future)

---

## Security Considerations

### Server Components
- API keys stay on server
- No client-side secrets
- Direct backend access

### Client Components
- Use /api routes for fetching
- Validate user input
- Sanitize data before display

### API Routes
- Rate limiting (future)
- Authentication (if needed)
- Input validation
- Error handling

---

## Accessibility Checklist

- [x] Semantic HTML (`<section>`, `<button>`)
- [x] Keyboard navigation
- [x] Alt text on images
- [x] Clear button labels
- [ ] ARIA labels (enhancement)
- [ ] Focus management (enhancement)
- [ ] Screen reader announcements (enhancement)

---

## Browser Support

### Tested Browsers
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

### Required Features
- ES2020+ JavaScript
- CSS Grid
- Flexbox
- Fetch API
- Async/Await

---

## Deployment Notes

### Environment Variables
None required for this component (API base URL in code)

### Build Considerations
- Runs on Next.js 16+
- Requires React 19+
- TypeScript strict mode
- Tailwind CSS 4

### Server Requirements
- Node.js 18+
- Backend API accessible
- Image CDN (if external images)

---

**Quick Links**:
- [README.md](./README.md) - Usage guide
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture
- [Demo](../../../app/menu-demo/page.tsx) - Live demo page

**Version**: 1.0
**Last Updated**: 2025-11-27
