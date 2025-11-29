import { MapPin, Phone, Clock, Building, ExternalLink, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoreResponse } from "@/types";

interface StoreCardProps {
  store: StoreResponse;
}

export function StoreCard({ store }: StoreCardProps) {
  const fullAddress = `${store.line1}${store.line2 ? ", " + store.line2 : ""}, ${store.area}, ${store.city}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.long}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shrink-0 shadow-md">
          <Building className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 mb-1">{store.name}</h3>
          <Badge
            variant="outline"
            className="text-orange-600 border-orange-300 bg-orange-50"
          >
            Open Now
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 text-sm mb-6 flex-1">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
          <span className="text-gray-600 leading-relaxed">{fullAddress}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-orange-500 shrink-0" />
          <a
            href={`tel:${store.phone}`}
            className="text-gray-600 hover:text-orange-500 transition-colors font-medium"
          >
            {store.phone}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-gray-600">
            <span className="font-medium">Daily:</span> 10:00 AM - 11:00 PM
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mb-4"></div>

      {/* Actions */}
      <div className="space-y-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Get Directions
          <ExternalLink className="w-4 h-4" />
        </a>
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 h-11 px-5 py-2 rounded-lg border-2 border-orange-300 bg-transparent text-orange-600 hover:bg-orange-50 hover:text-orange-700 font-semibold text-sm transition-all duration-200 shadow-xs hover:shadow-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Order from this Store
        </button>
      </div>
    </div>
  );
}
