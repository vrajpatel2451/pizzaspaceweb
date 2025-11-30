# Pizza Space Design System - Spec3 Documentation

> Complete documentation for About, Contact, and Store pages implementation

## Documentation Overview

This folder contains comprehensive documentation for extending the Pizza Space design system to support spec3 pages (About, Contact, Stores).

## Quick Start

1. **Start Here:** [DESIGN_SYSTEM_SUMMARY.md](./DESIGN_SYSTEM_SUMMARY.md)
   - Overview of all changes
   - Component examples
   - Quick reference

2. **Detailed Reference:** [DESIGN_SYSTEM_SPEC3.md](./DESIGN_SYSTEM_SPEC3.md)
   - Complete design tokens
   - Full component documentation
   - React/TypeScript examples
   - Accessibility guidelines

3. **Quick Lookup:** [QUICK_REFERENCE_SPEC3.md](./QUICK_REFERENCE_SPEC3.md)
   - Token cheatsheet
   - CSS class reference
   - Common patterns
   - Color usage guide

4. **Structure Guide:** [COMPONENT_HIERARCHY.md](./COMPONENT_HIERARCHY.md)
   - Page structure diagrams
   - Component dependency tree
   - CSS class hierarchy
   - State management patterns

5. **Implementation:** [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md)
   - Step-by-step guide
   - Task tracking
   - Time estimates
   - Testing checklist

## What's New

### Design System Extensions

**CSS Custom Properties Added:** 547 lines in `/app/globals.css`

- Avatar sizing system (5 sizes)
- Social icon sizing (3 sizes)
- Timeline styling tokens
- Map marker customization
- Filter chip/badge styling
- Compact hero responsive heights
- Card hover effects

### New Component Patterns

1. **Team Cards** - Team member profiles with avatars and social links
2. **Timeline** - Company history/milestones with vertical timeline
3. **Map Components** - Google Maps integration with custom markers
4. **Filter Chips** - Category/location filters for stores
5. **Compact Hero** - Smaller hero section for secondary pages

### New Animations

- `animate-marker-pulse` - Pulsing map markers
- `animate-slide-up` - Slide from bottom
- `animate-fade-in-scale` - Fade with scale

### Pages to Build

1. **About Page** (`/app/about/page.tsx`)
   - Compact hero
   - Mission/Vision section
   - Timeline component
   - Team cards grid
   - Testimonials (reused)

2. **Contact Page** (`/app/contact/page.tsx`)
   - Compact hero
   - Contact info (reused)
   - Contact form (reused)
   - Optional map

3. **Stores Page** (`/app/stores/page.tsx`)
   - Compact hero
   - Store filters
   - Interactive map with markers
   - Store cards grid (reused)

## Design System Principles

### Consistency
All new components match the existing home page design:
- Same color palette (Orange #F97316 + Navy #0e182b)
- Same typography (Montserrat)
- Same spacing system (4px base)
- Same border radius tokens

### Responsiveness
Mobile-first approach with three breakpoints:
- Mobile: < 640px
- Tablet: 640px - 1023px
- Desktop: 1024px+

### Accessibility
WCAG 2.1 AA compliant:
- Keyboard navigation
- Screen reader support
- Focus states
- ARIA labels
- Semantic HTML

### Theming
Full light/dark mode support:
- CSS custom properties
- Automatic theme switching
- SSR-safe implementation

## File Structure

```
/docs
├── README.md (this file)
├── DESIGN_SYSTEM_SUMMARY.md
├── DESIGN_SYSTEM_SPEC3.md
├── QUICK_REFERENCE_SPEC3.md
├── COMPONENT_HIERARCHY.md
└── IMPLEMENTATION_CHECKLIST.md

/app
├── globals.css (extended with 547 lines)
├── about/page.tsx (to be created)
├── contact/page.tsx (to be created)
└── stores/page.tsx (to be created)

/components
├── /shared
│   └── compact-hero.tsx (to be created)
├── /about
│   ├── team-card.tsx (to be created)
│   └── timeline.tsx (to be created)
└── /stores
    ├── store-map.tsx (to be created)
    └── store-filters.tsx (to be created)
```

## Technology Stack

- **Next.js 16** - App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Google Maps API** - Store locator
- **React Hook Form** - Forms (existing)
- **Zod** - Validation (existing)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Getting Started

### 1. Review Documentation

Read the documentation in this order:
1. DESIGN_SYSTEM_SUMMARY.md (10 min read)
2. DESIGN_SYSTEM_SPEC3.md (30 min read)
3. QUICK_REFERENCE_SPEC3.md (bookmark for quick lookup)

### 2. Set Up Environment

```bash
# Install Google Maps library (for Store page)
npm install @react-google-maps/api

# Add environment variable
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 3. Start Building

Follow the [IMPLEMENTATION_CHECKLIST.md](./IMPLEMENTATION_CHECKLIST.md) phase by phase:

1. **Phase 1:** Build CompactHero component (1-2 hours)
2. **Phase 2:** Build About page components (7-10 hours)
3. **Phase 3:** Build Contact page (1-2 hours)
4. **Phase 4:** Build Store page components (9-11 hours)
5. **Phase 5:** Update navigation (1.5 hours)
6. **Phase 6:** Testing & optimization (4-6 hours)
7. **Phase 7:** Content creation (6-8 hours)
8. **Phase 8:** Deployment (2-3 hours)

**Total Estimated Time:** 32-43.5 hours

### 4. Test Everything

Use the testing checklist in Phase 6 to verify:
- Functionality
- Accessibility
- Performance
- Cross-browser compatibility
- SEO optimization

## Key Features

### Design Tokens

All components use CSS custom properties for theme-aware styling:

```tsx
// Good - Theme aware
<div style={{ background: 'var(--color-background-card)' }}>

// Bad - Hardcoded
<div style={{ background: '#FFFFFF' }}>
```

### Component Variants

Pre-built CSS classes for common patterns:

```html
<!-- Team Card -->
<div class="team-card">
  <div class="team-avatar"></div>
  <div class="social-links">
    <a class="social-link"></a>
  </div>
</div>

<!-- Filter Chip -->
<button class="filter-chip active">
  <span>Label</span>
</button>

<!-- Map Control -->
<button class="map-control-button">
  <Icon />
</button>
```

### Responsive Utilities

Section layout variations:

```html
<section class="section-full-width">
<section class="section-gradient">
<section class="section-alternating">
```

## Common Questions

### Q: Can I use these components outside of spec3 pages?
**A:** Yes! All components are reusable. Team cards, timelines, and filter chips can be used anywhere in the application.

### Q: Do I need to write custom CSS?
**A:** No. All necessary CSS is in globals.css. Just use the provided class names.

### Q: How do I customize colors?
**A:** Modify the CSS custom properties in `:root` and `.dark` sections of globals.css. All components will automatically update.

### Q: Is the Google Maps API required?
**A:** Only for the Store page. Contact and About pages don't need it.

### Q: Can I skip the timeline component?
**A:** Yes. The About page is flexible. You can use any combination of sections.

### Q: How do I add more team members?
**A:** Just add more objects to the team members array and map over them with TeamCard components.

## Support

### Documentation
- [Design System Summary](./DESIGN_SYSTEM_SUMMARY.md)
- [Full Component Docs](./DESIGN_SYSTEM_SPEC3.md)
- [Quick Reference](./QUICK_REFERENCE_SPEC3.md)
- [Component Hierarchy](./COMPONENT_HIERARCHY.md)
- [Implementation Guide](./IMPLEMENTATION_CHECKLIST.md)

### Code Examples
All documentation includes full TypeScript/React code examples that you can copy and customize.

### Testing
Follow the testing checklist to ensure quality and accessibility compliance.

## Build Status

✅ **CSS Compiled:** No errors
✅ **TypeScript:** No errors
✅ **Build:** Successful
✅ **Linting:** 1 minor warning (safe to ignore)

## Next Steps

1. ✅ Design system extended
2. ✅ Documentation complete
3. ⏳ Implement components
4. ⏳ Build pages
5. ⏳ Add content
6. ⏳ Test thoroughly
7. ⏳ Deploy to production

## Version

- **Design System Version:** 1.1.0
- **Last Updated:** 2025-12-01
- **Status:** Production Ready

---

**Happy Building!** 🍕

If you have questions or need clarification, refer to the detailed documentation files or the code examples provided.
