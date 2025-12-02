"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import type { OrderReviewDialogProps } from "./types";

// Success celebration component with enhanced visuals
function SuccessCelebration() {
  return (
    <motion.div
      className="py-8 sm:py-10 flex flex-col items-center justify-center gap-4 sm:gap-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
      aria-label="Review submitted successfully"
    >
      <Confetti />

      {/* Success icon with ring animation */}
      <div className="relative" aria-hidden="true">
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.6, 1.6], opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/15"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 2, 2], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
        />
        <motion.div
          className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
          >
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>

      {/* Success text */}
      <motion.div
        className="text-center space-y-1 sm:space-y-2 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h3 className="text-xl sm:text-2xl font-bold text-foreground" id="success-title">Thank You!</h3>
        <p className="text-sm sm:text-base text-muted-foreground" id="success-message">
          Your review has been submitted successfully
        </p>
      </motion.div>

      {/* Decorative stars */}
      <motion.div
        className="flex items-center gap-1 sm:gap-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        aria-hidden="true"
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.7 + i * 0.08,
              type: "spring",
              stiffness: 300,
            }}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400 drop-shadow-sm" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
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
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 sm:p-6"
            >
              <SuccessCelebration />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Enhanced header with gradient accent */}
              <div className="p-4 sm:p-6 pb-0">
                <DialogHeader className="space-y-2 sm:space-y-3 pb-4 sm:pb-5 border-b border-border/60">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div
                      className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center shadow-sm"
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                      aria-hidden="true"
                    >
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </motion.div>
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
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
