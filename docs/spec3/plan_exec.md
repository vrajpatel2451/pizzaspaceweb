# Pizza Space - Spec3 Comprehensive Execution Plan

## Executive Summary

This document outlines the complete execution plan for building three production-ready pages for the Pizza Space Next.js 16 application: **About**, **Contact**, and **Store** pages. The plan coordinates specialized agents to deliver eye-catching, mobile-responsive, theme-aware pages that follow the established home page design system.

### Project Overview

| Attribute | Value |
|-----------|-------|
| **Framework** | Next.js 16 with App Router |
| **React Version** | React 19 |
| **Styling** | Tailwind CSS 4 |
| **Design System** | Custom Pizza Space (Orange #F97316, Navy #0e182b) |
| **Theme Support** | Light + Dark mode via next-themes |
| **Animation Library** | Framer Motion |
| **Form Handling** | React Hook Form + Zod |
| **UI Components** | shadcn/ui (new-york style) |

### Deliverables Summary

| Page | Sections | Complexity | Estimated Components |
|------|----------|------------|---------------------|
| **About** | 5 sections | Complex | 15-20 components |
| **Contact** | 3 sections | Medium | 8-12 components |
| **Store** | 3 sections | Complex | 12-16 components |

### Requirements Checklist (from spec3.md)

- [ ] Follow home screen design guidelines
- [ ] Support dark and light themes
- [ ] Eye-catching design
- [ ] Mobile responsive
- [ ] No build or runtime errors
- [ ] Links integrated on home screen

---

## Design System Reference

### Established Patterns from Home Page

The home page establishes these design tokens in `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/globals.css`:

```css
/* Primary Colors */
--color-primary: #F97316 (Orange)
--color-primary-hover: #EA580C
--color-secondary: #0e182b (Navy)

/* Typography */
Font: Montserrat (300-800 weights)
Headings: text-3xl to text-5xl, font-bold
Body: text-base to text-lg
Overline: text-xs, uppercase, tracking-widest

/* Section Patterns */
- Section padding: py-16 sm:py-20 lg:py-24
- Container: container mx-auto px-4 sm:px-6 lg:px-8
- Grid gaps: gap-8 lg:gap-12
- Background gradients with blur orbs
- Subtle grid/pattern overlays
- Bottom decorative lines/waves

/* Animation Patterns */
- Entrance: Framer Motion with opacity/y transforms
- Floating elements: animate y with easeInOut
- Hover states: scale, shadow transitions
- Viewport-triggered animations (once: true)
```

### Existing Reusable Components

| Component | Location | Usage |
|-----------|----------|-------|
| `Button` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/button.tsx` | Primary, outline, ghost variants |
| `Input` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/input.tsx` | Form inputs |
| `TextArea` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/textarea.tsx` | Multi-line input |
| `Select` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/select.tsx` | Dropdown selection |
| `Badge` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/badge.tsx` | Status indicators |
| `Calendar` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/calendar.tsx` | Date picker |
| `Dialog` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/dialog.tsx` | Modal dialogs |
| `CustomImage` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/custom-image.tsx` | Image with fallback |
| `Rating` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/composite/rating.tsx` | Star ratings |

### Existing Section Components (Reference)

| Component | File | Patterns to Follow |
|-----------|------|-------------------|
| `HeroSection` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/hero-section/` | Background shapes, floating cards |
| `AboutSection` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/about-section/` | Two-column grid, animated blobs |
| `MissionVisionSection` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/mission-vision-section/` | Card-based layout, gradient orbs |
| `TestimonialsSection` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/testimonials-section/` | Carousel, quote decorations |
| `ContactSection` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/contact-section/` | Form + info grid layout |
| `StoresSection` | `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/` | Grid + form, store cards |

### Navigation Links (Already Configured)

From `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/layout/header/header-client.tsx`:
```typescript
const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Stores", href: "/stores" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
```

---

## Page-by-Page Breakdown

### 1. About Page (`/about`)

**Route:** `app/about/page.tsx`

#### Sections Required (5)

| # | Section | Description | Key Components |
|---|---------|-------------|----------------|
| 1 | **Hero** | Full-width hero with brand story headline | `AboutHero`, `BackgroundShapes`, `HeroContent` |
| 2 | **Our Story** | Company history, founding story | `StorySection`, `TimelineCard`, `StoryImage` |
| 3 | **Mission & Vision** | Expanded mission/vision cards | `MissionVisionExpanded`, `ValueCard` |
| 4 | **Our Team** | Team member grid with photos | `TeamSection`, `TeamMemberCard`, `TeamGrid` |
| 5 | **Our Stores Overview** | Store locations preview with CTA | `StoresPreview`, `StoreCTA` |

#### Component Architecture

```
app/about/
  page.tsx (Server Component)

components/about/
  hero-section/
    index.tsx (Server)
    hero-content.tsx (Server)
    background-shapes.tsx (Client - animations)

  story-section/
    index.tsx (Server)
    story-content.tsx (Server)
    story-image.tsx (Server)
    story-timeline.tsx (Client - animations)

  mission-vision-section/
    index.tsx (Server)
    mission-card.tsx (Client - hover effects)
    vision-card.tsx (Client - hover effects)
    values-grid.tsx (Server)

  team-section/
    index.tsx (Server)
    team-grid.tsx (Server)
    team-member-card.tsx (Client - hover effects)

  stores-preview-section/
    index.tsx (Server - fetches stores)
    store-preview-card.tsx (Server)
    store-cta.tsx (Server)
```

---

### 2. Contact Page (`/contact`)

**Route:** `app/contact/page.tsx`

#### Sections Required (3)

| # | Section | Description | Key Components |
|---|---------|-------------|----------------|
| 1 | **Hero** | Compact hero with contact headline | `ContactHero` |
| 2 | **Contact Info + Form** | Two-column: info left, form right | `ContactInfo`, `ContactForm`, `ContactCard` |
| 3 | **Map Section** | Full-width embedded map with markers | `MapSection`, `StoreMarker`, `MapOverlay` |

#### Component Architecture

```
app/contact/
  page.tsx (Server Component)

components/contact/
  hero-section/
    index.tsx (Server)
    hero-content.tsx (Server)

  contact-section/
    index.tsx (Server)
    contact-info.tsx (Server)
    contact-card.tsx (Server)
    contact-form.tsx (Client - form handling)

  map-section/
    index.tsx (Client - Google Maps)
    map-container.tsx (Client)
    store-marker.tsx (Client)
    map-overlay.tsx (Server)
```

---

### 3. Store Page (`/stores`)

**Route:** `app/stores/page.tsx`

#### Sections Required (3)

| # | Section | Description | Key Components |
|---|---------|-------------|----------------|
| 1 | **Hero + Map** | Hero with interactive Google Map | `StoreHero`, `InteractiveMap`, `MapControls` |
| 2 | **Store Grid** | Filterable store cards grid | `StoreGrid`, `StoreCard`, `StoreFilter` |
| 3 | **Reservation** | Reservation form section | `ReservationSection`, `ReservationForm` |

#### Component Architecture

```
app/stores/
  page.tsx (Server Component)

components/stores/
  hero-section/
    index.tsx (Server)
    hero-content.tsx (Server)
    interactive-map.tsx (Client - Google Maps)
    map-controls.tsx (Client)

  stores-grid-section/
    index.tsx (Server - fetches stores)
    store-grid.tsx (Server)
    store-card.tsx (Client - hover effects)
    store-filter.tsx (Client - filtering)
    store-search.tsx (Client - search)

  reservation-section/
    index.tsx (Server)
    reservation-form.tsx (Client - reuse from home)
    store-selector.tsx (Client)
```

### Existing Store API

From `/Users/vrajpatel/Documents/personal/pizzaspace_web/lib/api/stores.ts`:
```typescript
export async function getStores(params?: StoreQueryParams): Promise<APIResponse<PaginatedResponse<StoreResponse>>>
```

Store type from `/Users/vrajpatel/Documents/personal/pizzaspace_web/types/store.ts`:
```typescript
export type StoreResponse = {
  _id: string;
  name: string;
  imageUrl: string;
  phone: string;
  email: string;
  deliveryRadius: number;
  lat: number;  // Available for Google Maps
  long: number; // Available for Google Maps
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

---

## Execution Phases

### Phase 1: Requirements Analysis & Research
**Duration:** 1 session
**Agents:** `shadcn-requirements-analyzer`, `shadcn-component-researcher`

#### 1.1 shadcn-requirements-analyzer

<prompt>
Analyze the requirements for Pizza Space spec3 pages (About, Contact, Store) and create structured component requirements.

Context:
- Next.js 16 with App Router, React 19, TypeScript
- Existing design system: Orange #F97316, Navy #0e182b
- Home page components exist in /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/ for reference
- shadcn/ui (new-york style) already configured
- Must support dark/light themes
- Mobile-first responsive design required

Pages to analyze:

**About Page (5 sections):**
1. Hero - Brand story headline with decorative elements
2. Our Story - Company history, timeline visual
3. Mission & Vision - Expanded cards with values
4. Team - Team member cards with photos, roles
5. Stores Preview - Store cards with CTA to stores page

**Contact Page (3 sections):**
1. Compact Hero - Contact headline
2. Contact Info + Form - Two-column layout
3. Map Section - Full-width Google Map with store markers

**Store Page (3 sections):**
1. Hero + Interactive Map - Google Maps integration
2. Store Grid - Filterable, searchable store cards
3. Reservation - Booking form (reuse existing component from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/reservation-form.tsx)

Create requirements.md with:
- Detailed component hierarchy per page
- Data flow patterns (API vs static)
- Accessibility requirements per component
- State management needs
- Animation requirements
- Responsive breakpoint considerations
</prompt>

**Expected Output:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/docs/spec3/requirements.md`

#### 1.2 shadcn-component-researcher

<prompt>
Research shadcn/ui components needed for Pizza Space spec3 pages.

Already installed components (in /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/):
- button, input, textarea, label, checkbox
- select, popover, calendar, dialog, drawer
- badge, tabs, accordion, separator, skeleton
- command (for search)

Research needed for:

1. **Map Integration:**
   - Best practices for Google Maps with Next.js 16
   - @vis.gl/react-google-maps library patterns
   - Custom marker components

2. **Team Cards:**
   - Best card patterns for team member display
   - Image optimization for team photos
   - Social link integration patterns

3. **Timeline Component:**
   - Vertical timeline for company story
   - Animated reveal patterns
   - Mobile-responsive timeline layouts

4. **Filter/Search:**
   - Store filtering UI patterns
   - Search with shadcn Command component
   - Filter chips/tags patterns

5. **Form Patterns:**
   - Contact form with multiple input types
   - Form success/error states
   - Server Actions integration for Next.js 16

Provide:
- Component recommendations with examples
- Installation commands if new packages needed
- Integration patterns with existing design system
</prompt>

**Expected Output:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/docs/spec3/component-research.md`

---

### Phase 2: Component Architecture
**Duration:** 1 session
**Agent:** `nextjs-component-architect`

<prompt>
Design the component architecture for Pizza Space spec3 pages following Next.js 16 App Router best practices.

Context:
- Existing layout: /Users/vrajpatel/Documents/personal/pizzaspace_web/app/layout.tsx with Header/Footer
- Existing patterns: Server components for data fetching, Client for interactivity
- Store API exists: /Users/vrajpatel/Documents/personal/pizzaspace_web/lib/api/stores.ts (getStores function)
- Types exist: /Users/vrajpatel/Documents/personal/pizzaspace_web/types/store.ts (StoreResponse, StoreQueryParams)
- Reservation form exists: /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/reservation-form.tsx

Design architecture for:

**About Page:**
- 5 sections with appropriate Server/Client boundaries
- Lazy loading strategy for below-fold content
- Static content with minimal JS

**Contact Page:**
- Contact form with React Hook Form + Zod
- Server Action for form submission
- Map with client-side Google Maps integration

**Store Page:**
- Server-side store data fetching
- Client-side filtering/search state
- Google Maps integration with store markers
- Reservation form (reuse existing component)

Deliverables:
1. Component tree diagrams per page
2. Server/Client component decisions with rationale
3. Data fetching strategy (RSC vs client fetch)
4. State management approach
5. Lazy loading boundaries
6. File/folder structure
7. Props interface definitions
</prompt>

**Expected Output:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/docs/spec3/architecture.md`

---

### Phase 3: Design System Extension
**Duration:** 1 session
**Agent:** `nextjs-design-system`

<prompt>
Extend the Pizza Space design system for spec3 pages while maintaining consistency with the home page.

Existing design tokens (/Users/vrajpatel/Documents/personal/pizzaspace_web/app/globals.css):
- Colors: Primary orange (#F97316), Navy (#0e182b), semantic colors
- Typography: Montserrat, heading scales, body text
- Spacing: 4px base system
- Shadows: xs to xl scale
- Border radius: sm to 2xl scale
- Z-index scale for overlays
- Light/dark theme variables

New patterns needed:

1. **Team Card Component:**
   - Avatar sizing (consistent with brand)
   - Social link icon styling
   - Hover state animations

2. **Timeline Component:**
   - Vertical line styling (orange)
   - Timeline dot/marker styling
   - Year/milestone typography

3. **Map Overlay Styling:**
   - Map marker customization (orange theme)
   - Info window styling
   - Map control button styling

4. **Section Variations:**
   - Compact hero variant (Contact page)
   - Full-width map section
   - Filter chip/badge styling

Deliverables:
- Additional CSS custom properties if needed
- Component variant definitions
- Animation keyframes for new patterns
- Responsive adjustments
</prompt>

**Expected Output:** Design extension notes, potential globals.css updates

---

### Phase 4: Core Implementation
**Duration:** 3 sessions (1 per page)
**Agent:** `shadcn-implementation-builder`

#### 4.1 About Page Implementation

<prompt>
Implement the About page for Pizza Space following the established architecture and design system.

File structure:
```
/Users/vrajpatel/Documents/personal/pizzaspace_web/app/about/page.tsx
/Users/vrajpatel/Documents/personal/pizzaspace_web/components/about/
  hero-section/
  story-section/
  mission-vision-section/
  team-section/
  stores-preview-section/
```

Requirements:
1. **Hero Section:**
   - Full-width with gradient background
   - Decorative floating elements (follow home hero pattern from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/hero-section/)
   - "Our Story" headline with subtitle
   - Animated entrance

2. **Story Section:**
   - Two-column: image left, content right (flip on mobile)
   - Company founding story content
   - Timeline visual with milestones (2018 founded, etc.)
   - Floating ingredient decorations (follow /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/about-section/ pattern)

3. **Mission & Vision Section:**
   - Expanded version of home page section (reference /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/mission-vision-section/)
   - Add "Our Values" grid below cards
   - Values: Quality, Community, Innovation, Sustainability
   - Icon + title + description per value

4. **Team Section:**
   - Section header with overline pattern
   - 4-6 team member cards in grid
   - Card: photo, name, role, short bio, social links
   - Hover effect with bio reveal

5. **Stores Preview:**
   - Use stores API to fetch 3 stores
   - "Visit Our Locations" CTA button
   - Link to /stores page

Technical requirements:
- Use CustomImage from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/custom-image.tsx for all images
- Implement dark mode support
- Add page metadata (title, description)
- Follow existing animation patterns from home components
- Mobile-first responsive design

Reference files:
- /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/about-section/ (pattern reference)
- /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/mission-vision-section/ (pattern reference)
- /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/hero-section/ (background patterns)
</prompt>

**Expected Output:** Complete About page implementation

#### 4.2 Contact Page Implementation

<prompt>
Implement the Contact page for Pizza Space.

File structure:
```
/Users/vrajpatel/Documents/personal/pizzaspace_web/app/contact/page.tsx
/Users/vrajpatel/Documents/personal/pizzaspace_web/components/contact/
  hero-section/
  contact-section/
  map-section/
```

Requirements:
1. **Hero Section:**
   - Compact variant (less vertical space than home hero)
   - "Get In Touch" headline
   - Subtitle: "We'd love to hear from you"
   - Subtle background gradient

2. **Contact Section:**
   - Two-column layout (info left, form right)
   - Contact Info Cards:
     - Address (main office)
     - Phone number
     - Email address
     - Opening hours
   - Contact Form:
     - Name, Email, Phone, Subject dropdown, Message
     - React Hook Form + Zod validation (follow pattern from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/reservation-form.tsx)
     - Server Action submission
     - Success/error toast notifications (use Sonner)

3. **Map Section:**
   - Full-width Google Maps embed
   - Show all store locations as markers (fetch from API)
   - Custom orange markers matching brand
   - Info window on marker click (store name, address)
   - "Find Nearest Store" overlay button

Technical requirements:
- Form validation matching reservation-form patterns
- Google Maps integration (@vis.gl/react-google-maps)
- Store data fetched server-side, passed to map client component
- Accessible form with proper labels and error messages
- Mobile: stack columns, full-width form
</prompt>

**Expected Output:** Complete Contact page implementation

#### 4.3 Store Page Implementation

<prompt>
Implement the Store page for Pizza Space.

File structure:
```
/Users/vrajpatel/Documents/personal/pizzaspace_web/app/stores/page.tsx
/Users/vrajpatel/Documents/personal/pizzaspace_web/components/stores/
  hero-section/
  stores-grid-section/
  reservation-section/
```

Requirements:
1. **Hero + Map Section:**
   - Split layout: content left, large interactive map right
   - "Find Your Nearest Store" headline
   - Search by location input
   - Interactive Google Map:
     - All stores as markers (lat/long available in StoreResponse)
     - Click marker to see store details
     - Geolocation support ("Use my location")
     - Map controls (zoom, fullscreen)

2. **Stores Grid Section:**
   - Filter bar:
     - Search by name/area
     - Filter by city/area dropdown
   - Store cards grid (3 columns desktop, 1 mobile)
   - Reuse StoreCard pattern from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/store-card.tsx
   - Add "Order Now" and "Get Directions" buttons
   - Show open/closed status with badge
   - Pagination or infinite scroll for many stores

3. **Reservation Section:**
   - Reuse ReservationForm from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/reservation-form.tsx
   - Full-width section with background
   - "Reserve Your Table" headline

Technical requirements:
- Server-side store fetching with API
- Client-side filtering/search state
- Google Maps with marker clustering if many stores
- Responsive grid (3 -> 2 -> 1 columns)
- URL state for filters (searchParams)
- Loading skeletons for store grid (reference /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/stores-section/stores-skeleton.tsx)
</prompt>

**Expected Output:** Complete Store page implementation

---

### Phase 5: Forms & Validation
**Duration:** 1 session
**Agent:** `nextjs-forms-expert`

<prompt>
Review and enhance all forms across spec3 pages for Pizza Space.

Forms to review:
1. **Contact Form** (Contact page) - NEW
2. **Store Search** (Store page) - NEW
3. **Reservation Form** (Store page) - EXISTING (verify integration)

For Contact Form, implement:
```typescript
// Validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional().refine(
    (val) => !val || isValidUKPhone(val),
    "Please enter a valid UK phone number"
  ),
  subject: z.enum([
    "general",
    "order",
    "reservation",
    "feedback",
    "partnership",
    "other"
  ]),
  message: z.string().min(10, "Message must be at least 10 characters"),
});
```

Requirements:
1. React Hook Form + Zod resolver
2. Server Action for form submission
3. Loading states during submission
4. Success toast with confirmation (use Sonner from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/sonner.tsx)
5. Error handling with user-friendly messages
6. Proper ARIA labels and error announcements
7. UK phone validation (reuse /Users/vrajpatel/Documents/personal/pizzaspace_web/lib/validators/phone.ts)
8. Email confirmation (optional future)

For Store Search, implement:
- Debounced search input
- Clear button when text present
- Search icon
- No form submission, real-time filtering

Deliverables:
- /Users/vrajpatel/Documents/personal/pizzaspace_web/lib/actions/contact.ts (Server Action)
- Updated form components with validation
- Form accessibility audit
</prompt>

**Expected Output:** Complete form implementations with Server Actions

---

### Phase 6: Animations & Micro-interactions
**Duration:** 1 session
**Agent:** `nextjs-animation-specialist`

<prompt>
Implement animations and micro-interactions for Pizza Space spec3 pages following established patterns.

Reference patterns (from home page components):
```typescript
// Entrance animations (from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/mission-vision-section/)
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}

// Floating elements (from /Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/about-section/)
animate={{ y: [0, -10, 0] }}
transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}

// Staggered children
transition={{ staggerChildren: 0.1 }}
```

Animations needed:

**About Page:**
1. Hero - Staggered text entrance, floating decorative elements
2. Story - Image reveal with scale, timeline items stagger
3. Team - Card hover: lift + shadow increase, bio text fade in
4. Values - Icon bounce on hover

**Contact Page:**
1. Hero - Simple fade in
2. Contact cards - Stagger entrance from left
3. Form - Subtle field focus animations
4. Map - Fade in after component mount

**Store Page:**
1. Map - Marker drop animation on load
2. Store cards - Hover lift effect
3. Filter - Smooth show/hide animations
4. Search - Input focus expand animation

Additional micro-interactions:
- Button hover states (scale, shadow)
- Link underline animations
- Toast notifications entrance/exit
- Loading skeleton pulse

Requirements:
- Respect prefers-reduced-motion
- Keep animations subtle and purposeful
- Use CSS animations where possible for performance
- Framer Motion for complex orchestrations
</prompt>

**Expected Output:** Animation implementations across all pages

---

### Phase 7: Responsive Design
**Duration:** 1 session
**Agent:** `nextjs-responsive-design`

<prompt>
Implement responsive design for all Pizza Space spec3 pages.

Breakpoints (Tailwind defaults):
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**About Page Responsive:**
1. Hero: Full-width on all sizes, text centered on mobile
2. Story: Stack columns mobile, image on top
3. Mission/Vision: Stack cards on mobile
4. Team: 1 column mobile, 2 tablet, 3-4 desktop
5. Values: 2 columns mobile, 4 desktop

**Contact Page Responsive:**
1. Hero: Reduce padding on mobile
2. Contact section: Stack columns, form first on mobile
3. Map: Full width, reduce height on mobile

**Store Page Responsive:**
1. Hero+Map: Stack, map below hero on mobile
2. Store grid: 1 column mobile, 2 tablet, 3 desktop
3. Filter bar: Collapsible on mobile
4. Reservation: Full width, reduced padding

Mobile-specific considerations:
- Touch-friendly tap targets (min 44px)
- Reduced animation complexity
- Optimized images (different sizes)
- Sticky filter bar on store page
- Bottom sheet for store details on map click

Desktop enhancements:
- Hover states active
- Larger click targets acceptable
- Side-by-side layouts
- Full animation effects

Testing checklist:
- [ ] iPhone SE (375px)
- [ ] iPhone 14 (390px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1280px+)
</prompt>

**Expected Output:** Responsive implementations with mobile-first approach

---

### Phase 8: Performance Optimization
**Duration:** 1 session
**Agent:** `nextjs-performance-optimizer`

<prompt>
Optimize performance for Pizza Space spec3 pages.

Focus areas:

1. **Image Optimization:**
   - Use CustomImage component (already wraps next/image)
   - Proper sizing for team member photos
   - Lazy loading for below-fold images
   - WebP format with fallbacks
   - Blur placeholder for large images

2. **Bundle Optimization:**
   - Lazy load below-fold sections (dynamic imports)
   - Code split Google Maps (heavy dependency)
   - Tree-shake unused Framer Motion features
   - Analyze bundle with @next/bundle-analyzer

3. **Google Maps Optimization:**
   - Load map only when visible (Intersection Observer)
   - Use lite mode for preview maps
   - Minimize re-renders with React.memo
   - Batch marker updates

4. **Data Fetching:**
   - Server-side fetch for initial store data
   - Cache store data appropriately
   - Incremental Static Regeneration for About page
   - On-demand revalidation for Store page

5. **Core Web Vitals:**
   - LCP: Preload hero images
   - FID: Minimize main thread blocking
   - CLS: Reserve space for dynamic content
   - Proper font loading (already using next/font)

Patterns to implement:
```tsx
// Lazy section loading (reference /Users/vrajpatel/Documents/personal/pizzaspace_web/app/page.tsx)
const TeamSection = dynamic(() =>
  import('./team-section').then(mod => ({ default: mod.TeamSection })),
  { loading: () => <TeamSectionSkeleton /> }
);

// Map lazy loading
const MapSection = dynamic(() =>
  import('./map-section').then(mod => ({ default: mod.MapSection })),
  { ssr: false, loading: () => <MapSkeleton /> }
);
```

Deliverables:
- Optimized dynamic imports
- Image size configurations
- Performance monitoring setup
- Bundle analysis report
</prompt>

**Expected Output:** Performance-optimized pages

---

### Phase 9: Accessibility Audit
**Duration:** 1 session
**Agent:** `nextjs-accessibility-expert`

<prompt>
Conduct accessibility audit and fixes for Pizza Space spec3 pages.

WCAG 2.1 AA Compliance Checklist:

**1. Semantic HTML:**
- [ ] Proper heading hierarchy (h1 -> h2 -> h3)
- [ ] Landmark regions (main, nav, section, footer)
- [ ] Lists for navigation and repeated items
- [ ] Buttons vs links used correctly

**2. Forms Accessibility:**
- [ ] Labels associated with inputs
- [ ] Error messages linked with aria-describedby
- [ ] Required field indicators
- [ ] Focus management after submission
- [ ] Form validation announcements

**3. Images:**
- [ ] Alt text for all meaningful images
- [ ] Decorative images have alt="" or role="presentation"
- [ ] Team photos have descriptive alt text

**4. Color & Contrast:**
- [ ] Text contrast ratio >= 4.5:1
- [ ] Large text contrast >= 3:1
- [ ] Color not sole indicator of state
- [ ] Focus indicators visible

**5. Keyboard Navigation:**
- [ ] All interactive elements focusable
- [ ] Logical tab order
- [ ] Skip links (already in header - see /Users/vrajpatel/Documents/personal/pizzaspace_web/components/layout/header/index.tsx)
- [ ] Escape closes modals
- [ ] No keyboard traps

**6. Screen Readers:**
- [ ] aria-label for icon-only buttons
- [ ] aria-live for dynamic content
- [ ] aria-expanded for collapsibles
- [ ] Page titles are unique and descriptive

**7. Map Accessibility:**
- [ ] Store list alternative to map
- [ ] Keyboard navigation for markers
- [ ] Screen reader announcements for map actions

**8. Motion:**
- [ ] Respect prefers-reduced-motion
- [ ] No auto-playing animations that can't be paused
- [ ] Animation duration reasonable

Testing tools:
- axe DevTools
- WAVE
- VoiceOver (Mac)
- Keyboard-only navigation

Deliverables:
- Accessibility fixes across all pages
- ARIA attributes added where needed
- Keyboard navigation verification
- Screen reader testing notes
</prompt>

**Expected Output:** Accessibility-compliant pages

---

### Phase 10: Integration & Review
**Duration:** 1 session
**Agent:** `nextjs-ui-reviewer`

<prompt>
Final review of Pizza Space spec3 pages before production.

Review checklist:

**1. Code Quality:**
- [ ] TypeScript strict mode compliance
- [ ] No any types
- [ ] Proper component prop typing
- [ ] Consistent naming conventions
- [ ] No console.log statements

**2. Design Consistency:**
- [ ] Colors match design system (Orange #F97316, Navy #0e182b)
- [ ] Typography follows guidelines (Montserrat)
- [ ] Spacing is consistent
- [ ] Dark mode tested and working
- [ ] Animations match home page feel

**3. Functionality:**
- [ ] All links work correctly
- [ ] Forms submit and validate
- [ ] Map loads and functions
- [ ] Store data displays correctly
- [ ] Navigation updates (header links active states)

**4. Responsive:**
- [ ] Mobile layouts working
- [ ] Tablet layouts working
- [ ] Desktop layouts working
- [ ] No horizontal scroll
- [ ] Touch interactions work

**5. Performance:**
- [ ] Pages load under 3 seconds
- [ ] No layout shifts
- [ ] Images optimized
- [ ] Code splitting working

**6. SEO:**
- [ ] Page titles set
- [ ] Meta descriptions set
- [ ] Open Graph tags
- [ ] Structured data (JSON-LD)

**7. Error States:**
- [ ] API error handling
- [ ] Form error display
- [ ] Empty states (no stores)
- [ ] Loading states

**8. Build Verification:**
- [ ] npm run build passes
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No runtime errors

Integration tasks:
- Verify header navigation active states work
- Verify footer links
- Test page transitions
- Cross-browser testing (Chrome, Firefox, Safari)

Deliverables:
- Review report with any issues found
- Fixes for any issues
- Final verification of all requirements
</prompt>

**Expected Output:** Production-ready pages with all issues resolved

---

## MCP Tools Usage by Phase

| Phase | MCP Tools |
|-------|-----------|
| 1. Requirements | `mcp__shadcn__search_items_in_registries`, `mcp__shadcn__view_items_in_registries` |
| 2. Architecture | `mcp__next-devtools__nextjs_docs`, `mcp__next-devtools__init` |
| 3. Design System | Standard file editing |
| 4. Implementation | `mcp__shadcn__get_add_command_for_items`, `mcp__21st-dev__21st_magic_component_builder` |
| 5. Forms | `mcp__next-devtools__nextjs_docs` (Server Actions) |
| 6. Animations | Standard file editing |
| 7. Responsive | `mcp__playwright__playwright_screenshot` for testing |
| 8. Performance | `mcp__next-devtools__nextjs_index`, `mcp__next-devtools__nextjs_call` |
| 9. Accessibility | Standard file editing + axe testing |
| 10. Review | `mcp__playwright__playwright_navigate`, `mcp__next-devtools__nextjs_call` |

---

## Parallel Execution Opportunities

### Independent Tasks (Can Run in Parallel)

| Task A | Task B | Notes |
|--------|--------|-------|
| About page implementation | Contact page implementation | No shared components initially |
| Team section design | Map integration research | Different domains |
| Form validation setup | Animation patterns | Different concerns |
| About page testing | Contact page testing | Independent pages |

### Sequential Dependencies

```
Requirements Analysis
        |
        v
Component Architecture
        |
        +---> Design System Extension
        |              |
        v              v
About Page ------> Store Page (depends on design)
        |              |
        v              v
Contact Page       Reservation Integration
        |              |
        +------+-------+
               |
               v
        Forms Expert Review
               |
               v
        Animation Polish
               |
               v
        Responsive Fixes
               |
               v
        Performance Optimization
               |
               v
        Accessibility Audit
               |
               v
        Final Review
```

---

## Risk Mitigation

### Technical Risks

| Risk | Mitigation |
|------|------------|
| Google Maps API complexity | Research first, use @vis.gl/react-google-maps, fallback to static image |
| Bundle size with Maps | Dynamic import, lazy load, code split |
| Store API failures | Implement error boundaries, fallback UI, retry logic |
| Animation performance | Test on low-end devices, reduce on mobile, respect reduced-motion |
| Form submission failures | Server Action with proper error handling, toast notifications |

### Design Risks

| Risk | Mitigation |
|------|------------|
| Dark mode inconsistency | Test all components in both themes during implementation |
| Mobile layout issues | Mobile-first development, test on real devices |
| Brand consistency | Reference home page components, use design tokens |
| Content overflow | Test with various content lengths, add text truncation |

---

## Verification Checklist

### Pre-Deployment

- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] All pages render correctly in development
- [ ] All forms submit successfully
- [ ] Google Maps loads and displays stores
- [ ] Dark mode works on all pages
- [ ] Mobile responsive on all pages
- [ ] Navigation links work in header
- [ ] Footer links work
- [ ] Page titles and meta tags set
- [ ] No console errors in browser

### Post-Deployment

- [ ] Lighthouse scores > 90 for all pages
- [ ] Cross-browser testing passed
- [ ] Accessibility audit passed
- [ ] Analytics tracking working
- [ ] Error monitoring working

---

## Quick Start

To begin implementation, invoke the first agent:

```
Agent: shadcn-requirements-analyzer
Prompt: [See Phase 1.1 above]
```

After requirements are documented, proceed to Phase 2 with `nextjs-component-architect`.

---

## Appendix

### File Structure Summary

```
/Users/vrajpatel/Documents/personal/pizzaspace_web/
  app/
    about/
      page.tsx
    contact/
      page.tsx
    stores/
      page.tsx

  components/
    about/
      hero-section/
      story-section/
      mission-vision-section/
      team-section/
      stores-preview-section/

    contact/
      hero-section/
      contact-section/
      map-section/

    stores/
      hero-section/
      stores-grid-section/
      reservation-section/

  lib/
    actions/
      contact.ts (Server Action - NEW)

  docs/
    spec3/
      requirements.md (NEW)
      architecture.md (NEW)
      component-research.md (NEW)
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/store` | GET | List all stores (existing) |
| `/store?isActive=true` | GET | Active stores only |
| Contact form | Server Action | New implementation |

### Environment Variables Needed

```env
# Google Maps (new for spec3)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

---

*Document generated: December 1, 2025*
*Version: 2.0*
*Status: Ready for Execution*
