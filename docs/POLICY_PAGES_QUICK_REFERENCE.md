# Policy Pages - Quick Reference Guide

## Overview
Dynamic policy pages with static generation, SEO optimization, and comprehensive error handling.

## Files Created

### 1. Core Route Files
```
app/policies/[slug]/
├── page.tsx         - Main dynamic page (Server Component)
├── loading.tsx      - Loading skeleton state
└── not-found.tsx    - Custom 404 page
```

### 2. Component Files
```
components/
├── policies/
│   └── policy-content.tsx  - Content renderer (Client Component)
└── ui/
    └── breadcrumb.tsx      - Breadcrumb navigation component
```

### 3. Documentation
```
docs/
├── POLICY_PAGES_IMPLEMENTATION.md  - Complete implementation guide
├── POLICY_PAGES_ARCHITECTURE.md    - Architecture diagrams
└── POLICY_PAGES_QUICK_REFERENCE.md - This file
```

## Key Features

### Static Site Generation
```typescript
// Automatically generates pages at build time
export async function generateStaticParams() {
  const policies = await fetchPolicies();
  return policies.map((policy) => ({ slug: policy.slug }));
}
```

### Dynamic Metadata
```typescript
// SEO-optimized metadata for each policy
export async function generateMetadata({ params }): Promise<Metadata> {
  const policy = await fetchPolicyContent(slug);
  return {
    title: `${policy.name} | Pizza Space`,
    description: // First 160 chars of content
  };
}
```

### Content Rendering
```typescript
// Safe HTML rendering with Tailwind prose
<div
  className="prose prose-slate dark:prose-invert"
  dangerouslySetInnerHTML={{ __html: content }}
/>
```

## Usage Examples

### Access Policy Pages
```
/policies/privacy-policy
/policies/terms-and-conditions
/policies/cookie-policy
/policies/refund-policy
```

### Link to Policy
```tsx
import Link from 'next/link';

<Link href={`/policies/${policy.slug}`}>
  {policy.name}
</Link>
```

### Fetch Policy Data
```typescript
import { fetchPolicyContent } from '@/lib/api/server-fetchers';

const policy = await fetchPolicyContent('privacy-policy');
```

## Component API

### PolicyContent Component
```typescript
import { PolicyContent } from '@/components/policies/policy-content';

<PolicyContent
  name="Privacy Policy"
  content="<h2>Content</h2>..."
  updatedAt="2026-01-10T00:00:00Z"
/>
```

**Props**:
- `name` (string): Policy title
- `content` (string): HTML content
- `updatedAt` (string): ISO date string

### Breadcrumb Component
```typescript
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## API Integration

### Available Fetchers
From `/lib/api/server-fetchers.ts`:

```typescript
// Get all policies
const policies = await fetchPolicies();
// Returns: PolicyListItem[]

// Get specific policy
const policy = await fetchPolicyContent(slug);
// Returns: PolicyDetails | null

// Get footer policies only
const footerPolicies = await fetchFooterPolicies();
// Returns: PolicyListItem[]
```

### Type Definitions
From `/types/policy.ts`:

```typescript
interface PolicyListItem {
  _id: string;
  name: string;
  slug: string;
  showOnFooter: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PolicyDetails extends PolicyListItem {
  content: string;  // HTML content
}
```

## Configuration

### Revalidation
Change in `/app/policies/[slug]/page.tsx`:
```typescript
export const revalidate = 3600; // 1 hour (default)
export const revalidate = 7200; // 2 hours
```

### Content Styling
Modify prose classes in `/components/policies/policy-content.tsx`:
```typescript
className="prose prose-slate dark:prose-invert prose-lg..." // Larger text
className="prose prose-zinc dark:prose-invert..." // Different color
```

### Max Content Width
Change in `/components/policies/policy-content.tsx`:
```tsx
<article className="max-w-4xl mx-auto"> // Default: 896px
<article className="max-w-5xl mx-auto"> // Wider: 1024px
<article className="max-w-3xl mx-auto"> // Narrower: 768px
```

## Testing

### Manual Testing Checklist
```bash
# 1. Navigate to valid policy
http://localhost:3000/policies/privacy-policy

# 2. Verify breadcrumb navigation
# 3. Check page title and date
# 4. Test responsive design
# 5. Toggle dark mode

# 6. Navigate to invalid policy
http://localhost:3000/policies/nonexistent

# 7. Verify 404 page shows
# 8. Check available policies list
```

### Build Testing
```bash
# Build for production
npm run build

# Check build output
# Should see: ● /policies/[slug] (SSG)

# Run production server
npm run start

# Test in production mode
```

### Type Checking
```bash
# Run TypeScript compiler
npx tsc --noEmit

# Should complete with no errors
```

## Common Tasks

### Add Content Sanitization
```typescript
// Install DOMPurify
npm install isomorphic-dompurify

// In policy-content.tsx
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(content);

<div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
```

### Add Table of Contents
```typescript
// In policy-content.tsx
const headings = extractHeadings(content); // Custom function

<aside className="toc">
  {headings.map(heading => (
    <a href={`#${heading.id}`}>{heading.text}</a>
  ))}
</aside>
```

### Add Print Styles
```typescript
// In policy-content.tsx or globals.css
@media print {
  .no-print { display: none; }
  .prose { max-width: 100%; }
}
```

## Troubleshooting

### Issue: Policy not showing after creation
**Solution**: Rebuild or wait for ISR revalidation (1 hour)
```bash
npm run build
```

### Issue: Metadata not updating
**Solution**: Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Issue: Styling not applied
**Solution**: Check Tailwind config includes components/policies
```javascript
// tailwind.config.js
content: [
  "./components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
]
```

### Issue: HTML content not rendering
**Solution**: Verify content is valid HTML string
```typescript
console.log(typeof policy.content); // Should be 'string'
console.log(policy.content.substring(0, 100)); // Check content
```

## Performance Tips

1. **Static Generation**: All policies pre-rendered at build
2. **ISR**: Updates every hour without rebuild
3. **React Cache**: Deduplicates API calls per request
4. **Code Splitting**: Client components lazy-loaded
5. **Font Optimization**: Next.js automatic optimization

## Security Notes

### Content Rendering
- Currently uses `dangerouslySetInnerHTML`
- Assumes API content is trusted and sanitized
- For untrusted content, add `DOMPurify` sanitization

### Recommendations
```typescript
// Before deploying, consider:
1. API content validation
2. HTML sanitization (DOMPurify)
3. Content-Security-Policy headers
4. XSS protection
```

## SEO Checklist

- [x] Static generation enabled
- [x] Dynamic metadata per page
- [x] Canonical URLs set
- [x] OpenGraph tags included
- [x] Twitter Card metadata
- [x] Semantic HTML structure
- [x] Breadcrumb navigation
- [x] Mobile-responsive
- [x] Fast loading (SSG)
- [x] Accessible (ARIA labels)

## Accessibility Features

- Semantic HTML (`nav`, `article`, `header`)
- ARIA labels on breadcrumb
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Color contrast compliant
- Proper heading hierarchy

## Integration Examples

### Footer Links
```typescript
// In footer component
import { fetchFooterPolicies } from '@/lib/api/server-fetchers';

const policies = await fetchFooterPolicies();

{policies.map(policy => (
  <Link key={policy._id} href={`/policies/${policy.slug}`}>
    {policy.name}
  </Link>
))}
```

### Sitemap
```typescript
// In app/sitemap.ts
import { fetchPolicies } from '@/lib/api/server-fetchers';

export default async function sitemap() {
  const policies = await fetchPolicies();

  const policyUrls = policies.map(policy => ({
    url: `https://pizzaspace.co.uk/policies/${policy.slug}`,
    lastModified: policy.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...otherUrls, ...policyUrls];
}
```

### JSON-LD Schema
```typescript
// Optional: Add structured data
<script type="application/ld+json">
{JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": policy.name,
  "url": `https://pizzaspace.co.uk/policies/${policy.slug}`,
  "dateModified": policy.updatedAt
})}
</script>
```

## File Paths Reference

### Absolute Paths (for imports)
```typescript
// Components
import { PolicyContent } from '@/components/policies/policy-content';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

// API
import { fetchPolicies, fetchPolicyContent } from '@/lib/api/server-fetchers';

// Types
import type { PolicyDetails, PolicyListItem } from '@/types';
```

### File System Paths
```
/Users/vrajpatel/Documents/personal/pizzaspace_web/
├── app/policies/[slug]/page.tsx
├── app/policies/[slug]/loading.tsx
├── app/policies/[slug]/not-found.tsx
├── components/policies/policy-content.tsx
├── components/ui/breadcrumb.tsx
├── lib/api/server-fetchers.ts
└── types/policy.ts
```

## Quick Commands

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Testing
npm run lint             # Lint code
npx tsc --noEmit         # Type check

# Clean
rm -rf .next             # Clear cache
rm -rf node_modules      # Clean dependencies
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome)

## Environment Variables

No policy-specific environment variables required. Uses existing API configuration.

## Related Documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [CLAUDE.md](/CLAUDE.md) - Project instructions

## Support & Resources

- Implementation: `docs/POLICY_PAGES_IMPLEMENTATION.md`
- Architecture: `docs/POLICY_PAGES_ARCHITECTURE.md`
- API Documentation: Check API server docs
- Type Definitions: `/types/policy.ts`

## Version History

- **v1.0.0** (2026-01-10): Initial implementation
  - Dynamic policy pages with SSG
  - SEO optimization
  - Loading states
  - Custom 404 page
  - Breadcrumb navigation
  - Responsive design
  - Dark mode support

## Next Steps

1. Test all policy pages in development
2. Verify SEO metadata with tools
3. Test responsive design on mobile
4. Check accessibility with screen readers
5. Run production build and test
6. Deploy to staging environment
7. Monitor performance metrics
8. Gather user feedback

---

**Quick Links**:
- Main Page: `/app/policies/[slug]/page.tsx`
- Component: `/components/policies/policy-content.tsx`
- Types: `/types/policy.ts`
- API: `/lib/api/server-fetchers.ts`

**Need Help?** Check the full implementation guide at `docs/POLICY_PAGES_IMPLEMENTATION.md`
