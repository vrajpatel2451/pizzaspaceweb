/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Map, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Loader2, MapPin, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LocationPin } from "./location-pin";
import { GpsButton } from "./gps-button";
import type { ParsedAddress, PlacePrediction } from "./utils";
import { DEFAULT_CENTER, DEFAULT_ZOOM, parseGeocodingResult } from "./utils";

interface MapWithSearchStepProps {
  initialCenter?: { lat: number; lng: number };
  onLocationConfirm: (address: ParsedAddress) => void;
}

export function MapWithSearchStep({
  initialCenter,
  onLocationConfirm,
}: MapWithSearchStepProps) {
  const map = useMap("address-picker-map");
  const placesLib = useMapsLibrary("places");
  const geocodingLib = useMapsLibrary("geocoding");

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const initialGeocodeDone = useRef(false);

  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<ParsedAddress | null>(
    null
  );
  const [isGeocoding, setIsGeocoding] = useState(false);

  const center = initialCenter || DEFAULT_CENTER;
  const isLibraryReady = !!autocompleteService;

  // Initialize autocomplete service when places library loads
  useEffect(() => {
    if (placesLib && !autocompleteService) {
      setAutocompleteService(new placesLib.AutocompleteService());
    }
  }, [placesLib, autocompleteService]);

  // Initialize geocoder when geocoding library loads
  useEffect(() => {
    if (geocodingLib && !geocoder) {
      setGeocoder(new geocodingLib.Geocoder());
    }
  }, [geocodingLib, geocoder]);

  // Reverse geocode function - uses callback pattern for async operation
  const reverseGeocode = useCallback(
    (lat: number, lng: number) => {
      if (!geocoder) return;

      setIsGeocoding(true);
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        setIsGeocoding(false);
        if (status === "OK" && results?.[0]) {
          const parsed = parseGeocodingResult(results[0]);
          setCurrentAddress(parsed);
        }
      });
    },
    [geocoder]
  );

  // Pan to initial center on mount
  useEffect(() => {
    if (
      map &&
      geocoder &&
      center.lat !== 0 &&
      center.lng !== 0 &&
      !initialGeocodeDone.current
    ) {
      initialGeocodeDone.current = true;
      map.panTo(center);
      reverseGeocode(center.lat, center.lng);
    }
  }, [map, geocoder, center, reverseGeocode]);

  // Handle map center change (debounced)
  const handleCenterChanged = useCallback(() => {
    if (!map) return;

    const mapCenter = map.getCenter();
    if (!mapCenter) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      reverseGeocode(mapCenter.lat(), mapCenter.lng());
    }, 500);
  }, [map, reverseGeocode]);

  // Search places
  const searchPlaces = useCallback(
    (input: string) => {
      if (!autocompleteService || input.length < 3) {
        setPredictions([]);
        return;
      }

      setIsSearching(true);

      autocompleteService.getPlacePredictions(
        {
          input,
          componentRestrictions: { country: "gb" },
        },
        (results, status) => {
          setIsSearching(false);

          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results
          ) {
            const mapped = results.map((r) => ({
              placeId: r.place_id,
              mainText: r.structured_formatting.main_text,
              secondaryText: r.structured_formatting.secondary_text,
              description: r.description,
            }));
            setPredictions(mapped);
            setShowDropdown(true);
          } else {
            setPredictions([]);
          }
        }
      );
    },
    [autocompleteService]
  );

  // Handle search input
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length >= 3) {
      debounceRef.current = setTimeout(() => searchPlaces(value), 300);
    } else {
      setPredictions([]);
      setShowDropdown(false);
    }
  };

  // Handle place selection
  const handlePlaceSelect = useCallback(
    (placeId: string) => {
      if (!geocoder || !map) return;

      setShowDropdown(false);
      setQuery("");
      setPredictions([]);

      geocoder.geocode({ placeId }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const location = results[0].geometry.location;
          const parsed = parseGeocodingResult(results[0]);

          map.panTo({ lat: location.lat(), lng: location.lng() });
          setCurrentAddress(parsed);
        }
      });
    },
    [geocoder, map]
  );

  // Handle GPS location
  const handleGpsLocation = useCallback(
    (lat: number, lng: number) => {
      if (map) {
        map.panTo({ lat, lng });
        reverseGeocode(lat, lng);
      }
    },
    [map, reverseGeocode]
  );

  // Handle confirm
  const handleConfirm = () => {
    if (currentAddress) {
      onLocationConfirm(currentAddress);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Search input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={
              isLibraryReady
                ? "Search address or postcode..."
                : "Loading Google Maps..."
            }
            value={query}
            onChange={handleSearchInput}
            onFocus={() => predictions.length > 0 && setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            disabled={!isLibraryReady}
            className="pl-9"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Search dropdown */}
        {showDropdown && predictions.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-lg border bg-background shadow-lg">
            {predictions.map((prediction) => (
              <button
                key={prediction.placeId}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handlePlaceSelect(prediction.placeId)}
                className="flex w-full items-start gap-3 border-b px-4 py-2 text-left transition-colors last:border-b-0 hover:bg-muted"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{prediction.mainText}</p>
                  <p className="text-xs text-muted-foreground">
                    {prediction.secondaryText}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map container */}
      <div className="relative flex-1 min-h-[300px] w-full overflow-hidden rounded-lg border">
        <Map
          id="address-picker-map"
          defaultCenter={center}
          defaultZoom={DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI
          onCenterChanged={handleCenterChanged}
          className="h-full w-full"
        />

        {/* Fixed center pin */}
        <LocationPin />

        {/* GPS button */}
        <div className="absolute bottom-4 right-4 z-10">
          <GpsButton
            onLocationFound={handleGpsLocation}
            onError={(msg) => toast.error(msg)}
          />
        </div>
      </div>

      {/* Current address display */}
      <div className="rounded-lg bg-muted/50 p-4">
        {isGeocoding ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 w-3/4 rounded bg-muted" />
            <div className="h-3 w-1/2 rounded bg-muted" />
          </div>
        ) : currentAddress ? (
          <>
            <p className="font-medium">{currentAddress.formattedAddress}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentAddress.lat.toFixed(6)}, {currentAddress.long.toFixed(6)}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Drag the map or search to select a location
          </p>
        )}
      </div>

      {/* Confirm button */}
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={!currentAddress}
        className="w-full"
      >
        Confirm Location
      </Button>
    </div>
  );
}
