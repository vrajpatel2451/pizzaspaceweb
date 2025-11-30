# Pizza Space - Component Architecture Documentation
## Spec3 Pages: About, Contact, and Stores

**Version:** 1.0
**Last Updated:** December 1, 2024
**Next.js Version:** 16 (App Router)
**React Version:** 19

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [About Page Architecture](#about-page-architecture)
3. [Contact Page Architecture](#contact-page-architecture)
4. [Stores Page Architecture](#stores-page-architecture)
5. [Shared Components](#shared-components)
6. [Data Fetching Strategy](#data-fetching-strategy)
7. [State Management](#state-management)
8. [File Structure](#file-structure)
9. [TypeScript Interfaces](#typescript-interfaces)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Architecture Overview

### Design Principles

1. **Server-First Architecture**: Leverage Next.js 16 Server Components for data fetching and static content
2. **Progressive Enhancement**: Use Client Components only where interactivity is required
3. **Performance Optimization**: Implement lazy loading for below-fold content
4. **Consistency**: Follow existing home page design patterns and component structure
5. **Accessibility**: Ensure WCAG 2.1 AA compliance with proper semantic HTML and ARIA labels
6. **Theme Support**: Full dark/light mode support using Tailwind CSS
7. **Mobile Responsive**: Mobile-first design approach

### Server vs Client Component Strategy

**Server Components (Default):**
- Page layouts and shells
- Static content sections
- Data fetching components
- SEO-critical content

**Client Components ('use client'):**
- Interactive forms with validation
- Client-side state management (filters, search)
- Third-party libraries (Google Maps, Framer Motion)
- Browser API usage (geolocation)

---

## About Page Architecture

**Route:** `/app/about/page.tsx`
**Total Sections:** 5
**Loading Strategy:** Hero (immediate) + Lazy load below-fold

### 1. Component Tree

```
AboutPage (Server Component)
├── AboutHeroSection (Server Component)
│   ├── HeroContent (Server Component)
│   │   ├── Heading + Description
│   │   └── BreadcrumbNav (Client Component - for navigation)
│   └── BackgroundShapes (Client Component - Framer Motion)
│
├── AboutStorySection (Server Component - Lazy)
│   ├── StoryContent (Server Component)
│   │   ├── Timeline (Client Component - animations)
│   │   └── FeatureList (Server Component)
│   └── StoryImage (Server Component)
│
├── VisionMissionSection (Server Component - Lazy)
│   ├── VisionCard (Client Component - hover animations)
│   ├── MissionCard (Client Component - hover animations)
│   └── ValuesGrid (Server Component)
│       └── ValueCard × 4 (Client Component - animations)
│
├── OurStoresPreview (Server Component - Lazy)
│   ├── StoresCarousel (Client Component)
│   │   └── StorePreviewCard × N (Server Component)
│   └── ViewAllStoresButton (Server Component)
│
├── TeamSection (Server Component - Lazy)
│   ├── SectionHeader (Server Component)
│   └── TeamGrid (Server Component)
│       └── TeamMemberCard × N (Client Component - hover effects)
│
└── AboutTestimonials (Server Component - Lazy)
    └── TestimonialsCarousel (Client Component - reuse from home)
```

### 2. Section Specifications

#### Section 1: Hero Section (Above-the-fold)
**Component:** `AboutHeroSection`
**Type:** Server Component
**Loading:** Immediate

**Features:**
- Full-width hero with gradient background
- Breadcrumb navigation
- Eye-catching headline and tagline
- Animated background shapes (client-side)
- Scroll indicator

**Props:** None (static content)

#### Section 2: Our Story
**Component:** `AboutStorySection`
**Type:** Server Component (Lazy)
**Loading:** Dynamic import

**Features:**
- Two-column layout (content + image)
- Timeline of milestones (animated on scroll)
- Founding story narrative
- Key achievements highlights

#### Section 3: Vision, Mission & Values
**Component:** `VisionMissionSection`
**Type:** Server Component (Lazy)
**Loading:** Dynamic import

**Features:**
- Large vision and mission cards
- 4-column values grid (mobile: 2 columns)
- Icon-based visual representation
- Hover animations

#### Section 4: Our Stores Preview
**Component:** `OurStoresPreview`
**Type:** Server Component (Lazy)
**Loading:** Dynamic import

**Features:**
- Horizontal carousel of store cards
- Shows 3-4 featured stores
- "View All Stores" CTA linking to /stores
- Store count badge

**Data Source:** Server-side fetch from `/api/stores?limit=6`

#### Section 5: Meet Our Team
**Component:** `TeamSection`
**Type:** Server Component (Lazy)
**Loading:** Dynamic import

**Features:**
- Grid layout (3 columns desktop, 2 tablet, 1 mobile)
- Team member cards with photos
- Hover reveals role and bio
- Social media links (optional)

**Data:** Static content (can be moved to CMS later)

#### Section 6: Customer Testimonials
**Component:** `AboutTestimonials`
**Type:** Server Component (Lazy)
**Loading:** Dynamic import

**Features:**
- Reuse existing `TestimonialsCarousel` from home
- Different testimonials subset or same data
- Consistent styling

### 3. Server/Client Component Breakdown

| Component | Type | Rationale |
|-----------|------|-----------|
| `AboutPage` | Server | Page shell, SEO, data fetching |
| `AboutHeroSection` | Server | Static content, SEO-critical |
| `BackgroundShapes` | Client | Framer Motion animations |
| `AboutStorySection` | Server | Mostly static content |
| `Timeline` | Client | Scroll animations |
| `VisionMissionSection` | Server | Static content wrapper |
| `VisionCard` | Client | Hover animations, transitions |
| `MissionCard` | Client | Hover animations, transitions |
| `ValueCard` | Client | Interactive hover effects |
| `OurStoresPreview` | Server | Data fetching wrapper |
| `StoresCarousel` | Client | Touch/drag interactions |
| `TeamSection` | Server | Static content wrapper |
| `TeamMemberCard` | Client | Hover animations, modals |
| `AboutTestimonials` | Server | Wrapper for carousel |
| `TestimonialsCarousel` | Client | Carousel interactions (reused) |

### 4. Data Requirements

**Static Content:**
- Hero section text
- Story narrative
- Vision/mission statements
- Values (4 items)
- Team members (6-8 people)

**Dynamic Content:**
- Featured stores (API fetch)
- Testimonials (reuse existing)

---

## Contact Page Architecture

**Route:** `/app/contact/page.tsx`
**Total Sections:** 3
**Loading Strategy:** Immediate (lightweight page)

### 1. Component Tree

```
ContactPage (Server Component)
├── ContactHeroSection (Server Component)
│   ├── Heading + Description
│   └── BreadcrumbNav (Client Component)
│
├── ContactContentSection (Server Component)
│   ├── ContactInfoPanel (Server Component)
│   │   ├── ContactCard × 3 (Server Component)
│   │   │   ├── Phone
│   │   │   ├── Email
│   │   │   └── Address
│   │   └── SocialLinks (Server Component)
│   │
│   ├── ContactFormPanel (Client Component)
│   │   └── ContactForm (Client Component)
│   │       ├── React Hook Form
│   │       ├── Zod Validation
│   │       └── Server Action submission
│   │
│   └── MapPanel (Client Component)
│       └── GoogleMapEmbed (Client Component)
│           ├── Multiple store markers
│           └── Info windows
│
└── ContactCTASection (Server Component)
    └── QuickLinksGrid (Server Component)
        ├── "Visit Stores" link
        ├── "View Menu" link
        └── "FAQs" link
```

### 2. Section Specifications

#### Section 1: Hero Section
**Component:** `ContactHeroSection`
**Type:** Server Component
**Loading:** Immediate

**Features:**
- Clean, minimal hero
- Breadcrumb navigation
- Brief description
- Contact hours badge

**Props:** None (static content)

#### Section 2: Contact Content (Main Section)
**Component:** `ContactContentSection`
**Type:** Server Component
**Layout:** 3-column grid (desktop) → stacked (mobile)

**Left Column: Contact Info**
- **Component:** `ContactInfoPanel` (Server)
- Phone numbers with click-to-call
- Email addresses with mailto links
- Physical addresses
- Operating hours
- Social media links

**Middle Column: Contact Form**
- **Component:** `ContactFormPanel` (Client)
- Form fields:
  - Full Name (required)
  - Email (required, email validation)
  - Phone (optional, UK format)
  - Subject (dropdown: General Inquiry, Order Issue, Feedback, Partnership, Other)
  - Message (required, 10-500 chars, char counter)
  - Privacy policy acceptance (checkbox, required)
- Real-time validation (Zod schema)
- Submit via Server Action
- Success/error toast notifications
- Loading states
- Form reset on success

**Right Column: Map**
- **Component:** `MapPanel` (Client)
- Google Maps embed
- Multiple store markers
- Click marker → info window with store details
- Directions link
- Zoom/pan controls

#### Section 3: Quick Links CTA
**Component:** `ContactCTASection`
**Type:** Server Component
**Loading:** Immediate

**Features:**
- 3 CTA cards in a row
- Links to: Stores page, Menu, FAQs
- Icon-based design
- Hover animations

### 3. Server/Client Component Breakdown

| Component | Type | Rationale |
|-----------|------|-----------|
| `ContactPage` | Server | Page shell, metadata, layout |
| `ContactHeroSection` | Server | Static content |
| `ContactContentSection` | Server | Layout wrapper |
| `ContactInfoPanel` | Server | Static contact information |
| `ContactCard` | Server | Static content cards |
| `ContactFormPanel` | Client | Form state, validation, submission |
| `ContactForm` | Client | React Hook Form + Zod |
| `MapPanel` | Client | Google Maps SDK |
| `GoogleMapEmbed` | Client | Third-party library integration |
| `ContactCTASection` | Server | Static links |

### 4. Form Handling Architecture

**Form Flow:**
```
User Input → Client Validation (Zod) → Server Action → API Endpoint → Email Service → Response → Toast
```

**Server Action:** `/app/actions/contact.ts`

```typescript
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
  // Server-side validation
  // Send email via service (Resend, SendGrid, etc.)
  // Log to database (optional)
  // Return success/error response
}
```

### 5. Google Maps Integration

**Setup:**
- **Library:** `@react-google-maps/api`
- **API Key:** Environment variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Features:** Markers, Info Windows, Clustering (if >10 stores)

**Data Source:** Server-side fetch stores with coordinates

---

## Stores Page Architecture

**Route:** `/app/stores/page.tsx`
**Total Sections:** 3
**Loading Strategy:** Immediate shell + Client-side interactions

### 1. Component Tree

```
StoresPage (Server Component)
├── StoresHeroSection (Server Component)
│   ├── Heading + Description
│   ├── BreadcrumbNav (Client Component)
│   └── StoreCount (Server Component)
│
├── StoresMapSection (Client Component)
│   ├── FilterBar (Client Component)
│   │   ├── SearchInput (controlled state)
│   │   ├── LocationFilter (geolocation button)
│   │   └── ClearFilters
│   │
│   ├── InteractiveMap (Client Component)
│   │   ├── GoogleMap
│   │   ├── StoreMarker × N
│   │   ├── MarkerClusterer
│   │   └── InfoWindow
│   │
│   └── StoresList (Client Component)
│       ├── FilteredStoresGrid
│       │   └── StoreCard × N (Server Component via props)
│       └── NoResultsState
│
└── ReservationSection (Server Component)
    ├── SectionHeader
    └── ReservationForm (Client Component - reused)
        └── Store selector pre-populated
```

### 2. Section Specifications

#### Section 1: Hero Section
**Component:** `StoresHeroSection`
**Type:** Server Component
**Loading:** Immediate

**Features:**
- Page title and description
- Total store count badge
- Breadcrumb navigation
- Optional promotional banner

**Data:** Store count from server-side fetch

#### Section 2: Map & Stores Grid (Main Section)
**Component:** `StoresMapSection`
**Type:** Client Component (interactive filters)
**Layout:** Split view (desktop: 50/50 map-list, mobile: tabs)

**Filter Bar:**
- **Search Input:** Filter by store name, area, city
- **Location Button:** Use geolocation to find nearest stores
- **Active Filters:** Clear all button

**Left Panel: Interactive Map**
- **Component:** `InteractiveMap` (Client)
- Google Maps with all store markers
- Click marker → highlight in list + show info window
- Auto-zoom to fit all markers
- Clustering for nearby stores
- User location marker (if permitted)

**Right Panel: Stores Grid**
- **Component:** `StoresList` (Client)
- Grid of store cards (2 columns mobile, 2-3 desktop)
- Each card shows:
  - Store image
  - Name and address
  - Distance from user (if location enabled)
  - "Get Directions" button (opens Google Maps)
  - "Make Reservation" button (scrolls to form)
  - Operating hours
  - Phone number
- Empty state when no results
- Loading skeleton during data fetch

**Mobile Layout:**
- Tabs: "Map View" / "List View"
- Swipeable tabs
- Filter bar sticky on scroll

#### Section 3: Reservation Section
**Component:** `ReservationSection`
**Type:** Server Component
**Loading:** Lazy load

**Features:**
- Reuse existing `ReservationForm` from home page
- Pre-populate store selector if user clicked "Reserve" from card
- Scroll into view on "Make Reservation" click

### 3. Server/Client Component Breakdown

| Component | Type | Rationale |
|-----------|------|-----------|
| `StoresPage` | Server | Page shell, initial data fetch |
| `StoresHeroSection` | Server | Static content + server data |
| `StoresMapSection` | Client | Interactive filters, map state |
| `FilterBar` | Client | Search input state, filters |
| `InteractiveMap` | Client | Google Maps SDK |
| `StoreMarker` | Client | Map marker with click handler |
| `StoresList` | Client | Filtered results from client state |
| `StoreCard` | Server | Props-based rendering (passed from client) |
| `ReservationSection` | Server | Wrapper for form |
| `ReservationForm` | Client | Form state (reused component) |

### 4. Data Fetching & State Strategy

**Server-Side (Initial Load):**
```typescript
// app/stores/page.tsx
async function StoresPage() {
  // Fetch all active stores on server
  const storesResponse = await getStores({ isActive: true });
  const stores = storesResponse.data.data;

  return (
    <>
      <StoresHeroSection count={stores.length} />
      <StoresMapSection initialStores={stores} />
      <ReservationSection stores={stores} />
    </>
  );
}
```

**Client-Side (Filtering):**
```typescript
// components/stores/stores-map-section.tsx
'use client';

function StoresMapSection({ initialStores }: Props) {
  const [stores, setStores] = useState(initialStores);
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<Coords | null>(null);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Filter stores based on search query
  const filteredStores = useMemo(() => {
    return stores.filter(store =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [stores, searchQuery]);

  // Calculate distances if user location is available
  const storesWithDistance = useMemo(() => {
    if (!userLocation) return filteredStores;
    return filteredStores.map(store => ({
      ...store,
      distance: calculateDistance(userLocation, { lat: store.lat, lng: store.long })
    })).sort((a, b) => a.distance - b.distance);
  }, [filteredStores, userLocation]);

  // ... render map and list
}
```

### 5. Google Maps Configuration

**Libraries:** `['places', 'geometry']`
**Default Center:** London coordinates or first store
**Zoom:** Auto-fit bounds to show all markers

**Marker Clustering:**
- Enable when >10 stores
- Custom cluster icons matching brand colors

**Info Window:**
```typescript
interface InfoWindowContent {
  storeName: string;
  address: string;
  phone: string;
  getDirectionsUrl: string;
  makeReservationAction: () => void;
}
```

---

## Shared Components

These components are shared across multiple pages:

### 1. BreadcrumbNav
**Location:** `components/ui/breadcrumb.tsx`
**Type:** Client Component
**Usage:** About, Contact, Stores pages

**Props:**
```typescript
interface BreadcrumbProps {
  items: Array<{
    label: string;
    href?: string;
  }>;
}
```

### 2. SectionHeader
**Location:** `components/shared/section-header.tsx`
**Type:** Server Component
**Usage:** All sections

**Props:**
```typescript
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  badge?: string;
}
```

### 3. StoreCard
**Location:** `components/shared/store-card.tsx`
**Type:** Server Component (with client actions)
**Usage:** About page (preview), Stores page (grid)

**Props:**
```typescript
interface StoreCardProps {
  store: StoreResponse;
  showDistance?: boolean;
  distance?: number;
  onReserveClick?: (storeId: string) => void;
  variant?: 'preview' | 'detailed';
}
```

### 4. ReservationForm
**Location:** `components/home/stores-section/reservation-form.tsx`
**Type:** Client Component
**Usage:** Home page, Stores page

**Props:**
```typescript
interface ReservationFormProps {
  stores: StoreResponse[];
  preselectedStoreId?: string;
}
```

### 5. TestimonialsCarousel
**Location:** `components/home/testimonials-section/testimonials-carousel.tsx`
**Type:** Client Component
**Usage:** Home page, About page

**Props:**
```typescript
interface TestimonialsCarouselProps {
  testimonials?: Testimonial[];
  autoplay?: boolean;
  variant?: 'default' | 'compact';
}
```

### 6. GoogleMapEmbed
**Location:** `components/shared/google-map-embed.tsx`
**Type:** Client Component
**Usage:** Contact page, Stores page

**Props:**
```typescript
interface GoogleMapEmbedProps {
  stores: StoreResponse[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  interactive?: boolean;
  onMarkerClick?: (storeId: string) => void;
  selectedStoreId?: string;
}
```

---

## Data Fetching Strategy

### 1. Server Component Data Fetching

**Approach:** Direct API calls in Server Components using `async/await`

```typescript
// app/about/page.tsx (Server Component)
import { getStores } from '@/lib/api/stores';

export default async function AboutPage() {
  // Fetch featured stores for preview
  const storesResponse = await getStores({ limit: 6, isActive: true });
  const featuredStores = storesResponse.data.data;

  return (
    <>
      {/* Pass data as props to client components */}
      <OurStoresPreview stores={featuredStores} />
    </>
  );
}
```

**Benefits:**
- No client-side loading states for initial data
- SEO-friendly (data in HTML)
- Automatic request deduplication
- Server-side caching

### 2. Client Component Data Fetching

**Approach:** Use React hooks (useState, useEffect) or TanStack Query for client-side needs

**Use Cases:**
- User-triggered actions (geolocation)
- Real-time filtering without server round-trip
- Form submissions

```typescript
// components/stores/location-filter.tsx (Client Component)
'use client';

function LocationFilter({ onLocationUpdate }: Props) {
  const [loading, setLoading] = useState(false);

  const handleGetLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onLocationUpdate({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLoading(false);
      }
    );
  };

  return <Button onClick={handleGetLocation} loading={loading}>Use My Location</Button>;
}
```

### 3. Caching Strategy

**Server Components:**
```typescript
// Static data (revalidate every 1 hour)
export const revalidate = 3600;

// Dynamic data (no caching)
export const dynamic = 'force-dynamic';
```

**Client Components:**
- Use `useMemo` for expensive computations
- Implement local state caching for filters
- Consider TanStack Query for complex data needs (future)

### 4. Error Handling

**Server Components:**
```typescript
import { notFound } from 'next/navigation';

async function fetchData() {
  try {
    const response = await getStores();
    if (response.statusCode !== 200) {
      throw new Error('Failed to fetch stores');
    }
    return response.data.data;
  } catch (error) {
    console.error('Error fetching stores:', error);
    // Return empty array as fallback
    return [];
  }
}
```

**Client Components:**
```typescript
// Use error boundaries or try-catch with state
const [error, setError] = useState<string | null>(null);

try {
  // operation
} catch (err) {
  setError('Something went wrong');
  toast.error('Failed to load data');
}
```

---

## State Management

### 1. Local Component State (useState)

**Use For:**
- Form inputs
- UI toggles (modals, dropdowns)
- Component-specific interactions

**Example:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [selectedStore, setSelectedStore] = useState<string | null>(null);
```

### 2. URL State (searchParams)

**Use For:**
- Shareable filters
- Pagination
- Deep linking

**Example:**
```typescript
// app/stores/page.tsx
import { useSearchParams } from 'next/navigation';

function StoresPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const area = searchParams.get('area') || '';

  // ... use in filters
}
```

### 3. Context API (Existing StoreProvider)

**Current Usage:**
- Cart state (if applicable)
- User preferences
- Selected store context

**Avoid For:**
- Frequently changing filter state (use local state)
- Props that can be passed directly

### 4. Form State (React Hook Form)

**Use For:**
- All forms (Contact, Reservation)
- Complex validation logic
- Multi-step forms (future)

**Example:**
```typescript
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(contactFormSchema),
  defaultValues: { ... }
});
```

### 5. Computed State (useMemo)

**Use For:**
- Filtered/sorted lists
- Distance calculations
- Expensive transformations

**Example:**
```typescript
const filteredStores = useMemo(() => {
  return stores.filter(s => s.name.includes(searchQuery));
}, [stores, searchQuery]);

const storesWithDistance = useMemo(() => {
  return stores.map(s => ({
    ...s,
    distance: calculateDistance(userLocation, s)
  }));
}, [stores, userLocation]);
```

---

## File Structure

```
app/
├── about/
│   ├── page.tsx (Server Component)
│   └── metadata.ts (SEO metadata)
│
├── contact/
│   ├── page.tsx (Server Component)
│   └── metadata.ts
│
├── stores/
│   ├── page.tsx (Server Component)
│   └── metadata.ts
│
└── actions/
    └── contact.ts (Server Actions)

components/
├── about/
│   ├── hero-section/
│   │   ├── index.tsx (Server)
│   │   ├── breadcrumb-nav.tsx (Client)
│   │   └── background-shapes.tsx (Client)
│   │
│   ├── story-section/
│   │   ├── index.tsx (Server)
│   │   ├── story-content.tsx (Server)
│   │   ├── timeline.tsx (Client)
│   │   ├── feature-list.tsx (Server)
│   │   └── story-image.tsx (Server)
│   │
│   ├── vision-mission-section/
│   │   ├── index.tsx (Server)
│   │   ├── vision-card.tsx (Client)
│   │   ├── mission-card.tsx (Client)
│   │   ├── values-grid.tsx (Server)
│   │   └── value-card.tsx (Client)
│   │
│   ├── stores-preview/
│   │   ├── index.tsx (Server)
│   │   ├── stores-carousel.tsx (Client)
│   │   └── store-preview-card.tsx (Server)
│   │
│   ├── team-section/
│   │   ├── index.tsx (Server)
│   │   ├── section-header.tsx (Server)
│   │   ├── team-grid.tsx (Server)
│   │   └── team-member-card.tsx (Client)
│   │
│   └── testimonials/
│       └── index.tsx (Server - wrapper for shared carousel)
│
├── contact/
│   ├── hero-section/
│   │   ├── index.tsx (Server)
│   │   └── breadcrumb-nav.tsx (Client)
│   │
│   ├── content-section/
│   │   ├── index.tsx (Server)
│   │   ├── contact-info-panel.tsx (Server)
│   │   ├── contact-card.tsx (Server)
│   │   ├── social-links.tsx (Server)
│   │   ├── contact-form-panel.tsx (Client)
│   │   ├── contact-form.tsx (Client)
│   │   ├── map-panel.tsx (Client)
│   │   └── google-map-embed.tsx (Client)
│   │
│   └── cta-section/
│       ├── index.tsx (Server)
│       └── quick-links-grid.tsx (Server)
│
├── stores/
│   ├── hero-section/
│   │   ├── index.tsx (Server)
│   │   ├── store-count-badge.tsx (Server)
│   │   └── breadcrumb-nav.tsx (Client)
│   │
│   ├── map-section/
│   │   ├── index.tsx (Client - main interactive section)
│   │   ├── filter-bar.tsx (Client)
│   │   ├── search-input.tsx (Client)
│   │   ├── location-filter.tsx (Client)
│   │   ├── interactive-map.tsx (Client)
│   │   ├── store-marker.tsx (Client)
│   │   ├── marker-info-window.tsx (Client)
│   │   ├── stores-list.tsx (Client)
│   │   ├── stores-grid.tsx (Client)
│   │   ├── store-card.tsx (Server - passed as props)
│   │   └── no-results-state.tsx (Server)
│   │
│   └── reservation-section/
│       └── index.tsx (Server - wrapper for shared form)
│
└── shared/
    ├── breadcrumb.tsx (Client)
    ├── section-header.tsx (Server)
    ├── store-card.tsx (Server with client actions)
    ├── google-map-embed.tsx (Client)
    └── loading-skeleton.tsx (Server)

lib/
├── api/
│   └── stores.ts (existing)
│
├── actions/
│   └── contact.ts (Server Actions)
│
├── hooks/
│   ├── use-geolocation.ts
│   ├── use-map-interactions.ts
│   └── use-debounce.ts
│
├── utils/
│   ├── distance-calculator.ts
│   ├── map-helpers.ts
│   └── form-validators.ts
│
└── constants/
    ├── contact-info.ts
    ├── team-members.ts
    └── company-values.ts

types/
├── store.ts (existing)
├── contact.ts (new)
├── team.ts (new)
└── map.ts (new)
```

---

## TypeScript Interfaces

### About Page Types

```typescript
// types/team.ts
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
}

// types/company.ts
export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

export interface VisionMission {
  vision: {
    title: string;
    description: string;
    points: string[];
  };
  mission: {
    title: string;
    description: string;
    points: string[];
  };
}
```

### Contact Page Types

```typescript
// types/contact.ts
export interface ContactFormData {
  fullName: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
  acceptPrivacy: boolean;
}

export type ContactSubject =
  | 'general'
  | 'order'
  | 'feedback'
  | 'partnership'
  | 'other';

export interface ContactInfo {
  phone: {
    main: string;
    support: string;
  };
  email: {
    general: string;
    support: string;
    careers: string;
  };
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
  hours: {
    weekdays: string;
    weekends: string;
  };
  social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

### Stores Page Types

```typescript
// types/map.ts
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface StoreWithDistance extends StoreResponse {
  distance?: number; // in miles or km
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MarkerCluster {
  position: Coordinates;
  count: number;
  stores: StoreResponse[];
}

export interface StoreFilters {
  searchQuery: string;
  userLocation: Coordinates | null;
  selectedArea?: string;
  maxDistance?: number; // in miles
}

export interface MapConfig {
  center: Coordinates;
  zoom: number;
  libraries: ('places' | 'geometry')[];
}
```

### Component Props Interfaces

```typescript
// About Page Components
export interface AboutHeroSectionProps {
  className?: string;
}

export interface AboutStorySectionProps {
  timeline: TimelineEvent[];
  storyContent: {
    title: string;
    paragraphs: string[];
  };
}

export interface VisionMissionSectionProps {
  data: VisionMission;
  values: CompanyValue[];
}

export interface OurStoresPreviewProps {
  stores: StoreResponse[];
}

export interface TeamSectionProps {
  members: TeamMember[];
}

// Contact Page Components
export interface ContactHeroSectionProps {
  className?: string;
}

export interface ContactInfoPanelProps {
  contactInfo: ContactInfo;
}

export interface ContactFormPanelProps {
  onSubmitSuccess?: () => void;
}

export interface MapPanelProps {
  stores: StoreResponse[];
  height?: string;
}

// Stores Page Components
export interface StoresHeroSectionProps {
  totalStores: number;
}

export interface StoresMapSectionProps {
  initialStores: StoreResponse[];
}

export interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onLocationRequest: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export interface InteractiveMapProps {
  stores: StoreWithDistance[];
  center: Coordinates;
  selectedStoreId: string | null;
  onMarkerClick: (storeId: string) => void;
  userLocation: Coordinates | null;
}

export interface StoresListProps {
  stores: StoreWithDistance[];
  selectedStoreId: string | null;
  onStoreSelect: (storeId: string) => void;
  onReserveClick: (storeId: string) => void;
  loading?: boolean;
}

export interface StoreCardProps {
  store: StoreWithDistance;
  showDistance?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  onReserveClick?: () => void;
  variant?: 'preview' | 'detailed';
}

// Shared Components
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  alignment?: 'left' | 'center' | 'right';
  className?: string;
}

export interface GoogleMapEmbedProps {
  stores: StoreResponse[];
  center?: Coordinates;
  zoom?: number;
  height?: string;
  className?: string;
  interactive?: boolean;
  onMarkerClick?: (storeId: string) => void;
  selectedStoreId?: string;
  userLocation?: Coordinates | null;
  showUserMarker?: boolean;
}
```

---

## Implementation Guidelines

### 1. Component Development Workflow

**Step 1: Create Component Structure**
```bash
# Example: About Story Section
mkdir -p components/about/story-section
touch components/about/story-section/index.tsx
touch components/about/story-section/story-content.tsx
touch components/about/story-section/timeline.tsx
```

**Step 2: Define Props Interface**
```typescript
// components/about/story-section/index.tsx
import { TimelineEvent } from '@/types/company';

export interface AboutStorySectionProps {
  timeline: TimelineEvent[];
  storyContent: {
    title: string;
    paragraphs: string[];
  };
}
```

**Step 3: Implement Server Component**
```typescript
// Server Component (default)
export function AboutStorySection({ timeline, storyContent }: AboutStorySectionProps) {
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          <StoryContent content={storyContent} />
          <Timeline events={timeline} /> {/* Client Component */}
        </div>
      </div>
    </section>
  );
}
```

**Step 4: Implement Client Component**
```typescript
// components/about/story-section/timeline.tsx
'use client';

import { motion } from 'framer-motion';
import { TimelineEvent } from '@/types/company';

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="space-y-8">
      {events.map((event, index) => (
        <motion.div
          key={event.year}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Timeline item */}
        </motion.div>
      ))}
    </div>
  );
}
```

### 2. Styling Guidelines

**Follow Existing Patterns:**
```typescript
// Use Tailwind classes matching home page
className="py-20 sm:py-24 lg:py-32" // Section padding
className="container mx-auto px-4 sm:px-6 lg:px-8" // Container
className="text-3xl sm:text-4xl lg:text-5xl font-bold" // Headings
className="text-slate-600 dark:text-slate-400" // Body text
className="bg-white dark:bg-navy-900" // Section backgrounds
```

**Color Palette:**
- Primary: `orange-500` (brand color)
- Background (light): `white`, `slate-50`
- Background (dark): `navy-900`, `slate-900`
- Text (light): `slate-900`, `slate-700`
- Text (dark): `white`, `slate-300`
- Borders: `slate-200` / `slate-700`

**Animation Patterns:**
```typescript
// Fade in on scroll
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}

// Hover effect
whileHover={{ scale: 1.05 }}
transition={{ duration: 0.2 }}
```

### 3. Accessibility Requirements

**Semantic HTML:**
```tsx
<section aria-labelledby="section-heading">
  <h2 id="section-heading">Section Title</h2>
  {/* content */}
</section>
```

**Keyboard Navigation:**
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  aria-label="Descriptive action"
>
  Action
</button>
```

**Focus Management:**
```tsx
// Trap focus in modals
import { FocusTrap } from '@headlessui/react';

<FocusTrap>
  <div role="dialog" aria-modal="true">
    {/* modal content */}
  </div>
</FocusTrap>
```

**ARIA Labels:**
```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li aria-current="page">About</li>
  </ol>
</nav>
```

### 4. Performance Optimization

**Image Optimization:**
```tsx
import { CustomImage } from '@/components/ui/custom-image';

<CustomImage
  src="/images/team/member.jpg"
  alt="Team member name"
  width={400}
  height={400}
  className="rounded-lg"
  priority={false} // Only true for above-fold images
/>
```

**Lazy Loading:**
```tsx
// app/about/page.tsx
import dynamic from 'next/dynamic';

const TeamSection = dynamic(() =>
  import('@/components/about/team-section').then(mod => ({ default: mod.TeamSection })),
  { loading: () => <TeamSectionSkeleton /> }
);
```

**Code Splitting:**
```tsx
// Split large components
const GoogleMapEmbed = dynamic(
  () => import('@/components/shared/google-map-embed'),
  { ssr: false } // Disable SSR for client-only libraries
);
```

**Memoization:**
```tsx
const filteredStores = useMemo(() => {
  return stores.filter(s => s.name.includes(query));
}, [stores, query]);

const sortedStores = useMemo(() => {
  return [...filteredStores].sort((a, b) => a.distance - b.distance);
}, [filteredStores]);
```

### 5. SEO Implementation

**Page Metadata:**
```typescript
// app/about/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Pizza Space',
  description: 'Learn about Pizza Space - Our story, mission, values, and the team behind authentic Italian pizza in London.',
  keywords: ['about pizza space', 'our story', 'pizza restaurant team', 'Italian pizza London'],
  openGraph: {
    title: 'About Pizza Space | Our Story & Mission',
    description: 'Discover the passion and people behind Pizza Space. Authentic Italian pizza made with love.',
    url: 'https://pizzaspace.co.uk/about',
    images: ['/images/about/og-about.jpg'],
  },
};
```

**Structured Data:**
```tsx
// components/about/json-ld.tsx
export function AboutPageJsonLd() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Pizza Space',
    description: 'Learn about our journey...',
    mainEntity: {
      '@type': 'Organization',
      name: 'Pizza Space',
      foundingDate: '2020',
      founders: [/* ... */],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
```

### 6. Error Handling

**Server Component Errors:**
```typescript
async function fetchStores() {
  try {
    const response = await getStores();
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch stores:', error);
    // Return fallback data
    return [];
  }
}
```

**Client Component Errors:**
```tsx
'use client';

import { toast } from 'sonner';

function ContactForm() {
  const onSubmit = async (data: FormData) => {
    try {
      const response = await submitContactForm(data);
      if (response.success) {
        toast.success('Message sent successfully!');
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Form submission error:', error);
    }
  };
}
```

**Error Boundaries:**
```tsx
// app/about/error.tsx
'use client';

export default function AboutError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <button onClick={reset} className="btn-primary">Try again</button>
      </div>
    </div>
  );
}
```

### 7. Testing Checklist

**Before Deployment:**
- [ ] All sections render correctly on desktop (1920px, 1440px, 1024px)
- [ ] Mobile responsive (375px, 414px, 768px)
- [ ] Dark mode works across all components
- [ ] Forms validate correctly (client + server)
- [ ] Google Maps loads and interactions work
- [ ] Lazy loading triggers appropriately
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] ESLint passes (run `npm run lint`)
- [ ] Build succeeds (run `npm run build`)
- [ ] Lighthouse scores: Performance >90, Accessibility 100, SEO 100
- [ ] Images have proper alt text
- [ ] Links have descriptive text
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works
- [ ] Screen reader testing (NVDA/VoiceOver)

### 8. Implementation Priority

**Phase 1: About Page (Days 1-3)**
1. Hero section
2. Story section
3. Vision/Mission section
4. Stores preview (reuse carousel)
5. Team section
6. Testimonials (reuse component)

**Phase 2: Contact Page (Days 4-5)**
1. Hero section
2. Contact info panel
3. Contact form with validation
4. Google Maps integration
5. CTA section

**Phase 3: Stores Page (Days 6-8)**
1. Hero section
2. Filter bar
3. Google Maps with markers
4. Stores grid
5. Reservation section (reuse form)
6. Search and filter logic
7. Geolocation feature

**Phase 4: Polish & Testing (Day 9-10)**
1. Cross-browser testing
2. Mobile responsiveness fixes
3. Accessibility audit
4. Performance optimization
5. SEO metadata
6. Final QA

---

## Additional Notes

### Environment Variables Required

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
NEXT_PUBLIC_API_BASE_URL=https://api.pizzaspace.co.uk

# Email service (for contact form)
RESEND_API_KEY=your_resend_key
CONTACT_EMAIL_TO=support@pizzaspace.co.uk
```

### Third-Party Libraries

**Required:**
- `@react-google-maps/api` - Google Maps integration
- `react-hook-form` - Form management (already installed)
- `zod` - Schema validation (already installed)
- `framer-motion` - Animations (already installed)
- `lucide-react` - Icons (already installed)
- `sonner` - Toast notifications (already installed)

**Optional (Consider for Future):**
- `@tanstack/react-query` - Advanced data fetching
- `embla-carousel-react` - Custom carousels (if needed)
- `react-intersection-observer` - Scroll animations helper

### Design Tokens

**Spacing Scale:**
```typescript
// Follow Tailwind spacing
py-20 sm:py-24 lg:py-32 // Sections
gap-8 lg:gap-12 // Grid gaps
space-y-6 // Vertical stacking
```

**Typography Scale:**
```typescript
// Headings
h1: "text-4xl sm:text-5xl lg:text-6xl font-bold"
h2: "text-3xl sm:text-4xl lg:text-5xl font-bold"
h3: "text-2xl sm:text-3xl lg:text-4xl font-semibold"
h4: "text-xl sm:text-2xl font-semibold"

// Body
lead: "text-lg sm:text-xl"
body: "text-base"
small: "text-sm"
```

**Border Radius:**
```typescript
card: "rounded-2xl"
button: "rounded-lg"
input: "rounded-lg"
badge: "rounded-full"
```

### Git Workflow

**Branch Strategy:**
```bash
main (production)
├── feature/about-page
├── feature/contact-page
└── feature/stores-page
```

**Commit Messages:**
```
feat(about): add hero section with breadcrumb navigation
feat(contact): implement contact form with Zod validation
feat(stores): integrate Google Maps with store markers
fix(about): resolve dark mode styling issue in team section
style(contact): improve mobile responsiveness
docs(architecture): update component specifications
```

### Code Review Checklist

**Architecture:**
- [ ] Server/Client components used appropriately
- [ ] Props interfaces properly typed
- [ ] No unnecessary 'use client' directives
- [ ] Proper component composition

**Code Quality:**
- [ ] No unused imports or variables
- [ ] Consistent naming conventions
- [ ] Proper error handling
- [ ] Meaningful comments for complex logic

**Performance:**
- [ ] Images optimized (CustomImage component)
- [ ] Lazy loading implemented for below-fold
- [ ] Memoization used where appropriate
- [ ] No unnecessary re-renders

**UX:**
- [ ] Loading states for async operations
- [ ] Error states with user-friendly messages
- [ ] Empty states for no data scenarios
- [ ] Success feedback for user actions

---

## Conclusion

This architecture document provides a comprehensive blueprint for implementing the About, Contact, and Stores pages for Pizza Space. The design follows Next.js 16 best practices, leverages Server Components for performance, and maintains consistency with the existing home page design system.

**Key Success Factors:**
1. Strict adherence to Server/Client component boundaries
2. Reuse of existing components (ReservationForm, TestimonialsCarousel, StoreCard)
3. Performance-first approach with lazy loading and optimization
4. Accessibility compliance from the start
5. Type-safe implementation with comprehensive TypeScript interfaces

**Next Steps:**
1. Review and approve architecture
2. Set up required environment variables
3. Install additional dependencies (Google Maps)
4. Begin Phase 1 implementation (About page)
5. Iterate with user feedback and testing

For questions or clarifications on this architecture, refer to the component specifications and TypeScript interfaces sections.
