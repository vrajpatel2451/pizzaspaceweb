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
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 mb-3 sm:mb-4">
            <CalendarDays className="w-4 h-4 text-orange-600 dark:text-orange-400" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400">
              Book a Table
            </span>
          </div>
          <h2 id="reservation-section-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 mb-3 sm:mb-4 px-4 sm:px-0">
            Reserve Your Table
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
            Plan ahead and reserve your spot at any of our locations. We&apos;ll make sure
            everything is ready for your visit.
          </p>
        </div>

        {/* Reservation Form */}
        <div className="max-w-3xl mx-auto">
          <ReservationForm stores={stores} />
        </div>
      </div>
    </section>
  );
}
