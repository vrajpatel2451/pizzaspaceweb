"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles } from "lucide-react";
import { DiscountResponse } from "@/types";
import { DiscountInput } from "@/components/discount/discount-input";
import { AppliedDiscounts } from "@/components/discount/applied-discounts";
import { DiscountModal } from "@/components/discount/discount-modal";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface DiscountSectionProps {
  availableDiscounts: DiscountResponse[];
  appliedDiscounts: DiscountResponse[];
  totalSavings: number;
  isLoadingDiscounts?: boolean;
  onApplyCode: (code: string) => Promise<{ success: boolean; message?: string }>;
  onApplyDiscount: (discountId: string) => Promise<void>;
  onRemoveDiscount: (discountId: string) => Promise<void>;
  className?: string;
}

export function DiscountSection({
  availableDiscounts,
  appliedDiscounts,
  totalSavings,
  isLoadingDiscounts = false,
  onApplyCode,
  onApplyDiscount,
  onRemoveDiscount,
  className,
}: DiscountSectionProps) {
  const [couponCode, setCouponCode] = React.useState("");
  const [isApplying, setIsApplying] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const [showModal, setShowModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);

  const handleApplyCode = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setIsApplying(true);
    setError(undefined);

    try {
      const result = await onApplyCode(couponCode.trim());

      if (result.success) {
        // Show success animation
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

        // Clear input
        setCouponCode("");

        // Show success toast
        toast.success("Discount applied successfully!", {
          description: result.message || "Your discount has been applied to the cart",
        });
      } else {
        setError(result.message || "Invalid coupon code");
        toast.error("Failed to apply discount", {
          description: result.message || "Please check the code and try again",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to apply discount";
      setError(errorMessage);
      toast.error("Error applying discount", {
        description: errorMessage,
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyFromModal = async (discountId: string) => {
    setIsApplying(true);
    try {
      await onApplyDiscount(discountId);

      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      toast.success("Discount applied successfully!");

      // Close modal after a short delay
      setTimeout(() => setShowModal(false), 500);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to apply discount";
      toast.error("Error applying discount", {
        description: errorMessage,
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveDiscount = async (discountId: string) => {
    setIsRemoving(true);
    try {
      await onRemoveDiscount(discountId);
      toast.success("Discount removed");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove discount";
      toast.error("Error removing discount", {
        description: errorMessage,
      });
    } finally {
      setIsRemoving(false);
    }
  };

  const appliedDiscountIds = appliedDiscounts.map((d) => d._id);

  return (
    <>
      <Card className={cn("relative overflow-hidden", className)}>
        {/* Success Confetti Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-10 pointer-events-none"
            >
              <div className="absolute inset-0 bg-green-500/10" />
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: "50%",
                    y: "50%",
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.02,
                  }}
                  className="absolute size-2 rounded-full"
                  style={{
                    backgroundColor: [
                      "#10b981",
                      "#3b82f6",
                      "#f59e0b",
                      "#ef4444",
                      "#8b5cf6",
                    ][Math.floor(Math.random() * 5)],
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Tag className="size-5" />
              Apply Discount
            </CardTitle>
            {availableDiscounts.length > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowModal(true)}
                className="h-auto p-0 font-semibold"
              >
                View All Discounts
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Applied Discounts */}
          {appliedDiscounts.length > 0 && (
            <AppliedDiscounts
              discounts={appliedDiscounts}
              totalSavings={totalSavings}
              onRemove={handleRemoveDiscount}
              isRemoving={isRemoving}
            />
          )}

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

          {/* Available Discounts Count */}
          {availableDiscounts.length > 0 && !isLoadingDiscounts && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="size-4" />
              <span>
                {availableDiscounts.length}{" "}
                {availableDiscounts.length === 1 ? "discount" : "discounts"} available
              </span>
            </div>
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
