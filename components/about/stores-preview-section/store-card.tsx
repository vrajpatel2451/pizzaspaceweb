"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink } from "lucide-react";
import { StoreResponse } from "@/types";

interface StoreCardProps {
  store: StoreResponse;
}

export function StoreCard({ store }: StoreCardProps) {
  const fullAddress = `${store.line1}${store.line2 ? ", " + store.line2 : ""}, ${store.area}, ${store.city}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.long}`;

  return (
    <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-md dark:shadow-navy-950/50 overflow-hidden border border-slate-200 dark:border-navy-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 p-6">
        <h3 className="text-xl font-bold text-white mb-1">{store.name}</h3>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-medium text-white">Open Now</span>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 mt-0.5 text-orange-500 dark:text-orange-400 shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {fullAddress}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0" />
          <a
            href={`tel:${store.phone}`}
            className="text-sm text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors font-medium"
          >
            {store.phone}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0" />
          <span className="text-sm text-slate-600 dark:text-slate-300">
            <span className="font-medium">Daily:</span> 10:00 - 23:00
          </span>
        </div>
      </div>

      {/* Action button */}
      <div className="p-6 pt-0">
        <motion.a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 dark:from-orange-600 dark:to-orange-700 dark:hover:from-orange-700 dark:hover:to-orange-800 text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Get Directions
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>
    </div>
  );
}
