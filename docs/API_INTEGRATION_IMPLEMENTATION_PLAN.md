# PizzaSpace API Integration - Implementation Plan

## Executive Summary

This document outlines a comprehensive implementation plan for integrating the Pizza Space website with the backend API. The integration covers 8 API domains: Opening Hours, Social Media, Contact Info, Logos, Policies, General Ratings (Testimonials), Contact Queries, and Reservation Forms.

**Estimated Duration:** 4 Sprints (8-10 working days)
**Complexity Level:** Complex (multiple API endpoints, forms, dynamic pages)
**Components Affected:** 12+ components across 6+ pages

---

## Current State Analysis

### Existing Architecture
- **Framework:** Next.js 16 with App Router, React 19
- **Styling:** Tailwind CSS 4
- **API Client:** Axios-based with interceptors (`lib/api/client.ts`)
- **State Management:** React Context (Auth, Cart, Store, DeliveryType)
- **Components:** Existing layout components (Header, Footer) with hardcoded data

### Components Requiring API Integration

| Component | Current State | API Integration Needed |
|-----------|---------------|------------------------|
| Header | Static logo | Dynamic logo based on theme |
| Footer | Hardcoded contact/hours | Opening hours, social media, policies, contact info |
| Home Page | Static testimonials | Dynamic testimonials from API |
| Contact Page | Static form | API form submission, dynamic contact info |
| About Page | Static content | Opening hours, contact info |
| Stores Page | Static store list | Reservation form submission |
| Policy Pages | Not implemented | Dynamic routes for policies |

---

## Phase 1: Foundation & Infrastructure

### Subphase 1.1: API Layer Setup
**Duration:** 0.5 days
**Subagent:** `nextjs-component-architect`
**MCPs:** None required

**Tasks:**
1. Create API service files for new endpoints in `lib/api/`
2. Implement error handling utilities
3. Add rate limiting awareness
4. Create server-side fetching utilities with caching

**Files to Create:**
```
lib/api/
  opening-hours.ts
  social-media.ts
  contact-info.ts
  logos.ts
  policies.ts
  general-ratings.ts
  contact-queries.ts
  reservation-form.ts
```

**Prompt for Subagent:**
```
Create API service layer for Pizza Space backend integration.

Context:
- Existing API client at lib/api/client.ts uses Axios
- Base URL: /api/v1
- All new endpoints are public (no auth required)
- Use Next.js 16 server-side fetching patterns

Requirements:
1. Create individual service files for each domain:
   - opening-hours.ts: GET /opening-hours/list
   - social-media.ts: GET /social-media/list
   - contact-info.ts: GET /contact-info/published
   - logos.ts: GET /logos/list, GET /logos/details?type=X&theme=Y
   - policies.ts: GET /policies/list, GET /policies/details/:slug
   - general-ratings.ts: GET /general-ratings/list (paginated), POST /general-ratings/create
   - contact-queries.ts: POST /contact-queries/create
   - reservation-form.ts: POST /reservation-form/create

2. Each file should export:
   - Typed response interfaces
   - Async functions for API calls
   - Error handling with proper typing

3. Use Server Actions for POST endpoints where appropriate

4. Implement caching strategies:
   - Opening hours: revalidate every 1 hour
   - Logos: revalidate every 24 hours
   - Policies: revalidate every 1 hour
   - Contact info: revalidate every 1 hour
   - Ratings: revalidate every 5 minutes
```

---

### Subphase 1.2: Type Definitions
**Duration:** 0.5 days
**Subagent:** `nextjs-component-architect`
**MCPs:** None required

**Tasks:**
1. Create TypeScript interfaces for all API responses
2. Create form input types for POST endpoints
3. Add validation schemas using Zod

**Files to Create:**
```
types/
  opening-hours.ts
  social-media.ts
  contact-info.ts
  logo.ts
  policy.ts
  general-rating.ts
  contact-query.ts
  reservation.ts
lib/schemas/
  contact-query.schema.ts
  reservation.schema.ts
  rating.schema.ts
```

**Type Definitions:**

```typescript
// types/opening-hours.ts
export interface OpeningHours {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// types/social-media.ts
export interface SocialMedia {
  _id: string;
  name: string;
  logo: string;
  link: string;
  createdAt: string;
  updatedAt: string;
}

// types/contact-info.ts
export interface ContactInfo {
  _id: string;
  addressLine1: string;
  addressLine2?: string;
  area: string;
  city: string;
  county?: string;
  zip: string;
  phone: string;
  email: string;
  lat?: number;
  lng?: number;
  immediatePhoneNo?: string;
  immediateEmail?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// types/logo.ts
export type LogoType = 'header' | 'favicon' | 'footer';
export type LogoTheme = 'dark' | 'light';

export interface Logo {
  _id: string;
  logoImage: string;
  type: LogoType;
  theme: LogoTheme;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// types/policy.ts
export interface PolicyListItem {
  _id: string;
  name: string;
  slug: string;
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PolicyDetails extends PolicyListItem {
  content: string;
}

// types/general-rating.ts
export interface GeneralRating {
  _id: string;
  personName: string;
  personImage?: string;
  ratings: number;
  personTagRole?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RatingsListResponse {
  ratings: GeneralRating[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// types/contact-query.ts
export type ContactSubject =
  | 'general inquiry'
  | 'order issue'
  | 'feedback'
  | 'other'
  | 'reservation'
  | 'general complaint';

export interface ContactQueryInput {
  name: string;
  email: string;
  phone?: string;
  subject: ContactSubject;
  message: string;
}

export interface ContactQuery extends ContactQueryInput {
  _id: string;
  status: 'open' | 'closed';
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}

// types/reservation.ts
export interface ReservationInput {
  storeId: string;
  date: string;
  time: string;
  noOfGuest: number;
  name: string;
  phone: string;
  message?: string;
}

export interface Reservation extends ReservationInput {
  _id: string;
  status: 'open' | 'cancelled' | 'reserved';
  closingMessage?: string;
  createdAt: string;
  updatedAt: string;
}
```

---

### Subphase 1.3: Data Fetching Utilities
**Duration:** 0.5 days
**Subagent:** `nextjs-component-architect`
**MCPs:** `next-devtools` (for runtime validation)

**Tasks:**
1. Create server-side data fetching functions with caching
2. Create client-side hooks for dynamic data
3. Implement error boundaries and fallbacks

**Files to Create:**
```
lib/api/
  server-fetchers.ts (consolidated server fetching)
lib/hooks/
  use-opening-hours.ts
  use-social-media.ts
  use-contact-info.ts
  use-logos.ts
  use-policies.ts
  use-testimonials.ts
```

---

## Phase 2: Core Layout Components

### Subphase 2.1: Header Integration
**Duration:** 1 day
**Subagent:** `shadcn-implementation-builder`
**MCPs:** `shadcn`, `next-devtools`

**Tasks:**
1. Update Logo component to fetch from API
2. Add theme-aware logo switching
3. Create logo provider context for caching
4. Implement fallback for static logo

**Files to Modify:**
```
components/layout/header/logo.tsx
components/providers/logo-provider.tsx (new)
```

**Current Logo Component Analysis:**
- Located at `components/layout/header/logo.tsx`
- Currently uses static image
- Needs to support light/dark theme switching

**Prompt for Subagent:**
```
Update the Header Logo component for dynamic API integration.

Current file: components/layout/header/logo.tsx
API endpoint: GET /logos/details?type=header&theme=light|dark

Requirements:
1. Fetch logo based on current theme (light/dark)
2. Use Next.js Server Components where possible
3. Implement fallback to static logo if API fails
4. Cache logo for 24 hours using Next.js caching
5. Support theme switching without page reload

Implementation approach:
- Create a LogoProvider context for caching across components
- Use the existing ThemeProvider to detect current theme
- Implement CustomImage component for rendering (per CLAUDE.md)

Fallback behavior:
- Show static logo at /public/logo.png if API fails
- Log errors but don't break the UI
```

---

### Subphase 2.2: Footer Integration
**Duration:** 1.5 days
**Subagent:** `shadcn-implementation-builder`
**MCPs:** `shadcn`, `next-devtools`

**Tasks:**
1. Update FooterContact with API data (opening hours, contact info)
2. Update FooterBrand with API logo
3. Update FooterLinks to include dynamic policy links
4. Add social media icons from API
5. Update FooterBottom with dynamic policies

**Files to Modify:**
```
components/layout/footer/footer-contact.tsx
components/layout/footer/footer-brand.tsx
components/layout/footer/footer-links.tsx
components/layout/footer/footer-bottom.tsx
components/layout/footer/index.tsx
```

**Prompt for Subagent:**
```
Update Footer components for full API integration.

Context:
- Footer is a Server Component (can fetch data directly)
- Current components have hardcoded data
- Need to integrate: opening hours, social media, contact info, policies, logo

Files to update:

1. footer-contact.tsx:
   - Replace hardcoded contactInfo array with API data from GET /contact-info/published
   - Replace hardcoded openingHours with data from GET /opening-hours/list
   - Format address as: addressLine1, addressLine2, area, city, county zip
   - Format opening hours grouped by time range if possible

2. footer-brand.tsx:
   - Fetch logo from GET /logos/details?type=footer&theme=dark
   - Add social media icons from GET /social-media/list
   - Use CustomImage for logo rendering

3. footer-links.tsx:
   - Add dynamic policy links from GET /policies/list
   - Filter by showOnFooter: true
   - Keep existing static quickLinks and helpLinks

4. footer-bottom.tsx:
   - Add policy links to bottom section
   - Keep copyright dynamic with current year

5. index.tsx:
   - Orchestrate data fetching at parent level
   - Pass data as props to child components
   - Add Suspense boundaries for progressive loading

Error handling:
- Show skeleton loaders during fetch
- Fall back to hardcoded data if API fails
- Log errors for monitoring
```

---

### Subphase 2.3: Layout Provider Setup
**Duration:** 0.5 days
**Subagent:** `nextjs-component-architect`
**MCPs:** `next-devtools`

**Tasks:**
1. Create shared data context for layout data
2. Implement caching at layout level
3. Add prefetching for common data

**Files to Create/Modify:**
```
lib/contexts/site-data-context.tsx (new)
app/layout.tsx (modify to add provider)
```

**Prompt for Subagent:**
```
Create a SiteDataProvider for shared layout data.

Purpose:
- Cache common data (contact info, opening hours, social media, logos) at app level
- Avoid duplicate API calls across components
- Support both Server and Client Components

Implementation:
1. Create SiteDataContext with:
   - contactInfo: ContactInfo | null
   - openingHours: OpeningHours[]
   - socialMedia: SocialMedia[]
   - logos: Map<string, Logo> (keyed by "type-theme")
   - policies: PolicyListItem[]

2. Fetch all data in the RootLayout Server Component
3. Pass to SiteDataProvider client component
4. Expose hooks: useSiteData(), useContactInfo(), useOpeningHours(), etc.

Caching strategy:
- Fetch at layout level with revalidation
- Store in context for client-side access
- Revalidate on navigation if stale
```

---

## Phase 3: Page Implementations

### Subphase 3.1: Home Page Updates
**Duration:** 1 day
**Subagent:** `shadcn-implementation-builder`
**MCPs:** `shadcn`, `next-devtools`, `playwright`

**Tasks:**
1. Update TestimonialsSection to use API
2. Update ContactSection with API contact info
3. Add opening hours display where needed

**Files to Modify:**
```
components/home/testimonials-section/index.tsx
components/home/testimonials-section/testimonial-card.tsx
components/home/contact-section/index.tsx
```

**Prompt for Subagent:**
```
Update Home Page sections for API integration.

1. TestimonialsSection:
   Current: Uses hardcoded testimonials
   API: GET /general-ratings/list?page=1&limit=6

   Requirements:
   - Fetch published ratings from API
   - Map personName, ratings (1-5 stars), personTagRole, personImage
   - Show skeleton loader during fetch
   - Implement "Load More" pagination
   - Add star rating display (use lucide-react Star icon)
   - Handle missing personImage with avatar fallback

2. ContactSection:
   Current: Hardcoded contact details
   API: GET /contact-info/published

   Requirements:
   - Display addressLine1, addressLine2, city, zip
   - Show phone and email with click-to-call/mail
   - Show immediatePhoneNo if available (for urgent orders)
   - Integrate map preview if lat/lng available

Error handling:
- Show friendly message if testimonials empty
- Fall back to hardcoded contact if API fails
```

---

### Subphase 3.2: Contact Page
**Duration:** 1.5 days
**Subagent:** `nextjs-forms-expert`
**MCPs:** `shadcn`, `next-devtools`, `playwright`

**Tasks:**
1. Update page with API contact info
2. Implement contact form with Server Actions
3. Add map integration with lat/lng

**Files to Modify:**
```
app/contact/page.tsx
components/contact/contact-form.tsx (new)
components/contact/contact-info-card.tsx (new)
components/contact/contact-map.tsx (new)
lib/actions/contact.actions.ts (new)
```

**Prompt for Subagent:**
```
Implement Contact Page with API integration and form submission.

Current file: app/contact/page.tsx

Requirements:

1. Contact Info Display:
   - Fetch from GET /contact-info/published
   - Display full address with all fields
   - Show map using Google Maps (existing integration at README-GOOGLE-MAPS.md)
   - Use lat/lng for map center

2. Contact Form:
   API: POST /contact-queries/create

   Fields:
   - name (required, 2-100 chars)
   - email (required, valid email)
   - phone (optional, valid phone pattern)
   - subject (required, select from: general inquiry, order issue, feedback, other, reservation, general complaint)
   - message (required, 10-2000 chars)

   Implementation:
   - Use shadcn/ui form components
   - Implement with react-hook-form + zod validation
   - Use Server Action for submission
   - Show loading state during submission
   - Show success toast on completion
   - Handle rate limiting (10 requests/hour)
   - Reset form on success

3. Validation Schema (Zod):
   - name: z.string().min(2).max(100)
   - email: z.string().email()
   - phone: z.string().optional() (validate phone pattern if provided)
   - subject: z.enum([...subjects])
   - message: z.string().min(10).max(2000)

4. Accessibility:
   - Proper form labels and aria-attributes
   - Error announcements for screen readers
   - Focus management after submission
```

---

### Subphase 3.3: About Page
**Duration:** 0.5 days
**Subagent:** `shadcn-implementation-builder`
**MCPs:** `shadcn`, `next-devtools`

**Tasks:**
1. Integrate opening hours display
2. Add contact info section
3. Display testimonials snippet

**Files to Modify:**
```
app/about/page.tsx
components/about/about-hours.tsx (new)
components/about/about-testimonials.tsx (new)
```

**Prompt for Subagent:**
```
Update About Page with API integration.

Current file: app/about/page.tsx

Requirements:
1. Opening Hours Section:
   - Fetch from GET /opening-hours/list
   - Display in sorted order (sortOrder field)
   - Format as "Day: startTime - endTime"
   - Highlight today's hours

2. Contact Info Preview:
   - Show address and phone from GET /contact-info/published
   - Link to Contact page for more details

3. Testimonials Preview:
   - Fetch top 3 ratings from GET /general-ratings/list?limit=3
   - Show as compact cards
   - Link to testimonials section on Home page
```

---

### Subphase 3.4: Stores Page (Reservation Form)
**Duration:** 1.5 days
**Subagent:** `nextjs-forms-expert`
**MCPs:** `shadcn`, `next-devtools`, `playwright`

**Tasks:**
1. Implement reservation form
2. Add date/time picker components
3. Integrate with store selection

**Files to Modify:**
```
app/stores/page.tsx
components/stores/reservation-form.tsx (new)
components/stores/reservation-dialog.tsx (new)
lib/actions/reservation.actions.ts (new)
```

**Prompt for Subagent:**
```
Implement Reservation Form for Stores Page.

Current file: app/stores/page.tsx

API: POST /reservation-form/create

Form Fields:
- storeId (auto-selected from store card)
- date (required, date picker, future dates only)
- time (required, time picker, based on store hours)
- noOfGuest (required, 1-100, number input with +/- buttons)
- name (required, 2-100 chars)
- phone (required, valid phone)
- message (optional, max 1000 chars)

Implementation:
1. Reservation Form Component:
   - Use shadcn/ui DatePicker for date
   - Use shadcn/ui Select for time slots (30-min intervals)
   - Generate time slots based on opening hours
   - Number stepper for guests
   - Textarea for message

2. Reservation Dialog:
   - Open from "Reserve Table" button on store card
   - Pre-populate storeId
   - Show store name and address

3. Server Action:
   - Validate all fields
   - Format date as YYYY-MM-DD
   - Format time as HH:MM
   - Handle rate limiting (10 requests/hour)
   - Return created reservation with confirmation

4. Success State:
   - Show confirmation with reservation details
   - Option to add to calendar
   - Close dialog after confirmation

5. Validation:
   - Date must be in future
   - Date must be within 30 days
   - Time must be during opening hours
   - noOfGuest must be 1-100
```

---

### Subphase 3.5: Policy Pages (Dynamic Routes)
**Duration:** 1 day
**Subagent:** `nextjs-component-architect`
**MCPs:** `next-devtools`

**Tasks:**
1. Create dynamic route for policies
2. Implement policy content rendering
3. Add SEO metadata generation

**Files to Create:**
```
app/policies/[slug]/page.tsx
app/policies/[slug]/loading.tsx
app/policies/[slug]/not-found.tsx
components/policies/policy-content.tsx (new)
```

**Prompt for Subagent:**
```
Create Dynamic Policy Pages.

APIs:
- GET /policies/list (for generateStaticParams)
- GET /policies/details/:slug (for page content)

Implementation:

1. Dynamic Route (app/policies/[slug]/page.tsx):
   - Use generateStaticParams to pre-render known policies
   - Use generateMetadata for dynamic SEO
   - Fetch policy content from API
   - Handle 404 for unknown slugs

2. Policy Content Component:
   - Render HTML/Markdown content safely
   - Use sanitization for HTML content
   - Style with prose classes (Tailwind Typography)

3. Loading State:
   - Skeleton for title
   - Skeleton for content paragraphs

4. Not Found:
   - Custom 404 page for policy
   - Link back to home
   - List available policies

5. SEO:
   - Title: "{policy.name} | Pizza Space"
   - Description: First 160 chars of content
   - Canonical URL: /policies/{slug}

6. Layout considerations:
   - Breadcrumb: Home > Policies > {name}
   - Last updated date
   - Back to policies link
```

---

## Phase 4: Forms & Interactions

### Subphase 4.1: Contact Form (Deep Implementation)
**Duration:** Already covered in 3.2, refinement only
**Subagent:** `nextjs-forms-expert`
**MCPs:** `shadcn`

**Additional Tasks:**
1. Add field-level validation feedback
2. Implement form state persistence
3. Add confirmation email preview

---

### Subphase 4.2: Reservation Form (Deep Implementation)
**Duration:** Already covered in 3.4, refinement only
**Subagent:** `nextjs-forms-expert`
**MCPs:** `shadcn`

**Additional Tasks:**
1. Add availability checking
2. Implement guest count suggestions
3. Add special requests quick-picks

---

### Subphase 4.3: Rating/Testimonial Submission
**Duration:** 0.5 days
**Subagent:** `nextjs-forms-expert`
**MCPs:** `shadcn`, `next-devtools`

**Tasks:**
1. Create rating submission form
2. Add star rating input component
3. Implement image upload option

**Files to Create:**
```
components/home/testimonials-section/submit-rating-dialog.tsx
components/home/testimonials-section/star-rating-input.tsx
lib/actions/rating.actions.ts
```

**Prompt for Subagent:**
```
Implement Rating/Testimonial Submission Form.

API: POST /general-ratings/create

Form Fields:
- personName (required, 2-100 chars)
- ratings (required, 1-5 integer, star picker)
- personTagRole (optional, 2-50 chars, e.g., "Regular Customer")
- personImage (optional, image URL)
- personPhone (optional, for follow-up)

Implementation:
1. Star Rating Input:
   - 5 clickable stars
   - Hover preview effect
   - Keyboard accessible (arrow keys)
   - Screen reader announcements

2. Form Component:
   - Open from "Leave a Review" button
   - Use shadcn/ui Dialog
   - Photo upload with preview (optional)
   - Clear messaging: "Reviews are published after approval"

3. Server Action:
   - Validate all fields
   - Handle rate limiting (5 requests/hour - strict)
   - Show rate limit error clearly
   - Return success with pending status

4. Success State:
   - Thank you message
   - Note about moderation
   - Close dialog

Note: Submitted ratings have isPublished: false by default
```

---

## Phase 5: Polish & Optimization

### Subphase 5.1: Accessibility Audit
**Duration:** 0.5 days
**Subagent:** `nextjs-accessibility-expert`
**MCPs:** `playwright`

**Tasks:**
1. Audit all new forms for accessibility
2. Verify keyboard navigation
3. Test with screen readers
4. Add proper ARIA labels
5. Ensure color contrast compliance

**Prompt for Subagent:**
```
Perform accessibility audit on all new API-integrated components.

Components to audit:
1. Footer (opening hours, contact info, social links)
2. Contact Form
3. Reservation Form
4. Rating Submission Form
5. Policy Pages
6. Testimonials Section

Check for:
- Proper form labels and descriptions
- Error message announcements
- Focus management after submissions
- Keyboard navigation in dialogs
- Skip links for long content
- Screen reader compatibility
- Color contrast ratios
- Touch target sizes (mobile)

Deliverables:
- Accessibility issues list
- Fixes for each issue
- ARIA attribute additions
```

---

### Subphase 5.2: Animations & Micro-interactions
**Duration:** 0.5 days
**Subagent:** `nextjs-animation-specialist`
**MCPs:** `shadcn`

**Tasks:**
1. Add loading skeletons with shimmer
2. Form submission animations
3. Success/error state transitions
4. Star rating hover effects

**Prompt for Subagent:**
```
Add polish animations to new components.

Animations needed:

1. Skeleton Loaders:
   - Footer sections during load
   - Testimonials grid during load
   - Policy content during load
   - Use shimmer effect (existing pattern)

2. Form States:
   - Submit button loading spinner
   - Success checkmark animation
   - Error shake animation
   - Field focus ring transition

3. Star Rating:
   - Hover scale effect (1.1x)
   - Selection fill animation
   - Color transition on select

4. Testimonial Cards:
   - Stagger fade-in on load
   - Hover lift effect
   - Quote mark animation

5. Dialog Transitions:
   - Smooth open/close
   - Content fade in
   - Backdrop blur transition

Use CSS animations where possible (per CLAUDE.md guidelines).
Ensure animations respect prefers-reduced-motion.
```

---

### Subphase 5.3: Performance Optimization
**Duration:** 0.5 days
**Subagent:** `nextjs-performance-optimizer`
**MCPs:** `next-devtools`, `playwright`

**Tasks:**
1. Implement proper caching strategies
2. Optimize image loading (logos, avatars)
3. Reduce unnecessary re-renders
4. Add request deduplication

**Prompt for Subagent:**
```
Optimize performance for API integration.

Areas to optimize:

1. Caching:
   - Static data (logos): 24 hours
   - Semi-static (opening hours, policies): 1 hour
   - Dynamic (testimonials): 5 minutes
   - User submissions: no cache

2. Image Optimization:
   - Use CustomImage with proper sizes
   - Add blur placeholders for testimonial images
   - Lazy load below-fold images
   - Social media icons: SVG sprites if possible

3. Request Optimization:
   - Deduplicate parallel requests
   - Use SWR or React Query patterns for client data
   - Implement request coalescing

4. Bundle Optimization:
   - Tree-shake unused API functions
   - Dynamic import for form components
   - Lazy load dialog components

5. Metrics:
   - Measure TTFB for API calls
   - Track Cumulative Layout Shift
   - Monitor First Contentful Paint
```

---

### Subphase 5.4: Responsive Design Audit
**Duration:** 0.5 days
**Subagent:** `nextjs-responsive-design`
**MCPs:** `playwright`

**Tasks:**
1. Test all components on mobile/tablet/desktop
2. Verify form usability on touch devices
3. Optimize dialog sizing
4. Ensure readable text at all sizes

**Prompt for Subagent:**
```
Audit responsive design for all new components.

Breakpoints to test:
- Mobile: 375px, 414px
- Tablet: 768px, 1024px
- Desktop: 1280px, 1920px

Components to test:

1. Footer:
   - Stack columns on mobile
   - Opening hours readable on small screens
   - Social icons touch-friendly

2. Contact Form:
   - Full-width inputs on mobile
   - Proper keyboard type for phone/email
   - Submit button sticky on mobile?

3. Reservation Form:
   - Date picker mobile-friendly
   - Time slots scrollable
   - Guest counter touch-friendly

4. Testimonials:
   - Card grid responsive (1/2/3 columns)
   - Star ratings visible
   - Avatar sizing

5. Policy Pages:
   - Content max-width for readability
   - Proper heading hierarchy
   - Mobile-friendly tables if any

6. Dialogs:
   - Full-screen on mobile
   - Proper sizing on tablet/desktop
   - Scroll behavior
```

---

## Sprint Execution Plan

### Sprint 1: Foundation (Days 1-2)
**Focus:** API Layer, Types, and Core Integration

| Task | Subagent | Duration | Dependencies |
|------|----------|----------|--------------|
| 1.1 API Layer Setup | nextjs-component-architect | 0.5 days | None |
| 1.2 Type Definitions | nextjs-component-architect | 0.5 days | None |
| 1.3 Data Fetching Utilities | nextjs-component-architect | 0.5 days | 1.1, 1.2 |
| 2.3 Layout Provider | nextjs-component-architect | 0.5 days | 1.3 |

**Parallel Tasks:**
- 1.1 and 1.2 can run in parallel

**Sprint 1 Deliverables:**
- All API service files created
- Type definitions complete
- Site data context available
- Basic integration tests passing

---

### Sprint 2: Layout Components (Days 3-4)
**Focus:** Header and Footer API Integration

| Task | Subagent | Duration | Dependencies |
|------|----------|----------|--------------|
| 2.1 Header Logo | shadcn-implementation-builder | 1 day | Sprint 1 |
| 2.2 Footer Integration | shadcn-implementation-builder | 1.5 days | Sprint 1 |

**Parallel Tasks:**
- 2.1 and 2.2 can run in parallel (after Sprint 1)

**Sprint 2 Deliverables:**
- Dynamic logos working
- Footer shows real data
- Opening hours displayed
- Social media links active
- Policy links in footer

---

### Sprint 3: Page Implementations (Days 5-7)
**Focus:** All page-level API integrations

| Task | Subagent | Duration | Dependencies |
|------|----------|----------|--------------|
| 3.1 Home Page | shadcn-implementation-builder | 1 day | Sprint 2 |
| 3.2 Contact Page | nextjs-forms-expert | 1.5 days | Sprint 1 |
| 3.3 About Page | shadcn-implementation-builder | 0.5 days | Sprint 1 |
| 3.4 Stores/Reservation | nextjs-forms-expert | 1.5 days | Sprint 1 |
| 3.5 Policy Pages | nextjs-component-architect | 1 day | Sprint 1 |

**Parallel Tasks:**
- 3.2, 3.3, 3.4, 3.5 can start after Sprint 1
- 3.1 needs Sprint 2 for consistent layout data

**Sprint 3 Deliverables:**
- Home page testimonials from API
- Contact form working
- Reservation form working
- Policy pages rendering
- All pages accessible

---

### Sprint 4: Forms, Polish & Optimization (Days 8-10)
**Focus:** Form refinement, accessibility, performance

| Task | Subagent | Duration | Dependencies |
|------|----------|----------|--------------|
| 4.3 Rating Submission | nextjs-forms-expert | 0.5 days | Sprint 3 |
| 5.1 Accessibility | nextjs-accessibility-expert | 0.5 days | Sprint 3 |
| 5.2 Animations | nextjs-animation-specialist | 0.5 days | Sprint 3 |
| 5.3 Performance | nextjs-performance-optimizer | 0.5 days | Sprint 3 |
| 5.4 Responsive | nextjs-responsive-design | 0.5 days | Sprint 3 |
| Final Review | nextjs-ui-reviewer | 0.5 days | All above |

**Parallel Tasks:**
- 5.1, 5.2, 5.3, 5.4 can all run in parallel

**Sprint 4 Deliverables:**
- All forms polished
- Accessibility audit passed
- Performance optimized
- Responsive on all devices
- Final code review complete

---

## Subagent & MCP Assignments Summary

### Subagent Assignments

| Subagent | Phases | Total Duration |
|----------|--------|----------------|
| `nextjs-component-architect` | 1.1, 1.2, 1.3, 2.3, 3.5 | 3 days |
| `shadcn-implementation-builder` | 2.1, 2.2, 3.1, 3.3 | 3 days |
| `nextjs-forms-expert` | 3.2, 3.4, 4.1, 4.2, 4.3 | 3.5 days |
| `nextjs-accessibility-expert` | 5.1 | 0.5 days |
| `nextjs-animation-specialist` | 5.2 | 0.5 days |
| `nextjs-performance-optimizer` | 5.3 | 0.5 days |
| `nextjs-responsive-design` | 5.4 | 0.5 days |
| `nextjs-ui-reviewer` | Final Review | 0.5 days |

### MCP Assignments

| MCP | Usage |
|-----|-------|
| `shadcn` | Component research, installation, examples |
| `next-devtools` | Runtime debugging, error detection, dev server |
| `playwright` | Browser testing, accessibility testing, responsive testing |
| `21st-dev` | UI component inspiration (if needed) |
| `ref` | Documentation lookup for complex patterns |

---

## Dependencies & Prerequisites

### Technical Prerequisites
1. **API Backend Running:** Ensure `/api/v1` endpoints are accessible
2. **Environment Variables:** Add `NEXT_PUBLIC_API_BASE_URL` to `.env.local`
3. **Google Maps API Key:** Required for contact page map (already configured)
4. **shadcn/ui Components:** Ensure required components installed

### Component Dependencies
```
Required shadcn/ui components:
- Form (already installed)
- Input (already installed)
- Button (already installed)
- Select (may need installation)
- DatePicker / Calendar (may need installation)
- Dialog (already installed)
- Textarea (may need installation)
- Avatar (may need installation)
- Skeleton (already installed)
- Toast (already installed)
```

### Data Dependencies
- Opening Hours API must return sorted data
- Logo API must have published logos for header/footer
- Contact Info must have one published record
- At least some policies with `showOnFooter: true`

---

## Risk Mitigation

### API Availability
- Implement fallback to static data for all components
- Add error boundaries around API-dependent sections
- Cache aggressively for non-critical data

### Rate Limiting
- Display user-friendly messages for rate limits
- Implement client-side throttling for forms
- Add retry logic with exponential backoff

### Performance
- Use streaming/suspense for progressive loading
- Implement proper skeleton states
- Monitor Core Web Vitals during development

---

## Testing Checklist

### Unit Tests
- [ ] API service functions
- [ ] Validation schemas
- [ ] Data transformation utilities

### Integration Tests
- [ ] Form submissions
- [ ] API data display
- [ ] Error handling

### E2E Tests (Playwright)
- [ ] Complete contact form flow
- [ ] Complete reservation flow
- [ ] Policy page navigation
- [ ] Footer link functionality

### Accessibility Tests
- [ ] Form keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast validation
- [ ] Focus management

### Performance Tests
- [ ] Lighthouse scores
- [ ] API response times
- [ ] Bundle size impact

---

## Appendix: File Structure After Implementation

```
lib/
  api/
    opening-hours.ts (new)
    social-media.ts (new)
    contact-info.ts (new)
    logos.ts (new)
    policies.ts (new)
    general-ratings.ts (new)
    contact-queries.ts (new)
    reservation-form.ts (new)
  actions/
    contact.actions.ts (new)
    reservation.actions.ts (new)
    rating.actions.ts (new)
  contexts/
    site-data-context.tsx (new)
  hooks/
    use-opening-hours.ts (new)
    use-testimonials.ts (new)
  schemas/
    contact-query.schema.ts (new)
    reservation.schema.ts (new)
    rating.schema.ts (new)

types/
  opening-hours.ts (new)
  social-media.ts (new)
  contact-info.ts (new)
  logo.ts (new)
  policy.ts (new)
  general-rating.ts (new)
  contact-query.ts (new)
  reservation.ts (new)

components/
  layout/
    header/
      logo.tsx (modified)
    footer/
      footer-contact.tsx (modified)
      footer-brand.tsx (modified)
      footer-links.tsx (modified)
      footer-bottom.tsx (modified)
      index.tsx (modified)
  providers/
    logo-provider.tsx (new)
  contact/
    contact-form.tsx (new)
    contact-info-card.tsx (new)
    contact-map.tsx (new)
  stores/
    reservation-form.tsx (new)
    reservation-dialog.tsx (new)
  policies/
    policy-content.tsx (new)
  home/
    testimonials-section/
      submit-rating-dialog.tsx (new)
      star-rating-input.tsx (new)
  about/
    about-hours.tsx (new)
    about-testimonials.tsx (new)

app/
  layout.tsx (modified - add SiteDataProvider)
  page.tsx (minimal changes)
  contact/
    page.tsx (modified)
  about/
    page.tsx (modified)
  stores/
    page.tsx (modified)
  policies/
    [slug]/
      page.tsx (new)
      loading.tsx (new)
      not-found.tsx (new)
```

---

## Next Steps

1. **Review this plan** with the team
2. **Set up API access** and verify endpoints
3. **Begin Sprint 1** with foundation work
4. **Daily standups** to track progress
5. **Continuous testing** throughout implementation

---

*Document Version: 1.0*
*Created: January 10, 2026*
*Last Updated: January 10, 2026*
