"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Star, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { TestimonialsHeader } from "./testimonials-header";
import { TestimonialsCarousel } from "./testimonials-carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { createRating } from "@/lib/api/general-ratings";
import type { GeneralRating } from "@/types";

// Review form validation schema
const reviewFormSchema = z.object({
  personName: z.string().min(2, "Name must be at least 2 characters").max(50, "Name must be less than 50 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message must be less than 500 characters"),
  ratings: z.number().min(1, "Please select a rating").max(5),
  personTagRole: z.string().max(50, "Role must be less than 50 characters").optional(),
  personPhone: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface TestimonialsSectionClientProps {
  testimonials: GeneralRating[];
  totalReviews: number;
}

export function TestimonialsSectionClient({
  testimonials,
  totalReviews,
}: TestimonialsSectionClientProps) {
  // Calculate average rating from current testimonials
  const averageRating =
    testimonials.length > 0
      ? testimonials.reduce((sum, t) => sum + t.ratings, 0) / testimonials.length
      : 0;
  const [isVisible, setIsVisible] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      personName: "",
      message: "",
      ratings: 0,
      personTagRole: "",
      personPhone: "",
    },
  });

  const currentRating = watch("ratings");

  const onSubmitReview = async (data: ReviewFormData) => {
    setIsSubmitting(true);

    try {
      const response = await createRating({
        personName: data.personName,
        message: data.message,
        ratings: data.ratings,
        personTagRole: data.personTagRole || undefined,
        personPhone: data.personPhone || undefined,
      });

      if (response.statusCode === 200 || response.statusCode === 201) {
        setShowSuccess(true);
        toast.success("Thank you for your review!", {
          description: "Your review has been submitted and will be published after approval.",
        });

        setTimeout(() => {
          reset();
          setShowSuccess(false);
          setIsDialogOpen(false);
        }, 2000);
      } else if (response.statusCode === 429) {
        toast.error("Too Many Requests", {
          description: "Please wait before submitting another review.",
        });
      } else {
        throw new Error("Failed to submit review");
      }
    } catch {
      toast.error("Submission Failed", {
        description: "Unable to submit your review. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    if (!isSubmitting) {
      setIsDialogOpen(false);
      reset();
      setShowSuccess(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-amber-50 dark:bg-slate-900"
      aria-labelledby="testimonials-heading"
    >
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large Quote Mark - Left */}
        <div
          className={cn(
            "absolute -left-20 top-20 text-orange-500 dark:text-orange-400 transition-all duration-1000 motion-reduce:transition-none",
            isVisible ? "opacity-[0.03] translate-x-0" : "opacity-0 -translate-x-12"
          )}
        >
          <svg
            className="w-80 h-80 md:w-96 md:h-96"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </div>

        {/* Large Quote Mark - Right */}
        <div
          className={cn(
            "absolute -right-20 bottom-20 text-orange-500 dark:text-orange-400 rotate-180 transition-all duration-1000 motion-reduce:transition-none",
            isVisible ? "opacity-[0.03] translate-x-0" : "opacity-0 translate-x-12"
          )}
        >
          <svg
            className="w-80 h-80 md:w-96 md:h-96"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
          </svg>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />

        {/* Subtle Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <TestimonialsHeader
          averageRating={averageRating}
          totalReviews={totalReviews}
          testimonials={testimonials}
        />

        {/* Testimonials Carousel */}
        <div
          className={cn(
            "transition-all duration-600 motion-reduce:transition-none",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <TestimonialsCarousel testimonials={testimonials} />
        </div>

        {/* Bottom CTA */}
        <div
          className={cn(
            "text-center mt-12 md:mt-16 transition-all duration-500 motion-reduce:transition-none",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          )}
          style={{ transitionDelay: "600ms" }}
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Join our growing community of pizza lovers
          </p>
          <button
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-98 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
          >
            <span>Leave Your Review</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 dark:via-orange-800/30 to-transparent" />

      {/* Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Leave Your Review</DialogTitle>
            <DialogDescription>
              Share your experience with us. Your review will be published after approval.
            </DialogDescription>
          </DialogHeader>

          {showSuccess ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Thank You!
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Your review has been submitted successfully.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-5">
              {/* Star Rating */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-900 dark:text-white">
                  Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setValue("ratings", star, { shouldValidate: true })}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "w-8 h-8 transition-colors",
                          (hoverRating || currentRating) >= star
                            ? "fill-orange-400 text-orange-400"
                            : "fill-none text-slate-300 dark:text-slate-600"
                        )}
                      />
                    </button>
                  ))}
                  {currentRating > 0 && (
                    <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">
                      {currentRating} of 5
                    </span>
                  )}
                </div>
                {errors.ratings && (
                  <p className="text-xs text-red-500">{errors.ratings.message}</p>
                )}
              </div>

              {/* Name */}
              <div>
                <Input
                  id="personName"
                  label="Your Name"
                  placeholder="John Doe"
                  autoComplete="name"
                  error={errors.personName?.message}
                  {...register("personName")}
                />
              </div>

              {/* Message */}
              <div>
                <TextArea
                  id="message"
                  label="Your Review"
                  placeholder="Share your experience with us..."
                  rows={4}
                  maxLength={500}
                  showCharCount
                  error={errors.message?.message}
                  {...register("message")}
                />
              </div>

              {/* Role/Title (Optional) */}
              <div>
                <Input
                  id="personTagRole"
                  label="Your Role/Title (Optional)"
                  placeholder="e.g., Food Blogger, Regular Customer"
                  error={errors.personTagRole?.message}
                  {...register("personTagRole")}
                />
              </div>

              {/* Phone (Optional) */}
              <div>
                <Input
                  id="personPhone"
                  label="Phone (Optional)"
                  type="tel"
                  placeholder="+44 20 1234 5678"
                  autoComplete="tel"
                  error={errors.personPhone?.message}
                  {...register("personPhone")}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
