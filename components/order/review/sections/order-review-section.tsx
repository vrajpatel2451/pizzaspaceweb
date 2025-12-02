"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Rating } from "@/components/composite/rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextArea } from "@/components/ui/textarea";
import type { OrderReviewSectionProps } from "../types";

export function OrderReviewSection({
  control,
  errors,
}: OrderReviewSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Overall Experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Field */}
        <FormField
          control={control}
          name="orderRating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Your Order</FormLabel>
              <FormControl>
                <Rating
                  value={field.value || 0}
                  onChange={(val) => field.onChange(Math.round(val))}
                  interactive
                  size="lg"
                  showValue
                  precision="full"
                />
              </FormControl>
              <FormDescription>
                How would you rate your overall order experience?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={control}
          name="orderMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review (Optional)</FormLabel>
              <FormControl>
                <TextArea
                  placeholder="Share your experience with this order..."
                  maxLength={500}
                  showCharCount
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
