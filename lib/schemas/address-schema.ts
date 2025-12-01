import { z } from "zod";

// UK Postcode regex pattern
const UK_POSTCODE_REGEX = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;

// UK Phone number regex (basic validation for UK numbers)
const UK_PHONE_REGEX = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;

export const addressSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[\d\s\+\(\)-]+$/, "Please enter a valid phone number")
    .trim(),

  line1: z
    .string()
    .min(5, "Address line 1 must be at least 5 characters")
    .max(200, "Address line 1 must not exceed 200 characters")
    .trim(),

  line2: z
    .string()
    .max(200, "Address line 2 must not exceed 200 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  area: z
    .string()
    .min(2, "Area must be at least 2 characters")
    .max(100, "Area must not exceed 100 characters")
    .trim(),

  county: z
    .string()
    .min(2, "County must be at least 2 characters")
    .max(100, "County must not exceed 100 characters")
    .trim(),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must not exceed 100 characters")
    .trim(),

  zip: z
    .string()
    .min(3, "Postcode must be at least 3 characters")
    .max(10, "Postcode must not exceed 10 characters")
    .regex(UK_POSTCODE_REGEX, "Please enter a valid UK postcode (e.g., SW1A 1AA)")
    .trim(),

  lat: z
    .number({
      message: "Please select a location on the map or use 'Use My Location'",
    })
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),

  long: z
    .number({
      message: "Please select a location on the map or use 'Use My Location'",
    })
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),

  type: z.enum(["home", "work", "other"], {
    message: "Please select an address type",
  }),

  otherAddressLabel: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(50, "Label must not exceed 50 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  isDefault: z.boolean(),

  isForMe: z.boolean().default(true),

  recipientName: z
    .string()
    .min(2, "Recipient name must be at least 2 characters")
    .max(100, "Recipient name must not exceed 100 characters")
    .trim()
    .optional()
    .or(z.literal("")),

  recipientPhone: z
    .string()
    .min(10, "Recipient phone number must be at least 10 digits")
    .max(15, "Recipient phone number must not exceed 15 digits")
    .regex(/^[\d\s\+\(\)-]+$/, "Please enter a valid phone number")
    .trim()
    .optional()
    .or(z.literal("")),
}).refine(
  (data) => {
    // If type is "other", otherAddressLabel must be provided
    if (data.type === "other") {
      return !!data.otherAddressLabel && data.otherAddressLabel.trim().length > 0;
    }
    return true;
  },
  {
    message: "Please provide a label for 'Other' address type",
    path: ["otherAddressLabel"],
  }
).refine(
  (data) => {
    // If not for me, recipient details must be provided
    if (!data.isForMe) {
      return !!data.recipientName && data.recipientName.trim().length >= 2;
    }
    return true;
  },
  {
    message: "Recipient name is required when address is not for you",
    path: ["recipientName"],
  }
).refine(
  (data) => {
    // If not for me, recipient phone must be provided
    if (!data.isForMe) {
      return !!data.recipientPhone && data.recipientPhone.trim().length >= 10;
    }
    return true;
  },
  {
    message: "Recipient phone is required when address is not for you",
    path: ["recipientPhone"],
  }
);

export type AddressFormData = z.infer<typeof addressSchema>;
