"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Home, Briefcase, MapPin, MapPinned, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { addressSchema, type AddressFormData } from "@/lib/schemas/address-schema";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
      type: "home" as const,
      otherAddressLabel: "",
      isDefault: false,
      ...defaultValues,
    },
  });

  const addressType = watch("type");
  const isDefault = watch("isDefault");

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

      setValue("lat", position.coords.latitude);
      setValue("long", position.coords.longitude);

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
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
      {/* Name Field */}
      <Input
        label="Full Name"
        placeholder="Enter recipient name"
        error={errors.name?.message}
        {...register("name")}
        disabled={isLoading}
        aria-required="true"
      />

      {/* Phone Field */}
      <Input
        label="Phone Number"
        type="tel"
        inputMode="tel"
        placeholder="07123 456789"
        error={errors.phone?.message}
        {...register("phone")}
        disabled={isLoading}
        aria-required="true"
      />

      {/* Address Line 1 */}
      <Input
        label="Address Line 1"
        placeholder="House number and street name"
        error={errors.line1?.message}
        {...register("line1")}
        disabled={isLoading}
        aria-required="true"
      />

      {/* Address Line 2 */}
      <Input
        label="Address Line 2 (Optional)"
        placeholder="Apartment, suite, unit, building, floor, etc."
        error={errors.line2?.message}
        {...register("line2")}
        disabled={isLoading}
      />

      {/* Area and County Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Area / Town"
          placeholder="Enter area or town"
          error={errors.area?.message}
          {...register("area")}
          disabled={isLoading}
          aria-required="true"
        />
        <Input
          label="County"
          placeholder="Enter county"
          error={errors.county?.message}
          {...register("county")}
          disabled={isLoading}
          aria-required="true"
        />
      </div>

      {/* Country and Postcode Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Country"
          placeholder="Enter country"
          error={errors.country?.message}
          {...register("country")}
          disabled={isLoading}
          aria-required="true"
        />
        <Input
          label="Postcode"
          placeholder="SW1A 1AA"
          error={errors.zip?.message}
          {...register("zip")}
          disabled={isLoading}
          aria-required="true"
        />
      </div>

      {/* Use My Location Button */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleGetLocation}
          disabled={isLoading || isGettingLocation}
          aria-label="Use my current location"
        >
          {isGettingLocation ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <MapPinned className="size-4" />
          )}
          <span>Use My Location</span>
        </Button>
      </div>

      {/* Address Type Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Address Type <span className="text-destructive">*</span>
        </label>
        <RadioGroup
          value={addressType}
          onValueChange={(value) =>
            setValue("type", value as "home" | "work" | "other")
          }
          disabled={isLoading}
          aria-required="true"
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <label
            htmlFor="type-home"
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
              addressType === "home"
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="home" id="type-home" />
            <div className="flex items-center gap-2 flex-1">
              <Home className="size-5 text-muted-foreground" />
              <span className="font-medium">Home</span>
            </div>
          </label>

          <label
            htmlFor="type-work"
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
              addressType === "work"
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="work" id="type-work" />
            <div className="flex items-center gap-2 flex-1">
              <Briefcase className="size-5 text-muted-foreground" />
              <span className="font-medium">Work</span>
            </div>
          </label>

          <label
            htmlFor="type-other"
            className={cn(
              "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
              addressType === "other"
                ? "border-primary bg-primary/5"
                : "border-input hover:border-primary/50"
            )}
          >
            <RadioGroupItem value="other" id="type-other" />
            <div className="flex items-center gap-2 flex-1">
              <MapPin className="size-5 text-muted-foreground" />
              <span className="font-medium">Other</span>
            </div>
          </label>
        </RadioGroup>
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
          disabled={isLoading}
          className="flex-1"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
