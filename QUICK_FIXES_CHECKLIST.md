# Quick Performance Fixes - Checklist

**Target: Go from Performance 56 → 75+ in 1 hour**

## ✅ Immediate Actions (30-60 minutes)

### 1. Image Optimization (Est: 7s faster LCP)

#### A. Update next.config.ts
```diff
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
+   formats: ['image/avif', 'image/webp'],
+   deviceSizes: [640, 750, 828, 1080, 1200, 1920],
+   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
+   minimumCacheTTL: 60,
    remotePatterns: [
      // ... existing patterns
    ],
  },
+  experimental: {
+    optimizePackageImports: ['lucide-react', '@radix-ui/*'],
+  },
};
```

#### B. Update components/ui/custom-image.tsx

Find line 156:
```diff
-     unoptimized={imageSrc.startsWith(IMAGE_DOMAIN)}
+     quality={85}
```

---

### 2. Add Caching (Est: 2s faster TTFB)

#### Update app/page.tsx line 6:
```diff
- export const revalidate = 0;
+ export const revalidate = 60; // Cache for 60 seconds
```

---

### 3. Reduce Font Weights (Est: 0.3s faster FCP)

#### Update app/layout.tsx lines 19-24:
```diff
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
-  weight: ["300", "400", "500", "600", "700", "800"],
+  weight: ["400", "600", "700"],
  display: "swap",
+  preload: true,
+  fallback: ['system-ui', 'arial'],
});
```

---

### 4. Optimize NextTopLoader (Est: 50ms faster TBT)

#### Update app/layout.tsx lines 147-155:
```diff
<NextTopLoader
  color="#F97316"
  height={3}
  showSpinner={false}
-  crawl={true}
-  crawlSpeed={200}
-  speed={200}
-  shadow="0 0 10px #F97316,0 0 5px #F97316"
+  crawl={false}
+  speed={300}
+  shadow="none"
/>
```

---

### 5. Disable SSR for Static Sections (Est: 0.5s faster initial load)

#### Update app/page.tsx lines 38-60:

```diff
const AboutSection = dynamic(() =>
  import("@/components/home/about-section").then((mod) => ({
    default: mod.AboutSection,
  }))
+ , { ssr: false }
);

const MissionVisionSection = dynamic(() =>
  import("@/components/home/mission-vision-section").then((mod) => ({
    default: mod.MissionVisionSection,
  }))
+ , { ssr: false }
);

const TestimonialsSection = dynamic(() =>
  import("@/components/home/testimonials-section").then((mod) => ({
    default: mod.TestimonialsSection,
  }))
+ , { ssr: false }
);

const ContactSection = dynamic(() =>
  import("@/components/home/contact-section").then((mod) => ({
    default: mod.ContactSection,
  }))
+ , { ssr: false }
);
```

---

## 🧪 Test After Changes

```bash
# 1. Rebuild
npm run build

# 2. Start production server
npm run start

# 3. Open Chrome DevTools
# Navigate to: http://localhost:3001
# Run Lighthouse audit (Mobile, Slow 4G)

# 4. Check improvements:
# - Performance Score should be 75+
# - LCP should be < 3s
# - FCP should be < 2s
```

---

## 📊 Expected Results

| Metric | Before | After Quick Fixes | Improvement |
|--------|--------|-------------------|-------------|
| Performance | 56 | 75+ | +19 points |
| FCP | 4.3s | 2.0s | -2.3s ⬇️ |
| LCP | 7.5s | 2.5s | -5.0s ⬇️ |
| TBT | 160ms | 80ms | -80ms ⬇️ |
| Speed Index | 14.1s | 5.0s | -9.1s ⬇️ |

---

## ⚠️ Common Issues & Solutions

### Issue: Images still slow
**Solution:** Clear Next.js cache
```bash
rm -rf .next
npm run build
```

### Issue: Build errors after changes
**Solution:** Check TypeScript errors
```bash
npm run lint
```

### Issue: Images not optimizing
**Solution:** Verify remote pattern hostname matches exactly
```bash
# Check your .env file
echo $NEXT_PUBLIC_IMAGE_HOST
# Should match hostname in next.config.ts
```

---

## 🚀 Next Steps (After Quick Fixes)

Once you've completed the quick fixes and verified improvements:

1. **Review full plan:** See `PERFORMANCE_OPTIMIZATION_PLAN.md`
2. **Phase 2:** Replace Framer Motion with CSS animations (2-3 hours)
3. **Phase 3:** CSS optimization with Tailwind purging
4. **Add monitoring:** Implement web-vitals tracking

---

## 📝 Verification Checklist

- [ ] Updated `next.config.ts` with image optimization
- [ ] Removed `unoptimized` flag from `custom-image.tsx`
- [ ] Added `revalidate: 60` to homepage
- [ ] Reduced font weights to 3 variants
- [ ] Optimized NextTopLoader configuration
- [ ] Added `ssr: false` to static sections
- [ ] Ran production build successfully
- [ ] Tested on localhost:3001
- [ ] Ran Lighthouse audit
- [ ] Performance score > 75 ✅

---

## 💡 Pro Tips

1. **Always test in production mode** (`npm run build && npm run start`)
2. **Use incognito window** for Lighthouse to avoid extensions
3. **Run multiple audits** and take the median score
4. **Focus on mobile performance** - it's more representative
5. **Monitor real users** after deployment with Speed Insights

---

## 🎯 Success Criteria

After these quick fixes, you should see:
- ✅ Performance Score: **75+** (was 56)
- ✅ LCP: **< 3.0s** (was 7.5s)
- ✅ FCP: **< 2.0s** (was 4.3s)
- ✅ All Core Web Vitals: **Green** ✨

If you achieve these metrics, you're ready for Phase 2 optimizations to reach 85+ performance score!
