# Order Feature Component Architecture

**Project**: PizzaSpace Web - Next.js 16 Pizza Delivery Application
**Feature**: Complete Order Management System
**Date**: December 2, 2025
**Version**: 1.0
**Status**: Architecture Design Complete

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Component Hierarchy Diagrams](#component-hierarchy-diagrams)
3. [Server vs Client Component Strategy](#server-vs-client-component-strategy)
4. [File Structure](#file-structure)
5. [Component Specifications](#component-specifications)
6. [TypeScript Interfaces](#typescript-interfaces)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Shared Component Reuse Matrix](#shared-component-reuse-matrix)
9. [Implementation Notes](#implementation-notes)

---

## Executive Summary

This document defines the complete component architecture for the Order Management feature, consisting of 4 main screens with 19 specialized components organized into 5 categories. The architecture follows Next.js 16 App Router patterns with clear Server/Client boundaries, maximum component reuse, and type-safe prop interfaces.

### Key Metrics

- **Total Screens**: 4 (History, Details, Success, Failure)
- **Total Components**: 19 (5 shared, 4 history, 5 details, 2 success, 3 failure)
- **Server Components**: 8
- **Client Components**: 11
- **Reusable Shared Components**: 5 (used across all screens)
- **Total Files**: ~28

### Architecture Principles

1. **Server-First Data Fetching**: All data fetching happens in Server Components
2. **Client-Only Interactivity**: Interactive elements (filters, actions) are Client Components
3. **Maximum Reuse**: 5 shared components used across all 4 screens
4. **Type Safety**: Strict TypeScript interfaces for all component props
5. **Composition Over Configuration**: Flexible component composition patterns

---

## Component Hierarchy Diagrams

### 1. Order History Screen (`/order`)

```
OrderHistoryPage (Server Component)
├── OrderPageHeader (Shared)
│   ├── Badge: "YOUR ORDERS"
│   ├── Heading: "Track Your" + "Pizza Journey"
│   └── Subtitle
│
└── OrderHistoryClient (Client Component)
    ├── OrderFilters (Client Component)
    │   ├── TimeRangeSelect (shadcn Select)
    │   └── StatusFilter (shadcn ToggleGroup)
    │
    ├── OrderGrid (Presentational)
    │   └── OrderCard[] (Presentational)
    │       ├── Order ID, Date, Total
    │       ├── OrderStatusBadge (Shared)
    │       ├── Store Name
    │       └── DropdownMenu (View Details, Review, Report)
    │
    └── OrderPagination (Client Component)
        ├── Previous Button
        ├── Page Numbers
        └── Next Button
```

**Data Flow**:
```
Server: getOrders(filters) → orders[], pagination
  ↓
Client: OrderHistoryClient receives initial data
  ↓
User: Changes filter → URL update → Server re-fetches
```

---

### 2. Order Details Screen (`/order/[orderId]`)

```
OrderDetailsPage (Server Component)
├── OrderPageHeader (Shared)
│   ├── Badge: "ORDER DETAILS"
│   └── Heading with Order ID
│
├── OrderDetailsHeader (Presentational)
│   ├── Order ID + Date
│   ├── Back to Orders Link
│   └── OrderActions (Client Component)
│       ├── Rate Order Button (conditional)
│       └── Have Problem Button
│
├── OrderStatusTimeline (Presentational)
│   └── TimelineStep[]
│       ├── Icon (CheckCircle, Package, Truck, Home)
│       ├── Status Label
│       ├── Timestamp
│       └── Connection Line
│
├── TwoColumnLayout
│   ├── Main Content Column
│   │   ├── OrderItemsList (Shared)
│   │   │   └── OrderItemCard[] (Shared)
│   │   │       ├── Product Name
│   │   │       ├── Variants
│   │   │       ├── Addons
│   │   │       ├── Quantity
│   │   │       ├── Prices (original + discount)
│   │   │       └── Refund Badge (conditional)
│   │   │
│   │   └── OrderSummaryDisplay (Shared)
│   │       └── OrderSummary (from cart)
│   │
│   └── Sidebar Column
│       ├── OrderInformation (Presentational)
│       │   ├── OrderStatusBadge (Shared)
│       │   ├── Payment Method (icon + text)
│       │   └── Payment Reference ID
│       │
│       ├── StoreDetails (Presentational)
│       │   ├── Collapsible Trigger
│       │   └── Store Info (name, phone, address, email)
│       │
│       └── DeliveryRiderDetails (Presentational, Conditional)
│           ├── Collapsible Trigger
│           └── Rider Info (name, email)
```

**Data Flow**:
```
Server: getOrderDetails(orderId) → order
  ↓
Props: Passed to child components
  ↓
User Actions: Rate Order / Report Problem → Modal/Dialog
```

---

### 3. Order Success Screen (`/order/[orderId]/success`)

```
OrderSuccessPage (Server Component)
├── OrderPageHeader (Shared)
│   └── Custom green accent variant
│
├── SuccessHeading (Presentational)
│   ├── CheckCircle Icon (green)
│   ├── "Order Placed Successfully!" Headline
│   ├── Thank You Message
│   └── Order ID Display
│
├── OrderItemsList (Shared)
│   └── OrderItemCard[] (Shared)
│
├── OrderSummaryDisplay (Shared)
│   └── OrderSummary (read-only mode)
│
└── SuccessActions (Presentational)
    ├── View Details Button (primary)
    └── Order More Button (outline)
```

**Data Flow**:
```
Server: getOrderDetails(orderId) → order
  ↓
Display: Show success state with order info
  ↓
Actions: Navigate to details or menu
```

---

### 4. Order Failure Screen (`/order/[orderId]/error`)

```
OrderFailurePage (Server Component)
├── OrderPageHeader (Shared)
│   └── Custom red accent variant
│
├── FailureHeading (Presentational)
│   ├── XCircle Icon (red)
│   ├── "Order Error" Headline
│   ├── Issue Message
│   └── Order ID Display
│
├── OrderItemsList (Shared)
│   └── OrderItemCard[] (Shared)
│
├── OrderSummaryDisplay (Shared)
│   └── OrderSummary (read-only mode)
│
├── FailureActions (Presentational)
│   ├── Contact Support Button (primary)
│   ├── View Details Button (outline)
│   └── Order More Button (outline)
│
└── HelpCard (Presentational)
    ├── "Need Help?" Heading
    ├── Support Info
    └── Contact Details
```

**Data Flow**:
```
Server: getOrderDetails(orderId) → order
  ↓
Display: Show error state with order info
  ↓
Actions: Contact support, view details, or order more
```

---

## Server vs Client Component Strategy

### Server Components (8 components)

These components fetch data and render on the server. No interactivity.

| Component | Location | Purpose |
|-----------|----------|---------|
| `OrderHistoryPage` | `app/(protected)/order/page.tsx` | Fetch orders list with filters |
| `OrderDetailsPage` | `app/(protected)/order/[orderId]/page.tsx` | Fetch single order details |
| `OrderSuccessPage` | `app/(protected)/order/[orderId]/success/page.tsx` | Fetch order for success display |
| `OrderFailurePage` | `app/(protected)/order/[orderId]/error/page.tsx` | Fetch order for error display |
| `OrderPageHeader` | `components/order/shared/order-page-header.tsx` | Static header with premium styling |
| `OrderItemsList` | `components/order/shared/order-items-list.tsx` | Container for order items |
| `OrderItemCard` | `components/order/shared/order-item-card.tsx` | Single item display |
| `OrderSummaryDisplay` | `components/order/shared/order-summary-display.tsx` | Wrapper for OrderSummary |

### Client Components (11 components)

These components require interactivity, state management, or browser APIs.

| Component | Location | Reason for Client |
|-----------|----------|-------------------|
| `OrderHistoryClient` | `components/order/history/order-history-client.tsx` | URL state management |
| `OrderFilters` | `components/order/history/order-filters.tsx` | Filter interactions |
| `OrderPagination` | `components/order/history/order-pagination.tsx` | Page navigation |
| `OrderActions` | `components/order/details/order-actions.tsx` | Button clicks, modals |
| `OrderSummary` | `components/cart/order-summary.tsx` | Payment method selection (existing) |
| `OrderStatusBadge` | `components/order/shared/order-status-badge.tsx` | Potential animations |

### Presentational Components (Flexible)

These can be Server or Client depending on parent context:

| Component | Default | Notes |
|-----------|---------|-------|
| `OrderCard` | Client | Needs dropdown interactions |
| `OrderGrid` | Server | Pure layout, no state |
| `OrderDetailsHeader` | Server | Static display |
| `OrderStatusTimeline` | Server | Can add animations later |
| `OrderInformation` | Server | Static display |
| `StoreDetails` | Client | Collapsible interaction |
| `DeliveryRiderDetails` | Client | Collapsible interaction |
| `SuccessHeading` | Server | Static display |
| `SuccessActions` | Server | Navigation only (Link) |
| `FailureHeading` | Server | Static display |
| `FailureActions` | Server | Navigation only (Link) |
| `HelpCard` | Server | Static display |

---

## File Structure

```
app/(protected)/order/
├── page.tsx                           # Order History Page (Server)
├── loading.tsx                        # History loading skeleton
├── error.tsx                          # History error boundary
└── [orderId]/
    ├── page.tsx                       # Order Details Page (Server)
    ├── loading.tsx                    # Details loading skeleton
    ├── error.tsx                      # Details error boundary
    ├── success/
    │   ├── page.tsx                   # Success Page (Server)
    │   └── loading.tsx                # Success loading skeleton
    └── error/
        ├── page.tsx                   # Failure Page (Server)
        └── loading.tsx                # Failure loading skeleton

components/order/
├── shared/                            # Shared across all screens (5 components)
│   ├── order-page-header.tsx         # Premium page header (Server)
│   ├── order-status-badge.tsx        # Status badge with colors (Client)
│   ├── order-item-card.tsx           # Single item display (Server)
│   ├── order-items-list.tsx          # Items container (Server)
│   └── order-summary-display.tsx     # OrderSummary wrapper (Server)
│
├── history/                           # Order History Screen (4 components)
│   ├── order-history-client.tsx      # Client wrapper with state (Client)
│   ├── order-card.tsx                # Order card with actions (Client)
│   ├── order-filters.tsx             # Filter controls (Client)
│   ├── order-grid.tsx                # Grid layout (Server)
│   └── order-pagination.tsx          # Pagination controls (Client)
│
├── details/                           # Order Details Screen (5 components)
│   ├── order-details-header.tsx      # Header with ID + actions (Server)
│   ├── order-status-timeline.tsx     # Status stepper (Server)
│   ├── order-information.tsx         # Order info card (Server)
│   ├── store-details.tsx             # Store info collapsible (Client)
│   ├── delivery-rider-details.tsx    # Rider info collapsible (Client)
│   └── order-actions.tsx             # Action buttons (Client)
│
├── success/                           # Success Screen (2 components)
│   ├── success-heading.tsx           # Green success header (Server)
│   └── success-actions.tsx           # Action buttons (Server)
│
├── failure/                           # Failure Screen (3 components)
│   ├── failure-heading.tsx           # Red error header (Server)
│   ├── failure-actions.tsx           # Action buttons (Server)
│   └── help-card.tsx                 # Support info card (Server)
│
└── index.ts                           # Barrel export

lib/order/
├── utils.ts                           # Order utility functions
├── constants.ts                       # Status labels, colors, icons
└── types.ts                           # Local type utilities (optional)
```

**Total Files**: 28 new files

---

## Component Specifications

### Shared Components (5)

#### 1. OrderPageHeader (Server Component)

**File**: `components/order/shared/order-page-header.tsx`

**Purpose**: Premium page header matching menu page design with badge, headline, subtitle, and decorative elements.

**Props**:
```typescript
interface OrderPageHeaderProps {
  badge: string;                // e.g., "YOUR ORDERS"
  title: {
    prefix: string;             // e.g., "Track Your"
    highlight: string;          // e.g., "Pizza Journey"
  };
  subtitle: string;             // e.g., "View all your pizza orders..."
  variant?: 'default' | 'success' | 'error'; // Accent color
  className?: string;
}
```

**Features**:
- Orange gradient backgrounds (default)
- Green accent for success
- Red accent for error
- Decorative underline on highlighted text
- Responsive padding and text sizing
- Dark mode support

**shadcn Dependencies**: None (custom styling)

---

#### 2. OrderStatusBadge (Client Component)

**File**: `components/order/shared/order-status-badge.tsx`

**Purpose**: Color-coded status badge with icon and label.

**Props**:
```typescript
interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;          // Optional pulse animation
  className?: string;
}
```

**Status Mapping**:
```typescript
const statusConfig: Record<OrderStatus, {
  label: string;
  icon: LucideIcon;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  colorClasses: string;
}> = {
  initiated: {
    label: 'Initiated',
    icon: Clock,
    variant: 'outline',
    colorClasses: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  payment_confirmed: {
    label: 'Payment Confirmed',
    icon: CheckCircle,
    variant: 'default',
    colorClasses: 'bg-green-100 text-green-700 border-green-200',
  },
  payment_error: {
    label: 'Payment Error',
    icon: AlertCircle,
    variant: 'destructive',
    colorClasses: 'bg-red-100 text-red-700 border-red-200',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    variant: 'outline',
    colorClasses: 'bg-gray-100 text-gray-700 border-gray-200',
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    variant: 'secondary',
    colorClasses: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  ready_to_pickup: {
    label: 'Ready to Pickup',
    icon: PackageCheck,
    variant: 'default',
    colorClasses: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  on_the_way: {
    label: 'On the Way',
    icon: Truck,
    variant: 'secondary',
    colorClasses: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  delivered: {
    label: 'Delivered',
    icon: Home,
    variant: 'default',
    colorClasses: 'bg-green-100 text-green-700 border-green-200',
  },
};
```

**shadcn Dependencies**: Badge

---

#### 3. OrderItemCard (Server Component)

**File**: `components/order/shared/order-item-card.tsx`

**Purpose**: Display single order item with name, variants, addons, quantity, and pricing.

**Props**:
```typescript
interface OrderItemCardProps {
  item: OrderItemResponse;
  showRefundInfo?: boolean;    // Show refund badge/details
  compact?: boolean;           // Compact layout for small screens
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────┐
│ Pijo                            £30.00      │
│ variant0: Medium                £27.00      │
│ Add-ons: test, test222        Save £3.00   │
│ Quantity: 1                   [Refund]     │
└─────────────────────────────────────────────┘
```

**Features**:
- Product name (bold)
- Variants display (comma-separated)
- Addons display (comma-separated)
- Quantity display
- Price comparison (original + discounted)
- Savings highlight (green text)
- Refund badge (conditional)
- Item status badge (cancelled, returned)

**shadcn Dependencies**: Badge, Card

---

#### 4. OrderItemsList (Server Component)

**File**: `components/order/shared/order-items-list.tsx`

**Purpose**: Container for order items with section header.

**Props**:
```typescript
interface OrderItemsListProps {
  items: OrderItemResponse[];
  title?: string;              // e.g., "Order Items (3)"
  showRefundInfo?: boolean;
  className?: string;
}
```

**Features**:
- Section title with item count
- List of OrderItemCard components
- Empty state handling
- Responsive spacing

**shadcn Dependencies**: Separator

---

#### 5. OrderSummaryDisplay (Server Component)

**File**: `components/order/shared/order-summary-display.tsx`

**Purpose**: Wrapper around existing OrderSummary component for read-only display.

**Props**:
```typescript
interface OrderSummaryDisplayProps {
  billing: Billing;
  showPaymentMethod?: boolean; // Default false
  className?: string;
}
```

**Implementation**:
```typescript
export function OrderSummaryDisplay({
  billing,
  showPaymentMethod = false,
  className,
}: OrderSummaryDisplayProps) {
  return (
    <OrderSummary
      summary={billing.customerTotal}
      loading={false}
      showPaymentMethod={showPaymentMethod}
      checkoutDisabled={true}
      onCheckout={() => {}}     // No-op
      className={className}
    />
  );
}
```

**shadcn Dependencies**: Inherits from OrderSummary

---

### History Screen Components (4)

#### 6. OrderHistoryClient (Client Component)

**File**: `components/order/history/order-history-client.tsx`

**Purpose**: Client-side wrapper managing filter state and URL synchronization.

**Props**:
```typescript
interface OrderHistoryClientProps {
  initialOrders: OrderResponse[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialFilters: {
    timerange: TimeRange;
    status?: OrderStatus;
  };
}
```

**State Management**:
- Reads filters from URL search params
- Updates URL on filter change
- Triggers server re-fetch via router.push()

**shadcn Dependencies**: None (composition only)

---

#### 7. OrderCard (Client Component)

**File**: `components/order/history/order-card.tsx`

**Purpose**: Individual order card in grid with dropdown menu.

**Props**:
```typescript
interface OrderCardProps {
  order: OrderResponse;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ Order #6921D7C...           [⋮]        │
│ Nov 23, 2025, 6:32 PM                  │
│                                         │
│ £52.11                                 │
│ 1 items                                │
│                                         │
│ [Payment Confirmed]                    │
│ Papa John's Pizza - Greenwich          │
└─────────────────────────────────────────┘
```

**Features**:
- Order ID (truncated with `#` prefix)
- Order date/time
- Total amount
- Item count
- Status badge (OrderStatusBadge component)
- Store name
- Dropdown menu with actions:
  - View Details
  - Review Order
  - Have a Problem (red text)

**Interactions**:
- Card click → Navigate to order details
- Dropdown actions → Respective handlers

**shadcn Dependencies**: Card, DropdownMenu, Badge

---

#### 8. OrderFilters (Client Component)

**File**: `components/order/history/order-filters.tsx`

**Purpose**: Time range and status filter controls.

**Props**:
```typescript
interface OrderFiltersProps {
  timerange: TimeRange;
  status?: OrderStatus;
  onTimeRangeChange: (value: TimeRange) => void;
  onStatusChange: (value: OrderStatus | 'all') => void;
  onReset?: () => void;
  className?: string;
}
```

**Layout**:
```
[Time Range ▼]  [All Statuses ▼]  [Reset Filters]
```

**Features**:
- Time range dropdown (All Time, Last 7 Days, Last 30 Days, etc.)
- Status dropdown (All, Initiated, Confirmed, Preparing, etc.)
- Reset filters button (conditional, shows if filters active)
- Responsive layout (stacks on mobile)

**shadcn Dependencies**: Select, Button

---

#### 9. OrderGrid (Server Component)

**File**: `components/order/history/order-grid.tsx`

**Purpose**: Responsive grid layout for order cards.

**Props**:
```typescript
interface OrderGridProps {
  orders: OrderResponse[];
  emptyMessage?: string;
  className?: string;
}
```

**Grid Layout**:
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns
- Gap: 1rem

**Empty State**:
- Shows PackageX icon
- Custom message or default
- "Browse Menu" button if no orders

**shadcn Dependencies**: None (Tailwind grid)

---

#### 10. OrderPagination (Client Component)

**File**: `components/order/history/order-pagination.tsx`

**Purpose**: Pagination controls for order list.

**Props**:
```typescript
interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;   // Default true
  maxPageButtons?: number;     // Default 5
  className?: string;
}
```

**Features**:
- Previous/Next buttons
- Page number buttons (with ellipsis for large ranges)
- Disabled state for boundaries
- Responsive (shows fewer pages on mobile)

**shadcn Dependencies**: Button

---

### Details Screen Components (6)

#### 11. OrderDetailsHeader (Server Component)

**File**: `components/order/details/order-details-header.tsx`

**Purpose**: Order details header with ID, date, and action buttons.

**Props**:
```typescript
interface OrderDetailsHeaderProps {
  order: OrderResponse;
  className?: string;
}
```

**Layout**:
```
← Back to Orders

Order #6921D7CD
Placed on 22 Nov 2025 (Sat) - 09:03 PM

[Rate Order]  [Have Problem]
```

**Features**:
- Back to Orders link (with arrow)
- Order ID display (with `#` prefix)
- Formatted placement date
- OrderActions component (conditional)

**shadcn Dependencies**: Button, Link

---

#### 12. OrderStatusTimeline (Server Component)

**File**: `components/order/details/order-status-timeline.tsx`

**Purpose**: Visual timeline showing order progress through statuses.

**Props**:
```typescript
interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  statusList: OrderStatusAndTimeResponse[];
  deliveryType?: OrderDeliveryType;
  className?: string;
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: LucideIcon;
  timestamp?: string;
  isActive: boolean;
  isCompleted: boolean;
}
```

**Timeline Flow**:
```
✓ Confirmed          ✓ Preparing         ○ On the Way        ○ Delivered
  09:03 PM             09:54 PM             --:-- --            --:-- --
```

**Status Steps** (Standard Delivery):
1. Confirmed (payment_confirmed)
2. Preparing
3. On the Way (on_the_way)
4. Delivered

**Status Steps** (Pickup):
1. Confirmed
2. Preparing
3. Ready to Pickup (ready_to_pickup)
4. Picked Up (delivered)

**Features**:
- Icon for each step (CheckCircle, ChefHat, Truck, Home)
- Completion checkmark
- Active step highlight
- Timestamp display (formatted time)
- Connection lines (color-coded)
- Responsive (vertical on mobile, horizontal on desktop)

**shadcn Dependencies**: None (custom timeline)

---

#### 13. OrderActions (Client Component)

**File**: `components/order/details/order-actions.tsx`

**Purpose**: Action buttons for order (Rate, Report Problem).

**Props**:
```typescript
interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  onRateOrder?: () => Promise<void>;
  onReportProblem?: () => Promise<void>;
  className?: string;
}
```

**Features**:
- Rate Order button (visible only for delivered orders)
- Have Problem button (always visible)
- Loading states
- Opens modals/dialogs for actions

**Future Enhancement**:
- Rating dialog with stars
- Problem report form

**shadcn Dependencies**: Button, Dialog

---

#### 14. OrderInformation (Server Component)

**File**: `components/order/details/order-information.tsx`

**Purpose**: Display order information (status, payment method, reference).

**Props**:
```typescript
interface OrderInformationProps {
  status: OrderStatus;
  paymentMethod: PaymentType;
  paymentRefId: string;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────┐
│ ⏰ Order Information                │
│                                     │
│ Status: [Payment Confirmed]        │
│                                     │
│ Payment Method:                    │
│ 💳 Online Payment                  │
│                                     │
│ Payment Reference ID:              │
│ pi_3QNH3xQeHMQEMb...   [Copy]     │
└─────────────────────────────────────┘
```

**Features**:
- Status badge (OrderStatusBadge)
- Payment method icon (CreditCard or Banknote)
- Payment reference with copy button
- Icon for section header

**shadcn Dependencies**: Card, Button (for copy), Badge

---

#### 15. StoreDetails (Client Component)

**File**: `components/order/details/store-details.tsx`

**Purpose**: Collapsible card showing store information.

**Props**:
```typescript
interface StoreDetailsProps {
  store: StoreResponse;
  defaultOpen?: boolean;       // Default true
  className?: string;
}
```

**Layout** (Expanded):
```
┌─────────────────────────────────────┐
│ 📍 Store Details              [▼]  │
│                                     │
│ Papa John's Pizza - Greenwich      │
│                                     │
│ 📞 +44 20 1234 5678                │
│ 📧 greenwich@papajohns.co.uk       │
│ 📍 123 High Street, Greenwich...   │
└─────────────────────────────────────┘
```

**Features**:
- Collapsible trigger
- Store name (bold)
- Clickable phone (tel: link)
- Clickable email (mailto: link)
- Full address
- Icons for each field

**shadcn Dependencies**: Collapsible, Card

---

#### 16. DeliveryRiderDetails (Client Component)

**File**: `components/order/details/delivery-rider-details.tsx`

**Purpose**: Collapsible card showing delivery rider information (conditional).

**Props**:
```typescript
interface DeliveryRiderDetailsProps {
  rider: StaffResponse;
  defaultOpen?: boolean;       // Default true
  className?: string;
}
```

**Rendering Logic**:
- Only render if `order.rider?.info` exists
- Hidden for pickup orders or orders without assigned rider

**Layout**:
```
┌─────────────────────────────────────┐
│ 🚴 Delivery Rider Details     [▼]  │
│                                     │
│ John Doe                           │
│ 📧 john.doe@delivery.com           │
└─────────────────────────────────────┘
```

**Features**:
- Collapsible trigger
- Rider name (bold)
- Clickable email (mailto: link)
- Icon for section header

**shadcn Dependencies**: Collapsible, Card

---

### Success Screen Components (2)

#### 17. SuccessHeading (Server Component)

**File**: `components/order/success/success-heading.tsx`

**Purpose**: Success banner with checkmark icon and thank you message.

**Props**:
```typescript
interface SuccessHeadingProps {
  orderId: string;
  customerMessage?: string;    // Optional custom message
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────┐
│         ✓ (green checkmark icon)               │
│                                                 │
│   Order Placed Successfully! 🎉                │
│                                                 │
│   Thank you for your order! Your delicious     │
│   food is being prepared.                      │
│                                                 │
│   Order ID: #692305d9                          │
└─────────────────────────────────────────────────┘
```

**Features**:
- Large green CheckCircle icon
- Success headline with emoji
- Thank you message
- Order ID display
- Green accent background

**shadcn Dependencies**: None (custom styling)

---

#### 18. SuccessActions (Server Component)

**File**: `components/order/success/success-actions.tsx`

**Purpose**: Action buttons for success screen.

**Props**:
```typescript
interface SuccessActionsProps {
  orderId: string;
  className?: string;
}
```

**Layout**:
```
[View Details]  [Order More]
```

**Features**:
- View Details button (primary, navigates to `/order/[orderId]`)
- Order More button (outline, navigates to `/menu`)
- Responsive (stacks on mobile)

**shadcn Dependencies**: Button

---

### Failure Screen Components (3)

#### 19. FailureHeading (Server Component)

**File**: `components/order/failure/failure-heading.tsx`

**Purpose**: Error banner with X icon and issue message.

**Props**:
```typescript
interface FailureHeadingProps {
  orderId: string;
  errorMessage?: string;       // Optional custom error
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────────────┐
│         ✕ (red X icon)                         │
│                                                 │
│   Order Error                                  │
│                                                 │
│   There was an issue with your order.         │
│   Please contact support for assistance.       │
│                                                 │
│   Order ID: #692305d9                          │
└─────────────────────────────────────────────────┘
```

**Features**:
- Large red XCircle icon
- Error headline
- Issue description
- Order ID display
- Red accent background

**shadcn Dependencies**: None (custom styling)

---

#### 20. FailureActions (Server Component)

**File**: `components/order/failure/failure-actions.tsx`

**Purpose**: Action buttons for failure screen.

**Props**:
```typescript
interface FailureActionsProps {
  orderId: string;
  supportEmail?: string;       // Default: support@pizzaspace.co.uk
  supportPhone?: string;       // Default: +44 20 1234 5678
  className?: string;
}
```

**Layout**:
```
[Contact Support]  [View Details]  [Order More]
```

**Features**:
- Contact Support button (primary, opens email/phone)
- View Details button (outline, navigates to details)
- Order More button (outline, navigates to menu)
- Responsive (stacks on mobile)

**shadcn Dependencies**: Button

---

#### 21. HelpCard (Server Component)

**File**: `components/order/failure/help-card.tsx`

**Purpose**: Support information card with contact details.

**Props**:
```typescript
interface HelpCardProps {
  supportEmail?: string;
  supportPhone?: string;
  className?: string;
}
```

**Layout**:
```
┌─────────────────────────────────────────┐
│ Need Help?                              │
│                                         │
│ Our support team is here to assist     │
│ you with any order issues.             │
│                                         │
│ 📧 support@pizzaspace.co.uk            │
│ 📞 +44 20 1234 5678                    │
│                                         │
│ Available: Mon-Sun, 9 AM - 11 PM       │
└─────────────────────────────────────────┘
```

**Features**:
- Heading
- Support message
- Email (clickable mailto:)
- Phone (clickable tel:)
- Availability hours
- Light blue/gray background

**shadcn Dependencies**: Card

---

## TypeScript Interfaces

### Complete Props Interfaces

```typescript
// ============================================================
// SHARED COMPONENTS
// ============================================================

interface OrderPageHeaderProps {
  badge: string;
  title: {
    prefix: string;
    highlight: string;
  };
  subtitle: string;
  variant?: 'default' | 'success' | 'error';
  className?: string;
}

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

interface OrderItemCardProps {
  item: OrderItemResponse;
  showRefundInfo?: boolean;
  compact?: boolean;
  className?: string;
}

interface OrderItemsListProps {
  items: OrderItemResponse[];
  title?: string;
  showRefundInfo?: boolean;
  className?: string;
}

interface OrderSummaryDisplayProps {
  billing: Billing;
  showPaymentMethod?: boolean;
  className?: string;
}

// ============================================================
// HISTORY COMPONENTS
// ============================================================

interface OrderHistoryClientProps {
  initialOrders: OrderResponse[];
  initialPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  initialFilters: {
    timerange: TimeRange;
    status?: OrderStatus;
  };
}

interface OrderCardProps {
  order: OrderResponse;
  className?: string;
}

interface OrderFiltersProps {
  timerange: TimeRange;
  status?: OrderStatus;
  onTimeRangeChange: (value: TimeRange) => void;
  onStatusChange: (value: OrderStatus | 'all') => void;
  onReset?: () => void;
  className?: string;
}

interface OrderGridProps {
  orders: OrderResponse[];
  emptyMessage?: string;
  className?: string;
}

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageNumbers?: boolean;
  maxPageButtons?: number;
  className?: string;
}

// ============================================================
// DETAILS COMPONENTS
// ============================================================

interface OrderDetailsHeaderProps {
  order: OrderResponse;
  className?: string;
}

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  statusList: OrderStatusAndTimeResponse[];
  deliveryType?: OrderDeliveryType;
  className?: string;
}

interface TimelineStep {
  status: OrderStatus;
  label: string;
  icon: LucideIcon;
  timestamp?: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface OrderActionsProps {
  orderId: string;
  status: OrderStatus;
  onRateOrder?: () => Promise<void>;
  onReportProblem?: () => Promise<void>;
  className?: string;
}

interface OrderInformationProps {
  status: OrderStatus;
  paymentMethod: PaymentType;
  paymentRefId: string;
  className?: string;
}

interface StoreDetailsProps {
  store: StoreResponse;
  defaultOpen?: boolean;
  className?: string;
}

interface DeliveryRiderDetailsProps {
  rider: StaffResponse;
  defaultOpen?: boolean;
  className?: string;
}

// ============================================================
// SUCCESS COMPONENTS
// ============================================================

interface SuccessHeadingProps {
  orderId: string;
  customerMessage?: string;
  className?: string;
}

interface SuccessActionsProps {
  orderId: string;
  className?: string;
}

// ============================================================
// FAILURE COMPONENTS
// ============================================================

interface FailureHeadingProps {
  orderId: string;
  errorMessage?: string;
  className?: string;
}

interface FailureActionsProps {
  orderId: string;
  supportEmail?: string;
  supportPhone?: string;
  className?: string;
}

interface HelpCardProps {
  supportEmail?: string;
  supportPhone?: string;
  className?: string;
}
```

---

## Data Flow Patterns

### 1. Order History Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ Server Component: OrderHistoryPage                      │
│                                                          │
│ 1. Read URL search params                              │
│ 2. Convert timerange to startTime/endTime              │
│ 3. Call getOrders(params)                              │
│ 4. Receive orders[] + pagination                       │
│ 5. Pass to OrderHistoryClient                          │
└─────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Client Component: OrderHistoryClient                     │
│                                                          │
│ - Receives initial data as props                       │
│ - Manages URL state via useSearchParams                │
│ - On filter change:                                    │
│   → Update URL search params                           │
│   → Next.js triggers Server Component re-render        │
│   → Server re-fetches with new params                  │
└─────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Presentational Components                                │
│                                                          │
│ OrderGrid → OrderCard[] → OrderStatusBadge             │
│                                                          │
│ - Pure props-based rendering                           │
│ - No state management                                  │
│ - Dropdown actions navigate or open modals            │
└─────────────────────────────────────────────────────────┘
```

**Key Points**:
- Server Component owns data fetching
- Client Component owns URL state
- URL is single source of truth for filters
- Server re-fetches on URL change (automatic)

---

### 2. Order Details Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ Server Component: OrderDetailsPage                       │
│                                                          │
│ 1. Extract orderId from params                         │
│ 2. Call getOrderDetails(orderId)                       │
│ 3. Receive complete OrderResponse                      │
│ 4. Pass to child components via props                  │
└─────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Presentational Layout                                    │
│                                                          │
│ ┌─────────────────┐  ┌─────────────────────────────┐  │
│ │ Main Column     │  │ Sidebar Column              │  │
│ │                 │  │                             │  │
│ │ - Timeline      │  │ - Order Information         │  │
│ │ - Items List    │  │ - Store Details             │  │
│ │ - Summary       │  │ - Rider Details (optional)  │  │
│ └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Client Component: OrderActions                           │
│                                                          │
│ - Rate Order button → Opens rating dialog              │
│ - Have Problem button → Opens problem report dialog     │
│ - Handles async actions                                │
└─────────────────────────────────────────────────────────┘
```

**Key Points**:
- Single data fetch in Server Component
- Props cascaded to all children
- Conditional rendering (rider details)
- Client interactivity isolated in OrderActions

---

### 3. Success/Failure Data Flow

```
┌─────────────────────────────────────────────────────────┐
│ Server Component: OrderSuccessPage / OrderFailurePage   │
│                                                          │
│ 1. Extract orderId from params                         │
│ 2. Call getOrderDetails(orderId)                       │
│ 3. Receive OrderResponse                               │
│ 4. Render success/failure UI with order data           │
└─────────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────────┐
│ Layout Structure                                         │
│                                                          │
│ - Success/Failure Heading (green/red variant)          │
│ - Order Items List (shared component)                  │
│ - Order Summary Display (shared component)             │
│ - Action Buttons (Link navigation)                     │
│ - Help Card (failure only)                             │
└─────────────────────────────────────────────────────────┘
```

**Key Points**:
- Read-only display (no interactivity)
- Reuses shared components (items, summary)
- Simple navigation actions
- Color-coded variants (success green, error red)

---

## Shared Component Reuse Matrix

| Component | History | Details | Success | Failure | Total Uses |
|-----------|---------|---------|---------|---------|------------|
| **OrderPageHeader** | ✓ | ✓ | ✓ | ✓ | 4 |
| **OrderStatusBadge** | ✓ (in card) | ✓ (in info) | - | - | 2 |
| **OrderItemCard** | - | ✓ | ✓ | ✓ | 3 |
| **OrderItemsList** | - | ✓ | ✓ | ✓ | 3 |
| **OrderSummaryDisplay** | - | ✓ | ✓ | ✓ | 3 |

**Total Shared Components**: 5
**Average Reuse**: 3 screens per component
**Reuse Efficiency**: 75% (15 uses / 20 possible)

---

## Implementation Notes

### 1. Authentication & Protected Routes

All order pages are protected by the `AuthGuard` component via the `app/(protected)` layout.

```typescript
// app/(protected)/layout.tsx
import { AuthGuard } from '@/components/auth/auth-guard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

**Behavior**:
- Unauthenticated users are redirected to login
- Login page receives `callbackUrl` for post-auth redirect
- Session is validated server-side

---

### 2. Loading States

Each page route includes a `loading.tsx` file for instant loading UI:

```typescript
// app/(protected)/order/loading.tsx
export default function OrderHistoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <OrderPageHeader.Skeleton />
      <OrderFilters.Skeleton />
      <OrderGrid.Skeleton count={12} />
    </div>
  );
}
```

**Pattern**: Component-level skeleton variants

---

### 3. Error Boundaries

Each page route includes an `error.tsx` file:

```typescript
// app/(protected)/order/error.tsx
'use client';

export default function OrderError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card>
        <CardContent className="flex flex-col items-center py-12">
          <AlertCircle className="size-16 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Failed to Load Orders</h2>
          <p className="text-muted-foreground mb-6">{error.message}</p>
          <Button onClick={reset}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

### 4. URL State Management

**Filter Parameters**:
```
/order?timerange=last7days&status=preparing&page=2&limit=12
```

**Reading Params**:
```typescript
// Server Component
export default async function OrderHistoryPage({ searchParams }) {
  const params = await searchParams;
  const timerange = (params.timerange as TimeRange) || 'all';
  const status = params.status as OrderStatus | undefined;
  const page = parseInt(params.page || '1');
  const limit = parseInt(params.limit || '12');

  // Fetch data...
}
```

**Updating Params** (Client Component):
```typescript
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function OrderFilters({ /* props */ }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTimeRangeChange = (value: TimeRange) => {
    const params = new URLSearchParams(searchParams);
    params.set('timerange', value);
    params.delete('page'); // Reset to page 1
    router.push(`/order?${params.toString()}`);
  };

  // ...
}
```

---

### 5. Date & Currency Formatting

**Utility Functions** (`lib/order/utils.ts`):

```typescript
import { format } from 'date-fns';

export function formatOrderDate(dateString: string): string {
  return format(new Date(dateString), "MMM dd, yyyy, h:mm a");
  // Output: "Nov 23, 2025, 6:32 PM"
}

export function formatOrderDateFull(dateString: string): string {
  return format(new Date(dateString), "EEEE, dd MMM yyyy - hh:mm a");
  // Output: "Saturday, 22 Nov 2025 - 09:03 PM"
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount);
  // Output: "£52.11"
}

export function formatOrderId(orderId: string): string {
  // Truncate to first 8 characters with ellipsis
  return `#${orderId.substring(0, 8)}`;
  // Output: "#6921D7CD"
}
```

---

### 6. Status Configuration

**Constants** (`lib/order/constants.ts`):

```typescript
import {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ChefHat,
  PackageCheck,
  Truck,
  Home,
} from 'lucide-react';
import { OrderStatus } from '@/types/order';

export const ORDER_STATUS_CONFIG: Record<OrderStatus, {
  label: string;
  icon: LucideIcon;
  color: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
}> = {
  initiated: {
    label: 'Initiated',
    icon: Clock,
    color: 'gray',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    textClass: 'text-gray-700 dark:text-gray-300',
    borderClass: 'border-gray-200 dark:border-gray-700',
  },
  payment_confirmed: {
    label: 'Payment Confirmed',
    icon: CheckCircle,
    color: 'green',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-400',
    borderClass: 'border-green-200 dark:border-green-800',
  },
  payment_error: {
    label: 'Payment Error',
    icon: AlertCircle,
    color: 'red',
    bgClass: 'bg-red-100 dark:bg-red-900/30',
    textClass: 'text-red-700 dark:text-red-400',
    borderClass: 'border-red-200 dark:border-red-800',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'gray',
    bgClass: 'bg-gray-100 dark:bg-gray-800',
    textClass: 'text-gray-700 dark:text-gray-300',
    borderClass: 'border-gray-200 dark:border-gray-700',
  },
  preparing: {
    label: 'Preparing',
    icon: ChefHat,
    color: 'yellow',
    bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
    textClass: 'text-yellow-700 dark:text-yellow-400',
    borderClass: 'border-yellow-200 dark:border-yellow-800',
  },
  ready_to_pickup: {
    label: 'Ready to Pickup',
    icon: PackageCheck,
    color: 'blue',
    bgClass: 'bg-blue-100 dark:bg-blue-900/30',
    textClass: 'text-blue-700 dark:text-blue-400',
    borderClass: 'border-blue-200 dark:border-blue-800',
  },
  on_the_way: {
    label: 'On the Way',
    icon: Truck,
    color: 'orange',
    bgClass: 'bg-orange-100 dark:bg-orange-900/30',
    textClass: 'text-orange-700 dark:text-orange-400',
    borderClass: 'border-orange-200 dark:border-orange-800',
  },
  delivered: {
    label: 'Delivered',
    icon: Home,
    color: 'green',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    textClass: 'text-green-700 dark:text-green-400',
    borderClass: 'border-green-200 dark:border-green-800',
  },
};

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status]?.label || status;
}

export function getStatusIcon(status: OrderStatus): LucideIcon {
  return ORDER_STATUS_CONFIG[status]?.icon || Clock;
}

export function getStatusColor(status: OrderStatus): string {
  return ORDER_STATUS_CONFIG[status]?.color || 'gray';
}
```

---

### 7. Timeline Step Mapping

**Utility Function** (`lib/order/utils.ts`):

```typescript
export function getTimelineSteps(
  currentStatus: OrderStatus,
  statusList: OrderStatusAndTimeResponse[],
  deliveryType?: OrderDeliveryType
): TimelineStep[] {
  // Define step sequence based on delivery type
  const stepSequence: OrderStatus[] = deliveryType === 'pickup'
    ? ['payment_confirmed', 'preparing', 'ready_to_pickup', 'delivered']
    : ['payment_confirmed', 'preparing', 'on_the_way', 'delivered'];

  // Map to timeline steps
  return stepSequence.map((status) => {
    const statusEntry = statusList.find((s) => s.status === status);
    const statusIndex = stepSequence.indexOf(status);
    const currentIndex = stepSequence.indexOf(currentStatus);

    return {
      status,
      label: getStatusLabel(status),
      icon: getStatusIcon(status),
      timestamp: statusEntry?.createdAt,
      isActive: status === currentStatus,
      isCompleted: statusIndex <= currentIndex,
    };
  });
}
```

---

### 8. Responsive Breakpoints

**Tailwind Configuration**:

| Breakpoint | Width | Grid Columns | Usage |
|------------|-------|--------------|-------|
| `sm` | 640px+ | 1 | Mobile landscape |
| `md` | 768px+ | 2 | Tablet |
| `lg` | 1024px+ | 3 | Desktop |
| `xl` | 1280px+ | 3 | Large desktop |

**Grid Example**:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {orders.map((order) => <OrderCard key={order._id} order={order} />)}
</div>
```

---

### 9. Accessibility

**Key Requirements**:

1. **Semantic HTML**: Use proper heading hierarchy (h1 → h2 → h3)
2. **ARIA Labels**: Add `aria-label` to icon-only buttons
3. **Keyboard Navigation**: All interactive elements accessible via Tab
4. **Focus Indicators**: Visible focus rings on all focusable elements
5. **Screen Reader Support**: Use `sr-only` class for screen reader text
6. **Color Contrast**: Minimum 4.5:1 for normal text
7. **Status Indication**: Don't rely on color alone (use icons + text)

**Example**:
```typescript
<button
  aria-label="Rate this order"
  onClick={handleRateOrder}
  className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
>
  <Star className="size-4" />
</button>
```

---

### 10. Performance Optimizations

**Server Component Benefits**:
- Zero JavaScript for presentational components
- Smaller client bundle
- Faster initial page load

**Client Component Optimization**:
- Use `'use client'` only where needed
- Minimize client component size
- Lazy load modals/dialogs

**Image Optimization**:
```typescript
import { CustomImage } from '@/components/ui/custom-image';

<CustomImage
  src={item.imageUrl}
  alt={item.name}
  width={80}
  height={80}
  className="rounded-lg"
/>
```

---

## Implementation Checklist

### Phase 1: Shared Components
- [ ] Create `components/order/shared/` directory
- [ ] Implement `OrderPageHeader` (premium header)
- [ ] Implement `OrderStatusBadge` (status badge with colors)
- [ ] Implement `OrderItemCard` (single item display)
- [ ] Implement `OrderItemsList` (items container)
- [ ] Implement `OrderSummaryDisplay` (wrapper for OrderSummary)
- [ ] Create `lib/order/utils.ts` (utility functions)
- [ ] Create `lib/order/constants.ts` (status config)

### Phase 2: History Screen
- [ ] Create `app/(protected)/order/` directory
- [ ] Implement `page.tsx` (Server Component)
- [ ] Implement `loading.tsx` (skeleton)
- [ ] Implement `error.tsx` (error boundary)
- [ ] Create `components/order/history/` directory
- [ ] Implement `OrderHistoryClient` (client wrapper)
- [ ] Implement `OrderCard` (order card with dropdown)
- [ ] Implement `OrderFilters` (filter controls)
- [ ] Implement `OrderGrid` (grid layout)
- [ ] Implement `OrderPagination` (pagination controls)

### Phase 3: Details Screen
- [ ] Create `app/(protected)/order/[orderId]/` directory
- [ ] Implement `page.tsx` (Server Component)
- [ ] Implement `loading.tsx` (skeleton)
- [ ] Implement `error.tsx` (error boundary)
- [ ] Create `components/order/details/` directory
- [ ] Implement `OrderDetailsHeader` (header with actions)
- [ ] Implement `OrderStatusTimeline` (status stepper)
- [ ] Implement `OrderActions` (action buttons)
- [ ] Implement `OrderInformation` (order info card)
- [ ] Implement `StoreDetails` (store info collapsible)
- [ ] Implement `DeliveryRiderDetails` (rider info collapsible)

### Phase 4: Success Screen
- [ ] Create `app/(protected)/order/[orderId]/success/` directory
- [ ] Implement `page.tsx` (Server Component)
- [ ] Implement `loading.tsx` (skeleton)
- [ ] Create `components/order/success/` directory
- [ ] Implement `SuccessHeading` (green success banner)
- [ ] Implement `SuccessActions` (action buttons)

### Phase 5: Failure Screen
- [ ] Create `app/(protected)/order/[orderId]/error/` directory
- [ ] Implement `page.tsx` (Server Component)
- [ ] Implement `loading.tsx` (skeleton)
- [ ] Create `components/order/failure/` directory
- [ ] Implement `FailureHeading` (red error banner)
- [ ] Implement `FailureActions` (action buttons)
- [ ] Implement `HelpCard` (support info card)

### Phase 6: Integration
- [ ] Add "Orders" link to header navigation
- [ ] Add "Orders" link to user dropdown
- [ ] Add "Orders" link to mobile nav drawer
- [ ] Create barrel export `components/order/index.ts`
- [ ] Update `@/` path imports

### Phase 7: Testing & Polish
- [ ] Test all screens on mobile, tablet, desktop
- [ ] Verify dark mode compatibility
- [ ] Run accessibility audit (axe DevTools)
- [ ] Test keyboard navigation
- [ ] Verify loading states
- [ ] Verify error boundaries
- [ ] Test filter state persistence
- [ ] Test pagination
- [ ] Performance audit (Lighthouse)

---

## Conclusion

This architecture provides a scalable, maintainable, and type-safe foundation for the Order Management feature. The clear separation between Server and Client Components ensures optimal performance, while the shared component library promotes consistency and reduces duplication.

**Key Strengths**:
1. **Modularity**: 19 focused components with single responsibilities
2. **Reusability**: 5 shared components used across all screens
3. **Type Safety**: Complete TypeScript interfaces for all props
4. **Performance**: Server-first rendering with minimal client JavaScript
5. **Maintainability**: Clear file structure and naming conventions
6. **Accessibility**: WCAG 2.1 AA compliance built-in
7. **Scalability**: Easy to add new features (ratings, reviews, etc.)

**Next Steps**: Begin implementation with Phase 1 (Shared Components) to establish the foundation, then proceed sequentially through Phases 2-5.

---

**Document Version**: 1.0
**Last Updated**: December 2, 2025
**Status**: Ready for Implementation
