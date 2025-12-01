"use client";

import { MapPin, Plus, Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AddressResponse } from "@/types";
import { cn } from "@/lib/utils";

interface AddressSelectorProps {
  addresses: AddressResponse[];
  selectedAddressId?: string;
  onAddressSelect: (addressId: string) => void;
  onAddNewAddress: () => void;
  loading?: boolean;
  className?: string;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelect,
  onAddNewAddress,
  loading = false,
  className,
}: AddressSelectorProps) {
  if (loading) {
    return (
      <div className={cn("space-y-3", className)}>
        <div className="space-y-1">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <AddressSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Find default address if no address is selected
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const effectiveSelectedId =
    selectedAddressId || defaultAddress?._id || addresses[0]?._id;

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <h3 className="text-base font-semibold mb-1">Delivery Address</h3>
        <p className="text-sm text-muted-foreground">
          Select where you want your order delivered
        </p>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
          <MapPin className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" />
          <p className="text-sm text-muted-foreground mb-3">
            No addresses saved yet
          </p>
          <Button
            onClick={onAddNewAddress}
            size="sm"
            variant="outline"
            className="mx-auto"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Address
          </Button>
        </div>
      ) : (
        <RadioGroup
          value={effectiveSelectedId}
          onValueChange={onAddressSelect}
          className="gap-2"
        >
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              isSelected={effectiveSelectedId === address._id}
            />
          ))}
        </RadioGroup>
      )}

      {addresses.length > 0 && (
        <Button
          onClick={onAddNewAddress}
          variant="outline"
          className="w-full"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Address
        </Button>
      )}
    </div>
  );
}

interface AddressCardProps {
  address: AddressResponse;
  isSelected: boolean;
}

function AddressCard({ address, isSelected }: AddressCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "home":
        return "Home";
      case "work":
        return "Work";
      case "other":
        return address.otherAddressLabel || "Other";
      default:
        return type;
    }
  };

  return (
    <label
      htmlFor={address._id}
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-all",
        "hover:bg-accent/50",
        isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20"
      )}
    >
      <RadioGroupItem value={address._id} id={address._id} className="mt-0.5" />

      <div className="flex-1 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{address.name}</span>
          {address.isDefault && (
            <Badge variant="outline-primary" size="sm">
              <Check className="h-3 w-3 mr-0.5" />
              Default
            </Badge>
          )}
          <Badge variant="muted" size="sm">
            {getTypeLabel(address.type)}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground">
          {address.line1}
          {address.line2 && `, ${address.line2}`}
        </p>

        <p className="text-xs text-muted-foreground">
          {address.area}, {address.county}, {address.country} {address.zip}
        </p>

        <p className="text-xs text-muted-foreground">{address.phone}</p>
      </div>

      <MapPin
        className={cn(
          "h-4 w-4 mt-0.5 flex-shrink-0",
          isSelected ? "text-primary" : "text-muted-foreground"
        )}
      />
    </label>
  );
}

function AddressSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-4">
      <Skeleton className="h-4 w-4 rounded-full mt-0.5" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-4" />
    </div>
  );
}
