# Order Management Components - Quick Reference

**Research Completed:** December 2, 2025
**Status:** Ready for Implementation

---

## Installation Command (Copy & Paste)

```bash
npx shadcn@latest add @shadcn/progress @shadcn/toggle-group @shadcn/badge @shadcn/accordion @shadcn/alert @shadcn/collapsible @shadcn/select @shadcn/dropdown-menu @shadcn/card
```

Then install animations:
```bash
npm install framer-motion
```

---

## Component Quick Map

### 1. Status Timeline (Order Progress)
- **Component:** Custom `OrderTracking` (provided in research doc)
- **Features:** Checkmarks, connecting lines, timestamps
- **No additional install needed** - uses Lucide icons + Tailwind

### 2. Filters
- **Time Range:** `Select` component (dropdown)
- **Status Multi-select:** `ToggleGroup` component
- **Premium Option:** Advanced Filters (21st.dev) with framer-motion

### 3. Card Grid
- **Base:** `Card` component
- **Grid Layout:** `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Dropdown Menu:** For card actions (View, Review, Report)

### 4. Status Badges
- **Base:** `Badge` component with variants
- **Colors:** Gray, Green, Red, Yellow, Blue, Orange (see color mapping in research doc)
- **Premium:** Animated Badge (21st.dev) with loading states

### 5. Order Details Sections
- **Collapsible:** `Accordion` or `Collapsible` component
- **Sections:** Store Details, Rider Details, Order Items
- **Smooth animations:** Built-in CSS transitions

### 6. Notifications
- **Alerts:** `Alert` component (default + destructive variant)
- **Modern Option:** `Sonner` toast notifications
- **Use for:** Success messages, error messages, order confirmations

---

## Installation Priority

### Phase 1 (Essential - Install First)
```bash
npx shadcn@latest add @shadcn/card @shadcn/badge @shadcn/select @shadcn/toggle-group @shadcn/dropdown-menu
```

### Phase 2 (Display Logic)
```bash
npx shadcn@latest add @shadcn/accordion @shadcn/alert @shadcn/progress
```

### Phase 3 (Optional Enhanced)
```bash
npx shadcn@latest add @shadcn/collapsible @shadcn/sonner
npm install framer-motion
```

---

## Key Code Snippets

### Order Status Badge Mapping
```typescript
const statusConfig = {
  initiated: { label: "Order Initiated", variant: "outline" },
  payment_confirmed: { label: "Payment Confirmed", variant: "default" },
  payment_error: { label: "Payment Failed", variant: "destructive" },
  preparing: { label: "Preparing", variant: "secondary" },
  on_the_way: { label: "On the Way", variant: "secondary" },
  delivered: { label: "Delivered", variant: "default" },
  cancelled: { label: "Cancelled", variant: "outline" },
}
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {orders.map(order => <OrderCard key={order.id} order={order} />)}
</div>
```

### Order Card with Dropdown
```tsx
<Card>
  <CardHeader className="flex flex-row justify-between">
    <div>
      <CardTitle>Order #{id}</CardTitle>
      <CardDescription>{date}</CardDescription>
    </div>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Review Order</DropdownMenuItem>
        <DropdownMenuItem>Report Issue</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </CardHeader>
  <CardContent>
    <Badge variant="secondary">{status}</Badge>
  </CardContent>
</Card>
```

### Timeline Implementation
```tsx
<OrderTracking
  steps={[
    { name: "Confirmed", timestamp: "14:23", isCompleted: true },
    { name: "Preparing", timestamp: "14:30", isCompleted: true },
    { name: "On the Way", timestamp: "Pending", isCompleted: false },
    { name: "Delivered", timestamp: "Pending", isCompleted: false },
  ]}
/>
```

### Filter Section
```tsx
<div className="flex gap-4">
  <Select>
    <SelectTrigger className="w-[180px]">
      <SelectValue placeholder="Time range" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All Time</SelectItem>
      <SelectItem value="7days">Last 7 Days</SelectItem>
      <SelectItem value="30days">Last 30 Days</SelectItem>
    </SelectContent>
  </Select>

  <ToggleGroup type="multiple">
    <ToggleGroupItem value="confirmed">Confirmed</ToggleGroupItem>
    <ToggleGroupItem value="preparing">Preparing</ToggleGroupItem>
    <ToggleGroupItem value="delivered">Delivered</ToggleGroupItem>
  </ToggleGroup>
</div>
```

---

## Files Created
- `/docs/order/research/component-research.md` - Full detailed research
- `/docs/order/research/SUMMARY.md` - This file

---

## Implementation Timeline

1. **Week 1:** Install components, create base order card component
2. **Week 2:** Implement filtering logic and state management
3. **Week 3:** Build order timeline and detail sections
4. **Week 4:** Add animations with framer-motion, polish UI
5. **Week 5:** Testing, accessibility audit, performance optimization

---

## Notes for Implementation

- All components are from `@shadcn` registry (stable, well-maintained)
- Order timeline needs custom component (code provided in full research)
- Color scheme matches pizza delivery context
- Responsive from mobile (1 col) to desktop (3 cols)
- All components support dark mode via Tailwind
- Icons from Lucide React already in project

---

## Support & References

- **Full Research:** `/docs/order/research/component-research.md`
- **shadcn/ui:** https://ui.shadcn.com
- **Radix UI:** https://www.radix-ui.com
- **Framer Motion:** https://www.framer.com/motion

Ready to implement! Start with Phase 1 installation.
