import React from 'react';
import Link from 'next/link';
import { CountdownTimer } from './countdown-timer';
import { DiscountCode } from './discount-code';

export function PromoContent() {
  return (
    <div className="relative z-10 space-y-8">
      {/* Limited Time Offer Badge */}
      <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
        </span>
        Limited Time Offer
      </div>

      {/* Main Headline */}
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-white lg:text-5xl xl:text-6xl">
          Get <span className="text-yellow-300">25% Off</span>
          <br />
          Your First Order
        </h2>
        <p className="text-lg text-white/90 lg:text-xl">
          Use promo code at checkout to unlock your exclusive discount
        </p>
      </div>

      {/* Countdown Timer */}
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wide text-white/80">
          Offer Ends In:
        </p>
        <CountdownTimer targetDate={new Date('2025-12-31T23:59:59')} />
      </div>

      {/* Discount Code */}
      <DiscountCode code="PIZZA25" />

      {/* CTA Button */}
      <div className="pt-4">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-orange-600 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
        >
          Order Now
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
