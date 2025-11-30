# Quick Start Guide - Spec3 Implementation

**Project:** Pizza Space About, Contact, Store Pages
**Date:** 2025-12-01
**Status:** Ready for Development

---

## Overview

This guide provides a streamlined path to implementing the three spec3 pages. Read this first, then refer to the detailed requirements and component mapping documents as needed.

**Key Documents:**
- `/docs/spec3/requirements.md` - Complete specifications (1448 lines)
- `/docs/spec3/shadcn-component-mapping.md` - Component reference
- This file - Implementation workflow

---

## Pre-Implementation Checklist

### 1. Install Missing shadcn Components

```bash
# Navigate to project root
cd /Users/vrajpatel/Documents/personal/pizzaspace_web

# Install required shadcn components
npx shadcn@latest add card breadcrumb separator avatar tabs
```

### 2. Install Google Maps Dependency

```bash
npm install @react-google-maps/api
```

### 3. Set Up Environment Variables

Create or update `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Get API Key:** https://console.cloud.google.com/google/maps-apis

### 4. Create Constants Files

```bash
# Create constants directory if not exists
mkdir -p lib/constants

# Create placeholder content files
touch lib/constants/about.ts
touch lib/constants/contact.ts
```

---

## Implementation Workflow

### Phase 1: About Page (Days 1-3)

#### Day 1: Structure & Hero
```bash
# Create directory structure
mkdir -p app/about
mkdir -p components/about/hero-section
mkdir -p components/about/story-section
mkdir -p components/about/mission-vision-section
mkdir -p components/about/team-section
mkdir -p components/about/stores-preview-section
```

**Tasks:**
1. Create `app/about/page.tsx` with metadata
2. Build hero section (reuse home patterns)
3. Add breadcrumb navigation
4. Test responsive layout and dark mode

**Key Files:**
- `app/about/page.tsx`
- `components/about/hero-section/index.tsx`
- `components/about/hero-section/hero-content.tsx`
- `components/about/hero-section/background-decorations.tsx`

#### Day 2: Story & Mission/Vision
**Tasks:**
1. Create Our Story section with timeline
2. Implement Mission & Vision with value cards
3. Add Framer Motion animations
4. Test scroll-triggered animations

**Key Components:**
- Custom Timeline (no shadcn equivalent)
- Card component for values
- Stats counter (reuse from home)

**Timeline Data Structure:**
```typescript
// lib/constants/about.ts
export const timeline = [
  {
    year: '2020',
    title: 'Founded',
    description: 'Pizza Space opened its first location in London...',
    image: '/images/timeline/2020.jpg'
  },
  {
    year: '2021',
    title: 'First Expansion',
    description: 'Expanded to Manchester with our second location...',
    image: '/images/timeline/2021.jpg'
  },
  // Add more milestones
]

export const values = [
  {
    icon: 'Target',
    title: 'Quality',
    description: 'We never compromise on ingredients or technique...'
  },
  // Add 5-7 more values
]
```

#### Day 3: Team & Stores Preview
**Tasks:**
1. Create team section with Avatar components
2. Add optional department filtering with Tabs
3. Implement stores preview (reuse StoreCard)
4. Add CTA button to stores page

**Team Data Structure:**
```typescript
// lib/constants/about.ts
export const team = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Head Chef',
    department: 'kitchen',
    photo: '/images/team/john.jpg',
    bio: 'John brings 15 years of Italian culinary expertise...',
    initials: 'JS'
  },
  // Add 4-8 team members
]
```

**Completion Criteria:**
- All 5 sections visible and functional
- Responsive on mobile, tablet, desktop
- Dark mode working
- No TypeScript errors
- Animations smooth

---

### Phase 2: Contact Page (Days 4-5)

#### Day 4: Hero & Contact Form/Info
```bash
# Create directory structure
mkdir -p app/contact
mkdir -p components/contact/hero-section
mkdir -p components/contact/contact-main-section
mkdir -p components/contact/map-section
```

**Tasks:**
1. Create `app/contact/page.tsx` with metadata
2. Build compact hero section
3. Create two-column layout (info + form)
4. Reuse ContactForm from home
5. Create contact info cards with icons

**Key Files:**
- `app/contact/page.tsx`
- `components/contact/hero-section/index.tsx`
- `components/contact/contact-main-section/index.tsx`
- Reuse: `components/home/contact-section/contact-form.tsx`

**Contact Data:**
```typescript
// lib/constants/contact.ts
export const contactInfo = {
  phone: {
    display: '+44 20 1234 5678',
    href: 'tel:+442012345678',
    icon: 'Phone'
  },
  email: {
    display: 'hello@pizzaspace.com',
    href: 'mailto:hello@pizzaspace.com',
    icon: 'Mail'
  },
  address: {
    display: '123 Pizza Street, London, UK',
    icon: 'MapPin'
  },
  businessHours: [
    { day: 'Monday - Friday', hours: '10:00 - 23:00' },
    { day: 'Saturday - Sunday', hours: '11:00 - 00:00' }
  ],
  socialLinks: [
    { platform: 'Facebook', url: 'https://facebook.com/pizzaspace', icon: 'Facebook' },
    { platform: 'Instagram', url: 'https://instagram.com/pizzaspace', icon: 'Instagram' },
    { platform: 'Twitter', url: 'https://twitter.com/pizzaspace', icon: 'Twitter' }
  ]
}
```

#### Day 5: Google Maps Integration
**Tasks:**
1. Create MapWrapper component
2. Fetch stores data
3. Add markers for all stores
4. Implement InfoWindow with store details
5. Add store list sidebar (optional)

**Key Component:**
```tsx
// components/shared/google-maps/map-wrapper.tsx
'use client'

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'

export function MapWrapper({ stores, height = '60vh' }) {
  const [selected, setSelected] = useState(null)

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height }}
        center={{ lat: 51.5074, lng: -0.1278 }}
        zoom={10}
      >
        {stores.map(store => (
          <Marker
            key={store._id}
            position={{ lat: store.lat, lng: store.long }}
            onClick={() => setSelected(store)}
          />
        ))}
        {/* InfoWindow implementation */}
      </GoogleMap>
    </LoadScript>
  )
}
```

**Completion Criteria:**
- 3 sections complete and functional
- Form validation working
- Map loads and displays stores
- Markers clickable with info windows
- Mobile responsive
- Dark mode support

---

### Phase 3: Store Page (Days 6-8)

#### Day 6: Hero with Map
```bash
# Create directory structure
mkdir -p app/stores
mkdir -p components/stores/hero-section
mkdir -p components/stores/store-grid-section
mkdir -p components/stores/reservation-section
```

**Tasks:**
1. Create `app/stores/page.tsx` with metadata
2. Build search/filter bar
3. Integrate Google Maps (reuse MapWrapper)
4. Implement view toggle (map/grid)
5. Add URL state for filters (optional)

**Key Files:**
- `app/stores/page.tsx`
- `components/stores/hero-section/index.tsx`
- `components/stores/hero-section/search-filter-bar.tsx`

**State Management:**
```tsx
// app/stores/page.tsx
const [searchQuery, setSearchQuery] = useState('')
const [city, setCity] = useState('all')
const [viewMode, setViewMode] = useState<'map' | 'grid'>('grid')
const [sortBy, setSortBy] = useState('name')

// Derived state
const filteredStores = stores.filter(store => {
  const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        store.area.toLowerCase().includes(searchQuery.toLowerCase())
  const matchesCity = city === 'all' || store.city === city
  return matchesSearch && matchesCity
})
```

#### Day 7: Store Grid with Filters
**Tasks:**
1. Create enhanced StoreCard component
2. Add store features badges (WiFi, Parking, etc.)
3. Implement search functionality
4. Add city/region filter
5. Add sort options (A-Z, Nearest)
6. Create empty state for no results

**Enhanced StoreCard:**
```tsx
// components/stores/store-grid-section/store-card.tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Wifi, Car, TreePine } from 'lucide-react'

export function EnhancedStoreCard({ store }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{store.name}</CardTitle>
        <Badge>Open Now</Badge>
      </CardHeader>
      <CardContent>
        {/* Store details */}
        {/* Feature badges */}
        <div className="flex gap-2">
          {store.hasWifi && <Badge variant="secondary"><Wifi className="w-3 h-3" /> WiFi</Badge>}
          {store.hasParking && <Badge variant="secondary"><Car className="w-3 h-3" /> Parking</Badge>}
        </div>
      </CardContent>
      <CardFooter>
        <Button>Reserve Table</Button>
      </CardFooter>
    </Card>
  )
}
```

#### Day 8: Reservation Section
**Tasks:**
1. Wrap ReservationForm component
2. Accept storeId prop for pre-selection
3. Add section header
4. Test form submission flow

**Simple Wrapper:**
```tsx
// components/stores/reservation-section/index.tsx
import { ReservationForm } from '@/components/home/stores-section/reservation-form'

export function StoreReservationSection({ stores, preSelectedStoreId }) {
  return (
    <section className="py-16 bg-slate-50 dark:bg-navy-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Book a Table</h2>
          <p className="text-muted-foreground">Reserve your spot at your favorite location</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <ReservationForm
            stores={stores}
            defaultStoreId={preSelectedStoreId}
          />
        </div>
      </div>
    </section>
  )
}
```

**Completion Criteria:**
- All 3 sections working
- Search and filters functional
- Map/grid toggle working
- Store cards enhanced with features
- Reservation form integrated
- Mobile responsive
- Dark mode support

---

## Testing Checklist

### Functional Testing
- [ ] All navigation links work
- [ ] Breadcrumbs navigate correctly
- [ ] Contact form validates and submits
- [ ] Reservation form validates and submits
- [ ] Search filters stores correctly
- [ ] City filter works
- [ ] Map markers are clickable
- [ ] InfoWindows display correct data
- [ ] View toggle switches layouts
- [ ] Images load with fallbacks

### Responsive Testing
- [ ] Mobile (375px): All content readable, no horizontal scroll
- [ ] Tablet (768px): Layouts adapt properly
- [ ] Desktop (1280px): Full layout displays correctly
- [ ] 4K (2560px): Content doesn't stretch too wide

### Theme Testing
- [ ] Light theme: All text readable, proper contrast
- [ ] Dark theme: All text readable, proper contrast
- [ ] Theme toggle works on all pages
- [ ] No theme flash on page load
- [ ] Map styles adapt to theme

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces content
- [ ] ARIA labels present
- [ ] Heading hierarchy correct
- [ ] Form errors announced
- [ ] All images have alt text

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.8s
- [ ] Largest Contentful Paint < 2.5s
- [ ] No console errors
- [ ] No console warnings
- [ ] Animations smooth (60fps)

---

## Common Pitfalls & Solutions

### 1. Google Maps Not Loading
**Problem:** Map shows blank or error
**Solution:**
- Check API key is set in `.env.local`
- Verify API key has Maps JavaScript API enabled
- Check browser console for errors
- Ensure LoadScript component is used correctly

### 2. Form Validation Issues
**Problem:** Form doesn't validate or submits invalid data
**Solution:**
- Verify Zod schema is correctly defined
- Check React Hook Form resolver is set
- Ensure all required fields have validation
- Test with browser dev tools

### 3. Dark Mode Not Working
**Problem:** Components don't change in dark mode
**Solution:**
- Add `dark:` variant to all color classes
- Check ThemeProvider is wrapping app
- Test `dark` class on html element
- Verify CSS variables are defined

### 4. Animations Janky or Slow
**Problem:** Animations stutter or lag
**Solution:**
- Use transform and opacity only
- Avoid animating width/height
- Add `will-change` sparingly
- Use Intersection Observer for scroll animations
- Test on lower-end devices

### 5. TypeScript Errors
**Problem:** Type errors in components
**Solution:**
- Define proper interfaces for all props
- Use existing types from `/types`
- Import StoreResponse type for store data
- Check lucide-react icon imports

---

## File Structure Reference

```
app/
├── about/
│   └── page.tsx                    # About page route
├── contact/
│   └── page.tsx                    # Contact page route
└── stores/
    └── page.tsx                    # Stores page route

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
│   │   ├── expanded-mission-card.tsx
│   │   └── values-grid.tsx
│   ├── team-section/
│   │   ├── index.tsx
│   │   ├── team-grid.tsx
│   │   └── team-member-card.tsx
│   └── stores-preview-section/
│       └── index.tsx
├── contact/
│   ├── hero-section/
│   │   └── index.tsx
│   ├── contact-main-section/
│   │   ├── index.tsx
│   │   └── contact-info-cards.tsx
│   └── map-section/
│       ├── index.tsx
│       └── stores-list.tsx
├── stores/
│   ├── hero-section/
│   │   ├── index.tsx
│   │   └── search-filter-bar.tsx
│   ├── store-grid-section/
│   │   ├── index.tsx
│   │   ├── filter-controls.tsx
│   │   ├── enhanced-store-card.tsx
│   │   └── empty-state.tsx
│   └── reservation-section/
│       └── index.tsx
└── shared/
    ├── breadcrumb.tsx
    ├── section-header.tsx
    └── google-maps/
        ├── map-wrapper.tsx
        └── types.ts

lib/
├── constants/
│   ├── about.ts                   # Timeline, team, values data
│   ├── contact.ts                 # Contact info, hours, social links
│   └── stores.ts                  # Optional hardcoded store data
└── utils/
    └── map-utils.ts               # Google Maps helpers

types/
└── index.ts                       # StoreResponse and other types (already exists)
```

---

## Code Snippets for Common Patterns

### 1. Section Header (Reusable)
```tsx
// components/shared/section-header.tsx
import { motion } from 'framer-motion'

export function SectionHeader({
  overline,
  title,
  subtitle,
  centered = true
}: {
  overline: string
  title: string
  subtitle: string
  centered?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={centered ? 'text-center mb-12' : 'mb-12'}
    >
      <div className="inline-flex items-center gap-2 mb-4">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-orange-500" />
        <span className="text-sm text-orange-600 dark:text-orange-400 tracking-widest uppercase">
          {overline}
        </span>
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-orange-500" />
      </div>

      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        {title}
      </h2>

      <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
        {subtitle}
      </p>
    </motion.div>
  )
}
```

### 2. Page Metadata Template
```tsx
// app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us - Pizza Space | Our Story & Mission',
  description: 'Discover the story behind Pizza Space, our mission to bring authentic Italian flavors, and meet our passionate team.',
  openGraph: {
    title: 'About Us - Pizza Space',
    description: 'Discover the story behind Pizza Space...',
    images: [{ url: '/images/og-about.jpg' }],
  },
}

export default function AboutPage() {
  return (
    <main>
      {/* Page content */}
    </main>
  )
}
```

### 3. Breadcrumb Component
```tsx
// components/shared/breadcrumb.tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export function PageBreadcrumb({ currentPage }: { currentPage: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink>{currentPage}</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
```

---

## Next Steps

1. **Review Documents**
   - Read this Quick Start guide
   - Skim requirements.md for details
   - Reference shadcn-component-mapping.md as needed

2. **Set Up Environment**
   - Install shadcn components
   - Install Google Maps library
   - Set up API keys
   - Create constants files

3. **Start Implementation**
   - Begin with About page (Phase 1)
   - Test each section before moving on
   - Commit after each major section

4. **Testing & Refinement**
   - Run through testing checklist
   - Fix any issues found
   - Performance optimization
   - Final QA

5. **Deployment**
   - Build production version
   - Test on staging
   - Deploy to production
   - Monitor for issues

---

## Support Resources

- **Next.js 16 Docs:** https://nextjs.org/docs
- **shadcn/ui Docs:** https://ui.shadcn.com
- **Framer Motion:** https://www.framer.com/motion
- **Google Maps React:** https://react-google-maps-api-docs.netlify.app
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

---

**Last Updated:** 2025-12-01
**Status:** Ready for Implementation
**Estimated Completion:** 8 working days
