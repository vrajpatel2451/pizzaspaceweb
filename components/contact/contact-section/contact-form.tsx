"use client";

import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, MessageSquare, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { submitContactFormDirect } from "@/lib/actions/contact";
import { contactQuerySchema, contactSubjectOptions } from "@/lib/schemas";
import type { ContactQueryFormData } from "@/lib/schemas";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const firstErrorRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setError,
  } = useForm<ContactQueryFormData>({
    resolver: zodResolver(contactQuerySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "general inquiry",
      message: "",
    },
  });

  // Focus on first error when validation fails
  useEffect(() => {
    if (Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.focus();
    }
  }, [errors]);

  const onSubmit = async (data: ContactQueryFormData) => {
    setIsSubmitting(true);

    try {
      // Call Server Action
      const result = await submitContactFormDirect(data);

      if (result.success) {
        // Show success message
        setShowSuccess(true);
        toast.success("Message Sent!", {
          description: result.message || "We've received your message and will get back to you soon.",
          duration: 5000,
        });

        // Reset form after short delay
        setTimeout(() => {
          reset();
          setShowSuccess(false);
        }, 3000);
      } else {
        // Handle server-side validation errors
        if (result.errors) {
          // Set field-level errors
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (field !== "_form" && messages) {
              setError(field as keyof ContactQueryFormData, {
                type: "server",
                message: messages[0],
              });
            }
          });

          // Show form-level error
          if (result.errors._form) {
            toast.error("Failed to Send", {
              description: result.errors._form[0],
            });
          }
        }
      }
    } catch (error) {
      // Log error in development only
      if (process.env.NODE_ENV === 'development') {
        console.error("Contact form error:", error);
      }
      toast.error("Failed to Send", {
        description: "Unable to send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-8 flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4" role="status" aria-live="polite">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-green-500 dark:text-green-400" aria-hidden="true" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Message Sent!</h3>
          <p className="text-gray-600 dark:text-gray-300">We&apos;ll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 lg:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Send us a Message</h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Fill out the form below and we&apos;ll respond shortly</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500 dark:text-orange-400" aria-hidden="true" />
            Your Name
            <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            autoComplete="name"
            className={cn(errors.name && "border-red-500 focus:ring-red-500")}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            aria-required="true"
            {...register("name")}
            ref={(e) => {
              register("name").ref(e);
              if (errors.name && !firstErrorRef.current) {
                firstErrorRef.current = e;
              }
            }}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email and Phone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-500 dark:text-orange-400" aria-hidden="true" />
              Email
              <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
              <span className="sr-only">(required)</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              autoComplete="email"
              className={cn(errors.email && "border-red-500 focus:ring-red-500")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "email-error" : undefined}
              aria-required="true"
              {...register("email")}
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500 dark:text-orange-400" aria-hidden="true" />
              Phone Number
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">(optional)</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+44 20 1234 5678"
              autoComplete="tel"
              className={cn(errors.phone && "border-red-500 focus:ring-red-500")}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              {...register("phone")}
            />
            {errors.phone && (
              <p id="phone-error" role="alert" className="text-sm text-red-500">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div>

        {/* Subject Select */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500 dark:text-orange-400" aria-hidden="true" />
            Subject
            <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="subject"
                  className={cn(
                    "w-full",
                    errors.subject && "border-red-500 focus:ring-red-500"
                  )}
                  aria-invalid={errors.subject ? "true" : "false"}
                  aria-describedby={errors.subject ? "subject-error" : undefined}
                  aria-required="true"
                >
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {contactSubjectOptions.map((subject) => (
                    <SelectItem key={subject.value} value={subject.value}>
                      {subject.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.subject && (
            <p id="subject-error" role="alert" className="text-sm text-red-500">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500 dark:text-orange-400" aria-hidden="true" />
            Your Message
            <span className="text-red-500 dark:text-red-400" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </Label>
          <TextArea
            id="message"
            placeholder="Tell us how we can help you..."
            rows={5}
            maxLength={2000}
            showCharCount={true}
            className={cn(
              "resize-none",
              errors.message && "border-red-500 focus:ring-red-500"
            )}
            aria-invalid={errors.message ? "true" : "false"}
            aria-describedby={errors.message ? "message-error message-hint" : "message-hint"}
            aria-required="true"
            {...register("message")}
          />
          <p id="message-hint" className="sr-only">
            Enter a message between 10 and 2000 characters
          </p>
          {errors.message && (
            <p id="message-error" role="alert" className="text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-6 text-lg font-semibold"
          aria-live="polite"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              Sending Message...
            </>
          ) : (
            <>
              <Send className="mr-2 h-5 w-5" aria-hidden="true" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
