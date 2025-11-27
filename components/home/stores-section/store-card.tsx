import { MapPin, Phone, Clock, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { StoreResponse } from "@/types";

interface StoreCardProps {
  store: StoreResponse;
}

export function StoreCard({ store }: StoreCardProps) {
  const fullAddress = `${store.line1}${store.line2 ? ", " + store.line2 : ""}, ${store.area}, ${store.city}`;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.long}`;

  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <Building className="w-5 h-5 text-orange-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base sm:text-lg truncate">{store.name}</h3>
          <Badge
            variant="outline"
            size="sm"
            className="text-orange-500 border-orange-500 mt-1"
          >
            Nearby
          </Badge>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
          <span>{fullAddress}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4 text-gray-400 shrink-0" />
          <a
            href={`tel:${store.phone}`}
            className="hover:text-orange-500 transition-colors"
          >
            {store.phone}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 shrink-0" />
          <span>10AM - 11PM</span>
        </div>
      </div>

      {/* CTA */}
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center h-10 px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Get Directions
      </a>
    </div>
  );
}
