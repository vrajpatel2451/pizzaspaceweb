# Stores Section - Component Architecture

## Component Hierarchy

```
StoresSection (Server Component)
│
├─ Container & Background Pattern
│
├─ Header Section
│  ├─ Badge: "Our Locations"
│  ├─ Title: "Find Your Nearest Store"
│  └─ Description Text
│
└─ Suspense Boundary
   ├─ Fallback: StoresSkeleton
   │  └─ Grid of 6 Skeleton Cards
   │
   └─ StoresContent (Server Component)
      ├─ API Call: getStores({ isActive: true, limit: 6 })
      │
      └─ StoresGrid (Server Component)
         ├─ Empty State (conditional)
         │
         └─ Grid Container
            └─ StoreCard × N (Server Component)
               ├─ Header
               │  ├─ Store Icon (Building)
               │  ├─ Store Name
               │  └─ "Nearby" Badge
               │
               ├─ Details Section
               │  ├─ Address (MapPin icon)
               │  ├─ Phone (Phone icon)
               │  └─ Hours (Clock icon)
               │
               └─ CTA Button
                  └─ "Get Directions" → Google Maps
```

## Data Flow

```
API Layer                 Component Layer              UI Layer
───────────               ────────────────             ────────

getStores()     ─────>    StoresContent     ─────>    StoresGrid
    │                           │                          │
    │                           │                          │
    ├─ Query Params             ├─ Try/Catch              ├─ Empty Check
    │  - isActive: true         │                          │
    │  - limit: 6               │                          │
    │                           │                          │
    ├─ API Response             ├─ Success                 └─> StoreCard × N
    │  - data.data              │   └─> stores[]                    │
    │                           │                                   │
    └─ Error                    └─ Error                            ├─ Store Data
                                    └─> Error UI                    ├─ Google Maps URL
                                                                     └─> Rendered Card
```

## Component Responsibilities

### StoresSection (index.tsx)
**Type:** Server Component (Async)

**Responsibilities:**
- Define section layout and styling
- Render background pattern
- Display header (badge, title, description)
- Provide Suspense boundary
- Container management

**State:** None (Stateless)

**Data Fetching:** None (Delegated to StoresContent)

---

### StoresContent (index.tsx)
**Type:** Server Component (Async)

**Responsibilities:**
- Fetch stores data from API
- Handle errors gracefully
- Pass data to StoresGrid
- Display error states

**State:** None (Async data)

**Data Fetching:**
```typescript
const response = await getStores({ isActive: true, limit: 6 });
const stores = response.data.data;
```

**Error Handling:**
```typescript
try {
  // Fetch stores
} catch (error) {
  console.error("Failed to fetch stores:", error);
  return <ErrorUI />;
}
```

---

### StoresGrid (stores-grid.tsx)
**Type:** Server Component

**Responsibilities:**
- Layout stores in responsive grid
- Handle empty states
- Iterate over store data
- Render individual StoreCards

**Props:**
```typescript
interface StoresGridProps {
  stores: StoreResponse[];
}
```

**State:** None (Stateless)

**Rendering Logic:**
- If `!stores || stores.length === 0` → Empty State
- Else → Grid of StoreCards

---

### StoreCard (store-card.tsx)
**Type:** Server Component

**Responsibilities:**
- Display individual store information
- Format address from store data
- Generate Google Maps URL
- Render interactive elements

**Props:**
```typescript
interface StoreCardProps {
  store: StoreResponse;
}
```

**State:** None (Stateless)

**Derived Data:**
```typescript
const fullAddress = `${store.line1}${store.line2 ? ", " + store.line2 : ""}, ${store.area}, ${store.city}`;
const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.long}`;
```

---

### StoresSkeleton (stores-skeleton.tsx)
**Type:** Server Component

**Responsibilities:**
- Display loading state
- Match StoreCard layout exactly
- Provide visual feedback during data fetch

**State:** None (Static UI)

**Rendering:** 6 animated skeleton cards

## TypeScript Interfaces

### Core Types

```typescript
// From @/types/store
export type StoreResponse = {
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

export interface StoreQueryParams {
  page?: number;
  limit?: number;
  lat?: number;
  long?: number;
  search?: string;
  isActive?: boolean;
}
```

### Component Props

```typescript
// StoresGrid
interface StoresGridProps {
  stores: StoreResponse[];
}

// StoreCard
interface StoreCardProps {
  store: StoreResponse;
}

// StoresSection - No props (standalone section)
// StoresSkeleton - No props (static UI)
```

## Design Patterns

### 1. Server Component Pattern
All components are Server Components by default, reducing client-side JavaScript.

**Benefits:**
- Zero JavaScript for static content
- Direct data fetching
- Better performance
- SEO friendly

### 2. Suspense Boundary Pattern
Wrap async data fetching with Suspense for progressive rendering.

```tsx
<Suspense fallback={<StoresSkeleton />}>
  <StoresContent />
</Suspense>
```

**Benefits:**
- Non-blocking UI
- Progressive loading
- Better UX
- Streaming SSR

### 3. Error Boundary Pattern
Try/catch at data fetching level with fallback UI.

```tsx
try {
  const stores = await getStores(...);
  return <StoresGrid stores={stores} />;
} catch {
  return <ErrorUI />;
}
```

**Benefits:**
- Graceful degradation
- User-friendly errors
- Prevents page crashes

### 4. Composition Pattern
Small, focused components composed together.

```
Section → Grid → Card
```

**Benefits:**
- Single responsibility
- Easy to test
- Reusable components
- Clear hierarchy

### 5. Conditional Rendering Pattern
Handle edge cases at appropriate levels.

```tsx
// Empty state in Grid
if (!stores || stores.length === 0) {
  return <EmptyState />;
}

// Error state in Content
catch (error) {
  return <ErrorState />;
}
```

**Benefits:**
- Clear error handling
- Better UX
- Prevents runtime errors

## File Organization

```
components/home/stores-section/
│
├── index.tsx                    # Main section + data fetching
│   ├── StoresSection           # Container component
│   └── StoresContent           # Data fetching component
│
├── stores-grid.tsx             # Grid layout
│   └── StoresGrid              # Grid + empty state
│
├── store-card.tsx              # Individual card
│   └── StoreCard               # Card display
│
├── stores-skeleton.tsx         # Loading state
│   └── StoresSkeleton          # Skeleton UI
│
├── README.md                   # Documentation
└── ARCHITECTURE.md             # This file
```

## Rendering Flow

### Initial Load (Server)

```
1. Request → /page
2. StoresSection renders
3. Suspense boundary hit
4. StoresSkeleton streams to client
5. StoresContent starts fetching
6. API call to getStores()
7. Response received
8. StoresGrid renders with data
9. StoreCards render (map)
10. Complete HTML streams to client
11. Suspense resolves, skeleton replaced
```

### Streaming Timeline

```
Time    Event
─────   ──────────────────────────────────────
0ms     Initial HTML (shell + skeleton)
        └─> User sees loading state

100ms   API call initiated (server-side)

300ms   API response received

350ms   StoresGrid + Cards render (server)

400ms   Complete HTML streamed to client
        └─> User sees actual stores

Done    Page fully interactive
```

## Performance Characteristics

### Bundle Size
- **Client JS:** ~0 KB (all Server Components)
- **HTML:** ~15 KB for 6 stores
- **CSS:** Included in main bundle

### Network Requests
- **Initial:** 1 (HTML document)
- **API:** 0 (server-side)
- **Images:** 0 (no images in current version)

### Rendering
- **SSR:** Yes (streaming)
- **Hydration:** No (no client components)
- **Time to Interactive:** Immediate (no JS)

## Scalability Considerations

### Current Limits
- **Stores Displayed:** 6 (configurable via limit param)
- **Grid Columns:** 3 max (desktop)
- **API Response:** Paginated (supports more)

### Scaling Options

**More Stores:**
```typescript
// Change limit
const response = await getStores({ isActive: true, limit: 12 });
```

**Pagination:**
```typescript
// Add page param
const response = await getStores({
  isActive: true,
  limit: 6,
  page: currentPage
});
```

**Location Filtering:**
```typescript
// Add user location
const response = await getStores({
  isActive: true,
  limit: 6,
  lat: userLat,
  long: userLong
});
```

## Testing Considerations

### Unit Tests
- StoresGrid with empty array
- StoresGrid with populated array
- StoreCard with complete data
- StoreCard with missing optional fields

### Integration Tests
- API error handling
- Empty state rendering
- Loading state rendering
- Link generation (Google Maps)

### E2E Tests
- Page load with stores
- Click "Get Directions" button
- Phone number link
- Responsive layout

## Future Enhancements

1. **Distance Calculation:** Show actual distance from user location
2. **Store Images:** Add store photos
3. **Operating Hours:** Dynamic hours from API
4. **Store Search:** Filter by location/name
5. **Map View:** Interactive map with markers
6. **Store Details:** Dedicated store detail pages
7. **Favorite Stores:** Save preferred locations
8. **Real-time Status:** Show if store is currently open
