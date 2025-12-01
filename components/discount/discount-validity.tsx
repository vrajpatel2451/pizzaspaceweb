"use client";

import * as React from "react";
import { Calendar, Clock, Infinity } from "lucide-react";
import { format, formatDistanceToNow, isPast, isFuture, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

interface DiscountValidityProps {
  startTime: Date;
  endTime: Date;
  isNeverEnding: boolean;
  className?: string;
  showCountdown?: boolean;
}

export function DiscountValidity({
  startTime,
  endTime,
  isNeverEnding,
  className,
  showCountdown = true,
}: DiscountValidityProps) {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    if (!showCountdown || isNeverEnding) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [showCountdown, isNeverEnding]);

  const startDate = new Date(startTime);
  const endDate = new Date(endTime);

  // Check if discount is active
  const isActive = isPast(startDate) && (isNeverEnding || isFuture(endDate));
  const isExpired = !isNeverEnding && isPast(endDate);
  const isUpcoming = isFuture(startDate);

  // Calculate days until expiry
  const daysUntilExpiry = isNeverEnding ? null : differenceInDays(endDate, currentTime);
  const isExpiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 3 && daysUntilExpiry >= 0;

  if (isNeverEnding) {
    return (
      <div className={cn("flex items-center gap-2 text-sm", className)}>
        <Infinity className="size-4 text-green-600 dark:text-green-400" />
        <span className="font-medium text-green-700 dark:text-green-400">
          Never expires
        </span>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-destructive", className)}>
        <Clock className="size-4" />
        <span className="font-medium">
          Expired on {format(endDate, "MMM dd, yyyy")}
        </span>
      </div>
    );
  }

  if (isUpcoming) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <Calendar className="size-4" />
        <span>
          Starts on {format(startDate, "MMM dd, yyyy")}
        </span>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2 text-sm">
        <Calendar className="size-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          Valid until {format(endDate, "MMM dd, yyyy")}
        </span>
      </div>
      {showCountdown && isExpiringSoon && (
        <div className="flex items-center gap-2 text-sm">
          <Clock className="size-4 text-orange-600 dark:text-orange-400" />
          <span className="font-medium text-orange-700 dark:text-orange-400">
            Expires {formatDistanceToNow(endDate, { addSuffix: true })}
          </span>
        </div>
      )}
    </div>
  );
}
