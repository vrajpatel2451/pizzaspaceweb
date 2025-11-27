# Categories Section Component

A responsive carousel section that displays popular food categories with API integration and fallback to mock data.

## Features

- Server Component with async data fetching
- Client-side carousel with Embla Carousel
- Responsive design (1-5 items visible based on screen size)
- Smooth animations and hover effects
- Navigation arrows
- Loading skeleton state
- Automatic fallback to mock data on API failure
- TypeScript strict typing
- Accessibility support (ARIA labels, focus states)

## File Structure

```
components/home/categories-section/
  index.tsx                 # Main section (Server Component)
  categories-carousel.tsx   # Carousel with navigation (Client Component)
  category-card.tsx         # Individual category card
  categories-skeleton.tsx   # Loading state
  README.md                 # This file
```

## Component Breakdown

### 1. CategoriesSection (index.tsx)
**Type**: Server Component

Main section component that:
- Fetches categories from API using `getCategories({ limit: 10 })`
- Falls back to mock data if API fails
- Renders section header with badge, title, and description
- Wraps carousel in Suspense boundary with skeleton

**Usage**:
```tsx
import { CategoriesSection } from "@/components/home/categories-section";

export default function HomePage() {
  return (
    <>
      <CategoriesSection />
    </>
  );
}
```

### 2. CategoriesCarousel (categories-carousel.tsx)
**Type**: Client Component

Interactive carousel component that:
- Uses embla-carousel-react for smooth scrolling
- Shows/hides navigation arrows based on scroll position
- Responsive breakpoints:
  - Mobile: 1-2 items
  - Tablet: 3 items
  - Desktop: 4-5 items
- Handles empty state

**Props**:
```typescript
interface CategoriesCarouselProps {
  categories: CategoryResponse[];
}
```

### 3. CategoryCard (category-card.tsx)
**Type**: Client Component

Individual category card that:
- Displays circular category image
- Shows category name below image
- Links to `/menu?category={id}`
- Hover effects (scale + color change)
- Focus ring for accessibility

**Props**:
```typescript
interface CategoryCardProps {
  category: CategoryResponse;
}
```

**CategoryResponse Type**:
```typescript
interface CategoryResponse {
  _id: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  storeIds: string[];
}
```

### 4. CategoriesSkeleton (categories-skeleton.tsx)
**Type**: Client Component

Loading state component that:
- Shows 5 skeleton circles with text placeholders
- Matches actual carousel layout
- Uses shadcn/ui Skeleton component

## Styling

### Color Scheme
- Background: `bg-amber-50` (light cream)
- Badge: `bg-orange-500` (orange)
- Hover states: `hover:text-orange-500`, `hover:bg-orange-50`
- Focus ring: `focus:ring-orange-500`

### Responsive Sizes
- Category images:
  - Mobile: `w-32 h-32` (128px)
  - Desktop: `w-40 h-40` (160px)
- Navigation buttons:
  - Mobile: `w-10 h-10`
  - Desktop: `w-12 h-12`

## API Integration

### API Call
```typescript
const response = await getCategories({ limit: 10 });
const categories = response.data.data;
```

### Error Handling
```typescript
try {
  const response = await getCategories({ limit: 10 });
  categories = response.data.data;
} catch (error) {
  console.error("Failed to fetch categories, using mock data:", error);
  const mockResponse = getMockCategories(1, 10);
  categories = mockResponse.data.data;
}
```

## Dependencies

- `embla-carousel-react@8.6.0` - Carousel functionality
- `lucide-react` - Icon library (ChevronLeft, ChevronRight)
- `next/image` - Optimized images
- `next/link` - Client-side routing

## Accessibility

- Navigation buttons have `aria-label` attributes
- Focus states with visible rings
- Semantic HTML structure
- Image alt text for screen readers
- Keyboard navigation support

## Performance Optimizations

- Server-side data fetching (reduces client bundle)
- Suspense boundary for progressive loading
- Image optimization with Next.js Image component
- Lazy loading of category images (`priority={false}`)
- Responsive image sizes with `sizes` attribute

## Future Enhancements

Possible improvements:
- [ ] Add pagination dots
- [ ] Auto-play carousel option
- [ ] Touch/swipe gestures on mobile
- [ ] Category filtering
- [ ] Animation on scroll into view
- [ ] Add category count badge
- [ ] Keyboard arrow navigation
- [ ] RTL language support

## Testing Checklist

- [ ] Categories load from API
- [ ] Fallback to mock data works
- [ ] Navigation arrows appear/disappear correctly
- [ ] Hover effects work
- [ ] Links navigate to correct URLs
- [ ] Responsive layout works on all screen sizes
- [ ] Loading skeleton displays
- [ ] Empty state displays when no categories
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Images load and display correctly
