"use client";

import React, { useState, useCallback, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MapPosition {
  lat: number;
  lng: number;
}

interface AddressMapProps {
  position: MapPosition;
  onPositionChange?: (position: MapPosition) => void;
  height?: string;
  zoom?: number;
  draggable?: boolean;
  className?: string;
}

export function AddressMap({
  position,
  onPositionChange,
  height = "400px",
  zoom = 15,
  draggable = true,
  className,
}: AddressMapProps) {
  const [markerPosition, setMarkerPosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);

  // Update marker when position prop changes
  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  const handleMarkerDragEnd = useCallback(
    (event: google.maps.MapMouseEvent) => {
      if (!event.latLng) return;

      const newPosition = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setMarkerPosition(newPosition);
      setIsDragging(false);

      if (onPositionChange) {
        onPositionChange(newPosition);
      }
    },
    [onPositionChange]
  );

  const handleMarkerDragStart = useCallback(() => {
    setIsDragging(true);
  }, []);

  return (
    <div className={cn("relative rounded-lg overflow-hidden border", className)}>
      <Map
        mapId="address-selection-map"
        style={{ width: "100%", height }}
        defaultCenter={position}
        center={markerPosition}
        defaultZoom={zoom}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl={true}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
      >
        <AdvancedMarker
          position={markerPosition}
          draggable={draggable}
          onDragStart={handleMarkerDragStart}
          onDragEnd={handleMarkerDragEnd}
        >
          <Pin
            background={isDragging ? "#ea580c" : "#ea580c"}
            borderColor={isDragging ? "#c2410c" : "#c2410c"}
            glyphColor="#fff"
            scale={isDragging ? 1.2 : 1}
          />
        </AdvancedMarker>
      </Map>

      {/* Tooltip overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border rounded-lg px-4 py-2 shadow-lg pointer-events-none">
        <p className="text-xs font-medium text-center flex items-center gap-2">
          <MapPin className="size-3.5 text-primary" />
          {draggable
            ? "Drag the map to position the pin at your exact delivery location"
            : "Your delivery location"}
        </p>
      </div>

      {/* Loading overlay when dragging */}
      {isDragging && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="bg-background/95 rounded-lg px-4 py-2 shadow-lg">
            <p className="text-sm font-medium flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              Updating location...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

interface ReverseGeocodeResult {
  streetAddress: string;
  area: string;
  city: string;
  county: string;
  country: string;
  postcode: string;
  formattedAddress: string;
}

/**
 * Hook to reverse geocode a lat/lng position to an address
 */
export function useReverseGeocode() {
  const geocodingLibrary = useMapsLibrary("geocoding");
  const [isLoading, setIsLoading] = useState(false);

  const reverseGeocode = useCallback(
    async (
      lat: number,
      lng: number
    ): Promise<ReverseGeocodeResult | null> => {
      if (!geocodingLibrary) {
        console.error("Geocoding library not loaded");
        return null;
      }

      setIsLoading(true);

      try {
        const geocoder = new geocodingLibrary.Geocoder();
        const result = await geocoder.geocode({
          location: { lat, lng },
        });

        if (!result.results || result.results.length === 0) {
          return null;
        }

        const place = result.results[0];
        const components = place.address_components || [];

        const parsedResult: Partial<ReverseGeocodeResult> = {
          formattedAddress: place.formatted_address || "",
        };

        let streetNumber = "";
        let route = "";

        components.forEach((component) => {
          const types = component.types;

          if (types.includes("street_number")) {
            streetNumber = component.long_name;
          }
          if (types.includes("route")) {
            route = component.long_name;
          }
          if (types.includes("sublocality") || types.includes("postal_town")) {
            parsedResult.area = component.long_name;
          }
          if (types.includes("locality")) {
            parsedResult.city = component.long_name;
          }
          if (types.includes("administrative_area_level_2")) {
            parsedResult.county = component.long_name;
          }
          if (types.includes("country")) {
            parsedResult.country = component.long_name;
          }
          if (types.includes("postal_code")) {
            parsedResult.postcode = component.long_name;
          }
        });

        parsedResult.streetAddress = [streetNumber, route]
          .filter(Boolean)
          .join(" ");

        // Fallbacks
        if (!parsedResult.area && parsedResult.city) {
          parsedResult.area = parsedResult.city;
        }
        if (!parsedResult.city && parsedResult.area) {
          parsedResult.city = parsedResult.area;
        }
        if (!parsedResult.county) {
          parsedResult.county = "Greater London";
        }

        return parsedResult as ReverseGeocodeResult;
      } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [geocodingLibrary]
  );

  return { reverseGeocode, isLoading };
}
