# Footer API Integration - Quick Start Guide

## What Changed?

The footer components now fetch data from backend APIs instead of using hardcoded values.

## Component Props

### FooterBrand
```tsx
<FooterBrand
  footerLogo={string | null}
  socialMedia={SocialMedia[]}
/>
```

### FooterContact
```tsx
<FooterContact
  contactInfo={ContactInfo | null}
  openingHours={OpeningHours[]}
/>
```

### FooterLinksColumn
```tsx
<FooterLinksColumn
  title={string}
  links={FooterLink[]}
  policies={PolicyListItem[]}  // Optional - for Help & Support column
/>
```

## Data Flow

```
Footer (Server Component)
  ↓
fetchFooterData() - Server-side fetch
  ↓
{
  footerLogo,
  socialMedia,
  contactInfo,
  openingHours,
  footerPolicies
}
  ↓
Props passed to child components
```

## How to Use Server Fetcher

```typescript
import { fetchFooterData } from "@/lib/api/server-fetchers";

// In Server Component
async function MyComponent() {
  const data = await fetchFooterData();

  return (
    <FooterBrand
      footerLogo={data.footerLogo}
      socialMedia={data.socialMedia}
    />
  );
}
```

## Fallback Data

All components have built-in fallbacks:

- **No logo?** Uses `/logo.png`
- **No contact info?** Shows default UK address
- **No hours?** Shows example hours
- **No social media?** Section hidden
- **No policies?** Only static links shown

## Utilities Available

```typescript
import {
  formatAddress,
  formatOpeningHours,
  isStoreOpen,
  getTodayHours,
} from "@/lib/api/server-fetchers";

// Format full address
const address = formatAddress(contactInfo);
// "123 Pizza St, London, SW1A 1AA"

// Group consecutive days
const hours = formatOpeningHours(openingHours);
// ["Monday - Friday: 11:00 AM - 10:00 PM", ...]

// Check if open now
const isOpen = isStoreOpen(openingHours);
// true/false

// Get today's hours
const today = getTodayHours(openingHours);
// { day: "Monday", startTime: "11:00", endTime: "22:00" }
```

## Testing Locally

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **View footer at:**
   ```
   http://localhost:3000
   ```

3. **Check Suspense loading:**
   - Throttle network in DevTools
   - Watch skeleton loaders appear

4. **Test fallbacks:**
   - Disable backend API
   - Verify fallback data displays

## Troubleshooting

### Logo not showing
- Check API response: `GET /logos/details?type=footer&theme=dark`
- Verify image URL is accessible
- Check CustomImage component error handling

### Opening hours wrong format
- Verify API returns `startTime` and `endTime` in "HH:mm" format
- Check `sortOrder` field for proper day ordering
- Use `formatOpeningHours()` utility

### Social media icons broken
- Ensure `logo` field contains valid image URLs
- Check CORS settings for external image URLs
- Verify `link` field contains full URLs with protocol

### Policies not appearing
- Check `showOnFooter` flag is true in API response
- Verify policy has a valid `slug` field
- Check route exists: `/policies/[slug]`

## Performance Tips

- Server-side fetching is cached automatically
- No need for manual cache invalidation
- Data shared across all footer instances on page
- Suspense enables streaming HTML

## Next Steps

Want to customize further?

1. **Add more social platforms:** Update API to return more social media
2. **Change logo theme:** Modify `fetchFooterLogo("dark")` to `"light"`
3. **Add custom formatting:** Extend utility functions in `server-fetchers.ts`
4. **Integrate newsletter:** Connect form to backend API endpoint

## Related Files

```
components/layout/footer/
├── index.tsx              (Main container)
├── footer-brand.tsx       (Logo + Social)
├── footer-contact.tsx     (Contact + Hours)
├── footer-links.tsx       (Links + Policies)
└── footer-bottom.tsx      (Copyright + Legal)

lib/api/
├── server-fetchers.ts     (Data fetching + utilities)
└── index.ts               (API client methods)

types/
├── opening-hours.ts
├── social-media.ts
├── contact-info.ts
├── policy.ts
└── logo.ts
```

## Support

Questions? Check:
- Full documentation: `/docs/footer-api-integration.md`
- Server fetchers: `/lib/api/server-fetchers.ts`
- Type definitions: `/types/index.ts`
