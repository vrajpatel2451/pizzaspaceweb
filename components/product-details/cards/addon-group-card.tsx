"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, ChevronDown, X } from "lucide-react";
import { CompactQuantityPill } from "../controls/quantity-pill";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { formatPrice } from "@/lib/utils/currency";
import type { AddonGroupResponse, AddonResponse } from "@/types/product";
import { cn } from "@/lib/utils";

export interface AddonGroupCardProps {
  group: AddonGroupResponse;
  addons: AddonResponse[];
  className?: string;
  onClearAll?: () => void;
}

const COLLAPSE_THRESHOLD = 4;

/**
 * Premium Addon Group Card Component
 *
 * Zomato/Swiggy style addon selection card with:
 * - Header with "Add-ons" and "Clear" button
 * - Checkbox on left side
 * - "Most Ordered" badges for popular items
 * - Quantity counter appears when selected
 * - Expandable "+X more" if many addons
 * - Smooth animations throughout
 *
 * Uses the new context pattern:
 * - Uses context.isAddonVisible() to check visibility
 * - Uses context.getAddonPricingId() to get pricing ID
 * - Uses context.toggleAddon(pricingId, qty) for selection
 */
export function AddonGroupCard({
  group,
  addons,
  className,
  onClearAll,
}: AddonGroupCardProps) {
  const context = useProductDetailsContext();
  const shouldReduceMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Filter addons that are visible for current variant
  const visibleAddons = React.useMemo(() => {
    return addons.filter((addon) => context.isAddonVisible(addon._id));
  }, [addons, context]);

  // Get addon price from pricing array
  const getAddonPrice = React.useCallback(
    (addonId: string): number => {
      if (!context.productData) return 0;

      const pricing = context.productData.pricing.find(
        (p) =>
          p.type === "addon" &&
          p.variantId === context.selectedVariantId &&
          p.addonId === addonId
      );
      return pricing?.price ?? 0;
    },
    [context.productData, context.selectedVariantId]
  );

  // Selection counts - only count visible addons
  const selectedCount = visibleAddons.filter((addon) =>
    context.isAddonSelected(addon._id)
  ).length;
  const hasAnySelected = selectedCount > 0;

  // Collapse logic
  const shouldCollapse = visibleAddons.length > COLLAPSE_THRESHOLD;
  const displayedAddons =
    shouldCollapse && !isExpanded
      ? visibleAddons.slice(0, COLLAPSE_THRESHOLD)
      : visibleAddons;
  const hiddenCount = visibleAddons.length - COLLAPSE_THRESHOLD;

  // Handlers
  const handleToggleAddon = (addonId: string, isSelected: boolean) => {
    const pricingId = context.getAddonPricingId(addonId);
    if (!pricingId) return;
    context.toggleAddon(pricingId, isSelected ? 1 : 0);
  };

  const handleQuantityChange = (addonId: string, quantity: number) => {
    const pricingId = context.getAddonPricingId(addonId);
    if (!pricingId) return;
    context.toggleAddon(pricingId, quantity);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.04,
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    }),
  };

  // Don't render if no visible addons
  if (visibleAddons.length === 0) {
    return null;
  }

  return (
    <motion.div
      className={cn(
        // Card container
        "rounded-2xl border border-border/50 bg-card overflow-hidden",
        // Premium shadow and dark mode
        "shadow-sm shadow-black/5 dark:shadow-black/20",
        "dark:border-border/30 dark:bg-card/95",
        className
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card Header */}
      <div className="px-4 py-3.5 bg-gradient-to-r from-muted/40 to-muted/20 dark:from-muted/20 dark:to-transparent border-b border-border/40">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
                {group.label}
              </h3>
            </div>
            {group.description && (
              <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
                {group.description}
              </p>
            )}
          </div>

          {/* Clear Button */}
          <AnimatePresence>
            {hasAnySelected && onClearAll && (
              <motion.button
                type="button"
                onClick={onClearAll}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1",
                  "text-xs font-medium text-orange-600 dark:text-orange-400",
                  "bg-orange-500/10 hover:bg-orange-500/20 dark:bg-orange-500/15",
                  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                )}
              >
                <X className="size-3" />
                Clear
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Addon Options */}
      <div
        role="group"
        aria-label={`Select ${group.label.toLowerCase()} addons`}
        className="divide-y divide-border/30"
      >
        {displayedAddons.map((addon, index) => {
          const isSelected = context.isAddonSelected(addon._id);
          const quantity = context.getAddonQuantity(addon._id);
          const price = getAddonPrice(addon._id);

          return (
            <motion.div
              key={addon._id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <AddonOptionRow
                addon={addon}
                price={price}
                quantity={quantity}
                isSelected={isSelected}
                allowMulti={group.allowMulti}
                maxQuantity={group.max > 0 ? group.max : 10}
                onToggle={(selected) => handleToggleAddon(addon._id, selected)}
                onQuantityChange={(qty) => handleQuantityChange(addon._id, qty)}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Expand/Collapse Button */}
      {shouldCollapse && (
        <div className="px-4 py-3 border-t border-border/30">
          <motion.button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "w-full inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5",
              "text-sm font-medium text-orange-600 dark:text-orange-400",
              "bg-orange-500/5 hover:bg-orange-500/10 dark:bg-orange-500/10",
              "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            )}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
          >
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="size-4" />
            </motion.span>
            {isExpanded ? "Show less" : `+${hiddenCount} more options`}
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Individual Addon Option Row
 */
interface AddonOptionRowProps {
  addon: AddonResponse;
  price: number;
  quantity: number;
  isSelected: boolean;
  allowMulti: boolean;
  maxQuantity: number;
  onToggle: (selected: boolean) => void;
  onQuantityChange: (quantity: number) => void;
}

function AddonOptionRow({
  addon,
  price,
  quantity,
  isSelected,
  allowMulti,
  maxQuantity,
  onToggle,
  onQuantityChange,
}: AddonOptionRowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-4 transition-all duration-200",
        "min-h-[60px]",
        isSelected
          ? "bg-primary/5 dark:bg-primary/10"
          : "hover:bg-muted/40 dark:hover:bg-muted/20"
      )}
    >
      {/* Checkbox */}
      <motion.button
        type="button"
        role="checkbox"
        aria-checked={isSelected}
        onClick={() => onToggle(!isSelected)}
        className={cn(
          "size-[22px] rounded-md border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          "touch-manipulation",
          isSelected
            ? "border-primary bg-primary shadow-sm shadow-primary/30"
            : "border-border/80 bg-background hover:border-primary/50 dark:border-border/60"
        )}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
        aria-label={`${isSelected ? "Remove" : "Add"} ${addon.label}`}
      >
        <AnimatePresence mode="wait">
          {isSelected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 25,
              }}
            >
              <Check className="size-3.5 text-primary-foreground" strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onToggle(!isSelected)}
      >
        <span
          className={cn(
            "text-sm sm:text-base font-medium transition-colors",
            isSelected ? "text-foreground" : "text-foreground/85"
          )}
        >
          {addon.label}
        </span>
      </div>

      {/* Quantity Counter (for multi-select) */}
      <AnimatePresence mode="wait">
        {isSelected && allowMulti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, width: 0 }}
            animate={{ opacity: 1, scale: 1, width: "auto" }}
            exit={{ opacity: 0, scale: 0.8, width: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="shrink-0 overflow-hidden"
          >
            <CompactQuantityPill
              value={quantity}
              onChange={onQuantityChange}
              min={1}
              max={maxQuantity}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price */}
      <div className="shrink-0 text-right min-w-[65px]">
        <span
          className={cn(
            "text-sm sm:text-base font-semibold tabular-nums transition-colors",
            isSelected
              ? "text-primary"
              : "text-foreground/80"
          )}
        >
          {formatPrice(price, { showSign: true })}
        </span>
      </div>
    </div>
  );
}
