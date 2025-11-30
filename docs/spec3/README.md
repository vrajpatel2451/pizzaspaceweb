# Pizza Space Spec3 Documentation

**Project:** About, Contact, and Store Pages Implementation
**Date:** 2025-12-01
**Status:** Ready for Development
**Estimated Effort:** 8 working days

---

## Documentation Overview

This directory contains comprehensive documentation for implementing three production-ready pages for Pizza Space. All documents follow Next.js 16 App Router patterns, React 19 best practices, and the established design system.

---

## Quick Navigation

### Start Here
📘 **[QUICK_START.md](./QUICK_START.md)** - Read this first
- Pre-implementation checklist
- Day-by-day workflow (8 days)
- Testing checklist
- Common pitfalls and solutions

### Core Documentation
📋 **[requirements.md](./requirements.md)** - Complete specifications (1,448 lines)
- All 3 pages broken down into sections
- Component hierarchies
- Data flow patterns
- Accessibility requirements
- Animation specifications
- Responsive breakpoints
- SEO requirements
- Testing criteria

🧩 **[shadcn-component-mapping.md](./shadcn-component-mapping.md)** - Component reference
- Complete mapping of UI elements to shadcn components
- Verified component availability
- Code examples for each pattern
- Installation commands
- Custom component implementations (Timeline, Google Maps)

🏗️ **[architecture.md](./architecture.md)** - Technical architecture
- Server vs Client component strategy
- Performance optimization patterns
- File structure
- TypeScript interfaces

### Supporting Documents
📊 **[SUMMARY.md](./SUMMARY.md)** - Executive summary
📝 **[plan_exec.md](./plan_exec.md)** - Execution plan
🔍 **[component-research.md](./component-research.md)** - Component research

---

## Page Specifications

### 1. About Page (`/about`)
**Sections:** 5
- Hero Section (Brand story introduction)
- Our Story (Timeline with company history)
- Mission & Vision (Expanded cards with values)
- Team Section (Team member cards with photos)
- Stores Preview (Featured stores with CTA)

**Key Components:**
- Custom Timeline (no shadcn equivalent)
- Avatar for team photos
- Card for mission/vision/values
- Breadcrumb navigation

### 2. Contact Page (`/contact`)
**Sections:** 3
- Compact Hero (Contact headline)
- Contact Info + Form (Two-column layout)
- Map Section (Google Maps with store markers)

**Key Components:**
- ContactForm (reuse from home)
- Card for contact info display
- Google Maps integration
- InfoWindow for store details

### 3. Store Page (`/stores`)
**Sections:** 3
- Hero + Interactive Map (Google Maps integration)
- Store Grid (Filterable, searchable store cards)
- Reservation (Booking form - reuse from home)

**Key Components:**
- EnhancedStoreCard with feature badges
- Search and filter controls
- Google Maps with clustering
- ReservationForm (reuse from home)

---

## Technology Stack

### Framework & Libraries
- **Next.js:** 16.x (App Router)
- **React:** 19.x
- **TypeScript:** Strict mode
- **Tailwind CSS:** 4.x
- **shadcn/ui:** new-york style

### Key Dependencies
- **Framer Motion:** Animations
- **React Hook Form:** Form management
- **Zod:** Schema validation
- **date-fns:** Date manipulation
- **lucide-react:** Icons
- **sonner:** Toast notifications

### New Dependencies Required
```bash
# shadcn components
npx shadcn@latest add card breadcrumb separator avatar tabs

# Google Maps
npm install @react-google-maps/api
```

---

## Design System

### Colors
- **Primary:** Orange `#F97316`
- **Secondary:** Navy `#0e182b`
- **Theme:** Dark/Light mode support required

### Typography
- **Headings:** Geist Sans (via next/font/google)
- **Body:** Geist Sans
- **Code:** Geist Mono

### Breakpoints (Mobile-First)
```css
sm: 640px   /* Tablets */
md: 768px   /* Small laptops */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

---

## Component Reuse Strategy

### From Home Page
✅ **ReservationForm** - Reuse as-is for Store page
✅ **ContactForm** - Reuse with minor enhancements for Contact page
✅ **StoreCard** - Enhance with feature badges for Store page
✅ **MissionCard** - Extend for About page
✅ **BackgroundDecorations** - Reuse pattern across all pages
✅ **SectionHeader** - Consistent pattern across all pages
✅ **StatsCounter** - Reuse for About page Story section

### shadcn Components
- **Card:** Store cards, team cards, value cards, contact info
- **Avatar:** Team member photos with fallback
- **Badge:** Store features, status indicators, roles
- **Button:** CTAs, form submissions, navigation
- **Breadcrumb:** Page navigation (all pages)
- **Input:** Search, form fields
- **Select:** Dropdowns, filters
- **Tabs:** Team department filter, view toggle
- **Separator:** Visual dividers
- **Calendar:** Date picker (already in ReservationForm)

### Custom Components
🛠️ **Timeline** - No shadcn equivalent, build with CSS Grid + Framer Motion
🗺️ **Google Maps** - Integration with @react-google-maps/api
📊 **Stats Counter** - Animation with Intersection Observer
🎨 **Floating Decorations** - Framer Motion animations

---

## Implementation Workflow

### Phase 1: About Page (Days 1-3)
**Day 1:** Structure, Hero, Breadcrumb
**Day 2:** Story, Mission/Vision, Values
**Day 3:** Team, Stores Preview

**Completion Criteria:**
- 5 sections visible and functional
- Responsive on all breakpoints
- Dark mode working
- Animations smooth

### Phase 2: Contact Page (Days 4-5)
**Day 4:** Hero, Contact Info, Form
**Day 5:** Google Maps integration

**Completion Criteria:**
- Form validation working
- Map displays stores
- Markers clickable
- Mobile responsive

### Phase 3: Store Page (Days 6-8)
**Day 6:** Hero with search/filter
**Day 7:** Store grid with enhanced cards
**Day 8:** Reservation section

**Completion Criteria:**
- Search/filter functional
- Store cards enhanced
- Reservation integrated
- Map/grid toggle working

---

## Data Flow

### API Endpoints
```typescript
// Fetch stores
GET /api/stores
  Query: { isActive: true, featured?: true, limit?: number }
  Response: PaginatedResponse<StoreResponse[]>

// Contact form submission (mock)
POST /api/contact
  Body: { fullName, email, phone, subject, message }
  Response: { success: boolean, message: string }

// Reservation submission (mock)
POST /api/reservations
  Body: { storeId, date, time, guests, name, phone, ... }
  Response: { success: boolean, message: string }
```

### Static Content
```typescript
// lib/constants/about.ts
export const timeline = [...]
export const values = [...]
export const team = [...]

// lib/constants/contact.ts
export const contactInfo = {...}
export const businessHours = [...]
export const socialLinks = [...]
```

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Get API Key:** https://console.cloud.google.com/google/maps-apis
**Required APIs:** Maps JavaScript API, Places API (optional)

---

## File Structure

```
app/
├── about/page.tsx          # About page route
├── contact/page.tsx        # Contact page route
└── stores/page.tsx         # Stores page route

components/
├── about/                  # About page components
│   ├── hero-section/
│   ├── story-section/
│   ├── mission-vision-section/
│   ├── team-section/
│   └── stores-preview-section/
├── contact/                # Contact page components
│   ├── hero-section/
│   ├── contact-main-section/
│   └── map-section/
├── stores/                 # Stores page components
│   ├── hero-section/
│   ├── store-grid-section/
│   └── reservation-section/
└── shared/                 # Shared components
    ├── breadcrumb.tsx
    ├── section-header.tsx
    └── google-maps/

lib/
├── constants/
│   ├── about.ts           # About page data
│   ├── contact.ts         # Contact page data
│   └── stores.ts          # Store data (optional)
└── utils/
    └── map-utils.ts       # Google Maps helpers
```

---

## Accessibility Compliance

### WCAG 2.1 AA Requirements
✅ Semantic HTML5 structure
✅ Proper heading hierarchy
✅ ARIA labels for interactive elements
✅ Keyboard navigation support
✅ Screen reader announcements
✅ Color contrast ratios (4.5:1 for normal text)
✅ Focus indicators
✅ Alt text for all images
✅ Form field labels and error messages

### Testing Tools
- **axe DevTools:** Browser extension for accessibility testing
- **WAVE:** Web accessibility evaluation tool
- **Lighthouse:** Performance and accessibility audits
- **Keyboard:** Manual keyboard navigation testing
- **Screen Reader:** NVDA (Windows) or VoiceOver (Mac)

---

## Performance Targets

### Core Web Vitals
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.8s
- **Lighthouse Score:** > 90

### Optimization Strategies
- Use Next.js Image optimization (CustomImage component)
- Lazy load below-fold sections
- Code splitting with dynamic imports
- Server Components for static content
- Minimize client-side JavaScript
- Optimize Google Maps bundle size

---

## Testing Strategy

### Manual Testing
- [ ] Functional testing (all interactions work)
- [ ] Responsive testing (mobile, tablet, desktop)
- [ ] Theme testing (light/dark modes)
- [ ] Accessibility testing (keyboard, screen reader)
- [ ] Browser testing (Chrome, Firefox, Safari, Edge)

### Automated Testing (Future)
- Unit tests for utility functions
- Integration tests for forms
- E2E tests for critical user flows
- Visual regression tests

---

## SEO Implementation

### Meta Tags (Per Page)
```typescript
// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About Us - Pizza Space | Our Story & Mission',
  description: 'Discover the story behind Pizza Space...',
  openGraph: {
    title: 'About Us - Pizza Space',
    description: '...',
    images: [{ url: '/og-about.jpg' }],
  },
}
```

### Structured Data
- Organization schema (About page)
- LocalBusiness schema (Stores page)
- BreadcrumbList schema (All pages)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All TypeScript errors resolved
- [ ] All ESLint warnings fixed
- [ ] No console errors in browser
- [ ] Environment variables set
- [ ] Google Maps API key configured
- [ ] Images optimized
- [ ] Meta tags implemented
- [ ] Structured data added

### Testing
- [ ] All pages load correctly
- [ ] Forms submit successfully
- [ ] Maps display properly
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Performance targets met
- [ ] Accessibility compliance verified

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check analytics
- [ ] Test on production URL
- [ ] Verify SEO indexing

---

## Common Issues & Solutions

### Issue: Google Maps blank or not loading
**Solution:** Check API key, enable Maps JavaScript API, verify LoadScript usage

### Issue: Form validation not working
**Solution:** Verify Zod schema, check React Hook Form resolver, test with dev tools

### Issue: Dark mode not applying
**Solution:** Add `dark:` variants, check ThemeProvider, verify CSS variables

### Issue: Animations janky
**Solution:** Use transform/opacity only, avoid width/height, test on lower-end devices

### Issue: TypeScript errors
**Solution:** Define proper interfaces, import types from `/types`, check imports

---

## Support & Resources

### Documentation
- [Next.js 16 Docs](https://nextjs.org/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)
- [React Hook Form](https://react-hook-form.com)
- [Google Maps React](https://react-google-maps-api-docs.netlify.app)

### Project Files
- Home page components: `/components/home/`
- Existing types: `/types/index.ts`
- Design guidelines: `/CLAUDE.md`

---

## Next Actions

1. **Read QUICK_START.md** for implementation workflow
2. **Install dependencies** (shadcn components + Google Maps)
3. **Set up environment** (API keys, constants files)
4. **Begin Phase 1** (About page - Days 1-3)
5. **Test and iterate** after each section
6. **Move to Phase 2** (Contact page - Days 4-5)
7. **Complete Phase 3** (Store page - Days 6-8)
8. **Final QA and deployment**

---

## Document Index

| Document | Purpose | Lines | Read Time |
|----------|---------|-------|-----------|
| README.md | This file - Overview and navigation | 500+ | 10 min |
| QUICK_START.md | Implementation workflow and setup | 600+ | 15 min |
| requirements.md | Complete specifications | 1,448 | 30 min |
| shadcn-component-mapping.md | Component reference | 700+ | 15 min |
| architecture.md | Technical architecture | 1,000+ | 20 min |
| SUMMARY.md | Executive summary | 300+ | 5 min |
| plan_exec.md | Execution plan | 1,000+ | 20 min |
| component-research.md | Component research | 1,500+ | 30 min |

**Total Documentation:** ~7,000+ lines
**Estimated Read Time:** 2-3 hours (full read)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-12-01 | Initial documentation created |

---

**Status:** ✅ Ready for Implementation
**Next Review:** After Phase 1 completion
**Maintainer:** Development Team
