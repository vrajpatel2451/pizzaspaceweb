# Menu Section Component

A full-featured menu section with category filtering, product grid, and pagination for the Pizza Space application.

## Architecture Overview

This menu section follows Next.js 16 best practices with a clear separation between Server and Client Components:

### Component Hierarchy

```
MenuSection (Server Component - index.tsx)
└── MenuContent (Client Component - menu-content.tsx)
    ├── MenuTabs (Client Component - menu-tabs.tsx)
    └── ProductGrid (Client Component - product-grid.tsx)
        └── ProductCard (Presentational Component - product-card.tsx)
```

## Component Files

### 1. `index.tsx` - MenuSection (Server Component)
**Purpose**: Entry point that fetches initial data server-side

**Responsibilities**:
- Fetch initial products and categories from API
- Handle server-side errors gracefully
- Pass data to client components

**Usage**:
```tsx
import { MenuSection } from '@/components/home/menu-section';

export default function HomePage() {
  return (
    <main>
      <MenuSection />
    </main>
  );
}
```

### 2. `menu-content.tsx` - MenuContent (Client Component)
**Purpose**: Manages category filtering state and product refetching

**Props**:
```typescript
interface MenuContentProps {
  initialProducts: ProductResponse[];
  categories: CategoryResponse[];
  initialMeta: PaginationMeta;
}
```

**Responsibilities**:
- Manage active category state
- Fetch products when category changes
- Coordinate between MenuTabs and ProductGrid
- Handle loading states

### 3. `menu-tabs.tsx` - MenuTabs (Client Component)
**Purpose**: Category filter tabs

**Props**:
```typescript
interface MenuTabsProps {
  categories: CategoryResponse[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}
```

**Features**:
- "ALL" tab for showing all products
- Dynamic category tabs from API
- Active state styling (orange pill for active, bordered for inactive)
- Responsive horizontal scrolling on mobile

**Styling**:
- Active: `bg-orange-500 text-white shadow-md`
- Inactive: `border-2 border-slate-800 text-slate-800 hover:bg-slate-50`

### 4. `product-grid.tsx` - ProductGrid (Client Component)
**Purpose**: Display products in grid with pagination

**Props**:
```typescript
interface ProductGridProps {
  initialProducts: ProductResponse[];
  initialMeta: PaginationMeta;
  categoryId?: string;
}
```

**Features**:
- 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- "Load More" button for pagination
- Loading state with skeleton
- Empty state handling
- Appends new products when loading more

**Grid Classes**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`

### 5. `product-card.tsx` - ProductCard (Presentational Component)
**Purpose**: Display individual product

**Props**:
```typescript
interface ProductCardProps {
  product: ProductResponse;
}
```

**Layout**:
- Circular product image (128px x 128px) with dark background
- Product name (bold, centered)
- Description (2-line clamp, gray)
- Price (orange, bold)
- Hover shadow effect

### 6. `menu-skeleton.tsx` - MenuSkeleton (Presentational Component)
**Purpose**: Loading skeleton for product grid

**Features**:
- Shows 8 skeleton cards
- Pulse animation
- Matches ProductCard layout

## API Integration

### Server-Side (Initial Load)
The `MenuSection` component uses server-side data fetching:

```tsx
const [productsRes, categoriesRes] = await Promise.all([
  getProducts({ limit: 8, page: 1 }),
  getCategories({ limit: 10 }),
]);
```

### Client-Side (Filtering & Pagination)
Client components use the Next.js API route at `/api/products`:

```tsx
const res = await fetch(`/api/products?page=2&categoryId=123&limit=8`);
```

**API Route**: `app/api/products/route.ts`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 8)
- `categoryId` - Filter by category (optional)
- `search` - Search query (optional)
- `storeId` - Filter by store (optional)

## Type Definitions

All types are imported from `@/types`:

```typescript
import {
  ProductResponse,
  CategoryResponse,
  PaginationMeta,
} from "@/types";
```

### ProductResponse
```typescript
interface ProductResponse {
  _id: string;
  name: string;
  description: string;
  type: ProductType; // "veg" | "non_veg" | "vegan"
  photoList: string[];
  category: string;
  basePrice: number;
  // ... other fields
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

## Styling

### Color Scheme
- Background: `bg-white`
- Primary text: `text-slate-900`
- Secondary text: `text-gray-500`
- Accent: `text-orange-500` / `bg-orange-500`
- Border: `border-slate-800`

### Responsive Breakpoints
- Mobile: `< 768px` (1 column)
- Tablet: `>= 768px` (2 columns)
- Desktop: `>= 1024px` (4 columns)

## Error Handling

### Server Component Errors
The MenuSection catches errors during data fetching and displays a fallback UI:

```tsx
<p className="text-red-500 text-lg">
  Failed to load menu. Please try again later.
</p>
```

### Client Component Errors
- Console logging for debugging
- Graceful degradation
- Loading states prevent multiple simultaneous requests

## Performance Optimizations

1. **Server Component Data Fetching**: Initial data loads server-side for better performance
2. **Parallel Requests**: Products and categories fetch in parallel with `Promise.all()`
3. **Optimistic Updates**: Category changes immediately update UI while fetching
4. **Pagination**: Only loads 8 products at a time
5. **Image Optimization**: Uses Next.js Image component with proper sizing

## Usage Example

```tsx
// app/page.tsx or any server component
import { MenuSection } from '@/components/home/menu-section';

export default async function HomePage() {
  return (
    <main>
      <HeroSection />
      <MenuSection />
      <AboutSection />
    </main>
  );
}
```

## Development

### Testing the Component

1. Start the development server:
```bash
npm run dev
```

2. Navigate to the page that includes `<MenuSection />`

3. Test scenarios:
   - Initial load with "ALL" category
   - Switch between categories
   - Click "Load More" to paginate
   - Check responsive behavior
   - Test empty states (if no products in category)

### Debugging

Enable console logs to debug:
- Category changes
- API requests
- Pagination state
- Error states

## Future Enhancements

Potential improvements:
- Add search functionality
- Product quick view modal
- Add to cart directly from card
- Favorite/wishlist functionality
- Filter by price, dietary preferences
- Sort options (price, popularity, newest)
- Skeleton for category tabs during initial load
