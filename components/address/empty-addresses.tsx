import React from "react";
import { MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyAddressesProps {
  onAddAddress: () => void;
}

export function EmptyAddresses({ onAddAddress }: EmptyAddressesProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
      role="status"
      aria-label="No addresses found"
    >
      <div className="mb-6 relative">
        {/* Illustration */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl w-48 h-48" />
          <div className="relative bg-muted rounded-full p-8">
            <MapPin className="size-16 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-foreground mb-2">
        No Addresses Yet
      </h3>

      <p className="text-muted-foreground text-base mb-8 max-w-md">
        You haven&apos;t added any delivery addresses yet. Add your first address to
        start ordering delicious pizzas!
      </p>

      <Button
        onClick={onAddAddress}
        size="lg"
        className="gap-2"
        aria-label="Add your first address"
      >
        <Plus className="size-5" />
        <span>Add Your First Address</span>
      </Button>
    </div>
  );
}
