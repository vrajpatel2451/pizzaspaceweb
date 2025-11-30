# Component Tree Diagrams - Spec3 Pages

Visual representation of component hierarchies and data flow for About, Contact, and Stores pages.

---

## About Page Component Tree

```
AboutPage (Server Component) 📄
│
├─ Metadata & SEO (Server)
│  ├─ Page Title: "About Us | Pizza Space"
│  ├─ Meta Description
│  ├─ Open Graph Tags
│  └─ JSON-LD Structured Data
│
├─ 1️⃣ AboutHeroSection (Server) ⚡ IMMEDIATE
│  ├─ Container (Server)
│  │  ├─ BreadcrumbNav (Client) 🎯
│  │  ├─ Hero Heading (Server)
│  │  ├─ Hero Description (Server)
│  │  └─ Scroll Indicator (Server)
│  └─ BackgroundShapes (Client) 🎯 Framer Motion
│
├─ 2️⃣ AboutStorySection (Server) ⏱️ LAZY
│  ├─ Container (Server)
│  ├─ Grid Layout (2 columns)
│  │  ├─ Left: StoryContent (Server)
│  │  │  ├─ Section Header
│  │  │  ├─ Story Paragraphs
│  │  │  └─ FeatureList (Server)
│  │  └─ Right: StoryComponents (Mixed)
│  │     ├─ StoryImage (Server) CustomImage
│  │     └─ Timeline (Client) 🎯 Scroll animations
│  └─ FloatingDecorations (Client) 🎯
│
├─ 3️⃣ VisionMissionSection (Server) ⏱️ LAZY
│  ├─ Container (Server)
│  ├─ Section Header (Server)
│  ├─ Main Cards Grid
│  │  ├─ VisionCard (Client) 🎯 Hover animations
│  │  └─ MissionCard (Client) 🎯 Hover animations
│  └─ Values Grid (Server)
│     └─ ValueCard × 4 (Client) 🎯 Icon + hover
│
├─ 4️⃣ OurStoresPreview (Server) ⏱️ LAZY [DATA: API]
│  ├─ Container (Server)
│  ├─ Section Header (Server)
│  │  └─ Store Count Badge (Server)
│  ├─ StoresCarousel (Client) 🎯 Touch/drag
│  │  └─ StorePreviewCard × 6 (Server)
│  │     ├─ Store Image
│  │     ├─ Store Name & Location
│  │     └─ View Details Button
│  └─ ViewAllStoresButton (Server)
│
├─ 5️⃣ TeamSection (Server) ⏱️ LAZY
│  ├─ Container (Server)
│  ├─ Section Header (Server)
│  └─ TeamGrid (Server)
│     └─ TeamMemberCard × 8 (Client) 🎯
│        ├─ Member Photo (CustomImage)
│        ├─ Name & Role
│        ├─ Hover: Bio reveal
│        └─ Social Links (optional)
│
└─ 6️⃣ AboutTestimonials (Server) ⏱️ LAZY
   └─ TestimonialsCarousel (Client) 🎯 REUSED
      └─ TestimonialCard × N
```

### Legend
- 📄 = Page component
- 🎯 = Client Component ('use client')
- ⚡ = Immediate load (above-fold)
- ⏱️ = Lazy loaded (dynamic import)
- [DATA: API] = Fetches from API

### Data Flow - About Page

```
Server (Initial Request)
  ↓
  Fetch featured stores (API: /store?limit=6)
  ↓
  Render static content (hero, story, team)
  ↓
  Pass store data as props to OurStoresPreview
  ↓
Client (Hydration)
  ↓
  Mount client components (animations, carousel)
  ↓
  Lazy load below-fold sections
  ↓
  Interactive features (hover, scroll animations)
```

---

## Contact Page Component Tree

```
ContactPage (Server Component) 📄
│
├─ Metadata & SEO (Server)
│  ├─ Page Title: "Contact Us | Pizza Space"
│  ├─ Meta Description
│  └─ ContactPage JSON-LD
│
├─ 1️⃣ ContactHeroSection (Server) ⚡ IMMEDIATE
│  ├─ Container (Server)
│  │  ├─ BreadcrumbNav (Client) 🎯
│  │  ├─ Hero Heading (Server)
│  │  ├─ Hero Description (Server)
│  │  └─ Contact Hours Badge (Server)
│  └─ BackgroundGradient (Server)
│
├─ 2️⃣ ContactContentSection (Server) ⚡ IMMEDIATE
│  ├─ Container (Server)
│  ├─ Three-Column Grid (Desktop) → Stacked (Mobile)
│  │
│  │  ├─ Left Column: ContactInfoPanel (Server)
│  │  │  ├─ ContactCard: Phone (Server)
│  │  │  │  ├─ Icon
│  │  │  │  ├─ Main: +44 20 1234 5678
│  │  │  │  └─ Support: +44 20 8765 4321
│  │  │  ├─ ContactCard: Email (Server)
│  │  │  │  ├─ Icon
│  │  │  │  ├─ General: hello@pizzaspace.co.uk
│  │  │  │  ├─ Support: support@pizzaspace.co.uk
│  │  │  │  └─ Careers: careers@pizzaspace.co.uk
│  │  │  ├─ ContactCard: Address (Server)
│  │  │  │  ├─ Icon
│  │  │  │  ├─ HQ Address
│  │  │  │  └─ Opening Hours
│  │  │  └─ SocialLinks (Server)
│  │  │     ├─ Facebook
│  │  │     ├─ Instagram
│  │  │     ├─ Twitter
│  │  │     └─ LinkedIn
│  │  │
│  │  ├─ Middle Column: ContactFormPanel (Client) 🎯
│  │  │  └─ ContactForm (Client) 🎯
│  │  │     ├─ Form Header
│  │  │     ├─ Success/Error Messages (AnimatePresence)
│  │  │     ├─ Form Fields
│  │  │     │  ├─ Full Name (Input) [required]
│  │  │     │  ├─ Email (Input) [required, email validation]
│  │  │     │  ├─ Phone (Input) [optional, UK format]
│  │  │     │  ├─ Subject (Select) [required]
│  │  │     │  │  └─ Options: General, Order, Feedback, Partnership, Other
│  │  │     │  ├─ Message (TextArea) [required, 10-500 chars]
│  │  │     │  └─ Privacy Policy (Checkbox) [required]
│  │  │     ├─ Validation (Zod Schema)
│  │  │     ├─ Submit Handler (Server Action)
│  │  │     └─ Submit Button (Loading state)
│  │  │
│  │  └─ Right Column: MapPanel (Client) 🎯
│  │     └─ GoogleMapEmbed (Client) 🎯
│  │        ├─ Map Container
│  │        ├─ Store Markers × N [DATA: Stores API]
│  │        ├─ Info Windows (Click marker)
│  │        │  ├─ Store Name
│  │        │  ├─ Address
│  │        │  ├─ Phone
│  │        │  └─ Get Directions Link
│  │        └─ Map Controls (Zoom, Pan)
│  │
│  └─ Mobile: Tabbed Layout
│     ├─ Tab 1: Contact Info
│     ├─ Tab 2: Contact Form
│     └─ Tab 3: Map
│
└─ 3️⃣ ContactCTASection (Server) ⚡ IMMEDIATE
   ├─ Container (Server)
   ├─ Section Header (Server)
   └─ QuickLinksGrid (Server)
      ├─ CTA Card: Visit Stores
      │  ├─ Icon (MapPin)
      │  ├─ Title
      │  └─ Link to /stores
      ├─ CTA Card: View Menu
      │  ├─ Icon (UtensilsCrossed)
      │  ├─ Title
      │  └─ Link to /menu
      └─ CTA Card: FAQs
         ├─ Icon (HelpCircle)
         ├─ Title
         └─ Link to /faqs
```

### Form Submission Flow

```
User fills form
  ↓
Client-side validation (Zod)
  ↓
  Valid? → Submit to Server Action
  ↓
Server Action: submitContactForm()
  ↓
  ├─ Server-side validation (Zod)
  ├─ Send email (Resend/SendGrid)
  ├─ Log to database (optional)
  └─ Return response
  ↓
Client receives response
  ↓
  Success? → Show success toast + reset form
  Error? → Show error toast + keep data
```

### Google Maps Integration

```
ContactPage (Server)
  ↓
  Fetch all stores (API)
  ↓
  Pass stores to MapPanel (Client)
  ↓
Client Component: GoogleMapEmbed
  ↓
  Load Google Maps SDK (@react-google-maps/api)
  ↓
  Initialize map with stores
  ↓
  Render markers for each store
  ↓
User clicks marker
  ↓
  Show InfoWindow with store details
  ↓
User clicks "Get Directions"
  ↓
  Open Google Maps with directions
```

---

## Stores Page Component Tree

```
StoresPage (Server Component) 📄 [DATA: API]
│
├─ Metadata & SEO (Server)
│  ├─ Page Title: "Our Stores | Pizza Space"
│  ├─ Meta Description
│  └─ LocalBusiness JSON-LD × N
│
├─ Server Data Fetch
│  └─ getStores({ isActive: true }) → All stores
│
├─ 1️⃣ StoresHeroSection (Server) ⚡ IMMEDIATE
│  ├─ Container (Server)
│  │  ├─ BreadcrumbNav (Client) 🎯
│  │  ├─ Hero Heading (Server)
│  │  ├─ Hero Description (Server)
│  │  └─ StoreCountBadge (Server)
│  │     └─ "15 Locations Across London"
│  └─ Background (Server)
│
├─ 2️⃣ StoresMapSection (Client) 🎯 ⚡ IMMEDIATE [INTERACTIVE]
│  │
│  │  Props: initialStores (from server)
│  │
│  ├─ Client State Management
│  │  ├─ useState: stores (from props)
│  │  ├─ useState: searchQuery
│  │  ├─ useState: userLocation (lat, lng)
│  │  ├─ useState: selectedStoreId
│  │  └─ useMemo: filteredStores, storesWithDistance
│  │
│  ├─ FilterBar (Client) 🎯
│  │  ├─ Container
│  │  ├─ SearchInput (Client) 🎯
│  │  │  ├─ Icon (Search)
│  │  │  ├─ Input (controlled)
│  │  │  └─ Clear button
│  │  ├─ LocationFilter (Client) 🎯
│  │  │  ├─ Button: "Use My Location"
│  │  │  ├─ Geolocation API
│  │  │  └─ Loading spinner
│  │  └─ ClearFilters (Client) 🎯
│  │     └─ Show if: searchQuery || userLocation
│  │
│  ├─ Desktop Layout: Split View (50/50)
│  │  │
│  │  ├─ Left Panel: InteractiveMap (Client) 🎯
│  │  │  ├─ GoogleMap Component
│  │  │  │  ├─ Center: Auto-fit bounds
│  │  │  │  ├─ Zoom: Dynamic
│  │  │  │  └─ Libraries: ['places', 'geometry']
│  │  │  ├─ Markers
│  │  │  │  ├─ StoreMarker × N (Client) 🎯
│  │  │  │  │  ├─ Position: { lat, lng }
│  │  │  │  │  ├─ Icon: Custom pizza icon
│  │  │  │  │  ├─ onClick: setSelectedStore + highlight in list
│  │  │  │  │  └─ Selected: Different color
│  │  │  │  └─ UserLocationMarker (if location enabled)
│  │  │  ├─ MarkerClusterer (if >10 stores)
│  │  │  │  └─ Custom cluster icons
│  │  │  └─ InfoWindow (on marker click)
│  │  │     ├─ Store Name
│  │  │     ├─ Address
│  │  │     ├─ Phone (click to call)
│  │  │     ├─ Distance (if user location)
│  │  │     ├─ "Get Directions" button
│  │  │     └─ "Make Reservation" button
│  │  │
│  │  └─ Right Panel: StoresList (Client) 🎯
│  │     ├─ Stores Count Header
│  │     │  └─ "Showing 15 stores" (filtered count)
│  │     ├─ StoresGrid (Client) 🎯
│  │     │  └─ StoreCard × N (Server via props)
│  │     │     ├─ Store Image (CustomImage)
│  │     │     ├─ Store Name
│  │     │     ├─ Address (line1, area, city, postcode)
│  │     │     ├─ Distance Badge (if userLocation)
│  │     │     ├─ Phone Number (click to call)
│  │     │     ├─ Operating Hours
│  │     │     ├─ "Get Directions" button
│  │     │     │  └─ Opens: Google Maps with directions
│  │     │     ├─ "Make Reservation" button
│  │     │     │  └─ Action: Scroll to form + preselect store
│  │     │     └─ onClick: Highlight on map
│  │     └─ NoResultsState (Server)
│  │        ├─ Empty state illustration
│  │        ├─ "No stores found"
│  │        └─ "Try adjusting your search"
│  │
│  └─ Mobile Layout: Tabs (Client) 🎯
│     ├─ Tab Button: "Map View"
│     ├─ Tab Button: "List View"
│     ├─ Tab Content: Map (same as desktop)
│     └─ Tab Content: List (same as desktop)
│
└─ 3️⃣ ReservationSection (Server) ⏱️ LAZY
   ├─ Container (Server)
   ├─ Section Header (Server)
   │  ├─ "Make a Reservation"
   │  └─ "Book your table at any location"
   └─ ReservationForm (Client) 🎯 REUSED
      ├─ Props: stores (from server)
      ├─ Props: preselectedStoreId (from URL or click)
      └─ Form Fields (same as home page)
```

### State Management - Stores Page

```typescript
// StoresMapSection (Client Component)

// Server props
interface StoresMapSectionProps {
  initialStores: StoreResponse[]; // Fetched on server
}

// Client state
const [stores, setStores] = useState(initialStores);
const [searchQuery, setSearchQuery] = useState('');
const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

// Computed state (useMemo)
const filteredStores = useMemo(() => {
  return stores.filter(store =>
    store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
    store.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [stores, searchQuery]);

const storesWithDistance = useMemo(() => {
  if (!userLocation) return filteredStores;

  return filteredStores.map(store => ({
    ...store,
    distance: calculateDistance(
      userLocation,
      { lat: store.lat, lng: store.long }
    )
  })).sort((a, b) => a.distance - b.distance);
}, [filteredStores, userLocation]);
```

### User Interactions Flow

```
SCENARIO 1: Search for a store
  ↓
User types in search input → setSearchQuery('Camden')
  ↓
useMemo recalculates filteredStores
  ↓
Map updates to show only matching markers
  ↓
List updates to show only matching cards

SCENARIO 2: Use my location
  ↓
User clicks "Use My Location" button
  ↓
Request browser geolocation
  ↓
  Granted? → setUserLocation({ lat, lng })
  ↓
useMemo recalculates storesWithDistance
  ↓
List re-sorts by distance (nearest first)
  ↓
Map adds user location marker
  ↓
Cards show distance badges (e.g., "1.2 miles")

SCENARIO 3: Click marker on map
  ↓
User clicks store marker
  ↓
setSelectedStoreId(storeId)
  ↓
Map shows InfoWindow for that store
  ↓
List scrolls to and highlights matching card

SCENARIO 4: Make reservation from card
  ↓
User clicks "Make Reservation" on store card
  ↓
Scroll to ReservationSection (smooth)
  ↓
Pre-populate store selector with clicked store
  ↓
Focus on date field
```

### Filter & Search Logic

```typescript
// Search implementation
const handleSearchChange = (query: string) => {
  setSearchQuery(query);
  // Auto-clear selected store if filtered out
  if (selectedStoreId) {
    const stillVisible = filteredStores.some(s => s._id === selectedStoreId);
    if (!stillVisible) setSelectedStoreId(null);
  }
};

// Geolocation implementation
const handleGetLocation = () => {
  if (!navigator.geolocation) {
    toast.error('Geolocation not supported');
    return;
  }

  setLocationLoading(true);
  navigator.geolocation.getCurrentPosition(
    (position) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      toast.success('Location updated');
      setLocationLoading(false);
    },
    (error) => {
      toast.error('Failed to get location');
      setLocationLoading(false);
    }
  );
};

// Distance calculation (Haversine formula)
function calculateDistance(
  from: Coordinates,
  to: Coordinates
): number {
  const R = 3959; // Earth radius in miles
  const dLat = toRad(to.lat - from.lat);
  const dLon = toRad(to.lng - from.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.lat)) * Math.cos(toRad(to.lat)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in miles
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}
```

---

## Shared Components Reuse Map

### Components Reused Across Pages

```
┌─────────────────────────────────────────────────────────┐
│                  SHARED COMPONENTS                       │
└─────────────────────────────────────────────────────────┘

1. BreadcrumbNav (Client)
   ├─ About Page: Home > About
   ├─ Contact Page: Home > Contact
   └─ Stores Page: Home > Stores

2. ReservationForm (Client)
   ├─ Home Page: Full form
   ├─ Stores Page: Full form + preselect store
   └─ Properties:
      ├─ stores: StoreResponse[]
      ├─ preselectedStoreId?: string
      └─ React Hook Form + Zod validation

3. TestimonialsCarousel (Client)
   ├─ Home Page: Default testimonials
   ├─ About Page: Same or subset
   └─ Properties:
      ├─ testimonials?: Testimonial[]
      ├─ autoplay?: boolean
      └─ variant?: 'default' | 'compact'

4. StoreCard (Server)
   ├─ About Page: Preview variant (minimal)
   ├─ Stores Page: Detailed variant (full info)
   └─ Properties:
      ├─ store: StoreResponse
      ├─ showDistance?: boolean
      ├─ distance?: number
      ├─ onReserveClick?: (id: string) => void
      └─ variant?: 'preview' | 'detailed'

5. GoogleMapEmbed (Client)
   ├─ Contact Page: All stores + info windows
   ├─ Stores Page: Interactive with filtering
   └─ Properties:
      ├─ stores: StoreResponse[]
      ├─ center?: Coordinates
      ├─ zoom?: number
      ├─ interactive?: boolean
      ├─ onMarkerClick?: (id: string) => void
      └─ selectedStoreId?: string

6. SectionHeader (Server)
   ├─ All pages: Section titles
   └─ Properties:
      ├─ title: string
      ├─ subtitle?: string
      ├─ badge?: string
      └─ alignment?: 'left' | 'center' | 'right'

7. CustomImage (from UI library)
   ├─ All images across all pages
   └─ Wrapper around next/image with error handling
```

---

## Performance Optimization Strategy

### Loading Priority

```
┌─────────────────────────────────────────────────────────┐
│                   LOADING STRATEGY                       │
└─────────────────────────────────────────────────────────┘

ABOUT PAGE
  ⚡ Immediate (Critical Path)
    └─ Hero Section (static)

  ⏱️ Lazy Load (Below Fold)
    ├─ Story Section (dynamic import)
    ├─ Vision/Mission (dynamic import)
    ├─ Stores Preview (dynamic import + API data)
    ├─ Team Section (dynamic import)
    └─ Testimonials (dynamic import)

CONTACT PAGE
  ⚡ Immediate (Entire Page - Lightweight)
    ├─ Hero Section
    ├─ Contact Content (static info + form + map)
    └─ CTA Section

  Note: No lazy loading needed (simple page)

STORES PAGE
  ⚡ Immediate (Critical + Interactive)
    ├─ Hero Section (static)
    └─ Map Section (interactive - needs immediate load)

  ⏱️ Lazy Load
    └─ Reservation Section (below fold)

```

### Bundle Size Optimization

```
Technique 1: Dynamic Imports
  ├─ AboutPage sections → 5 separate chunks
  ├─ Framer Motion → Only in client components
  └─ Google Maps → Lazy load with SSR: false

Technique 2: Code Splitting by Route
  ├─ /about → about.chunk.js
  ├─ /contact → contact.chunk.js
  └─ /stores → stores.chunk.js + google-maps.chunk.js

Technique 3: Tree Shaking
  ├─ Import specific icons: import { MapPin } from 'lucide-react'
  ├─ Import specific utilities: import { cn } from '@/lib/utils'
  └─ Avoid: import * as Icons from 'lucide-react'

Technique 4: Image Optimization
  ├─ All images via CustomImage component
  ├─ Lazy load below-fold images
  ├─ Use appropriate sizes (no oversized images)
  └─ Enable blur placeholders for LCP images
```

### Data Fetching Optimization

```
Server Components (Zero Client JS)
  ├─ Static content sections
  ├─ Initial data fetch (stores, contact info)
  └─ SEO-critical content

Client Components (Minimal JS)
  ├─ Only for interactive features
  ├─ Use useMemo for expensive computations
  └─ Debounce search inputs

API Calls
  ├─ Server: Direct API calls in Server Components
  ├─ Client: Only for user-triggered actions
  └─ Cache: Implement revalidation strategy
```

---

## Mobile Responsive Breakpoints

```
┌─────────────────────────────────────────────────────────┐
│               RESPONSIVE BREAKPOINTS                     │
└─────────────────────────────────────────────────────────┘

Tailwind Breakpoints:
  sm:  640px  (Small tablets)
  md:  768px  (Tablets)
  lg:  1024px (Small laptops)
  xl:  1280px (Desktops)
  2xl: 1536px (Large desktops)

LAYOUT CHANGES

About Page:
  Mobile (<768px):
    ├─ Story: Stack content → image → timeline
    ├─ Vision/Mission: Single column cards
    ├─ Values: 2 columns → 1 column
    ├─ Team: 1 column cards
    └─ Stores Carousel: 1 visible, swipe

  Tablet (768px - 1024px):
    ├─ Story: 2 column layout maintained
    ├─ Values: 2 columns
    ├─ Team: 2 columns
    └─ Stores Carousel: 2 visible

  Desktop (>1024px):
    ├─ All sections: Full layout
    ├─ Values: 4 columns
    ├─ Team: 3 columns
    └─ Stores Carousel: 3-4 visible

Contact Page:
  Mobile (<768px):
    ├─ Stacked: Info → Form → Map
    ├─ Map height: 300px
    └─ Form: Full width inputs

  Tablet (768px - 1024px):
    ├─ 2 columns: Info + Form
    ├─ Map: Full width below
    └─ Map height: 400px

  Desktop (>1024px):
    ├─ 3 columns: Info | Form | Map
    └─ Map height: 100% of section

Stores Page:
  Mobile (<768px):
    ├─ Tabs: "Map View" | "List View"
    ├─ Filter bar: Stack vertically
    ├─ Map: Full screen in tab
    ├─ List: Full screen in tab
    └─ Cards: 1 column

  Tablet (768px - 1024px):
    ├─ Split view: Map (40%) | List (60%)
    ├─ Filter bar: Horizontal
    └─ Cards: 2 columns

  Desktop (>1024px):
    ├─ Split view: Map (50%) | List (50%)
    ├─ Filter bar: Horizontal with spacing
    └─ Cards: 2-3 columns
```

---

## Accessibility Features Map

```
┌─────────────────────────────────────────────────────────┐
│            ACCESSIBILITY IMPLEMENTATION                  │
└─────────────────────────────────────────────────────────┘

Keyboard Navigation:
  ├─ All interactive elements: Tab order
  ├─ Carousel controls: Arrow keys
  ├─ Map: Keyboard controls enabled
  ├─ Forms: Tab through fields + Enter submit
  └─ Modals: Focus trap + Escape to close

Screen Reader Support:
  ├─ Semantic HTML: <section>, <nav>, <main>
  ├─ ARIA labels: aria-label, aria-labelledby
  ├─ ARIA live regions: Form success/error
  ├─ Image alt text: Descriptive for all images
  └─ Link text: Descriptive (no "click here")

Focus Management:
  ├─ Visible focus indicators (ring-2 ring-orange-500)
  ├─ Skip to main content link
  ├─ Focus on error fields (forms)
  └─ Return focus after modal close

Color Contrast:
  ├─ Text: WCAG AA minimum (4.5:1)
  ├─ Dark mode: Adjusted for contrast
  ├─ Buttons: High contrast states
  └─ Links: Distinguishable from text

Interactive Elements:
  ├─ Touch targets: Min 44x44px
  ├─ Button states: Hover, focus, active, disabled
  ├─ Loading indicators: aria-busy
  └─ Error messages: Associated with fields
```

---

## Summary

This document provides visual component trees and data flow diagrams for all three spec3 pages:

1. **About Page**: 6 sections with heavy use of animations and lazy loading
2. **Contact Page**: 3 sections with form handling and map integration
3. **Stores Page**: Interactive map/list with real-time filtering

**Key Architectural Decisions:**
- Server Components for static content and initial data
- Client Components only for interactivity
- Lazy loading for below-fold sections
- Comprehensive state management strategy
- Mobile-first responsive design
- Full accessibility compliance

**Next Steps:**
1. Review component trees with team
2. Confirm API data structures
3. Set up Google Maps API credentials
4. Begin implementation per priority order
5. Create component skeletons and loading states

For detailed prop interfaces and implementation guidelines, refer to the main architecture.md document.
