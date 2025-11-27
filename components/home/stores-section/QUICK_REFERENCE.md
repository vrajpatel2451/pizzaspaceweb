# Stores Section - Quick Reference Card

## 1-Minute Integration

```tsx
import { StoresSection } from "@/components/home/stores-section";

export default function Page() {
  return <StoresSection />;
}
```

## Files Overview

| File | Purpose | Type | Exports |
|------|---------|------|---------|
| `index.tsx` | Main section, data fetching | Server | `StoresSection` |
| `stores-grid.tsx` | Grid layout, empty states | Server | `StoresGrid` |
| `store-card.tsx` | Individual store display | Server | `StoreCard` |
| `stores-skeleton.tsx` | Loading UI | Server | `StoresSkeleton` |

## Component Props

```typescript
// StoresSection
// No props - fully self-contained

// StoresGrid
interface StoresGridProps {
  stores: StoreResponse[];
}

// StoreCard
interface StoreCardProps {
  store: StoreResponse;
}

// StoresSkeleton
// No props - static UI
```

## API Integration

```typescript
// Fetches data
getStores({ isActive: true, limit: 6 })

// Returns
{
  data: {
    data: StoreResponse[]
  }
}
```

## Key Imports

```typescript
// Types
import { StoreResponse } from "@/types";

// API
import { getStores } from "@/lib/api";

// UI Components
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Icons
import { MapPin, Phone, Clock, Building } from "lucide-react";
```

## Design Tokens

| Element | Style |
|---------|-------|
| Section Background | `bg-slate-50` |
| Card Background | `bg-white` |
| Primary Color | `bg-orange-500` |
| Shadow | `shadow-md` → `shadow-lg` (hover) |
| Rounded | `rounded-xl` |
| Gap | `gap-6` |

## Grid Breakpoints

| Screen | Columns | Class |
|--------|---------|-------|
| Mobile | 1 | `grid-cols-1` |
| Tablet | 2 | `md:grid-cols-2` |
| Desktop | 3 | `lg:grid-cols-3` |

## Common Customizations

### Change store count
```typescript
// index.tsx, line 22
const response = await getStores({ isActive: true, limit: 12 });
```

### Modify grid layout
```typescript
// stores-grid.tsx, line 16
className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
```

### Update hours
```typescript
// store-card.tsx, line 41
<span>Mon-Sun: 11AM - 10PM</span>
```

## States Handled

| State | Component | UI |
|-------|-----------|-----|
| Loading | StoresSkeleton | Animated pulse |
| Success | StoresGrid | Store cards |
| Empty | StoresGrid | "No stores available" |
| Error | ErrorMessage | "Unable to load stores" |

## Features Checklist

- [x] Server-side data fetching
- [x] Suspense streaming
- [x] Error handling
- [x] Empty states
- [x] Loading states
- [x] Responsive grid
- [x] Google Maps integration
- [x] Clickable phone numbers
- [x] TypeScript strict mode
- [x] Accessible markup
- [x] SEO friendly
- [x] Zero client JS

## File Paths

```
/components/home/stores-section/
├── index.tsx              # Main section
├── stores-grid.tsx        # Grid container
├── store-card.tsx         # Store card
└── stores-skeleton.tsx    # Loading UI

/app/stores-demo/page.tsx  # Demo page

Docs:
├── README.md              # Full documentation
├── ARCHITECTURE.md        # Technical details
├── INTEGRATION.md         # Integration guide
└── QUICK_REFERENCE.md     # This file
```

## Demo

```bash
npm run dev
# Visit http://localhost:3000/stores-demo
```

## Testing

```bash
# TypeScript check
npx tsc --noEmit

# Lint check
npx eslint components/home/stores-section/*.tsx

# Build test
npm run build
```

## Dependencies

```json
{
  "react": "^19.x",
  "next": "^16.x",
  "lucide-react": "latest",
  "@radix-ui/react-slot": "latest"
}
```

## Performance

| Metric | Value |
|--------|-------|
| Client JS | 0 KB |
| HTML | ~15 KB (6 stores) |
| First Paint | Immediate (skeleton) |
| Data Load | Streaming |
| TTI | Immediate |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No stores shown | Check API active stores |
| TypeScript errors | Verify `@/*` path alias |
| Styles not applying | Check Tailwind config |
| Loading forever | Check API endpoint |

## Related Commands

```bash
# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

## Next.js Features Used

- ✅ App Router
- ✅ Server Components
- ✅ Suspense Streaming
- ✅ TypeScript
- ✅ Async/Await
- ✅ Error Boundaries (try/catch)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS/Android)

## Accessibility

- ✅ Semantic HTML
- ✅ ARIA attributes where needed
- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ Color contrast WCAG AA
- ✅ Focus indicators

## Questions?

1. Check README.md for details
2. View ARCHITECTURE.md for technical info
3. See INTEGRATION.md for examples
4. Visit /stores-demo for live demo
