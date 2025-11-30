# shadcn Component Mapping for Spec3 Pages

**Project:** Pizza Space - About, Contact, Store Pages
**Created:** 2025-12-01
**Registry:** @shadcn (new-york style)

---

## Overview

This document provides a complete mapping of UI elements to shadcn/ui components for the three spec3 pages. All components listed are verified as available in the @shadcn registry.

---

## Component Availability Matrix

### Core UI Components (Available in @shadcn)

| Component | Registry Path | Usage in Spec3 | Notes |
|-----------|--------------|----------------|-------|
| `avatar` | @shadcn/avatar | Team member photos | Fallback support built-in |
| `badge` | @shadcn/badge | Store features, status indicators | Already installed |
| `breadcrumb` | @shadcn/breadcrumb | Page navigation | Schema.org markup |
| `button` | @shadcn/button | CTAs, form submissions | Already installed |
| `calendar` | @shadcn/calendar | Reservation date picker | Already used in ReservationForm |
| `card` | @shadcn/card | Store cards, team cards, value cards | Primary container |
| `checkbox` | @shadcn/checkbox | Form agreements | Already installed |
| `input` | @shadcn/input | Search, form fields | Already installed |
| `label` | @shadcn/label | Form labels | Already installed |
| `popover` | @shadcn/popover | Date picker container | Already installed |
| `select` | @shadcn/select | Dropdowns, filters | Already installed |
| `separator` | @shadcn/separator | Visual dividers | Horizontal/vertical support |
| `tabs` | @shadcn/tabs | Team department filter | Keyboard accessible |
| `textarea` | @shadcn/textarea | Multi-line text input | Already installed |

### Components to Build Custom

| Component | Reason | Base Pattern |
|-----------|--------|--------------|
| Timeline | No native shadcn component | Custom with CSS Grid + Framer Motion |
| Google Maps | Third-party integration | @react-google-maps/api |
| Store Marker | Custom map marker | SVG icon + Google Maps API |
| Floating Decorations | Design-specific | Framer Motion + CSS |
| Stats Counter | Animation requirement | Custom with Intersection Observer |

---

## Page-by-Page Component Mapping

### 1. ABOUT PAGE

#### 1.1 Hero Section
```typescript
// No shadcn components needed - custom implementation
- Custom gradient backgrounds
- Framer Motion animations
- Pattern: components/home/hero-section/
```

#### 1.2 Our Story Section
```typescript
- Timeline: CUSTOM (no shadcn timeline)
  - Base: <div> with CSS Grid
  - Animation: Framer Motion
  - Pattern: Vertical on mobile, horizontal on desktop

- Stats Counter: REUSE from home
  - Path: components/home/about-section/stats-counter.tsx
  - No shadcn needed - custom implementation
```

**Timeline Implementation Strategy:**
```tsx
// Custom timeline - no shadcn component exists
<div className="relative">
  {/* Timeline line */}
  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border" />

  {/* Timeline items */}
  {timeline.map((item, i) => (
    <motion.div
      key={i}
      className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
    >
      {/* Year marker */}
      <div className="flex items-center justify-center">
        <Badge variant="outline">{item.year}</Badge>
      </div>

      {/* Content card */}
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent>{item.description}</CardContent>
      </Card>
    </motion.div>
  ))}
</div>
```

#### 1.3 Mission & Vision Section
```typescript
- Card: @shadcn/card
  - CardHeader, CardTitle, CardContent
  - Enhanced mission/vision cards
  - Values grid (6-8 cards)

- Icons: lucide-react (already installed)
  - Target, Eye, Heart, Sparkles, Leaf, Users
```

**Usage:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

<Card className="hover:shadow-xl transition-shadow">
  <CardHeader>
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500">
      <Target className="w-6 h-6 text-white" />
    </div>
    <CardTitle>Our Mission</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Mission statement...</p>
    <ul>
      <li>Point 1</li>
      <li>Point 2</li>
    </ul>
  </CardContent>
</Card>
```

#### 1.4 Team Section
```typescript
- Card: @shadcn/card
  - Team member container

- Avatar: @shadcn/avatar
  - AvatarImage, AvatarFallback
  - 1:1 aspect ratio photos

- Tabs: @shadcn/tabs (optional)
  - TabsList, TabsTrigger, TabsContent
  - Department filtering

- Badge: @shadcn/badge
  - Role indicators
```

**Usage:**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">All Team</TabsTrigger>
    <TabsTrigger value="leadership">Leadership</TabsTrigger>
    <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
  </TabsList>

  <TabsContent value="all">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {team.map(member => (
        <Card key={member.id}>
          <CardHeader>
            <Avatar className="w-24 h-24 mx-auto mb-4">
              <AvatarImage src={member.photo} alt={member.name} />
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-center">{member.name}</CardTitle>
            <Badge variant="secondary" className="mx-auto">
              {member.role}
            </Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              {member.bio}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </TabsContent>
</Tabs>
```

#### 1.5 Stores Preview Section
```typescript
- Card: @shadcn/card
  - REUSE: components/home/stores-section/store-card.tsx

- Button: @shadcn/button
  - CTA to /stores page

- Badge: @shadcn/badge
  - "Open Now" status
```

---

### 2. CONTACT PAGE

#### 2.1 Compact Hero Section
```typescript
- Breadcrumb: @shadcn/breadcrumb
  - BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator
  - Home / Contact
```

**Usage:**
```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink>Contact</BreadcrumbLink>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

#### 2.2 Contact Info + Form Section
```typescript
- Card: @shadcn/card
  - Contact information cards
  - Phone, Email, Address cards

- Input: @shadcn/input
- Textarea: @shadcn/textarea (alias for TextArea)
- Select: @shadcn/select
- Checkbox: @shadcn/checkbox
- Button: @shadcn/button
- Label: @shadcn/label

- Form: REUSE components/home/contact-section/contact-form.tsx
  - Already uses all shadcn form components
  - React Hook Form + Zod validation
```

**Contact Cards Pattern:**
```tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"

<div className="space-y-4">
  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
          <Phone className="w-5 h-5 text-orange-600" />
        </div>
        <CardTitle className="text-base">Phone</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <a href="tel:+15551234567" className="text-orange-600 hover:underline">
        +1 (555) 123-4567
      </a>
    </CardContent>
  </Card>

  <Card>
    <CardHeader className="pb-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-950 flex items-center justify-center">
          <Mail className="w-5 h-5 text-orange-600" />
        </div>
        <CardTitle className="text-base">Email</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <a href="mailto:hello@pizzaspace.com" className="text-orange-600 hover:underline">
        hello@pizzaspace.com
      </a>
    </CardContent>
  </Card>
</div>
```

#### 2.3 Map Section
```typescript
- Card: @shadcn/card (optional wrapper for map)
- Button: @shadcn/button (directions, view details)
- Badge: @shadcn/badge (store status)

- Google Maps: CUSTOM
  - Library: @react-google-maps/api
  - Components: GoogleMap, Marker, InfoWindow
```

---

### 3. STORE PAGE

#### 3.1 Hero + Interactive Map Section
```typescript
- Input: @shadcn/input
  - Search stores by name/area

- Select: @shadcn/select
  - City/region filter dropdown

- Tabs: @shadcn/tabs (optional)
  - View toggle: Map / Grid

- Badge: @shadcn/badge
  - Results count

- Google Maps: CUSTOM (@react-google-maps/api)
```

**Search/Filter Bar:**
```tsx
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

<div className="flex flex-col md:flex-row gap-4">
  {/* Search */}
  <Input
    type="search"
    placeholder="Search stores by name or area..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="flex-1"
  />

  {/* City Filter */}
  <Select value={city} onValueChange={setCity}>
    <SelectTrigger className="w-full md:w-48">
      <SelectValue placeholder="Select city" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Cities</SelectItem>
      <SelectItem value="london">London</SelectItem>
      <SelectItem value="manchester">Manchester</SelectItem>
    </SelectContent>
  </Select>

  {/* View Toggle */}
  <Tabs value={viewMode} onValueChange={setViewMode}>
    <TabsList>
      <TabsTrigger value="map">Map</TabsTrigger>
      <TabsTrigger value="grid">Grid</TabsTrigger>
    </TabsList>
  </Tabs>
</div>
```

#### 3.2 Store Grid Section
```typescript
- Card: @shadcn/card
  - REUSE + ENHANCE: components/home/stores-section/store-card.tsx

- Badge: @shadcn/badge
  - WiFi, Parking, Outdoor Seating features

- Button: @shadcn/button
  - View on map, Reserve table

- Input: @shadcn/input
  - Search input

- Select: @shadcn/select
  - Sort dropdown (A-Z, Nearest)

- Separator: @shadcn/separator
  - Visual dividers
```

**Enhanced Store Card:**
```tsx
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Phone, Clock, Wifi, Car, TreePine } from "lucide-react"

<Card className="hover:shadow-xl transition-shadow">
  <CardHeader>
    <div className="flex items-start justify-between gap-3">
      <div>
        <CardTitle>{store.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{store.area}</p>
      </div>
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Open Now
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="space-y-3">
    <div className="flex items-start gap-2 text-sm">
      <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
      <span>{store.address}</span>
    </div>

    <div className="flex items-center gap-2 text-sm">
      <Phone className="w-4 h-4 text-orange-500" />
      <a href={`tel:${store.phone}`} className="hover:underline">
        {store.phone}
      </a>
    </div>

    <div className="flex items-center gap-2 text-sm">
      <Clock className="w-4 h-4 text-orange-500" />
      <span>Daily: 10:00 - 23:00</span>
    </div>

    <Separator />

    {/* Features */}
    <div className="flex flex-wrap gap-2">
      {store.hasWifi && (
        <Badge variant="secondary" className="gap-1">
          <Wifi className="w-3 h-3" /> WiFi
        </Badge>
      )}
      {store.hasParking && (
        <Badge variant="secondary" className="gap-1">
          <Car className="w-3 h-3" /> Parking
        </Badge>
      )}
      {store.hasOutdoorSeating && (
        <Badge variant="secondary" className="gap-1">
          <TreePine className="w-3 h-3" /> Outdoor
        </Badge>
      )}
    </div>
  </CardContent>

  <CardFooter className="flex gap-2">
    <Button variant="default" className="flex-1">
      Reserve Table
    </Button>
    <Button variant="outline" className="flex-1">
      View on Map
    </Button>
  </CardFooter>
</Card>
```

#### 3.3 Reservation Section
```typescript
- ALL COMPONENTS: REUSE from components/home/stores-section/reservation-form.tsx
  - Already uses: Input, Select, Button, Label, Checkbox, Popover, Calendar
  - No changes needed, accept optional storeId prop
```

---

## Shared Component Patterns

### Breadcrumb Navigation (All Pages)
```typescript
Component: @shadcn/breadcrumb
Location: components/shared/breadcrumb.tsx

Usage:
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
```

### Section Header Pattern (All Pages)
```typescript
No shadcn component - custom pattern
Reuse from: components/home/mission-vision-section/

Structure:
  - Overline: decorative lines + text
  - Heading: h2 with gradient text
  - Subtitle: paragraph
```

### Background Decorations (All Pages)
```typescript
No shadcn component - custom Framer Motion
Reuse from: components/home/hero-section/background-shapes.tsx

Pattern:
  - Gradient orbs (absolute positioned divs)
  - Grid pattern overlays
  - Floating dots (Framer Motion animated)
```

---

## Component Installation Checklist

### Already Installed
- [x] button
- [x] input
- [x] label
- [x] checkbox
- [x] select
- [x] calendar
- [x] popover
- [x] badge (used in StoreCard)
- [x] textarea (alias: TextArea)

### Need to Install
```bash
# For About Page - Team Section
npx shadcn@latest add avatar

# For About Page - Team Department Filter (optional)
npx shadcn@latest add tabs

# For About Page - Mission/Vision + Store Cards
npx shadcn@latest add card

# For All Pages - Navigation
npx shadcn@latest add breadcrumb

# For All Pages - Visual Dividers
npx shadcn@latest add separator
```

### Third-Party Dependencies
```bash
# Google Maps Integration
npm install @react-google-maps/api

# Optional: Marker Clustering (if many stores)
npm install @googlemaps/markerclusterer
```

---

## Component Usage Summary

| shadcn Component | About Page | Contact Page | Store Page | Priority |
|------------------|------------|--------------|------------|----------|
| avatar | Team | - | - | Medium |
| badge | Store preview | - | Store features | High |
| breadcrumb | Hero | Hero | Hero | High |
| button | CTAs | Form, CTAs | Form, CTAs | High |
| calendar | - | - | Reservation | High |
| card | Mission, Team, Stores | Contact info | Store grid | High |
| checkbox | - | Form | Reservation | High |
| input | - | Form, Search | Search, Filter | High |
| label | - | Form | Form | High |
| popover | - | - | Calendar | High |
| select | - | Form | Filter, Sort | High |
| separator | Sections | Cards | Cards | Medium |
| tabs | Team filter | - | View toggle | Low |
| textarea | - | Form | - | High |

---

## Custom Components (No shadcn Equivalent)

### 1. Timeline Component
**Location:** `components/about/story-section/timeline.tsx`

**Implementation:**
```tsx
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border" />

      {items.map((item, index) => (
        <motion.div
          key={item.year}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative mb-8 md:mb-12"
        >
          {/* Year badge */}
          <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 -translate-y-1/2">
            <Badge className="bg-orange-500 text-white">
              {item.year}
            </Badge>
          </div>

          {/* Content card */}
          <div className="ml-12 md:ml-0 md:grid md:grid-cols-2 gap-8">
            <div className={index % 2 === 0 ? "md:col-start-2" : "md:col-start-1"}>
              <Card>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
```

### 2. Google Map Wrapper
**Location:** `components/shared/google-maps/map-wrapper.tsx`

**Implementation:**
```tsx
'use client'

import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api'
import { useState } from 'react'
import { StoreResponse } from '@/types'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface MapWrapperProps {
  stores: StoreResponse[]
  height?: string
  defaultCenter?: { lat: number; lng: number }
  defaultZoom?: number
}

export function MapWrapper({
  stores,
  height = '60vh',
  defaultCenter = { lat: 51.5074, lng: -0.1278 }, // London
  defaultZoom = 10
}: MapWrapperProps) {
  const [selected, setSelected] = useState<StoreResponse | null>(null)

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height }}
        center={defaultCenter}
        zoom={defaultZoom}
        options={{
          styles: [] // Add dark mode styles here
        }}
      >
        {stores.map((store) => (
          <Marker
            key={store._id}
            position={{ lat: store.lat, lng: store.long }}
            onClick={() => setSelected(store)}
            icon={{
              url: '/images/pizza-marker.svg',
              scaledSize: new google.maps.Size(40, 40)
            }}
          />
        ))}

        {selected && (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.long }}
            onCloseClick={() => setSelected(null)}
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="p-3">
                <CardTitle className="text-base">{selected.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0 space-y-2">
                <p className="text-xs text-muted-foreground">{selected.area}</p>
                <Button size="sm" className="w-full" asChild>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.long}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </a>
                </Button>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  )
}
```

### 3. Stats Counter
**Location:** `components/home/about-section/stats-counter.tsx` (REUSE)

No shadcn component - custom with Intersection Observer and animation.

---

## Implementation Priority

### Phase 1: Install Core Components
1. `npx shadcn@latest add card` - Most used component
2. `npx shadcn@latest add breadcrumb` - All pages
3. `npx shadcn@latest add avatar` - Team section
4. `npx shadcn@latest add separator` - Visual structure

### Phase 2: Install Optional Components
1. `npx shadcn@latest add tabs` - Team filtering (if needed)

### Phase 3: Third-Party Setup
1. Install Google Maps: `npm install @react-google-maps/api`
2. Set up environment variable: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
3. Create map wrapper component

---

## Best Practices

### 1. Component Composition
Always compose shadcn components rather than modifying the source:

```tsx
// Good - Composition
<Card className="hover:shadow-xl transition-shadow">
  <CardHeader>...</CardHeader>
</Card>

// Avoid - Direct modification
// Don't edit components/ui/card.tsx directly
```

### 2. Dark Mode Support
All shadcn components support dark mode automatically via Tailwind's `dark:` variant:

```tsx
<Card className="bg-white dark:bg-slate-800">
  <CardTitle className="text-slate-900 dark:text-white">
    Title
  </CardTitle>
</Card>
```

### 3. Accessibility
shadcn components have built-in accessibility, but ensure proper usage:

```tsx
// Proper ARIA labels
<Button aria-label="Reserve table at this store">
  Reserve
</Button>

// Proper heading hierarchy
<CardHeader>
  <CardTitle asChild>
    <h3>Store Name</h3>
  </CardTitle>
</CardHeader>
```

### 4. Type Safety
Use TypeScript interfaces for all component props:

```tsx
interface TeamMemberCardProps {
  member: {
    id: string
    name: string
    role: string
    photo: string
    bio: string
  }
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  // Component implementation
}
```

---

## Quick Reference Commands

```bash
# View all available components
npx shadcn@latest view @shadcn

# Search for components
npx shadcn@latest view @shadcn | grep "avatar"

# Add specific component
npx shadcn@latest add avatar

# Add multiple components at once
npx shadcn@latest add card breadcrumb separator avatar tabs
```

---

## Conclusion

This mapping provides a complete reference for implementing spec3 pages using shadcn/ui components. Key takeaways:

1. **Reuse Extensively**: Many home page components can be reused (ReservationForm, ContactForm, StoreCard)
2. **shadcn Core**: Card, Button, Badge, Input, Select are the workhorses
3. **Custom Where Needed**: Timeline, Google Maps, Stats Counter require custom implementation
4. **Accessibility First**: All shadcn components are accessible by default
5. **Type Safety**: Leverage TypeScript for all component interfaces

**Next Step:** Install missing components and begin implementation following the main requirements.md document.
