"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, isFuture, startOfToday } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  User,
  Phone,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { StoreResponse } from "@/types";

// Validation schema
const reservationSchema = z.object({
  storeId: z.string().min(1, "Please select a location"),
  date: z.date({
    message: "Please select a date",
  }).refine((date) => isFuture(date) || format(date, "yyyy-MM-dd") === format(startOfToday(), "yyyy-MM-dd"), {
    message: "Please select a future date",
  }),
  time: z.string().min(1, "Please select a time"),
  guests: z.number().min(1, "At least 1 guest required").max(20, "Maximum 20 guests allowed"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().regex(/^[\d\s\-\+\(\)]+$/, "Please enter a valid phone number").min(10, "Phone number must be at least 10 digits"),
  specialRequests: z.string().optional(),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

interface ReservationFormProps {
  stores: StoreResponse[];
}

// Time slots for reservation
const timeSlots = [
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
  "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM",
  "8:00 PM", "8:30 PM", "9:00 PM", "9:30 PM",
  "10:00 PM", "10:30 PM",
];

export function ReservationForm({ stores }: ReservationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      storeId: "",
      time: "",
      guests: 2,
      name: "",
      phone: "",
      specialRequests: "",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const selectedStore = stores.find((s) => s._id === data.storeId);

      // Show success message
      setShowSuccess(true);
      toast.success("Reservation Confirmed!", {
        description: `Your table for ${data.guests} at ${selectedStore?.name} on ${format(data.date, "MMM dd, yyyy")} at ${data.time} has been booked.`,
        duration: 5000,
      });

      // Reset form after short delay
      setTimeout(() => {
        reset();
        setShowSuccess(false);
      }, 3000);

      console.log("Reservation data:", {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      });
    } catch {
      toast.error("Reservation Failed", {
        description: "Unable to book your reservation. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-500"
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
          <h3 className="text-2xl font-bold text-gray-900">Reservation Confirmed!</h3>
          <p className="text-gray-600">We look forward to serving you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Make a Reservation</h3>
        <p className="text-gray-600 mt-1">Book your table in advance</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Location Select */}
        <div className="space-y-2">
          <Label htmlFor="storeId" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Location
            <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="storeId"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="storeId"
                  className={cn(
                    "w-full",
                    errors.storeId && "border-red-500 focus:ring-red-500"
                  )}
                  aria-invalid={errors.storeId ? "true" : "false"}
                  aria-describedby={errors.storeId ? "storeId-error" : undefined}
                >
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {stores.map((store) => (
                    <SelectItem key={store._id} value={store._id}>
                      {store.name} - {store.area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.storeId && (
            <p id="storeId-error" role="alert" className="text-sm text-red-500">
              {errors.storeId.message}
            </p>
          )}
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label htmlFor="date" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-orange-500" />
              Date
              <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !field.value && "text-slate-500",
                        errors.date && "border-red-500 focus:ring-red-500"
                      )}
                      aria-invalid={errors.date ? "true" : "false"}
                      aria-describedby={errors.date ? "date-error" : undefined}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < startOfToday()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.date && (
              <p id="date-error" role="alert" className="text-sm text-red-500">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Time Select */}
          <div className="space-y-2">
            <Label htmlFor="time" className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Time
              <span className="text-red-500">*</span>
            </Label>
            <Controller
              name="time"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    id="time"
                    className={cn(
                      "w-full",
                      errors.time && "border-red-500 focus:ring-red-500"
                    )}
                    aria-invalid={errors.time ? "true" : "false"}
                    aria-describedby={errors.time ? "time-error" : undefined}
                  >
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.time && (
              <p id="time-error" role="alert" className="text-sm text-red-500">
                {errors.time.message}
              </p>
            )}
          </div>
        </div>

        {/* Number of Guests */}
        <div className="space-y-2">
          <Label htmlFor="guests" className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            Number of Guests
            <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="guests"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => field.onChange(Math.max(1, (field.value || 1) - 1))}
                  disabled={(field.value || 1) <= 1}
                  aria-label="Decrease guest count"
                >
                  <span className="text-lg">-</span>
                </Button>
                <div className="flex-1 text-center">
                  <input
                    {...field}
                    type="number"
                    min="1"
                    max="20"
                    className="w-full text-center border rounded-md px-4 py-2"
                    aria-label="Number of guests"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => field.onChange(Math.min(20, (field.value || 1) + 1))}
                  disabled={(field.value || 1) >= 20}
                  aria-label="Increase guest count"
                >
                  <span className="text-lg">+</span>
                </Button>
              </div>
            )}
          />
          {errors.guests && (
            <p id="guests-error" role="alert" className="text-sm text-red-500">
              {errors.guests.message}
            </p>
          )}
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-orange-500" />
            Your Name
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="John Doe"
            autoComplete="name"
            className={cn(errors.name && "border-red-500 focus:ring-red-500")}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-orange-500" />
            Phone Number
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
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

        {/* Special Requests */}
        <div className="space-y-2">
          <Label htmlFor="specialRequests" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-orange-500" />
            Special Requests
            <span className="text-gray-400 text-sm font-normal">(Optional)</span>
          </Label>
          <TextArea
            id="specialRequests"
            placeholder="Any dietary restrictions or special occasions..."
            rows={3}
            className="resize-none"
            {...register("specialRequests")}
          />
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-3">
          <Controller
            name="agreeToTerms"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="agreeToTerms"
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-invalid={errors.agreeToTerms ? "true" : "false"}
                aria-describedby={errors.agreeToTerms ? "terms-error" : undefined}
                className={cn(
                  "mt-0.5",
                  errors.agreeToTerms && "border-red-500"
                )}
              />
            )}
          />
          <div className="space-y-1">
            <Label
              htmlFor="agreeToTerms"
              className="text-sm font-normal cursor-pointer"
            >
              I agree to the{" "}
              <a href="/terms" className="text-orange-500 hover:underline">
                terms and conditions
              </a>
              <span className="text-red-500 ml-1">*</span>
            </Label>
            {errors.agreeToTerms && (
              <p id="terms-error" role="alert" className="text-sm text-red-500">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Booking Table...
            </>
          ) : (
            "Book Table"
          )}
        </Button>
      </form>
    </div>
  );
}
