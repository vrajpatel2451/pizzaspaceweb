# Pizza Space Spec3 - Component Research & Implementation Guide

**Project:** Pizza Space Web
**Spec:** spec3.md - About, Contact, and Store Pages
**Date:** December 2024
**Framework:** Next.js 16 with React 19, Tailwind CSS 4
**Design System:** Orange (#F97316) + Navy (#0e182b) + Montserrat Font

---

## Table of Contents

1. [Overview](#overview)
2. [Already Installed Components](#already-installed-components)
3. [Map Integration Research](#map-integration-research)
4. [Team Cards Component](#team-cards-component)
5. [Timeline Component](#timeline-component)
6. [Filter & Search Patterns](#filter--search-patterns)
7. [Form Patterns & Validation](#form-patterns--validation)
8. [Installation Commands](#installation-commands)
9. [Integration Examples](#integration-examples)
10. [Design System Adherence](#design-system-adherence)

---

## Overview

The spec3 pages require building three main pages following the established home page design patterns:

- **About Page** - Hero, vision/mission, stores, team, testimonials, contact sections
- **Contact Page** - Map, contact info, contact form (2-3 sections)
- **Store Page** - Map with store markers, store grid, reservation forms (2-3 sections)

All pages must:
- Follow the home page design guidelines
- Support dark and light themes
- Be mobile responsive
- Use existing component library (shadcn/ui)
- Have no build or runtime errors
- Integrate links on home page

---

## Already Installed Components

The following shadcn/ui components are already available in the project:

| Component | Path | Status | Use Case |
|-----------|------|--------|----------|
| Button | `components/ui/button.tsx` | Ready | CTAs, form submissions |
| Input | `components/ui/input.tsx` | Ready | Text fields, search |
| Textarea | `components/ui/textarea.tsx` | Ready | Contact/feedback forms |
| Label | `components/ui/label.tsx` | Ready | Form labels |
| Checkbox | `components/ui/checkbox.tsx` | Ready | Consent forms |
| Select | `components/ui/select.tsx` | Ready | Dropdowns (store selection) |
| Dialog | `components/ui/dialog.tsx` | Ready | Modals (reservation dialogs) |
| Drawer | `components/ui/drawer.tsx` | Ready | Mobile-friendly side panels |
| Badge | `components/ui/badge.tsx` | Ready | Tags, status indicators |
| Tabs | `components/ui/tabs.tsx` | Ready | Content organization |
| Accordion | `components/ui/accordion.tsx` | Ready | FAQs, expandable content |
| Separator | `components/ui/separator.tsx` | Ready | Visual dividers |
| Skeleton | `components/ui/skeleton.tsx` | Ready | Loading states |
| Command | `components/ui/command.tsx` | Ready | Search/filter functionality |
| Popover | `components/ui/popover.tsx` | Ready | Dropdown menus |
| Calendar | `components/ui/calendar.tsx` | Ready | Date pickers (reservations) |
| Custom Image | `components/ui/custom-image.tsx` | Ready | Image optimization |

---

## Map Integration Research

### 1. Google Maps Integration

#### Library Choice: `@vis.gl/react-google-maps`

**Why this library:**
- Official Google Maps React library maintained by vis.gl
- Best practices for Next.js 16 integration
- Supports advanced features (markers, clusters, custom styling)
- Full TypeScript support
- Works with App Router

**Installation:**
```bash
npm install @vis.gl/react-google-maps
```

**Setup in Next.js 16:**

Create a wrapper provider component:

```tsx
// components/providers/google-maps-provider.tsx
"use client";

import { APIProvider } from "@vis.gl/react-google-maps";

interface GoogleMapsProviderProps {
  children: React.ReactNode;
}

export function GoogleMapsProvider({ children }: GoogleMapsProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (!apiKey) {
    console.warn("Google Maps API key not configured");
  }

  return (
    <APIProvider apiKey={apiKey} onCoreLibraryLoad={() => {}}>
      {children}
    </APIProvider>
  );
}
```

Add to `app/layout.tsx`:
```tsx
import { GoogleMapsProvider } from "@/components/providers/google-maps-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleMapsProvider>
          {/* existing providers */}
          {children}
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
```

#### Environment Setup:

`.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

#### Basic Map Component:

```tsx
// components/ui/map.tsx
"use client";

import { Map, Marker } from "@vis.gl/react-google-maps";
import { memo } from "react";

interface StoreLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone?: string;
}

interface MapProps {
  locations: StoreLocation[];
  onMarkerClick?: (location: StoreLocation) => void;
  className?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}

export const GoogleMap = memo(function GoogleMap({
  locations,
  onMarkerClick,
  className = "",
  zoom = 12,
  center = { lat: 51.5074, lng: -0.1278 }, // London default
}: MapProps) {
  return (
    <div className={`w-full h-96 rounded-lg overflow-hidden ${className}`}>
      <Map
        zoom={zoom}
        center={center}
        mapId="pizzaspace-map"
        className="w-full h-full"
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            onClick={() => onMarkerClick?.(location)}
            title={location.name}
          />
        ))}
      </Map>
    </div>
  );
});

GoogleMap.displayName = "GoogleMap";
```

#### Custom Marker Component:

```tsx
// components/ui/custom-marker.tsx
"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

interface CustomMarkerProps {
  lat: number;
  lng: number;
  label: string;
  onClick?: () => void;
}

export function CustomMarker({ lat, lng, label, onClick }: CustomMarkerProps) {
  return (
    <AdvancedMarker
      position={{ lat, lng }}
      onClick={onClick}
      title={label}
    >
      <Pin
        background="#F97316"
        glyphColor="#ffffff"
        borderColor="#ffffff"
      />
    </AdvancedMarker>
  );
}
```

#### Map Styling for Brand Colors:

```tsx
// lib/map-styles.ts
export const pizzaSpaceMapStyle = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#f5f5f5" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#c9d6d6" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#d5d5d5" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#626262" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#efefef" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f97316" }], // Brand orange
  },
];
```

### 2. Map Container for Store Pages

```tsx
// components/stores/store-map.tsx
"use client";

import { useState } from "react";
import { GoogleMap } from "@/components/ui/map";
import { Badge } from "@/components/ui/badge";

interface Store {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  deliveryTime?: string;
  rating?: number;
  openingHours?: string;
}

interface StoreMapProps {
  stores: Store[];
  onStoreSelect?: (store: Store) => void;
}

export function StoreMap({ stores, onStoreSelect }: StoreMapProps) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const handleMarkerClick = (store: Store) => {
    setSelectedStore(store);
    onStoreSelect?.(store);
  };

  const mapLocations = stores.map((store) => ({
    id: store.id,
    name: store.name,
    lat: store.lat,
    lng: store.lng,
    address: store.address,
    phone: store.phone,
  }));

  return (
    <div className="space-y-4">
      <GoogleMap
        locations={mapLocations}
        onMarkerClick={handleMarkerClick}
        className="h-[500px] md:h-[600px]"
      />

      {selectedStore && (
        <div className="p-4 border border-orange-200 dark:border-orange-500/20 rounded-lg bg-orange-50 dark:bg-orange-500/10">
          <h3 className="font-semibold text-lg mb-2">{selectedStore.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {selectedStore.address}
          </p>
          <a
            href={`tel:${selectedStore.phone}`}
            className="text-orange-600 dark:text-orange-400 font-medium hover:underline"
          >
            {selectedStore.phone}
          </a>
          {selectedStore.deliveryTime && (
            <Badge className="mt-3" variant="default">
              {selectedStore.deliveryTime}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Team Cards Component

### 1. Team Member Card with Hover Effects

**Key Features:**
- Professional image display using CustomImage
- Social links integration
- Bio reveal on hover with smooth animation
- Responsive grid layout
- Dark/light theme support

```tsx
// components/team/team-card.tsx
"use client";

import { motion } from "framer-motion";
import { CustomImage } from "@/components/ui/custom-image";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const SocialIcon = ({ platform }: { platform: string }) => {
    const iconProps = {
      size: 18,
      className:
        "text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors",
    };

    switch (platform) {
      case "twitter":
        return member.social?.twitter ? (
          <a
            href={`https://twitter.com/${member.social.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter {...iconProps} />
          </a>
        ) : null;
      case "linkedin":
        return member.social?.linkedin ? (
          <a
            href={member.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Linkedin {...iconProps} />
          </a>
        ) : null;
      case "github":
        return member.social?.github ? (
          <a
            href={member.social.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github {...iconProps} />
          </a>
        ) : null;
      case "email":
        return member.social?.email ? (
          <a href={`mailto:${member.social.email}`}>
            <Mail {...iconProps} />
          </a>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-xl bg-white dark:bg-navy-800 shadow-md hover:shadow-xl transition-shadow">
        {/* Image Container */}
        <div className="relative h-80 overflow-hidden bg-gray-200 dark:bg-gray-700">
          <CustomImage
            src={member.image}
            alt={member.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            priority={false}
          />

          {/* Overlay with Bio - Appears on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <p className="text-white text-sm text-center leading-relaxed">
              {member.bio}
            </p>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            {member.name}
          </h3>
          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-4">
            {member.role}
          </p>

          {/* Social Links */}
          <div className="flex gap-4">
            <SocialIcon platform="twitter" />
            <SocialIcon platform="linkedin" />
            <SocialIcon platform="github" />
            <SocialIcon platform="email" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
```

### 2. Team Grid Container

```tsx
// components/team/team-grid.tsx
"use client";

import { TeamCard } from "./team-card";
import { motion } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}

interface TeamGridProps {
  members: TeamMember[];
  title?: string;
  description?: string;
}

export function TeamGrid({
  members,
  title = "Meet Our Team",
  description = "The talented people behind Pizza Space",
}: TeamGridProps) {
  return (
    <section className="py-20 bg-white dark:bg-navy-900">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {description}
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 3. Image Optimization for Team Photos

**Best Practices:**
- Use CustomImage wrapper with proper dimensions
- Implement lazy loading for team photos below the fold
- Provide fallback images for failed loads
- Use WebP format when possible

```tsx
// App structure for images
// public/images/team/[name].jpg
// Recommended sizes: 400x500px (4:5 aspect ratio)

// In team-card.tsx, the CustomImage component automatically:
// - Handles errors with fallbacks
// - Lazy loads images
// - Provides responsive sizing
// - Optimizes for different devices
```

---

## Timeline Component

### 1. Vertical Timeline for Company Story

**Key Features:**
- Animated reveal on scroll
- Milestone markers with years
- Mobile-responsive layout
- Icon/color support
- Two-column layout for desktop

```tsx
// components/timeline/timeline.tsx
"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  color?: string; // defaults to orange
}

interface TimelineProps {
  items: TimelineItem[];
  title?: string;
}

export function Timeline({
  items,
  title = "Our Journey",
}: TimelineProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-navy-900 dark:to-navy-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Section Title */}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900 dark:text-white"
          >
            {title}
          </motion.h2>
        )}

        {/* Timeline Container */}
        <div className="relative">
          {/* Center Line - Hidden on Mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-200 via-orange-400 to-orange-200 dark:from-orange-900/30 dark:via-orange-600/50 dark:to-orange-900/30 -translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className={`md:flex md:${index % 2 === 0 ? "flex-row" : "flex-row-reverse"} md:gap-12`}
              >
                {/* Content - Desktop: Half width, Mobile: Full width */}
                <div className="md:w-1/2 order-2 md:order-none">
                  <div className="bg-white dark:bg-navy-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                    {/* Year Badge */}
                    <div className="inline-block mb-3">
                      <span className="bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 px-4 py-1 rounded-full text-sm font-bold">
                        {item.year}
                      </span>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center Marker */}
                <div className="md:w-auto flex justify-center md:block order-1 md:order-none mb-6 md:mb-0">
                  <motion.div
                    whileInView={{ scale: 1 }}
                    initial={{ scale: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="relative z-10"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-500 dark:bg-orange-600 border-4 border-white dark:border-navy-900 shadow-lg flex items-center justify-center text-white">
                      {item.icon ? (
                        item.icon
                      ) : (
                        <div className="w-3 h-3 bg-white rounded-full" />
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Empty space for layout */}
                <div className="md:w-1/2 hidden md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 2. Timeline Usage Example

```tsx
// components/about/company-timeline.tsx
"use client";

import { Timeline } from "@/components/timeline/timeline";
import { Zap, Rocket, Users, Globe } from "lucide-react";

export function CompanyTimeline() {
  const milestones = [
    {
      year: "2018",
      title: "Pizza Space Founded",
      description:
        "Started with a small pizzeria in central London with a passion for authentic Italian pizza and fresh ingredients.",
      icon: <Rocket size={20} />,
    },
    {
      year: "2019",
      title: "First Expansion",
      description:
        "Opened our second location and launched our online ordering platform for delivery.",
      icon: <Zap size={20} />,
    },
    {
      year: "2021",
      title: "Team Growth",
      description:
        "Expanded to 50+ team members across three locations and launched our mobile app.",
      icon: <Users size={20} />,
    },
    {
      year: "2023",
      title: "London-Wide Delivery",
      description:
        "Now delivering to the entire Greater London area with over 5 locations and counting.",
      icon: <Globe size={20} />,
    },
  ];

  return <Timeline items={milestones} />;
}
```

---

## Filter & Search Patterns

### 1. Store Filter with shadcn Command

**Pattern:** Uses existing Command component for searchable filtering

```tsx
// components/stores/store-filter.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Store {
  id: string;
  name: string;
  area: string;
  deliveryTime: number;
  rating: number;
  isOpen: boolean;
}

interface StoreFilterProps {
  stores: Store[];
  onFiltersChange: (filtered: Store[]) => void;
}

export function StoreFilter({ stores, onFiltersChange }: StoreFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get unique areas
  const areas = Array.from(new Set(stores.map((s) => s.area))).sort();

  // Filter stores based on criteria
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const matchesArea =
        selectedAreas.length === 0 || selectedAreas.includes(store.area);
      const matchesSearch =
        searchQuery === "" ||
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.area.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesArea && matchesSearch;
    });
  }, [stores, selectedAreas, searchQuery]);

  // Update parent when filters change
  useState(() => {
    onFiltersChange(filteredStores);
  }, [filteredStores, onFiltersChange]);

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search stores by name or area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-navy-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Area Filter Popover */}
      <div className="flex gap-2 flex-wrap">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="gap-2"
            >
              <MapPin size={16} />
              Filter by Area
              {selectedAreas.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedAreas.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="start" className="p-0 w-64">
            <Command>
              <CommandInput placeholder="Search areas..." />
              <CommandList>
                <CommandEmpty>No areas found</CommandEmpty>
                <CommandGroup>
                  {areas.map((area) => (
                    <CommandItem
                      key={area}
                      value={area}
                      onSelect={() => toggleArea(area)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-4 h-4 rounded border-2 transition-all",
                            selectedAreas.includes(area)
                              ? "bg-orange-500 border-orange-500"
                              : "border-gray-300 dark:border-gray-600"
                          )}
                        >
                          {selectedAreas.includes(area) && (
                            <CheckCircle2 size={16} className="text-white" />
                          )}
                        </div>
                        <span>{area}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Active Filters - Show as Badges */}
        {selectedAreas.map((area) => (
          <Badge
            key={area}
            variant="secondary"
            className="gap-2 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-500/20"
            onClick={() => toggleArea(area)}
          >
            {area}
            <span className="text-xs">×</span>
          </Badge>
        ))}
      </div>

      {/* Results Summary */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredStores.length} of {stores.length} stores
      </p>
    </div>
  );
}
```

### 2. Filter Chips/Tags Pattern

```tsx
// components/shared/filter-chips.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterChip {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterChipsProps {
  chips: FilterChip[];
  selectedChips: string[];
  onToggle: (chipId: string) => void;
  onClear: () => void;
}

export function FilterChips({
  chips,
  selectedChips,
  onToggle,
  onClear,
}: FilterChipsProps) {
  return (
    <div className="space-y-4">
      {/* Available Filters */}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <Badge
            key={chip.id}
            variant={selectedChips.includes(chip.id) ? "default" : "outline"}
            className="cursor-pointer px-3 py-2 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
            onClick={() => onToggle(chip.id)}
          >
            {chip.icon && <span className="mr-1">{chip.icon}</span>}
            {chip.label}
          </Badge>
        ))}
      </div>

      {/* Clear Button - Only show if filters selected */}
      {selectedChips.length > 0 && (
        <button
          onClick={onClear}
          className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium flex items-center gap-1"
        >
          <X size={16} />
          Clear all filters
        </button>
      )}
    </div>
  );
}
```

---

## Form Patterns & Validation

### 1. Contact Form with Validation

**Stack:**
- react-hook-form for state management
- Zod for schema validation
- shadcn components (Input, Textarea, Button)
- Sonner for toast notifications (already installed)

```tsx
// lib/validators/contact-form.ts
import * as z from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "Please enter a valid phone number"
    )
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must not exceed 100 characters"),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(1000, "Message must not exceed 1000 characters"),
  agreeToTerms: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

```tsx
// components/forms/contact-form.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  contactFormSchema,
  ContactFormData,
} from "@/lib/validators/contact-form";
import { Loader2 } from "lucide-react";

interface ContactFormProps {
  onSuccess?: () => void;
}

export function ContactForm({ onSuccess }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      agreeToTerms: false,
    },
  });

  async function onSubmit(data: ContactFormData) {
    setIsSubmitting(true);
    try {
      // Call your API endpoint
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to send message");

      toast.success("Message sent successfully!", {
        description: "We'll get back to you as soon as possible.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              {...field}
              disabled={isSubmitting}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>
        )}
      />

      {/* Email Field */}
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              {...field}
              disabled={isSubmitting}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        )}
      />

      {/* Phone Field */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 20 7123 4567"
              {...field}
              disabled={isSubmitting}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        )}
      />

      {/* Subject Field */}
      <Controller
        name="subject"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Inquiry about catering"
              {...field}
              disabled={isSubmitting}
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
          </div>
        )}
      />

      {/* Message Field */}
      <Controller
        name="message"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              rows={5}
              {...field}
              disabled={isSubmitting}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && (
              <p className="text-sm text-red-500">{errors.message.message}</p>
            )}
          </div>
        )}
      />

      {/* Terms Agreement */}
      <Controller
        name="agreeToTerms"
        control={control}
        render={({ field }) => (
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={isSubmitting}
            />
            <label
              htmlFor="terms"
              className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
            >
              I agree to be contacted about my inquiry and accept the privacy
              policy
            </label>
          </div>
        )}
      />
      {errors.agreeToTerms && (
        <Alert variant="destructive">
          <AlertDescription>{errors.agreeToTerms.message}</AlertDescription>
        </Alert>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </Button>
    </form>
  );
}
```

### 2. Reservation Form

```tsx
// components/forms/reservation-form.tsx
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const reservationSchema = z.object({
  guestName: z.string().min(2, "Name required"),
  email: z.string().email("Valid email required"),
  phone: z.string().regex(/^\+?[0-9]{10,}/, "Valid phone required"),
  date: z.string().refine((date) => new Date(date) > new Date(), "Date must be in future"),
  time: z.string(),
  partySize: z.string().refine((size) => parseInt(size) > 0 && parseInt(size) <= 20, "Party size must be 1-20"),
  specialRequests: z.string().optional(),
});

type ReservationData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  storeId: string;
  storeName: string;
  onSuccess?: () => void;
}

export function ReservationForm({
  storeId,
  storeName,
  onSuccess,
}: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guestName: "",
      email: "",
      phone: "",
      date: "",
      time: "19:00",
      partySize: "2",
      specialRequests: "",
    },
  });

  async function onSubmit(data: ReservationData) {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, storeId }),
      });

      if (!response.ok) throw new Error("Reservation failed");

      toast.success("Reservation confirmed!", {
        description: `Your table for ${data.partySize} is reserved at ${storeName}`,
      });
      reset();
      onSuccess?.();
    } catch (error) {
      toast.error("Reservation failed", {
        description: "Please try again or call the store directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="guestName"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="guest-name">Guest Name</Label>
            <Input
              id="guest-name"
              placeholder="Your name"
              {...field}
              disabled={isSubmitting}
            />
            {errors.guestName && (
              <p className="text-sm text-red-500">{errors.guestName.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="guest-email">Email</Label>
            <Input
              id="guest-email"
              type="email"
              placeholder="your@email.com"
              {...field}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="guest-phone">Phone</Label>
            <Input
              id="guest-phone"
              type="tel"
              placeholder="+44 20 7123 4567"
              {...field}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="guest-date">Date</Label>
              <Input
                id="guest-date"
                type="date"
                {...field}
                disabled={isSubmitting}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="time"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="guest-time">Time</Label>
              <Input
                id="guest-time"
                type="time"
                {...field}
                disabled={isSubmitting}
              />
              {errors.time && (
                <p className="text-sm text-red-500">{errors.time.message}</p>
              )}
            </div>
          )}
        />
      </div>

      <Controller
        name="partySize"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="party-size">Party Size</Label>
            <select
              id="party-size"
              {...field}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 20 }, (_, i) => i + 1).map((size) => (
                <option key={size} value={size.toString()}>
                  {size} {size === 1 ? "person" : "people"}
                </option>
              ))}
            </select>
            {errors.partySize && (
              <p className="text-sm text-red-500">{errors.partySize.message}</p>
            )}
          </div>
        )}
      />

      <Controller
        name="specialRequests"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="requests">Special Requests (Optional)</Label>
            <textarea
              id="requests"
              placeholder="Any special requests or dietary requirements?"
              rows={3}
              {...field}
              disabled={isSubmitting}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-navy-800 text-gray-900 dark:text-white"
            />
          </div>
        )}
      />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Reserving..." : "Confirm Reservation"}
      </Button>
    </form>
  );
}
```

### 3. Server Actions Integration for Next.js 16

**Best practices for Server Actions in Contact/Reservation forms:**

```tsx
// app/actions/contact-actions.ts
"use server";

import { contactFormSchema, type ContactFormData } from "@/lib/validators/contact-form";

export async function submitContactForm(data: ContactFormData) {
  try {
    // Validate data
    const validated = contactFormSchema.parse(data);

    // Send email or store in database
    // Example: send email via your email service
    // await sendContactEmail(validated);

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to send message. Please try again.",
    };
  }
}

export async function submitReservation(data: unknown) {
  try {
    // Validate and process reservation
    // await saveReservationToDatabase(data);

    return {
      success: true,
      message: "Reservation confirmed",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to create reservation",
    };
  }
}
```

**Client component using Server Action:**

```tsx
"use client";

import { submitContactForm } from "@/app/actions/contact-actions";

export function ContactFormWithServerAction() {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: ContactFormData) => {
    startTransition(async () => {
      const result = await submitContactForm(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  // ... rest of form
}
```

---

## Installation Commands

### New shadcn/ui Components to Install

Based on the research, **no new shadcn components are required** as all necessary components are already installed. However, for optimal functionality of the new features:

```bash
# All required components are already installed
# If you want to add additional utility components:

npx shadcn@latest add @shadcn/card @shadcn/form @shadcn/alert @shadcn/pagination @shadcn/avatar
```

### External Dependencies to Add

```bash
# Google Maps integration (required for About, Contact, and Store pages)
npm install @vis.gl/react-google-maps

# Already installed but verify:
npm list framer-motion react-hook-form zod @hookform/resolvers sonner
```

### Environment Configuration

Create `.env.local`:
```env
# Google Maps API Key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here

# API endpoints (if backend integration needed)
NEXT_PUBLIC_API_URL=https://your-api.com
```

**Getting a Google Maps API Key:**
1. Go to Google Cloud Console: https://console.cloud.google.com
2. Create a new project
3. Enable Maps JavaScript API and Places API
4. Create an API key with restrictions
5. Add to `.env.local`

---

## Integration Examples

### 1. About Page Structure

```tsx
// app/about/page.tsx
import { Metadata } from "next";
import { HeroSection } from "@/components/about/hero-section";
import { CompanyTimeline } from "@/components/about/company-timeline";
import { TeamGrid } from "@/components/team/team-grid";
import { TestimonialsSection } from "@/components/about/testimonials-section";
import { ContactSection } from "@/components/about/contact-section";

export const metadata: Metadata = {
  title: "About Pizza Space",
  description: "Learn about our story, mission, and the team behind Pizza Space",
};

export default function AboutPage() {
  return (
    <>
      <HeroSection />
      <CompanyTimeline />
      <TeamGrid members={teamMembers} />
      <TestimonialsSection />
      <ContactSection />
    </>
  );
}
```

### 2. Contact Page Structure

```tsx
// app/contact/page.tsx
import { Metadata } from "next";
import { HeroSection } from "@/components/contact/hero-section";
import { GoogleMap } from "@/components/ui/map";
import { ContactInfo } from "@/components/contact/contact-info";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact Us - Pizza Space",
  description: "Get in touch with Pizza Space for inquiries, catering, or feedback",
};

export default function ContactPage() {
  return (
    <>
      <HeroSection />

      <section className="py-20 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Map */}
            <GoogleMap locations={storeLocations} />

            {/* Contact Info & Form */}
            <div className="space-y-8">
              <ContactInfo />
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

### 3. Store Page Structure

```tsx
// app/stores/page.tsx
import { Metadata } from "next";
import { StoreMap } from "@/components/stores/store-map";
import { StoreFilter } from "@/components/stores/store-filter";
import { StoreGrid } from "@/components/stores/store-grid";
import { ReservationForm } from "@/components/forms/reservation-form";

export const metadata: Metadata = {
  title: "Our Stores - Pizza Space",
  description: "Find our Pizza Space locations across London",
};

export default function StoresPage() {
  return (
    <>
      <HeroSection />

      <section className="py-20 bg-white dark:bg-navy-900">
        <div className="container mx-auto px-4">
          {/* Map */}
          <StoreMap stores={stores} />

          {/* Filters */}
          <div className="mt-12">
            <StoreFilter stores={stores} onFiltersChange={handleFiltersChange} />
          </div>

          {/* Grid */}
          <StoreGrid stores={filteredStores} />
        </div>
      </section>
    </>
  );
}
```

---

## Design System Adherence

### 1. Color Palette Usage

- **Primary Orange:** #F97316 - CTAs, hover states, accents
- **Navy Background:** #0e182b - Dark mode backgrounds
- **Gray Neutrals:** Used for text hierarchy
- **Semantic Colors:** Success (#22C55E), Warning (#FBBF24), Error (#EF4444)

### 2. Typography

- **Font Family:** Montserrat (already loaded in layout)
- **Heading sizes:** Follow existing patterns from home page
- **Line heights:** 1.5-1.75 for body text, 1.2-1.3 for headings

### 3. Spacing

- **Section padding:** `py-20 sm:py-24 lg:py-32` for main sections
- **Container margins:** `container mx-auto px-4 sm:px-6 lg:px-8`
- **Gap between elements:** `gap-8` for large sections, `gap-4` for smaller components

### 4. Animations

- Use Framer Motion (already installed) for:
  - Fade-in on scroll with `whileInView`
  - Scale/transform on hover with `whileHover`
  - Staggered children with delay
  - Spring physics for natural movement

```tsx
// Standard animation pattern used throughout
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

### 5. Dark Mode

- Use `dark:` Tailwind prefix for all colors
- Test components in both light and dark themes
- Backgrounds: `bg-white dark:bg-navy-900` or `bg-gray-50 dark:bg-navy-800`
- Text: `text-gray-900 dark:text-white`

### 6. Responsive Design

- **Mobile first:** Design for mobile, enhance for larger screens
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Common patterns:**
  - Single column on mobile, multi-column on desktop
  - Stack elements vertically on mobile, horizontally on desktop
  - Hide large elements on mobile with `hidden md:block`

---

## Key Props & Configuration

### Team Card Props
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
}
```

### Timeline Props
```typescript
interface TimelineItem {
  year: string;
  title: string;
  description: string;
  icon?: ReactNode;
  color?: string;
}
```

### Map Props
```typescript
interface MapProps {
  locations: StoreLocation[];
  onMarkerClick?: (location: StoreLocation) => void;
  className?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}
```

---

## File Structure Recommendation

```
app/
├── about/
│   └── page.tsx
├── contact/
│   └── page.tsx
├── stores/
│   └── page.tsx
├── actions/
│   ├── contact-actions.ts
│   └── reservation-actions.ts

components/
├── about/
│   ├── hero-section.tsx
│   ├── company-timeline.tsx
│   ├── contact-section.tsx
│   └── testimonials-section.tsx
├── contact/
│   ├── hero-section.tsx
│   ├── contact-info.tsx
│   └── contact-section.tsx
├── stores/
│   ├── hero-section.tsx
│   ├── store-map.tsx
│   ├── store-filter.tsx
│   ├── store-grid.tsx
│   └── store-card.tsx
├── team/
│   ├── team-card.tsx
│   ├── team-grid.tsx
│   └── team-section.tsx
├── timeline/
│   └── timeline.tsx
├── forms/
│   ├── contact-form.tsx
│   └── reservation-form.tsx
├── ui/
│   ├── map.tsx (new)
│   └── custom-marker.tsx (new)
└── providers/
    └── google-maps-provider.tsx (new)

lib/
├── validators/
│   ├── contact-form.ts (new)
│   └── reservation-form.ts (new)
└── map-styles.ts (new)
```

---

## Testing Checklist

- [ ] All pages render without errors in light and dark mode
- [ ] Maps load correctly with API key configured
- [ ] Forms validate input correctly with Zod
- [ ] Form submissions trigger success/error toasts
- [ ] Team cards show hover effect with bio reveal
- [ ] Timeline appears correctly on mobile and desktop
- [ ] Filters work and update store grid
- [ ] Images load with CustomImage component fallbacks
- [ ] Responsive design works on all breakpoints
- [ ] Accessibility: proper ARIA labels on interactive elements
- [ ] Links integrated into header/footer navigation
- [ ] No console errors or warnings
- [ ] Performance: Lighthouse score > 80

---

## Next Steps

1. **Install Google Maps package:**
   ```bash
   npm install @vis.gl/react-google-maps
   ```

2. **Configure environment:**
   - Add `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to `.env.local`

3. **Create page files:**
   - Create `/app/about/page.tsx`
   - Create `/app/contact/page.tsx`
   - Create `/app/stores/page.tsx`

4. **Implement components:**
   - Start with map component and provider
   - Build team cards and timeline
   - Create forms with validation

5. **Integrate links:**
   - Update header/navigation to link to new pages
   - Add CTA links in relevant home page sections

6. **Testing:**
   - Run `npm run build` to check for errors
   - Test all forms and interactions
   - Verify responsive design on mobile devices

---

## Additional Resources

- **shadcn/ui Documentation:** https://ui.shadcn.com
- **Google Maps API:** https://developers.google.com/maps
- **Framer Motion:** https://www.framer.com/motion
- **React Hook Form:** https://react-hook-form.com
- **Zod Validation:** https://zod.dev
- **Tailwind CSS:** https://tailwindcss.com

---

**Research Date:** December 2024
**Status:** Ready for Implementation
**Priority:** High - Core pages for spec3 delivery
