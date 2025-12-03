"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Rating } from "@/components/composite/rating";
import { Card, CardContent } from "@/components/ui/card";
import { TextArea } from "@/components/ui/textarea";
import type { ItemReviewCardProps } from "../types";

export function ItemReviewCard({
  item,
  index,
  control,
  errors,
}: ItemReviewCardProps) {

  return (
    <div className="transition-transform duration-200 hover:-translate-y-0.5">
      <Card
        className="transition-shadow duration-200 hover:shadow-md"
      >
        <CardContent className="p-4 space-y-4">
          {/* Item Header */}
          <div className="flex gap-3">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{item.name}</h4>
              {item.variants && item.variants.length > 0 && (
                <p className="text-xs text-muted-foreground truncate">
                  {item.variants.join(", ")}
                </p>
              )}
              {item.addons && item.addons.length > 0 && (
                <p className="text-xs text-muted-foreground truncate">
                  Addons: {item.addons.map((a) => a.name).join(", ")}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Quantity: {item.quantity}
              </p>
            </div>
          </div>

          {/* Rating Field */}
          <FormField
            control={control}
            name={`items.${index}.rating`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Rate this item</FormLabel>
                <FormControl>
                  <Rating
                    value={field.value || 0}
                    onChange={(val) => field.onChange(Math.round(val))}
                    interactive
                    size="default"
                    showValue
                    precision="full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={control}
            name={`items.${index}.message`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">
                  Feedback for {item.name} (Optional)
                </FormLabel>
                <FormControl>
                  <TextArea
                    placeholder="Any specific feedback? (Optional)"
                    className="min-h-[60px]"
                    maxLength={300}
                    showCharCount
                    aria-label={`Feedback for ${item.name}`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
