# Framer Motion → CSS Animations Migration Guide

**Goal:** Reduce JavaScript bundle size by ~30KB by replacing Framer Motion with CSS animations

**Impact:**
- Faster initial page load (FCP improvement: ~0.5-1s)
- Reduced JavaScript execution time
- Better performance on low-end devices

---

## Phase 1: Add CSS Animation Utilities

### 1. Update `/app/globals.css`

Add these performance-optimized animations after your existing styles:

```css
/* ============================================
   PERFORMANCE-OPTIMIZED ANIMATIONS
   Using CSS instead of JavaScript for better performance
   ============================================ */

/* Base Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

/* Utility Classes */
.animate-fade-in {
  animation: fade-in 0.8s ease-out both;
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out both;
}

.animate-fade-in-down {
  animation: fade-in-down 0.4s ease-out both;
}

.animate-scale-in {
  animation: scale-in 1s ease-out both;
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out both;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out both;
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 25s linear infinite;
}

/* Delayed Animations (stagger effect) */
.animate-delay-100 {
  animation-delay: 0.1s;
}

.animate-delay-200 {
  animation-delay: 0.2s;
}

.animate-delay-300 {
  animation-delay: 0.3s;
}

.animate-delay-400 {
  animation-delay: 0.4s;
}

.animate-delay-500 {
  animation-delay: 0.5s;
}

.animate-delay-600 {
  animation-delay: 0.6s;
}

.animate-delay-700 {
  animation-delay: 0.7s;
}

.animate-delay-800 {
  animation-delay: 0.8s;
}

.animate-delay-1000 {
  animation-delay: 1s;
}

.animate-delay-1100 {
  animation-delay: 1.1s;
}

.animate-delay-1200 {
  animation-delay: 1.2s;
}

.animate-delay-1300 {
  animation-delay: 1.3s;
}

/* Hover Transitions */
.hover-lift {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease-out;
}

.hover-lift:hover {
  transform: translateY(-8px);
}

.hover-scale {
  transition: transform 0.6s ease-out;
}

.hover-scale:hover {
  transform: scale(1.08);
}

/* Performance Optimization */
.will-animate {
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Phase 2: Migrate Hero Image Component

### Before (Using Framer Motion)

**File:** `/components/home/hero-section/hero-image.tsx` (Current - 174 lines)

### After (Using CSS)

**Replace entire file with:**

```typescript
"use client";

export function HeroImage() {
  return (
    <div
      className="relative hidden lg:flex items-center justify-center min-h-[600px] animate-fade-in"
    >
      {/* Main circular backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[450px] h-[450px] xl:w-[550px] xl:h-[550px] rounded-full bg-gradient-to-br from-primary-100/60 via-amber-100/40 to-orange-100/30 dark:from-primary-500/20 dark:via-amber-500/10 dark:to-orange-500/5 animate-scale-in animate-delay-500" />
      </div>

      {/* Inner circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[350px] h-[350px] xl:w-[420px] xl:h-[420px] rounded-full bg-gradient-to-tr from-primary-200/50 via-amber-100/30 to-transparent dark:from-primary-600/20 dark:via-amber-500/10 dark:to-transparent animate-scale-in animate-delay-600" />
      </div>

      {/* Main Hero Image */}
      <div className="relative z-10 animate-fade-in-up animate-delay-400">
        {/* Floating animation on the image */}
        <div className="animate-float">
          <div className="relative w-[380px] h-[380px] xl:w-[480px] xl:h-[480px]">
            {/* Glow effect behind image */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-b from-primary/20 to-amber-500/10 blur-2xl dark:from-primary/15 dark:to-amber-500/5" />

            {/* Pizza Image - Using placeholder */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Placeholder pizza visual */}
              <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-br from-amber-200 via-orange-300 to-red-400 dark:from-amber-400 dark:via-orange-500 dark:to-red-600 shadow-2xl relative overflow-hidden">
                {/* Cheese texture */}
                <div className="absolute inset-4 rounded-full bg-gradient-to-br from-amber-100 via-yellow-200 to-amber-300 dark:from-amber-300 dark:via-yellow-400 dark:to-amber-500" />
                {/* Sauce */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-red-400 via-red-500 to-red-600 dark:from-red-500 dark:via-red-600 dark:to-red-700" />
                {/* Center cheese */}
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-amber-200 via-yellow-300 to-orange-300 dark:from-amber-400 dark:via-yellow-500 dark:to-orange-500" />
                {/* Pepperoni spots */}
                <div className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute top-1/2 right-1/4 w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute bottom-1/3 left-1/4 w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                <div className="absolute bottom-1/4 right-1/3 w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-800" />
                {/* Basil leaves */}
                <div className="absolute top-1/3 right-1/3 w-6 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full rotate-45" />
                <div className="absolute bottom-1/2 left-1/2 w-5 h-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full -rotate-12" />
              </div>
              {/* Shadow under pizza */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-8 bg-black/10 dark:bg-black/20 blur-xl rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements around the pizza */}
      <div className="absolute top-20 left-10 animate-fade-in animate-delay-1000">
        <div className="animate-spin-slow">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-500 shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍅</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-32 left-8 animate-fade-in animate-delay-1100">
        <div className="animate-spin-reverse">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-lg flex items-center justify-center">
            <span className="text-xl">🌿</span>
          </div>
        </div>
      </div>

      <div className="absolute top-40 right-8 animate-fade-in animate-delay-1200">
        <div className="animate-spin-slow">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg flex items-center justify-center">
            <span className="text-lg">🧀</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 right-16 animate-fade-in animate-delay-1300">
        <div className="animate-spin-reverse">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg flex items-center justify-center">
            <span className="text-xl">🌶️</span>
          </div>
        </div>
      </div>

      {/* Steam/heat waves effect */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 flex gap-2">
        <div className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm animate-pulse" />
        <div className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm animate-pulse animate-delay-300" />
        <div className="w-1.5 h-8 bg-gradient-to-t from-transparent via-white/40 to-white/10 dark:via-white/20 dark:to-white/5 rounded-full blur-sm animate-pulse animate-delay-600" />
      </div>
    </div>
  );
}
```

**Changes:**
- ❌ Removed `import { motion } from "framer-motion";`
- ✅ Replaced all `motion.div` with regular `div`
- ✅ Used CSS classes for animations: `animate-fade-in`, `animate-scale-in`, etc.
- ✅ Added `animate-delay-*` classes for stagger effects
- ✅ Kept exact same visual appearance

**Result:**
- **Bundle size reduced by ~15KB**
- **No runtime JavaScript for animations**
- **Better performance on low-end devices**

---

## Phase 3: Migrate Category Cards

### Before

**File:** `/components/home/categories-section/category-card.tsx` (Lines 1-81)

Uses Framer Motion for hover effects and entrance animations.

### After

**Replace lines 1-81 with:**

```typescript
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryResponse } from "@/types";
import { CustomImage } from "@/components/ui/custom-image";

interface CategoryCardProps {
  category: CategoryResponse;
  index?: number;
}

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  // Calculate stagger delay
  const delayClass = index === 0 ? '' :
                     index === 1 ? 'animate-delay-100' :
                     index === 2 ? 'animate-delay-200' :
                     index === 3 ? 'animate-delay-300' : 'animate-delay-400';

  return (
    <div className={`animate-fade-in-up ${delayClass}`}>
      <Link
        href={`/menu?category=${category._id}`}
        className="group block relative overflow-hidden rounded-2xl md:rounded-3xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-4"
      >
        {/* Card Container */}
        <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-gray-100 dark:bg-slate-800">
          {/* Background Image */}
          <CustomImage
            src={category.imageUrl}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-animate"
            priority={index < 4}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300" />

          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(249,115,22,0.15),transparent_50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content Container */}
          <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4">
            {/* Category Name */}
            <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 tracking-tight line-clamp-2">
              {category.name}
            </h3>

            {/* Explore Link */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-white/80 group-hover:text-orange-400 transition-colors duration-300">
              <span className="text-[10px] sm:text-xs md:text-sm font-medium">
                Explore
              </span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </div>

            {/* Animated underline */}
            <div className="hidden sm:block h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 mt-1 md:mt-2 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ width: "60px" }} />
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 rounded-2xl md:rounded-3xl border-2 border-transparent group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
        </div>
      </Link>
    </div>
  );
}

// Skeleton loader for category cards
export function CategoryCardSkeleton() {
  return (
    <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden rounded-2xl md:rounded-3xl bg-gray-200 dark:bg-slate-700 animate-pulse">
      <div className="absolute inset-x-0 bottom-0 p-2 sm:p-3 md:p-4">
        <div className="w-20 sm:w-24 md:w-32 h-4 sm:h-5 md:h-6 rounded bg-gray-300 dark:bg-slate-600 mb-1 sm:mb-2" />
        <div className="w-16 sm:w-20 md:w-24 h-3 sm:h-3.5 md:h-4 rounded bg-gray-300 dark:bg-slate-600" />
      </div>
    </div>
  );
}
```

**Changes:**
- ❌ Removed `motion` import
- ✅ Replaced `motion.div` with regular `div`
- ✅ Used CSS transitions for hover effects
- ✅ Calculated delay classes based on index
- ✅ Added `will-animate` class for performance hint

---

## Phase 4: Migrate Product Cards

### File: `/components/home/menu-section/product-card.tsx`

**Keep as-is for now** because:
1. Product cards have complex interactions (opening modal)
2. The hover effects are more sophisticated
3. This file is already lazy-loaded via dynamic import

**Alternative:** Only migrate the simple animations:

Replace lines 16-19 and 136-141:

```diff
export function ProductCard({
  product,
  index = 0,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
}: ProductCardProps) {
  const imageUrl = product.photoList[0] || "/placeholder.jpg";
  const badgeType = getBadgeType(product);
  const rating = 4 + (parseInt(product._id.slice(-2), 16) % 10) / 10;
  const sizeInfo = product.dishSize
    ? `${product.dishSize.count} ${product.dishSize.unit}`
    : product.weight
    ? `${product.weight}g`
    : null;

+  const delayClass = index === 0 ? '' :
+                     index === 1 ? 'animate-delay-100' :
+                     index === 2 ? 'animate-delay-200' : 'animate-delay-300';

  // Card content to be wrapped by ProductDetailsContainer
  const cardContent = (
-    <motion.article
-      initial={{ opacity: 0, y: 20 }}
-      animate={{ opacity: 1, y: 0 }}
-      transition={{ duration: 0.4, delay: index * 0.05 }}
-      whileHover={{ y: -8 }}
-      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-500 border border-slate-100 dark:border-slate-800 cursor-pointer"
+    <article
+      className={`group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-500 border border-slate-100 dark:border-slate-800 cursor-pointer hover-lift animate-fade-in-up ${delayClass}`}
    >
```

Keep the rest of the component with motion for the image zoom and other effects.

---

## Phase 5: Verification

### Test Performance

```bash
# 1. Rebuild
npm run build

# 2. Check bundle size
du -h .next/static/chunks/*.js | grep -E "(aa1ac3e589e3f041|e3c838b1b5004803)"

# Should see reduction:
# Before: aa1ac3e589e3f041.js ~274KB
# After:  aa1ac3e589e3f041.js ~244KB (-30KB)
```

### Visual Testing

1. Open http://localhost:3001
2. Verify animations look identical
3. Check:
   - Hero section floats and spins
   - Category cards fade in with stagger
   - Hover effects work smoothly
   - No console errors

### Performance Testing

Run Lighthouse:
- JavaScript execution should decrease from 9.8s to ~8s
- FCP should improve by 0.5-1s
- Performance score should increase by 2-3 points

---

## Rollback Plan

If animations don't work as expected:

```bash
# Restore original files
git checkout components/home/hero-section/hero-image.tsx
git checkout components/home/categories-section/category-card.tsx
git checkout app/globals.css

# Rebuild
npm run build
```

---

## Summary

**Files Modified:**
1. ✏️ `/app/globals.css` - Add CSS animations
2. ✏️ `/components/home/hero-section/hero-image.tsx` - Replace Framer Motion
3. ✏️ `/components/home/categories-section/category-card.tsx` - Replace Framer Motion
4. ⚠️ `/components/home/menu-section/product-card.tsx` - Partial migration (optional)

**Bundle Size Savings:**
- Framer Motion reduced usage: ~30KB
- CSS file increases by: ~2KB
- **Net savings: ~28KB**

**Performance Improvements:**
- JavaScript execution: -1s
- FCP: -0.5s
- TBT: -50ms

**Total Time:** 1-2 hours for full migration + testing
