"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteAddress } from "@/lib/api/address";
import { AddressResponse } from "@/types/address";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteAddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: AddressResponse | null;
  onSuccess?: () => void;
}

export function DeleteAddressDialog({
  open,
  onOpenChange,
  address,
  onSuccess,
}: DeleteAddressDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!address) return;

    setIsLoading(true);

    try {
      const response = await deleteAddress(address._id);

      if (response.statusCode === 200) {
        toast.success("Address deleted successfully");
        onOpenChange(false);
        onSuccess?.();
      } else {
        toast.error(response.errorMessage || "Failed to delete address");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!address) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Address</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              Are you sure you want to delete this address?
            </span>
            <span className="block font-medium text-foreground">
              {address.name} - {address.line1}
            </span>
            {address.isDefault && (
              <span className="block text-amber-600 dark:text-amber-400 font-medium">
                Warning: This is your default address. After deletion, you will
                need to set a new default address.
              </span>
            )}
            <span className="block">This action cannot be undone.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading && <Loader2 className="size-4 animate-spin" />}
            {isLoading ? "Deleting..." : "Delete Address"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
