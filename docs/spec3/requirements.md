# Pizza Space Spec3 Pages - Requirements Documentation

## Project Overview

**Feature Name:** Pizza Space About, Contact, and Store Pages (Spec3)

**Technology Stack:**
- Next.js 16 with App Router
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- shadcn/ui (new-york style)
- Framer Motion for animations
- React Hook Form + Zod for validation

**Design System:**
- Primary Color: Orange (#F97316)
- Secondary Color: Navy (#0e182b)
- Dark/Light theme support required
- Mobile-first responsive design

---

## 1. ABOUT PAGE

### Page Structure (5 Sections)

#### 1.1 Hero Section
**Purpose:** Brand story introduction with visual impact

**Components Required:**
- Custom hero container with gradient backgrounds
- Animated headline with text gradient
- Decorative background shapes (similar to home hero)
- Floating decorative elements (pizza ingredients)
- Breadcrumb navigation

**Component Hierarchy:**
```
AboutHeroSection/
├── BackgroundDecorations (gradient orbs, patterns)
├── FloatingElements (tomato, basil, cheese illustrations)
├── HeroContent/
│   ├── Breadcrumb
│   ├── Headline (h1 with gradient text)
│   ├── Subtitle paragraph
│   └── ScrollIndicator
└── HeroImage (optional decorative pizza illustration)
```

**Implementation Notes:**
- Reuse BackgroundShapes pattern from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/hero-section/background-shapes.tsx
- Reuse FloatingCards animation pattern from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/hero-section/floating-cards.tsx
- Height: 60vh on mobile, 70vh on desktop
- Framer Motion: staggered fade-in animations
- Use CustomImage for any images

**Data Flow:**
- Static content (no API calls)
- Content stored in component or separate constants file

**Accessibility:**
- Semantic HTML5 section with aria-label
- Proper heading hierarchy (h1)
- Reduced motion support for animations
- High contrast ratios for text overlays

---

#### 1.2 Our Story Section
**Purpose:** Company history with timeline visualization

**Components Required:**
- Timeline component (vertical on mobile, horizontal on desktop)
- Story content cards with year markers
- Image gallery or slideshow
- Statistics counter (animated on scroll)

**Component Hierarchy:**
```
OurStorySection/
├── SectionHeader (overline + h2 + subtitle)
├── StoryContent/
│   ├── StoryText (rich content area)
│   └── StatsCounter (reuse from AboutSection)
│       ├── StatItem (years, pizzas sold, locations)
│       ├── StatItem
│       └── StatItem
└── Timeline/
    ├── TimelineItem (2020 - Founded)
    ├── TimelineItem (2021 - First expansion)
    ├── TimelineItem (2022 - Awards)
    └── TimelineItem (2024 - Multi-city presence)
```

**Implementation Notes:**
- Reuse stats counter from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/about-section/stats-counter.tsx
- Timeline: use CSS Grid for responsive layout
- Intersection Observer for scroll-triggered animations
- Use CustomImage for timeline images

**Data Flow:**
- Static timeline data stored in constants
- Optional: fetch company milestones from CMS (future enhancement)

**Accessibility:**
- Timeline marked as ordered list semantically
- ARIA labels for visual timeline connectors
- Focus management for keyboard navigation
- Screen reader announcements for stats

**Responsive Breakpoints:**
- Mobile (< 768px): Vertical timeline, stacked content
- Tablet (768px - 1024px): Horizontal timeline with wrapping
- Desktop (> 1024px): Full horizontal timeline

---

#### 1.3 Mission & Vision Section
**Purpose:** Detailed company values and aspirations

**Components Required:**
- Expanded mission/vision cards (larger than home version)
- Values grid (6-8 value cards)
- Background decorations

**Component Hierarchy:**
```
AboutMissionVisionSection/
├── BackgroundDecorations
├── SectionHeader
├── MissionVisionCards/
│   ├── MissionCard (expanded with icons)
│   └── VisionCard (expanded with icons)
└── ValuesGrid/
    ├── ValueCard (Quality - icon + title + description)
    ├── ValueCard (Community)
    ├── ValueCard (Authenticity)
    ├── ValueCard (Innovation)
    ├── ValueCard (Sustainability)
    └── ValueCard (Hospitality)
```

**Implementation Notes:**
- Extend MissionCard from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/mission-vision-section/mission-card.tsx
- Add more content fields: long description, list of points, supporting images
- Cards use shadcn Card component as base (if available, otherwise custom)
- Lucide icons for each value (Target, Eye, Heart, Sparkles, Leaf, Users)
- Hover effects: scale, shadow, border glow

**Data Flow:**
- Static content
- Values stored in array of objects with icon, title, description

**Accessibility:**
- Semantic section with proper headings
- Icon decorative role with text alternatives
- Keyboard navigable cards
- ARIA descriptions for complex visuals

**Animation Requirements:**
- Staggered fade-in on scroll (0.1s delay between cards)
- Hover: smooth scale transform (scale: 1.02)
- Background gradient shift on hover

---

#### 1.4 Team Section
**Purpose:** Showcase team members with roles and bios

**Components Required:**
- Team grid layout
- Team member cards with photos
- Modal/drawer for detailed bios (optional)
- Filter by department (optional)

**Component Hierarchy:**
```
TeamSection/
├── SectionHeader
├── DepartmentFilter (optional tabs)
│   ├── Tab (All)
│   ├── Tab (Leadership)
│   ├── Tab (Kitchen)
│   └── Tab (Service)
└── TeamGrid/
    ├── TeamMemberCard/
    │   ├── CustomImage (photo with fallback)
    │   ├── Name (h3)
    │   ├── Role (subtitle)
    │   ├── ShortBio (truncated)
    │   └── SocialLinks (LinkedIn, Twitter - optional)
    ├── TeamMemberCard
    └── TeamMemberCard (4-8 members)
```

**Implementation Notes:**
- Use shadcn Tabs component for department filter if needed
- Card hover: lift effect with shadow
- Photos: aspect ratio 1:1, rounded corners
- Fallback avatar if image fails (CustomImage built-in)
- Optional: Dialog component for full bio on click

**Data Flow:**
- Static team data array
- Optional: future CMS integration

**Accessibility:**
- Semantic heading for each team member
- Alt text for all photos
- Keyboard accessible tabs
- Focus visible states

**Responsive Breakpoints:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

---

#### 1.5 Stores Preview Section
**Purpose:** Highlight stores with CTA to dedicated stores page

**Components Required:**
- Store preview cards (3 featured stores)
- CTA button linking to /stores
- Map preview (optional)

**Component Hierarchy:**
```
StoresPreviewSection/
├── SectionHeader
├── StoresPreviewGrid/
│   ├── StoreCard (reuse from home, simplified)
│   ├── StoreCard
│   └── StoreCard
└── CTAButton (link to /stores)
```

**Implementation Notes:**
- Reuse StoreCard from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/store-card.tsx
- Show only 3 featured/flagship stores
- Display: store image, name, address, hours, "View Details" link
- CTA button: prominent, centered, with arrow icon

**Data Flow:**
- Fetch from API: getStores({ featured: true, limit: 3 })
- Fallback to empty state if API fails

**Accessibility:**
- Proper link semantics for cards
- Descriptive button text
- Store hours in time element

---

## 2. CONTACT PAGE

### Page Structure (3 Sections)

#### 2.1 Compact Hero Section
**Purpose:** Contact page introduction

**Components Required:**
- Minimal hero with headline and subtitle
- Background pattern (subtle)

**Component Hierarchy:**
```
ContactHeroSection/
├── BackgroundPattern
└── HeroContent/
    ├── Breadcrumb
    ├── Headline (h1)
    └── Subtitle
```

**Implementation Notes:**
- Height: 40vh max
- Simplified version of about hero
- No floating elements, minimal decoration
- Focus on clarity and quick access to contact methods

**Data Flow:**
- Static content

**Accessibility:**
- Semantic heading structure
- Skip link to contact form

---

#### 2.2 Contact Info + Form Section
**Purpose:** Two-column layout with info and form

**Components Required:**
- Contact information cards
- Contact form with validation
- Social media links
- Business hours display

**Component Hierarchy:**
```
ContactMainSection/
├── ContactInfoColumn/
│   ├── ContactCard (Phone)/
│   │   ├── Icon (Phone from lucide)
│   │   ├── Label
│   │   └── Value (clickable tel: link)
│   ├── ContactCard (Email)/
│   │   ├── Icon (Mail)
│   │   ├── Label
│   │   └── Value (clickable mailto: link)
│   ├── ContactCard (Address)/
│   │   ├── Icon (MapPin)
│   │   ├── Label
│   │   └── Value
│   ├── BusinessHours/
│   │   ├── Title
│   │   └── HoursList (Monday-Sunday)
│   └── SocialLinks/
│       ├── SocialIcon (Facebook)
│       ├── SocialIcon (Instagram)
│       ├── SocialIcon (Twitter)
│       └── SocialIcon (TikTok)
└── ContactFormColumn/
    └── ContactForm (reuse from home, enhanced)
```

**Implementation Notes:**
- Reuse ContactForm from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/contact-section/contact-form.tsx
- Enhance with additional subject options: "General", "Order Issue", "Feedback", "Partnership", "Careers"
- Use existing shadcn components: Input, TextArea, Select, Checkbox, Button
- Validation: React Hook Form + Zod
- Success/error states with Sonner toast
- Loading state on submit

**Existing Form Schema:**
```typescript
{
  fullName: string (min 2, max 50)
  email: string (email format)
  phone: string (optional, UK format)
  subject: string (required)
  message: string (min 10, max 500)
  acceptPrivacy: boolean (must be true)
}
```

**Data Flow:**
- Form submission: POST to /api/contact
- Success: show toast, reset form
- Error: show error message, keep form data

**Accessibility:**
- Form labels properly associated
- Error messages announced to screen readers
- Required fields marked with aria-required
- Focus management after submission
- High contrast for error states

**Responsive Breakpoints:**
- Mobile: Stacked (form first, then info)
- Desktop: Two columns (info left, form right)

---

#### 2.3 Map Section
**Purpose:** Google Maps with all store locations

**Components Required:**
- Google Maps embed or Google Maps JavaScript API
- Store markers with info windows
- Legend/list of stores (synchronized with map)

**Component Hierarchy:**
```
ContactMapSection/
├── SectionHeader
├── MapContainer/
│   ├── GoogleMap/
│   │   ├── StoreMarker (custom icon)
│   │   ├── StoreMarker
│   │   └── StoreMarker
│   └── InfoWindow (on marker click)
│       ├── StoreName
│       ├── StoreAddress
│       ├── StorePhone
│       └── DirectionsLink
└── StoresList (sidebar or below)/
    ├── StoreListItem (clickable, centers map)
    ├── StoreListItem
    └── StoreListItem
```

**Implementation Notes:**
- Use @react-google-maps/api or next-google-maps
- API Key stored in environment variables
- Custom marker icon: pizza slice or brand logo
- Info window: store name, address, phone, "Get Directions" link
- Map style: match theme (light/dark)
- Default center: UK center or first store location
- Zoom level: fit all markers

**Data Flow:**
- Fetch stores: getStores({ isActive: true })
- Extract lat/lng from store data
- Pass to map component

**Accessibility:**
- Keyboard accessible map controls
- List alternative to map interaction
- ARIA labels for markers
- Text alternative for map content

**State Management:**
- Selected store state (shared between map and list)
- Map center and zoom state
- Loading state while fetching stores

**Responsive Breakpoints:**
- Mobile: Map full width, list below
- Desktop: Map with sidebar list or full width with list below

---

## 3. STORE PAGE

### Page Structure (3 Sections)

#### 3.1 Hero + Interactive Map Section
**Purpose:** Combined hero with Google Maps integration

**Components Required:**
- Hero content with search/filter
- Full Google Maps with all stores
- Interactive markers

**Component Hierarchy:**
```
StorePageHeroSection/
├── HeroContent/
│   ├── Headline (h1)
│   ├── Subtitle
│   └── SearchFilterBar/
│       ├── SearchInput (search by name, area)
│       ├── FilterDropdown (city, region)
│       └── ViewToggle (Map/Grid)
└── GoogleMapFull/
    ├── StoreMarker (with clustering for many stores)
    ├── StoreMarker
    ├── StoreMarker
    └── InfoWindow/
        ├── StoreImage
        ├── StoreName
        ├── StoreAddress
        ├── StoreHours
        ├── StorePhone
        └── CTAButtons (Directions, Reserve Table)
```

**Implementation Notes:**
- Use @googlemaps/markerclusterer for clustering if many stores
- Search: filter stores by name or area (client-side)
- Filter: dropdown for city/region selection
- View toggle: switch between map view and grid view
- Map height: 50vh on mobile, 60vh on desktop
- Sticky header with filters on scroll

**Data Flow:**
- Fetch all stores: getStores({ isActive: true })
- Client-side filtering and search
- Update map markers based on filters

**Accessibility:**
- Keyboard accessible search and filters
- ARIA live region for search results count
- Focus management when toggling views

**State Management:**
- Search query state
- Filter selections (city, region)
- View mode (map/grid)
- Selected store state
- Filtered stores derived state

---

#### 3.2 Store Grid Section
**Purpose:** Filterable, searchable store cards

**Components Required:**
- Store grid layout
- Store cards with details
- Filtering controls
- Search functionality
- Pagination or infinite scroll

**Component Hierarchy:**
```
StoreGridSection/
├── FilterControls/
│   ├── SearchInput
│   ├── CityFilter (dropdown)
│   ├── SortDropdown (A-Z, Nearest)
│   └── ResultsCount
└── StoresGrid/
    ├── StoreCard (reuse and enhance from home)/
    │   ├── CustomImage (store photo)
    │   ├── StoreName (h3)
    │   ├── StoreAddress (with MapPin icon)
    │   ├── StorePhone (with Phone icon)
    │   ├── StoreHours (with Clock icon)
    │   ├── StoreFeatures (badges: WiFi, Parking, etc.)
    │   └── CTAButtons/
    │       ├── ViewOnMapButton
    │       └── ReserveTableButton
    ├── StoreCard
    └── StoreCard
    ├── EmptyState (if no stores match filters)
    └── Pagination (if needed)
```

**Implementation Notes:**
- Reuse and extend StoreCard from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/store-card.tsx
- Add features: WiFi, parking, outdoor seating, delivery (display as badges)
- Card interactions: hover lift effect, click to view details
- Search: debounced input, searches name + area + address
- Sort: alphabetical, by distance (if geolocation available)
- Empty state: friendly message with "Clear filters" button
- Use shadcn Badge component for features

**Data Flow:**
- Same stores data from 3.1
- Filters applied client-side
- Optional: URL query params for shareable filtered views

**Accessibility:**
- Semantic grid layout
- Card links with descriptive text
- Filter controls properly labeled
- Results count announced to screen readers

**Responsive Breakpoints:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3 columns

**Animation Requirements:**
- Staggered fade-in for cards
- Smooth transitions when filtering

---

#### 3.3 Reservation Section
**Purpose:** Reuse existing reservation form

**Components Required:**
- Reservation form (from home stores section)

**Component Hierarchy:**
```
StoreReservationSection/
├── SectionHeader
└── ReservationForm (reuse from home)
    ├── LocationSelect (populated with all stores)
    ├── DatePicker
    ├── TimePicker
    ├── GuestCounter
    ├── NameInput
    ├── PhoneInput
    ├── SpecialRequestsTextarea
    ├── TermsCheckbox
    └── SubmitButton
```

**Implementation Notes:**
- Reuse ReservationForm from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/reservation-form.tsx
- Pre-select store if coming from store card "Reserve Table" CTA
- Accept storeId prop to pre-populate location
- Same validation schema (already implemented)
- Same success/error handling

**Existing Form Schema:**
```typescript
{
  storeId: string (required)
  date: Date (future date)
  time: string (HH:mm format, 10:00-22:30)
  guests: number (1-20)
  name: string (min 2)
  phone: string (UK format validation)
  specialRequests: string (optional)
  agreeToTerms: boolean (must be true)
}
```

**Data Flow:**
- Reuse existing flow
- POST to /api/reservations (mock for now)
- Success: toast + form reset
- Error: toast with error message

**Accessibility:**
- Already implemented in existing form
- WCAG AA compliant
- Keyboard navigable
- Screen reader friendly

---

## 4. SHARED COMPONENTS ACROSS PAGES

### 4.1 Breadcrumb Navigation
```typescript
Breadcrumb/
├── BreadcrumbItem (Home)
├── BreadcrumbSeparator (/)
├── BreadcrumbItem (Current page)
```

**Implementation:**
- Use shadcn Breadcrumb component if available
- Otherwise: custom with lucide ChevronRight icon
- Schema.org BreadcrumbList markup for SEO

### 4.2 Section Header Pattern
```typescript
SectionHeader/
├── Overline (decorative line + text + line)
├── Heading (h2 with gradient text)
└── Subtitle (paragraph)
```

**Implementation:**
- Reuse pattern from mission-vision-section
- Consistent spacing and typography
- Framer Motion staggered animations

### 4.3 Background Decorations
```typescript
BackgroundDecorations/
├── GradientOrb (top right, orange)
├── GradientOrb (bottom left, amber)
├── GridPattern (subtle overlay)
└── FloatingDots (animated)
```

**Implementation:**
- Consistent across all pages
- Theme-aware opacity
- Reduced motion support

---

## 5. DATA FLOW PATTERNS

### 5.1 API Integration
**Endpoints Used:**
- GET /api/stores
  - Query params: { isActive: true, featured?: true, limit?: number }
  - Response: PaginatedResponse<StoreResponse[]>

**Error Handling:**
- Try/catch in async components
- Fallback to empty state
- Console error logging
- User-friendly error messages

### 5.2 Static Content Management
**Approach:**
- Content stored in component files or constants
- Consider moving to /lib/constants for reusability
- Future: migrate to CMS (Contentful, Sanity)

**Content Structure:**
```typescript
// /lib/constants/about.ts
export const aboutStory = {
  headline: "...",
  timeline: [...],
  values: [...],
  team: [...]
}
```

### 5.3 Form Submissions
**Flow:**
1. User fills form
2. Client-side validation (React Hook Form + Zod)
3. Submit handler triggered
4. POST to API endpoint (currently mocked)
5. Loading state shown
6. Response handling:
   - Success: Sonner toast + form reset
   - Error: Sonner toast with error message
7. Return to idle state

---

## 6. STATE MANAGEMENT

### 6.1 Client State (useState)
- Form values (managed by React Hook Form)
- UI toggles (map/grid view, filters, modals)
- Loading states
- Selected items (store, team member)

### 6.2 Server State
- Not needed for MVP (all data fetched per page)
- Future: Consider React Query for caching stores data

### 6.3 URL State
- Optional: Store filters in URL query params
- Benefits: shareable links, browser back/forward
- Implementation: useSearchParams hook

---

## 7. ANIMATION REQUIREMENTS

### 7.1 Page Load Animations
- Hero elements: staggered fade-in (0.1s delays)
- Sections: fade-in on scroll (Intersection Observer)
- Cards: staggered grid animation (0.05s per item)

### 7.2 Interaction Animations
- Hover: scale(1.02), shadow increase, border glow
- Click: slight scale down (0.98) then spring back
- Focus: outline with offset, smooth transition

### 7.3 Framer Motion Variants
```typescript
// Reuse from existing components
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
}

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
}
```

### 7.4 Reduced Motion
```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = useReducedMotion()
const variants = prefersReducedMotion ? {} : fadeInUp
```

---

## 8. ACCESSIBILITY REQUIREMENTS

### 8.1 Semantic HTML
- Proper heading hierarchy (h1 -> h2 -> h3)
- Semantic sections (header, nav, main, section, article, aside, footer)
- Lists for navigation and repeated content
- Time element for hours/dates

### 8.2 ARIA Implementation
- ARIA labels for icon-only buttons
- ARIA live regions for dynamic content (search results, form errors)
- ARIA expanded/collapsed for accordions
- ARIA current for navigation
- ARIA describedby for form field help text

### 8.3 Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators
- Escape key closes modals/dialogs
- Enter/Space activates buttons

### 8.4 Screen Reader Support
- Alt text for all images (or decorative role)
- Labels for form inputs
- Error announcements
- Loading state announcements
- Landmarks for page regions

### 8.5 Color Contrast
- WCAG AA minimum (4.5:1 for normal text, 3:1 for large text)
- Test in both light and dark themes
- Use contrast checker tools

### 8.6 Focus Management
- Restore focus after modal close
- Focus first error on form submission
- Skip links for main content
- Focus trap in modals

---

## 9. RESPONSIVE BREAKPOINTS

### 9.1 Tailwind Breakpoints
```
sm: 640px   (tablets)
md: 768px   (small laptops)
lg: 1024px  (laptops)
xl: 1280px  (desktops)
2xl: 1536px (large desktops)
```

### 9.2 Mobile-First Approach
- Base styles for mobile
- Progressive enhancement for larger screens
- Touch-friendly targets (min 44x44px)

### 9.3 Component Breakpoints

**Hero Sections:**
- Mobile: Single column, 60vh height, stacked content
- Desktop: Two columns (if image), 70vh height, side-by-side

**Grids (Team, Stores, Values):**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Two-Column Layouts (Contact):**
- Mobile: Stacked (form first, info second)
- Desktop: Side-by-side (info left, form right, 40/60 split)

**Maps:**
- Mobile: Full width, 50vh height, list below
- Desktop: Full width or with sidebar, 60vh height

**Navigation/Filters:**
- Mobile: Stacked filters, collapsible menu
- Desktop: Horizontal filters, persistent menu

---

## 10. THEME SUPPORT

### 10.1 Color Variables
```css
/* Light theme */
--background: 0 0% 100%
--foreground: 222.2 84% 4.9%
--primary: 24 100% 55% /* Orange #F97316 */
--navy: 218 72% 15% /* Navy #0e182b */

/* Dark theme */
--background: 222.2 84% 4.9%
--foreground: 210 40% 98%
--primary: 24 100% 60% /* Lighter orange */
--navy: 218 72% 10% /* Darker navy */
```

### 10.2 Theme Switching
- System preference detection
- Manual toggle (header component)
- Persist in localStorage
- No flash of wrong theme

### 10.3 Component Theming
- Use Tailwind dark: variant
- Test all states in both themes
- Images may need theme variants

**Pattern:**
```tsx
<div className="bg-white dark:bg-navy-900 text-slate-900 dark:text-white">
```

---

## 11. PERFORMANCE CONSIDERATIONS

### 11.1 Image Optimization
- Use CustomImage component (required by CLAUDE.md)
- Lazy loading (built-in to Next.js Image)
- Proper sizing and formats (WebP)
- Blur placeholders

### 11.2 Code Splitting
- Dynamic imports for heavy components (map, modals)
- Route-based splitting (automatic with App Router)

### 11.3 API Optimization
- Server-side data fetching where possible
- Parallel data fetching (Promise.all)
- Error boundaries for failed fetches
- Loading states for better UX

### 11.4 Animation Performance
- Use transform and opacity (GPU accelerated)
- Avoid animating width/height/margin
- Use will-change sparingly
- Intersection Observer for scroll animations

---

## 12. SEO REQUIREMENTS

### 12.1 Meta Tags
**About Page:**
```typescript
{
  title: "About Us - Pizza Space | Our Story & Mission",
  description: "Discover the story behind Pizza Space, our mission to bring authentic Italian flavors, and meet our passionate team.",
  openGraph: {
    title: "...",
    description: "...",
    images: [{ url: "/og-about.jpg" }]
  }
}
```

**Contact Page:**
```typescript
{
  title: "Contact Us - Pizza Space | Get in Touch",
  description: "Get in touch with Pizza Space. Find our locations, business hours, and send us a message.",
  openGraph: {...}
}
```

**Stores Page:**
```typescript
{
  title: "Our Locations - Pizza Space | Find a Store Near You",
  description: "Find a Pizza Space location near you. Browse our stores, view maps, and make a reservation.",
  openGraph: {...}
}
```

### 12.2 Structured Data
**Organization Schema (About page):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Pizza Space",
  "url": "https://pizzaspace.com",
  "logo": "https://pizzaspace.com/logo.png",
  "description": "...",
  "contactPoint": {...}
}
```

**Local Business Schema (Stores page):**
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Pizza Space - [Location]",
  "address": {...},
  "geo": {...},
  "openingHours": [...]
}
```

### 12.3 Canonical URLs
- Set canonical for each page
- Avoid duplicate content

---

## 13. TESTING REQUIREMENTS

### 13.1 Manual Testing Checklist
- [ ] All forms validate correctly
- [ ] Form submissions show success/error states
- [ ] Maps load and display markers
- [ ] Map info windows open on marker click
- [ ] Store cards link to correct details
- [ ] Filters work (search, sort, city)
- [ ] Images load with fallbacks
- [ ] Animations play smoothly (60fps)
- [ ] Dark/light theme toggle works
- [ ] Responsive on all breakpoints
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Links and buttons have visible focus
- [ ] No console errors or warnings

### 13.2 Browser Testing
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### 13.3 Performance Testing
- Lighthouse score > 90
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.8s

---

## 14. IMPLEMENTATION PHASES

### Phase 1: About Page
1. Hero section
2. Our Story section (without timeline initially)
3. Mission & Vision section
4. Basic team section (static data)
5. Stores preview section

### Phase 2: Contact Page
1. Compact hero
2. Contact info cards
3. Contact form (reuse from home)
4. Map section (basic embed)

### Phase 3: Store Page
1. Hero with search/filter
2. Store grid with filtering
3. Reservation section (reuse)
4. Interactive map integration

### Phase 4: Enhancements
1. Timeline animation for Our Story
2. Team member modals/detailed bios
3. Advanced map features (clustering, directions)
4. Form API integration
5. URL state for filters
6. Loading skeletons

---

## 15. DEPENDENCIES

### 15.1 Already Installed
- next (16.x)
- react (19.x)
- typescript
- tailwindcss
- framer-motion
- react-hook-form
- @hookform/resolvers
- zod
- lucide-react
- sonner
- date-fns

### 15.2 Need to Install
- @react-google-maps/api or @googlemaps/js-api-loader
- @googlemaps/markerclusterer (if needed)

### 15.3 Environment Variables
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

## 16. FILE STRUCTURE

```
app/
├── about/
│   ├── page.tsx
│   └── layout.tsx (optional)
├── contact/
│   ├── page.tsx
│   └── layout.tsx (optional)
└── stores/
    ├── page.tsx
    ├── layout.tsx (optional)
    └── [id]/ (optional detail page)
        └── page.tsx

components/
├── about/
│   ├── hero-section/
│   │   ├── index.tsx
│   │   ├── hero-content.tsx
│   │   └── background-decorations.tsx
│   ├── story-section/
│   │   ├── index.tsx
│   │   ├── timeline.tsx
│   │   └── timeline-item.tsx
│   ├── mission-vision-section/
│   │   ├── index.tsx
│   │   ├── mission-card.tsx (enhanced)
│   │   └── values-grid.tsx
│   ├── team-section/
│   │   ├── index.tsx
│   │   ├── team-grid.tsx
│   │   └── team-member-card.tsx
│   └── stores-preview-section/
│       └── index.tsx (reuse store cards)
├── contact/
│   ├── hero-section/
│   │   └── index.tsx
│   ├── contact-main-section/
│   │   ├── index.tsx
│   │   ├── contact-info.tsx (enhanced from home)
│   │   └── contact-form.tsx (reuse from home)
│   └── map-section/
│       ├── index.tsx
│       ├── google-map.tsx
│       └── stores-list.tsx
├── stores/
│   ├── hero-section/
│   │   ├── index.tsx
│   │   ├── search-filter-bar.tsx
│   │   └── google-map-full.tsx
│   ├── store-grid-section/
│   │   ├── index.tsx
│   │   ├── filter-controls.tsx
│   │   ├── stores-grid.tsx (enhanced from home)
│   │   ├── store-card.tsx (enhanced from home)
│   │   └── empty-state.tsx
│   └── reservation-section/
│       └── index.tsx (wrapper for home ReservationForm)
└── shared/
    ├── breadcrumb.tsx
    ├── section-header.tsx
    ├── background-decorations.tsx
    └── google-maps/
        ├── map-wrapper.tsx
        ├── marker.tsx
        └── info-window.tsx

lib/
├── constants/
│   ├── about.ts (story, timeline, values, team)
│   ├── contact.ts (contact info, social links)
│   └── stores.ts (optional hardcoded data)
└── utils/
    └── map-utils.ts (geocoding, distance calc)
```

---

## 17. VALIDATION SCHEMAS

### Contact Form (already implemented)
```typescript
const contactFormSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^[\d\s()+-]+$/).optional(),
  subject: z.string().min(1),
  message: z.string().min(10).max(500),
  acceptPrivacy: z.boolean().refine(val => val === true)
})
```

### Reservation Form (already implemented)
```typescript
const reservationSchema = z.object({
  storeId: z.string().min(1),
  date: z.date().refine(isFuture),
  time: z.string().min(1),
  guests: z.number().min(1).max(20),
  name: z.string().min(2),
  phone: z.string().refine(isValidUKPhone),
  specialRequests: z.string().optional(),
  agreeToTerms: z.boolean().refine(val => val === true)
})
```

### Store Search/Filter
```typescript
const storeFilterSchema = z.object({
  searchQuery: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  sortBy: z.enum(['name', 'distance']).optional()
})
```

---

## 18. CONTENT GUIDELINES

### 18.1 Tone and Voice
- Warm and welcoming
- Authentic and genuine
- Professional but approachable
- Food-focused and passionate

### 18.2 Copy Length
- Headlines: 3-8 words
- Subheadlines: 10-20 words
- Body paragraphs: 40-80 words
- Microcopy (buttons, labels): 1-3 words

### 18.3 Placeholder Content
Use realistic placeholder content for development:
- Team bios: 50-100 words each
- Store descriptions: 30-50 words each
- Timeline entries: 20-30 words each

---

## 19. GOOGLE MAPS INTEGRATION

### 19.1 Setup
```typescript
// lib/google-maps.ts
import { Loader } from '@googlemaps/js-api-loader'

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: "weekly",
  libraries: ["places", "marker"]
})

export const loadGoogleMaps = () => loader.load()
```

### 19.2 Map Component Pattern
```typescript
'use client'

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'

const mapContainerStyle = {
  width: '100%',
  height: '60vh'
}

const center = {
  lat: 51.5074, // London
  lng: -0.1278
}

export function StoreMap({ stores }) {
  const [selected, setSelected] = useState(null)

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
      >
        {stores.map(store => (
          <Marker
            key={store._id}
            position={{ lat: store.location.lat, lng: store.location.lng }}
            onClick={() => setSelected(store)}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.location.lat, lng: selected.location.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div>
              <h3>{selected.name}</h3>
              <p>{selected.address}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}
```

### 19.3 Custom Marker Icons
```typescript
const markerIcon = {
  url: '/images/pizza-marker.svg',
  scaledSize: new google.maps.Size(40, 40),
  origin: new google.maps.Point(0, 0),
  anchor: new google.maps.Point(20, 40)
}
```

### 19.4 Theme-Aware Map Styles
```typescript
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  // ... more styles
]

<GoogleMap
  mapContainerStyle={mapContainerStyle}
  center={center}
  zoom={10}
  options={{
    styles: theme === 'dark' ? darkMapStyles : []
  }}
>
```

---

## 20. ERROR HANDLING

### 20.1 API Errors
```typescript
try {
  const stores = await getStores()
} catch (error) {
  console.error('Failed to fetch stores:', error)
  // Show empty state or error message
  return <EmptyState message="Unable to load stores" />
}
```

### 20.2 Form Errors
- Already handled by React Hook Form + Zod
- Display inline below fields
- Aggregate errors at top if needed
- Focus first error field on submit

### 20.3 Map Loading Errors
```typescript
<LoadScript
  googleMapsApiKey={apiKey}
  onError={(error) => {
    console.error('Google Maps failed to load:', error)
    setMapError(true)
  }}
>
  {mapError ? <MapErrorFallback /> : <GoogleMap />}
</LoadScript>
```

### 20.4 Image Loading Errors
- Handled by CustomImage component (already implemented)
- Shows fallback or placeholder

---

## 21. COMPLETION CRITERIA

### Definition of Done

**Feature is complete when:**

1. All sections implemented per requirements
2. Responsive on all breakpoints (mobile, tablet, desktop)
3. Dark/light theme fully supported
4. All forms validate correctly
5. Google Maps integration working
6. No TypeScript errors
7. No ESLint warnings
8. No browser console errors
9. Accessible (keyboard nav, screen reader, ARIA)
10. Animations smooth and performant
11. Images optimized and loading
12. SEO meta tags implemented
13. Tested on Chrome, Firefox, Safari
14. Lighthouse score > 90
15. Code reviewed and approved

### Acceptance Testing

**User can:**
- Navigate to /about and view all 5 sections
- Navigate to /contact and submit contact form
- Navigate to /stores and browse all stores
- Filter stores by search and city
- View stores on map with info windows
- Make a reservation from stores page
- Switch between light and dark themes
- Use keyboard to navigate entire site
- View site on mobile without horizontal scroll

---

## 22. FUTURE ENHANCEMENTS

### Post-MVP Features

1. **About Page:**
   - Animated timeline with scroll-triggered reveals
   - Team member detail modals with full bios
   - Video section with brand story
   - Awards and certifications section
   - Press mentions and media kit

2. **Contact Page:**
   - Live chat integration
   - FAQ section with accordion
   - Callback request form
   - Service area map

3. **Stores Page:**
   - Individual store detail pages (/stores/[id])
   - Store reviews and ratings
   - Store-specific menus
   - Real-time table availability
   - Distance calculation (geolocation)
   - Directions integration (Google Maps directions API)
   - Store events calendar
   - Store photo galleries

4. **General:**
   - CMS integration (Contentful, Sanity)
   - Internationalization (i18n)
   - Analytics tracking
   - A/B testing
   - Progressive Web App (PWA)

---

## SUMMARY

This requirements document provides a comprehensive blueprint for implementing three production-ready pages (About, Contact, Stores) for Pizza Space, following Next.js 16 App Router patterns, shadcn/ui component architecture, and the established design system.

**Key Principles:**
- Reuse existing components where possible
- Maintain consistency with home page design
- Prioritize accessibility and performance
- Mobile-first responsive design
- Support dark/light themes throughout
- Use TypeScript for type safety
- Follow Next.js 16 and React 19 best practices

**Component Reuse Strategy:**
- ReservationForm: reused as-is
- ContactForm: reused with minor enhancements
- StoreCard: enhanced with additional features
- MissionCard: extended for about page
- Background decorations: reused pattern
- Section headers: consistent pattern

**Next Steps:**
1. Review and approve requirements
2. Set up Google Maps API key
3. Create constants files for static content
4. Implement pages in phases (About → Contact → Stores)
5. Test each page before moving to next
6. Final QA and deployment

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Author:** Claude Code
**Status:** Ready for Implementation
