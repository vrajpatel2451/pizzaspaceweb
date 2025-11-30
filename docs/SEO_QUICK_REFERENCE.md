# SEO Quick Reference - Pizza Space

## 🚀 Quick Start

### Check Your SEO Implementation

```bash
# 1. Start dev server
npm run dev

# 2. Open these URLs in browser
open http://localhost:3000
open http://localhost:3000/sitemap.xml
open http://localhost:3000/robots.txt
open http://localhost:3000/site.webmanifest
```

### View Page Meta Tags

1. Open http://localhost:3000
2. Right-click > "View Page Source"
3. Look for:
   - `<title>` tag
   - `<meta name="description">`
   - `<meta property="og:*">`
   - `<script type="application/ld+json">`

---

## 📁 Key File Locations

```
SEO Files Map:
├── app/
│   ├── layout.tsx           ← Meta tags, OG, Twitter Cards
│   └── sitemap.ts           ← Sitemap generator
├── components/
│   └── seo/
│       └── json-ld.tsx      ← Structured data schemas
└── public/
    ├── robots.txt           ← Crawler instructions
    ├── site.webmanifest     ← PWA manifest
    └── browserconfig.xml    ← Windows tile config
```

---

## 🔍 What Was Implemented

### 1. Meta Tags (app/layout.tsx)
```typescript
- Title Template: "%s | Pizza Space"
- Description: 160 chars with keywords
- 13 targeted keywords
- Canonical URL: https://pizzaspace.co.uk
```

### 2. Open Graph
```typescript
- Type: website
- Locale: en_GB
- Image: 1200x630 (/og-image.jpg)
- All required properties
```

### 3. Twitter Cards
```typescript
- Card: summary_large_image
- Handle: @pizzaspace
- Same image as OG
```

### 4. JSON-LD Schemas
```typescript
✅ Restaurant schema
✅ LocalBusiness schema
✅ Website schema
✅ Organization schema
```

### 5. Technical SEO
```typescript
✅ robots.txt
✅ sitemap.xml (dynamic)
✅ Web manifest
✅ Favicon config
```

---

## ⚠️ Action Items

### Required Before Production

1. **Create Images** (Priority 1)
   ```
   /public/og-image.jpg (1200x630)
   /public/favicon-16x16.png
   /public/favicon-32x32.png
   /public/apple-touch-icon.png (180x180)
   /public/android-chrome-192x192.png
   /public/android-chrome-512x512.png
   ```

2. **Update Placeholders** (Priority 2)
   - Phone: +44 20 1234 5678 → YOUR_PHONE
   - Email: hello@pizzaspace.co.uk → YOUR_EMAIL
   - Address: 123 Pizza Street → YOUR_ADDRESS
   - Coordinates: Update in json-ld.tsx

3. **Verify Google** (Priority 3)
   - Get verification code from Search Console
   - Update in app/layout.tsx line 117

4. **Social Media** (Priority 4)
   - Update Twitter handle
   - Add real Facebook URL
   - Add real Instagram URL

---

## 🧪 Testing Checklist

### Local Testing
```bash
# Build succeeds
npm run build

# Dev server runs
npm run dev

# Check meta tags
curl http://localhost:3000 | grep -i "og:title"

# Verify sitemap
curl http://localhost:3000/sitemap.xml

# Check robots
curl http://localhost:3000/robots.txt
```

### Online Testing

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test: Your production URL
   - Should pass: Restaurant, Organization schemas

2. **Meta Tags Preview**
   - URL: https://metatags.io/
   - Paste: Your production URL
   - Preview: Facebook, Twitter, LinkedIn cards

3. **Schema Validator**
   - URL: https://validator.schema.org/
   - Paste: Your JSON-LD code
   - Should: No errors

4. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Test: Mobile + Desktop
   - Target: 90+ SEO score

---

## 📊 Current Status

| Component | Status | Location |
|-----------|--------|----------|
| Meta Tags | ✅ Done | app/layout.tsx |
| Open Graph | ✅ Done | app/layout.tsx |
| Twitter Cards | ✅ Done | app/layout.tsx |
| JSON-LD | ✅ Done | components/seo/json-ld.tsx |
| Sitemap | ✅ Done | app/sitemap.ts |
| Robots.txt | ✅ Done | public/robots.txt |
| Manifest | ✅ Done | public/site.webmanifest |
| Favicon .ico | ✅ Exists | app/favicon.ico |
| Favicon PNGs | ⚠️ Needed | public/ |
| OG Image | ⚠️ Needed | public/og-image.jpg |
| Contact Info | ⚠️ Update | components/seo/json-ld.tsx |

---

## 🎯 SEO Score Target

Expected Lighthouse SEO Score: **95-100**

### Scoring Breakdown
- Meta description: ✅ (5 points)
- Crawlable: ✅ (5 points)
- Valid robots.txt: ✅ (5 points)
- Tap targets: ✅ (10 points)
- Viewport: ✅ (5 points)
- Document title: ✅ (5 points)
- Legible fonts: ✅ (5 points)
- Structured data: ✅ (bonus)

---

## 💡 Pro Tips

### 1. Testing Social Cards
```bash
# After deploying, test social sharing:
- Post on Facebook (check preview)
- Tweet the URL (check card)
- Share on LinkedIn (check preview)
```

### 2. Google Search Console
```bash
# After verification:
1. Submit sitemap: https://yourdomain.com/sitemap.xml
2. Monitor coverage reports
3. Check mobile usability
4. Review Core Web Vitals
```

### 3. Monitor Rankings
```bash
# Track these keywords:
- pizza delivery london
- best pizza london
- italian pizza london
- pizza near me
```

### 4. Update Frequency
```bash
Weekly:  Check GSC for errors
Monthly: Update sitemap if routes change
Yearly:  Refresh OG images, review keywords
```

---

## 🔗 Useful Links

- **Documentation**: /docs/SEO_IMPLEMENTATION.md
- **Checklist**: /docs/SEO_CHECKLIST.md
- **Schema Code**: /components/seo/json-ld.tsx
- **Metadata**: /app/layout.tsx
- **Sitemap**: /app/sitemap.ts

---

## 📞 Need Help?

### Common Issues

**Issue**: Meta tags not showing
**Fix**: Clear browser cache, check view-source

**Issue**: Sitemap 404
**Fix**: Run `npm run build`, check /app/sitemap.ts

**Issue**: Schema errors
**Fix**: Validate at validator.schema.org

**Issue**: OG image not loading
**Fix**: Check file exists at /public/og-image.jpg

---

**Quick Ref Version**: 1.0
**Last Updated**: November 30, 2025
**Status**: Implementation Complete ✅
