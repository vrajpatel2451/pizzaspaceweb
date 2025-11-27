# Stores Section - Integration Guide

## Quick Start

### 1. Import the Component

```tsx
import { StoresSection } from "@/components/home/stores-section";
```

### 2. Add to Your Page

```tsx
export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      {/* Features Section */}

      <StoresSection />

      {/* Footer */}
    </main>
  );
}
```

That's it! The component is fully self-contained with data fetching, loading states, and error handling.

## Integration Examples

### Example 1: Home Page

```tsx
// app/page.tsx
import { HeroSection } from "@/components/home/hero-section";
import { MenuSection } from "@/components/home/menu-section";
import { StoresSection } from "@/components/home/stores-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MenuSection />
      <StoresSection />
      <TestimonialsSection />
    </main>
  );
}
```

### Example 2: Locations Page

```tsx
// app/locations/page.tsx
import { StoresSection } from "@/components/home/stores-section";

export default function LocationsPage() {
  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-b from-orange-500 to-orange-600 text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold">Our Locations</h1>
          <p className="mt-6 text-xl text-orange-100 max-w-2xl mx-auto">
            Find a Pizza Space near you. We're serving delicious pizzas
            across multiple locations.
          </p>
        </div>
      </div>

      <StoresSection />

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't find a store nearby?</h2>
          <p className="text-gray-600 mb-8">
            We're constantly expanding. Check back soon for new locations!
          </p>
        </div>
      </section>
    </main>
  );
}
```

### Example 3: With Custom Layout

```tsx
// app/stores/page.tsx
import { StoresSection } from "@/components/home/stores-section";

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900">Store Locations</h1>
          <p className="mt-2 text-gray-600">
            Visit us or order for delivery
          </p>
        </div>
      </header>

      {/* Stores Section */}
      <div className="py-0">
        <StoresSection />
      </div>

      {/* Additional Info */}
      <section className="bg-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Store Information
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🕐</span>
              </div>
              <h3 className="font-semibold mb-2">Operating Hours</h3>
              <p className="text-gray-600 text-sm">
                Open daily from 10 AM to 11 PM
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="font-semibold mb-2">Free Parking</h3>
              <p className="text-gray-600 text-sm">
                Ample parking available at all locations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold mb-2">Order Online</h3>
              <p className="text-gray-600 text-sm">
                Fast delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

## Styling Customization

### Override Section Styles

```tsx
// Create a wrapper with custom styles
export default function HomePage() {
  return (
    <main>
      <div className="bg-gradient-to-b from-slate-50 to-white">
        <StoresSection />
      </div>
    </main>
  );
}
```

### Custom Container Width

The component uses `container mx-auto px-4` internally. To override:

```tsx
// You would need to modify the component or create a variant
// For now, the component uses the default container which is responsive
```

## API Configuration

### Change Number of Stores

Edit `/components/home/stores-section/index.tsx`:

```tsx
// Show 9 stores instead of 6
const response = await getStores({ isActive: true, limit: 9 });
```

### Filter by Location

```tsx
// Near a specific location
const response = await getStores({
  isActive: true,
  limit: 6,
  lat: 37.7749,  // San Francisco
  long: -122.4194
});
```

### Add Search Filter

```tsx
// Search for stores
const response = await getStores({
  isActive: true,
  limit: 6,
  search: "downtown"
});
```

## Loading States

The component handles loading automatically with Suspense:

```tsx
<Suspense fallback={<StoresSkeleton />}>
  <StoresContent />
</Suspense>
```

### Custom Loading UI

To customize the loading state, modify `stores-skeleton.tsx` or create a custom skeleton:

```tsx
import { StoresSection } from "@/components/home/stores-section";
import { MyCustomSkeleton } from "./my-custom-skeleton";

export default function Page() {
  return (
    <Suspense fallback={<MyCustomSkeleton />}>
      <StoresSection />
    </Suspense>
  );
}
```

## Error Handling

The component includes built-in error handling:

### API Errors
Displays user-friendly message when API fails:
```
"Unable to load stores at the moment. Please try again later."
```

### Empty States
Shows helpful message when no stores found:
```
"No stores available at the moment. Check back soon for locations near you."
```

### Custom Error Handling

To add custom error handling, wrap the component:

```tsx
import { ErrorBoundary } from "react-error-boundary";
import { StoresSection } from "@/components/home/stores-section";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-red-600">Oops!</h2>
      <p className="mt-4 text-gray-600">Something went wrong.</p>
    </div>
  );
}

export default function Page() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <StoresSection />
    </ErrorBoundary>
  );
}
```

## Accessibility

The component is built with accessibility in mind:

- Semantic HTML structure
- Proper heading hierarchy
- Accessible links with `rel="noopener noreferrer"`
- Color contrast meets WCAG AA
- Keyboard navigable
- Screen reader friendly

### Enhance Accessibility

Add skip links for better navigation:

```tsx
export default function Page() {
  return (
    <main>
      <a
        href="#stores"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4"
      >
        Skip to store locations
      </a>

      <div id="stores">
        <StoresSection />
      </div>
    </main>
  );
}
```

## SEO Considerations

### Page Metadata

```tsx
// app/locations/page.tsx
import { Metadata } from "next";
import { StoresSection } from "@/components/home/stores-section";

export const metadata: Metadata = {
  title: "Store Locations | Pizza Space",
  description: "Find a Pizza Space location near you. Visit us for dine-in or order online for delivery.",
  openGraph: {
    title: "Store Locations | Pizza Space",
    description: "Find a Pizza Space location near you.",
    type: "website",
  },
};

export default function LocationsPage() {
  return <StoresSection />;
}
```

### Structured Data

Add JSON-LD for local business:

```tsx
export default function LocationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            "name": "Pizza Space",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "City",
              "addressRegion": "State",
            },
          }),
        }}
      />
      <StoresSection />
    </>
  );
}
```

## Performance Tips

### Prefetch Data

```tsx
// app/locations/page.tsx
import { getStores } from "@/lib/api";

// Prefetch stores data
export async function generateMetadata() {
  await getStores({ isActive: true, limit: 6 });
  return {
    title: "Store Locations",
  };
}

export default function LocationsPage() {
  return <StoresSection />;
}
```

### Static Generation

For better performance, generate the page statically:

```tsx
// app/locations/page.tsx
export const revalidate = 3600; // Revalidate every hour

export default function LocationsPage() {
  return <StoresSection />;
}
```

## Testing

### Unit Test Example

```tsx
// __tests__/stores-section.test.tsx
import { render, screen } from "@testing-library/react";
import { StoresGrid } from "@/components/home/stores-section/stores-grid";
import { StoreResponse } from "@/types";

const mockStores: StoreResponse[] = [
  {
    _id: "1",
    name: "Downtown Pizza Space",
    phone: "+1234567890",
    lat: 37.7749,
    long: -122.4194,
    line1: "123 Main St",
    line2: "",
    area: "Downtown",
    city: "San Francisco",
    // ... other fields
  },
];

describe("StoresGrid", () => {
  it("renders store cards", () => {
    render(<StoresGrid stores={mockStores} />);
    expect(screen.getByText("Downtown Pizza Space")).toBeInTheDocument();
  });

  it("shows empty state when no stores", () => {
    render(<StoresGrid stores={[]} />);
    expect(screen.getByText(/No stores available/i)).toBeInTheDocument();
  });
});
```

### E2E Test Example

```typescript
// e2e/stores.spec.ts
import { test, expect } from "@playwright/test";

test("displays store locations", async ({ page }) => {
  await page.goto("/");

  // Wait for stores section
  await expect(page.getByText("Find Your Nearest Store")).toBeVisible();

  // Check store cards are visible
  await expect(page.getByRole("link", { name: /Get Directions/i })).toHaveCount(6);
});

test("opens Google Maps on directions click", async ({ page, context }) => {
  await page.goto("/");

  // Listen for new page
  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    page.getByRole("link", { name: /Get Directions/i }).first().click(),
  ]);

  // Verify Google Maps URL
  expect(newPage.url()).toContain("google.com/maps");
});
```

## Troubleshooting

### Issue: No stores displayed

**Solution:** Check API configuration and ensure stores are marked as active in the database.

### Issue: Loading state never resolves

**Solution:** Check network connectivity and API endpoint availability.

### Issue: TypeScript errors

**Solution:** Ensure `@/types` is properly configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Styles not applying

**Solution:** Verify Tailwind CSS is configured and the component classes are not purged.

## Migration Guide

### From Static Data to API

If you have a static version, migration is simple:

**Before:**
```tsx
const stores = [
  { name: "Store 1", address: "123 Main St" },
  // ...
];

<StoresGrid stores={stores} />
```

**After:**
```tsx
import { StoresSection } from "@/components/home/stores-section";

<StoresSection />
```

## Support

For issues or questions:
1. Check the [README.md](./README.md) for component documentation
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
3. Inspect the demo at `/stores-demo`
