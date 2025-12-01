"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { getVariantPrice } from "@/lib/utils/price-calculator";
import { formatPrice } from "@/lib/utils/currency";
import type { VariantGroupResponse, VariantResponse } from "@/types/product";
import { cn } from "@/lib/utils";

export interface VariantGroupCardProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

/**
 * Premium Variant Group Card Component
 *
 * Zomato/Swiggy style variant selection card with:
 * - Clean white card with subtle border
 * - "Required - Select any 1 option" labels
 * - Radio indicators on the right side
 * - "Most Ordered" badges on popular options
 * - Price modifiers aligned right
 * - Smooth selection animations
 */
export function VariantGroupCard({
  group,
  variants,
  selectedVariantId,
  onSelect,
  className,
}: VariantGroupCardProps) {
  const context = useProductDetailsContext();
  const shouldReduceMotion = useReducedMotion();

  // Get primary variant ID from context for price calculation
  const primaryVariantId = React.useMemo(() => {
    if (!context.productData) return null;

    for (const [groupId, variantId] of context.selectedVariants.entries()) {
      const variantGroup = context.productData.variantGroupList.find(
        (g) => g._id === groupId
      );
      if (variantGroup?.isPrimary) {
        return variantId;
      }
    }
    return null;
  }, [context.selectedVariants, context.productData]);

  // Calculate variant price using price-calculator utility
  const calculateVariantPrice = (variantId: string): number => {
    if (!context.productData) return 0;

    return getVariantPrice(
      variantId,
      primaryVariantId,
      context.productData.variantList,
      context.productData.variantGroupList,
      context.productData.pricing
    );
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
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm sm:text-base font-semibold text-foreground tracking-tight">
            {group.label}
          </h3>
          {group.isPrimary && (
            <span className="inline-flex items-center rounded-full bg-primary/10 dark:bg-primary/20 px-2.5 py-1 text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-wide">
              Required
            </span>
          )}
        </div>
        {group.description && (
          <p className="mt-1.5 text-xs text-muted-foreground/80 leading-relaxed">
            {group.description}
          </p>
        )}
      </div>

      {/* Variant Options */}
      <div
        role="radiogroup"
        aria-label={`Select ${group.label.toLowerCase()}`}
        aria-required={group.isPrimary}
        className="divide-y divide-border/30"
      >
        {variants.map((variant, index) => {
          const isSelected = selectedVariantId === variant._id;
          const price = calculateVariantPrice(variant._id);

          return (
            <motion.div
              key={variant._id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <VariantOptionRow
                variant={variant}
                price={price}
                isSelected={isSelected}
                onSelect={() => onSelect(variant._id)}
              />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * Individual Variant Option Row
 */
interface VariantOptionRowProps {
  variant: VariantResponse;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
}

function VariantOptionRow({
  variant,
  price,
  isSelected,
  onSelect,
}: VariantOptionRowProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={isSelected}
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-4 text-left transition-all duration-200",
        "min-h-[60px] touch-manipulation",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/50",
        isSelected
          ? "bg-primary/5 dark:bg-primary/10"
          : "hover:bg-muted/40 dark:hover:bg-muted/20 active:bg-muted/60"
      )}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.995 }}
    >
      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            "text-sm sm:text-base font-medium transition-colors",
            isSelected ? "text-foreground" : "text-foreground/85"
          )}
        >
          {variant.label}
        </span>
      </div>

      {/* Price */}
      <div className="shrink-0 text-right mr-3">
        <span
          className={cn(
            "text-sm sm:text-base font-semibold tabular-nums transition-colors",
            price > 0
              ? isSelected
                ? "text-primary"
                : "text-foreground/80"
              : "text-muted-foreground"
          )}
        >
          {price > 0 ? formatPrice(price, { showSign: true }) : "Included"}
        </span>
      </div>

      {/* Premium Radio Indicator */}
      <div className="shrink-0">
        <motion.div
          className={cn(
            "size-[22px] rounded-full border-2 flex items-center justify-center transition-all duration-200",
            isSelected
              ? "border-primary bg-primary shadow-md shadow-primary/30"
              : "border-border/80 bg-background dark:border-border/60"
          )}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: isSelected ? [1, 1.15, 1] : 1,
                }
          }
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
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
        </motion.div>
      </div>
    </motion.button>
  );
}

/**
 * Horizontal Variant Selector
 * Alternative layout for size/type selections shown as chips
 */
export interface HorizontalVariantSelectorProps {
  group: VariantGroupResponse;
  variants: VariantResponse[];
  selectedVariantId?: string;
  onSelect: (variantId: string) => void;
  className?: string;
}

export function HorizontalVariantSelector({
  group,
  variants,
  selectedVariantId,
  onSelect,
  className,
}: HorizontalVariantSelectorProps) {
  const context = useProductDetailsContext();
  const shouldReduceMotion = useReducedMotion();

  // Get primary variant ID from context for price calculation
  const primaryVariantId = React.useMemo(() => {
    if (!context.productData) return null;

    for (const [groupId, variantId] of context.selectedVariants.entries()) {
      const variantGroup = context.productData.variantGroupList.find(
        (g) => g._id === groupId
      );
      if (variantGroup?.isPrimary) {
        return variantId;
      }
    }
    return null;
  }, [context.selectedVariants, context.productData]);

  // Calculate variant price
  const calculateVariantPrice = (variantId: string): number => {
    if (!context.productData) return 0;

    return getVariantPrice(
      variantId,
      primaryVariantId,
      context.productData.variantList,
      context.productData.variantGroupList,
      context.productData.pricing
    );
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Label */}
      <div>
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          {group.label}
          {group.isPrimary && (
            <span className="ml-2 text-xs font-medium text-muted-foreground">
              (Required)
            </span>
          )}
        </h3>
      </div>

      {/* Horizontal Chips */}
      <div
        role="radiogroup"
        aria-label={`Select ${group.label.toLowerCase()}`}
        className="flex flex-wrap gap-2"
      >
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant._id;
          const price = calculateVariantPrice(variant._id);

          return (
            <motion.button
              key={variant._id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelect(variant._id)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-4 py-2.5",
                "text-sm font-medium transition-all duration-200",
                "min-h-[44px] touch-manipulation",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected
                  ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-muted/40 text-foreground hover:bg-muted/70 border border-border/40 dark:bg-muted/30"
              )}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      scale: isSelected ? [1, 1.02, 1] : 1,
                    }
              }
              transition={{ duration: 0.2 }}
            >
              <span>{variant.label}</span>
              {price > 0 && (
                <span className={cn(
                  "text-xs",
                  isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  +{formatPrice(price, { showCurrency: false })}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
