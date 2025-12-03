"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { MapPin, Navigation } from "lucide-react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { getStores } from "@/lib/api/stores";
import { StoreResponse } from "@/types";

const HQ_LOCATION = {
  lat: 51.5074,
  lng: -0.1278,
  name: "Pizza Space HQ",
  address: "123 Pizza Lane, London, UK EC1A 1BB"
};

export function MapSection() {
  const [stores, setStores] = useState<StoreResponse[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await getStores({ isActive: true });
        if (response.statusCode === 200 && response.data) {
          setStores(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStores();
  }, []);

  // Intersection Observer for entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${HQ_LOCATION.lat},${HQ_LOCATION.lng}`;
    window.open(url, '_blank');
  };

  if (!apiKey) {
    return (
      <section
        className="relative w-full py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-slate-900/50"
        aria-labelledby="map-section-heading"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-red-600 dark:text-red-400">
              Google Maps API key is not configured. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your environment variables.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-10 sm:py-12 md:py-16 lg:py-20 bg-gray-50 dark:bg-slate-900/50"
      aria-labelledby="map-section-heading"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div
          className={`text-center mb-6 sm:mb-8 md:mb-12 transition-all duration-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
        >
          {/* Badge */}
          <div
            className={`mb-4 transition-all duration-500 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            } motion-reduce:transition-none`}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
              <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
              Our Locations
            </span>
          </div>

          {/* Headline */}
          <h2 id="map-section-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            Find{" "}
            <span className="text-orange-500 relative">
              Us
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
            Visit our main location or find the nearest Pizza Space store to you
          </p>

          {/* Decorative elements */}
          <div
            className={`flex items-center justify-center gap-3 mt-6 transition-all duration-500 delay-400 ${
              isVisible ? "opacity-100" : "opacity-0"
            } motion-reduce:transition-none`}
          >
            <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
            <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
            <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
          </div>
        </div>

        {/* Map Container */}
        <div
          className={`relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg dark:shadow-2xl mb-6 sm:mb-8 transition-all duration-600 delay-200 ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:scale-100`}
        >
          <div className="relative w-full h-[300px] md:h-[400px]">
            <APIProvider apiKey={apiKey}>
              <Map
                defaultCenter={HQ_LOCATION}
                defaultZoom={12}
                mapId="pizza-space-map"
                gestureHandling="cooperative"
                disableDefaultUI={false}
                className="w-full h-full"
                styles={[
                  {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                  }
                ]}
              >
                {/* HQ Marker */}
                <AdvancedMarker
                  position={HQ_LOCATION}
                  onClick={() => setSelectedMarker('hq')}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      <MapPin className="w-6 h-6 text-white" fill="white" />
                    </div>
                  </div>
                </AdvancedMarker>

                {/* HQ Info Window */}
                {selectedMarker === 'hq' && (
                  <InfoWindow
                    position={HQ_LOCATION}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-gray-900 mb-1">
                        {HQ_LOCATION.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {HQ_LOCATION.address}
                      </p>
                      <Button
                        size="sm"
                        onClick={handleGetDirections}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                      >
                        <Navigation className="w-3 h-3 mr-1" />
                        Get Directions
                      </Button>
                    </div>
                  </InfoWindow>
                )}

                {/* Store Markers */}
                {!loading && stores.map((store) => (
                  <AdvancedMarker
                    key={store._id}
                    position={{ lat: store.lat, lng: store.long }}
                    onClick={() => setSelectedMarker(store._id)}
                  >
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                        <MapPin className="w-5 h-5 text-white" fill="white" />
                      </div>
                    </div>
                  </AdvancedMarker>
                ))}

                {/* Store Info Windows */}
                {!loading && stores.map((store) => (
                  selectedMarker === store._id && (
                    <InfoWindow
                      key={`info-${store._id}`}
                      position={{ lat: store.lat, lng: store.long }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2 min-w-[200px]">
                        <h3 className="font-bold text-gray-900 mb-1">
                          {store.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {store.line1}
                          {store.line2 && `, ${store.line2}`}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {store.city}, {store.zip}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          {store.phone}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => {
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.long}`;
                            window.open(url, '_blank');
                          }}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          Get Directions
                        </Button>
                      </div>
                    </InfoWindow>
                  )
                ))}
              </Map>
            </APIProvider>
          </div>
        </div>

        {/* Find Nearest Store Button */}
        <div
          className={`text-center transition-all duration-500 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          } motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0`}
        >
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white"
          >
            <Link href="/stores">
              <MapPin className="mr-2 h-5 w-5" aria-hidden="true" />
              Find Nearest Store
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
