"use client";

import { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { CustomImage } from "@/components/ui/custom-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { QuantityControl } from "./quantity-control";
import { EditCartItemModal } from "./edit-cart-item-modal";
import { CartResponse } from "@/types";
import { cn } from "@/lib/utils";

interface CartItemCardProps {
  item: CartResponse;
  onQuantityChange: (cartId: string, newQuantity: number) => Promise<void>;
  onRemove: (cartId: string) => Promise<void>;
  onEditSuccess?: () => void;
  itemDetails?: {
    name: string;
    image?: string;
    variantName?: string;
    price: number;
  };
  className?: string;
}

export function CartItemCard({
  item,
  onQuantityChange,
  onRemove,
  onEditSuccess,
  itemDetails,
  className,
}: CartItemCardProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemove(item._id);
      setShowRemoveDialog(false);
    } catch (error) {
      console.error("Failed to remove item:", error);
    } finally {
      setIsRemoving(false);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    await onQuantityChange(item._id, newQuantity);
  };

  // Calculate total price for this item
  const itemTotal = (itemDetails?.price || 0) * item.quantity;

  return (
    <>
      <div
        className={cn(
          "flex gap-4 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
          className
        )}
      >
        {/* Product Image */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <CustomImage
            src={itemDetails?.image || ""}
            alt={itemDetails?.name || "Product"}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3 className="font-semibold text-base line-clamp-1">
                {itemDetails?.name || "Loading..."}
              </h3>
              {itemDetails?.variantName && (
                <p className="text-sm text-muted-foreground">
                  {itemDetails.variantName}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-semibold text-base">
                £{itemTotal.toFixed(2)}
              </p>
              {item.quantity > 1 && (
                <p className="text-xs text-muted-foreground">
                  £{(itemDetails?.price || 0).toFixed(2)} each
                </p>
              )}
            </div>
          </div>

          {/* Pricing details */}
          {item.pricing && item.pricing.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.pricing.map((p, idx) => (
                <span
                  key={p.id}
                  className="text-xs text-muted-foreground"
                >
                  {p.quantity}x pricing option {idx + 1}
                </span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 mt-auto">
            <QuantityControl
              quantity={item.quantity}
              onQuantityChange={handleQuantityChange}
              className="h-9"
            />

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowEditModal(true)}
                className="h-8 w-8"
                aria-label="Edit item"
              >
                <Edit2 className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setShowRemoveDialog(true)}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Item Modal */}
      <EditCartItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={item}
        onSuccess={() => {
          setShowEditModal(false);
          onEditSuccess?.();
        }}
      />

      {/* Remove Confirmation Dialog */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove {itemDetails?.name || "this item"} from your cart?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRemoveDialog(false)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemove}
              loading={isRemoving}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
