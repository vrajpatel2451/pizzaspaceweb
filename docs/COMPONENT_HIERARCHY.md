# Component Hierarchy - Spec3 Pages

## Page Structure Overview

```
Pizza Space Application
│
├── Home Page (Existing)
│   ├── HeroSection
│   ├── AboutSection
│   ├── MenuSection
│   ├── StoresSection (with StoreCard)
│   ├── TestimonialsSection
│   └── ContactSection (with ContactForm, ContactInfo)
│
├── About Page (New)
│   ├── CompactHero
│   ├── MissionVision Section
│   ├── Timeline Section
│   │   └── Timeline Component
│   ├── Team Section
│   │   └── TeamCard × N
│   └── Testimonials Section (reused)
│
├── Contact Page (New)
│   ├── CompactHero
│   ├── ContactInfo (reused)
│   ├── ContactForm (reused)
│   └── Optional Map Section
│
└── Stores Page (New)
    ├── CompactHero
    ├── StoreFilters
    ├── StoreMap Section
    │   └── StoreMap Component
    └── Stores Grid
        └── StoreCard × N (reused)
```

## Component Dependency Tree

```
Spec3 Components
│
├── Shared Components
│   ├── CompactHero
│   │   ├── Framer Motion
│   │   ├── Breadcrumbs
│   │   └── CSS: .hero-compact
│   │
│   └── (Reused from Home)
│       ├── Button
│       ├── Input
│       ├── Badge
│       └── CustomImage
│
├── About Page Components
│   ├── TeamCard
│   │   ├── CustomImage (avatar)
│   │   ├── SocialLinks
│   │   │   └── Lucide Icons (Linkedin, Twitter, Mail)
│   │   └── CSS: .team-card, .team-avatar, .social-link
│   │
│   └── Timeline
│       ├── Framer Motion (animations)
│       ├── TimelineItem × N
│       │   ├── TimelineDot
│       │   ├── TimelineYear
│       │   └── TimelineContent
│       └── CSS: .timeline-container, .timeline-line, .timeline-item
│
├── Contact Page Components
│   └── (All reused from Home)
│       ├── ContactForm
│       ├── ContactInfo
│       └── CompactHero (shared)
│
└── Stores Page Components
    ├── StoreFilters
    │   ├── FilterChip × N
    │   │   ├── Icon (optional)
    │   │   └── Remove Button
    │   └── CSS: .filter-chips, .filter-chip
    │
    ├── StoreMap
    │   ├── Google Maps React
    │   ├── Marker × N (custom styled)
    │   ├── InfoWindow
    │   │   ├── StoreInfo
    │   │   └── DirectionsButton
    │   ├── MapControls
    │   │   └── MapControlButton
    │   └── CSS: .map-container, .map-info-window
    │
    └── StoreCard (reused from Home)
```

## CSS Class Hierarchy

```
Spec3 CSS Classes
│
├── Layout Classes
│   ├── .hero-compact
│   │   ├── .hero-compact-content
│   │   ├── .hero-compact-title
│   │   └── .hero-compact-subtitle
│   │
│   ├── .section-full-width
│   ├── .section-gradient
│   └── .section-alternating
│
├── Team Components
│   ├── .team-card
│   │   └── .team-avatar
│   └── .social-links
│       └── .social-link
│
├── Timeline Components
│   ├── .timeline-container
│   │   └── .timeline-line
│   └── .timeline-item
│       ├── .timeline-dot
│       ├── .timeline-year
│       └── .timeline-content
│
├── Map Components
│   ├── .map-container
│   │   └── .map-overlay
│   │       └── .map-control-button
│   └── .map-info-window
│       ├── .map-info-title
│       ├── .map-info-address
│       └── .map-info-button
│
└── Filter Components
    └── .filter-chips
        └── .filter-chip
            ├── .filter-chip-icon
            └── .filter-chip-remove
```

## Design Token Hierarchy

```
CSS Custom Properties
│
├── Base Tokens (from existing system)
│   ├── Colors
│   │   ├── --color-primary (#F97316)
│   │   ├── --color-secondary (#0e182b)
│   │   ├── --color-background
│   │   ├── --color-foreground
│   │   └── ... (all existing colors)
│   │
│   ├── Typography
│   │   ├── --font-sans
│   │   ├── --text-* (sizes)
│   │   ├── --leading-* (line heights)
│   │   └── --font-* (weights)
│   │
│   ├── Spacing
│   │   ├── --spacing-1 (4px)
│   │   ├── --spacing-2 (8px)
│   │   └── ... (up to --spacing-16)
│   │
│   ├── Radius
│   │   ├── --radius-sm (4px)
│   │   ├── --radius-md (8px)
│   │   └── ... (up to --radius-full)
│   │
│   └── Shadows
│       ├── --shadow-xs
│       └── ... (up to --shadow-xl)
│
└── Spec3 Extended Tokens (new)
    ├── Avatar Sizing
    │   ├── --avatar-xs (32px)
    │   ├── --avatar-sm (40px)
    │   ├── --avatar-md (56px)
    │   ├── --avatar-lg (80px)
    │   └── --avatar-xl (120px)
    │
    ├── Icon Sizing
    │   ├── --social-icon-sm (16px)
    │   ├── --social-icon-md (20px)
    │   └── --social-icon-lg (24px)
    │
    ├── Timeline
    │   ├── --timeline-line-width (2px)
    │   ├── --timeline-dot-size (12px)
    │   ├── --timeline-dot-ring (4px)
    │   └── --timeline-spacing (48px)
    │
    ├── Map Markers
    │   ├── --map-marker-primary
    │   ├── --map-marker-hover
    │   └── --map-marker-shadow
    │
    ├── Chips/Badges
    │   ├── --chip-height (32px)
    │   ├── --chip-padding-x (12px)
    │   └── --chip-gap (8px)
    │
    ├── Compact Hero
    │   ├── --hero-compact-height (240px)
    │   ├── --hero-compact-height-md (320px)
    │   └── --hero-compact-height-lg (400px)
    │
    └── Hover Effects
        ├── --card-hover-lift (-4px)
        └── --card-hover-scale (1.02)
```

## Animation Hierarchy

```
Animations
│
├── Existing Animations
│   ├── @keyframes shimmer
│   └── .animate-shimmer
│
└── Spec3 Animations (new)
    ├── @keyframes marker-pulse
    │   └── .animate-marker-pulse
    │
    ├── @keyframes slide-up
    │   └── .animate-slide-up
    │
    └── @keyframes fade-in-scale
        └── .animate-fade-in-scale
```

## State Management

```
Component State Patterns
│
├── TeamCard
│   └── No internal state (presentational)
│
├── Timeline
│   └── Hover state (CSS only)
│
├── StoreFilters
│   ├── Selected filters (useState)
│   └── Filter change callback (props)
│
├── StoreMap
│   ├── Selected store (useState)
│   ├── Map type (useState)
│   └── Google Maps state (library)
│
└── CompactHero
    └── No internal state (presentational)
```

## Responsive Breakpoint Strategy

```
Breakpoints
│
├── Mobile First (< 640px)
│   ├── Single column layouts
│   ├── Stacked sections
│   ├── Compact spacing
│   └── --hero-compact-height: 240px
│
├── Tablet (640px - 1023px)
│   ├── 2-column grids
│   ├── Increased spacing
│   └── --hero-compact-height-md: 320px
│
└── Desktop (1024px+)
    ├── 3-column grids
    ├── Maximum spacing
    └── --hero-compact-height-lg: 400px
```

## Theme Switching Flow

```
Theme System
│
├── Light Mode (default)
│   ├── :root { ... }
│   ├── Orange primary: #F97316
│   ├── White backgrounds
│   └── Dark text
│
├── Dark Mode (.dark)
│   ├── .dark { ... }
│   ├── Light orange primary: #FB923C
│   ├── Navy backgrounds
│   └── Light text
│
└── CSS Variable Cascade
    ├── Component reads var(--color-*)
    ├── Value switches based on .dark class
    └── All components auto-update
```

## Accessibility Tree

```
Accessibility Features
│
├── Semantic HTML
│   ├── <nav> for breadcrumbs
│   ├── <section> for page sections
│   ├── <article> for timeline items
│   └── <button> for interactive elements
│
├── ARIA Attributes
│   ├── aria-label (icon buttons)
│   ├── aria-pressed (filter chips)
│   ├── aria-current (breadcrumbs)
│   └── role="navigation"
│
├── Keyboard Navigation
│   ├── Tab order (logical)
│   ├── Focus visible states
│   ├── Enter/Space activation
│   └── Escape to close modals
│
└── Screen Reader Support
    ├── Alt text (images)
    ├── Live regions (updates)
    ├── Skip links (navigation)
    └── Descriptive labels
```

## File Organization

```
Project Structure
│
├── /app
│   ├── globals.css (547 new lines)
│   ├── about/page.tsx (new)
│   ├── contact/page.tsx (new)
│   └── stores/page.tsx (new)
│
├── /components
│   ├── /shared
│   │   └── compact-hero.tsx (new)
│   │
│   ├── /about
│   │   ├── team-card.tsx (new)
│   │   └── timeline.tsx (new)
│   │
│   ├── /stores
│   │   ├── store-map.tsx (new)
│   │   └── store-filters.tsx (new)
│   │
│   └── /home (existing - reused)
│       ├── contact-section/
│       └── stores-section/
│
└── /docs
    ├── DESIGN_SYSTEM_SPEC3.md (new)
    ├── QUICK_REFERENCE_SPEC3.md (new)
    ├── DESIGN_SYSTEM_SUMMARY.md (new)
    └── COMPONENT_HIERARCHY.md (this file)
```

## Import Patterns

### Example: About Page Imports

```tsx
// Shared components
import { CompactHero } from '@/components/shared/compact-hero';

// About-specific components
import { TeamCard } from '@/components/about/team-card';
import { Timeline } from '@/components/about/timeline';

// Reused home components
import { TestimonialCard } from '@/components/home/testimonials-section/testimonial-card';

// UI primitives
import { Button } from '@/components/ui/button';
import { CustomImage } from '@/components/ui/custom-image';

// Icons
import { Linkedin, Twitter, Mail } from 'lucide-react';

// Animation
import { motion } from 'framer-motion';
```

## Component Composition Examples

### Team Section Composition

```
Team Section
├── Container (max-w-7xl)
│   ├── Heading
│   │   ├── Overline ("Our Team")
│   │   └── Title ("Meet the People Behind Pizza Space")
│   │
│   └── Grid (3 columns)
│       ├── TeamCard (member 1)
│       │   ├── Avatar
│       │   ├── Name
│       │   ├── Role
│       │   └── Social Links
│       │
│       ├── TeamCard (member 2)
│       └── TeamCard (member 3)
```

### Store Locator Composition

```
Store Locator Page
├── CompactHero
│   ├── Breadcrumbs
│   ├── Title
│   └── Subtitle
│
├── Filters Section
│   └── StoreFilters
│       ├── FilterChip ("All")
│       ├── FilterChip ("London")
│       └── FilterChip ("Manchester")
│
├── Map Section (full-width)
│   └── StoreMap
│       ├── Google Map
│       ├── Markers × N
│       └── Controls
│
└── Store Grid
    ├── StoreCard × N
    │   ├── Icon
    │   ├── Name
    │   ├── Address
    │   ├── Phone
    │   └── Buttons
    └── ...
```

## Summary

This hierarchy document provides:

1. **Visual structure** of all Spec3 pages
2. **Component relationships** and dependencies
3. **CSS class organization**
4. **Design token inheritance**
5. **Animation structure**
6. **State management patterns**
7. **Responsive strategy**
8. **Theme switching flow**
9. **Accessibility tree**
10. **File organization**

Use this as a reference when building or maintaining Spec3 pages to ensure consistency and proper component composition.
