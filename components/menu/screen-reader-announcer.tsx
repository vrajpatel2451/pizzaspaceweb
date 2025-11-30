"use client";

import { useEffect, useRef } from "react";

interface ScreenReaderAnnouncerProps {
  message: string;
  politeness?: "polite" | "assertive";
}

/**
 * ScreenReaderAnnouncer - Accessibility Component
 *
 * Purpose: Announces dynamic content changes to screen readers
 * - Uses aria-live regions for announcements
 * - Configurable politeness level
 * - Automatically clears announcements after reading
 * - Used for filter changes, pagination updates, and dynamic content
 */
export function ScreenReaderAnnouncer({
  message,
  politeness = "polite",
}: ScreenReaderAnnouncerProps) {
  const announcementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (announcementRef.current && message) {
      // Update text content directly (DOM manipulation)
      announcementRef.current.textContent = message;

      // Clear announcement after a delay to prevent repeated readings
      const timeout = setTimeout(() => {
        if (announcementRef.current) {
          announcementRef.current.textContent = "";
        }
      }, 1000);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div
      ref={announcementRef}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    />
  );
}
