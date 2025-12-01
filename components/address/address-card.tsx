"use client";

import React from "react";
import { Star, Edit2, Trash2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddressTypeBadge } from "./address-type-badge";
import { AddressResponse } from "@/types/address";
import { cn } from "@/lib/utils";

interface AddressCardProps {
  address: AddressResponse;
  onEdit?: (address: AddressResponse) => void;
  onDelete?: (address: AddressResponse) => void;
  onSetDefault?: (address: AddressResponse) => void;
  isSelected?: boolean;
  onSelect?: (address: AddressResponse) => void;
  selectionMode?: boolean;
  className?: string;
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isSelected,
  onSelect,
  selectionMode = false,
  className,
}: AddressCardProps) {
  const fullAddress = [
    address.line1,
    address.line2,
    address.area,
    address.county,
    address.country,
    address.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const handleCardClick = () => {
    if (selectionMode && onSelect) {
      onSelect(address);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(address);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(address);
  };

  const handleSetDefault = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSetDefault?.(address);
  };

  return (
    <Card
      className={cn(
        "relative transition-all duration-200 hover:shadow-md cursor-pointer p-0!",
        isSelected && "ring-2 ring-primary shadow-md",
        selectionMode && "hover:ring-2 hover:ring-primary/50",
        className
      )}
      onClick={handleCardClick}
      role={selectionMode ? "button" : undefined}
      tabIndex={selectionMode ? 0 : undefined}
      aria-pressed={selectionMode ? isSelected : undefined}
      aria-label={`Address: ${address.name}`}
    >
      <CardContent className="p-4 space-y-2">
        {/* Header with Type Badge and Default Star */}
        <div className="flex items-start justify-between gap-2">
          <AddressTypeBadge
            type={address.type}
            label={address.otherAddressLabel}
          />
          {address.isDefault && (
            <div
              className="flex items-center gap-1 text-amber-500"
              aria-label="Default address"
            >
              <Star className="size-4 fill-current" />
              <span className="text-xs font-medium">Default</span>
            </div>
          )}
          {isSelected && (
            <div
              className="flex items-center gap-1 text-primary"
              aria-label="Selected address"
            >
              <Check className="size-4" />
              <span className="text-xs font-medium">Selected</span>
            </div>
          )}
        </div>

        {/* Address Details */}
        <div className="space-y-1.5">
          <h3 className="font-semibold text-sm text-foreground">
            {address.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {fullAddress}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="font-medium">Phone:</span>
            <span>{address.phone}</span>
          </p>
        </div>

        {/* Action Buttons */}
        {!selectionMode && (
          <div className="flex items-center gap-2 pt-1 border-t">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="flex-1 h-9"
                aria-label={`Edit ${address.name} address`}
              >
                <Edit2 className="size-4" />
                <span>Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="flex-1 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label={`Delete ${address.name} address`}
              >
                <Trash2 className="size-4" />
                <span>Delete</span>
              </Button>
            )}
            {!address.isDefault && onSetDefault && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                className="flex-1 h-9"
                aria-label={`Set ${address.name} as default address`}
              >
                <Star className="size-4" />
                <span>Set Default</span>
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
