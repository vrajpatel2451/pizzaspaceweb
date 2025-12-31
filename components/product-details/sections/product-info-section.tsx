"use client";

import * as React from "react";
import { ChevronDown, Flame } from "lucide-react";
import type { ProductInfoSectionProps } from "@/types/product-details";
import { useDeliveryType } from "@/store/cart-store";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils/currency";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

/**
 * Product Info Section with Accordion
 *
 * Displays product information in a collapsible accordion layout
 * inspired by Zomato/Swiggy design patterns.
 */
export function ProductInfoSection({
  product,
  className,
  defaultExpanded = false,
}: ProductInfoSectionProps & { defaultExpanded?: boolean }) {
  const [isOpen, setIsOpen] = React.useState(defaultExpanded);
  const deliveryType = useDeliveryType();

  // Simple pricing: if delivery, add packaging charges
  const displayPrice = deliveryType === "delivery"
    ? product.basePrice + (product.packagingCharges || 0)
    : product.basePrice;

  const hasNutritionalInfo =
    (product.protein !== undefined && product.protein > 0) ||
    (product.carbs !== undefined && product.carbs > 0) ||
    (product.fats !== undefined && product.fats > 0) ||
    (product.fiber !== undefined && product.fiber > 0);

  const hasAllergenInfo =
    product.allergicInfo && product.allergicInfo.length > 0;
  const hasServingInfo = product.noOfPeople > 0 || product.dishSize;
  const hasSpiceLevel = product.spiceLevel && product.spiceLevel.length > 0;
  const hasIngredients =
    product.ingredientList && product.ingredientList.length > 0;

  // Build nutritional info string
  const getNutritionalText = () => {
    const parts: string[] = [];
    if (product.protein && product.protein > 0)
      parts.push(`${product.protein}g protein`);
    if (product.carbs && product.carbs > 0) parts.push(`${product.carbs}g carbs`);
    if (product.fats && product.fats > 0) parts.push(`${product.fats}g fats`);
    if (product.fiber && product.fiber > 0) parts.push(`${product.fiber}g fiber`);

    return parts.length > 0 ? `Per 100g serving: ${parts.join(", ")}` : null;
  };

  // Format spice level
  const getSpiceLevelText = () => {
    if (!hasSpiceLevel) return null;
    const level = product.spiceLevel[0];
    const spiceMap = {
      "0_chilli": "Mild",
      "1_chilli": "Medium",
      "2_chilli": "Spicy",
    };
    return spiceMap[level] || level;
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("border-b border-border", className)}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between py-4 hover:bg-muted/50 transition-colors px-1">
        <div className="flex items-center gap-3 flex-1">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">
            {product.name}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(displayPrice)}
          </span>
          <ChevronDown
            className={cn(
              "size-5 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-1 pb-4 space-y-4">
        {/* Description */}
        {product.description && (
          <div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>
        )}

        {/* Serving Info */}
        {hasServingInfo && (
          <div className="space-y-1">
            {product.noOfPeople > 0 && (
              <p className="text-sm text-muted-foreground">
                Serves {product.noOfPeople} {product.noOfPeople === 1 ? "person" : "people"}
              </p>
            )}
            {product.dishSize && (
              <p className="text-sm text-muted-foreground">
                {product.dishSize.count} {product.dishSize.unit}
              </p>
            )}
          </div>
        )}

        {/* Nutritional Info */}
        {hasNutritionalInfo && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Nutritional Information
            </h4>
            <p className="text-sm text-muted-foreground">
              {getNutritionalText()}
            </p>
          </div>
        )}

        {/* Spice Level */}
        {hasSpiceLevel && (
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-orange-500" />
            <span className="text-sm font-medium text-foreground">
              Spice Level:
            </span>
            <span className="text-sm text-muted-foreground">
              {getSpiceLevelText()}
            </span>
          </div>
        )}

        {/* Allergen Info */}
        {hasAllergenInfo && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Allergen Information
            </h4>
            <p className="text-sm text-muted-foreground">
              Contains: {product.allergicInfo?.join(", ")}
            </p>
          </div>
        )}

        {/* Ingredients */}
        {hasIngredients && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Ingredients
            </h4>
            <p className="text-sm text-muted-foreground">
              {product.ingredientList.map((ing) => ing.name).join(", ")}
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
