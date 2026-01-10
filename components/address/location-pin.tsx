"use client";

import { MapPin } from "lucide-react";

export function LocationPin() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-full">
      <MapPin className="size-8 text-primary drop-shadow-lg" fill="currentColor" />
    </div>
  );
}
