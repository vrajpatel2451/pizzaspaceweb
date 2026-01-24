# Policy Pages Implementation

## Overview
This document describes the implementation of dynamic policy pages using Next.js 16 App Router with static site generation (SSG), dynamic metadata, and comprehensive error handling.

## Architecture

### Route Structure
```
/policies/[slug]
├── page.tsx         - Main dynamic page with SSG
├── loading.tsx      - Loading skeleton state
└── not-found.tsx    - Custom 404 page
```

### Component Structure
```
components/
├── ui/
│   └── breadcrumb.tsx      - Breadcrumb navigation component (shadcn-style)
└── policies/
    └── policy-content.tsx  - Client component for rendering policy content
```

## Features Implemented

### 1. Static Site Generation (SSG)
- **generateStaticParams**: Pre-renders all policy pages at build time
- **Revalidation**: Set to 3600 seconds (1 hour) for ISR
- Fetches all policies from API and generates static routes

### 2. Dynamic Metadata (SEO)
- **generateMetadata**: Creates dynamic SEO metadata per policy
- Includes:
  - Page title: `{Policy Name} | Pizza Space`
  - Meta description: First 160 characters from content (HTML stripped)
  - Keywords: Policy-specific keywords
  - Canonical URL: `https://pizzaspace.co.uk/policies/{slug}`
  - OpenGraph tags for social sharing
  - Twitter Card metadata

### 3. Content Rendering
- **Safe HTML Rendering**: Uses `dangerouslySetInnerHTML` (assumes trusted API)
- **Tailwind Typography**: Applied with custom prose classes for optimal styling
- **Responsive Design**: Mobile-first with container queries
- **Dark Mode Support**: Full theme compatibility

### 4. Navigation & UX
- **Breadcrumb Navigation**:
  - Home > Policies > {Policy Name}
  - Uses shadcn-style breadcrumb component
  - Accessible with ARIA labels
- **Last Updated Date**: Shows formatted update timestamp
- **Back to Home**: Easy navigation in 404 state

### 5. Loading States
- **Skeleton UI**: Animated placeholder while content loads
- Matches final content structure
- Uses shadcn Skeleton component

### 6. Error Handling
- **404 Not Found Page**:
  - Friendly error message
  - Links back to home
  - Lists all available policies as alternatives
  - Server-side rendered for SEO

## File Details

### `/app/policies/[slug]/page.tsx`
**Purpose**: Main dynamic page component

**Key Functions**:
- `generateStaticParams()`: Generates static routes for all policies
- `generateMetadata()`: Creates dynamic SEO metadata
- `PolicyPage`: Server component that fetches and displays policy

**Features**:
- Async params handling (Next.js 16)
- Not found handling with `notFound()`
- Revalidation every hour
- Full TypeScript types

**Data Flow**:
```typescript
fetchPolicies() → generateStaticParams() → Static routes at build time
fetchPolicyContent(slug) → PolicyPage → PolicyContent component
```

### `/app/policies/[slug]/loading.tsx`
**Purpose**: Loading state during navigation

**Features**:
- Skeleton placeholders for:
  - Breadcrumb navigation
  - Page title
  - Last updated date
  - Multiple content paragraphs
- Matches final layout structure
- Smooth transition to loaded state

### `/app/policies/[slug]/not-found.tsx`
**Purpose**: Custom 404 error page

**Features**:
- Breadcrumb navigation
- Friendly error message
- Action buttons:
  - Go to Home
  - View All Policies
- Available policies list with:
  - Policy names
  - Last updated dates
  - Direct links
- Server-rendered for SEO

### `/components/policies/policy-content.tsx`
**Purpose**: Client component for rendering policy content

**Props**:
```typescript
interface PolicyContentProps {
  name: string;        // Policy name
  content: string;     // HTML content
  updatedAt: string;   // ISO date string
}
```

**Features**:
- Breadcrumb navigation with home icon
- Formatted update date (e.g., "1 January 2026")
- HTML content with custom prose styling:
  - Responsive typography
  - Dark mode support
  - Orange accent links
  - Proper heading hierarchy
  - List styling
- Semantic HTML structure
- Accessibility features

### `/components/ui/breadcrumb.tsx`
**Purpose**: Reusable breadcrumb component

**Components**:
- `Breadcrumb`: Wrapper with nav element
- `BreadcrumbList`: Ordered list container
- `BreadcrumbItem`: Individual breadcrumb item
- `BreadcrumbLink`: Clickable breadcrumb link
- `BreadcrumbPage`: Current page (non-clickable)
- `BreadcrumbSeparator`: Chevron separator
- `BreadcrumbEllipsis`: For truncated paths

**Accessibility**:
- ARIA labels and roles
- Semantic HTML
- Keyboard navigation support

## API Integration

### Used Server Fetchers
From `/lib/api/server-fetchers.ts`:

```typescript
// Fetch all policies (for generateStaticParams and not-found)
fetchPolicies(): Promise<PolicyListItem[]>

// Fetch specific policy content (for page rendering)
fetchPolicyContent(slug: string): Promise<PolicyDetails | null>
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
  content: string;  // HTML/Markdown content
}
```

## Styling Details

### Tailwind Classes Used

**Breadcrumb Styling**:
- Container with border and muted background
- Responsive padding and spacing
- Hover states for links

**Content Styling**:
- Custom prose classes for typography
- Heading sizes and spacing
- Link colors with hover states
- List styling
- Dark mode variants

**Layout**:
- Container max-width: 4xl (896px)
- Responsive padding scales
- Min-height: 100vh for full page coverage

## Performance Optimizations

1. **Static Generation**: Pre-rendered at build time
2. **ISR (Incremental Static Regeneration)**: 1-hour revalidation
3. **React Cache**: Request deduplication via `cache()`
4. **Optimized Images**: Uses CustomImage component (when needed)
5. **Code Splitting**: Client components lazy-loaded
6. **Font Optimization**: Next.js font optimization

## Security Considerations

### Content Rendering
- Uses `dangerouslySetInnerHTML` for HTML content
- **Assumption**: API content is trusted and sanitized
- **Alternative**: Consider using a sanitization library like `DOMPurify` if content is user-generated

### Recommendations
If content comes from untrusted sources, add sanitization:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizedContent = DOMPurify.sanitize(policy.content);
```

## Testing Checklist

### Manual Testing
- [ ] Navigate to `/policies/privacy-policy` (example slug)
- [ ] Verify breadcrumb navigation works
- [ ] Check page title and meta description
- [ ] Test loading state (throttle network)
- [ ] Navigate to invalid slug (e.g., `/policies/nonexistent`)
- [ ] Verify 404 page shows available policies
- [ ] Test dark mode toggle
- [ ] Verify responsive design on mobile
- [ ] Check link hover states
- [ ] Verify "Last updated" date formatting

### Automated Testing
```bash
# Build test
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Lint
npm run lint
```

### SEO Testing
- View page source and verify meta tags
- Use Google's Rich Results Test
- Check OpenGraph preview on social media debuggers
- Verify canonical URLs

## URLs & Routes

### Example Policy URLs
```
/policies/privacy-policy
/policies/terms-and-conditions
/policies/cookie-policy
/policies/refund-policy
```

### Dynamic Routes
- All routes generated from API at build time
- New policies require rebuild or wait for revalidation

## Development Notes

### Adding New Policies
1. Policies are created via admin panel/API
2. New policies appear after:
   - Next build/deploy (immediate)
   - ISR revalidation (1 hour)
3. No code changes needed

### Customization Options

**Change Revalidation Time**:
```typescript
// In page.tsx
export const revalidate = 7200; // 2 hours
```

**Change Max Width**:
```tsx
// In policy-content.tsx
<article className="max-w-5xl mx-auto"> // Wider
```

**Modify Prose Styling**:
```tsx
// In policy-content.tsx - Update prose classes
className="prose prose-lg prose-slate..."
```

## Integration Points

### Footer Integration
Policies shown in footer via `fetchFooterPolicies()`:

```typescript
// Already implemented in footer
const footerPolicies = await fetchFooterPolicies();

footerPolicies.map(policy => (
  <Link href={`/policies/${policy.slug}`}>
    {policy.name}
  </Link>
))
```

### Sitemap Integration
Add to `/app/sitemap.ts`:

```typescript
import { fetchPolicies } from '@/lib/api/server-fetchers';

export default async function sitemap() {
  const policies = await fetchPolicies();

  const policyUrls = policies.map(policy => ({
    url: `https://pizzaspace.co.uk/policies/${policy.slug}`,
    lastModified: policy.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...existingUrls, ...policyUrls];
}
```

## Accessibility Features

1. **Semantic HTML**: Proper heading hierarchy, nav, article tags
2. **ARIA Labels**: Breadcrumb navigation, links, buttons
3. **Keyboard Navigation**: All interactive elements accessible
4. **Screen Reader Support**: Descriptive text for icons
5. **Focus States**: Visible focus indicators
6. **Color Contrast**: WCAG AA compliant

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features
- CSS Grid and Flexbox
- Next.js 16 requirements

## Deployment

### Build Command
```bash
npm run build
```

### Environment Variables
No policy-specific env vars needed (uses existing API config).

### Static Export
Compatible with static export if needed:
```javascript
// next.config.js
output: 'export'
```

## Future Enhancements

### Potential Improvements
1. **Search Functionality**: Search within policy content
2. **Table of Contents**: Auto-generate from headings
3. **Print Styles**: Optimized print stylesheet
4. **PDF Export**: Download policy as PDF
5. **Multilingual**: i18n support for policies
6. **Version History**: Show policy version changes
7. **Bookmarking**: Remember user's position
8. **Sanitization**: Add DOMPurify for untrusted content

### Advanced Features
- Real-time updates via webhooks
- Policy comparison tool
- Email policy updates
- Policy acceptance tracking
- Analytics (time on page, scroll depth)

## Troubleshooting

### Common Issues

**Issue**: Policy not found after creation
- **Solution**: Wait for revalidation or trigger rebuild

**Issue**: Metadata not updating
- **Solution**: Clear cache, verify generateMetadata function

**Issue**: Styling not applied
- **Solution**: Check Tailwind config, verify prose classes

**Issue**: HTML not rendering
- **Solution**: Verify dangerouslySetInnerHTML syntax, check content format

## Related Files

- `/lib/api/server-fetchers.ts` - Data fetching functions
- `/lib/api/index.ts` - API client functions
- `/types/policy.ts` - TypeScript type definitions
- `/components/layout/footer/footer-links.tsx` - Footer policy links
- `/lib/utils.ts` - Utility functions (cn helper)

## Summary

This implementation provides a robust, SEO-optimized, and user-friendly solution for displaying policy pages with:
- Static generation for performance
- Dynamic metadata for SEO
- Comprehensive error handling
- Accessible and responsive design
- Easy content management via API
- Full TypeScript type safety

All files follow Next.js 16 best practices and integrate seamlessly with the existing codebase architecture.
