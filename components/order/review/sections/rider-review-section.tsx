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
import { RiderInfoDisplay } from "../cards/rider-info-display";
import type { RiderReviewSectionProps } from "../types";

export function RiderReviewSection({
  rider,
  control,
  errors,
}: RiderReviewSectionProps) {
  return (
    <div className="space-y-4">
      {/* Rider Info Display */}
      <RiderInfoDisplay rider={rider} />

      {/* Review Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Field */}
          <FormField
            control={control}
            name="riderRating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate Delivery Service</FormLabel>
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
                  How was your delivery experience?
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Message Field */}
          <FormField
            control={control}
            name="riderMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Feedback (Optional)</FormLabel>
                <FormControl>
                  <TextArea
                    placeholder="Share feedback about the delivery service..."
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
    </div>
  );
}
