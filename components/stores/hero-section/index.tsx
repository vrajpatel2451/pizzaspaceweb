"use client";

import { MapPin } from "lucide-react";
import { StoreResponse } from "@/types";
import { GoogleMap } from "../google-map";

interface HeroSectionProps {
  stores: StoreResponse[];
}

export function HeroSection({ stores }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 pt-24 pb-12 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-24" aria-label="Store locator hero section">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-4 sm:space-y-6">
            <div className="mb-4 animate-fade-in-up stagger-1 motion-reduce:animate-none">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                Find Your Nearest Store
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight animate-fade-in-up stagger-2 motion-reduce:animate-none"
            >
              Visit Us{" "}
              <span className="text-orange-500 relative">
                Today
                {/* Decorative underline */}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 8 Q 25 0, 50 8 T 100 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl animate-fade-in-up stagger-3 motion-reduce:animate-none"
            >
              Discover our locations across the UK. Fresh pizza, warm atmosphere,
              and exceptional service await you at every Pizza Space restaurant.
            </p>

            {/* Decorative elements */}
            <div
              className="flex items-center gap-3 mt-2 animate-fade-in-up stagger-4 motion-reduce:animate-none"
            >
              <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
              <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
              <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            </div>

            <div className="flex items-center gap-4 sm:gap-6 pt-3 sm:pt-4" role="list" aria-label="Store statistics">
              <div className="flex items-center gap-2" role="listitem">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center" aria-hidden="true">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50">50+</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Locations</div>
                </div>
              </div>
              <div className="h-10 sm:h-12 w-px bg-gray-200 dark:bg-slate-700" aria-hidden="true"></div>
              <div className="flex items-center gap-2" role="listitem">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-orange-100 dark:bg-orange-950/30 flex items-center justify-center" aria-hidden="true">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-50">10-23</div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Opening Hours</div>
                </div>
              </div>
            </div>
          </div>
          {/* Right Content - Google Maps */}
          <div className="relative animate-fade-in-up stagger-3 motion-reduce:animate-none">
            <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white dark:border-slate-700">
              <GoogleMap
                stores={stores}
                className="w-full h-full"
              />
            </div>
            {/* Decorative Elements */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl animate-scale-in-center animation-delay-500 motion-reduce:animate-none"
            />
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-600/20 rounded-full blur-2xl animate-scale-in-center animation-delay-700 motion-reduce:animate-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
