"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomImage } from "@/components/ui/custom-image";
import { cn } from "@/lib/utils";
import { COMBO_UI } from "@/types/combo";
import type { ComboProductItemProps } from "@/types/combo";

/**
 * ComboProductItem - Single selectable product in a combo group
 *
 * Displays a product with selection state and customization options.
 * Selection UI shows: [Product Name]...[Selected X][Customize]
 * where X is the 1-based selection order number.
 */
export function ComboProductItem({
  product,
  groupId,
  selectionIndex,
  totalSelected,
  maxSelection,
  allowCustomization,
  onToggle,
  onCustomize,
  isCustomized = false,
  className,
}: ComboProductItemProps & { isCustomized?: boolean }) {
  const isSelected = selectionIndex !== null;
  const canSelect = !isSelected && totalSelected < maxSelection;
  const isAtMax = !isSelected && totalSelected >= maxSelection;

  // Get product details from the nested product object
  const productName = product.product?.name ?? "Unknown Product";
  const productImage = product.product?.photoList?.[0];
  const productType = product.product?.type;

  return (
    <div
      className={cn(
        "group flex items-center gap-3 sm:gap-4 rounded-lg border bg-card p-3 sm:p-4 transition-all",
        isSelected && "border-primary bg-primary/5",
        !isSelected && canSelect && "hover:border-primary/50 hover:bg-accent cursor-pointer",
        isAtMax && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={() => {
        if (!isSelected && canSelect) {
          onToggle();
        }
      }}
      role="button"
      tabIndex={isAtMax ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !isSelected && canSelect) {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-pressed={isSelected}
      aria-disabled={isAtMax}
    >
      {/* Product Image */}
      {productImage && (
        <div className="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-md overflow-hidden">
          <CustomImage
            src={productImage}
            alt={productName}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className="font-medium text-sm sm:text-base truncate">
            {productName}
          </h4>
          {(productType === "veg" || productType === "vegan") && (
            <Badge variant="veg" size="sm">
              {productType === "vegan" ? "Vegan" : "Veg"}
            </Badge>
          )}
          {productType === "non_veg" && (
            <Badge variant="nonveg" size="sm">
              Non-Veg
            </Badge>
          )}
        </div>
        {isCustomized && isSelected && (
          <Badge variant="secondary" size="sm" className="mt-1">
            {COMBO_UI.CUSTOMIZED_TEXT}
          </Badge>
        )}
      </div>

      {/* Spacer - Hidden on mobile, visible on larger screens */}
      <div className="hidden sm:flex mx-2 flex-shrink-0 h-px flex-1 border-b border-dashed border-muted-foreground/30" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isSelected ? (
          <>
            <Badge variant="success" size="sm" className="whitespace-nowrap">
              {COMBO_UI.SELECTED_TEXT(selectionIndex)}
            </Badge>

            {allowCustomization && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onCustomize();
                }}
                className="text-xs sm:text-sm h-7 sm:h-8"
              >
                {COMBO_UI.CUSTOMIZE_TEXT}
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
              className="text-xs sm:text-sm h-7 sm:h-8 text-muted-foreground hover:text-destructive"
            >
              {COMBO_UI.REMOVE_TEXT}
            </Button>
          </>
        ) : (
          <Button
            variant={canSelect ? "outline" : "ghost"}
            size="sm"
            disabled={isAtMax}
            onClick={(e) => {
              e.stopPropagation();
              if (canSelect) {
                onToggle();
              }
            }}
            className={cn(
              "text-xs sm:text-sm whitespace-nowrap h-7 sm:h-8",
              canSelect && "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            + Add
          </Button>
        )}
      </div>
    </div>
  );
}
