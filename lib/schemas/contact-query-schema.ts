import { z } from "zod";

export const contactSubjects = [
  "general inquiry",
  "order issue",
  "feedback",
  "reservation",
  "general complaint",
  "other",
] as const;

export const contactQuerySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  email: z
    .string()
    .email("Please enter a valid email address")
    .trim(),

  phone: z
    .string()
    .regex(/^[\d\s\+\(\)-]*$/, "Please enter a valid phone number")
    .max(20, "Phone number must not exceed 20 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  subject: z.enum(contactSubjects, {
    message: "Please select a subject",
  }),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must not exceed 2000 characters")
    .trim(),
});

export type ContactQueryFormData = z.infer<typeof contactQuerySchema>;

export const contactSubjectOptions = [
  { value: "general inquiry", label: "General Inquiry" },
  { value: "order issue", label: "Order Issue" },
  { value: "feedback", label: "Feedback" },
  { value: "reservation", label: "Reservation" },
  { value: "general complaint", label: "General Complaint" },
  { value: "other", label: "Other" },
] as const;
