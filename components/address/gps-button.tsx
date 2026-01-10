"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Locate, Loader2 } from "lucide-react";

interface GpsButtonProps {
  onLocationFound: (lat: number, lng: number) => void;
  onError: (message: string) => void;
}

export function GpsButton({ onLocationFound, onError }: GpsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!navigator.geolocation) {
      onError("Geolocation is not supported by your browser");
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLoading(false);
        onLocationFound(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            onError("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            onError("Location information unavailable");
            break;
          case error.TIMEOUT:
            onError("Location request timed out");
            break;
          default:
            onError("Failed to get location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      onClick={handleClick}
      disabled={isLoading}
      className="size-10 rounded-full shadow-lg"
      aria-label="Use my location"
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" />
      ) : (
        <Locate className="size-5" />
      )}
    </Button>
  );
}
