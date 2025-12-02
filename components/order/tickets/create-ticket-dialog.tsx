"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  return (
    <motion.div
      className="py-10 flex flex-col items-center justify-center gap-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <TicketConfetti />

      {/* Success icon with ring animation */}
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 1.6, 1.6], opacity: [0, 0.6, 0] }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute inset-0 rounded-full bg-green-500/15"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: [0.8, 2, 2], opacity: [0, 0.4, 0] }}
          transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
        />
        <motion.div
          className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/30"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.1,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300 }}
          >
            <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>

      {/* Success text */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
          Ticket Created!
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your support ticket has been created successfully
        </p>
      </motion.div>

      {/* Decorative sparkles */}
      <motion.div
        className="flex items-center gap-1.5"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.7 + i * 0.1,
              type: "spring",
              stiffness: 300,
            }}
          >
            <Sparkles className="w-5 h-5 text-orange-400 fill-orange-400" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
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
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <SuccessCelebration />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="pb-4 border-b border-slate-100 dark:border-slate-800">
                <motion.div
                  className="flex items-start gap-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
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
                </motion.div>
              </DialogHeader>

              <Form {...form}>
                <motion.form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
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
                  <AnimatePresence>
                    {form.formState.errors.root && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="rounded-xl bg-gradient-to-r from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border border-red-200/50 dark:border-red-500/20 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-500/20 shrink-0">
                            <motion.div
                              initial={{ rotate: 0 }}
                              animate={{ rotate: [0, -10, 10, 0] }}
                              transition={{ duration: 0.4 }}
                            >
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
                            </motion.div>
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
                      </motion.div>
                    )}
                  </AnimatePresence>

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
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[140px] w-full sm:w-auto shadow-lg shadow-orange-500/20"
                      >
                        {isSubmitting ? (
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating...
                          </motion.div>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Ticket
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </motion.form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
