import React from 'react';
import { PromoContent } from './promo-content';
import { PromoImage } from './promo-image';

export function PromoSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-600 dark:to-red-600">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Content Container */}
      <div className="container relative mx-auto px-4 py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <PromoContent />

          {/* Right: Image */}
          <PromoImage />
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
    </section>
  );
}
