"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, CheckCircle, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/textarea";
import { ImageUpload } from "./image-upload";
import { createTicket } from "@/lib/api/orderTicket";
import { CreateTicketData } from "@/types/orderTicket";
import { TicketConfetti } from "./animations/ticket-confetti";
import { cn } from "@/lib/utils";

// Form validation schema
const createTicketSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
  images: z
    .array(z.instanceof(File))
    .max(5, "Maximum 5 images allowed")
    .default([]),
});

type CreateTicketFormData = z.infer<typeof createTicketSchema>;

interface CreateTicketDialogProps {
  orderId: string;
  storeId: string;
  onSuccess?: () => void;
}

// Success celebration component
function SuccessCelebration() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div
      className={cn(
        "py-10 flex flex-col items-center justify-center gap-6 relative transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    >
      <TicketConfetti />

      {/* Success icon with ring animation */}
      <div className="relative">
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-green-500/20 transition-all duration-1000",
            isVisible ? "scale-150 opacity-0" : "scale-80 opacity-60"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 rounded-full bg-green-500/15 transition-all duration-1200 delay-100",
            isVisible ? "scale-200 opacity-0" : "scale-80 opacity-40"
          )}
        />
        <div
          className={cn(
            "relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30 transition-all duration-500 delay-100",
            isVisible ? "scale-100 rotate-0" : "scale-0 -rotate-180"
          )}
        >
          <div
            className={cn(
              "transition-all duration-300 delay-350",
              isVisible ? "scale-100" : "scale-0"
            )}
          >
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
        </div>
      </div>

      {/* Success text */}
      <div
        className={cn(
          "text-center space-y-2 transition-all duration-400 delay-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        )}
      >
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ticket Created!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your support ticket has been created successfully
        </p>
      </div>

      {/* Decorative sparkles */}
      <div
        className={cn(
          "flex items-center gap-1.5 transition-all duration-300 delay-600",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-80"
        )}
      >
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "transition-all duration-300",
              isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-0"
            )}
            style={{ transitionDelay: isVisible ? `${700 + i * 100}ms` : "0ms" }}
          >
            <Sparkles className="w-5 h-5 text-orange-400 fill-orange-400" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CreateTicketDialog({
  orderId,
  storeId,
  onSuccess,
}: CreateTicketDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    if (open && !showSuccess) {
      requestAnimationFrame(() => setIsFormVisible(true));
    } else {
      setIsFormVisible(false);
    }
  }, [open, showSuccess]);

  const form = useForm({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      message: "",
      images: [] as File[],
    },
  });

  const onSubmit = async (data: CreateTicketFormData) => {
    try {
      setIsSubmitting(true);

      // TODO: Upload images to server and get URLs
      // For now, we're just storing empty array as per requirements
      const imageUrls: string[] = [];

      const ticketData: CreateTicketData = {
        orderId,
        storeId,
        message: data.message,
        imageList: imageUrls,
      };

      const response = await createTicket(ticketData);

      if (response.statusCode === 200 || response.statusCode === 201) {
        // Show success animation
        setShowSuccess(true);

        // Close dialog after animation
        setTimeout(() => {
          form.reset();
          setShowSuccess(false);
          setOpen(false);
          onSuccess?.();
        }, 2500);
      } else {
        // Handle error
        console.error("Failed to create ticket:", response.errorMessage);
        form.setError("root", {
          message: response.errorMessage || "Failed to create ticket",
        });
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      form.setError("root", {
        message: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isSubmitting && !showSuccess) {
      setOpen(newOpen);
      if (!newOpen) {
        form.reset();
        setShowSuccess(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button aria-label="Create a new support ticket">
          <Plus className="w-4 h-4 mr-2" />
          Create Ticket
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {showSuccess ? (
          <div className="transition-all duration-200">
            <SuccessCelebration />
          </div>
        ) : (
          <div className="transition-opacity duration-200">
            <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
              <div
                className={cn(
                  "flex items-start gap-4 transition-all duration-300",
                  isFormVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                )}
                style={{ transitionDelay: "100ms" }}
              >
                {/* Icon with gradient background */}
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-orange-400/20 blur-lg rounded-full" />
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    Create Support Ticket
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Describe your issue and our support team will respond as
                    soon as possible.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={cn(
                  "space-y-6 transition-all duration-300",
                  isFormVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                )}
                style={{ transitionDelay: "150ms" }}
              >
                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-semibold">
                          Describe your issue
                          <span className="sr-only">(required)</span>
                        </FormLabel>
                        <span
                          className="text-[11px] text-slate-400 dark:text-slate-500 font-medium"
                          aria-hidden="true"
                        >
                          Required
                        </span>
                      </div>
                      <FormControl>
                        <TextArea
                          placeholder="Please describe your issue in detail. Include any relevant order numbers, item names, or specific problems you're experiencing..."
                          className="min-h-[150px] resize-y transition-all duration-200 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                          maxLength={1000}
                          showCharCount
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                        The more detail you provide, the faster we can help
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload Field */}
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-semibold">
                          Attachments
                        </FormLabel>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                          Optional
                        </span>
                      </div>
                      <FormControl>
                        <ImageUpload
                          value={field.value || []}
                          onChange={field.onChange}
                          maxFiles={5}
                          maxSizeMB={5}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription className="text-xs text-slate-500 dark:text-slate-400">
                        Screenshots or photos help us understand your issue
                        better
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Root Error Message */}
                {form.formState.errors.root && (
                  <div
                    className={cn(
                      "rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border border-red-200/50 dark:border-red-500/20 p-4 transition-all duration-200",
                      form.formState.errors.root ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-500/20 shrink-0">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">
                          Unable to create ticket
                        </p>
                        <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                          {form.formState.errors.root.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <DialogFooter className="gap-3 pt-2 flex-col sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isSubmitting}
                    className="border-slate-200 dark:border-slate-700 w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <div
                    className={cn(
                      "w-full sm:w-auto transition-transform duration-150",
                      !isSubmitting && "hover:scale-[1.02] active:scale-[0.98]"
                    )}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="min-w-[140px] w-full sm:w-auto shadow-lg shadow-orange-500/20"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4" />
                          Create Ticket
                        </span>
                      )}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </Form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
