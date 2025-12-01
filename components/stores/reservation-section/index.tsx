import { CalendarDays } from "lucide-react";
import { ReservationForm } from "@/components/home/stores-section/reservation-form";
import { StoreResponse } from "@/types";

interface ReservationSectionProps {
  stores: StoreResponse[];
}

export function ReservationSection({ stores }: ReservationSectionProps) {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" aria-labelledby="reservation-section-heading">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 lg:mb-12">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              Book a Table
            </span>
          </div>

          {/* Headline */}
          <h2 id="reservation-section-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Reserve Your{" "}
            <span className="text-orange-500 relative">
              Table
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
          </h2>

          {/* Subheadline */}
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Plan ahead and reserve your spot at any of our locations. We&apos;ll make sure
            everything is ready for your visit.
          </p>

          {/* Decorative elements */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>

        {/* Reservation Form */}
        <div className="max-w-3xl mx-auto">
          <ReservationForm stores={stores} />
        </div>
      </div>
    </section>
  );
}
