# Pizza Space Spec3 - Quick Reference Summary

## Overview
Three production-ready pages: About, Contact, and Stores

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui

**Design System:**
- Primary: Orange (#F97316)
- Secondary: Navy (#0e182b)
- Themes: Dark/Light support required
- Approach: Mobile-first responsive

---

## Page Breakdown

### 1. ABOUT PAGE (5 sections)

| Section | Components | Data Source | Complexity |
|---------|-----------|-------------|------------|
| Hero | Headline, decorative backgrounds | Static | Low |
| Our Story | Timeline, stats counter | Static | Medium |
| Mission & Vision | Expanded cards, values grid | Static | Low |
| Team | Team member cards, grid | Static | Medium |
| Stores Preview | Store cards, CTA button | API (3 stores) | Low |

**Key Components to Build:**
- AboutHeroSection
- OurStorySection (with Timeline)
- AboutMissionVisionSection (with ValuesGrid)
- TeamSection (with TeamMemberCard)
- StoresPreviewSection (reuse existing)

---

### 2. CONTACT PAGE (3 sections)

| Section | Components | Data Source | Complexity |
|---------|-----------|-------------|------------|
| Compact Hero | Headline, breadcrumb | Static | Low |
| Contact Info + Form | Info cards, contact form | Static + Form | Low (reuse) |
| Map Section | Google Maps, store list | API (stores) | Medium |

**Key Components to Build:**
- ContactHeroSection
- ContactMainSection (two-column layout)
- ContactMapSection (Google Maps integration)

**Reused Components:**
- ContactForm (from home page)
- ContactInfo (enhanced from home page)

---

### 3. STORES PAGE (3 sections)

| Section | Components | Data Source | Complexity |
|---------|-----------|-------------|------------|
| Hero + Map | Search, filters, interactive map | API (stores) | High |
| Store Grid | Filterable cards, search, sort | API (stores) | Medium |
| Reservation | Booking form | API (stores) | Low (reuse) |

**Key Components to Build:**
- StorePageHeroSection (with SearchFilterBar)
- StoreGridSection (with FilterControls)
- StoreReservationSection (wrapper)
- GoogleMapFull (with markers, info windows)

**Reused Components:**
- ReservationForm (exact reuse from home)
- StoreCard (enhanced version)

---

## Component Reuse Matrix

| Component | Source | Usage | Modifications |
|-----------|--------|-------|---------------|
| ReservationForm | /components/home/stores-section/ | Stores page | None - exact reuse |
| ContactForm | /components/home/contact-section/ | Contact page | Minor enhancements |
| StoreCard | /components/home/stores-section/ | About, Stores | Add features badges |
| MissionCard | /components/home/mission-vision-section/ | About page | Extend with more content |
| StatsCounter | /components/home/about-section/ | About page | None - exact reuse |
| BackgroundDecorations | Pattern from home sections | All pages | Adapt per section |
| SectionHeader | Pattern from home sections | All pages | Standardize component |

---

## Data Requirements

### API Endpoints
```typescript
// Stores data (already exists)
getStores({
  isActive: true,
  featured?: boolean,
  limit?: number
})
```

### Static Content Files to Create
```typescript
// lib/constants/about.ts
- Company story text
- Timeline data (4-6 milestones)
- Values array (6 values)
- Team members array (4-8 people)

// lib/constants/contact.ts
- Contact information
- Business hours
- Social media links
- Office locations

// lib/constants/stores.ts (optional)
- Fallback store data if API fails
```

---

## Third-Party Integrations

### Google Maps
**Required for:**
- Contact page: Map with all stores
- Stores page: Interactive map with search

**Setup:**
```bash
npm install @react-google-maps/api
```

**Environment Variable:**
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

**Features Needed:**
- Markers for each store
- Info windows on click
- Custom marker icons
- Theme-aware styling
- Optional: Marker clustering

---

## Implementation Checklist

### Phase 1: Setup (1 day)
- [ ] Install Google Maps package
- [ ] Set up Google Maps API key
- [ ] Create constants files for static content
- [ ] Create shared components (Breadcrumb, SectionHeader)
- [ ] Set up page routes (/about, /contact, /stores)

### Phase 2: About Page (2-3 days)
- [ ] Hero section with decorations
- [ ] Our Story section with timeline
- [ ] Mission & Vision with values grid
- [ ] Team section with cards
- [ ] Stores preview (reuse existing)
- [ ] Test responsive and accessibility

### Phase 3: Contact Page (2 days)
- [ ] Compact hero
- [ ] Contact info column
- [ ] Contact form (reuse and enhance)
- [ ] Google Maps integration
- [ ] Store list sidebar
- [ ] Test form submission flow

### Phase 4: Stores Page (3 days)
- [ ] Hero with search/filter bar
- [ ] Google Maps full integration
- [ ] Store grid with enhanced cards
- [ ] Filter controls (search, city, sort)
- [ ] Reservation section (reuse form)
- [ ] Test filtering and map interaction

### Phase 5: Polish (1-2 days)
- [ ] Animation refinements
- [ ] Dark/light theme testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Mobile testing

**Total Estimated Time:** 9-11 days

---

## Critical Path Items

### Must-Have for MVP
1. Google Maps working with markers
2. Forms validate and show success/error states
3. Store filtering works (search, city)
4. Responsive on mobile, tablet, desktop
5. Dark/light theme support
6. Keyboard accessible
7. No TypeScript/ESLint errors

### Can Defer Post-MVP
1. Advanced timeline animations
2. Team member detail modals
3. Marker clustering
4. Geolocation/distance calculation
5. Individual store detail pages
6. Real-time table availability

---

## Quality Gates

### Before Deployment
- [ ] All pages load without errors
- [ ] Forms submit successfully
- [ ] Maps display all stores correctly
- [ ] Filters work as expected
- [ ] Images load with proper fallbacks
- [ ] Lighthouse score > 90
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile responsive (no horizontal scroll)
- [ ] Keyboard navigation functional
- [ ] Screen reader announces content
- [ ] Dark/light theme consistent

---

## Key Design Patterns

### Section Pattern
```tsx
<section className="relative py-16 md:py-24 overflow-hidden">
  <BackgroundDecorations />
  <div className="relative z-10 container mx-auto px-4">
    <SectionHeader
      overline="Section Category"
      title="Main Heading"
      subtitle="Supporting text"
    />
    {/* Section content */}
  </div>
</section>
```

### Card Hover Pattern
```tsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg
             hover:shadow-xl transition-shadow"
>
  {/* Card content */}
</motion.div>
```

### Responsive Grid Pattern
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## File Structure

```
app/
├── about/page.tsx (5 sections)
├── contact/page.tsx (3 sections)
└── stores/page.tsx (3 sections)

components/
├── about/ (4 new section folders)
├── contact/ (3 new section folders)
├── stores/ (3 new section folders)
└── shared/ (breadcrumb, section-header, map components)

lib/
├── constants/
│   ├── about.ts (NEW)
│   ├── contact.ts (NEW)
│   └── stores.ts (optional)
└── utils/
    └── map-utils.ts (NEW)
```

**New Files to Create:** ~30-40 files
**Files to Reuse/Enhance:** ~5 files

---

## Accessibility Checklist

- [ ] Semantic HTML (header, nav, main, section, article)
- [ ] Proper heading hierarchy (h1 -> h2 -> h3)
- [ ] Alt text for all images
- [ ] Labels for all form inputs
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast WCAG AA
- [ ] Screen reader tested
- [ ] No motion for users who prefer reduced motion

---

## Performance Targets

| Metric | Target | Critical |
|--------|--------|----------|
| Lighthouse Score | > 90 | Yes |
| First Contentful Paint | < 1.8s | Yes |
| Largest Contentful Paint | < 2.5s | Yes |
| Time to Interactive | < 3.8s | No |
| Cumulative Layout Shift | < 0.1 | Yes |

**Optimization Strategies:**
- Use CustomImage for all images (lazy loading, WebP)
- Dynamic import for Google Maps
- Server-side data fetching where possible
- Minimize client-side JavaScript
- Use CSS transforms for animations

---

## Testing Strategy

### Unit Testing
- Form validation schemas
- Utility functions (map utils)
- Data transformation functions

### Integration Testing
- Form submission flow
- Filter/search functionality
- Map marker interactions

### Manual Testing
- Responsive design on real devices
- Browser compatibility
- Keyboard navigation
- Screen reader compatibility
- Theme switching

---

## Deployment Notes

### Environment Variables
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
NEXT_PUBLIC_API_BASE_URL=your_api_url
```

### Build Command
```bash
npm run build
```

### Verify Build
- Check for build errors
- Test production build locally
- Verify environment variables
- Check bundle size

---

## Support & Documentation

**Full Requirements:** /docs/spec3/requirements.md
**Spec Document:** /spec/spec3.md
**Design Guidelines:** Follow home page patterns
**Component Examples:** /components/home/*

**Questions or Issues:**
- Refer to requirements.md for detailed specifications
- Check existing home components for patterns
- Consult Next.js 16 and React 19 documentation
- shadcn/ui documentation for component usage

---

**Document Version:** 1.0
**Last Updated:** 2025-12-01
**Status:** Ready for Development
