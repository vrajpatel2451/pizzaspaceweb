"use client";

import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ItemReviewCard } from "../cards/item-review-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ItemsReviewSectionProps } from "../types";

export function ItemsReviewSection({
  items,
  control,
  errors,
}: ItemsReviewSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No items to review
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rate Items ({items.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div
            className={cn(
              "space-y-4 transition-opacity duration-300",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            {items.map((item, index) => (
              <div
                key={item.itemId}
                className={cn(
                  "transition-all duration-300",
                  isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
                )}
                style={{ transitionDelay: isVisible ? `${index * 80 + 100}ms` : "0ms" }}
              >
                <ItemReviewCard
                  item={item}
                  index={index}
                  control={control}
                  errors={errors}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
