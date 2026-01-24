"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Users, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { reservationSchema, generateTimeSlots, type ReservationFormData } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { createReservation } from "@/lib/actions/reservation.actions";
import { toast } from "sonner";

interface ReservationFormProps {
  storeId: string;
  storeName: string;
  openingHours?: { startTime: string; endTime: string };
  onSuccess?: () => void;
}

export function ReservationForm({
  storeId,
  storeName,
  openingHours = { startTime: "10:00", endTime: "23:00" },
  onSuccess,
}: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservationDetails, setReservationDetails] = useState<ReservationFormData | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      storeId,
      date: "",
      time: "",
      noOfGuest: 2,
      name: "",
      phone: "",
      message: "",
    },
  });

  const selectedDate = watch("date");
  const guestCount = watch("noOfGuest");

  // Generate time slots based on opening hours
  const timeSlots = generateTimeSlots(
    openingHours.startTime,
    openingHours.endTime,
    30
  );

  // Calculate min and max dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createReservation(data);

      if (result.success) {
        setReservationDetails(data);
        setShowSuccess(true);
        toast.success("Reservation submitted successfully!");
      } else {
        if (result.error === "RATE_LIMIT") {
          toast.error("Too many reservation requests. Please try again later.");
        } else {
          toast.error(result.error || "Failed to submit reservation. Please try again.");
        }
      }
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const incrementGuests = () => {
    const current = guestCount || 0;
    if (current < 100) {
      setValue("noOfGuest", current + 1, { shouldValidate: true });
    }
  };

  const decrementGuests = () => {
    const current = guestCount || 0;
    if (current > 1) {
      setValue("noOfGuest", current - 1, { shouldValidate: true });
    }
  };

  // Success view
  if (showSuccess && reservationDetails) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto">
          <svg
            className="w-8 h-8 text-green-600 dark:text-green-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Reservation Submitted
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Your reservation request has been received and is pending confirmation.
          </p>
        </div>

        <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 text-left space-y-2">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-3">
            Reservation Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Store:</span>
              <span className="font-medium text-slate-900 dark:text-white">{storeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Date:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {format(new Date(reservationDetails.date), "PPP")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Time:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {reservationDetails.time}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Guests:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {reservationDetails.noOfGuest}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Name:</span>
              <span className="font-medium text-slate-900 dark:text-white">
                {reservationDetails.name}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          We&apos;ll contact you at {reservationDetails.phone} to confirm your reservation.
        </p>

        <Button
          type="button"
          onClick={onSuccess}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          Close
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Date Picker */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Date <span className="text-red-500">*</span>
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                errors.date && "border-destructive"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(new Date(selectedDate), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(date) => {
                if (date) {
                  setValue("date", format(date, "yyyy-MM-dd"), {
                    shouldValidate: true,
                  });
                }
              }}
              disabled={(date) => date < today || date > maxDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <p className="text-xs text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Time Slot */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Time <span className="text-red-500">*</span>
        </label>
        <Select
          value={watch("time")}
          onValueChange={(value) => setValue("time", value, { shouldValidate: true })}
        >
          <SelectTrigger
            className={cn(
              "w-full",
              errors.time && "border-destructive"
            )}
          >
            <Clock className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => (
              <SelectItem key={slot} value={slot}>
                {slot}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && (
          <p className="text-xs text-destructive">{errors.time.message}</p>
        )}
      </div>

      {/* Number of Guests */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">
          Number of Guests <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={decrementGuests}
            disabled={guestCount <= 1}
            className="h-11 w-11 shrink-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <div className="relative flex-1">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              {...register("noOfGuest", { valueAsNumber: true })}
              className={cn(
                "w-full h-11 pl-10 pr-4 text-center text-base font-semibold rounded-lg border bg-background transition-all duration-200 outline-none",
                errors.noOfGuest
                  ? "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20"
                  : "border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
              )}
              min={1}
              max={100}
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={incrementGuests}
            disabled={guestCount >= 100}
            className="h-11 w-11 shrink-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {errors.noOfGuest && (
          <p className="text-xs text-destructive">{errors.noOfGuest.message}</p>
        )}
      </div>

      {/* Name */}
      <Input
        label="Full Name"
        placeholder="Enter your full name"
        error={errors.name?.message}
        {...register("name")}
        required
      />

      {/* Phone */}
      <Input
        label="Phone Number"
        type="tel"
        placeholder="+44 1234 567890"
        error={errors.phone?.message}
        {...register("phone")}
        required
      />

      {/* Message (Optional) */}
      <TextArea
        label="Special Requests (Optional)"
        placeholder="Any dietary requirements or special requests?"
        maxLength={1000}
        showCharCount
        error={errors.message?.message}
        {...register("message")}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        loading={isSubmitting}
        className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-base font-semibold"
      >
        {isSubmitting ? "Submitting..." : "Reserve Table"}
      </Button>

      <p className="text-xs text-center text-slate-500 dark:text-slate-400">
        Your reservation is subject to availability and will be confirmed by our team.
      </p>
    </form>
  );
}
