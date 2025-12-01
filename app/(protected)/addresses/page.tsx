"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AddressCard,
  AddAddressModal,
  EditAddressModal,
  DeleteAddressDialog,
  EmptyAddresses,
} from "@/components/address";
import { getAddresses, patchAddress } from "@/lib/api/address";
import { AddressResponse } from "@/types/address";
import { toast } from "sonner";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);

  // Fetch addresses
  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await getAddresses();

      if (response.statusCode === 200 && response.data) {
        setAddresses(response.data);
      } else {
        toast.error(response.errorMessage || "Failed to load addresses");
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handlers
  const handleAddAddress = () => {
    setIsAddModalOpen(true);
  };

  const handleEditAddress = (address: AddressResponse) => {
    setSelectedAddress(address);
    setIsEditModalOpen(true);
  };

  const handleDeleteAddress = (address: AddressResponse) => {
    setSelectedAddress(address);
    setIsDeleteDialogOpen(true);
  };

  const handleSetDefault = async (address: AddressResponse) => {
    if (address.isDefault) return;

    try {
      const response = await patchAddress(address._id, { isDefault: true });

      if (response.statusCode === 200) {
        toast.success(`${address.name} set as default address`);
        await fetchAddresses();
      } else {
        toast.error(response.errorMessage || "Failed to set default address");
      }
    } catch (error) {
      console.error("Error setting default address:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleSuccess = () => {
    fetchAddresses();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading addresses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Addresses</h1>
          <p className="text-muted-foreground mt-1">
            {addresses.length === 0
              ? "No addresses saved yet"
              : `${addresses.length} ${addresses.length === 1 ? "address" : "addresses"} saved`}
          </p>
        </div>
        {addresses.length > 0 && (
          <Button
            onClick={handleAddAddress}
            size="lg"
            className="gap-2"
            aria-label="Add new address"
          >
            <Plus className="size-5" />
            <span>Add New Address</span>
          </Button>
        )}
      </div>

      {/* Content */}
      {addresses.length === 0 ? (
        <EmptyAddresses onAddAddress={handleAddAddress} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <AddressCard
              key={address._id}
              address={address}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}

      {/* Modals and Dialogs */}
      <AddAddressModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSuccess={handleSuccess}
      />

      <EditAddressModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        address={selectedAddress}
        onSuccess={handleSuccess}
      />

      <DeleteAddressDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        address={selectedAddress}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
