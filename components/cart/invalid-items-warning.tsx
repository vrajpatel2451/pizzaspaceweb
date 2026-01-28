"use client";

import * as React from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { OrderDeliveryType } from "@/types/cart";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface InvalidItemsWarningProps {
  invalidItems: Array<{
    id: string;
    name: string;
  }>;
  deliveryType: OrderDeliveryType;
  onRemoveItems?: () => void;
  onChangeDeliveryType?: () => void;
  className?: string;
}

const COLLAPSE_THRESHOLD = 3;

const deliveryTypeLabels: Record<OrderDeliveryType, string> = {
  dineIn: "Dine In",
  pickup: "Collection",
  delivery: "Delivery",
};

export function InvalidItemsWarning({
  invalidItems,
  deliveryType,
  onRemoveItems,
  onChangeDeliveryType,
  className,
}: InvalidItemsWarningProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!invalidItems || invalidItems.length === 0) {
    return null;
  }

  const shouldCollapse = invalidItems.length > COLLAPSE_THRESHOLD;
  const visibleItems =
    shouldCollapse && !isOpen
      ? invalidItems.slice(0, COLLAPSE_THRESHOLD)
      : invalidItems;
  const remainingCount = invalidItems.length - COLLAPSE_THRESHOLD;

  return (
    <Alert
      variant="destructive"
      className={cn("border-destructive", className)}
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle className="size-4" aria-hidden="true" />

      <AlertTitle>Some items are not available</AlertTitle>

      <AlertDescription>
        <div className="space-y-3">
          {/* Warning Message */}
          <p className="text-sm">
            The following {invalidItems.length === 1 ? "item is" : "items are"}{" "}
            not available for{" "}
            <span className="font-semibold">
              {deliveryTypeLabels[deliveryType]}
            </span>
            :
          </p>

          {/* Items List */}
          <div className="space-y-1">
            <ul className="list-disc list-inside space-y-0.5 text-sm">
              {visibleItems.map((item) => (
                <li key={item.id} className="text-destructive/90">
                  {item.name}
                </li>
              ))}
            </ul>

            {/* Collapsible Trigger for Additional Items */}
            {shouldCollapse && (
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "inline-flex items-center gap-1 text-sm font-medium",
                      "text-destructive hover:text-destructive/80 transition-all duration-200",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-destructive/40 rounded-sm px-1",
                      "active:scale-95",
                    )}
                    aria-label={
                      isOpen
                        ? "Show fewer items"
                        : `Show ${remainingCount} more items`
                    }
                  >
                    {isOpen ? (
                      <>
                        Show less
                        <ChevronUp
                          className="size-3.5 transition-transform duration-200"
                          aria-hidden="true"
                        />
                      </>
                    ) : (
                      <>
                        Show {remainingCount} more{" "}
                        {remainingCount === 1 ? "item" : "items"}
                        <ChevronDown
                          className="size-3.5 transition-transform duration-200"
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="pt-1">
                  <ul className="list-disc list-inside space-y-0.5 text-sm">
                    {invalidItems.slice(COLLAPSE_THRESHOLD).map((item) => (
                      <li key={item.id} className="text-destructive/90">
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            {onRemoveItems && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemoveItems}
                className="text-white tap-scale-sm"
                aria-label={`Remove ${invalidItems.length === 1 ? "invalid item" : `all ${invalidItems.length} invalid items`} from cart`}
              >
                Remove {invalidItems.length === 1 ? "Item" : "Items"}
              </Button>
            )}

            {onChangeDeliveryType && (
              <Button
                variant="outline"
                size="sm"
                onClick={onChangeDeliveryType}
                className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive tap-scale-sm"
                aria-label="Change delivery type to make items available"
              >
                Change Delivery Type
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
