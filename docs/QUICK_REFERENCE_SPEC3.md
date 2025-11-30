# Quick Reference - Spec3 Design Tokens

> Fast lookup for design tokens and component classes

## Design Tokens

### Avatars
```css
--avatar-xs: 32px    /* Small inline */
--avatar-sm: 40px    /* Comments */
--avatar-md: 56px    /* Standard */
--avatar-lg: 80px    /* Team cards */
--avatar-xl: 120px   /* Headers */
```

### Social Icons
```css
--social-icon-sm: 16px
--social-icon-md: 20px
--social-icon-lg: 24px
```

### Timeline
```css
--timeline-line-width: 2px
--timeline-dot-size: 12px
--timeline-dot-ring: 4px
--timeline-spacing: 48px
```

### Map Markers
```css
/* Light */
--map-marker-primary: #F97316
--map-marker-hover: #EA580C
--map-marker-shadow: rgba(249, 115, 22, 0.3)

/* Dark */
--map-marker-primary: #FB923C
--map-marker-hover: #F97316
--map-marker-shadow: rgba(251, 146, 60, 0.4)
```

### Chips/Badges
```css
--chip-height: 32px
--chip-padding-x: 12px
--chip-gap: 8px
```

### Compact Hero
```css
--hero-compact-height: 240px      /* Mobile */
--hero-compact-height-md: 320px   /* Tablet */
--hero-compact-height-lg: 400px   /* Desktop */
```

### Hover Effects
```css
--card-hover-lift: -4px
--card-hover-scale: 1.02
```

## Component Classes

### Team Card
```html
<div class="team-card">
  <div class="team-avatar"></div>
  <div class="social-links">
    <a class="social-link"></a>
  </div>
</div>
```

### Timeline
```html
<div class="timeline-container">
  <div class="timeline-line"></div>
  <div class="timeline-item">
    <div class="timeline-dot"></div>
    <div class="timeline-year"></div>
    <div class="timeline-content"></div>
  </div>
</div>
```

### Map
```html
<div class="map-container">
  <div class="map-overlay">
    <button class="map-control-button"></button>
  </div>
</div>

<div class="map-info-window">
  <h3 class="map-info-title"></h3>
  <p class="map-info-address"></p>
  <button class="map-info-button"></button>
</div>
```

### Filter Chips
```html
<div class="filter-chips">
  <button class="filter-chip active">
    <span class="filter-chip-icon"></span>
    <span class="filter-chip-remove"></span>
  </button>
</div>
```

### Compact Hero
```html
<section class="hero-compact">
  <div class="hero-compact-content">
    <h1 class="hero-compact-title"></h1>
    <p class="hero-compact-subtitle"></p>
  </div>
</section>
```

### Section Variants
```html
<section class="section-full-width"></section>
<section class="section-gradient"></section>
<section class="section-alternating"></section>
```

## Utility Animations

```css
.animate-marker-pulse    /* Map marker pulse */
.animate-slide-up        /* Slide from bottom */
.animate-fade-in-scale   /* Fade + scale */
```

## Common Patterns

### Card with Hover Effect
```tsx
<div className="bg-card border border-border rounded-xl p-6
                hover:shadow-xl hover:border-primary
                hover:-translate-y-1 transition-all duration-200">
  {/* Content */}
</div>
```

### Social Link Button
```tsx
<a
  href="#"
  className="social-link"
  aria-label="Social platform"
>
  <Icon className="w-5 h-5" />
</a>
```

### Filter Chip Button
```tsx
<button
  className={`filter-chip ${isActive ? 'active' : ''}`}
  aria-pressed={isActive}
>
  <Icon className="filter-chip-icon" />
  <span>Label</span>
  {isActive && <X className="w-3 h-3" />}
</button>
```

### Map Control Button
```tsx
<button
  className="map-control-button"
  aria-label="Control action"
>
  <Icon className="w-5 h-5" />
</button>
```

## Color Usage

### Backgrounds
```tsx
bg-background           /* Main page bg */
bg-card                 /* Card bg */
bg-muted                /* Secondary bg */
bg-primary              /* Orange bg */
bg-secondary            /* Navy bg */
```

### Text
```tsx
text-foreground         /* Primary text */
text-muted-foreground   /* Secondary text */
text-primary            /* Orange text */
text-primary-foreground /* White on orange */
```

### Borders
```tsx
border-border           /* Default border */
border-primary          /* Orange border */
border-input            /* Input border */
```

## Spacing Scale

```tsx
gap-1    /* 4px */
gap-2    /* 8px */
gap-3    /* 12px */
gap-4    /* 16px */
gap-6    /* 24px */
gap-8    /* 32px */
gap-10   /* 40px */
gap-12   /* 48px */
gap-16   /* 64px */
```

## Border Radius

```tsx
rounded-sm    /* 4px */
rounded-md    /* 8px */
rounded-lg    /* 12px */
rounded-xl    /* 16px */
rounded-2xl   /* 24px */
rounded-full  /* 9999px */
```

## Shadows

```tsx
shadow-xs
shadow-sm
shadow-md
shadow-lg
shadow-xl
```

## Typography

```tsx
text-h1       /* 48px bold */
text-h2       /* 36px bold */
text-h3       /* 30px semibold */
text-h4       /* 24px semibold */
text-h5       /* 20px semibold */
text-h6       /* 18px semibold */

text-body-lg  /* 18px normal */
text-body     /* 16px normal */
text-body-sm  /* 14px normal */
text-caption  /* 12px normal */
text-label    /* 14px medium */
text-overline /* 12px semibold uppercase */
```

## Responsive Breakpoints

```tsx
sm:   /* 640px */
md:   /* 768px */
lg:   /* 1024px */
xl:   /* 1280px */
2xl:  /* 1536px */
```

## Dark Mode Classes

```tsx
dark:bg-slate-800
dark:text-gray-50
dark:border-slate-700
dark:hover:bg-orange-700
```

## Accessibility Classes

```tsx
focus-visible:outline-2
focus-visible:outline-primary
focus-visible:outline-offset-2

sr-only                    /* Screen reader only */
aria-label="Description"   /* Icon buttons */
aria-pressed={isActive}    /* Toggle buttons */
```

## Animation Durations

```css
--transition-fast: 150ms
--transition-base: 200ms
--transition-slow: 300ms
--transition-slower: 500ms
```

## Z-Index Scale

```css
--z-dropdown: 1000
--z-sticky: 1020
--z-fixed: 1030
--z-modal-backdrop: 1040
--z-modal: 1050
--z-popover: 1060
--z-tooltip: 1070
--z-toast: 1080
```
