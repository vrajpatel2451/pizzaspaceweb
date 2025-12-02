# Order Tickets System - Usage Guide

## Accessing the Tickets Page

### From Order Details
Users can access tickets for a specific order by navigating to:
```
/order/[orderId]/tickets
```

Example:
```typescript
// In a component
import { useRouter } from "next/navigation";

const router = useRouter();
router.push(`/order/${orderId}/tickets`);
```

### Adding a Link to Order Details Page
To add a "Support Tickets" link to the order details page:

```tsx
import Link from "next/link";

<Link
  href={`/order/${orderId}/tickets`}
  className="text-orange-500 hover:text-orange-600"
>
  View Support Tickets
</Link>
```

## Creating a Ticket

### Using the Dialog
The create ticket dialog is automatically available on the tickets page. Users can:

1. Click the "Create Ticket" button
2. Fill in the message (required, 10-1000 characters)
3. Optionally upload up to 5 images (max 5MB each)
4. Click "Create Ticket" to submit

### Programmatic Creation
To programmatically trigger ticket creation:

```typescript
import { CreateTicketDialog } from "@/components/order/tickets";

<CreateTicketDialog
  orderId={orderId}
  storeId={storeId}
  onSuccess={() => {
    // Handle success (e.g., show toast, refresh data)
    console.log("Ticket created successfully");
  }}
/>
```

## Displaying Tickets

### Standalone Ticket Grid
To display tickets without the full client wrapper:

```tsx
import { TicketGrid } from "@/components/order/tickets";

<TicketGrid
  tickets={ticketsArray}
  errorMessage={errorMessage} // optional
  onCreateTicket={handleCreateTicket} // optional, shows in empty state
/>
```

### Individual Ticket Card
To display a single ticket:

```tsx
import { TicketCard } from "@/components/order/tickets";

<TicketCard ticket={ticketData} />
```

## Pagination

The tickets system uses URL-based pagination:

```
/order/[orderId]/tickets?page=2
```

Pagination is handled automatically by the TicketsClient component. To change items per page, modify the page.tsx:

```typescript
const limit = Number(resolvedSearchParams.limit) || 12; // Change 12 to desired default
```

## Status Colors

The system uses color-coded status badges:

- **Open** (Yellow): `bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400`
- **Closed** (Green): `bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400`

## Error Handling

### Display Errors
Errors are automatically displayed in the TicketGrid component:

```tsx
<TicketGrid
  tickets={[]}
  errorMessage="Failed to load tickets. Please try again."
/>
```

### Form Validation Errors
Form validation errors are shown inline:
- Message too short: "Message must be at least 10 characters"
- Message too long: "Message must be less than 1000 characters"
- Too many images: "Maximum 5 images allowed"

## Customization

### Changing Grid Layout
Modify the grid columns in ticket-grid.tsx:

```tsx
// Current: 1 col mobile, 2 cols tablet, 3 cols desktop
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"

// Example: 2 cols mobile, 3 cols tablet, 4 cols desktop
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
```

### Changing Message Truncation Length
Modify MAX_PREVIEW_LENGTH in ticket-card.tsx:

```typescript
const MAX_PREVIEW_LENGTH = 120; // Change to desired length
```

### Changing Max Images
Modify maxFiles prop in create-ticket-dialog.tsx:

```tsx
<ImageUpload
  maxFiles={5} // Change to desired limit
  maxSizeMB={5} // Change file size limit
/>
```

## API Integration

### Fetch Tickets
```typescript
import { getOrderTickets } from "@/lib/api/orderTicket";

const response = await getOrderTickets(orderId, {
  currentPage: 1,
  limit: 12,
});

if (response.statusCode === 200) {
  const { data, meta } = response.data;
  // Use tickets data
}
```

### Create Ticket
```typescript
import { createTicket } from "@/lib/api/orderTicket";

const response = await createTicket({
  orderId: "123",
  storeId: "456",
  message: "I have an issue with my order",
  imageList: [], // Array of image URLs (upload not yet implemented)
});

if (response.statusCode === 200 || response.statusCode === 201) {
  // Success
}
```

## Loading States

### Show Loading Skeleton
```tsx
import { TicketGridSkeleton } from "@/components/order/tickets";

{isLoading ? (
  <TicketGridSkeleton count={6} />
) : (
  <TicketGrid tickets={tickets} />
)}
```

## Responsive Design

All components are fully responsive:

### Mobile (< 768px)
- Single column grid
- Stacked layout for ticket cards
- Touch-friendly buttons
- 2-column image preview grid

### Tablet (768px - 1024px)
- 2-column ticket grid
- Compact navigation

### Desktop (> 1024px)
- 3-column ticket grid
- Full pagination controls
- 3-column image preview grid

## Accessibility

All components follow WCAG accessibility guidelines:

- Proper ARIA labels
- Keyboard navigation support
- Focus management in dialogs
- Screen reader friendly status badges
- Color contrast compliance
- Error messages associated with form fields

## Best Practices

1. **Always provide orderId and storeId** when creating tickets
2. **Handle errors gracefully** with user-friendly messages
3. **Show loading states** during API calls
4. **Validate input** before submission
5. **Refresh data** after creating a ticket using `router.refresh()`
6. **Use TypeScript types** for type safety

## Common Patterns

### Add Tickets Link to Order Actions Menu
```tsx
<DropdownMenuItem asChild>
  <Link href={`/order/${orderId}/tickets`}>
    <MessageCircle className="mr-2 h-4 w-4" />
    Support Tickets
  </Link>
</DropdownMenuItem>
```

### Show Ticket Count Badge
```tsx
{ticketCount > 0 && (
  <Badge variant="warning">{ticketCount} open tickets</Badge>
)}
```

### Conditional Create Button
```tsx
{order.status !== "delivered" && (
  <CreateTicketDialog orderId={orderId} storeId={storeId} />
)}
```

## Future Integration Points

### When Image Upload is Implemented
Update create-ticket-dialog.tsx:

```typescript
// Replace this section
const imageUrls: string[] = [];

// With actual upload logic
const imageUrls = await uploadImages(data.images);
```

### Adding Real-time Updates
```typescript
// Use WebSocket or polling
useEffect(() => {
  const interval = setInterval(() => {
    router.refresh();
  }, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval);
}, [router]);
```

### Adding Notifications
```typescript
import { toast } from "sonner"; // or your notification system

onSuccess: () => {
  toast.success("Ticket created successfully!");
  router.refresh();
}
```
