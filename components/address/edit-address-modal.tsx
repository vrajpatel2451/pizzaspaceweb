"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddressForm } from "./address-form";
import { updateAddress } from "@/lib/api/address";
import { AddAddressData, AddressResponse } from "@/types/address";
import { toast } from "sonner";
import { AddressFormData } from "@/lib/schemas/address-schema";

interface EditAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: AddressResponse | null;
  onSuccess?: () => void;
}

export function EditAddressModal({
  open,
  onOpenChange,
  address,
  onSuccess,
}: EditAddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AddressFormData) => {
    if (!address) return;

    setIsLoading(true);

    try {
      // Transform form data to API format
      const addressData: AddAddressData = {
        name: data.name,
        phone: data.phone,
        line1: data.line1,
        line2: data.line2 || undefined,
        area: data.area,
        county: data.county,
        country: data.country,
        zip: data.zip,
        lat: data.lat,
        long: data.long,
        type: data.type,
        otherAddressLabel: data.otherAddressLabel || undefined,
        isDefault: data.isDefault,
      };

      const response = await updateAddress(address._id, addressData);

      if (response.statusCode === 200) {
        toast.success("Address updated successfully");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.errorMessage || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  // Transform AddressResponse to AddressFormData
  const defaultValues: Partial<AddressFormData> | undefined = address
    ? {
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 || "",
        area: address.area,
        county: address.county,
        country: address.country,
        zip: address.zip,
        lat: address.lat,
        long: address.long,
        type: address.type,
        otherAddressLabel: address.otherAddressLabel || "",
        isDefault: address.isDefault,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Address</DialogTitle>
          <DialogDescription>
            Update the details of your delivery address below.
          </DialogDescription>
        </DialogHeader>
        {address && (
          <AddressForm
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitLabel="Update Address"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
