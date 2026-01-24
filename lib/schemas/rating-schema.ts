import { z } from "zod";

export const ratingSchema = z.object({
  personName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  ratings: z
    .number({ message: "Please select a rating" })
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),

  personTagRole: z
    .string()
    .min(2, "Role must be at least 2 characters")
    .max(50, "Role must not exceed 50 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  personImage: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),

  personPhone: z
    .string()
    .regex(/^[\d\s\+\(\)-]*$/, "Please enter a valid phone number")
    .max(20, "Phone number must not exceed 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),
});

export type RatingFormData = z.infer<typeof ratingSchema>;

export const ratingRoleOptions = [
  { value: "Regular Customer", label: "Regular Customer" },
  { value: "First Time Visitor", label: "First Time Visitor" },
  { value: "Food Blogger", label: "Food Blogger" },
  { value: "Local Resident", label: "Local Resident" },
] as const;
