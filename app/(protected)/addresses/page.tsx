"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AddressCard,
  AddAddressModal,
  EditAddressModal,
  DeleteAddressDialog,
  EmptyAddresses,
} from "@/components/address";
import { getAddresses, updateAddress } from "@/lib/api/address";
import { AddressResponse } from "@/types/address";
import { toast } from "sonner";

// Skeleton Components
function AddressCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-3">
        {/* Header with Type Badge and Default Star */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Address Details */}
        <div className="space-y-2">
          {/* Name */}
          <Skeleton className="h-5 w-32" />

          {/* Address lines */}
          <div className="space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Phone */}
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

function AddressListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <AddressCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Premium Section Badge Component
function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
      {children}
    </span>
  );
}

// Premium Address Section Header Component
function AddressSectionHeader({
  addressCount,
  onAddAddress,
  isLoading = false,
}: {
  addressCount: number;
  onAddAddress?: () => void;
  isLoading?: boolean;
}) {
  return (
    <div className="text-center mb-12 sm:mb-16">
      {/* Badge */}
      <div className="mb-4">
        <SectionBadge>My Addresses</SectionBadge>
      </div>

      {/* Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
        Manage Your{" "}
        <span className="text-orange-500 relative">
          Addresses
          {/* Decorative underline */}
          <svg
            className="absolute -bottom-2 left-0 w-full h-3 text-orange-300 dark:text-orange-500/50"
            viewBox="0 0 100 12"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 Q 25 0, 50 8 T 100 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </h1>

      {/* Subheadline with address count */}
      <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
        {isLoading
          ? "Loading your saved addresses..."
          : addressCount === 0
          ? "No addresses saved yet. Add your first delivery address to get started."
          : addressCount === 1
          ? "You have 1 saved address. Add more or manage your existing address below."
          : `You have ${addressCount} saved addresses. Manage your delivery locations and set your preferred default.`}
      </p>

      {/* Decorative elements */}
      <div className="flex items-center justify-center gap-3 mt-6">
        <span className="w-12 h-0.5 bg-gradient-to-r from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
        <span className="w-2 h-2 bg-orange-400 dark:bg-orange-500 rounded-full" />
        <span className="w-12 h-0.5 bg-gradient-to-l from-transparent to-orange-300 dark:to-orange-500/50 rounded-full" />
      </div>

      {/* Add Address Button - positioned below decorative elements */}
      {!isLoading && addressCount > 0 && onAddAddress && (
        <div className="mt-8">
          <Button
            onClick={onAddAddress}
            size="lg"
            className="gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
            aria-label="Add new address"
          >
            <Plus className="size-5" />
            <span>Add New Address</span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressResponse | null>(null);

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
      // Use updateAddress with full payload (PUT request)
      const response = await updateAddress(address._id, {
        name: address.name,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2,
        area: address.area,
        county: address.county,
        country: address.country,
        zip: address.zip,
        lat: address.lat,
        long: address.long,
        type: address.type,
        isDefault: true,
        ...(address.type === "other"
          ? {
              otherAddressLabel: address.otherAddressLabel,
            }
          : {}),
      });

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
      <section className="relative bg-white dark:bg-slate-950 pt-24 pb-6 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16 overflow-hidden min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top left gradient blob */}
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
          {/* Bottom right gradient blob */}
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
          {/* Center accent blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50 dark:bg-orange-500/3 rounded-full blur-3xl opacity-40" />
          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AddressSectionHeader addressCount={0} isLoading={true} />
          <AddressListSkeleton />
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-white dark:bg-slate-950 pt-24 pb-6 sm:pt-28 sm:pb-12 lg:pt-32 lg:pb-16 overflow-hidden min-h-screen">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient blob */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        {/* Bottom right gradient blob */}
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-100 dark:bg-orange-500/5 rounded-full blur-3xl opacity-60" />
        {/* Center accent blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-50 dark:bg-orange-500/3 rounded-full blur-3xl opacity-40" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Premium Section Header */}
        <AddressSectionHeader
          addressCount={addresses.length}
          onAddAddress={handleAddAddress}
        />

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
      </div>

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
    </section>
  );
}
