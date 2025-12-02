"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, AlertCircle, Download, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderResponse } from "@/types/order";
import { OrderReviewWithItemsResponse } from "@/types/orderReview";
import { cn } from "@/lib/utils";
import { downloadInvoice } from "@/lib/api/order";
import { toast } from "sonner";
import { ReviewDialog } from "@/components/order/review";

interface OrderDetailsHeaderProps {
  order: OrderResponse;
  existingReview: OrderReviewWithItemsResponse | null;
  className?: string;
}

export function OrderDetailsHeader({
  order,
  existingReview,
  className,
}: OrderDetailsHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  // Show Rate Order button only if delivered and no existing review
  const showRateButton = order.status === "delivered" && !existingReview;
  // Show "Reviewed" indicator if review exists
  const hasReview = !!existingReview;

  // Show Download Invoice for completed orders (not initiated, payment_error, or cancelled)
  const showDownloadInvoice = !["initiated", "payment_error", "cancelled"].includes(order.status);

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      await downloadInvoice(order._id);
    } catch (error) {
      console.error("Failed to download invoice:", error);
      const message = error instanceof Error ? error.message : "Failed to download invoice";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Back Link */}
      <Link
        href="/order"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Orders</span>
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {showDownloadInvoice && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isDownloading ? "Downloading..." : "Download Invoice"}
            </span>
          </Button>
        )}

        {showRateButton && (
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setReviewDialogOpen(true)}
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Rate Order</span>
          </Button>
        )}

        {hasReview && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Reviewed</span>
          </div>
        )}

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive" asChild>
          <Link href={`/order/${order._id}/tickets`}>
            <AlertCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Report Issue</span>
          </Link>
        </Button>
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        order={order}
        existingReview={existingReview}
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
      />
    </div>
  );
}
