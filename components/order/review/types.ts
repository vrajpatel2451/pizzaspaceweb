import { Control, FieldErrors, UseFormReturn } from "react-hook-form";
import {
  OrderResponse,
  OrderItemResponse,
  StaffResponse,
} from "@/types/order";
import { OrderReviewWithItemsResponse } from "@/types/orderReview";

// ==================== Form Data Types ====================

export interface ItemReviewFormData {
  itemId: string;
  rating: number;
  message?: string;
}

export interface ReviewFormData {
  // Order review (rating is required, message is optional)
  orderRating: number;
  orderMessage?: string;

  // Rider review (conditional - required only if rider exists)
  riderRating?: number;
  riderMessage?: string;

  // Item reviews (array with one entry per order item)
  items: ItemReviewFormData[];
}

// ==================== Container Component Props ====================

export interface OrderReviewDialogProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export interface OrderReviewFormProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// ==================== Section Component Props ====================

export interface OrderReviewSectionProps {
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

export interface RiderReviewSectionProps {
  rider: StaffResponse;
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

export interface ItemsReviewSectionProps {
  items: OrderItemResponse[];
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

// ==================== Card Component Props ====================

export interface ItemReviewCardProps {
  item: OrderItemResponse;
  index: number;
  control: Control<ReviewFormData>;
  errors: FieldErrors<ReviewFormData>;
}

export interface RiderInfoDisplayProps {
  rider: StaffResponse;
  className?: string;
}

// ==================== Display Component Props ====================

export interface ReviewDisplayCardProps {
  rating: number;
  message?: string;
  title?: string;
  className?: string;
  compact?: boolean;
}

export interface ItemReviewBadgeProps {
  rating: number;
  message?: string;
  className?: string;
}

export interface ReviewSummaryProps {
  review: OrderReviewWithItemsResponse;
  className?: string;
}

// ==================== Hook Types ====================

export interface UseReviewFormOptions {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  onSuccess?: () => void;
}

export interface UseReviewFormReturn {
  form: UseFormReturn<ReviewFormData>;
  onSubmit: (data: ReviewFormData) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  hasRider: boolean;
}

// ==================== Payload Construction Types ====================

export interface PayloadConstructionContext {
  formData: ReviewFormData;
  order: OrderResponse;
  hasRider: boolean;
}
