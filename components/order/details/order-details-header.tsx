"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Star, AlertCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderResponse } from "@/types/order";
import { cn } from "@/lib/utils";
import { downloadInvoice } from "@/lib/api/order";
import { toast } from "sonner";

interface OrderDetailsHeaderProps {
  order: OrderResponse;
  className?: string;
}

export function OrderDetailsHeader({
  order,
  className,
}: OrderDetailsHeaderProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Show Rate Order button only if delivered
  const showRateButton = order.status === "delivered";

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
          <Button variant="outline" size="sm" className="gap-2">
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Rate Order</span>
          </Button>
        )}

        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Report Issue</span>
        </Button>
      </div>
    </div>
  );
}
