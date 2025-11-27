# Contact Section - Component Structure

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     Light Gray-Blue Background               │
│                     (with subtle grid pattern)               │
│                                                               │
│                  ┌───────────────────┐                       │
│                  │  Get In Touch     │  (Orange Badge)       │
│                  └───────────────────┘                       │
│                                                               │
│                      Contact Us                              │
│                      (Title - Bold)                          │
│                                                               │
│        Have questions or want to make a reservation?         │
│              We'd love to hear from you.                     │
│                   (Description Text)                         │
│                                                               │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐        │
│  │    📞      │    │    ✉️       │    │    📍      │        │
│  │ (Phone)    │    │  (Email)    │    │  (MapPin)  │        │
│  │            │    │             │    │            │        │
│  │  Call Us   │    │  Email Us   │    │  Visit Us  │        │
│  │            │    │             │    │            │        │
│  │+1 234 567  │    │info@pizza   │    │123 Pizza   │        │
│  │    8900    │    │space.com    │    │  Street    │        │
│  │            │    │             │    │            │        │
│  │Mon-Sun:    │    │We'll respond│    │Food City,  │        │
│  │10AM - 11PM │    │within 24hrs │    │FC 12345    │        │
│  └────────────┘    └────────────┘    └────────────┘        │
│                                                               │
│               ┌────────────────────────┐                     │
│               │View Full Contact Page  │ (Orange Button)     │
│               └────────────────────────┘                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
ContactSection (index.tsx)
│
├── Background Layer (absolute positioning)
│   └── Subtle Grid Pattern Overlay
│
├── Container (relative positioning)
│   │
│   ├── Header Section
│   │   ├── Badge: "Get In Touch" (Orange, Rounded)
│   │   ├── Title: "Contact Us" (3xl, Bold)
│   │   └── Description: Paragraph (Gray)
│   │
│   ├── Contact Cards Grid (3 columns)
│   │   ├── ContactCard (Phone)
│   │   │   ├── Icon Circle (Orange Background)
│   │   │   │   └── Phone Icon (Orange)
│   │   │   ├── Title: "Call Us"
│   │   │   ├── Primary: "+1 234 567 8900"
│   │   │   └── Secondary: "Mon-Sun: 10AM - 11PM"
│   │   │
│   │   ├── ContactCard (Email)
│   │   │   ├── Icon Circle (Orange Background)
│   │   │   │   └── Mail Icon (Orange)
│   │   │   ├── Title: "Email Us"
│   │   │   ├── Primary: "info@pizzaspace.com"
│   │   │   └── Secondary: "We'll respond within 24hrs"
│   │   │
│   │   └── ContactCard (Location)
│   │       ├── Icon Circle (Orange Background)
│   │       │   └── MapPin Icon (Orange)
│   │       ├── Title: "Visit Us"
│   │       ├── Primary: "123 Pizza Street"
│   │       └── Secondary: "Food City, FC 12345"
│   │
│   └── CTA Section
│       └── Button Component (Orange, Large)
│           └── Link to /contact
```

## File Structure

```
components/home/contact-section/
│
├── index.tsx              # Main ContactSection Component
│   ├── Imports (Phone, Mail, MapPin from lucide-react)
│   ├── contactMethods Array (Data)
│   ├── ContactSection Component (Server Component)
│   │   ├── Section Wrapper (bg-slate-50, relative)
│   │   ├── Pattern Overlay (absolute)
│   │   ├── Container (relative)
│   │   ├── Header JSX
│   │   ├── Grid of ContactCard components
│   │   └── CTA Button
│   └── Export
│
└── contact-card.tsx       # Individual ContactCard Component
    ├── TypeScript Interfaces
    │   ├── ContactMethod (id, icon, title, primary, secondary)
    │   └── ContactCardProps (method)
    ├── ContactCard Component
    │   ├── Icon Circle Container
    │   ├── Icon Component (dynamic)
    │   ├── Title Display
    │   ├── Primary Info Display
    │   └── Secondary Info Display
    └── Export
```

## Data Flow

```
contactMethods Array (Static Data)
        │
        ├── Method 1: Phone
        ├── Method 2: Email
        └── Method 3: MapPin
        │
        ▼
Array.map() in ContactSection
        │
        ▼
ContactCard Component (Receives method prop)
        │
        ├── Destructure: icon, title, primary, secondary
        │
        ▼
Render Individual Card
```

## Responsive Breakpoints

```
Mobile (< md: 768px):
┌─────────────────┐
│   Icon Circle   │
│     Title       │
│    Primary      │
│   Secondary     │
└─────────────────┘
┌─────────────────┐
│   Icon Circle   │
│     Title       │
│    Primary      │
│   Secondary     │
└─────────────────┘
┌─────────────────┐
│   Icon Circle   │
│     Title       │
│    Primary      │
│   Secondary     │
└─────────────────┘

Desktop (>= md: 768px):
┌─────────┐  ┌─────────┐  ┌─────────┐
│  Icon   │  │  Icon   │  │  Icon   │
│  Title  │  │  Title  │  │  Title  │
│ Primary │  │ Primary │  │ Primary │
│Secondary│  │Secondary│  │Secondary│
└─────────┘  └─────────┘  └─────────┘
```

## Color Scheme

```
Background Layer:
- Base: #f8fafc (slate-50)
- Pattern: rgba(0,0,0,0.02) grid lines

Badge:
- Background: #f97316 (orange-500)
- Text: #ffffff (white)

Headings:
- Title: #1e293b (slate-800)

Body Text:
- Primary: #334155 (slate-700)
- Secondary: #6b7280 (gray-500)
- Description: #4b5563 (gray-600)

Icon Circles:
- Background: #fed7aa (orange-100)
- Icon: #f97316 (orange-500)

Button:
- Background: #f97316 (orange-500)
- Hover: #ea580c (orange-600)
- Text: #ffffff (white)
```

## Spacing & Sizing

```
Section Padding:
- Vertical: py-16 (4rem)

Container:
- Max Width: container (responsive)
- Horizontal Padding: px-4 (1rem)

Header:
- Bottom Margin: mb-12 (3rem)
- Description Max Width: max-w-xl (36rem)

Contact Cards Grid:
- Gap: gap-8 (2rem)
- Max Width: max-w-4xl (56rem)
- Bottom Margin: mb-10 (2.5rem)

Icon Circle:
- Size: 56px × 56px (w-14 h-14)
- Bottom Margin: mb-4 (1rem)

Icon:
- Size: 24px × 24px (w-6 h-6)

Title:
- Bottom Margin: mb-2 (0.5rem)
```

## Component States

```
ContactSection:
- Static (Server Component)
- No client-side state

ContactCard:
- Static (No hover/active states)
- Pure presentation component

Button (CTA):
- Default State (Orange background)
- Hover State (Darker orange)
- Focus State (Ring outline)
- Active State (Scale down slightly)
```

## Dependencies

```
External Libraries:
├── lucide-react (Icons)
│   ├── Phone
│   ├── Mail
│   └── MapPin
│
├── next/link (Navigation)
│
└── @/components/ui/button (Button Component)

Internal Dependencies:
└── ./contact-card (ContactCard Component)
```

## Props & Interfaces

```typescript
// ContactMethod Interface
interface ContactMethod {
  id: number;              // Unique identifier
  icon: LucideIcon;        // Lucide icon component
  title: string;           // "Call Us", "Email Us", etc.
  primary: string;         // Main contact info
  secondary: string;       // Additional info
}

// ContactCardProps Interface
interface ContactCardProps {
  method: ContactMethod;   // Single contact method object
}

// ContactSection Props
// (No props - static component)

// ContactCard Props
ContactCardProps {
  method: ContactMethod
}
```

## Accessibility Features

```
Semantic HTML:
├── <section> (Main container)
├── <h2> (Section title)
├── <h3> (Card titles)
└── <p> (Text content)

Button Component:
├── Keyboard navigation (Tab, Enter)
├── Focus visible (Ring outline)
└── Proper link semantics (Next.js Link)

Icon Labels:
├── Contextual labeling (icon + title)
└── Descriptive surrounding text

Color Contrast:
├── Text on backgrounds: WCAG AA compliant
└── Icon colors: Sufficient contrast ratios
```

## Performance Characteristics

```
Server Component:
✓ No client-side JavaScript
✓ Static rendering
✓ Fast initial load

Bundle Size:
✓ Minimal CSS (Tailwind utilities)
✓ No runtime dependencies
✓ Tree-shakeable imports

Rendering:
✓ Server-side rendering
✓ Static generation compatible
✓ No hydration needed
```
