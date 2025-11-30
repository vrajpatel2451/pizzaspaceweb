"use client";

import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { StoreResponse } from "@/types";
import { MapPin, Phone, Mail } from "lucide-react";

interface GoogleMapProps {
  stores: StoreResponse[];
  className?: string;
}

export function GoogleMap({ stores, className = "" }: GoogleMapProps) {
  const [selectedStore, setSelectedStore] = useState<StoreResponse | null>(null);

  // Calculate center point (UK center as default, or center of stores)
  const mapCenter = stores.length > 0
    ? {
        lat: stores.reduce((sum, store) => sum + store.lat, 0) / stores.length,
        lng: stores.reduce((sum, store) => sum + store.long, 0) / stores.length,
      }
    : { lat: 54.7023, lng: -3.2765 }; // UK center

  const handleMarkerClick = useCallback((store: StoreResponse) => {
    setSelectedStore(store);
  }, []);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedStore(null);
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-slate-800 ${className}`}>
        <div className="text-center p-8">
          <MapPin className="w-12 h-12 mx-auto text-orange-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Google Maps API key not configured
          </p>
        </div>
      </div>
    );
  }

  // Dark mode styles for the map
  const darkMapStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

  // Check if dark mode is active
  const isDarkMode = typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return (
    <APIProvider apiKey={apiKey}>
      <div className={className}>
        <Map
          defaultCenter={mapCenter}
          defaultZoom={6}
          gestureHandling="greedy"
          disableDefaultUI={false}
          mapId="pizza-space-stores-map"
          styles={isDarkMode ? darkMapStyles : undefined}
          className="w-full h-full"
        >
          {stores.map((store) => (
            <AdvancedMarker
              key={store._id}
              position={{ lat: store.lat, lng: store.long }}
              onClick={() => handleMarkerClick(store)}
            >
              <div className="relative cursor-pointer transform transition-transform hover:scale-110">
                {/* Custom orange marker */}
                <div className="w-10 h-10 bg-orange-500 rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                  <MapPin className="w-6 h-6 text-white" fill="white" />
                </div>
                {/* Marker pulse effect */}
                <div className="absolute top-0 left-0 w-10 h-10 bg-orange-500 rounded-full animate-ping opacity-75" />
              </div>
            </AdvancedMarker>
          ))}

          {selectedStore && (
            <InfoWindow
              position={{ lat: selectedStore.lat, lng: selectedStore.long }}
              onCloseClick={handleCloseInfoWindow}
            >
              <div className="p-3 min-w-[250px] max-w-[300px]">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {selectedStore.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500" />
                    <div>
                      <p>{selectedStore.line1}</p>
                      {selectedStore.line2 && <p>{selectedStore.line2}</p>}
                      <p>{selectedStore.area}</p>
                      <p>
                        {selectedStore.city}, {selectedStore.county}
                      </p>
                      <p>{selectedStore.zip}</p>
                    </div>
                  </div>
                  {selectedStore.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 flex-shrink-0 text-orange-500" />
                      <a
                        href={`tel:${selectedStore.phone}`}
                        className="hover:text-orange-500 transition-colors"
                      >
                        {selectedStore.phone}
                      </a>
                    </div>
                  )}
                  {selectedStore.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 flex-shrink-0 text-orange-500" />
                      <a
                        href={`mailto:${selectedStore.email}`}
                        className="hover:text-orange-500 transition-colors"
                      >
                        {selectedStore.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </APIProvider>
  );
}
