import { cache } from "react";
import {
  getOpeningHours,
  getSocialMedia,
  getPublishedContactInfo,
  getLogos,
  getLogoDetails,
  getPolicies,
  getPolicyBySlug,
  getGeneralRatings,
} from "@/lib/api";
import type {
  OpeningHours,
  SocialMedia,
  ContactInfo,
  Logo,
  PolicyListItem,
  PolicyDetails,
  GeneralRating,
  RatingsPagination,
  LogoType,
  LogoTheme,
} from "@/types";

/**
 * Server-side data fetching utilities with React cache
 * These functions use React's cache() for request deduplication
 * within a single request lifecycle
 */

// ============================================
// OPENING HOURS
// Revalidation: 1 hour (semi-static)
// ============================================

export const fetchOpeningHours = cache(async (): Promise<OpeningHours[]> => {
  const response = await getOpeningHours();
  if (response.statusCode === 200) {
    // Sort by sortOrder
    return response.data.sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return [];
});

// ============================================
// SOCIAL MEDIA
// Revalidation: 1 hour (semi-static)
// ============================================

export const fetchSocialMedia = cache(async (): Promise<SocialMedia[]> => {
  const response = await getSocialMedia();
  if (response.statusCode === 200) {
    return response.data;
  }
  return [];
});

// ============================================
// CONTACT INFO
// Revalidation: 1 hour (semi-static)
// ============================================

export const fetchContactInfo = cache(
  async (): Promise<ContactInfo | null> => {
    const response = await getPublishedContactInfo();
    if (response.statusCode === 200 && response.data) {
      return response.data;
    }
    return null;
  }
);

// ============================================
// LOGOS
// Revalidation: 24 hours (static)
// ============================================

export const fetchAllLogos = cache(async (): Promise<Logo[]> => {
  const response = await getLogos();
  if (response.statusCode === 200) {
    return response.data;
  }
  return [];
});

export const fetchLogo = cache(
  async (type: LogoType, theme: LogoTheme): Promise<Logo | null> => {
    const response = await getLogoDetails({ type, theme });
    if (response.statusCode === 200 && response.data) {
      return response.data;
    }
    return null;
  }
);

// Helper to get header logo
export const fetchHeaderLogo = cache(
  async (theme: LogoTheme = "light"): Promise<string | null> => {
    const logo = await fetchLogo("header", theme);
    return logo?.logoImage ?? null;
  }
);

// Helper to get footer logo
export const fetchFooterLogo = cache(
  async (theme: LogoTheme = "dark"): Promise<string | null> => {
    const logo = await fetchLogo("footer", theme);
    return logo?.logoImage ?? null;
  }
);

// ============================================
// POLICIES
// Revalidation: 1 hour (semi-static)
// ============================================

export const fetchPolicies = cache(async (): Promise<PolicyListItem[]> => {
  const response = await getPolicies();
  if (response.statusCode === 200) {
    return response.data;
  }
  return [];
});

export const fetchFooterPolicies = cache(
  async (): Promise<PolicyListItem[]> => {
    const policies = await fetchPolicies();
    return policies.filter((policy) => policy.showOnFooter);
  }
);

export const fetchPolicyContent = cache(
  async (slug: string): Promise<PolicyDetails | null> => {
    const response = await getPolicyBySlug(slug);
    if (response.statusCode === 200 && response.data) {
      return response.data;
    }
    return null;
  }
);

// ============================================
// TESTIMONIALS / RATINGS
// Revalidation: 5 minutes (dynamic)
// ============================================

export interface TestimonialsResult {
  testimonials: GeneralRating[];
  pagination: RatingsPagination;
}

export const fetchTestimonials = cache(
  async (page: number = 1, limit: number = 6): Promise<TestimonialsResult> => {
    const response = await getGeneralRatings({ page, limit });
    if (response.statusCode === 200) {
      return {
        testimonials: response.data.ratings,
        pagination: response.data.pagination,
      };
    }
    return {
      testimonials: [],
      pagination: {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
      },
    };
  }
);

// ============================================
// COMBINED FETCHERS FOR LAYOUT
// These fetch multiple data sources efficiently
// ============================================

export interface LayoutData {
  openingHours: OpeningHours[];
  socialMedia: SocialMedia[];
  contactInfo: ContactInfo | null;
  footerPolicies: PolicyListItem[];
}

export const fetchLayoutData = cache(async (): Promise<LayoutData> => {
  // Parallel fetch all layout data
  const [openingHours, socialMedia, contactInfo, footerPolicies] =
    await Promise.all([
      fetchOpeningHours(),
      fetchSocialMedia(),
      fetchContactInfo(),
      fetchFooterPolicies(),
    ]);

  return {
    openingHours,
    socialMedia,
    contactInfo,
    footerPolicies,
  };
});

export interface FooterData extends LayoutData {
  footerLogo: string | null;
}

export const fetchFooterData = cache(async (): Promise<FooterData> => {
  const [layoutData, footerLogo] = await Promise.all([
    fetchLayoutData(),
    fetchFooterLogo("dark"),
  ]);

  return {
    ...layoutData,
    footerLogo,
  };
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format opening hours for display
 * Groups consecutive days with same hours
 */
export function formatOpeningHours(hours: OpeningHours[]): string[] {
  if (hours.length === 0) return ["Hours not available"];

  // Group consecutive days with same hours
  const formatted: string[] = [];
  let currentGroup: OpeningHours[] = [];

  for (const hour of hours) {
    if (
      currentGroup.length === 0 ||
      (currentGroup[0].startTime === hour.startTime &&
        currentGroup[0].endTime === hour.endTime)
    ) {
      currentGroup.push(hour);
    } else {
      // Format previous group
      formatted.push(formatHourGroup(currentGroup));
      currentGroup = [hour];
    }
  }

  // Don't forget the last group
  if (currentGroup.length > 0) {
    formatted.push(formatHourGroup(currentGroup));
  }

  return formatted;
}

function formatHourGroup(group: OpeningHours[]): string {
  const timeRange = `${formatTime(group[0].startTime)} - ${formatTime(group[0].endTime)}`;

  if (group.length === 1) {
    return `${group[0].day}: ${timeRange}`;
  }

  const firstDay = group[0].day;
  const lastDay = group[group.length - 1].day;
  return `${firstDay} - ${lastDay}: ${timeRange}`;
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

/**
 * Format full address from contact info
 */
export function formatAddress(contactInfo: ContactInfo): string {
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

/**
 * Check if store is currently open
 */
export function isStoreOpen(hours: OpeningHours[]): boolean {
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

  const todayHours = hours.find(
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
 * Get today's opening hours
 */
export function getTodayHours(hours: OpeningHours[]): OpeningHours | null {
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
    hours.find((h) => h.day.toLowerCase() === currentDay.toLowerCase()) ?? null
  );
}
