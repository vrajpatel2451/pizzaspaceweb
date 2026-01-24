"use client";

import { useState } from "react";
import { MapPin, Phone, Clock, Building, ExternalLink, CalendarCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoreResponse } from "@/types";
import { ReservationDialog } from "@/components/stores/reservation-dialog";

interface StoreCardProps {
  store: StoreResponse;
}

export function StoreCard({ store }: StoreCardProps) {
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const fullAddress = `${store.line1}${store.line2 ? ", " + store.line2 : ""}, ${store.area}, ${store.city}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.long}`;

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md dark:shadow-lg p-6 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 flex items-center justify-center shrink-0 shadow-md">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-50 mb-1">{store.name}</h3>
          <Badge
            variant="outline"
            className="text-orange-600 dark:text-orange-400 border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30"
          >
            Open Now
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm mb-6 flex-1">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 text-orange-500 dark:text-orange-400 shrink-0" />
          <span className="text-gray-600 dark:text-gray-300 leading-relaxed">{fullAddress}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
          <a
            href={`tel:${store.phone}`}
            className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors font-medium"
          >
            {store.phone}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0" />
          <span className="text-gray-600 dark:text-gray-300">
            <span className="font-medium">Daily:</span> 10:00 - 23:00
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 dark:border-slate-700 mb-4"></div>

      {/* Actions */}
      <div className="space-y-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Get Directions
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          type="button"
          onClick={() => setIsReservationOpen(true)}
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 py-2 rounded-lg border-2 border-orange-300 dark:border-orange-700 bg-transparent dark:bg-transparent text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-orange-700 dark:hover:text-orange-300 font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          Reserve Table
        </button>
      </div>
    </div>

    {/* Reservation Dialog */}
    <ReservationDialog
      storeId={store._id}
      storeName={store.name}
      openingHours={{ startTime: "10:00", endTime: "23:00" }}
      open={isReservationOpen}
      onOpenChange={setIsReservationOpen}
    />
  </>
  );
}
