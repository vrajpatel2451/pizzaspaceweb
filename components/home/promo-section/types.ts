/**
 * Type definitions for Promo Section components
 */

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownTimerProps {
  targetDate: Date;
}

export interface DiscountCodeProps {
  code: string;
}

export interface PromoSectionConfig {
  targetDate: Date;
  discountCode: string;
  discountPercentage: number;
  ctaLink: string;
  ctaText: string;
}
