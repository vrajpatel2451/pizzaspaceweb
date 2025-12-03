# Ready-to-Apply Code Changes

**Quick copy-paste fixes for immediate performance improvement**

---

## Change 1: Enable Image Optimization

### File: `/Users/vrajpatel/Documents/personal/pizzaspace_web/next.config.ts`

**Replace entire file with:**

```typescript
import type { NextConfig } from "next";

// Get image domain from environment variable (strip protocol for hostname)
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
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/*'], // Tree-shake icon libraries
  },
};

export default nextConfig;
```

---

## Change 2: Remove Unoptimized Flag from Images

### File: `/Users/vrajpatel/Documents/personal/pizzaspace_web/components/ui/custom-image.tsx`

**Find lines 144-159 and replace with:**

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
      quality={85}
      {...props}
    />
  );
```

**What changed:**
- ❌ Removed: `unoptimized={imageSrc.startsWith(IMAGE_DOMAIN)}`
- ✅ Added: `quality={85}`

---

## Change 3: Add Caching to Homepage

### File: `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/page.tsx`

**Find line 6 and change:**

```typescript
// Before
export const revalidate = 0;

// After
export const revalidate = 60; // Cache for 60 seconds
```

---

## Change 4: Reduce Font Weights

### File: `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/layout.tsx`

**Find lines 19-24 and replace with:**

```typescript
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Reduced from 6 to 3 weights
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});
```

---

## Change 5: Optimize NextTopLoader

### File: `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/layout.tsx`

**Find lines 147-155 and replace with:**

```typescript
        <NextTopLoader
          color="#F97316"
          height={3}
          showSpinner={false}
          crawl={false}
          speed={300}
        />
```

**What changed:**
- ❌ Removed: `crawl={true}`, `crawlSpeed={200}`, `speed={200}`, `shadow="..."`
- ✅ Changed: `crawl={false}`, `speed={300}`

---

## Change 6: Disable SSR for Static Sections

### File: `/Users/vrajpatel/Documents/personal/pizzaspace_web/app/page.tsx`

**Find lines 38-60 and replace with:**

```typescript
const AboutSection = dynamic(() =>
  import("@/components/home/about-section").then((mod) => ({
    default: mod.AboutSection,
  })),
  { ssr: false }
);

const MissionVisionSection = dynamic(() =>
  import("@/components/home/mission-vision-section").then((mod) => ({
    default: mod.MissionVisionSection,
  })),
  { ssr: false }
);

const TestimonialsSection = dynamic(() =>
  import("@/components/home/testimonials-section").then((mod) => ({
    default: mod.TestimonialsSection,
  })),
  { ssr: false }
);

const ContactSection = dynamic(() =>
  import("@/components/home/contact-section").then((mod) => ({
    default: mod.ContactSection,
  })),
  { ssr: false }
);
```

**What changed:**
- ✅ Added: `{ ssr: false }` to all 4 dynamic imports

---

## Testing Commands

After making all changes:

```bash
# 1. Clear cache and rebuild
rm -rf .next
npm run build

# 2. Start production server
npm run start

# 3. Open in browser
# http://localhost:3001

# 4. Run Lighthouse audit in Chrome DevTools
# Lighthouse → Mobile → Analyze page load
```

---

## Expected Results

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Performance | 56 | 75+ | +19 points |
| FCP | 4.3s | 2.0s | -2.3s |
| LCP | 7.5s | 2.5s | -5.0s |
| TBT | 160ms | 80ms | -80ms |
| Page Weight | 10.7MB | 2.5MB | -8.2MB |

---

## Verification Checklist

After applying changes, verify:

- [ ] Build completes without errors
- [ ] Homepage loads correctly
- [ ] Images display properly
- [ ] No console errors
- [ ] Lighthouse score improved
- [ ] Images are smaller (check Network tab)
- [ ] Fonts load quickly
- [ ] Animations still work

---

## Rollback (If Needed)

If something breaks:

```bash
# Revert all changes
git checkout next.config.ts
git checkout components/ui/custom-image.tsx
git checkout app/page.tsx
git checkout app/layout.tsx

# Rebuild
npm run build
```

---

## Pro Tips

1. **Test in incognito mode** to avoid cached results
2. **Run Lighthouse 3 times** and take the median score
3. **Check Network tab** to see image size reductions
4. **Monitor real users** after deployment
5. **Keep old Lighthouse reports** for comparison

---

## What These Changes Do

### 1. Image Optimization
- Converts images to WebP/AVIF (60-80% smaller)
- Generates responsive sizes automatically
- Serves optimal format per browser

### 2. Caching
- Serves cached HTML for 60 seconds
- Reduces API calls
- Faster TTFB for repeat visitors

### 3. Font Optimization
- Loads 3 weights instead of 6
- Faster font download
- Reduced CLS risk

### 4. TopLoader Optimization
- Simpler animation = less CPU
- No shadow rendering
- Faster perceived performance

### 5. SSR Optimization
- Reduces initial HTML size
- Non-critical content loads client-side
- Faster Time to Interactive

---

## Time Required

- **Applying changes:** 10 minutes
- **Testing locally:** 5 minutes
- **Deploy & verify:** 10 minutes
- **Total:** 25 minutes

---

## Next Steps After Quick Fixes

1. Monitor real user metrics for 24-48 hours
2. Review bundle analyzer results
3. Consider CSS animation migration
4. Plan Phase 2 optimizations

See `PERFORMANCE_OPTIMIZATION_PLAN.md` for the complete roadmap.

---

**Ready to start?** Copy each change from this file and test after all changes are applied.

Good luck! 🚀
