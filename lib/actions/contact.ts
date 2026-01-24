"use server";

import { contactQuerySchema } from "@/lib/schemas";
import { createContactQuery } from "@/lib/api";
import type { ContactQueryFormData } from "@/lib/schemas";

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
 * Validates form data and submits to the contact queries API
 * Rate limit: 10 requests/hour
 */
export async function submitContactForm(
  prevState: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Validate form data
  const validatedFields = contactQuerySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
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
    // Submit to API
    const response = await createContactQuery(validatedFields.data);

    // Handle rate limiting
    if (response.statusCode === 429) {
      return {
        errors: {
          _form: [
            "You've reached the maximum number of submissions. Please try again later.",
          ],
        },
        success: false,
      };
    }

    // Handle validation errors
    if (response.statusCode === 400) {
      return {
        errors: {
          _form: ["Invalid form data. Please check your input and try again."],
        },
        success: false,
      };
    }

    // Handle other errors
    if (response.statusCode !== 201) {
      return {
        errors: {
          _form: ["Unable to send your message. Please try again later."],
        },
        success: false,
      };
    }

    return {
      success: true,
      message:
        "Message sent successfully! We've received your inquiry and will get back to you soon.",
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
  data: ContactQueryFormData
): Promise<ContactState> {
  // Validate the data
  const validatedFields = contactQuerySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      success: false,
    };
  }

  try {
    // Submit to API
    const response = await createContactQuery(validatedFields.data);

    // Handle rate limiting
    if (response.statusCode === 429) {
      return {
        errors: {
          _form: [
            "You've reached the maximum number of submissions (10 per hour). Please try again later.",
          ],
        },
        success: false,
      };
    }

    // Handle validation errors
    if (response.statusCode === 400) {
      return {
        errors: {
          _form: ["Invalid form data. Please check your input and try again."],
        },
        success: false,
      };
    }

    // Handle other errors
    if (response.statusCode !== 201) {
      return {
        errors: {
          _form: ["Unable to send your message. Please try again later."],
        },
        success: false,
      };
    }

    return {
      success: true,
      message:
        "Message sent successfully! We've received your inquiry and will get back to you soon.",
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
