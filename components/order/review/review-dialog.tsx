"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReviewForm } from "./review-form";
import { CheckCircle, Star, Sparkles } from "lucide-react";
import { Confetti } from "./animations/confetti";
import { cn } from "@/lib/utils";
import type { OrderReviewDialogProps } from "./types";

// Success celebration component with enhanced visuals
function SuccessCelebration() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div
      className={cn(
        "py-8 sm:py-10 flex flex-col items-center justify-center gap-4 sm:gap-6 relative transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      role="status"
      aria-live="polite"
      aria-label="Review submitted successfully"
    >
      <Confetti />

      {/* Success icon with ring animation */}
      <div className="relative" aria-hidden="true">
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-green-500/20 transition-all duration-1000",
            isVisible ? "scale-150 opacity-0" : "scale-80 opacity-60"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-green-500/15 transition-all duration-1200 delay-100",
            isVisible ? "scale-200 opacity-0" : "scale-80 opacity-40"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-500 delay-100",
            isVisible ? "scale-100 rotate-0" : "scale-0 -rotate-180"
          )}
        >
          <div
            className={cn(
              "transition-all duration-300 delay-350",
              isVisible ? "scale-100" : "scale-0"
            )}
          >
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Success text */}
      <div
        className={cn(
          "text-center space-y-1 sm:space-y-2 px-4 transition-all duration-400 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-foreground" id="success-title">Thank You!</h3>
        <p className="text-sm sm:text-base text-muted-foreground" id="success-message">
          Your review has been submitted successfully
        </p>
      </div>

      {/* Decorative stars */}
      <div
        className={cn(
          "flex items-center gap-1 sm:gap-1.5 transition-all duration-300 delay-600",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
        aria-hidden="true"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "transition-all duration-300",
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-0"
            )}
            style={{ transitionDelay: isVisible ? `${700 + i * 80}ms` : "0ms" }}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewDialog({
  order,
  existingReview,
  open,
  onOpenChange,
  onSuccess,
}: OrderReviewDialogProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onOpenChange(false);
      onSuccess?.();
    }, 2500);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[600px] max-h-[85vh] overflow-y-auto p-0 gap-0 rounded-lg">
        {showSuccess ? (
          <div className="p-4 sm:p-6 transition-opacity duration-200">
            <SuccessCelebration />
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            {/* Enhanced header with gradient accent */}
            <div className="p-4 sm:p-6 pb-0">
              <DialogHeader className="space-y-2 sm:space-y-3 pb-4 sm:pb-5 border-b border-border/60">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center shadow-sm animate-scale-in"
                    aria-hidden="true"
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                      Rate Your Order
                    </DialogTitle>
                    <DialogDescription className="text-xs sm:text-sm">
                      Share your experience to help us improve
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
            </div>

            <div className="p-4 sm:p-6 pt-4 sm:pt-5">
              <ReviewForm
                order={order}
                existingReview={existingReview}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
