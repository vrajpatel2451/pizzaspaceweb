# Order Feature Implementation Plan

## Executive Summary

This plan outlines the implementation of the complete Order feature including Order History, Order Details, Order Success, and Order Failure screens. The implementation is organized into 4 sprints with parallel phases where possible.

---

## Feature Analysis

### Complexity: **Complex**
- **Estimated Components**: 15+ components
- **Screens**: 4 (History, Details, Success, Failure)
- **UI Elements**: Cards, Filters, Pagination, Status Timeline, Summary, Grid Layout

### Technical Requirements
- Protected routes (AuthGuard pattern already exists)
- Paginated API with filters (timerange, status)
- Reusable OrderSummary component (based on CartSummary)
- Status timeline/stepper visualization
- Responsive grid layout for order cards
- URL-based filter state management

### Existing Patterns to Leverage
- **Menu page heading style**: Badge + Headline with orange accent + decorative underline + subheadline
- **Cart OrderSummary**: Reusable for order billing display (same `CustomerBillingOnCart` type)
- **Protected routes**: `app/(protected)` layout with `AuthGuard`
- **Pagination**: `ProductPagination` component pattern
- **shadcn components**: Card, Badge, Button, Select, Separator, Dialog, etc.

---

## Sprint Overview

| Sprint | Focus | Duration | Phases |
|--------|-------|----------|--------|
| **Sprint 1** | Foundation & Shared Components | 2-3 days | Research, Architecture, Shared Components |
| **Sprint 2** | Order History Screen | 2-3 days | Implementation, Filters, Polish |
| **Sprint 3** | Order Details Screen | 2-3 days | Implementation, Status Timeline, Polish |
| **Sprint 4** | Success/Failure Screens & Final Polish | 2 days | Implementation, Accessibility, Review |

---

## Sprint 1: Foundation & Shared Components

### Phase 1.1: Component Research (PARALLEL)
**Agent**: `shadcn-component-researcher`

**Tasks**:
- Research shadcn stepper/timeline components for order status
- Research filter components (Select, DatePicker, ToggleGroup)
- Research card layouts and grid patterns
- Identify any 21st.dev components for premium status indicators
- Document available animation primitives for status transitions

**Deliverables**:
- Component research document with recommendations
- List of shadcn components to install
- 21st.dev component candidates

**Dependencies**: None

---

### Phase 1.2: Requirements Analysis (PARALLEL with 1.1)
**Agent**: `shadcn-requirements-analyzer`

**Tasks**:
- Analyze order spec and create structured requirements
- Map API response types to UI components
- Define filter state management approach
- Create component dependency graph
- Document data flow patterns

**Deliverables**:
- `requirements.md` with component breakdown
- State management decisions
- Filter parameter mapping

**Dependencies**: None

---

### Phase 1.3: Component Architecture
**Agent**: `nextjs-component-architect`

**Tasks**:
- Design component hierarchy for all 4 screens
- Define Server Component vs Client Component boundaries
- Plan shared component library under `components/order/`
- Define props interfaces for all components
- Plan file structure:
  ```
  app/(protected)/order/
    page.tsx                    # Order History
    loading.tsx
    [orderId]/
      page.tsx                  # Order Details
      loading.tsx
      success/page.tsx          # Order Success
      error/page.tsx            # Order Failure

  components/order/
    shared/
      order-page-header.tsx     # Reusable premium header
      order-item-card.tsx       # Single item display
      order-items-list.tsx      # List of items
      order-summary-display.tsx # Billing summary (wraps cart OrderSummary)
      order-status-badge.tsx    # Status badge with colors
    history/
      order-card.tsx            # Card for history grid
      order-filters.tsx         # Timerange + Status filters
      order-grid.tsx            # Grid container
      order-pagination.tsx      # Pagination controls
    details/
      order-heading.tsx         # Order # + date + actions
      order-status-timeline.tsx # Visual status stepper
      order-information.tsx     # Status, payment info
      store-details.tsx         # Store information card
      delivery-rider-details.tsx# Rider info (conditional)
    success/
      success-heading.tsx       # Green accent header
      success-actions.tsx       # View Details + Order More
    failure/
      failure-heading.tsx       # Red accent header
      failure-actions.tsx       # Contact Support + View Details + Order More
      help-card.tsx             # Need Help? card
  ```

**Deliverables**:
- Architecture document with component tree
- Props interfaces for each component
- Server/Client boundary decisions

**Dependencies**: Phase 1.1, Phase 1.2

---

### Phase 1.4: Shared Components Implementation
**Agent**: `shadcn-implementation-builder`

**Tasks**:
- Implement `order-page-header.tsx` (following menu page pattern)
- Implement `order-status-badge.tsx` with status color mapping
- Implement `order-item-card.tsx` (name, variant, addons, price, quantity)
- Implement `order-items-list.tsx` as container
- Implement `order-summary-display.tsx` wrapper around existing OrderSummary

**Deliverables**:
- 5 shared components with full TypeScript types
- Storybook-ready components (if applicable)

**Dependencies**: Phase 1.3

---

## Sprint 2: Order History Screen

### Phase 2.1: Order History Implementation
**Agent**: `shadcn-implementation-builder`

**Tasks**:
- Create `app/(protected)/order/page.tsx` (Server Component for initial data)
- Implement `order-card.tsx`:
  - Order ID (truncated with `#` prefix)
  - Date/time formatted
  - Total amount with currency
  - Item count
  - Status badge
  - Store name
  - Dropdown menu (View Details, Review Order, Have a Problem)
- Implement `order-grid.tsx` with responsive columns:
  - Mobile: 1 column
  - Tablet: 2 columns
  - Desktop: 3 columns
- Implement `order-pagination.tsx` following ProductPagination pattern

**Content Reference** (from order_card.png):
- Card shows: Order ID, date, price, item count, status badge, store name
- Dropdown with: View Details, Review Order, Have a Problem (red)

**Deliverables**:
- Order history page with grid layout
- Order card component
- Pagination integration

**Dependencies**: Sprint 1

---

### Phase 2.2: Filter Implementation (PARALLEL with 2.1)
**Agent**: `nextjs-forms-expert`

**Tasks**:
- Implement `order-filters.tsx`:
  - Timerange dropdown (All Time, Last 7 Days, Last 30 Days, Last 90 Days, Last Year)
  - Status filter (interactive chips or toggle group)
- Handle URL search params for filter state
- Implement filter reset functionality
- Handle API query param generation

**Filter Logic**:
```typescript
// Timerange to API params mapping
const timeRangeMap = {
  'all': { startTime: undefined, endTime: undefined },
  'last7days': { startTime: subDays(new Date(), 7), endTime: new Date() },
  'last30days': { startTime: subDays(new Date(), 30), endTime: new Date() },
  'last90days': { startTime: subDays(new Date(), 90), endTime: new Date() },
  'lastyear': { startTime: subYears(new Date(), 1), endTime: new Date() },
};
```

**Deliverables**:
- Filter component with URL state sync
- API query param generation

**Dependencies**: Sprint 1

---

### Phase 2.3: Responsive & Animation Polish
**Agent**: `nextjs-responsive-design` + `nextjs-animation-specialist`

**Tasks**:
- Ensure mobile-first responsive layout
- Add stagger animation for card grid appearance
- Add hover states for cards
- Add filter transition animations
- Implement skeleton loading states

**Deliverables**:
- Responsive breakpoint adjustments
- Framer Motion animations for cards
- Loading skeleton component

**Dependencies**: Phase 2.1, Phase 2.2

---

## Sprint 3: Order Details Screen

### Phase 3.1: Order Details Implementation
**Agent**: `shadcn-implementation-builder`

**Tasks**:
- Create `app/(protected)/order/[orderId]/page.tsx`
- Implement `order-heading.tsx`:
  - Order ID display (Order #XXXXXX)
  - Placed date/time
  - Actions: Rate Order, Have Problem, Back to Orders
- Implement `order-information.tsx`:
  - Status badge
  - Payment method (icon + text)
  - Payment Reference ID (copyable)
- Implement `store-details.tsx`:
  - Collapsible card
  - Store name, phone, address, email
- Implement `delivery-rider-details.tsx`:
  - Conditional render (only if rider exists)
  - Name, email display

**Content Reference** (from order_details.png):
- Heading with Order ID + date + Rate Order/Have Problem buttons + Back to Orders
- Order Status timeline
- Order Items section
- Order Summary section
- Order Information (status, payment method, ref ID)
- Store Details (collapsible)
- Delivery Rider Details (collapsible)

**Deliverables**:
- Order details page layout
- All section components

**Dependencies**: Sprint 1

---

### Phase 3.2: Status Timeline Implementation
**Agent**: `nextjs-animation-specialist`

**Tasks**:
- Implement `order-status-timeline.tsx`:
  - Steps: Confirmed, Preparing, On the Way, Delivered
  - Visual progress indicator (line connecting steps)
  - Active step highlighted with icon
  - Completed steps with checkmark
  - Timestamps for completed steps
  - Icon for each status (CheckCircle, Package, Truck, Home)
- Handle status mapping from API:
  ```typescript
  const statusSteps = [
    { key: 'payment_confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: Package },
    { key: 'on_the_way', label: 'On the Way', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: Home },
  ];
  ```
- Animate step transitions

**Deliverables**:
- Animated status timeline component
- Status-to-step mapping logic

**Dependencies**: Phase 3.1

---

### Phase 3.3: Details Page Layout & Polish
**Agent**: `nextjs-responsive-design`

**Tasks**:
- Two-column layout on desktop (items/summary | info sections)
- Single column on mobile with proper ordering
- Collapsible sections for store/rider details
- Sticky order summary on desktop
- Print-friendly styles (optional)

**Deliverables**:
- Responsive layout implementation
- Collapsible section behavior

**Dependencies**: Phase 3.1, Phase 3.2

---

## Sprint 4: Success/Failure Screens & Final Polish

### Phase 4.1: Success Screen Implementation
**Agent**: `shadcn-implementation-builder`

**Tasks**:
- Create `app/(protected)/order/[orderId]/success/page.tsx`
- Implement `success-heading.tsx`:
  - Green accent background
  - Success icon (CheckCircle in green)
  - "Order Placed Successfully!" headline
  - Thank you message
  - Order ID display
- Implement `success-actions.tsx`:
  - View Details button (primary, orange)
  - Order More button (outline)

**Content Reference** (from order_success.png):
- Green banner with checkmark icon
- "Order Placed Successfully!" with confetti emoji
- Thank you message
- Order ID
- Order Items list
- Order Summary
- Two buttons: View Details (orange) | Order More (outline)

**Deliverables**:
- Success page with all components
- Navigation to order details

**Dependencies**: Sprint 1, Sprint 3

---

### Phase 4.2: Failure Screen Implementation (PARALLEL with 4.1)
**Agent**: `shadcn-implementation-builder`

**Tasks**:
- Create `app/(protected)/order/[orderId]/error/page.tsx`
- Implement `failure-heading.tsx`:
  - Red accent background
  - Error icon (XCircle in red)
  - "Order Error" headline
  - Issue message
  - Order ID display
- Implement `failure-actions.tsx`:
  - Contact Support button (primary, orange)
  - Order More button (outline)
- Implement `help-card.tsx`:
  - "Need Help?" heading
  - Support contact information
  - Light blue/gray background

**Content Reference** (from order_failure.png):
- Red banner with X icon
- "Order Error" headline
- Issue message about contacting support
- Order ID
- Order Items list
- Order Summary
- Two buttons: Contact Support (orange) | Order More (outline)
- "Need Help?" card with support info

**Deliverables**:
- Failure page with all components
- Help card with contact options

**Dependencies**: Sprint 1

---

### Phase 4.3: Header Navigation Update
**Agent**: `shadcn-implementation-builder`

**Tasks**:
- Add "Orders" link to header navigation (for authenticated users)
- Add Orders link to user dropdown menu
- Update mobile nav drawer with Orders link

**Files to Update**:
- `/components/layout/header/header-client.tsx`
- `/components/layout/header/user-dropdown.tsx`
- `/components/layout/header/mobile-nav-drawer.tsx`

**Deliverables**:
- Updated navigation with Orders link

**Dependencies**: None (can run in parallel)

---

### Phase 4.4: Accessibility Audit
**Agent**: `nextjs-accessibility-expert`

**Tasks**:
- Audit all order components for WCAG 2.1 AA compliance
- Ensure proper heading hierarchy (h1 -> h2 -> h3)
- Add aria-labels for interactive elements
- Test keyboard navigation for filters, cards, timeline
- Ensure color contrast for status badges
- Add screen reader announcements for filter changes
- Test with VoiceOver/NVDA

**Deliverables**:
- Accessibility fixes applied
- Audit report with pass/fail

**Dependencies**: All implementation phases

---

### Phase 4.5: Final Review
**Agent**: `nextjs-ui-reviewer`

**Tasks**:
- Code quality review
- Performance audit (bundle size, rendering)
- Type safety verification
- Consistent naming conventions
- Error handling coverage
- Loading state completeness
- Dark mode verification

**Deliverables**:
- Review report with findings
- Final fixes applied

**Dependencies**: Phase 4.4

---

## Component Dependency Graph

```
order-page-header
    |
order-status-badge
    |
order-item-card
    |
order-items-list
    |
order-summary-display (wraps cart/order-summary.tsx)

History Screen:
order-filters -> order-grid -> order-card -> order-pagination

Details Screen:
order-heading -> order-status-timeline
                -> order-items-list
                -> order-summary-display
                -> order-information
                -> store-details
                -> delivery-rider-details

Success Screen:
success-heading -> order-items-list
                -> order-summary-display
                -> success-actions

Failure Screen:
failure-heading -> order-items-list
                -> order-summary-display
                -> failure-actions
                -> help-card
```

---

## Parallel Execution Opportunities

### Sprint 1
- Phase 1.1 (Research) || Phase 1.2 (Requirements) - No dependencies

### Sprint 2
- Phase 2.1 (History Page) || Phase 2.2 (Filters) - Can build simultaneously

### Sprint 3
- No significant parallel opportunities (sequential implementation)

### Sprint 4
- Phase 4.1 (Success) || Phase 4.2 (Failure) - Independent screens
- Phase 4.3 (Header) - Can run anytime

---

## API Integration Notes

### Existing APIs (from lib/api/order.ts)
- `getOrders(params: OrderQueryParams)` - Paginated order list
- `getOrderDetails(orderId: string)` - Single order details
- `createOrder(orderData: CheckoutRequest)` - Create new order

### Filter Parameter Mapping
```typescript
interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;          // Search on orderId
  startTime?: string;       // ISO date string
  endTime?: string;         // ISO date string
  status?: OrderStatus;     // Filter by status
  storeId?: string;
  sortBy?: string;          // default: updatedDate
  sortOrder?: 'asc' | 'desc'; // default: desc
}
```

---

## Status Color Mapping

```typescript
const statusColors: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  initiated: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  payment_confirmed: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  payment_error: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' },
  preparing: { bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-200' },
  ready_to_pickup: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  on_the_way: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  delivered: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
};
```

---

## Estimated Timeline

| Sprint | Duration | Cumulative |
|--------|----------|------------|
| Sprint 1 | 2-3 days | 2-3 days |
| Sprint 2 | 2-3 days | 4-6 days |
| Sprint 3 | 2-3 days | 6-9 days |
| Sprint 4 | 2 days | 8-11 days |

**Total Estimated Duration**: 8-11 days

---

## Quick Start

To begin implementation, invoke the first agent:

### Sprint 1, Phase 1.1
**Agent**: `shadcn-component-researcher`

```
Research shadcn and 21st.dev components for an order management feature:

1. Status timeline/stepper components for visualizing order progress
2. Filter components (Select, DatePicker, ToggleGroup) for order history filters
3. Card grid layouts for order history display
4. Badge variants for different order statuses
5. Collapsible/accordion components for order detail sections

Context:
- Building order history, details, success, and failure screens
- Need premium polish matching existing menu page design
- Status states: initiated, payment_confirmed, payment_error, cancelled, preparing, ready_to_pickup, on_the_way, delivered

Provide component recommendations with installation commands and usage examples.
```

---

## Files to Create Summary

### App Routes (8 files)
- `app/(protected)/order/page.tsx`
- `app/(protected)/order/loading.tsx`
- `app/(protected)/order/[orderId]/page.tsx`
- `app/(protected)/order/[orderId]/loading.tsx`
- `app/(protected)/order/[orderId]/success/page.tsx`
- `app/(protected)/order/[orderId]/success/loading.tsx`
- `app/(protected)/order/[orderId]/error/page.tsx`
- `app/(protected)/order/[orderId]/error/loading.tsx`

### Shared Components (5 files)
- `components/order/shared/order-page-header.tsx`
- `components/order/shared/order-item-card.tsx`
- `components/order/shared/order-items-list.tsx`
- `components/order/shared/order-summary-display.tsx`
- `components/order/shared/order-status-badge.tsx`

### History Components (4 files)
- `components/order/history/order-card.tsx`
- `components/order/history/order-filters.tsx`
- `components/order/history/order-grid.tsx`
- `components/order/history/order-pagination.tsx`

### Details Components (5 files)
- `components/order/details/order-heading.tsx`
- `components/order/details/order-status-timeline.tsx`
- `components/order/details/order-information.tsx`
- `components/order/details/store-details.tsx`
- `components/order/details/delivery-rider-details.tsx`

### Success Components (2 files)
- `components/order/success/success-heading.tsx`
- `components/order/success/success-actions.tsx`

### Failure Components (3 files)
- `components/order/failure/failure-heading.tsx`
- `components/order/failure/failure-actions.tsx`
- `components/order/failure/help-card.tsx`

### Index Exports (1 file)
- `components/order/index.ts`

**Total New Files**: ~28 files
