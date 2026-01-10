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
import { createAddress } from "@/lib/api/address";
import { AddAddressData } from "@/types/address";
import { toast } from "sonner";
import { AddressFormData } from "@/lib/schemas/address-schema";

interface AddAddressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddAddressModal({
  open,
  onOpenChange,
  onSuccess,
}: AddAddressModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: AddressFormData) => {
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

      const response = await createAddress(addressData);

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success("Address added successfully");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.errorMessage || "Failed to add address");
      }
    } catch (error) {
      console.error("Error adding address:", error);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full sm:w-[90vw] md:w-[70vw] lg:w-[50vw] max-w-[900px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="sticky top-0 z-10 bg-background border-b px-6 py-4">
          <DialogTitle>Add New Address</DialogTitle>
          <DialogDescription>
            Enter the details of your new delivery address below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 min-h-0">
          <AddressForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={isLoading}
            submitLabel="Add Address"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
