"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ComboProductItem } from "./combo-product-item";
import { useProductDetailsContext } from "@/contexts/product-details-context";
import { cn } from "@/lib/utils";
import { COMBO_UI } from "@/types/combo";
import type { ComboGroupCardProps } from "@/types/combo";

/**
 * ComboGroupCard - Single combo group container
 *
 * Displays one combo group with its title, description, selection requirements,
 * and all available products. Handles validation display for min/max selections.
 */
export function ComboGroupCard({
  group,
  products,
  className,
}: ComboGroupCardProps) {
  const {
    comboSelections,
    toggleComboProduct,
    openComboCustomization,
    getComboGroupValidation,
  } = useProductDetailsContext();

  // Get selections for this group
  const groupSelections = comboSelections[group.groupId] || [];
  const validation = getComboGroupValidation(group.groupId);

  // Check if group requirements are satisfied
  const isComplete = validation.isValid;
  const selectedCount = validation.selectedCount;
  const { minSelection, maxSelection, allowCustomization, label, description } = group;

  // Determine if this group is required (minSelection > 0)
  const isRequired = minSelection > 0;

  // Handler for toggling product selection
  const handleToggle = React.useCallback(
    (productId: string, comboGroupProductId: string, defaultVariantId: string) => {
      toggleComboProduct(group.groupId, productId, comboGroupProductId, defaultVariantId);
    },
    [group.groupId, toggleComboProduct]
  );

  // Handler for opening customization dialog
  const handleCustomize = React.useCallback(
    (selectionIndex: number) => {
      openComboCustomization(group.groupId, selectionIndex);
    },
    [group.groupId, openComboCustomization]
  );

  // Get selection index for a product (1-based for display, null if not selected)
  const getSelectionIndex = (productId: string): number | null => {
    const index = groupSelections.findIndex(s => s.productId === productId);
    return index >= 0 ? index + 1 : null; // 1-based for display
  };

  // Check if a product is customized
  const isProductCustomized = (productId: string): boolean => {
    const selection = groupSelections.find(s => s.productId === productId);
    return selection?.customized ?? false;
  };

  return (
    <Card
      className={cn(
        "transition-colors",
        isComplete && "border-green-500/50",
        !isComplete && isRequired && selectedCount === 0 && "border-amber-500/50",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              {label}
              {isRequired && (
                <Badge variant="destructive" size="sm" className="font-normal">
                  {COMBO_UI.REQUIRED_TEXT}
                </Badge>
              )}
            </CardTitle>
            {description && (
              <CardDescription className="mt-1 text-xs sm:text-sm">
                {description}
              </CardDescription>
            )}
          </div>
          <CardAction>
            <Badge
              variant={isComplete ? "success" : "secondary"}
              className="font-mono text-xs sm:text-sm"
            >
              [{selectedCount}/{maxSelection}]
            </Badge>
          </CardAction>
        </div>

        {/* Validation Message */}
        {!isComplete && validation.error && selectedCount > 0 && (
          <Alert variant="destructive" className="mt-3 py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              {validation.error}
            </AlertDescription>
          </Alert>
        )}

        {isComplete && (
          <Alert className="mt-3 py-2 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-xs sm:text-sm text-green-800 dark:text-green-200">
              Selection complete
            </AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="space-y-2 sm:space-y-3 pt-0">
        {products.map((product) => {
          const selectionIndex = getSelectionIndex(product.productId);
          const arrayIndex = selectionIndex !== null ? selectionIndex - 1 : -1;

          return (
            <ComboProductItem
              key={product._id}
              product={product}
              groupId={group.groupId}
              selectionIndex={selectionIndex}
              totalSelected={selectedCount}
              maxSelection={maxSelection}
              allowCustomization={allowCustomization}
              isCustomized={isProductCustomized(product.productId)}
              onToggle={() =>
                handleToggle(
                  product.productId,
                  product._id,
                  product.defaultVariantId || ""
                )
              }
              onCustomize={() => {
                if (arrayIndex >= 0) {
                  handleCustomize(arrayIndex);
                }
              }}
            />
          );
        })}

        {/* Empty state */}
        {products.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No products available in this group
          </div>
        )}
      </CardContent>
    </Card>
  );
}
