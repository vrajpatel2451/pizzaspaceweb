# Pizza Space Performance Optimization Plan

**Current Status:** Performance Score 56/100 (Mobile, Slow 4G)

**Target:** Improve to 85+ Performance Score

## Executive Summary

Based on the Lighthouse audit, the main performance bottlenecks are:

1. **Massive unoptimized images** (3.8MB, 2.7MB images) - **CRITICAL**
2. **Slow server response** (TTFB: 2,323ms) - **HIGH PRIORITY**
3. **Heavy JavaScript execution** (9.8s) from Framer Motion usage
4. **Render-blocking CSS** (344KB main CSS file)
5. **Unused JavaScript** in bundles (92KB)

---

## Phase 1: Image Optimization (Est. 5-7s improvement in LCP)

### Problem
- Images served at full resolution (3648x3648) but displayed at 1134x756
- No modern formats (WebP/AVIF)
- All images use `unoptimized={true}` bypassing Next.js optimization
- Total image payload: ~10MB

### Solution

#### 1.1: Enable Next.js Image Optimization for External Domain

**File:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/next.config.ts`

```typescript
import type { NextConfig } from "next";

const imageDomain =
  process.env.NEXT_PUBLIC_IMAGE_HOST || "api.pizzaspace.co.uk";
const imageHostname = imageDomain.replace(/^https?:\/\//, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ['image/avif', 'image/webp'], // Enable modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller sizes
    minimumCacheTTL: 60, // Cache images for 60 seconds
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: imageHostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
```

**Impact:** Automatically converts images to WebP/AVIF, generates responsive sizes

---

#### 1.2: Remove `unoptimized` Flag from CustomImage

**File:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/custom-image.tsx`

**Current (Lines 156):**
```typescript
unoptimized={imageSrc.startsWith(IMAGE_DOMAIN)}
```

**Change to:**
```typescript
// Remove unoptimized entirely - let Next.js optimize all images
```

**Full updated return statement (lines 144-159):**
```typescript
return (
  <Image
    src={imageSrc}
    alt={alt}
    className={className}
    fill={fill}
    width={!fill ? width : undefined}
    height={!fill ? height : undefined}
    onError={(e) => {
      setHasError(true);
      onError?.(e);
    }}
    quality={85} // Add quality setting for better compression
    {...props}
  />
);
```

**Impact:**
- Reduces image sizes by 60-80%
- Serves WebP/AVIF to modern browsers
- Generates responsive srcset

**Estimated Savings:** 8-9MB reduced to 1-2MB = **7+ seconds faster LCP**

---

#### 1.3: Add Priority Loading to Hero Images

**Files to update:**

1. `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/categories-section/category-card.tsx` (Line 34)
   - Already has `priority={index < 4}` ✅ Good!

2. Check if hero section loads any real images (currently uses CSS gradients)

**Action:** Verify all above-the-fold images have `priority` prop

---

#### 1.4: Optimize Image Sizes Props

**File:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/categories-section/category-card.tsx` (Line 32)

**Current:**
```typescript
sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
```

✅ **Already optimized!** This tells Next.js to generate appropriate sizes.

**File:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/menu-section/product-card.tsx` (Line 156-158)

Already has good `sizes` prop ✅

---

## Phase 2: JavaScript Bundle Optimization (Est. 2-3s improvement)

### Problem
- 82 files use Framer Motion (heavy animation library ~50KB gzipped)
- Largest chunks: 274KB, 210KB, 125KB
- Unused JavaScript: 92KB
- Main thread execution: 9.8s

### Solution

#### 2.1: Reduce Framer Motion Usage

**Strategy:** Replace simple animations with CSS transitions/animations

**High Impact Files to Optimize:**

1. **`/components/home/hero-section/hero-image.tsx`** (174 lines, heavy animations)
   - Replace Framer Motion with CSS animations
   - Currently 82 usages across codebase

**Example Refactor - Hero Image Component:**

**Before (Lines 1-173):** Uses `motion.div` everywhere

**After:**
```typescript
"use client";

export function HeroImage() {
  return (
    <div className="relative hidden lg:flex items-center justify-center min-h-[600px] animate-fade-in">
      {/* Main circular backdrop */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[450px] h-[450px] xl:w-[550px] xl:h-[550px] rounded-full bg-gradient-to-br from-primary-100/60 via-amber-100/40 to-orange-100/30 dark:from-primary-500/20 dark:via-amber-500/10 dark:to-orange-500/5 animate-scale-in" />
      </div>

      {/* Inner circle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[350px] h-[350px] xl:w-[420px] xl:h-[420px] rounded-full bg-gradient-to-tr from-primary-200/50 via-amber-100/30 to-transparent dark:from-primary-600/20 dark:via-amber-500/10 dark:to-transparent animate-scale-in-delayed" />
      </div>

      {/* Main Hero Image */}
      <div className="relative z-10 animate-slide-up">
        {/* Floating animation on the image */}
        <div className="animate-float">
          <div className="relative w-[380px] h-[380px] xl:w-[480px] xl:h-[480px]">
            {/* ... rest of pizza visual ... */}
          </div>
        </div>
      </div>

      {/* Decorative elements - Use CSS animations */}
      <div className="absolute top-20 left-10 animate-fade-in-delayed">
        <div className="animate-spin-slow">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-400 to-red-500 shadow-lg flex items-center justify-center">
            <span className="text-2xl">🍅</span>
          </div>
        </div>
      </div>

      {/* ... other decorative elements with CSS animations ... */}
    </div>
  );
}
```

**Add to `/app/globals.css`:**
```css
/* Performance-optimized animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
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

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out;
}

.animate-fade-in-delayed {
  animation: fade-in 0.5s ease-out 1s both;
}

.animate-scale-in {
  animation: scale-in 1s ease-out 0.5s both;
}

.animate-scale-in-delayed {
  animation: scale-in 1s ease-out 0.6s both;
}

.animate-slide-up {
  animation: slide-up 0.8s ease-out 0.4s both;
}

.animate-spin-slow {
  animation: spin 20s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
```

**Impact:**
- Remove Framer Motion from hero section (~15KB savings)
- Faster initial render
- Same visual effect with better performance

---

#### 2.2: Make Framer Motion Optional (Dynamic Import)

For components that MUST use Framer Motion (complex interactions), lazy load it:

**File:** `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/home/categories-section/category-card.tsx`

**Before (Lines 1-4):**
```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
```

**After:**
```typescript
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Lazy load motion for non-critical animations
let motion: any = null;
const loadMotion = async () => {
  if (!motion) {
    const framerMotion = await import("framer-motion");
    motion = framerMotion.motion;
  }
  return motion;
};
```

**Alternative:** Use CSS for simple hover effects:

```typescript
// Replace motion.div with regular div + CSS classes
<div
  className="opacity-0 animate-fade-in-up transition-transform duration-300 hover:-translate-y-2"
  style={{ animationDelay: `${index * 0.1}s` }}
>
  {/* card content */}
</div>
```

---

#### 2.3: Reduce Radix UI Bundle Size

**Current:** 18 separate Radix UI packages

**Action:** Audit which components are actually used

**File to check:** Search for actual usage
```bash
# Run this to find unused Radix components
grep -r "@radix-ui" components --include="*.tsx" | cut -d: -f2 | sort -u
```

**Potential removals:**
- Keep only actively used components
- Consider replacing simple components with headless UI alternatives

---

#### 2.4: Bundle Analysis & Code Splitting

**Add bundle analyzer:**

```bash
npm install --save-dev @next/bundle-analyzer
```

**Update `/next.config.ts`:**
```typescript
import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';

const imageDomain =
  process.env.NEXT_PUBLIC_IMAGE_HOST || "api.pizzaspace.co.uk";
const imageHostname = imageDomain.replace(/^https?:\/\//, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: imageHostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/*'], // Tree-shake icon libraries
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default bundleAnalyzer(nextConfig);
```

**Run analysis:**
```bash
ANALYZE=true npm run build
```

---

## Phase 3: CSS Optimization (Est. 1s improvement)

### Problem
- Main CSS chunk: 344KB (render-blocking)
- Inline critical CSS not utilized

### Solution

#### 3.1: Split CSS by Route

**File:** `/app/globals.css`

Current size suggests Tailwind CSS is not being purged properly or includes unused utilities.

**Action:** Verify Tailwind purge is working

**Create `/tailwind.config.ts`:**
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      // Your existing theme extensions
    },
  },
  plugins: [],
};

export default config;
```

**Expected outcome:** CSS should be < 100KB after proper purging

---

#### 3.2: Extract Critical CSS

For above-the-fold content, inline critical CSS in `<head>`.

**File:** `/app/layout.tsx`

Add inline critical CSS for hero section:

```typescript
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS for above-the-fold content */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Hero section critical styles */
              .hero-section { padding-top: 6rem; min-height: 600px; }
              .animate-fade-in { animation: fade-in 0.8s ease-out; }
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `,
          }}
        />
        {/* JSON-LD Structured Data */}
        <RestaurantJsonLd />
        <LocalBusinessJsonLd />
        <WebsiteJsonLd />
        <OrganizationJsonLd />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {/* ... rest of body ... */}
      </body>
    </html>
  );
}
```

---

## Phase 4: Font Optimization (Est. 0.3s improvement)

### Current
```typescript
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"], // 6 weights = ~60KB
  display: "swap",
});
```

### Optimization

**File:** `/app/layout.tsx` (Lines 19-24)

**Reduce font weights:**
```typescript
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Reduce from 6 to 3 weights
  display: "swap",
  preload: true, // Explicitly preload
  fallback: ['system-ui', 'arial'], // Add fallback
});
```

**Impact:**
- Reduce font payload by 50% (~30KB savings)
- Faster FOIT/FOUT

---

## Phase 5: API & Data Fetching Optimization

### Problem
- TTFB: 2,323ms (server response time)
- Multiple parallel API calls on homepage

### Solution

#### 5.1: Add Revalidation & Caching

**File:** `/app/page.tsx` (Lines 5-6)

**Current:**
```typescript
export const dynamicParams = true;
export const revalidate = 0; // No caching!
```

**Change to:**
```typescript
export const dynamicParams = true;
export const revalidate = 60; // Cache for 60 seconds
```

**Impact:** Subsequent page loads serve cached data instantly

---

#### 5.2: Implement Streaming for API Data

**File:** `/app/page.tsx`

**Current:** All data fetched in parallel, but blocks rendering

**Optimized with Streaming:**
```typescript
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Above-the-fold sections (loaded immediately)
import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";

// Skeletons
import { CategoriesContentSkeleton } from "@/components/home/categories-section/categories-content";
import { MenuSkeleton } from "@/components/home/menu-section/menu-skeleton";
import { StoresSkeleton } from "@/components/home/stores-section/stores-skeleton";

// Below-the-fold sections - lazy loaded AND prefetch={false}
const MenuSection = dynamic(
  () => import("@/components/home/menu-section").then((mod) => ({ default: mod.MenuSection })),
  {
    loading: () => <MenuSkeleton />,
    ssr: true, // Still SSR but stream separately
  }
);

const StoresSection = dynamic(
  () => import("@/components/home/stores-section").then((mod) => ({ default: mod.StoresSection })),
  {
    loading: () => <StoresSkeleton />,
    ssr: true,
  }
);

// Static sections - can be fully deferred
const AboutSection = dynamic(() => import("@/components/home/about-section").then((mod) => ({ default: mod.AboutSection })), { ssr: false });
const MissionVisionSection = dynamic(() => import("@/components/home/mission-vision-section").then((mod) => ({ default: mod.MissionVisionSection })), { ssr: false });
const TestimonialsSection = dynamic(() => import("@/components/home/testimonials-section").then((mod) => ({ default: mod.TestimonialsSection })), { ssr: false });
const ContactSection = dynamic(() => import("@/components/home/contact-section").then((mod) => ({ default: mod.ContactSection })), { ssr: false });

export default function Home() {
  return (
    <>
      {/* Critical above-the-fold */}
      <HeroSection />

      {/* Important API data with Suspense boundary */}
      <Suspense fallback={<CategoriesContentSkeleton />}>
        <CategoriesSection />
      </Suspense>

      {/* Below-the-fold lazy loaded */}
      <MenuSection />
      <StoresSection />

      {/* Non-critical static content - client-side only */}
      <AboutSection />
      <MissionVisionSection />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
```

**Current (already optimized):** ✅ Already uses dynamic imports!

**Further optimization:** Add `ssr: false` to non-API static sections

---

#### 5.3: Add Loading States & Skeleton Screens

**Files already have this:** ✅
- `/components/home/categories-section/categories-content.tsx`
- `/components/home/menu-section/menu-skeleton.tsx`
- `/components/home/stores-section/stores-skeleton.tsx`

**Ensure skeletons match final content size** to prevent CLS

---

## Phase 6: Third-Party Script Optimization

### Current Issues
- NextTopLoader adds ~10KB
- Multiple context providers in layout

### Solution

#### 6.1: Optimize NextTopLoader

**File:** `/app/layout.tsx` (Lines 147-155)

**Current:**
```typescript
<NextTopLoader
  color="#F97316"
  height={3}
  showSpinner={false}
  crawl={true}
  crawlSpeed={200}
  speed={200}
  shadow="0 0 10px #F97316,0 0 5px #F97316"
/>
```

**Optimized:**
```typescript
<NextTopLoader
  color="#F97316"
  height={3}
  showSpinner={false}
  crawl={false} // Disable crawling animation for performance
  speed={300} // Slightly slower but less CPU
  shadow="none" // Remove shadow for better performance
/>
```

**Alternative:** Remove entirely and use browser's native progress indicator

---

#### 6.2: Lazy Load Context Providers

**File:** `/app/layout.tsx`

Some providers might not be needed immediately.

**Consider:** Only load CartProvider when user interacts with cart

---

## Phase 7: Server Response Optimization (Backend/Hosting)

### Problem
- TTFB: 2,323ms
- HTTP/1.1 instead of HTTP/2

### Solutions (Beyond Next.js Code)

#### 7.1: Enable HTTP/2 on Hosting
**Action:** Contact hosting provider or update Nginx/Apache config

#### 7.2: Add CDN
**Recommendation:** Vercel (automatic), Cloudflare, or AWS CloudFront

#### 7.3: Database Query Optimization
**Check:** API endpoint response times at `api.pizzaspace.co.uk`

---

## Phase 8: Meta Tags & SEO Improvements

### Current Status
**File:** `/app/layout.tsx` already has comprehensive SEO ✅

**Missing:**
- Page-specific meta descriptions for dynamic routes

### Add to Menu Page

**File:** `/app/menu/page.tsx` (Lines 68-96)

Already has dynamic metadata ✅

**Action:** Verify Google Search Console shows these correctly

---

## Phase 9: Performance Monitoring

### Add Real User Monitoring (RUM)

#### 9.1: Add Web Vitals Reporting

**File:** `/app/layout.tsx`

Add Vercel Speed Insights (if hosting on Vercel):

```typescript
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ... head ... */}
      <body className={`${montserrat.variable} font-sans antialiased`}>
        {/* ... content ... */}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
```

**Alternative (non-Vercel):** Use `web-vitals` library

```bash
npm install web-vitals
```

**Create** `/lib/web-vitals.ts`:
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: any) {
  console.log(metric); // Replace with your analytics
}

export function reportWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

Use in `app/layout.tsx`:
```typescript
'use client';
import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export function WebVitalsReporter() {
  useEffect(() => {
    reportWebVitals();
  }, []);
  return null;
}
```

---

## Implementation Priority

### CRITICAL (Do First - Biggest Impact)

1. ✅ **Image Optimization** (Phase 1)
   - Remove `unoptimized` flag → 7s faster LCP
   - Enable WebP/AVIF in next.config.ts
   - **Estimated improvement: LCP from 7.5s to 3s**

2. ✅ **Add Caching** (Phase 5.1)
   - Change `revalidate: 0` to `revalidate: 60`
   - **Estimated improvement: TTFB from 2.3s to <500ms on cached requests**

3. ✅ **Reduce Framer Motion Usage** (Phase 2.1)
   - Replace with CSS animations in hero section
   - **Estimated improvement: FCP from 4.3s to 2.5s**

### HIGH PRIORITY (Do Second)

4. ✅ **Font Optimization** (Phase 4)
   - Reduce font weights from 6 to 3
   - **Estimated improvement: 0.3s faster FCP**

5. ✅ **CSS Optimization** (Phase 3)
   - Verify Tailwind purging
   - **Estimated improvement: 0.5s faster FCP**

### MEDIUM PRIORITY (Nice to Have)

6. ⚠️ **Bundle Analysis** (Phase 2.4)
   - Add bundle analyzer
   - Identify and remove unused code

7. ⚠️ **NextTopLoader Optimization** (Phase 6.1)
   - Simplify configuration

### LOW PRIORITY (Backend/Infrastructure)

8. 🔧 **Enable HTTP/2** (Phase 7.1) - Requires hosting config
9. 🔧 **Add CDN** (Phase 7.2) - Consider Vercel deployment

---

## Expected Results After Implementation

| Metric | Current | Target | Improvement |
|--------|---------|--------|-------------|
| **Performance Score** | 56 | 85+ | +29 points |
| **FCP** | 4.3s | 1.5s | -2.8s |
| **LCP** | 7.5s | 2.0s | -5.5s |
| **Speed Index** | 14.1s | 3.5s | -10.6s |
| **TBT** | 160ms | 50ms | -110ms |
| **CLS** | 0 | 0 | ✅ Good |

---

## Quick Wins (Can Implement Today)

### 1. Image Optimization (30 minutes)
```bash
# 1. Update next.config.ts
# 2. Remove unoptimized from custom-image.tsx
# 3. Add quality prop
# 4. Rebuild: npm run build
```

### 2. Add Revalidation (2 minutes)
```bash
# Change app/page.tsx line 6:
# From: export const revalidate = 0;
# To: export const revalidate = 60;
```

### 3. Font Weights (5 minutes)
```bash
# Update app/layout.tsx line 22:
# From: weight: ["300", "400", "500", "600", "700", "800"]
# To: weight: ["400", "600", "700"]
```

### Expected Impact from Quick Wins
- **Performance Score: 56 → 75** (+19 points)
- **LCP: 7.5s → 2.5s** (-5s)
- **FCP: 4.3s → 2.0s** (-2.3s)

---

## Testing Strategy

After each phase:

```bash
# 1. Build production
npm run build

# 2. Test locally
npm run start

# 3. Run Lighthouse
# Chrome DevTools → Lighthouse → Mobile → Analyze

# 4. Compare metrics
# Record FCP, LCP, TBT, CLS, Performance Score
```

---

## Files to Modify Summary

### Phase 1 (Images)
- ✏️ `/next.config.ts` - Add image optimization config
- ✏️ `/components/ui/custom-image.tsx` - Remove unoptimized flag

### Phase 2 (JavaScript)
- ✏️ `/components/home/hero-section/hero-image.tsx` - Replace Framer Motion
- ✏️ `/app/globals.css` - Add CSS animations
- ✏️ `/next.config.ts` - Add bundle analyzer

### Phase 3 (CSS)
- ✏️ `/tailwind.config.ts` - Verify purge config
- ✏️ `/app/layout.tsx` - Add critical CSS

### Phase 4 (Fonts)
- ✏️ `/app/layout.tsx` - Reduce font weights

### Phase 5 (API)
- ✏️ `/app/page.tsx` - Add revalidation, optimize SSR

### Phase 6 (Third-party)
- ✏️ `/app/layout.tsx` - Optimize NextTopLoader

### Phase 9 (Monitoring)
- ✏️ `/app/layout.tsx` - Add Speed Insights
- 📄 `/lib/web-vitals.ts` - Create web vitals reporter

---

## Conclusion

By implementing these optimizations, you should see:
- **Performance Score: 56 → 85+**
- **LCP: 7.5s → 2.0s** (critical for user experience)
- **Total page weight: 10.7MB → 2-3MB**
- **JavaScript execution: 9.8s → 3-4s**

The most impactful changes are in **Phase 1 (Images)** and **Phase 5 (Caching)** which together can improve performance by 40+ points.

Start with the Quick Wins section for immediate results, then tackle each phase systematically.
