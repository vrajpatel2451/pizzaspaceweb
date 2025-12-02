import { z } from "zod";

// ==================== Base Validation Schemas ====================

// Rating validation (1-5 stars)
const ratingSchema = z
  .number()
  .min(1, "Please select a rating")
  .max(5, "Rating must be between 1 and 5");

// Message validation (optional, with length constraints)
const messageSchema = z
  .string()
  .trim()
  .max(500, "Message cannot exceed 500 characters")
  .optional()
  .or(z.literal(""));

// ==================== Item Review Schema ====================

export const itemReviewSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  rating: ratingSchema,
  message: messageSchema,
});

// ==================== Order Review Schema ====================

export const orderReviewSchema = z.object({
  // Order review (always required)
  orderRating: ratingSchema,
  orderMessage: messageSchema,
});

// ==================== Rider Review Schema ====================

export const riderReviewSchema = z.object({
  // Rider review (conditionally required based on hasRider)
  riderRating: z
    .number()
    .min(1, "Please rate the delivery rider")
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  riderMessage: messageSchema,
});

// ==================== Full Review Form Schema ====================

export const reviewFormSchema = z.object({
  // Order review (always required)
  orderRating: ratingSchema,
  orderMessage: messageSchema,

  // Rider review (conditionally required)
  riderRating: z
    .number()
    .min(1, "Please rate the delivery rider")
    .max(5, "Rating must be between 1 and 5")
    .optional(),
  riderMessage: messageSchema,

  // Item reviews (array with minimum length)
  items: z
    .array(itemReviewSchema)
    .min(1, "At least one item must be reviewed"),
});

// ==================== Conditional Validation Function ====================

/**
 * Creates a review form schema with conditional rider rating validation
 * @param hasRider - Whether the order has a delivery rider
 * @returns Zod schema with appropriate validation rules
 */
export function createReviewFormSchema(hasRider: boolean) {
  const baseSchema = reviewFormSchema;

  // If order has a rider, make rider rating required
  if (hasRider) {
    return baseSchema.refine(
      (data) => {
        return (
          data.riderRating !== undefined &&
          data.riderRating >= 1 &&
          data.riderRating <= 5
        );
      },
      {
        message: "Please rate the delivery rider",
        path: ["riderRating"],
      }
    );
  }

  // If no rider, return base schema without rider rating requirement
  return baseSchema;
}

// ==================== Type Inference ====================

export type ReviewFormSchema = z.infer<typeof reviewFormSchema>;
export type ItemReviewSchema = z.infer<typeof itemReviewSchema>;
export type OrderReviewSchema = z.infer<typeof orderReviewSchema>;
export type RiderReviewSchema = z.infer<typeof riderReviewSchema>;
