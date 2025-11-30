"use server";

import { z } from "zod";
import { isValidUKPhone } from "@/lib/validators/phone";

// Contact form schema (server-side validation)
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .refine((val) => isValidUKPhone(val), {
      message: "Please enter a valid UK phone number",
    }),
  subject: z.string().min(1, "Please select a subject"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must not exceed 500 characters"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export type ContactState = {
  errors?: {
    name?: string[];
    email?: string[];
    phone?: string[];
    subject?: string[];
    message?: string[];
    _form?: string[];
  };
  success?: boolean;
  message?: string;
};

/**
 * Server Action for contact form submission
 * Validates form data and processes the contact request
 */
export async function submitContactForm(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Validate form data
  const validatedFields = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  // Return validation errors if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Implement actual email sending logic here
    // Example: await sendEmail(validatedFields.data);

    // Mock implementation - log the data
    console.log("Contact form submission:", {
      ...validatedFields.data,
      timestamp: new Date().toISOString(),
    });

    // For demo purposes, simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Failed to send message");
    }

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);

    return {
      errors: {
        _form: ["Unable to send your message. Please try again later."],
      },
      success: false,
    };
  }
}

/**
 * Direct submission function for React Hook Form integration
 * This bypasses the FormData approach and accepts typed data directly
 */
export async function submitContactFormDirect(
  data: ContactFormData
): Promise<ContactState> {
  // Validate the data
  const validatedFields = contactSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // TODO: Implement actual email sending logic here
    // Example: await sendEmail(validatedFields.data);

    console.log("Contact form submission:", {
      ...validatedFields.data,
      timestamp: new Date().toISOString(),
    });

    // For demo purposes, simulate occasional errors (5% chance)
    if (Math.random() < 0.05) {
      throw new Error("Failed to send message");
    }

    return {
      success: true,
      message: "Message sent successfully! We'll get back to you soon.",
    };
  } catch (error) {
    console.error("Contact form submission error:", error);

    return {
      errors: {
        _form: ["Unable to send your message. Please try again later."],
      },
      success: false,
    };
  }
}
