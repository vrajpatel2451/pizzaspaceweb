# Order History Components

This directory contains components for the Order History page (`/order`).

## Components

### OrderFilters

A client component that provides filtering controls for the order history list.

**Location**: `components/order/history/order-filters.tsx`

**Type**: Client Component (`"use client"`)

#### Features

- **Time Range Filter**: Dropdown to filter orders by time period
- **Status Filter**: Dropdown to filter orders by status
- **Active Filter Indicator**: Badge showing count of active filters
- **Clear Filters**: Button to reset all filters to default
- **Total Orders Display**: Optional display of total order count
- **URL State Management**: All filters stored in URL for shareability
- **Responsive Design**: Mobile-friendly layout

#### Props

```typescript
interface OrderFiltersProps {
  totalOrders?: number; // Optional: Total count of orders
  className?: string;   // Optional: Additional CSS classes
}
```

#### Usage

```tsx
import { OrderFilters } from "@/components/order/history/order-filters";

export default function OrderHistoryPage() {
  return (
    <div className="container">
      <OrderFilters totalOrders={42} className="mb-6" />
      {/* Order list */}
    </div>
  );
}
```

#### Time Range Options

| Value | Label | Description |
|-------|-------|-------------|
| `all` | All Time | No time filter (default) |
| `last7days` | Last 7 Days | Orders from past 7 days |
| `last30days` | Last 30 Days | Orders from past 30 days |
| `last90days` | Last 90 Days | Orders from past 90 days |
| `lastyear` | Last Year | Orders from past year |

#### Status Options

| Value | Label | Description |
|-------|-------|-------------|
| `all` | All Statuses | No status filter (default) |
| `payment_confirmed` | Confirmed | Payment confirmed |
| `preparing` | Preparing | Order is being prepared |
| `on_the_way` | On the Way | Out for delivery |
| `delivered` | Delivered | Successfully delivered |
| `cancelled` | Cancelled | Order cancelled |
| `payment_error` | Payment Error | Payment failed |

#### URL Parameters

The component manages the following URL search parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `timerange` | TimeRange | Selected time range | `last7days` |
| `startTime` | ISO Date String | Calculated start time | `2025-11-25T00:00:00.000Z` |
| `endTime` | ISO Date String | Calculated end time | `2025-12-02T00:00:00.000Z` |
| `status` | OrderStatus | Selected status | `preparing` |
| `page` | number | Current page (reset on filter change) | `1` |

#### URL Examples

**No filters:**
```
/order
```

**Time range filter:**
```
/order?timerange=last7days&startTime=2025-11-25T00:00:00.000Z&endTime=2025-12-02T00:00:00.000Z
```

**Status filter:**
```
/order?status=preparing
```

**Both filters:**
```
/order?timerange=last30days&startTime=2025-11-02T00:00:00.000Z&endTime=2025-12-02T00:00:00.000Z&status=delivered
```

**With pagination:**
```
/order?timerange=last30days&status=delivered&page=2&limit=12
```

#### Time Range Calculation

The component uses `date-fns` to calculate date ranges:

```typescript
import { subDays, subYears } from "date-fns";

const now = new Date();

// Last 7 Days
const last7Days = {
  startTime: subDays(now, 7).toISOString(),
  endTime: now.toISOString(),
};

// Last 30 Days
const last30Days = {
  startTime: subDays(now, 30).toISOString(),
  endTime: now.toISOString(),
};

// Last Year
const lastYear = {
  startTime: subYears(now, 1).toISOString(),
  endTime: now.toISOString(),
};
```

#### Integration with Server Component

```tsx
// app/(protected)/order/page.tsx
import { OrderFilters } from "@/components/order/history/order-filters";
import { getOrders } from "@/lib/api/order";
import { TimeRange, OrderStatus } from "@/types/order";

interface OrderHistoryPageProps {
  searchParams: Promise<{
    timerange?: TimeRange;
    startTime?: string;
    endTime?: string;
    status?: OrderStatus;
    page?: string;
    limit?: string;
  }>;
}

export default async function OrderHistoryPage({
  searchParams,
}: OrderHistoryPageProps) {
  const params = await searchParams;

  // Parse params
  const timerange = params.timerange || "all";
  const status = params.status;
  const page = parseInt(params.page || "1");
  const limit = parseInt(params.limit || "12");

  // Fetch orders
  const response = await getOrders({
    page,
    limit,
    startTime: params.startTime,
    endTime: params.endTime,
    status,
  });

  if (!response.data) {
    throw new Error(response.errorMessage || "Failed to load orders");
  }

  const { data: orders, pagination } = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters */}
      <OrderFilters totalOrders={pagination.total} className="mb-6" />

      {/* Orders grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {orders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {/* Pagination */}
      <OrderPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        className="mt-6"
      />
    </div>
  );
}
```

#### Responsive Behavior

**Mobile (< 640px):**
- Filters stack vertically
- Full width selects
- Filter icon hidden
- Clear button full width

**Tablet (640px - 1024px):**
- Filters in horizontal row
- Fixed width selects (180px)
- Filter icon visible
- Active filter badge visible

**Desktop (> 1024px):**
- Filters justify space between
- Clear button and order count on right
- Full layout visible

#### Accessibility

- Semantic HTML with proper labels
- Keyboard navigation support
- ARIA attributes for screen readers
- Focus indicators on interactive elements
- Color contrast compliant

#### Dependencies

- `next/navigation` - useRouter, useSearchParams
- `@/components/ui/select` - shadcn Select component
- `@/components/ui/button` - shadcn Button component
- `@/components/ui/badge` - shadcn Badge component
- `@/types/order` - OrderStatus, TimeRange types
- `date-fns` - Date manipulation (subDays, subYears)
- `lucide-react` - Icons (X, Filter)

#### Styling

The component uses Tailwind CSS with the following breakpoints:
- `sm:` - 640px and above
- `md:` - 768px and above
- `lg:` - 1024px and above

Custom spacing and layout:
- `gap-4` - 1rem gap between elements
- `gap-3` - 0.75rem gap in filter row
- `mb-6` - 1.5rem margin bottom

#### Future Enhancements

- [ ] Multi-select status filter (chip-based)
- [ ] Date range picker for custom ranges
- [ ] Search by order ID
- [ ] Sort options (newest, oldest, price)
- [ ] Save filter presets
- [ ] Export filtered results

## Testing

### Manual Testing Checklist

- [ ] Select each time range option
- [ ] Verify URL updates correctly
- [ ] Select each status option
- [ ] Verify URL updates correctly
- [ ] Combine time range and status filters
- [ ] Click "Clear Filters" button
- [ ] Verify filters reset to default
- [ ] Check active filter count badge
- [ ] Test on mobile viewport
- [ ] Test on tablet viewport
- [ ] Test on desktop viewport
- [ ] Verify keyboard navigation
- [ ] Test with screen reader

### Edge Cases

- No orders found with filters
- All filters cleared
- Invalid URL parameters
- Missing totalOrders prop
- Network error during filter change

## Performance

- Client-side only component (minimal bundle size)
- No unnecessary re-renders
- Optimized URL updates
- Debounced filter changes (via Next.js router)

## Maintenance

Last updated: December 2, 2025

For issues or feature requests, please refer to the architecture document:
`docs/order/architecture.md`
