# Implementation Checklist - Spec3 Pages

> Step-by-step guide to implement About, Contact, and Store pages

## Prerequisites

- [x] Design system extended in globals.css
- [x] Documentation created
- [x] Build verified (no errors)
- [ ] Google Maps API key obtained (for Store page)

## Phase 1: Shared Components

### 1.1 CompactHero Component

**File:** `/components/shared/compact-hero.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create component file
- [ ] Add TypeScript interface
- [ ] Implement breadcrumb navigation
- [ ] Add Framer Motion animations
- [ ] Style with hero-compact classes
- [ ] Add responsive title sizing
- [ ] Test light/dark mode
- [ ] Add accessibility attributes

**Dependencies:**
- Framer Motion
- Lucide React (icons)

**Estimated Time:** 1-2 hours

**Code Reference:** See DESIGN_SYSTEM_SPEC3.md, Section: "Compact Hero Component"

---

## Phase 2: About Page

### 2.1 TeamCard Component

**File:** `/components/about/team-card.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create component file
- [ ] Add TypeScript interfaces
- [ ] Implement avatar section
- [ ] Add social links with icons
- [ ] Style with team-card classes
- [ ] Add hover animations
- [ ] Test with sample data
- [ ] Add loading state
- [ ] Test accessibility (keyboard nav)

**Dependencies:**
- CustomImage component
- Lucide React (Linkedin, Twitter, Mail icons)

**Estimated Time:** 2-3 hours

### 2.2 Timeline Component

**File:** `/components/about/timeline.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create component file
- [ ] Add TypeScript interfaces
- [ ] Implement vertical line
- [ ] Add timeline dots
- [ ] Create year badges
- [ ] Add content cards
- [ ] Implement hover effects
- [ ] Add Framer Motion scroll animations
- [ ] Test with sample milestones
- [ ] Test accessibility

**Dependencies:**
- Framer Motion
- Lucide React (icons for events)

**Estimated Time:** 2-3 hours

### 2.3 About Page Layout

**File:** `/app/about/page.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create page file
- [ ] Add CompactHero section
- [ ] Create Mission/Vision section
- [ ] Integrate Timeline component
- [ ] Add Team section with TeamCards
- [ ] Add Testimonials section (reuse)
- [ ] Add Statistics/Highlights section
- [ ] Implement proper spacing
- [ ] Add section dividers
- [ ] Test responsive layout
- [ ] Add page metadata (SEO)

**Content Needed:**
- [ ] Mission statement
- [ ] Vision statement
- [ ] Company values (4-5 items)
- [ ] Team member data (name, role, avatar, bio, socials)
- [ ] Timeline milestones (year, title, description)
- [ ] Statistics (stores, customers, pizzas sold, etc.)

**Estimated Time:** 3-4 hours

---

## Phase 3: Contact Page

### 3.1 Contact Page Layout

**File:** `/app/contact/page.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create page file
- [ ] Add CompactHero section
- [ ] Add ContactInfo component (reuse from home)
- [ ] Add ContactForm component (reuse from home)
- [ ] Create 2-column layout (info + form)
- [ ] Add optional map section
- [ ] Style section backgrounds
- [ ] Test responsive layout
- [ ] Add page metadata (SEO)
- [ ] Test form submission

**Components Used:**
- [x] CompactHero (Phase 1)
- [x] ContactInfo (existing - /components/home/contact-section/)
- [x] ContactForm (existing - /components/home/contact-section/)

**Estimated Time:** 1-2 hours

---

## Phase 4: Store Page

### 4.1 StoreFilters Component

**File:** `/components/stores/store-filters.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create component file
- [ ] Add TypeScript interfaces
- [ ] Implement filter state management
- [ ] Create filter chip UI
- [ ] Add active state styling
- [ ] Implement remove functionality
- [ ] Add keyboard navigation
- [ ] Create filter change callback
- [ ] Test with sample filters
- [ ] Test accessibility

**Dependencies:**
- Lucide React (X icon for remove)

**Estimated Time:** 2 hours

### 4.2 StoreMap Component

**File:** `/components/stores/store-map.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Set up Google Maps API key
- [ ] Install @react-google-maps/api
- [ ] Create component file
- [ ] Add TypeScript interfaces
- [ ] Implement map container
- [ ] Create custom orange markers
- [ ] Add InfoWindow component
- [ ] Implement marker click handlers
- [ ] Add map controls (layer toggle)
- [ ] Style info windows
- [ ] Add loading state
- [ ] Test with sample stores
- [ ] Handle API errors

**Dependencies:**
- Google Maps API key
- @react-google-maps/api library
- Lucide React (MapPin, Navigation icons)

**Setup Commands:**
```bash
npm install @react-google-maps/api
```

**Environment Variables:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Estimated Time:** 4-5 hours

### 4.3 Store Page Layout

**File:** `/app/stores/page.tsx`

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Create page file
- [ ] Add CompactHero section
- [ ] Add StoreFilters section
- [ ] Add StoreMap section (full-width)
- [ ] Create store grid section
- [ ] Implement filter → map integration
- [ ] Implement filter → grid integration
- [ ] Add loading states
- [ ] Test responsive layout
- [ ] Add page metadata (SEO)

**Data Needed:**
- [ ] Store locations (name, address, lat, lng, phone)
- [ ] City/region filters
- [ ] Store hours
- [ ] Store images (optional)

**Components Used:**
- [ ] CompactHero (Phase 1)
- [ ] StoreFilters (Phase 4.1)
- [ ] StoreMap (Phase 4.2)
- [x] StoreCard (existing - /components/home/stores-section/)

**Estimated Time:** 3-4 hours

---

## Phase 5: Navigation Integration

### 5.1 Header Navigation

**File:** Update navigation component

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Add "About" link to main navigation
- [ ] Add "Contact" link to main navigation
- [ ] Add "Stores" link to main navigation
- [ ] Update active link highlighting
- [ ] Test mobile menu
- [ ] Test keyboard navigation

**Navigation Structure:**
```
Home | About | Menu | Stores | Contact
```

**Estimated Time:** 1 hour

### 5.2 Footer Links

**File:** Update footer component

**Status:** Not Started | In Progress | Complete

**Tasks:**
- [ ] Add About page link to footer
- [ ] Add Contact page link to footer
- [ ] Add Stores page link to footer
- [ ] Organize footer link groups
- [ ] Test all links

**Estimated Time:** 30 minutes

---

## Phase 6: Testing & Optimization

### 6.1 Functionality Testing

**Status:** Not Started | In Progress | Complete

**About Page:**
- [ ] Hero section renders correctly
- [ ] Timeline animations work
- [ ] Team cards display properly
- [ ] Social links work
- [ ] All sections responsive
- [ ] Dark mode works

**Contact Page:**
- [ ] Hero section renders
- [ ] Form validation works
- [ ] Form submission works
- [ ] Contact info displays
- [ ] Responsive layout
- [ ] Dark mode works

**Store Page:**
- [ ] Hero section renders
- [ ] Filters work correctly
- [ ] Map loads and displays markers
- [ ] Marker clicks show info windows
- [ ] Store grid displays
- [ ] Filter integration works
- [ ] Responsive layout
- [ ] Dark mode works

### 6.2 Accessibility Testing

**Status:** Not Started | In Progress | Complete

**All Pages:**
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Screen reader compatible
- [ ] ARIA labels correct
- [ ] Heading hierarchy proper
- [ ] Color contrast passes WCAG AA
- [ ] Images have alt text
- [ ] Forms are accessible

**Tools:**
- [ ] Run Lighthouse audit (score 90+)
- [ ] Test with NVDA/JAWS screen reader
- [ ] Test with keyboard only
- [ ] Check with axe DevTools

### 6.3 Performance Testing

**Status:** Not Started | In Progress | Complete

**All Pages:**
- [ ] Page load time < 3s
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s
- [ ] Images optimized
- [ ] Fonts loading correctly
- [ ] No console errors

**Tools:**
- [ ] Run Lighthouse performance audit
- [ ] Test on slow 3G connection
- [ ] Check bundle size
- [ ] Verify image optimization

### 6.4 Cross-Browser Testing

**Status:** Not Started | In Progress | Complete

**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

### 6.5 SEO Optimization

**Status:** Not Started | In Progress | Complete

**All Pages:**
- [ ] Meta titles set
- [ ] Meta descriptions set
- [ ] Open Graph tags added
- [ ] Twitter Card tags added
- [ ] Canonical URLs set
- [ ] Schema markup added (Organization, LocalBusiness)
- [ ] Sitemap updated
- [ ] robots.txt updated

**Example Meta Tags:**
```tsx
// app/about/page.tsx
export const metadata = {
  title: 'About Us - Pizza Space | Our Story & Team',
  description: 'Learn about Pizza Space, our mission, values, and the passionate team behind the best pizzas in town.',
  openGraph: {
    title: 'About Us - Pizza Space',
    description: 'Learn about our story, mission, and team',
    url: 'https://pizzaspace.com/about',
    images: ['/og-image-about.jpg'],
  },
};
```

---

## Phase 7: Content Creation

### 7.1 About Page Content

**Status:** Not Started | In Progress | Complete

**Content Needed:**

**Mission Statement:**
- [ ] Write mission paragraph (100-150 words)

**Vision Statement:**
- [ ] Write vision paragraph (100-150 words)

**Company Values:**
- [ ] Value 1 (title + description)
- [ ] Value 2 (title + description)
- [ ] Value 3 (title + description)
- [ ] Value 4 (title + description)

**Team Members (min 6):**
- [ ] Name, Role, Bio, Avatar, LinkedIn, Twitter, Email
- [ ] Repeat for each team member

**Timeline Milestones (5-8 events):**
- [ ] 2024: Event title + description
- [ ] 2023: Event title + description
- [ ] 2022: Event title + description
- [ ] 2021: Event title + description
- [ ] Earlier milestones...

**Statistics:**
- [ ] Number of stores
- [ ] Number of pizzas sold
- [ ] Years in business
- [ ] Customer satisfaction score

### 7.2 Contact Page Content

**Status:** Not Started | In Progress | Complete

**Content Needed:**
- [ ] Hero title and subtitle
- [ ] Contact info (already in ContactInfo component)
- [ ] Optional: Office hours
- [ ] Optional: FAQ section

### 7.3 Store Page Content

**Status:** Not Started | In Progress | Complete

**Content Needed:**

**Store Data (all locations):**
- [ ] Store name
- [ ] Full address
- [ ] Latitude/Longitude
- [ ] Phone number
- [ ] Opening hours
- [ ] Store ID

**Filter Options:**
- [ ] City/Region list
- [ ] Special features (e.g., "Dine-in", "Drive-thru")

---

## Phase 8: Deployment

### 8.1 Pre-Deployment Checklist

**Status:** Not Started | In Progress | Complete

- [ ] All pages built successfully
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Environment variables set
- [ ] Google Maps API key configured
- [ ] All content added
- [ ] All images uploaded and optimized
- [ ] SEO meta tags complete
- [ ] Sitemap updated
- [ ] robots.txt configured

### 8.2 Deployment Steps

**Status:** Not Started | In Progress | Complete

- [ ] Run production build
- [ ] Test production build locally
- [ ] Deploy to staging
- [ ] Test on staging
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor for errors

**Commands:**
```bash
# Build and test
npm run build
npm run start

# Deploy (adjust for your platform)
git push origin main
```

---

## Time Estimates

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1: Shared Components | 1 component | 1-2 hours |
| Phase 2: About Page | 2 components + page | 7-10 hours |
| Phase 3: Contact Page | Page layout | 1-2 hours |
| Phase 4: Store Page | 2 components + page | 9-11 hours |
| Phase 5: Navigation | Header + Footer | 1.5 hours |
| Phase 6: Testing | All testing | 4-6 hours |
| Phase 7: Content | Write all content | 6-8 hours |
| Phase 8: Deployment | Deploy + verify | 2-3 hours |
| **Total** | | **32-43.5 hours** |

## Dependencies to Install

```bash
# Google Maps (for Store page)
npm install @react-google-maps/api

# Already installed (verify)
npm list framer-motion lucide-react react-hook-form zod
```

## Environment Variables

Create/update `.env.local`:

```env
# Google Maps API Key (for Store page)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# Other existing variables
# ...
```

## Final Verification

Before marking complete:

- [ ] All 3 pages live and functional
- [ ] Navigation working
- [ ] All links tested
- [ ] Forms working
- [ ] Maps loading
- [ ] No console errors
- [ ] Lighthouse scores > 90
- [ ] Mobile responsive
- [ ] Dark mode working
- [ ] Accessibility compliant
- [ ] SEO optimized
- [ ] Content complete and reviewed

---

**Project Status:** Not Started

**Start Date:** _________

**Target Completion Date:** _________

**Actual Completion Date:** _________

---

## Notes

Use this checklist to track progress. Check off items as you complete them. Update the status fields (Not Started | In Progress | Complete) for each phase.

For questions or issues, refer to:
- DESIGN_SYSTEM_SPEC3.md (detailed component docs)
- QUICK_REFERENCE_SPEC3.md (token reference)
- COMPONENT_HIERARCHY.md (structure guide)
