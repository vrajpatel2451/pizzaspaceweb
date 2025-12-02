# Order Feature Requirements & Component Analysis

**Project**: Pizza Space - Next.js 16 Pizza Delivery Application
**Feature**: Order Management System
**Date**: December 2, 2025
**Version**: 1.0

---

## Table of Contents

1. [Feature Overview](#feature-overview)
2. [Screen Breakdown](#screen-breakdown)
3. [Component-to-Data Field Mapping](#component-to-data-field-mapping)
4. [Filter State Management](#filter-state-management)
5. [Data Flow Patterns](#data-flow-patterns)
6. [Action Handlers](#action-handlers)
7. [Props Interfaces](#props-interfaces)
8. [Accessibility Requirements](#accessibility-requirements)
9. [Implementation Notes](#implementation-notes)

---

## Feature Overview

The Order Management System consists of four primary screens that allow users to:
- View order history with filtering and pagination
- View detailed order information with status tracking
- Confirm successful order placement
- Handle order errors and failures

All screens must follow the established design guidelines from the menu page and maintain consistency with the cart summary component.

---

## Screen Breakdown

### 1. Order History Screen (`/order`)

**Purpose**: Display paginated list of user orders with filtering capabilities

**Key Requirements**:
- Protected route (authentication required)
- Grid layout for order cards (responsive)
- Time range filter (relative dropdown)
- Status filter (multi-select interactive UI)
- Pagination controls
- Page heading matching menu design guidelines
- Header navigation link update

**Design Reference**: `/spec/order/order_card.png` (content reference only)

### 2. Order Details Screen (`/order/[orderId]`)

**Purpose**: Display comprehensive order information with status tracking and actions

**Key Requirements**:
- Page heading matching menu design guidelines
- Status bar/stepper showing order progress
- Action buttons: "Rate Order" and "Have Problem"
- Order items with full details
- Order summary (reuse cart summary component)
- Order information section
- Store details section
- Delivery rider details (conditional)

**Design Reference**: `/spec/order/order_details.png` (content reference only)

### 3. Order Success Screen (`/order/[orderId]/success`)

**Purpose**: Confirm successful order placement immediately after checkout

**Key Requirements**:
- Success heading with green accent
- Order items display
- Order summary (reuse cart summary component)
- Action buttons: "View Details" and "Order More"

**Design Reference**: `/spec/order/order_success.png` (content reference only)

### 4. Order Failure Screen (`/order/[orderId]/error`)

**Purpose**: Display order failure information and provide recovery options

**Key Requirements**:
- Error heading with red accent
- Order items display
- Order summary (reuse cart summary component)
- Action buttons: "View Details", "Contact Support", and "Order More"

**Design Reference**: `/spec/order/order_failure.png` (content reference only)

---

## Component-to-Data Field Mapping

### 1. Order Card Component (History Screen)

**Component**: `OrderCard`
**Used In**: Order History Screen (grid layout)

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Order ID | `OrderResponse._id` | `string` | Display truncated with ellipsis |
| Order Date | `OrderResponse.createdDate` | `string` | Format: "Nov 23, 2025, 6:32 PM" |
| Total Amount | `OrderResponse.billing.customerTotal.total` | `number` | Format: "$52.11" with currency symbol |
| Items Count | `OrderResponse.items.length` | `number` | Display: "1 items" or "X items" |
| Status Badge | `OrderResponse.status` | `OrderStatus` | Color-coded badge |
| Store Name | `OrderResponse.seller.info.name` | `string` | Below status badge |
| Card Menu | N/A | N/A | Three-dot menu for actions |
| Menu Actions | N/A | N/A | "View Details", "Review Order", "Have a Problem" |

**Status Badge Color Mapping**:
- `initiated`: Yellow/Warning
- `payment_confirmed`: Green/Success
- `payment_error`: Red/Error
- `cancelled`: Gray/Neutral
- `preparing`: Orange/Info
- `ready_to_pickup`: Blue/Info
- `on_the_way`: Blue/Info
- `delivered`: Green/Success

### 2. Order Details - Header Section

**Component**: `OrderDetailsHeader`

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Order ID | `OrderResponse._id` | `string` | Display: "Order #6921D7CD" |
| Placement Date | `OrderResponse.createdDate` | `string` | Format: "Placed on 22 Nov 2025 (Sat) - 09:03 PM" |
| Rate Order Button | N/A | Action | Visible after delivery |
| Have Problem Button | N/A | Action | Always visible |
| Back to Orders Link | N/A | Navigation | Navigate to `/order` |

### 3. Order Status Stepper

**Component**: `OrderStatusStepper`

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Current Status | `OrderResponse.status` | `OrderStatus` | Highlight active step |
| Status List | `OrderResponse.statusList` | `OrderStatusAndTimeResponse[]` | All status transitions |
| Step Time | `OrderStatusAndTimeResponse.createdAt` | `string` | Format: "09:54 PM" |
| Step Label | `OrderStatusAndTimeResponse.status` | `OrderStatus` | Map to human-readable label |

**Status Flow**:
1. Confirmed (payment_confirmed)
2. Preparing
3. On the Way (on_the_way)
4. Delivered

**Conditional Steps**:
- Ready to Pickup (show for pickup orders only)
- Payment Error (show instead of flow)
- Cancelled (show instead of flow)

### 4. Order Items Section

**Component**: `OrderItemsList`

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Section Title | N/A | Static | "Order Items (X)" where X = items.length |
| Item Name | `OrderItemResponse.name` | `string` | Product name |
| Variant | `OrderItemResponse.variants` | `string[]` | Format: "variant0: Medium" |
| Addons | `OrderItemResponse.addons` | `AddonItem[]` | Format: "Add-ons: test, test222" |
| Quantity | `OrderItemResponse.quantity` | `number` | Format: "Quantity: 1" |
| Price | `OrderItemResponse.price` | `number` | Original price |
| Discounted Price | `OrderItemResponse.priceAfterDiscount` | `number` | Final price with discount |
| Savings | `price - priceAfterDiscount` | `number` | Format: "Save £3.00" in green |
| Item Status | `OrderItemResponse.itemStatus` | `OrderItemStatus` | "ordered", "cancelled", "returned" |
| Refund Badge | `OrderItemResponse.isRefunded` | `boolean` | Show "Refund" badge if true |

**Single Order Item Card**:
```
Pijo
variant0: Medium
Add-ons: test, test222

Quantity: 1                          £30.00  £27.00
                                     Save £3.00
                                     [Refund]
```

### 5. Order Summary Section

**Component**: Reuse `OrderSummary` from `/components/cart/order-summary.tsx`

**Props Mapping**:
```typescript
summary={order.billing.customerTotal}
showPaymentMethod={false}  // Hide payment selection
onCheckout={undefined}     // No checkout action needed
```

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Item Total | `billing.customerTotal.itemTotal` | `number` | Original amount |
| Item Total (Discounted) | `billing.customerTotal.itemTotalAfterDiscount` | `number` | After discount |
| Packing Charges | `billing.customerTotal.packingCharges` | `number` | Original |
| Packing (Discounted) | `billing.customerTotal.packingChargesAfterDiscount` | `number` | After discount |
| Delivery Fee | `billing.customerTotal.deliveryCharges` | `number` | Original |
| Delivery (Discounted) | `billing.customerTotal.deliveryChargesAfterDiscount` | `number` | After discount |
| Platform Fee | `billing.customerTotal.extraCharges.platformFee` | `[number, number]` | [original, final] |
| Handling Charges | `billing.customerTotal.extraCharges.handlingCharges` | `[number, number]` | [original, final] |
| Tax | `billing.customerTotal.tax.total` | `number` | Total tax |
| Tax Breakdown | `billing.customerTotal.tax` | Object | Detailed breakdown |
| Total Savings | `billing.customerTotal.totalDiscount` | `number` | Green banner |
| Grand Total | `billing.customerTotal.total` | `number` | Final amount |

### 6. Order Information Section

**Component**: `OrderInformation`

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Section Title | N/A | Static | "Order Information" with clock icon |
| Status | `OrderResponse.status` | `OrderStatus` | Badge with color |
| Payment Method | `OrderResponse.payment.method` | `PaymentType` | "Online Payment" or "Cash on Delivery" |
| Payment Method Icon | `payment.method` | Icon | CreditCard or Banknote |
| Payment Reference ID | `OrderResponse.payment.refId` | `string` | Full Stripe URL or ref ID |

### 7. Store Details Section

**Component**: `StoreDetails`

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Section Title | N/A | Static | "Store Details" with map pin icon |
| Store Name | `OrderResponse.seller.info.name` | `string` | From StoreResponse |
| Phone | `OrderResponse.seller.info.phone` | `string` | Clickable tel: link |
| Address | `OrderResponse.seller.info.address` | `string` | Full address |
| Email | `OrderResponse.seller.info.email` | `string` | Clickable mailto: link |

**StoreResponse Fields Available**:
```typescript
_id: string
name: string
phone: string
address: string
email: string
// ... other fields from StoreResponse type
```

### 8. Delivery Rider Details Section

**Component**: `DeliveryRiderDetails`
**Conditional**: Only show if `OrderResponse.rider.info` exists

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Section Title | N/A | Static | "Delivery Rider Details" with bike icon |
| Rider Name | `OrderResponse.rider.info.name` | `string` | From StaffResponse |
| Email | `OrderResponse.rider.info.email` | `string` | Clickable mailto: link |

**StaffResponse Fields Available**:
```typescript
_id: string
name: string
email: string
role: string
isActive: boolean
// ... other fields
```

### 9. Success/Error Screen Components

**Success Screen** (`/order/[orderId]/success`):

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Success Icon | N/A | Icon | CheckCircle in green |
| Heading | N/A | Static | "Order Placed Successfully!" with party emoji |
| Message | N/A | Static | "Thank you for your order! Your delicious food is being prepared." |
| Order ID | `OrderResponse._id` | `string` | Format: "Order ID: #692305d9" |
| Order Items | Same as details screen | | Reuse OrderItemsList |
| Order Summary | Same as details screen | | Reuse OrderSummary |
| View Details Button | N/A | Action | Navigate to `/order/[orderId]` |
| Order More Button | N/A | Action | Navigate to `/menu` |

**Error Screen** (`/order/[orderId]/error`):

| UI Element | Data Source | Type | Notes |
|------------|-------------|------|-------|
| Error Icon | N/A | Icon | XCircle in red |
| Heading | N/A | Static | "Order Error" |
| Message | N/A | Static | "There was an issue with your order. Please contact support for assistance." |
| Order ID | `OrderResponse._id` | `string` | Format: "Order ID: #692305d9" |
| Order Items | Same as details screen | | Reuse OrderItemsList |
| Order Summary | Same as details screen | | Reuse OrderSummary |
| Contact Support Button | N/A | Action | Primary action |
| Order More Button | N/A | Action | Secondary action |
| View Details Button | N/A | Action | Optional - if order exists |
| Help Section | N/A | Info | Blue info box with support message |

---

## Filter State Management

### URL Search Params Structure

**Route**: `/order?timerange=last7days&status=preparing,delivered&page=2&limit=12`

```typescript
interface OrderFiltersState {
  timerange?: TimeRange;
  status?: OrderStatus[]; // Multi-select
  page?: number;
  limit?: number;
}
```

### Time Range Filter

**UI Component**: Dropdown/Select (single selection)

**Type Definition**:
```typescript
type TimeRange =
  | "all"
  | "last7days"
  | "last30days"
  | "last90days"
  | "last3months"
  | "lastyear";
```

**Dropdown Options**:
```typescript
const timeRangeOptions = [
  { value: "all", label: "All Time" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "last90days", label: "Last 90 Days" },
  { value: "last3months", label: "Last 3 Months" },
  { value: "lastyear", label: "Last Year" },
];
```

**API Param Mapping** (convert TimeRange to startTime/endTime):
```typescript
function getDateRangeFromTimeRange(range: TimeRange) {
  const now = new Date();
  const endTime = now.toISOString();

  if (range === "all") {
    return { startTime: undefined, endTime: undefined };
  }

  const startDate = new Date(now);
  switch (range) {
    case "last7days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "last30days":
      startDate.setDate(now.getDate() - 30);
      break;
    case "last90days":
      startDate.setDate(now.getDate() - 90);
      break;
    case "last3months":
      startDate.setMonth(now.getMonth() - 3);
      break;
    case "lastyear":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

  return {
    startTime: startDate.toISOString(),
    endTime,
  };
}
```

### Status Filter

**UI Component**: Multi-select (checkboxes or tag-based selection)

**Type Definition**:
```typescript
type OrderStatus =
  | "initiated"
  | "payment_confirmed"
  | "payment_error"
  | "cancelled"
  | "preparing"
  | "ready_to_pickup"
  | "on_the_way"
  | "delivered";
```

**Filter Options**:
```typescript
const statusFilterOptions = [
  { value: "initiated", label: "Initiated", color: "yellow" },
  { value: "payment_confirmed", label: "Payment Confirmed", color: "green" },
  { value: "payment_error", label: "Payment Error", color: "red" },
  { value: "cancelled", label: "Cancelled", color: "gray" },
  { value: "preparing", label: "Preparing", color: "orange" },
  { value: "ready_to_pickup", label: "Ready to Pickup", color: "blue" },
  { value: "on_the_way", label: "On the Way", color: "blue" },
  { value: "delivered", label: "Delivered", color: "green" },
];
```

**URL Encoding**:
- Selected: `?status=preparing,delivered,on_the_way`
- None selected: No status param (show all)
- Single selected: `?status=preparing`

**API Param Handling**:
```typescript
// Note: Backend API accepts single status, not array
// Frontend needs to handle this:

// Option 1: Make multiple API calls and merge results (not recommended)
// Option 2: Modify backend to accept comma-separated statuses
// Option 3: Filter client-side after fetching all (use status param for primary filter only)

// Recommended: Use status filter as single-select OR make multiple calls
// For MVP: Use as single-select dropdown instead of multi-select
```

### Pagination State

**UI Component**: Pagination controls (Previous/Next buttons, page numbers)

**State**:
```typescript
interface PaginationState {
  page: number;     // Current page (1-indexed)
  limit: number;    // Items per page (default: 12)
  total: number;    // Total items (from API response)
  totalPages: number; // Calculated: Math.ceil(total / limit)
}
```

**URL Params**:
- Current page: `?page=2`
- Default page: No param or `?page=1`
- Items per page: `?limit=12` (can be omitted if using default)

**API Response**:
```typescript
// From PaginatedResponse<OrderResponse>
{
  data: OrderResponse[],
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Filter State Synchronization

**URL as Source of Truth**:
```typescript
// Read from URL search params
const searchParams = useSearchParams();
const filters = {
  timerange: searchParams.get('timerange') as TimeRange || 'all',
  status: searchParams.get('status')?.split(',') as OrderStatus[] || [],
  page: parseInt(searchParams.get('page') || '1'),
  limit: parseInt(searchParams.get('limit') || '12'),
};

// Update URL on filter change
const updateFilters = (newFilters: Partial<OrderFiltersState>) => {
  const params = new URLSearchParams(searchParams);

  if (newFilters.timerange) {
    params.set('timerange', newFilters.timerange);
  }

  if (newFilters.status && newFilters.status.length > 0) {
    params.set('status', newFilters.status.join(','));
  } else {
    params.delete('status');
  }

  if (newFilters.page && newFilters.page > 1) {
    params.set('page', newFilters.page.toString());
  } else {
    params.delete('page');
  }

  // Reset to page 1 when filters change (except page itself)
  if ('timerange' in newFilters || 'status' in newFilters) {
    params.delete('page');
  }

  router.push(`/order?${params.toString()}`);
};
```

---

## Data Flow Patterns

### 1. Server-Side Data Fetching (Order History)

**Pattern**: Server Component with parallel data fetching

```typescript
// app/order/page.tsx (Server Component)

export default async function OrderHistoryPage({ searchParams }) {
  const params = await searchParams;

  // Parse filters from URL
  const timerange = params.timerange || 'all';
  const statusParam = params.status;
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '12');

  // Convert timerange to API params
  const { startTime, endTime } = getDateRangeFromTimeRange(timerange);

  // Fetch orders
  const ordersResult = await getOrders({
    page,
    limit,
    startTime,
    endTime,
    status: statusParam, // Single status for now
    sortBy: 'updatedDate',
    sortOrder: 'desc',
  });

  if (ordersResult.statusCode !== 200) {
    throw new Error('Failed to load orders');
  }

  const orders = ordersResult.data.data;
  const pagination = ordersResult.data.meta;

  return (
    <>
      {/* Server-rendered header */}
      <OrderPageHeader />

      {/* Client component for filters and interactivity */}
      <OrderHistoryClient
        orders={orders}
        pagination={pagination}
        initialFilters={{ timerange, status: statusParam, page, limit }}
      />
    </>
  );
}
```

### 2. Server-Side Data Fetching (Order Details)

```typescript
// app/order/[orderId]/page.tsx (Server Component)

export default async function OrderDetailsPage({ params }) {
  const { orderId } = await params;

  // Fetch order details
  const orderResult = await getOrderDetails(orderId);

  if (orderResult.statusCode !== 200) {
    throw new Error('Failed to load order details');
  }

  const order = orderResult.data;

  return (
    <>
      {/* Server-rendered order details */}
      <OrderDetailsHeader order={order} />
      <OrderStatusStepper order={order} />
      <OrderItemsList items={order.items} />
      <OrderSummary summary={order.billing.customerTotal} showPaymentMethod={false} />
      <OrderInformation order={order} />
      <StoreDetails store={order.seller.info} />
      {order.rider?.info && <DeliveryRiderDetails rider={order.rider.info} />}

      {/* Client components for interactive actions */}
      <OrderActions orderId={order._id} status={order.status} />
    </>
  );
}
```

### 3. Client-Side Interactivity

**Pattern**: Client Components for filters, actions, and state management

```typescript
// components/order/order-history-client.tsx
'use client';

export function OrderHistoryClient({ orders, pagination, initialFilters }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filter handlers
  const handleTimeRangeChange = (timerange: TimeRange) => {
    const params = new URLSearchParams(searchParams);
    params.set('timerange', timerange);
    params.delete('page'); // Reset to page 1
    router.push(`/order?${params.toString()}`);
  };

  const handleStatusChange = (status: OrderStatus) => {
    const params = new URLSearchParams(searchParams);
    params.set('status', status);
    params.delete('page'); // Reset to page 1
    router.push(`/order?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`/order?${params.toString()}`);
  };

  return (
    <div>
      {/* Filters */}
      <OrderFilters
        timerange={initialFilters.timerange}
        status={initialFilters.status}
        onTimeRangeChange={handleTimeRangeChange}
        onStatusChange={handleStatusChange}
      />

      {/* Order Grid */}
      <OrderGrid orders={orders} />

      {/* Pagination */}
      <OrderPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

### 4. Loading States

**Pattern**: Use React Suspense boundaries and loading.tsx

```typescript
// app/order/loading.tsx
export default function OrderHistoryLoading() {
  return (
    <div>
      <OrderFilters.Skeleton />
      <OrderGrid.Skeleton count={12} />
    </div>
  );
}

// app/order/[orderId]/loading.tsx
export default function OrderDetailsLoading() {
  return (
    <div>
      <OrderDetailsHeader.Skeleton />
      <OrderStatusStepper.Skeleton />
      <OrderItemsList.Skeleton />
      <OrderSummary loading={true} />
    </div>
  );
}
```

### 5. Error Boundaries

**Pattern**: Use error.tsx for error handling

```typescript
// app/order/error.tsx
'use client';

export default function OrderError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-2xl font-bold mb-4">Failed to Load Orders</h2>
      <p className="text-muted-foreground mb-6">{error.message}</p>
      <Button onClick={reset}>Try Again</Button>
    </div>
  );
}
```

### 6. Client-Side Actions (Optimistic Updates)

```typescript
// components/order/order-actions.tsx
'use client';

export function OrderActions({ orderId, status }) {
  const [isRating, setIsRating] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleRateOrder = async () => {
    setIsRating(true);
    // Show rating modal/dialog
    // Call rating API
    // Update UI optimistically
  };

  const handleReportProblem = async () => {
    setIsReporting(true);
    // Show problem report modal/dialog
    // Call support API
  };

  return (
    <div className="flex gap-2">
      {status === 'delivered' && (
        <Button onClick={handleRateOrder} disabled={isRating}>
          <Star className="w-4 h-4 mr-2" />
          Rate Order
        </Button>
      )}
      <Button variant="outline" onClick={handleReportProblem} disabled={isReporting}>
        <AlertCircle className="w-4 h-4 mr-2" />
        Have a Problem
      </Button>
    </div>
  );
}
```

---

## Action Handlers

### 1. Rate Order

**Trigger**: Click "Rate Order" button (visible only for delivered orders)
**Component**: `OrderActions`
**Flow**:
1. Open rating modal/dialog
2. Show 5-star rating UI
3. Optional text feedback
4. Submit rating to API
5. Show success toast
6. Optionally hide "Rate Order" button after submission

**API Endpoint**: TBD (not in current spec)
```typescript
POST /api/orders/rate
Body: {
  orderId: string;
  rating: number; // 1-5
  feedback?: string;
}
```

**UI Component Suggestion**: shadcn Dialog + custom star rating component

### 2. Have a Problem / Report Problem

**Trigger**: Click "Have a Problem" button
**Component**: `OrderActions`
**Flow**:
1. Open problem report modal/dialog
2. Show problem categories (dropdown or radio)
3. Text area for description
4. Submit to support API
5. Show success message
6. Optionally navigate to support page or show ticket number

**API Endpoint**: TBD (not in current spec)
```typescript
POST /api/support/create-ticket
Body: {
  orderId: string;
  category: string; // 'wrong_item' | 'late_delivery' | 'quality' | 'other'
  description: string;
}
```

**UI Component Suggestion**: shadcn Dialog + Form components

### 3. View Details

**Trigger**: Click "View Details" button or card
**Action**: Navigation to `/order/[orderId]`
**Implementation**:
```typescript
<Link href={`/order/${order._id}`}>
  <Button>View Details</Button>
</Link>
```

### 4. Order More

**Trigger**: Click "Order More" button (success/error screens)
**Action**: Navigate to menu page
**Implementation**:
```typescript
<Link href="/menu">
  <Button>
    <ShoppingBag className="w-4 h-4 mr-2" />
    Order More
  </Button>
</Link>
```

### 5. Contact Support

**Trigger**: Click "Contact Support" button (error screen)
**Action**: Open support contact options
**Options**:
- Navigate to support page
- Open email client (mailto:)
- Open phone dialer (tel:)
- Open chat widget

**Implementation**:
```typescript
// Option 1: Navigate to support page
<Link href="/support">
  <Button>Contact Support</Button>
</Link>

// Option 2: Direct phone call
<a href="tel:+441234567890">
  <Button>
    <Phone className="w-4 h-4 mr-2" />
    Contact Support
  </Button>
</a>

// Option 3: Email
<a href="mailto:support@pizzaspace.co.uk">
  <Button>Contact Support</Button>
</a>
```

### 6. Back to Orders

**Trigger**: Click "Back to Orders" link
**Action**: Navigate to order history
**Implementation**:
```typescript
<Link href="/order" className="inline-flex items-center gap-2">
  <ArrowLeft className="w-4 h-4" />
  Back to Orders
</Link>
```

### 7. Filter Changes

**Time Range Filter**:
```typescript
const handleTimeRangeChange = (value: TimeRange) => {
  const params = new URLSearchParams(searchParams);
  if (value === 'all') {
    params.delete('timerange');
  } else {
    params.set('timerange', value);
  }
  params.delete('page'); // Reset pagination
  router.push(`/order?${params.toString()}`);
};
```

**Status Filter**:
```typescript
// Single-select (recommended for MVP)
const handleStatusChange = (value: OrderStatus | 'all') => {
  const params = new URLSearchParams(searchParams);
  if (value === 'all') {
    params.delete('status');
  } else {
    params.set('status', value);
  }
  params.delete('page'); // Reset pagination
  router.push(`/order?${params.toString()}`);
};

// Multi-select (future enhancement)
const handleStatusToggle = (value: OrderStatus) => {
  const params = new URLSearchParams(searchParams);
  const current = params.get('status')?.split(',') || [];

  const updated = current.includes(value)
    ? current.filter(s => s !== value)
    : [...current, value];

  if (updated.length === 0) {
    params.delete('status');
  } else {
    params.set('status', updated.join(','));
  }

  params.delete('page');
  router.push(`/order?${params.toString()}`);
};
```

### 8. Pagination

```typescript
const handlePageChange = (page: number) => {
  const params = new URLSearchParams(searchParams);
  params.set('page', page.toString());
  router.push(`/order?${params.toString()}`);
};

const handlePrevious = () => {
  if (currentPage > 1) {
    handlePageChange(currentPage - 1);
  }
};

const handleNext = () => {
  if (currentPage < totalPages) {
    handlePageChange(currentPage + 1);
  }
};
```

---

## Props Interfaces

### 1. OrderCard

```typescript
interface OrderCardProps {
  order: OrderResponse;
  onViewDetails?: (orderId: string) => void;
  onReviewOrder?: (orderId: string) => void;
  onReportProblem?: (orderId: string) => void;
  className?: string;
}
```

### 2. OrderGrid

```typescript
interface OrderGridProps {
  orders: OrderResponse[];
  className?: string;
  emptyMessage?: string;
}

// Skeleton variant
interface OrderGridSkeletonProps {
  count?: number;
  className?: string;
}
```

### 3. OrderFilters

```typescript
interface OrderFiltersProps {
  timerange: TimeRange;
  status?: OrderStatus | OrderStatus[];
  onTimeRangeChange: (timerange: TimeRange) => void;
  onStatusChange: (status: OrderStatus | 'all') => void;
  className?: string;
}

// Skeleton variant
interface OrderFiltersSkeletonProps {
  className?: string;
}
```

### 4. OrderPagination

```typescript
interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}
```

### 5. OrderDetailsHeader

```typescript
interface OrderDetailsHeaderProps {
  order: OrderResponse;
  onRateOrder?: () => void;
  onReportProblem?: () => void;
  showActions?: boolean;
  className?: string;
}
```

### 6. OrderStatusStepper

```typescript
interface OrderStatusStepperProps {
  currentStatus: OrderStatus;
  statusList: OrderStatusAndTimeResponse[];
  deliveryType?: OrderDeliveryType;
  className?: string;
}

// Individual step
interface StatusStep {
  status: OrderStatus;
  label: string;
  icon: React.ComponentType;
  timestamp?: string;
  isActive: boolean;
  isCompleted: boolean;
}
```

### 7. OrderItemsList

```typescript
interface OrderItemsListProps {
  items: OrderItemResponse[];
  showRefundInfo?: boolean;
  className?: string;
}

// Single item
interface OrderItemCardProps {
  item: OrderItemResponse;
  showRefundInfo?: boolean;
  className?: string;
}
```

### 8. OrderInformation

```typescript
interface OrderInformationProps {
  order: OrderResponse;
  className?: string;
}

// Or more specific
interface OrderInformationProps {
  status: OrderStatus;
  paymentMethod: PaymentType;
  paymentRefId: string;
  className?: string;
}
```

### 9. StoreDetails

```typescript
interface StoreDetailsProps {
  store: StoreResponse;
  className?: string;
}

// Or minimal
interface StoreDetailsProps {
  name: string;
  phone: string;
  address: string;
  email: string;
  className?: string;
}
```

### 10. DeliveryRiderDetails

```typescript
interface DeliveryRiderDetailsProps {
  rider: StaffResponse;
  className?: string;
}

// Or minimal
interface DeliveryRiderDetailsProps {
  name: string;
  email: string;
  className?: string;
}
```

### 11. OrderActions

```typescript
interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  onRateOrder?: () => Promise<void>;
  onReportProblem?: () => Promise<void>;
  showRateOrder?: boolean;
  showReportProblem?: boolean;
  className?: string;
}
```

### 12. OrderSuccessScreen

```typescript
interface OrderSuccessScreenProps {
  order: OrderResponse;
  onViewDetails?: () => void;
  onOrderMore?: () => void;
  className?: string;
}
```

### 13. OrderErrorScreen

```typescript
interface OrderErrorScreenProps {
  order: OrderResponse;
  errorMessage?: string;
  onContactSupport?: () => void;
  onViewDetails?: () => void;
  onOrderMore?: () => void;
  className?: string;
}
```

---

## Accessibility Requirements

### WCAG 2.1 Level AA Compliance

#### 1. Keyboard Navigation

**Requirements**:
- All interactive elements must be keyboard accessible
- Logical tab order through filters, cards, and actions
- Focus indicators visible on all focusable elements
- Escape key closes modals/dialogs
- Enter/Space activates buttons

**Implementation**:
```typescript
// Order card with keyboard support
<div
  role="article"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onViewDetails(order._id);
    }
  }}
  aria-label={`Order ${order._id}, ${formatCurrency(order.billing.customerTotal.total)}, ${order.status}`}
>
  {/* Card content */}
</div>
```

#### 2. Screen Reader Support

**Requirements**:
- Semantic HTML elements (article, section, nav)
- ARIA labels for icon-only buttons
- Live regions for status updates
- Meaningful link text (avoid "Click here")

**Implementation**:
```typescript
// Status badge with screen reader text
<span
  className="status-badge"
  role="status"
  aria-label={`Order status: ${getStatusLabel(order.status)}`}
>
  {getStatusLabel(order.status)}
</span>

// Icon-only button
<button
  aria-label="Rate order"
  onClick={onRateOrder}
>
  <Star className="w-4 h-4" />
</button>

// Live region for filter updates
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  Showing {orders.length} orders
</div>
```

#### 3. Color Contrast

**Requirements**:
- Text contrast ratio minimum 4.5:1 (normal text)
- Text contrast ratio minimum 3:1 (large text)
- Status badges must not rely on color alone

**Implementation**:
```typescript
// Status badge with icon + text + color
<Badge variant={getStatusVariant(status)}>
  {getStatusIcon(status)}
  <span>{getStatusLabel(status)}</span>
</Badge>
```

#### 4. Focus Management

**Requirements**:
- Visible focus indicators (outline or ring)
- Focus trapped in modals
- Focus returned to trigger element on modal close
- Skip links for bypassing repetitive content

**Implementation**:
```typescript
// Custom focus styles using Tailwind
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"

// Modal with focus trap (using shadcn Dialog)
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    {/* Content with auto focus management */}
  </DialogContent>
</Dialog>
```

#### 5. Form Accessibility

**Requirements**:
- All form inputs have associated labels
- Error messages announced to screen readers
- Required fields clearly marked
- Validation errors associated with inputs

**Implementation**:
```typescript
// Rating form
<form onSubmit={handleSubmit}>
  <Label htmlFor="rating">Rating</Label>
  <div role="group" aria-label="Rate from 1 to 5 stars">
    {/* Star rating component */}
  </div>

  <Label htmlFor="feedback">Feedback (optional)</Label>
  <Textarea
    id="feedback"
    aria-describedby="feedback-hint"
  />
  <p id="feedback-hint" className="text-sm text-muted-foreground">
    Share your experience with this order
  </p>

  {error && (
    <div role="alert" className="text-destructive">
      {error}
    </div>
  )}
</form>
```

#### 6. Responsive Design

**Requirements**:
- Touch targets minimum 44x44px (mobile)
- No horizontal scrolling at 320px width
- Content reflows without loss of information
- Text can be resized up to 200% without loss of functionality

**Implementation**:
```typescript
// Button with adequate touch target
<Button
  className="min-h-[44px] min-w-[44px]"
  onClick={handleAction}
>
  Action
</Button>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {orders.map(order => <OrderCard key={order._id} order={order} />)}
</div>
```

#### 7. Motion and Animation

**Requirements**:
- Respect prefers-reduced-motion
- No auto-playing animations over 5 seconds
- Provide pause controls for moving content

**Implementation**:
```typescript
// Respect user motion preferences
className="transition-all duration-200 motion-reduce:transition-none"

// In CSS/Tailwind config
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Implementation Notes

### 1. Component Architecture

**Recommended Structure**:
```
app/
  order/
    page.tsx                 # Order history (Server Component)
    loading.tsx              # Loading state
    error.tsx                # Error boundary
    [orderId]/
      page.tsx               # Order details (Server Component)
      loading.tsx
      error.tsx
      success/
        page.tsx             # Success screen
      error/
        page.tsx             # Error screen (avoid conflict with error.tsx)

components/
  order/
    order-card.tsx           # Individual order card
    order-grid.tsx           # Grid layout for cards
    order-filters.tsx        # Filter UI (Client Component)
    order-pagination.tsx     # Pagination controls
    order-details-header.tsx # Order details header
    order-status-stepper.tsx # Status progress stepper
    order-items-list.tsx     # Order items display
    order-information.tsx    # Order info section
    store-details.tsx        # Store details section
    delivery-rider-details.tsx # Rider details section
    order-actions.tsx        # Action buttons (Client Component)
    order-success.tsx        # Success screen content
    order-error.tsx          # Error screen content

lib/
  order/
    utils.ts                 # Order utility functions
    constants.ts             # Order constants (status labels, colors)
```

### 2. Shared Utilities

**Date Formatting**:
```typescript
// lib/order/utils.ts
export function formatOrderDate(dateString: string): string {
  return format(new Date(dateString), "MMM dd, yyyy, h:mm a");
  // Output: "Nov 23, 2025, 6:32 PM"
}

export function formatOrderDateFull(dateString: string): string {
  return format(new Date(dateString), "EEEE, dd MMM yyyy - hh:mm a");
  // Output: "Placed on 22 Nov 2025 (Sat) - 09:03 PM"
}
```

**Currency Formatting**:
```typescript
export function formatCurrency(amount: number, currency = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
  // Output: "£52.11"
}
```

**Status Helpers**:
```typescript
// lib/order/constants.ts
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  initiated: 'Initiated',
  payment_confirmed: 'Payment Confirmed',
  payment_error: 'Payment Error',
  cancelled: 'Cancelled',
  preparing: 'Preparing',
  ready_to_pickup: 'Ready to Pickup',
  on_the_way: 'On the Way',
  delivered: 'Delivered',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  initiated: 'yellow',
  payment_confirmed: 'green',
  payment_error: 'red',
  cancelled: 'gray',
  preparing: 'orange',
  ready_to_pickup: 'blue',
  on_the_way: 'blue',
  delivered: 'green',
};

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status] || status;
}

export function getStatusBadgeVariant(status: OrderStatus): BadgeVariant {
  const colorMap: Record<string, BadgeVariant> = {
    green: 'default',
    yellow: 'secondary',
    red: 'destructive',
    gray: 'outline',
    orange: 'default',
    blue: 'default',
  };

  const color = ORDER_STATUS_COLORS[status];
  return colorMap[color] || 'outline';
}
```

### 3. Order Summary Reuse

**Important**: The `OrderSummary` component from cart can be reused with minimal props:

```typescript
<OrderSummary
  summary={order.billing.customerTotal}
  loading={false}
  showPaymentMethod={false}  // Hide payment method selection
  checkoutDisabled={true}    // Disable checkout button
  onCheckout={() => {}}      // No-op
  className="sticky top-4"   // Optional: make it sticky
/>
```

**Alternative**: Create a simplified read-only variant:
```typescript
<OrderSummaryReadOnly
  summary={order.billing.customerTotal}
  className="sticky top-4"
/>
```

### 4. Page Heading Consistency

**Follow Menu Page Pattern**:
```typescript
// Reusable heading component
function OrderPageHeading({ title, subtitle, badge }: OrderPageHeadingProps) {
  return (
    <section className="relative bg-white dark:bg-slate-950 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background decorative elements - same as menu page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 sm:mb-12 lg:mb-14">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <PackageCheck className="w-3.5 h-3.5" />
              {badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {title.prefix}{" "}
            <span className="text-orange-500 relative">
              {title.highlight}
              {/* Decorative underline */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0 8 Q 25 0, 50 8 T 100 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 5. Protected Routes

**Authentication Check**:
```typescript
// app/order/page.tsx
import { auth } from '@/lib/auth'; // Your auth implementation
import { redirect } from 'next/navigation';

export default async function OrderHistoryPage({ searchParams }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?callbackUrl=/order');
  }

  // Continue with page rendering...
}
```

**Or use middleware**:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  if (request.nextUrl.pathname.startsWith('/order')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
}

export const config = {
  matcher: ['/order/:path*'],
};
```

### 6. Error Handling Best Practices

**API Error Handling**:
```typescript
// In Server Component
const ordersResult = await getOrders(params);

if (ordersResult.statusCode === 401) {
  redirect('/login');
}

if (ordersResult.statusCode === 404) {
  notFound(); // Triggers not-found.tsx
}

if (ordersResult.statusCode !== 200) {
  throw new Error(ordersResult.errorMessage || 'Failed to load orders');
}
```

**Empty State Handling**:
```typescript
// In OrderGrid component
if (orders.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <PackageX className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No Orders Found</h3>
      <p className="text-muted-foreground text-center mb-6">
        {hasActiveFilters
          ? "Try adjusting your filters to see more results."
          : "You haven't placed any orders yet. Start by browsing our menu!"}
      </p>
      {!hasActiveFilters && (
        <Link href="/menu">
          <Button>Browse Menu</Button>
        </Link>
      )}
    </div>
  );
}
```

### 7. Performance Optimization

**Image Optimization**:
```typescript
// Use CustomImage for product images in order items
import { CustomImage } from '@/components/ui/custom-image';

<CustomImage
  src={item.imageUrl}
  alt={item.name}
  width={80}
  height={80}
  className="rounded-lg"
/>
```

**Data Prefetching**:
```typescript
// Prefetch order details on hover
<Link
  href={`/order/${order._id}`}
  prefetch={true}
  onMouseEnter={() => {
    // Prefetch happens automatically with Next.js Link
  }}
>
  <OrderCard order={order} />
</Link>
```

**Pagination Performance**:
```typescript
// Use searchParams for pagination (no client-side state)
// This allows back/forward navigation and bookmark support
```

### 8. Testing Considerations

**Unit Tests**:
- Utility functions (date formatting, currency formatting)
- Status label/color mapping
- Filter state transformations

**Component Tests**:
- OrderCard rendering with different statuses
- OrderFilters interaction
- OrderPagination navigation
- OrderStatusStepper progress

**Integration Tests**:
- Order history page with filters
- Order details page loading
- Success/error screen navigation

**E2E Tests**:
- Complete order flow
- Filter and pagination
- Order details viewing
- Action button interactions

### 9. SEO Considerations

**Metadata for Order Pages**:
```typescript
// app/order/page.tsx
export const metadata: Metadata = {
  title: 'My Orders - Pizza Space',
  description: 'View your order history and track your Pizza Space orders',
  robots: 'noindex, nofollow', // Orders are user-specific
};

// app/order/[orderId]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { orderId } = await params;

  return {
    title: `Order #${orderId.substring(0, 8)} - Pizza Space`,
    robots: 'noindex, nofollow',
  };
}
```

### 10. Mobile Responsiveness

**Key Breakpoints**:
- Mobile: < 640px (1 column grid)
- Tablet: 640px - 1024px (2 column grid)
- Desktop: > 1024px (3 column grid)

**Touch-Friendly**:
- Minimum 44px touch targets
- Swipe gestures for pagination (optional)
- Bottom sheet for filters on mobile (optional)

**Layout Adjustments**:
```typescript
// Order details layout
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content: 2 columns on desktop */}
  <div className="lg:col-span-2 space-y-6">
    <OrderStatusStepper {...} />
    <OrderItemsList {...} />
  </div>

  {/* Sidebar: 1 column on desktop, full width on mobile */}
  <div className="space-y-6">
    <OrderSummary {...} />
    <OrderInformation {...} />
    <StoreDetails {...} />
  </div>
</div>
```

---

## Summary

This requirements document provides a comprehensive analysis of the order feature, mapping all API response types to UI components, defining filter state management patterns, documenting data flow, and specifying action handlers.

**Key Takeaways**:

1. **Four Main Screens**: Order History, Order Details, Success, and Error
2. **Data Reuse**: OrderSummary component can be reused from cart
3. **Server-First**: Use Server Components for data fetching, Client Components for interactivity
4. **URL State**: Filters and pagination managed via URL search params
5. **Type Safety**: All interfaces and types are defined in `/types/order.ts`
6. **Design Consistency**: Follow menu page heading pattern
7. **Accessibility**: WCAG 2.1 Level AA compliance throughout
8. **Performance**: Parallel data fetching, image optimization, prefetching

**Next Steps**:

1. Review and validate component breakdown
2. Design shadcn component selection for each UI element
3. Create wireframes/mockups following design guidelines
4. Implement Server Components first (data layer)
5. Add Client Components for interactivity
6. Implement action handlers (rate, report, etc.)
7. Add comprehensive testing
8. Conduct accessibility audit

---

**Document Version**: 1.0
**Last Updated**: December 2, 2025
**Author**: System Analysis
