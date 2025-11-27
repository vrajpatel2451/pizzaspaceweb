# Stores Section Component

A fully functional stores section that displays active store locations fetched from the Pizza Space API.

## Component Structure

```
components/home/stores-section/
├── index.tsx              # Main section with data fetching (Server Component)
├── stores-grid.tsx        # Grid layout for store cards (Server Component)
├── store-card.tsx         # Individual store card display
├── stores-skeleton.tsx    # Loading skeleton UI
└── README.md             # This file
```

## Features

- Server-side data fetching with Next.js App Router
- Suspense boundaries for progressive loading
- Responsive grid layout (1/2/3 columns)
- Google Maps integration for directions
- Error handling and empty states
- TypeScript strict mode compliance
- Accessible markup with semantic HTML

## Usage

### Basic Integration

```tsx
import { StoresSection } from "@/components/home/stores-section";

export default function HomePage() {
  return (
    <main>
      {/* Other sections */}
      <StoresSection />
      {/* Other sections */}
    </main>
  );
}
```

### Demo Page

Visit `/stores-demo` to see the component in action with live API data.

## Component API

### StoresSection

Main section component that handles data fetching and display.

**Type:** Server Component

**Props:** None (uses default API query)

**Data Source:** `getStores({ isActive: true, limit: 6 })`

### StoresGrid

Grid container for store cards with responsive layout.

**Type:** Server Component

**Props:**
```typescript
interface StoresGridProps {
  stores: StoreResponse[];
}
```

**Features:**
- Empty state handling
- Responsive grid: 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Gap spacing between cards

### StoreCard

Individual store card displaying location details.

**Type:** Server Component

**Props:**
```typescript
interface StoreCardProps {
  store: StoreResponse;
}
```

**Displays:**
- Store name with icon
- "Nearby" badge
- Full address
- Phone number (clickable)
- Business hours
- Google Maps directions button

**Features:**
- Hover effects
- Interactive elements (phone, directions)
- Google Maps integration
- Responsive layout

### StoresSkeleton

Loading skeleton matching store card layout.

**Type:** Server Component

**Props:** None

**Displays:** 6 skeleton cards with animated pulse effect

## Design Specifications

### Layout
- **Background:** Light slate (bg-slate-50) with subtle grid pattern
- **Padding:** 16px vertical (py-16)
- **Container:** Centered with max-width and 16px horizontal padding

### Typography
- **Badge:** Orange background, white text, rounded-full, small font
- **Title:** 3xl font-bold, gray-900
- **Description:** Gray-600, centered, max-width 36rem

### Store Cards
- **Background:** White
- **Rounded:** xl (rounded-xl)
- **Shadow:** md with lg on hover
- **Padding:** 24px (p-6)
- **Icon:** Orange-100 background, orange-500 icon
- **Badge:** Orange-500 outline variant

### Responsive Grid
```css
grid-cols-1           /* Mobile: 1 column */
md:grid-cols-2        /* Tablet: 2 columns */
lg:grid-cols-3        /* Desktop: 3 columns */
gap-6                 /* 24px gap between cards */
```

## API Integration

### Data Fetching

```typescript
const response = await getStores({ isActive: true, limit: 6 });
const stores = response.data.data;
```

### Store Response Type

```typescript
type StoreResponse = {
  _id: string;
  name: string;
  imageUrl: string;
  phone: string;
  email: string;
  deliveryRadius: number;
  lat: number;
  long: number;
  line1: string;
  line2: string;
  area: string;
  city: string;
  county: string;
  country: string;
  zip: string;
  isActive: boolean;
  createdAt: string;
};
```

## Error Handling

The component includes comprehensive error handling:

1. **API Errors:** Caught and displayed with user-friendly message
2. **Empty States:** Handled in StoresGrid component
3. **Loading States:** Suspense boundary with skeleton UI

### Error Display

```tsx
<div className="text-center py-12">
  <p className="text-gray-500 text-lg">
    Unable to load stores at the moment.
  </p>
  <p className="text-gray-400 text-sm mt-2">
    Please try again later.
  </p>
</div>
```

## Accessibility

- Semantic HTML structure
- Accessible links and buttons
- Color contrast meets WCAG AA standards
- Screen reader friendly
- Keyboard navigable

## Performance

- **Server Components:** Zero JavaScript by default
- **Code Splitting:** Automatic route-based splitting
- **Suspense Streaming:** Progressive page rendering
- **Optimized Images:** Ready for next/image integration

## Customization

### Change Number of Stores

Edit the limit in `index.tsx`:

```typescript
const response = await getStores({ isActive: true, limit: 12 }); // Show 12 stores
```

### Modify Business Hours

Update the hours display in `store-card.tsx`:

```typescript
<span>Mon-Sat: 10AM - 11PM</span>
```

### Customize Grid Layout

Adjust grid classes in `stores-grid.tsx`:

```typescript
className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
```

## Dependencies

- `@/lib/api` - API client functions
- `@/types` - TypeScript type definitions
- `@/components/ui/badge` - Badge component
- `@/components/ui/button` - Button component
- `lucide-react` - Icon library

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Progressive enhancement for older browsers
- Responsive design for all screen sizes

## Related Components

- `/components/ui/badge` - Badge component used for "Nearby" label
- `/components/ui/button` - Button component used for "Get Directions"
- `/lib/api/stores` - Store API integration
- `/types/store` - Store type definitions
