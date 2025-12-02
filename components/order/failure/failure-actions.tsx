"use client";

import { Button } from "@/components/ui/button";
import { Phone, FileText, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface FailureActionsProps {
  orderId: string;
  supportEmail?: string;
  supportPhone?: string;
  className?: string;
}

/**
 * FailureActions - Action buttons for failed order page
 * Client Component - Handles button interactions and navigation
 * Three actions: Contact Support, View Order Details, Order More
 */
export function FailureActions({
  orderId,
  supportEmail = "support@pizzaspace.com",
  supportPhone = "+44-123-456-7890",
  className,
}: FailureActionsProps) {
  const handleContactSupport = () => {
    // Create mailto link with pre-filled subject and body
    const subject = encodeURIComponent(`Order Issue - Order #${orderId}`);
    const body = encodeURIComponent(
      `Hello Support Team,\n\nI need assistance with my order #${orderId}. I encountered an error during the order process.\n\nPlease help me resolve this issue.\n\nThank you.`
    );
    window.location.href = `mailto:${supportEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className={`space-y-3 ${className || ""}`}>
      {/* Desktop: Horizontal Layout */}
      <div className="hidden sm:flex gap-3">
        {/* Primary Action: Contact Support */}
        <Button
          onClick={handleContactSupport}
          size="lg"
          className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          aria-label="Contact support team"
        >
          <Phone className="size-5 mr-2" aria-hidden="true" />
          Contact Support
        </Button>

        {/* Secondary Action: View Order Details */}
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="flex-1"
          aria-label="View order details"
        >
          <Link href={`/order/${orderId}`}>
            <FileText className="size-5 mr-2" aria-hidden="true" />
            View Order Details
          </Link>
        </Button>

        {/* Tertiary Action: Order More */}
        <Button
          asChild
          variant="outline"
          size="lg"
          className="flex-1"
          aria-label="Continue shopping"
        >
          <Link href="/menu">
            <ShoppingBag className="size-5 mr-2" aria-hidden="true" />
            Order More
          </Link>
        </Button>
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col gap-3 sm:hidden">
        {/* Primary Action: Contact Support */}
        <Button
          onClick={handleContactSupport}
          size="lg"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white"
          aria-label="Contact support team"
        >
          <Phone className="size-5 mr-2" aria-hidden="true" />
          Contact Support
        </Button>

        {/* Secondary Action: View Order Details */}
        <Button
          asChild
          variant="secondary"
          size="lg"
          className="w-full"
          aria-label="View order details"
        >
          <Link href={`/order/${orderId}`}>
            <FileText className="size-5 mr-2" aria-hidden="true" />
            View Order Details
          </Link>
        </Button>

        {/* Tertiary Action: Order More */}
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full"
          aria-label="Continue shopping"
        >
          <Link href="/menu">
            <ShoppingBag className="size-5 mr-2" aria-hidden="true" />
            Order More
          </Link>
        </Button>
      </div>
    </div>
  );
}
