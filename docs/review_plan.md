# Order Review & Tickets - Development Plan

## Overview

This document outlines the comprehensive development plan for implementing Order Review and Order Tickets features. The plan is structured into sprints with multiple phases, each with assigned specialized agents and MCPs.

---

## Project Summary

| Feature | Description |
|---------|-------------|
| **Order Review** | Multi-faceted review system for order overall, delivery rider, and individual items |
| **Order Tickets** | Support ticket system for reporting order problems with image uploads |

### Existing Resources
- **APIs**: `lib/api/orderReview.ts`, `lib/api/orderTicket.ts` (already implemented)
- **Types**: `types/orderReview.ts`, `types/orderTicket.ts` (already defined)
- **Rating Component**: `components/composite/rating.tsx` (reusable, supports interactive mode)
- **Order Details Page**: `app/(protected)/order/[orderId]/page.tsx` (integration point)
- **Order History**: `components/order/history/` (pattern reference for tickets grid)

---

## Sprint 1: Order Review System

### Phase 1.1: Requirements Analysis & Component Architecture

| Item | Details |
|------|---------|
| **Agent** | `shadcn-requirements-analyzer` |
| **MCPs** | `shadcn`, `21st-dev` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Analyze review UI requirements (order, rider, items)
2. Identify required shadcn components (Dialog, Form, Textarea, etc.)
3. Map data flow: `CreateOrderReviewData` -> API -> `OrderReviewWithItemsResponse`
4. Design component hierarchy for review modal/dialog
5. Document accessibility requirements (ARIA, keyboard navigation)

**Deliverables:**
- Component breakdown document
- shadcn component list with installation commands
- Data flow diagram

---

### Phase 1.2: Component Research & Design

| Item | Details |
|------|---------|
| **Agent** | `shadcn-component-researcher` |
| **MCPs** | `shadcn`, `21st-dev` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Research Dialog/Modal patterns for multi-step review
2. Find rating UI inspiration from 21st.dev
3. Research form validation patterns
4. Explore tabbed/stepped UI for reviewing multiple entities
5. Get component examples and demos

**Deliverables:**
- Component inspiration references
- shadcn component examples
- Installation commands for required components

---

### Phase 1.3: Component Architecture Design

| Item | Details |
|------|---------|
| **Agent** | `nextjs-component-architect` |
| **MCPs** | `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Design `ReviewDialog` component hierarchy:
   ```
   ReviewDialog
   ├── ReviewDialogHeader
   ├── ReviewDialogTabs/Steps
   │   ├── OrderReviewSection
   │   ├── RiderReviewSection (conditional)
   │   └── ItemsReviewSection
   │       └── ItemReviewCard (for each item)
   ├── ReviewDialogFooter (submit/cancel)
   └── ReviewSubmissionState
   ```
2. Define prop interfaces and state management
3. Plan form state with react-hook-form
4. Design existing review display components

**Deliverables:**
- Component tree diagram
- TypeScript interfaces
- State management plan

---

### Phase 1.4: Implementation - shadcn Component Installation

| Item | Details |
|------|---------|
| **Agent** | `shadcn-quick-helper` |
| **MCPs** | `shadcn` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Install required shadcn components:
   - Dialog (if not installed)
   - Form
   - Textarea
   - Tabs (for multi-section review)
   - Progress (for step indicator)
   - ScrollArea (for items list)
2. Verify installations

**Deliverables:**
- All required shadcn components installed

---

### Phase 1.5: Implementation - Core Review Components

| Item | Details |
|------|---------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `shadcn`, `next-devtools` |
| **Duration** | 2 sub-phases |

**Tasks (Sub-phase 1):**
1. Create `components/order/review/` directory structure:
   ```
   components/order/review/
   ├── index.ts
   ├── review-dialog.tsx
   ├── review-form.tsx
   ├── order-review-section.tsx
   ├── rider-review-section.tsx
   ├── items-review-section.tsx
   ├── item-review-card.tsx
   └── review-submission-state.tsx
   ```
2. Implement `ReviewDialog` with Dialog component
3. Implement `ReviewForm` with react-hook-form + zod validation

**Tasks (Sub-phase 2):**
4. Implement `OrderReviewSection` (overall rating + message)
5. Implement `RiderReviewSection` (conditional, rating + message)
6. Implement `ItemsReviewSection` with scrollable items list
7. Implement `ItemReviewCard` (item image, name, rating, message)
8. Implement form submission with `createReview` API

**Deliverables:**
- Complete review dialog component suite
- Form validation with zod schemas
- API integration

---

### Phase 1.6: Implementation - Existing Review Display

| Item | Details |
|------|---------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `shadcn`, `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Create `components/order/review/display/`:
   ```
   display/
   ├── order-review-display.tsx
   ├── rider-review-display.tsx
   ├── item-review-badge.tsx
   └── review-summary-card.tsx
   ```
2. Implement read-only review display components
3. Style with "Reviewed" badges and rating stars
4. Handle empty/no-review states

**Deliverables:**
- Review display components for order details page

---

### Phase 1.7: Order Details Integration

| Item | Details |
|------|---------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `next-devtools`, `shadcn` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Modify `getOrderDetails` API or create parallel call to `getOrderReview`
2. Update `app/(protected)/order/[orderId]/page.tsx`:
   - Fetch review data alongside order data
   - Pass review data to child components
3. Add "Write Review" button in order details header (only if no existing review)
4. Integrate review display in:
   - `OrderInformation` component (overall review)
   - `DeliveryRiderDetails` component (rider review)
   - `OrderItemCard` component (per-item review badges)
5. Add `ReviewDialog` trigger

**Deliverables:**
- Integrated review system in order details page
- Conditional UI based on review existence

---

### Phase 1.8: Premium UX Polish

| Item | Details |
|------|---------|
| **Agent** | `premium-ux-designer` |
| **MCPs** | `21st-dev`, `shadcn` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Add micro-interactions to star rating selection
2. Implement smooth step transitions in dialog
3. Add success animation on review submission
4. Polish loading and error states
5. Enhance visual hierarchy and spacing

**Deliverables:**
- Premium, polished review UI experience

---

### Phase 1.9: Animations

| Item | Details |
|------|---------|
| **Agent** | `nextjs-animation-specialist` |
| **MCPs** | None (framer-motion based) |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Add dialog enter/exit animations
2. Implement rating star hover effects
3. Add form field focus animations
4. Create success confetti/celebration animation
5. Add staggered item reveal in items section

**Deliverables:**
- Smooth, delightful animations throughout review flow

---

### Phase 1.10: Accessibility Audit

| Item | Details |
|------|---------|
| **Agent** | `nextjs-accessibility-expert` |
| **MCPs** | `next-devtools`, `playwright` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Audit dialog focus management
2. Verify keyboard navigation (Tab, Enter, Escape)
3. Check screen reader announcements
4. Validate ARIA labels on rating inputs
5. Test with reduced motion preferences

**Deliverables:**
- WCAG 2.1 AA compliant review components

---

### Phase 1.11: Responsive Design

| Item | Details |
|------|---------|
| **Agent** | `nextjs-responsive-design` |
| **MCPs** | `playwright`, `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Optimize dialog for mobile (full-screen sheet)
2. Adjust rating component touch targets
3. Optimize items list for various screen sizes
4. Test form usability on mobile
5. Verify landscape/portrait orientations

**Deliverables:**
- Fully responsive review UI (mobile-first)

---

### Phase 1.12: Code Review

| Item | Details |
|------|---------|
| **Agent** | `nextjs-ui-reviewer` |
| **MCPs** | `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Review component quality and patterns
2. Validate TypeScript types and strictness
3. Check for performance issues
4. Verify proper error handling
5. Ensure consistent code style

**Deliverables:**
- Code review report with fixes applied

---

## Sprint 2: Order Tickets System

### Phase 2.1: Requirements Analysis

| Item | Details |
|------|---------|
| **Agent** | `shadcn-requirements-analyzer` |
| **MCPs** | `shadcn`, `21st-dev` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Analyze ticket creation requirements
2. Map ticket listing/pagination requirements
3. Identify file upload requirements
4. Design ticket status display (open/closed)
5. Document navigation flow from order details

**Deliverables:**
- Ticket feature requirements document
- Component breakdown

---

### Phase 2.2: Component Research

| Item | Details |
|------|---------|
| **Agent** | `shadcn-component-researcher` |
| **MCPs** | `shadcn`, `21st-dev` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Research grid/card patterns similar to order history
2. Find file upload UI patterns
3. Research ticket/issue card designs
4. Explore status badge patterns
5. Get pagination component examples

**Deliverables:**
- Component inspiration and examples

---

### Phase 2.3: Component Architecture

| Item | Details |
|------|---------|
| **Agent** | `nextjs-component-architect` |
| **MCPs** | `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Design ticket page structure:
   ```
   app/(protected)/order/[orderId]/tickets/
   ├── page.tsx (server component)
   └── loading.tsx

   components/order/tickets/
   ├── index.ts
   ├── tickets-client.tsx
   ├── ticket-grid.tsx
   ├── ticket-card.tsx
   ├── ticket-filters.tsx (optional)
   ├── ticket-pagination.tsx
   ├── create-ticket-dialog.tsx
   └── image-upload.tsx
   ```
2. Define prop interfaces
3. Plan API integration pattern

**Deliverables:**
- Component architecture document

---

### Phase 2.4: Implementation - Page & Grid

| Item | Details |
|------|---------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `shadcn`, `next-devtools` |
| **Duration** | 2 sub-phases |

**Tasks (Sub-phase 1):**
1. Create `app/(protected)/order/[orderId]/tickets/page.tsx`
2. Implement `TicketsClient` component (similar to `OrderHistoryClient`)
3. Implement `TicketGrid` with responsive grid layout
4. Implement `TicketCard` component:
   - Ticket message preview
   - Status badge (open/closed)
   - Created date
   - Image thumbnails
   - Closing message (if closed)

**Tasks (Sub-phase 2):**
5. Implement `TicketPagination` (reuse/adapt from order pagination)
6. Add empty state for no tickets
7. Add loading skeleton

**Deliverables:**
- Tickets listing page with pagination

---

### Phase 2.5: Implementation - Create Ticket Dialog

| Item | Details |
|------|---------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `shadcn`, `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Create `CreateTicketDialog` component
2. Implement form with:
   - Message textarea (required)
   - Image upload (multiple images)
3. Implement `ImageUpload` component:
   - Preview uploaded images
   - Remove image functionality
   - Max images limit
4. Integrate with `createTicket` API
5. Handle loading/success/error states

**Deliverables:**
- Complete ticket creation dialog

---

### Phase 2.6: Order Details Integration

| Item | Details |
|------|---------|
| **Agent** | `shadcn-implementation-builder` |
| **MCPs** | `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Update `OrderDetailsHeader` with "Report Problem" button
2. Implement navigation to `/order/[orderId]/tickets`
3. Add ticket count indicator (optional)
4. Ensure proper back navigation

**Deliverables:**
- Seamless navigation between order details and tickets

---

### Phase 2.7: Premium UX Polish

| Item | Details |
|------|---------|
| **Agent** | `premium-ux-designer` |
| **MCPs** | `21st-dev`, `shadcn` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Polish ticket card design
2. Enhance image upload UX
3. Add drag-and-drop for images
4. Polish status transitions
5. Improve empty states

**Deliverables:**
- Premium ticket UI experience

---

### Phase 2.8: Animations

| Item | Details |
|------|---------|
| **Agent** | `nextjs-animation-specialist` |
| **MCPs** | None (framer-motion based) |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Add ticket grid stagger animation
2. Implement image upload progress animations
3. Add card hover effects
4. Create dialog transitions
5. Add success state animations

**Deliverables:**
- Smooth animations for ticket system

---

### Phase 2.9: Accessibility Audit

| Item | Details |
|------|---------|
| **Agent** | `nextjs-accessibility-expert` |
| **MCPs** | `next-devtools`, `playwright` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Audit file upload accessibility
2. Verify grid navigation
3. Check image alt texts
4. Test with screen readers
5. Validate form accessibility

**Deliverables:**
- Accessible ticket components

---

### Phase 2.10: Responsive Design

| Item | Details |
|------|---------|
| **Agent** | `nextjs-responsive-design` |
| **MCPs** | `playwright`, `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Optimize grid for all breakpoints
2. Adjust card layout for mobile
3. Optimize image upload for touch
4. Test dialog on various devices
5. Verify pagination on mobile

**Deliverables:**
- Fully responsive ticket system

---

### Phase 2.11: Code Review

| Item | Details |
|------|---------|
| **Agent** | `nextjs-ui-reviewer` |
| **MCPs** | `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Review all ticket components
2. Validate TypeScript implementation
3. Check for security issues (file uploads)
4. Verify error handling
5. Ensure code consistency

**Deliverables:**
- Code review with fixes

---

## Sprint 3: Integration & Testing

### Phase 3.1: Forms Validation

| Item | Details |
|------|---------|
| **Agent** | `nextjs-forms-expert` |
| **MCPs** | `next-devtools` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Audit review form validation
2. Audit ticket form validation
3. Improve error messages
4. Add client + server validation
5. Test edge cases

**Deliverables:**
- Robust form validation

---

### Phase 3.2: Design System Consistency

| Item | Details |
|------|---------|
| **Agent** | `nextjs-design-system` |
| **MCPs** | `shadcn` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Verify color consistency
2. Check spacing/typography
3. Validate dark mode support
4. Ensure component consistency
5. Document any new tokens

**Deliverables:**
- Design system compliance report

---

### Phase 3.3: Performance Optimization

| Item | Details |
|------|---------|
| **Agent** | `nextjs-performance-optimizer` |
| **MCPs** | `next-devtools`, `playwright` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Optimize image loading/lazy loading
2. Check bundle size impact
3. Optimize dialog code splitting
4. Verify API call efficiency
5. Test Core Web Vitals

**Deliverables:**
- Performance optimized features

---

### Phase 3.4: Final UI Review

| Item | Details |
|------|---------|
| **Agent** | `nextjs-ui-reviewer` |
| **MCPs** | `next-devtools`, `playwright` |
| **Duration** | 1 sub-phase |

**Tasks:**
1. Complete end-to-end UI review
2. Cross-browser testing
3. Final accessibility check
4. User flow testing
5. Bug fixes and polish

**Deliverables:**
- Production-ready features

---

## Summary Tables

### Agent Usage by Sprint

| Agent | Sprint 1 | Sprint 2 | Sprint 3 |
|-------|----------|----------|----------|
| `shadcn-requirements-analyzer` | Phase 1.1 | Phase 2.1 | - |
| `shadcn-component-researcher` | Phase 1.2 | Phase 2.2 | - |
| `nextjs-component-architect` | Phase 1.3 | Phase 2.3 | - |
| `shadcn-quick-helper` | Phase 1.4 | - | - |
| `shadcn-implementation-builder` | Phase 1.5, 1.6, 1.7 | Phase 2.4, 2.5, 2.6 | - |
| `premium-ux-designer` | Phase 1.8 | Phase 2.7 | - |
| `nextjs-animation-specialist` | Phase 1.9 | Phase 2.8 | - |
| `nextjs-accessibility-expert` | Phase 1.10 | Phase 2.9 | - |
| `nextjs-responsive-design` | Phase 1.11 | Phase 2.10 | - |
| `nextjs-ui-reviewer` | Phase 1.12 | Phase 2.11 | Phase 3.4 |
| `nextjs-forms-expert` | - | - | Phase 3.1 |
| `nextjs-design-system` | - | - | Phase 3.2 |
| `nextjs-performance-optimizer` | - | - | Phase 3.3 |

### MCP Usage Summary

| MCP | Purpose | Used In |
|-----|---------|---------|
| `shadcn` | Component registry, installation, examples | Phases 1.1-1.8, 2.1-2.7, 3.2 |
| `21st-dev` | UI inspiration, premium components | Phases 1.1-1.2, 1.8, 2.1-2.2, 2.7 |
| `next-devtools` | Dev server, error detection, runtime info | Phases 1.3, 1.5-1.7, 1.10-1.12, 2.3-2.6, 2.9-2.11, 3.1, 3.3-3.4 |
| `playwright` | Browser testing, screenshots | Phases 1.10-1.11, 2.9-2.10, 3.3-3.4 |

### File Structure Overview

```
components/order/
├── review/
│   ├── index.ts
│   ├── review-dialog.tsx
│   ├── review-form.tsx
│   ├── order-review-section.tsx
│   ├── rider-review-section.tsx
│   ├── items-review-section.tsx
│   ├── item-review-card.tsx
│   ├── review-submission-state.tsx
│   └── display/
│       ├── order-review-display.tsx
│       ├── rider-review-display.tsx
│       ├── item-review-badge.tsx
│       └── review-summary-card.tsx
└── tickets/
    ├── index.ts
    ├── tickets-client.tsx
    ├── ticket-grid.tsx
    ├── ticket-card.tsx
    ├── ticket-pagination.tsx
    ├── create-ticket-dialog.tsx
    └── image-upload.tsx

app/(protected)/order/[orderId]/
├── page.tsx (update for reviews)
└── tickets/
    ├── page.tsx
    └── loading.tsx
```

---

## Execution Order

For optimal execution, phases should be run in order within each sprint. However, certain phases can be parallelized:

### Parallel Execution Opportunities

**Sprint 1:**
- Phases 1.1-1.2 can run in parallel (research phases)
- Phases 1.8-1.9 can run in parallel (polish phases)
- Phases 1.10-1.11 can run in parallel (audit phases)

**Sprint 2:**
- Phases 2.1-2.2 can run in parallel (research phases)
- Phases 2.7-2.8 can run in parallel (polish phases)
- Phases 2.9-2.10 can run in parallel (audit phases)

**Sprint 3:**
- Phases 3.1-3.3 can run in parallel

---

## Notes

1. **Existing Rating Component**: The `components/composite/rating.tsx` is already implemented with interactive mode support - reuse this for all rating inputs.

2. **API Ready**: Both `orderReview` and `orderTicket` APIs are already implemented in `lib/api/`.

3. **Pattern Reference**: Use `order-history-client.tsx` as a pattern for the tickets client component (pagination, filters, grid layout).

4. **Image Upload**: For ticket image uploads, consider using a file input with preview or integrate with an image service if available.

5. **Dark Mode**: All components must support dark mode out of the box (follow existing patterns).

---

## Next Steps

1. Review this plan and approve/modify phases as needed
2. Select starting phase (recommend Phase 1.1)
3. Invoke appropriate agent for selected phase
4. Track progress and iterate
