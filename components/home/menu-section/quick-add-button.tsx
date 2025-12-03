"use client";

import { useState } from "react";
import { toast } from "sonner";
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
      <button
        onClick={handleAdd}
        disabled={isAdding}
        className={cn(
          "relative flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 overflow-hidden",
          isAdded
            ? "bg-green-500 text-white"
            : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 hover:scale-[1.02] active:scale-[0.98]",
          "dark:hover:shadow-orange-500/15",
          className
        )}
        aria-label={`Add ${productName} to cart`}
      >
        {isAdding ? (
          <div className="flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-300">
            <ShoppingBag className="w-4 h-4 animate-spin" />
            <span>Adding...</span>
          </div>
        ) : isAdded ? (
          <div className="flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-300">
            <Check className="w-4 h-4" />
            <span>Added!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 animate-in fade-in-0 zoom-in-95 duration-300">
            <Plus className="w-4 h-4" />
            <span>Add to Cart</span>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 shadow-md",
        isAdded
          ? "bg-green-500 text-white"
          : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30 hover:scale-110 active:scale-90",
        "dark:hover:shadow-orange-500/20",
        className
      )}
      aria-label={`Add ${productName} to cart`}
    >
      {isAdding ? (
        <div className="animate-in fade-in-0 spin-in-180 duration-300">
          <ShoppingBag className="w-4 h-4 animate-spin" />
        </div>
      ) : isAdded ? (
        <div className="animate-in fade-in-0 zoom-in-0 duration-300">
          <Check className="w-5 h-5" />
        </div>
      ) : (
        <div className="animate-in fade-in-0 spin-in-90 duration-200">
          <Plus className="w-5 h-5" />
        </div>
      )}
    </button>
  );
}
