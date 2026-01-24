"use client";

import { createContext, useContext, ReactNode } from "react";
import type {
  OpeningHours,
  SocialMedia,
  ContactInfo,
  PolicyListItem,
} from "@/types";

/**
 * Site data that is shared across the layout
 * Fetched server-side and passed to this client context
 */
export interface SiteData {
  openingHours: OpeningHours[];
  socialMedia: SocialMedia[];
  contactInfo: ContactInfo | null;
  footerPolicies: PolicyListItem[];
  headerLogo: string | null;
  footerLogo: string | null;
}

interface SiteDataContextType extends SiteData {
  isLoaded: boolean;
}

const defaultSiteData: SiteDataContextType = {
  openingHours: [],
  socialMedia: [],
  contactInfo: null,
  footerPolicies: [],
  headerLogo: null,
  footerLogo: null,
  isLoaded: false,
};

const SiteDataContext = createContext<SiteDataContextType>(defaultSiteData);

/**
 * Hook to access site data in client components
 */
export function useSiteData(): SiteDataContextType {
  return useContext(SiteDataContext);
}

/**
 * Hook to access opening hours
 */
export function useOpeningHours(): OpeningHours[] {
  const { openingHours } = useSiteData();
  return openingHours;
}

/**
 * Hook to access social media links
 */
export function useSocialMedia(): SocialMedia[] {
  const { socialMedia } = useSiteData();
  return socialMedia;
}

/**
 * Hook to access contact info
 */
export function useContactInfo(): ContactInfo | null {
  const { contactInfo } = useSiteData();
  return contactInfo;
}

/**
 * Hook to access footer policies
 */
export function useFooterPolicies(): PolicyListItem[] {
  const { footerPolicies } = useSiteData();
  return footerPolicies;
}

/**
 * Hook to access logos
 */
export function useLogos(): { headerLogo: string | null; footerLogo: string | null } {
  const { headerLogo, footerLogo } = useSiteData();
  return { headerLogo, footerLogo };
}

interface SiteDataProviderProps {
  children: ReactNode;
  data: SiteData;
}

/**
 * Provider component that wraps the app and provides site data
 * Data is fetched server-side and passed as props
 */
export function SiteDataProvider({ children, data }: SiteDataProviderProps) {
  return (
    <SiteDataContext.Provider value={{ ...data, isLoaded: true }}>
      {children}
    </SiteDataContext.Provider>
  );
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Check if the store is currently open
 */
export function useIsStoreOpen(): boolean {
  const openingHours = useOpeningHours();

  if (openingHours.length === 0) return false;

  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[now.getDay()];

  const todayHours = openingHours.find(
    (h) => h.day.toLowerCase() === currentDay.toLowerCase()
  );

  if (!todayHours) return false;

  const currentTime = now.getHours() * 60 + now.getMinutes();
  const [startHour, startMin] = todayHours.startTime.split(":").map(Number);
  const [endHour, endMin] = todayHours.endTime.split(":").map(Number);

  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;

  return currentTime >= startTime && currentTime <= endTime;
}

/**
 * Get today's hours
 */
export function useTodayHours(): OpeningHours | null {
  const openingHours = useOpeningHours();

  if (openingHours.length === 0) return null;

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[new Date().getDay()];

  return (
    openingHours.find(
      (h) => h.day.toLowerCase() === currentDay.toLowerCase()
    ) ?? null
  );
}

/**
 * Get formatted address string
 */
export function useFormattedAddress(): string {
  const contactInfo = useContactInfo();

  if (!contactInfo) return "";

  const parts = [
    contactInfo.addressLine1,
    contactInfo.addressLine2,
    contactInfo.area,
    contactInfo.city,
    contactInfo.county,
    contactInfo.zip,
  ].filter(Boolean);

  return parts.join(", ");
}
