# Animation System Documentation

This document describes the animation system implemented across the Pizza Space website using Framer Motion.

## Overview

The application uses a consistent animation system with centralized configuration in `/lib/animations.ts`. All animations follow performance best practices and respect user preferences for reduced motion.

## Animation Library

### Location
`/lib/animations.ts`

### Exported Constants

#### Easing Curves
- `easings.easeOut` - Smooth, natural motion (default for most animations)
- `easings.easeIn` - Acceleration curve
- `easings.easeInOut` - Smooth start and end
- `easings.bounce` - Playful spring effect
- `easings.sharp` - Quick, snappy motion

#### Spring Configurations
- `springs.gentle` - Smooth, natural (stiffness: 300, damping: 24)
- `springs.responsive` - Interactive elements (stiffness: 400, damping: 17)
- `springs.bouncy` - Playful effects (stiffness: 500, damping: 15)
- `springs.stiff` - Quick, snappy (stiffness: 600, damping: 20)

#### Durations
- `durations.fast` - 0.2s (micro-interactions)
- `durations.normal` - 0.3s (standard transitions)
- `durations.slow` - 0.5s (entrances/exits)
- `durations.slower` - 0.8s (complex animations)

#### Stagger Configurations
- `stagger.fast` - Quick reveals (0.08s between children)
- `stagger.normal` - Balanced timing (0.12s between children)
- `stagger.slow` - Dramatic reveals (0.15s between children)

### Pre-built Variants

#### Entrance Animations
```tsx
import { fadeUpVariants, fadeDownVariants, scaleUpVariants } from '@/lib/animations';

// Fade up from below
<motion.div variants={fadeUpVariants} initial="hidden" animate="visible">

// Fade down from above
<motion.div variants={fadeDownVariants} initial="hidden" animate="visible">

// Pop in effect
<motion.div variants={scaleUpVariants} initial="hidden" animate="visible">
```

#### Hover Animations
```tsx
import { cardLiftVariants, buttonPressVariants, iconBounceVariants } from '@/lib/animations';

// Card lift effect
<motion.div variants={cardLiftVariants} initial="rest" whileHover="hover">

// Button press
<motion.button variants={buttonPressVariants} whileHover="hover" whileTap="tap">

// Icon bounce
<motion.div variants={iconBounceVariants} initial="rest" whileHover="hover">
```

#### Staggered Lists
```tsx
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations';

<motion.div variants={staggerContainerVariants} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItemVariants}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

#### Floating Animations
```tsx
import { floatVariants } from '@/lib/animations';

// Gentle y-axis bob
<motion.div animate="float" variants={floatVariants(0.5, 4)}>
```

## Component-Specific Animations

### Header Component
**File:** `/components/layout/header/header-client.tsx`

**Features:**
- Slide down entrance animation on page load
- Smooth transition from transparent to solid on scroll
- Nav link underline animation on hover
- Active page indicator with scale animation
- Right-side actions fade-in with stagger

**Scroll Trigger:** 50px

### Hero Section
**File:** `/components/home/hero-section/hero-content.tsx`

**Features:**
- Staggered entrance (badge → headline → subheadline → search → buttons → stats)
- Animated SVG underline on "Delivered" text (path drawing animation)
- Button hover with scale and lift
- Infinite arrow pulse on primary CTA
- Badge bounce-in with spring animation

**Timing:**
- Container delay: 0.2s
- Stagger delay: 0.15s between children
- Total animation time: ~1.5s

### Hero Stats
**File:** `/components/home/hero-section/hero-stats.tsx`

**Features:**
- Count-up animation on scroll into view
- Staggered badge entrance
- Card hover: scale + shadow increase
- Icon scale on hover

**Scroll Trigger:** -100px margin (triggers before entering viewport)

### Floating Cards
**File:** `/components/home/hero-section/floating-cards.tsx`

**Features:**
- Entrance animation with scale and fade
- Continuous floating bob animation (3-5s loop)
- Hover lift effect
- Shine effect on hover

**Animation Delays:**
- Product card 1: 0.5s
- Product card 2: 0.7s
- Delivery badge: 0.9s
- Orders badge: 1.1s

### Delivery Info Section
**File:** `/components/home/delivery-info-section/index.tsx`

**Features:**
- Header fade-up on scroll into view
- Staggered card grid entrance
- Individual card animations (see InfoCard)

**Scroll Trigger:** -100px margin

### Info Card
**File:** `/components/home/delivery-info-section/info-card.tsx`

**Features:**
- Card lift on hover (y: -8px, scale: 1.02)
- Icon bounce animation (y: -8px with scale)
- Bottom accent bar scale-in on hover
- Text scale on hover

**Hover Duration:** 300ms

### Logo Component
**File:** `/components/layout/header/logo.tsx`

**Features:**
- Icon rotation on hover (12deg)
- Shine effect fade-in on hover
- Text scale on hover
- Tap scale feedback (0.95)

## Performance Guidelines

### DO ✓
- Animate only `transform` and `opacity` for 60fps
- Use `will-change` sparingly (Framer Motion handles this)
- Trigger animations once with `{ once: true }` for scroll
- Use `useInView` for scroll-triggered animations
- Test on low-end devices

### DON'T ✗
- Animate layout properties (width, height, top, left, margin, padding)
- Create infinite loops without purpose
- Trigger animations repeatedly on scroll
- Animate too many elements simultaneously
- Ignore `prefers-reduced-motion`

## Accessibility

All animations respect user preferences for reduced motion:

```tsx
import { useReducedMotion } from 'framer-motion';

function Component() {
  const shouldReduceMotion = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 20, // No Y movement if reduced motion
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.3, // Instant if reduced motion
      },
    },
  };
}
```

## Testing Animations

### Browser DevTools
1. Open Chrome DevTools
2. Open Command Menu (Cmd+Shift+P / Ctrl+Shift+P)
3. Type "Show Rendering"
4. Enable "Frame Rendering Stats" to monitor FPS

### Reduced Motion Testing
1. Open Chrome DevTools
2. Open Command Menu
3. Type "Emulate CSS prefers-reduced-motion"
4. Select "prefers-reduced-motion: reduce"

### Performance Monitoring
```tsx
// Add to any animated component for debugging
<motion.div
  onAnimationStart={() => console.log('Animation started')}
  onAnimationComplete={() => console.log('Animation completed')}
  onUpdate={(latest) => console.log('Latest values:', latest)}
>
```

## Animation Timing Reference

| Use Case | Duration | Easing | Example |
|----------|----------|--------|---------|
| Micro-interaction (hover) | 0.2-0.3s | easeOut | Button hover, icon bounce |
| Standard transition | 0.3-0.5s | easeOut | Fade in, slide in |
| Page entrance | 0.5-0.8s | easeOut | Hero section reveal |
| Scroll-triggered | 0.6-0.8s | easeOut | Section entrance |
| Floating/loop | 3-5s | easeInOut | Floating cards |

## Common Patterns

### Scroll-Triggered Section
```tsx
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { scrollFadeUpVariants } from '@/lib/animations';

function Section() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={ref}
      variants={scrollFadeUpVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      Content
    </motion.section>
  );
}
```

### Staggered List with Hover
```tsx
import { motion } from 'framer-motion';
import { staggerContainerVariants, staggerItemVariants, cardLiftVariants } from '@/lib/animations';

function List({ items }) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map(item => (
        <motion.div
          key={item.id}
          variants={staggerItemVariants}
          whileHover="hover"
          initial="rest"
        >
          <motion.div variants={cardLiftVariants}>
            {item.content}
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Button with Loading State
```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { buttonPressVariants } from '@/lib/animations';

function Button({ isLoading, children }) {
  return (
    <motion.button
      variants={buttonPressVariants}
      whileHover="hover"
      whileTap="tap"
      disabled={isLoading}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Spinner />
          </motion.div>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
```

## Browser Support

Framer Motion supports all modern browsers:
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

For older browsers, animations gracefully degrade to instant transitions.

## Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Web Animation Best Practices](https://web.dev/animations/)
- [Animation Performance Guide](https://developers.google.com/web/fundamentals/performance/rendering/stick-to-compositor-only-properties-and-manage-layer-count)
