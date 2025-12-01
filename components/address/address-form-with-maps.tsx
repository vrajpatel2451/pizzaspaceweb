"use client";

import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Briefcase, MapPin, MapPinned, Loader2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addressSchema, type AddressFormData } from "@/lib/schemas/address-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useUser } from "@/store";
import { GoogleMapsProvider } from "./google-maps-provider";
import { GooglePlacesInput, type PlaceResult } from "./google-places-input";
import { AddressMap, useReverseGeocode, type MapPosition } from "./address-map";

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AddressFormWithMaps({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Address",
}: AddressFormProps) {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [mapPosition, setMapPosition] = useState<MapPosition>({
    lat: defaultValues?.lat || 51.5074,
    lng: defaultValues?.long || -0.1278,
  });
  const [showMap, setShowMap] = useState(!!defaultValues?.lat);

  const user = useUser();
  const { reverseGeocode, isLoading: isReverseGeocoding } = useReverseGeocode();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      area: "",
      county: "",
      country: "United Kingdom",
      zip: "",
      type: "home" as const,
      otherAddressLabel: "",
      isDefault: false,
      isForMe: true,
      recipientName: "",
      recipientPhone: "",
      ...defaultValues,
    },
  });

  const addressType = watch("type");
  const isDefault = watch("isDefault");
  const isForMe = watch("isForMe");
  const watchLat = watch("lat");
  const watchLong = watch("long");
  const hasLocation = watchLat !== undefined && watchLong !== undefined;

  // Auto-populate name and phone when isForMe changes
  useEffect(() => {
    if (isForMe && user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
    } else if (!isForMe) {
      // Clear name and phone when switching to "For Other"
      setValue("name", "");
      setValue("phone", "");
    }
  }, [isForMe, user, setValue]);

  const handlePlaceSelect = (place: PlaceResult) => {
    // Update form fields
    setValue("line1", place.streetAddress);
    setValue("area", place.area);
    setValue("county", place.county);
    setValue("country", place.country);
    setValue("zip", place.postcode);
    setValue("lat", place.lat);
    setValue("long", place.lng);

    // Update map position
    setMapPosition({ lat: place.lat, lng: place.lng });
    setShowMap(true);

    toast.success("Address selected successfully");
  };

  const handleMapPositionChange = async (position: MapPosition) => {
    setMapPosition(position);
    setValue("lat", position.lat);
    setValue("long", position.lng);

    // Reverse geocode to get address
    const address = await reverseGeocode(position.lat, position.lng);
    if (address) {
      setValue("line1", address.streetAddress);
      setValue("area", address.area);
      setValue("county", address.county);
      setValue("country", address.country);
      setValue("zip", address.postcode);

      toast.success("Address updated from map");
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setValue("lat", lat);
      setValue("long", lng);
      setMapPosition({ lat, lng });
      setShowMap(true);

      // Reverse geocode to get address
      const address = await reverseGeocode(lat, lng);
      if (address) {
        setValue("line1", address.streetAddress);
        setValue("area", address.area);
        setValue("county", address.county);
        setValue("country", address.country);
        setValue("zip", address.postcode);
      }

      toast.success("Location captured successfully");
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out");
            break;
          default:
            toast.error("An unknown error occurred");
        }
      } else {
        toast.error("Failed to get location");
      }
    } finally {
      setIsGettingLocation(false);
    }
  };

  const onFormSubmit: SubmitHandler<AddressFormData> = async (data) => {
    try {
      // Prepare the payload
      const payload: AddressFormData = {
        ...data,
        // Use user's profile data if isForMe, otherwise use recipient data
        name: data.isForMe ? (user?.name || data.name) : (data.recipientName || data.name),
        phone: data.isForMe ? (user?.phone || data.phone) : (data.recipientPhone || data.phone),
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <GoogleMapsProvider>
      <form onSubmit={handleSubmit(onFormSubmit as any)} className="space-y-5">
        {/* Location Alert */}
        {(errors.lat || errors.long) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>
              {errors.lat?.message || errors.long?.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Google Places Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Select Delivery Location
          </label>
          <GooglePlacesInput
            onPlaceSelect={handlePlaceSelect}
            disabled={isLoading}
            placeholder="Search for postcode, street, or landmark"
          />
          <p className="text-xs text-muted-foreground">
            Search by UK postcode (e.g., SW1A 1AA) or street address
          </p>
        </div>

        {/* Use Current Location Button */}
        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            disabled={isLoading || isGettingLocation || isReverseGeocoding}
            aria-label="Use my current location"
          >
            {isGettingLocation || isReverseGeocoding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <MapPinned className="size-4" />
            )}
            <span>Use my current location</span>
          </Button>
        </div>

        {/* Interactive Map */}
        {showMap && (
          <div className="space-y-2">
            <AddressMap
              position={mapPosition}
              onPositionChange={handleMapPositionChange}
              height="400px"
              draggable={!isLoading}
            />
          </div>
        )}

        {/* Divider */}
        {showMap && (
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Address Details
              </span>
            </div>
          </div>
        )}

        {/* For Me / For Other Toggle */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
          <div className="flex-1">
            <Label htmlFor="forMe" className="font-medium text-base">
              For Me
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Use my profile contact details
            </p>
          </div>
          <Switch
            id="forMe"
            checked={isForMe}
            onCheckedChange={(checked) => setValue("isForMe", checked)}
            disabled={isLoading}
            aria-label="Toggle address recipient"
          />
        </div>

        {/* Recipient Details (shown when isForMe is false) */}
        {!isForMe && (
          <div className="space-y-4 p-4 border rounded-lg bg-card">
            <h4 className="font-medium text-sm">Recipient Details</h4>
            <Input
              label="Recipient Name"
              placeholder="Enter recipient name"
              error={errors.recipientName?.message}
              {...register("recipientName")}
              disabled={isLoading}
              aria-required="true"
            />
            <Input
              label="Recipient Phone"
              type="tel"
              inputMode="tel"
              placeholder="07123 456789"
              error={errors.recipientPhone?.message}
              {...register("recipientPhone")}
              disabled={isLoading}
              aria-required="true"
            />
          </div>
        )}

        {/* Name Field (auto-populated when For Me) */}
        <Input
          label="Full Name"
          placeholder="Enter recipient name"
          error={errors.name?.message}
          {...register("name")}
          disabled={isLoading || isForMe}
          aria-required="true"
          className={isForMe ? "bg-muted/30" : ""}
        />

        {/* Phone Field (auto-populated when For Me) */}
        <Input
          label="Phone Number"
          type="tel"
          inputMode="tel"
          placeholder="07123 456789"
          error={errors.phone?.message}
          {...register("phone")}
          disabled={isLoading || isForMe}
          aria-required="true"
          className={isForMe ? "bg-muted/30" : ""}
        />

        {/* Address Line 1 */}
        <Input
          label="Street Address"
          placeholder="House number and street name"
          error={errors.line1?.message}
          {...register("line1")}
          disabled={isLoading}
          aria-required="true"
        />

        {/* Address Line 2 */}
        <Input
          label="Flat/Unit (Optional)"
          placeholder="Apartment, suite, unit, building, floor, etc."
          error={errors.line2?.message}
          {...register("line2")}
          disabled={isLoading}
        />

        {/* Area and County Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Town/Area (Auto-filled)"
            placeholder="Enter area or town"
            error={errors.area?.message}
            {...register("area")}
            disabled={isLoading}
            aria-required="true"
          />
          <Input
            label="City (Auto-filled)"
            placeholder="Enter city"
            error={errors.county?.message}
            {...register("county")}
            disabled={isLoading}
            aria-required="true"
          />
        </div>

        {/* Country and Postcode Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="County (Auto-filled)"
            placeholder="Enter county"
            error={errors.country?.message}
            {...register("country")}
            disabled={isLoading}
            aria-required="true"
          />
          <Input
            label="Postcode (Auto-filled)"
            placeholder="SW1A 1AA"
            error={errors.zip?.message}
            {...register("zip")}
            disabled={isLoading}
            aria-required="true"
          />
        </div>

        {/* Hidden lat/long fields */}
        <input type="hidden" {...register("lat", { valueAsNumber: true })} />
        <input type="hidden" {...register("long", { valueAsNumber: true })} />

        {/* Location Status */}
        {!showMap && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription>
              Please select a delivery location using the search box or your current location.
            </AlertDescription>
          </Alert>
        )}

        {/* Address Type Selector */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Address Type <span className="text-destructive">*</span>
          </label>
          <ToggleGroup
            type="single"
            value={addressType}
            onValueChange={(value) => {
              if (value) {
                setValue("type", value as "home" | "work" | "other");
              }
            }}
            disabled={isLoading}
            aria-required="true"
            className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full"
          >
            <ToggleGroupItem
              value="home"
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 h-auto rounded-lg border-2 transition-all",
                "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                "data-[state=off]:border-input data-[state=off]:hover:border-primary/50"
              )}
              aria-label="Set address type to Home"
            >
              <Home className="size-4" />
              <span className="font-medium">Home</span>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="work"
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 h-auto rounded-lg border-2 transition-all",
                "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                "data-[state=off]:border-input data-[state=off]:hover:border-primary/50"
              )}
              aria-label="Set address type to Work"
            >
              <Briefcase className="size-4" />
              <span className="font-medium">Work</span>
            </ToggleGroupItem>

            <ToggleGroupItem
              value="other"
              className={cn(
                "flex items-center justify-center gap-2 px-4 py-3 h-auto rounded-lg border-2 transition-all",
                "data-[state=on]:border-primary data-[state=on]:bg-primary/10 data-[state=on]:text-primary",
                "data-[state=off]:border-input data-[state=off]:hover:border-primary/50"
              )}
              aria-label="Set address type to Other"
            >
              <MapPin className="size-4" />
              <span className="font-medium">Other</span>
            </ToggleGroupItem>
          </ToggleGroup>
          {errors.type && (
            <p role="alert" className="text-xs text-destructive">
              {errors.type.message}
            </p>
          )}
        </div>

        {/* Other Address Label (shown only when type is "other") */}
        {addressType === "other" && (
          <Input
            label="Label for Other Address Type"
            placeholder="e.g., Parent's Home, Friend's Place"
            error={errors.otherAddressLabel?.message}
            {...register("otherAddressLabel")}
            disabled={isLoading}
            aria-required="true"
          />
        )}

        {/* Set as Default Checkbox */}
        <div className="flex items-center gap-3 p-4 rounded-lg border bg-muted/50">
          <Checkbox
            id="isDefault"
            checked={isDefault}
            onCheckedChange={(checked) =>
              setValue("isDefault", checked as boolean)
            }
            disabled={isLoading}
            aria-label="Set as default address"
          />
          <label
            htmlFor="isDefault"
            className="text-sm font-medium cursor-pointer flex-1"
          >
            Set as default address
            <p className="text-xs text-muted-foreground font-normal mt-1">
              This address will be used by default for all orders
            </p>
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading || !hasLocation}
            className="flex-1"
          >
            {!hasLocation ? "Select Location First" : submitLabel}
          </Button>
        </div>
      </form>
    </GoogleMapsProvider>
  );
}
