"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createReview } from "@/lib/api/orderReview";
import { createReviewFormSchema } from "../validation";
import type {
  ReviewFormData,
  UseReviewFormOptions,
  UseReviewFormReturn,
  PayloadConstructionContext,
} from "../types";
import type { CreateOrderReviewData } from "@/types/orderReview";

/**
 * Custom hook for managing order review form state and submission
 * @param options - Configuration options for the review form
 * @returns Form methods, submission handler, and state
 */
export function useReviewForm({
  order,
  existingReview,
  onSuccess,
}: UseReviewFormOptions): UseReviewFormReturn {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Determine if rider exists
  const hasRider = Boolean(order.rider?.info);

  // Create validation schema with conditional rider validation
  const schema = createReviewFormSchema(hasRider);

  // Initialize form with default values
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      // Order review defaults
      orderRating: existingReview?.order.overallRatings || 0,
      orderMessage: existingReview?.order.overallMessage || "",

      // Rider review defaults (conditional)
      riderRating:
        existingReview?.order.deliveryBoyRatings || (hasRider ? 0 : undefined),
      riderMessage: existingReview?.order.deliveryBoyMessage || "",

      // Item reviews defaults
      items: order.items.map((item) => {
        const existingItemReview = existingReview?.items.find(
          (review) => review.itemId === item.itemId
        );
        return {
          itemId: item.itemId,
          rating: existingItemReview?.ratings || 0,
          message: existingItemReview?.message || "",
        };
      }),
    },
  });

  /**
   * Constructs API payload from form data
   * @param context - Payload construction context
   * @returns API payload in the format expected by createReview
   */
  const constructPayload = (
    context: PayloadConstructionContext
  ): CreateOrderReviewData => {
    const { formData, order, hasRider } = context;

    const payload: CreateOrderReviewData = {
      order: {
        orderId: order._id,
        overallRatings: formData.orderRating,
        overallMessage: formData.orderMessage || undefined,
        storeId: order.seller.info._id,
        staffId: order.rider?.info?._id,
        // Include rider ratings only if rider exists and rating is provided
        ...(hasRider &&
          formData.riderRating && {
            deliveryBoyRatings: formData.riderRating,
            deliveryBoyMessage: formData.riderMessage || undefined,
          }),
      },
      items: formData.items.map((item) => ({
        orderId: order._id,
        itemId: item.itemId,
        ratings: item.rating,
        message: item.message || undefined,
        storeId: order.seller.info._id,
      })),
    };

    return payload;
  };

  /**
   * Handles form submission
   * @param data - Validated form data
   */
  const onSubmit = async (data: ReviewFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Construct API payload
      const payload = constructPayload({
        formData: data,
        order,
        hasRider,
      });

      // Submit review
      const response = await createReview(payload);

      if (response.statusCode !== 201) {
        throw new Error(response.errorMessage || "Failed to submit review");
      }

      // Success handling
      toast.success("Review submitted successfully!");
      router.refresh(); // Refresh page to show new review
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
      toast.error("Failed to submit review");
      console.error("Review submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting,
    submitError,
    hasRider,
  };
}
