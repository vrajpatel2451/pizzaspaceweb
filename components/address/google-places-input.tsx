"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Search, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PlaceResult {
  streetAddress: string;
  unit?: string;
  area: string;
  city: string;
  county: string;
  country: string;
  postcode: string;
  lat: number;
  lng: number;
  formattedAddress: string;
}

interface GooglePlacesInputProps {
  onPlaceSelect: (place: PlaceResult) => void;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function GooglePlacesInput({
  onPlaceSelect,
  defaultValue = "",
  placeholder = "Search for postcode, street, or landmark",
  disabled = false,
}: GooglePlacesInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const placesLibrary = useMapsLibrary("places");
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  // Initialize services
  useEffect(() => {
    if (!placesLibrary) return;

    autocompleteService.current = new placesLibrary.AutocompleteService();

    // Create a dummy div for PlacesService
    const dummyDiv = document.createElement("div");
    placesService.current = new placesLibrary.PlacesService(dummyDiv);
  }, [placesLibrary]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchPredictions = useCallback(
    async (input: string) => {
      if (!autocompleteService.current || !input.trim() || input.length < 3) {
        setPredictions([]);
        return;
      }

      setIsLoading(true);

      try {
        const result = await autocompleteService.current.getPlacePredictions({
          input,
          componentRestrictions: { country: "uk" },
          types: ["address"],
        });

        setPredictions(result?.predictions || []);
        setShowDropdown(true);
      } catch (error) {
        console.error("Error fetching predictions:", error);
        setPredictions([]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Debounce predictions fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPredictions(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, fetchPredictions]);

  const parseAddressComponents = (
    place: google.maps.places.PlaceResult
  ): PlaceResult | null => {
    if (!place.geometry?.location || !place.address_components) {
      return null;
    }

    const components = place.address_components;
    const result: Partial<PlaceResult> = {
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      formattedAddress: place.formatted_address || "",
    };

    // Extract address components
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
        result.area = component.long_name;
      }
      if (types.includes("locality")) {
        result.city = component.long_name;
      }
      if (types.includes("administrative_area_level_2")) {
        result.county = component.long_name;
      }
      if (types.includes("country")) {
        result.country = component.long_name;
      }
      if (types.includes("postal_code")) {
        result.postcode = component.long_name;
      }
    });

    // Combine street number and route
    result.streetAddress = [streetNumber, route].filter(Boolean).join(" ");

    // Fallbacks
    if (!result.area && result.city) result.area = result.city;
    if (!result.city && result.area) result.city = result.area;
    if (!result.county) result.county = "Greater London"; // Default for UK addresses

    return result as PlaceResult;
  };

  const handlePlaceClick = async (placeId: string, description: string) => {
    if (!placesService.current) return;

    setIsLoading(true);
    setInputValue(description);
    setShowDropdown(false);

    try {
      placesService.current.getDetails(
        {
          placeId,
          fields: ["address_components", "geometry", "formatted_address"],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            const parsedPlace = parseAddressComponents(place);
            if (parsedPlace) {
              onPlaceSelect(parsedPlace);
            }
          }
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error("Error fetching place details:", error);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setInputValue("");
    setPredictions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || predictions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < predictions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          const prediction = predictions[selectedIndex];
          handlePlaceClick(prediction.place_id, prediction.description);
        }
        break;
      case "Escape":
        setShowDropdown(false);
        break;
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => predictions.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pl-9 pr-9 py-2.5 border rounded-lg",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "text-sm"
          )}
          aria-label="Search for address"
          aria-autocomplete="list"
          aria-controls="address-predictions"
          aria-expanded={showDropdown}
          role="combobox"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          )}
          {inputValue && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 hover:bg-muted rounded transition-colors"
              aria-label="Clear search"
            >
              <X className="size-3.5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Predictions Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div
          ref={dropdownRef}
          id="address-predictions"
          role="listbox"
          className={cn(
            "absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg",
            "max-h-[300px] overflow-y-auto"
          )}
        >
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id}
              type="button"
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() =>
                handlePlaceClick(prediction.place_id, prediction.description)
              }
              className={cn(
                "w-full px-4 py-3 text-left hover:bg-muted transition-colors",
                "flex items-start gap-3 border-b last:border-b-0",
                index === selectedIndex && "bg-muted"
              )}
            >
              <Search className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {prediction.structured_formatting.main_text}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {prediction.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results */}
      {showDropdown && !isLoading && predictions.length === 0 && inputValue.length >= 3 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-background border rounded-lg shadow-lg p-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            No addresses found. Try a different search.
          </p>
        </div>
      )}
    </div>
  );
}
