# Pizza Space Design System - Spec3 Extensions

> Extended design system for About, Contact, and Store pages
> Maintains consistency with home page while introducing new component patterns

## Table of Contents

1. [Design Tokens](#design-tokens)
2. [Component Patterns](#component-patterns)
3. [Usage Examples](#usage-examples)
4. [Theme Consistency](#theme-consistency)
5. [Accessibility](#accessibility)

---

## Design Tokens

### Avatar Sizing System

Consistent avatar sizes across team cards and user profiles:

```css
--avatar-xs: 32px;   /* Small inline avatars */
--avatar-sm: 40px;   /* Comment/review avatars */
--avatar-md: 56px;   /* Standard profile avatars */
--avatar-lg: 80px;   /* Team member cards */
--avatar-xl: 120px;  /* Large profile headers */
```

**Usage:**
- Team cards: `--avatar-lg` (80px)
- Testimonials: `--avatar-md` (56px)
- Comments/Reviews: `--avatar-sm` (40px)

### Social Icon Sizing

```css
--social-icon-sm: 16px;  /* Inline icons */
--social-icon-md: 20px;  /* Standard social links */
--social-icon-lg: 24px;  /* Featured social buttons */
```

### Timeline Design Tokens

```css
--timeline-line-width: 2px;     /* Vertical line thickness */
--timeline-dot-size: 12px;      /* Milestone marker size */
--timeline-dot-ring: 4px;       /* Border width around dot */
--timeline-spacing: 48px;       /* Space between items */
```

### Map Styling Tokens

```css
/* Light Mode */
--map-marker-primary: #F97316;
--map-marker-hover: #EA580C;
--map-marker-shadow: rgba(249, 115, 22, 0.3);

/* Dark Mode */
--map-marker-primary: #FB923C;
--map-marker-hover: #F97316;
--map-marker-shadow: rgba(251, 146, 60, 0.4);
```

### Filter Chip/Badge Tokens

```css
--chip-height: 32px;
--chip-padding-x: 12px;
--chip-gap: 8px;
```

### Compact Hero Heights

Responsive hero section for Contact/About pages:

```css
--hero-compact-height: 240px;      /* Mobile */
--hero-compact-height-md: 320px;   /* Tablet */
--hero-compact-height-lg: 400px;   /* Desktop */
```

### Card Hover Effects

```css
--card-hover-lift: -4px;     /* Vertical translation on hover */
--card-hover-scale: 1.02;    /* Scale transform on hover */
```

---

## Component Patterns

### 1. Team Card Component

**Purpose:** Display team member information with avatar, role, and social links.

**CSS Classes:**
```html
<div class="team-card">
  <div class="team-avatar">
    <!-- Avatar image -->
  </div>
  <h3>Team Member Name</h3>
  <p>Role/Position</p>
  <div class="social-links">
    <a href="#" class="social-link">
      <!-- Social icon -->
    </a>
  </div>
</div>
```

**Features:**
- Hover lift animation (`-4px translateY`)
- Avatar scale on hover (1.05)
- Border color transition to orange
- Social link buttons with hover states

**React Component Example:**
```tsx
// components/about/team-card.tsx
import { CustomImage } from '@/components/ui/custom-image';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="team-card">
      <div className="team-avatar">
        <CustomImage
          src={member.avatar}
          alt={member.name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="text-xl font-bold text-foreground mt-4 mb-1">
        {member.name}
      </h3>

      <p className="text-sm font-medium text-primary mb-2">
        {member.role}
      </p>

      {member.bio && (
        <p className="text-sm text-muted-foreground mb-4">
          {member.bio}
        </p>
      )}

      <div className="social-links">
        {member.linkedin && (
          <a
            href={member.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        )}
        {member.twitter && (
          <a
            href={member.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label="Twitter Profile"
          >
            <Twitter className="w-5 h-5" />
          </a>
        )}
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="social-link"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        )}
      </div>
    </div>
  );
}
```

### 2. Timeline Component

**Purpose:** Display company history, milestones, or journey.

**CSS Classes:**
```html
<div class="timeline-container">
  <div class="timeline-line"></div>

  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-year">2024</div>
    <div class="timeline-content">
      <!-- Content -->
    </div>
  </div>
</div>
```

**Features:**
- Vertical orange gradient line
- Animated dots with pulse on hover
- Year badges with primary background
- Content cards with hover border transition

**React Component Example:**
```tsx
// components/about/timeline.tsx
'use client';

import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <div className="timeline-container">
      <div className="timeline-line" />

      {events.map((event, index) => (
        <motion.div
          key={event.year}
          className="timeline-item"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <div className="timeline-dot" />

          <div className="timeline-year">
            {event.year}
          </div>

          <div className="timeline-content">
            <div className="flex items-start gap-3">
              {event.icon && (
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {event.icon}
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

### 3. Map Components

**Purpose:** Display interactive Google Maps with custom styled markers.

#### Map Container
```html
<div class="map-container">
  <!-- Google Map here -->
  <div class="map-overlay">
    <button class="map-control-button">
      <!-- Icon -->
    </button>
  </div>
</div>
```

#### Map Info Window
```html
<div class="map-info-window">
  <h3 class="map-info-title">Store Name</h3>
  <p class="map-info-address">123 Main St, City</p>
  <button class="map-info-button">Get Directions</button>
</div>
```

**React Component Example:**
```tsx
// components/stores/store-map.tsx
'use client';

import { useState } from 'react';
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, Layers } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
}

interface StoreMapProps {
  stores: Store[];
  center?: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 51.5074,
  lng: -0.1278,
};

// Custom marker icon (orange themed)
const customMarkerIcon = {
  path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  fillColor: '#F97316',
  fillOpacity: 1,
  strokeColor: '#FFFFFF',
  strokeWeight: 2,
  scale: 2,
};

export function StoreMap({ stores, center = defaultCenter }: StoreMapProps) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) {
    return (
      <div className="map-container flex items-center justify-center bg-muted">
        <div className="text-center">
          <MapPin className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        mapTypeId={mapType}
        options={{
          disableDefaultUI: true,
          zoomControl: false,
          styles: [
            // Custom map styling for brand consistency
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        }}
      >
        {stores.map((store) => (
          <Marker
            key={store.id}
            position={{ lat: store.lat, lng: store.lng }}
            icon={customMarkerIcon}
            onClick={() => setSelectedStore(store)}
            animation={window.google?.maps?.Animation?.DROP}
          />
        ))}

        {selectedStore && (
          <InfoWindow
            position={{ lat: selectedStore.lat, lng: selectedStore.lng }}
            onCloseClick={() => setSelectedStore(null)}
          >
            <div className="map-info-window">
              <h3 className="map-info-title">{selectedStore.name}</h3>
              <p className="map-info-address">{selectedStore.address}</p>
              {selectedStore.phone && (
                <p className="text-sm text-muted-foreground mb-3">
                  {selectedStore.phone}
                </p>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedStore.lat},${selectedStore.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="map-info-button"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Map Controls */}
      <div className="map-overlay flex flex-col gap-2">
        <button
          onClick={() => setMapType(mapType === 'roadmap' ? 'satellite' : 'roadmap')}
          className="map-control-button"
          aria-label="Toggle map type"
        >
          <Layers className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### 4. Filter Chips Component

**Purpose:** Category/location filters for stores page.

**CSS Classes:**
```html
<div class="filter-chips">
  <button class="filter-chip active">
    <span class="filter-chip-icon">
      <!-- Icon -->
    </span>
    <span>All Stores</span>
  </button>
  <button class="filter-chip">
    <span>London</span>
    <span class="filter-chip-remove">×</span>
  </button>
</div>
```

**React Component Example:**
```tsx
// components/stores/store-filters.tsx
'use client';

import { useState } from 'react';
import { X, MapPin, Store } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface StoreFiltersProps {
  options: FilterOption[];
  onFilterChange?: (selected: string[]) => void;
}

export function StoreFilters({ options, onFilterChange }: StoreFiltersProps) {
  const [selected, setSelected] = useState<string[]>(['all']);

  const toggleFilter = (id: string) => {
    let newSelected: string[];

    if (id === 'all') {
      newSelected = ['all'];
    } else {
      newSelected = selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected.filter((s) => s !== 'all'), id];

      if (newSelected.length === 0) {
        newSelected = ['all'];
      }
    }

    setSelected(newSelected);
    onFilterChange?.(newSelected);
  };

  return (
    <div className="filter-chips">
      {options.map((option) => {
        const isActive = selected.includes(option.id);

        return (
          <button
            key={option.id}
            onClick={() => toggleFilter(option.id)}
            className={`filter-chip ${isActive ? 'active' : ''}`}
            aria-pressed={isActive}
          >
            {option.icon && (
              <span className="filter-chip-icon">{option.icon}</span>
            )}
            <span>{option.label}</span>
            {isActive && option.id !== 'all' && (
              <span className="filter-chip-remove">
                <X className="w-3 h-3" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
```

### 5. Compact Hero Component

**Purpose:** Smaller hero section for Contact/Store pages.

**CSS Classes:**
```html
<section class="hero-compact">
  <div class="hero-compact-content">
    <h1 class="hero-compact-title">Page Title</h1>
    <p class="hero-compact-subtitle">Description text</p>
  </div>
</section>
```

**React Component Example:**
```tsx
// components/shared/compact-hero.tsx
'use client';

import { motion } from 'framer-motion';

interface CompactHeroProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function CompactHero({ title, subtitle, breadcrumbs }: CompactHeroProps) {
  return (
    <section className="hero-compact">
      <div className="hero-compact-content">
        {breadcrumbs && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center justify-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && <span className="text-white/50">/</span>}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <motion.h1
          className="hero-compact-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="hero-compact-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
```

---

## Usage Examples

### About Page Structure

```tsx
// app/about/page.tsx
import { CompactHero } from '@/components/shared/compact-hero';
import { Timeline } from '@/components/about/timeline';
import { TeamCard } from '@/components/about/team-card';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'John Doe',
      role: 'Head Chef',
      avatar: '/team/john.jpg',
      bio: 'Award-winning chef with 15 years of experience',
      linkedin: 'https://linkedin.com/in/johndoe',
      email: 'john@pizzaspace.com',
    },
    // ... more team members
  ];

  const milestones = [
    {
      year: '2024',
      title: 'Expansion to 50 Locations',
      description: 'Reached a major milestone with our 50th store opening',
      icon: <Store className="w-5 h-5 text-primary" />,
    },
    // ... more milestones
  ];

  return (
    <>
      <CompactHero
        title="About Pizza Space"
        subtitle="Crafting authentic pizzas since 2010"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About' },
        ]}
      />

      {/* Mission & Vision Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Content */}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Journey
          </h2>
          <Timeline events={milestones} />
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} member={member} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

### Contact Page Structure

```tsx
// app/contact/page.tsx
import { CompactHero } from '@/components/shared/compact-hero';
import { ContactForm } from '@/components/home/contact-section/contact-form';
import { ContactInfo } from '@/components/home/contact-section/contact-info';

export default function ContactPage() {
  return (
    <>
      <CompactHero
        title="Get in Touch"
        subtitle="We'd love to hear from you"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Contact' },
        ]}
      />

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <ContactInfo />
            </div>
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

### Stores Page Structure

```tsx
// app/stores/page.tsx
import { CompactHero } from '@/components/shared/compact-hero';
import { StoreMap } from '@/components/stores/store-map';
import { StoreFilters } from '@/components/stores/store-filters';
import { StoreCard } from '@/components/home/stores-section/store-card';

export default function StoresPage() {
  const stores = [
    // ... store data
  ];

  const filterOptions = [
    { id: 'all', label: 'All Stores', icon: <Store className="w-4 h-4" /> },
    { id: 'london', label: 'London', icon: <MapPin className="w-4 h-4" /> },
    { id: 'manchester', label: 'Manchester', icon: <MapPin className="w-4 h-4" /> },
    // ... more filters
  ];

  return (
    <>
      <CompactHero
        title="Our Locations"
        subtitle="Find a Pizza Space near you"
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Stores' },
        ]}
      />

      {/* Filters */}
      <section className="py-8 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <StoreFilters options={filterOptions} />
        </div>
      </section>

      {/* Map Section - Full Width */}
      <section className="section-full-width py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <StoreMap stores={stores} />
        </div>
      </section>

      {/* Store Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
```

---

## Theme Consistency

### Light Mode
All components follow the existing light theme:
- Backgrounds: White (`#FFFFFF`) and light gray (`#F9FAFB`)
- Text: Dark gray (`#111827`) for primary, medium gray for secondary
- Borders: Light gray (`#E5E7EB`)
- Primary actions: Orange (`#F97316`)
- Hover states: Darker orange (`#EA580C`)

### Dark Mode
All components automatically adapt to dark mode:
- Backgrounds: Navy (`#0e182b`) and dark blue (`#1a2744`)
- Text: Off-white (`#F9FAFB`) for primary, gray for secondary
- Borders: Medium gray (`#374151`)
- Primary actions: Lighter orange (`#FB923C`)
- Hover states: Standard orange (`#F97316`)

### CSS Variable Usage

Always use CSS variables for theme consistency:

```tsx
// Good - Uses theme variables
<div style={{ background: 'var(--color-background-card)' }}>

// Bad - Hardcoded colors
<div style={{ background: '#FFFFFF' }}>
```

---

## Accessibility

### Focus Management

All interactive components include visible focus states:

```css
.team-card:focus-visible,
.filter-chip:focus-visible,
.map-control-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### ARIA Labels

Use proper ARIA attributes for all interactive elements:

```tsx
<button
  className="social-link"
  aria-label="LinkedIn Profile"
>
  <Linkedin className="w-5 h-5" />
</button>
```

### Keyboard Navigation

- All filter chips support keyboard selection
- Map controls accessible via keyboard
- Timeline items navigable with tab
- Social links include skip navigation support

### High Contrast Mode

Components adapt to high contrast preferences:

```css
@media (prefers-contrast: high) {
  .timeline-line {
    width: 3px;
  }
  .filter-chip.active {
    border-width: 2px;
  }
}
```

### Screen Reader Support

- Semantic HTML structure (`<nav>`, `<section>`, `<article>`)
- Proper heading hierarchy (h1 → h6)
- Alt text for all images
- ARIA labels for icon-only buttons
- Live regions for dynamic content updates

---

## Animation Performance

All animations use GPU-accelerated properties:

```css
/* Good - GPU accelerated */
transform: translateY(-4px);
opacity: 0.9;

/* Avoid - CPU intensive */
margin-top: -4px;
filter: brightness(0.9);
```

### Reduced Motion Support

Respects user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  .team-card {
    transition: none;
  }
  .animate-slide-up {
    animation: none;
  }
}
```

---

## Summary

This extended design system provides:

1. **Consistency**: All new components match home page aesthetics
2. **Scalability**: Reusable tokens and patterns
3. **Accessibility**: WCAG 2.1 AA compliant
4. **Theme Support**: Full light/dark mode compatibility
5. **Performance**: Optimized animations and rendering

All components are production-ready and follow Pizza Space brand guidelines.
