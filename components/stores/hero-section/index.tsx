"use client";

import { MapPin } from "lucide-react";
import { StoreResponse } from "@/types";
import { GoogleMap } from "../google-map";

interface HeroSectionProps {
  stores: StoreResponse[];
}

// Map and stats section - H1 content is now server-rendered in page.tsx
export function HeroSection({ stores }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 sm:py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
          {/* Left Content - Stats */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-4 sm:gap-6" role="list" aria-label="Store statistics">
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
          <div className="relative animate-fade-in-up motion-reduce:animate-none">
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
