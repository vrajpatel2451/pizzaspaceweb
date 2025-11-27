# Footer Component Quick Reference

## File Locations

All footer files are located at:
```
/Users/vrajpatel/Documents/personal/pizzaspace_web/components/layout/footer/
```

### Component Files

| File | Purpose | Type |
|------|---------|------|
| `index.tsx` | Main footer orchestration | Server Component |
| `footer-links.tsx` | Reusable link column component | Server Component |
| `footer-social.tsx` | Social media icons | Server Component |
| `footer-copyright.tsx` | Copyright bar | Server Component |

## Quick Import

```tsx
import { Footer } from "@/components/layout/footer";
```

## Component API

### Footer (Main Component)
```tsx
<Footer />
```
No props required - fully self-contained.

### FooterLinks (Sub-component)
```tsx
<FooterLinks
  title="Quick Links"
  links={[
    { label: "Home", href: "/" },
    { label: "About", href: "/about" }
  ]}
/>
```

**Props:**
- `title`: string - Column heading
- `links`: Array<{ label: string, href: string }> - Links to display

### FooterSocial (Sub-component)
```tsx
<FooterSocial />
```
No props - social links configured internally.

### FooterCopyright (Sub-component)
```tsx
<FooterCopyright />
```
No props - copyright text and link configured internally.

## Visual Layout

```
┌──────────────────────────────────────────────────────────────────┐
│  Footer (bg-slate-800)                                          │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Container (max-width, px-4, py-12)                         │ │
│  │                                                             │ │
│  │ ┌──────────┬──────────┬──────────┬──────────┐            │ │
│  │ │  Logo &  │  Quick   │  Legal   │ Follow   │            │ │
│  │ │  Contact │  Links   │          │  Us      │            │ │
│  │ │          │          │          │          │            │ │
│  │ │ PS Logo  │ • Home   │ • Privacy│ [f][t]   │            │ │
│  │ │ Pizza    │ • About  │ • Return │ [i][y]   │            │ │
│  │ │ Space    │ • Stores │ • Terms  │          │            │ │
│  │ │          │ • Menu   │ • TOS    │ Stay     │            │ │
│  │ │ Address  │ • Contact│          │ updated! │            │ │
│  │ │ Phone    │          │          │          │            │ │
│  │ │ Email    │          │          │          │            │ │
│  │ └──────────┴──────────┴──────────┴──────────┘            │ │
│  │                                                             │ │
│  │ ─────────────────────────────────────────                  │ │
│  │ © 2025 Pizza Space. Powered by Pizza Space                │ │
│  └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Responsive Breakpoints

### Mobile (< 768px)
```
┌───────────────┐
│ Logo & Contact│
├───────────────┤
│ Quick Links   │
├───────────────┤
│ Legal         │
├───────────────┤
│ Follow Us     │
├───────────────┤
│ Copyright     │
└───────────────┘
```

### Tablet (768px - 1023px)
```
┌──────────┬──────────┐
│ Logo &   │ Quick    │
│ Contact  │ Links    │
├──────────┼──────────┤
│ Legal    │ Follow   │
│          │ Us       │
├──────────┴──────────┤
│ Copyright           │
└─────────────────────┘
```

### Desktop (>= 1024px)
```
┌─────┬─────┬─────┬─────┐
│Logo │Quick│Legal│Follo│
│  &  │Links│     │ w Us│
│Cont │     │     │     │
└─────┴─────┴─────┴─────┘
       Copyright
```

## Color Codes

| Element | Color | Tailwind Class | Hex |
|---------|-------|----------------|-----|
| Background | Navy | `bg-slate-800` | #1E293B |
| Titles | White | `text-white` | #FFFFFF |
| Body Text | Gray | `text-gray-400` | #9CA3AF |
| Hover Text | White | `hover:text-white` | #FFFFFF |
| Accent/Link | Orange | `text-orange-500` | #F97316 |
| Border | Gray | `border-gray-700` | #374151 |

## Customization Shortcuts

### Update Links
Edit arrays in `index.tsx`:
```tsx
const quickLinks = [
  { label: "New Page", href: "/new" },
];
```

### Update Contact Info
Edit contact section in `index.tsx` (lines 36-58).

### Update Social Links
Edit `socialLinks` array in `footer-social.tsx` (lines 3-22).

### Update Copyright Year
Edit `footer-copyright.tsx` (line 7).

## Common Tasks

### Add Footer to Layout
```tsx
// app/layout.tsx
import { Footer } from "@/components/layout/footer";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### Add New Social Platform
1. Import icon from lucide-react
2. Add to socialLinks array in footer-social.tsx
3. Update href to your profile URL

### Change Logo
Replace lines 28-35 in `index.tsx` with your logo component or image.

## Dependencies

- `next` (Next.js framework)
- `react` (React library)
- `lucide-react` (Social media icons)
- `tailwindcss` (Styling)

All dependencies already installed in project.

## Testing URLs

Test these links work correctly:

**Quick Links:**
- / (Home)
- /about (About)
- /stores (Stores)
- /menu (Menu)
- /contact (Contact Us)

**Legal Links:**
- /privacy (Privacy Policy)
- /returns (Return Policy)
- /delivery-terms (Delivery Terms)
- /terms (Terms & Conditions)

**Social Media:**
- Update URLs in footer-social.tsx to your actual profiles

## Accessibility Checklist

- [x] Semantic `<footer>` element
- [x] Proper heading hierarchy (h3)
- [x] ARIA labels on social icons
- [x] Keyboard navigable links
- [x] High contrast colors (WCAG AA compliant)
- [x] Focus visible states
- [x] External links use `rel="noopener noreferrer"`
- [x] Clickable phone/email links
- [x] Logical tab order

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Chrome Mobile 90+

## Performance Metrics

- Server-side rendered (zero client JS)
- No runtime overhead
- Lazy-loaded icons (tree-shaken)
- Static HTML generation
- Minimal CSS footprint

## Next Steps

1. Add footer to your layout file
2. Update contact information with real data
3. Update social media URLs
4. Create legal pages (privacy, terms, etc.)
5. Test all links navigate correctly
6. Verify responsive design on mobile/tablet
7. Run accessibility audit

## Support

For questions or issues:
- Check `implementation.md` for detailed documentation
- Review TypeScript types in component files
- Verify Tailwind CSS configuration
- Ensure Next.js 16+ and React 19 are installed
