"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag } from "lucide-react";
import { DiscountResponse } from "@/types";
import { DiscountInput } from "@/components/discount/discount-input";
import { AppliedDiscounts } from "@/components/discount/applied-discounts";
import { DiscountModal } from "@/components/discount/discount-modal";
import { useCartStore } from "@/store/cart-store";
import { useStore } from "@/lib/contexts/store-context";
import { getDiscounts } from "@/lib/api/discount";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface DiscountSectionProps {
  className?: string;
}

// Simple CSS confetti component
function SuccessConfetti({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (show) {
      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
      const newPieces = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: i * 0.02,
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [show]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
      <style jsx>{`
        @keyframes confetti-burst {
          0% {
            transform: translate(50%, 50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot));
            opacity: 0;
          }
        }
        .confetti-piece {
          animation: confetti-burst 1s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .confetti-piece {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>
      <div className="absolute inset-0 bg-green-500/10" />
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="confetti-piece absolute size-2 rounded-full"
          style={{
            left: "50%",
            top: "50%",
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            "--tx": `${(piece.x - 50) * 3}%`,
            "--ty": `${(piece.y - 50) * 3}%`,
            "--rot": `${Math.random() * 360}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

export function DiscountSection({ className }: DiscountSectionProps) {
  const { selectedStore } = useStore();
  const { selectedDiscountIds, addDiscount, removeDiscount, getCartIds } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Available discounts for modal
  const [availableDiscounts, setAvailableDiscounts] = useState<
    DiscountResponse[]
  >([]);
  const [isLoadingDiscounts, setIsLoadingDiscounts] = useState(false);

  // Applied discount objects (for displaying details)
  const [appliedDiscounts, setAppliedDiscounts] = useState<DiscountResponse[]>(
    []
  );

  // Fetch available discounts for modal
  const fetchAvailableDiscounts = useCallback(async () => {
    if (!selectedStore?._id) return;

    setIsLoadingDiscounts(true);
    try {
      const response = await getDiscounts({
        cartIds: getCartIds(),
        storeId: selectedStore._id,
      });

      if (response.statusCode === 201 && response.data) {
        setAvailableDiscounts(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch discounts:", error);
    } finally {
      setIsLoadingDiscounts(false);
    }
  }, [selectedStore?._id, getCartIds]);

  // Fetch applied discount details
  const fetchAppliedDiscountDetails = useCallback(async () => {
    if (!selectedStore?._id || selectedDiscountIds.length === 0) {
      setAppliedDiscounts([]);
      return;
    }

    try {
      const response = await getDiscounts({
        cartIds: getCartIds(),
        storeId: selectedStore._id,
      });

      if (response.statusCode === 201 && response.data) {
        // Filter to only get the applied discounts
        const applied = response.data.filter((d) =>
          selectedDiscountIds.includes(d._id)
        );
        setAppliedDiscounts(applied);
      }
    } catch (error) {
      console.error("Failed to fetch applied discount details:", error);
    }
  }, [selectedStore?._id, selectedDiscountIds, getCartIds]);

  // Fetch applied discount details when IDs change
  useEffect(() => {
    fetchAppliedDiscountDetails();
  }, [fetchAppliedDiscountDetails]);

  // Handle applying discount code from input
  const handleApplyCode = async () => {
    const trimmedCode = couponCode.trim();

    if (!trimmedCode) {
      setError("Please enter a coupon code");
      return;
    }

    if (!selectedStore?._id) {
      toast.error("No store selected");
      return;
    }

    setIsApplying(true);
    setError(undefined);

    try {
      // Call API to search for discount by code
      const response = await getDiscounts({
        cartIds: getCartIds(),
        storeId: selectedStore._id,
        search: trimmedCode,
      });

      if (
        response.statusCode === 201 &&
        response.data &&
        response.data.length > 0
      ) {
        // Find exact match (case-insensitive)
        const matchedDiscount = response.data.find(
          (d) => d.couponCode.toLowerCase() === trimmedCode.toLowerCase()
        );

        if (matchedDiscount) {
          // Check if already applied
          if (selectedDiscountIds.includes(matchedDiscount._id)) {
            setError("This discount is already applied");
            toast.info("Discount already applied");
          } else {
            addDiscount(matchedDiscount._id);

            // Show success animation
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);

            // Clear input
            setCouponCode("");
            setError(undefined);

            // Show success toast
            toast.success(`Discount "${matchedDiscount.couponCode}" applied!`, {
              description: "Your discount has been applied to the cart",
            });
          }
        } else {
          setError("Invalid or expired discount code");
          toast.error("Invalid discount code");
        }
      } else {
        setError("Invalid or expired discount code");
        toast.error("Invalid discount code");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to apply discount";
      setError(errorMessage);
      toast.error("Error applying discount", {
        description: errorMessage,
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Handle selecting discount from modal
  const handleApplyFromModal = async (discountId: string) => {
    setIsApplying(true);
    try {
      // Check if already applied
      if (selectedDiscountIds.includes(discountId)) {
        toast.info("Discount already applied");
        setShowModal(false);
        return;
      }

      addDiscount(discountId);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Find the discount name for toast
      const discount = availableDiscounts.find((d) => d._id === discountId);
      if (discount) {
        toast.success(`Discount "${discount.couponCode}" applied!`, {
          description: "Your discount has been applied to the cart",
        });
      } else {
        toast.success("Discount applied successfully!");
      }

      // Close modal after a short delay
      setTimeout(() => setShowModal(false), 500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to apply discount";
      toast.error("Error applying discount", {
        description: errorMessage,
      });
    } finally {
      setIsApplying(false);
    }
  };

  // Handle removing a discount
  const handleRemoveDiscount = async (discountId: string) => {
    setIsRemoving(true);
    try {
      removeDiscount(discountId);
      toast.success("Discount removed");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to remove discount";
      toast.error("Error removing discount", {
        description: errorMessage,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  // Handle opening modal - fetch discounts when opening
  const handleOpenModal = () => {
    setShowModal(true);
    fetchAvailableDiscounts();
  };

  // Calculate total savings from applied discounts
  const calculateTotalSavings = () => {
    return appliedDiscounts.reduce((total, discount) => {
      if (discount.discountAmountType === "fix") {
        return total + discount.discountAmount;
      }
      // For percentage discounts, use maximum amount as potential savings
      return total + (discount.maximumAmount || 0);
    }, 0);
  };

  const appliedDiscountIds = selectedDiscountIds;

  return (
    <>
      <Card className={cn("relative overflow-hidden", className)}>
        {/* Success Confetti Animation */}
        <SuccessConfetti show={showSuccess} />

        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="size-5" />
              Apply Discount
            </CardTitle>
            <Button
              variant="link"
              size="sm"
              onClick={handleOpenModal}
              className="h-auto p-0 font-semibold"
            >
              View All
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Coupon Code Input */}
          <DiscountInput
            value={couponCode}
            onChange={(value) => {
              setCouponCode(value);
              if (error) setError(undefined);
            }}
            onApply={handleApplyCode}
            isLoading={isApplying}
            error={error}
            placeholder="Enter coupon code"
          />

          {/* Applied Discounts */}
          {appliedDiscounts.length > 0 && (
            <AppliedDiscounts
              discounts={appliedDiscounts}
              totalSavings={calculateTotalSavings()}
              onRemove={handleRemoveDiscount}
              isRemoving={isRemoving}
            />
          )}
        </CardContent>
      </Card>

      {/* Discount Modal */}
      <DiscountModal
        open={showModal}
        onOpenChange={setShowModal}
        discounts={availableDiscounts}
        appliedDiscountIds={appliedDiscountIds}
        isLoading={isLoadingDiscounts}
        onApply={handleApplyFromModal}
      />
    </>
  );
}
