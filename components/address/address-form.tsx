"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Home, Briefcase, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  addressSchema,
  type AddressFormData,
} from "@/lib/schemas/address-schema";
import { cn } from "@/lib/utils";
import { useUser } from "@/store";
import { MapWithSearchStep } from "./map-with-search-step";
import type { ParsedAddress } from "./utils";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

type Step = "map" | "form";

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  submitLabel?: string;
}

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Address",
}: AddressFormProps) {
  // If defaultValues has lat/long, start on form step (edit mode)
  const hasExistingLocation = defaultValues?.lat && defaultValues?.long;
  const [step, setStep] = useState<Step>(hasExistingLocation ? "form" : "map");
  const [locationData, setLocationData] = useState<ParsedAddress | null>(
    hasExistingLocation
      ? {
          formattedAddress: [
            defaultValues.line1,
            defaultValues.line2,
            defaultValues.area,
            defaultValues.county,
            defaultValues.zip,
            defaultValues.country,
          ]
            .filter(Boolean)
            .join(", "),
          line1: defaultValues.line1 || "",
          line2: defaultValues.line2 || "",
          area: defaultValues.area || "",
          city: defaultValues.area || "",
          county: defaultValues.county || "",
          country: defaultValues.country || "",
          zip: defaultValues.zip || "",
          lat: defaultValues.lat,
          long: defaultValues.long,
        }
      : null
  );

  const user = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: "",
      phone: "",
      line1: "",
      line2: "",
      area: "",
      county: "",
      country: "United Kingdom",
      zip: "",
      type: "home",
      otherAddressLabel: "",
      isDefault: false,
      isForMe: true,
      recipientName: "",
      recipientPhone: "",
      ...defaultValues,
    },
  });

  const addressType = useWatch({ control, name: "type" });
  const isDefault = useWatch({ control, name: "isDefault" });
  const isForMe = useWatch({ control, name: "isForMe" });

  // Auto-populate name and phone when isForMe changes
  useEffect(() => {
    if (isForMe && user) {
      setValue("name", user.name || "");
      setValue("phone", user.phone || "");
    } else if (!isForMe) {
      setValue("name", "");
      setValue("phone", "");
    }
  }, [isForMe, user, setValue]);

  // Handle location confirmation from map step
  const handleLocationConfirm = useCallback(
    (address: ParsedAddress) => {
      setLocationData(address);
      setValue("lat", address.lat);
      setValue("long", address.long);
      setValue("line1", address.line1 || "");
      setValue("line2", address.line2 || "");
      setValue("area", address.area || address.city || "");
      setValue("county", address.county || "");
      setValue("country", address.country || "United Kingdom");
      setValue("zip", address.zip || "");
      setStep("form");
    },
    [setValue]
  );

  // Go back to map step
  const handleChangeLocation = useCallback(() => {
    setStep("map");
  }, []);

  // Check if field was empty from geocoding (editable)
  const isFieldEditable = useCallback(
    (field: keyof ParsedAddress) => {
      if (!locationData) return true;
      const value = locationData[field];
      return !value || (typeof value === "string" && value.trim() === "");
    },
    [locationData]
  );

  const onFormSubmit = async (data: AddressFormData) => {
    try {
      const payload: AddressFormData = {
        ...data,
        name: data.isForMe
          ? user?.name || data.name
          : data.recipientName || data.name,
        phone: data.isForMe
          ? user?.phone || data.phone
          : data.recipientPhone || data.phone,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <APIProvider
      apiKey={GOOGLE_MAPS_API_KEY}
      libraries={["places", "geocoding"]}
    >
      {step === "map" && (
        <div className="h-full">
          <MapWithSearchStep
            initialCenter={
              locationData
                ? { lat: locationData.lat, lng: locationData.long }
                : undefined
            }
            onLocationConfirm={handleLocationConfirm}
          />
        </div>
      )}

      {step === "form" && locationData && (
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className="flex flex-col h-full"
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto space-y-5 pr-1">
            {/* Location summary with change button */}
            <div className="flex items-start justify-between gap-4 rounded-lg bg-muted/50 p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />
                <div>
                  <p className="font-medium">{locationData.formattedAddress}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {locationData.lat.toFixed(6)},{" "}
                    {locationData.long.toFixed(6)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleChangeLocation}
              >
                Change
              </Button>
            </div>

            {/* For Me / For Other Toggle */}
            <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
              <div className="flex-1">
                <Label htmlFor="forMe" className="text-base font-medium">
                  For Me
                </Label>
                <p className="mt-1 text-sm text-muted-foreground">
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
              <div className="space-y-4 rounded-lg border bg-card p-4">
                <h4 className="text-sm font-medium">Recipient Details</h4>
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
              label="Address Line 1"
              placeholder="House number and street name"
              error={errors.line1?.message}
              {...register("line1")}
              disabled={isLoading || !isFieldEditable("line1")}
              aria-required="true"
            />

            {/* Address Line 2 */}
            <Input
              label="Address Line 2 (Floor / Unit / Building)"
              placeholder="Apartment, suite, unit, building, floor, etc."
              error={errors.line2?.message}
              {...register("line2")}
              disabled={isLoading}
            />

            {/* Area and County Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Area / Town"
                placeholder="Enter area or town"
                error={errors.area?.message}
                {...register("area")}
                disabled={
                  isLoading ||
                  (!isFieldEditable("area") && !isFieldEditable("city"))
                }
                aria-required="true"
              />
              <Input
                label="County"
                placeholder="Enter county"
                error={errors.county?.message}
                {...register("county")}
                disabled={isLoading || !isFieldEditable("county")}
                aria-required="true"
              />
            </div>

            {/* Country and Postcode Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Country"
                placeholder="Enter country"
                error={errors.country?.message}
                {...register("country")}
                disabled={isLoading || !isFieldEditable("country")}
                aria-required="true"
              />
              <Input
                label="Postcode"
                placeholder="SW1A 1AA"
                error={errors.zip?.message}
                {...register("zip")}
                disabled={isLoading || !isFieldEditable("zip")}
                aria-required="true"
              />
            </div>

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
                className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3"
              >
                <ToggleGroupItem
                  value="home"
                  className={cn(
                    "flex h-auto items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all",
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
                    "flex h-auto items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all",
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
                    "flex h-auto items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 transition-all",
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
            <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-4">
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
                className="flex-1 cursor-pointer text-sm font-medium"
              >
                Set as default address
                <p className="mt-1 text-xs font-normal text-muted-foreground">
                  This address will be used by default for all orders
                </p>
              </label>
            </div>
          </div>

          {/* Form Actions - Sticky footer */}
          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t bg-background pt-4 sm:flex-row">
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
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {submitLabel}
            </Button>
          </div>
        </form>
      )}
    </APIProvider>
  );
}
