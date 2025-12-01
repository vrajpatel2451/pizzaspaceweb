"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, ShoppingBag } from "lucide-react";
import { useAddToCart } from "@/lib/hooks/use-cart";
import { useDeviceId } from "@/store/device-store";
import { useStore } from "@/lib/contexts/store-context";
import { cn } from "@/lib/utils";

interface QuickAddButtonProps {
  productId: string;
  productName: string;
  categoryId: string;
  variantId: string; // Primary variant ID (required for simple products)
  pricingId: string; // Pricing ID for the variant
  onAdd?: (productId: string) => void;
  variant?: "icon" | "full";
  className?: string;
}

export function QuickAddButton({
  productId,
  productName,
  categoryId,
  variantId,
  pricingId,
  onAdd,
  variant = "icon",
  className,
}: QuickAddButtonProps) {
  const [isAdded, setIsAdded] = useState(false);

  // Cart integration
  const { mutate: addToCart, isLoading: isAdding } = useAddToCart();
  const deviceId = useDeviceId();
  const { selectedStore } = useStore();

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || isAdded) return;

    // Validate prerequisites
    if (!deviceId) {
      toast.error("Session not initialized. Please refresh the page.");
      return;
    }

    if (!selectedStore) {
      toast.error("Please select a store first");
      return;
    }

    // Add to cart
    const result = await addToCart({
      itemId: productId,
      categoryId,
      storeId: selectedStore._id,
      sessionId: deviceId,
      variantId,
      pricing: [{ id: pricingId, quantity: 1 }],
      quantity: 1,
    });

    if (result.success) {
      setIsAdded(true);
      onAdd?.(productId);

      // Reset after animation
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  if (variant === "full") {
    return (
      <motion.button
        onClick={handleAdd}
        disabled={isAdding}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden",
          isAdded
            ? "bg-green-500 text-white"
            : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25",
          "dark:hover:shadow-orange-500/15",
          className
        )}
        aria-label={`Add ${productName} to cart`}
      >
        <AnimatePresence mode="wait">
          {isAdding ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <ShoppingBag className="w-4 h-4" />
              </motion.div>
              <span>Adding...</span>
            </motion.div>
          ) : isAdded ? (
            <motion.div
              key="added"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Added!</span>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Cart</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleAdd}
      disabled={isAdding}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md",
        isAdded
          ? "bg-green-500 text-white"
          : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30",
        "dark:hover:shadow-orange-500/20",
        className
      )}
      aria-label={`Add ${productName} to cart`}
    >
      <AnimatePresence mode="wait">
        {isAdding ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, rotate: -180 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ShoppingBag className="w-4 h-4" />
            </motion.div>
          </motion.div>
        ) : isAdded ? (
          <motion.div
            key="added"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <Check className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="add"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Plus className="w-5 h-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
