"use client";

import {
  CheckCircle,
  ChefHat,
  Truck,
  Home,
  LucideIcon,
  Package,
} from "lucide-react";
import { OrderStatus, OrderStatusAndTimeResponse } from "@/types/order";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
  statusList: OrderStatusAndTimeResponse[];
  className?: string;
}

interface TimelineStep {
  key: string;
  label: string;
  icon: LucideIcon;
  matchStatuses: OrderStatus[];
  timestamp?: string;
  isActive: boolean;
  isCompleted: boolean;
}

// Define timeline steps (standard delivery flow)
const TIMELINE_CONFIG = [
  {
    key: "payment_confirmed",
    label: "Confirmed",
    icon: CheckCircle,
    matchStatuses: ["payment_confirmed"] as OrderStatus[],
  },
  {
    key: "preparing",
    label: "Preparing",
    icon: ChefHat,
    matchStatuses: ["preparing", "ready_to_pickup"] as OrderStatus[],
  },
  {
    key: "on_the_way",
    label: "On the Way",
    icon: Truck,
    matchStatuses: ["on_the_way"] as OrderStatus[],
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: Home,
    matchStatuses: ["delivered"] as OrderStatus[],
  },
];

// Statuses that are valid for the timeline
const VALID_TIMELINE_STATUSES: OrderStatus[] = [
  "payment_confirmed",
  "preparing",
  "ready_to_pickup",
  "on_the_way",
  "delivered",
];

export function OrderStatusTimeline({
  currentStatus,
  statusList,
  className,
}: OrderStatusTimelineProps) {
  // Hide timeline if status is not in the valid range
  if (!VALID_TIMELINE_STATUSES.includes(currentStatus)) {
    return null;
  }

  // Find current step index
  const currentStepIndex = TIMELINE_CONFIG.findIndex((step) =>
    step.matchStatuses.includes(currentStatus)
  );

  // Build timeline steps with completion status
  const timelineSteps: TimelineStep[] = TIMELINE_CONFIG.map((step, index) => {
    // Find timestamp from statusList for matching statuses
    const statusEntry = statusList.find((s) =>
      step.matchStatuses.includes(s.status)
    );

    const isCompleted = index <= currentStepIndex;
    const isActive = index === currentStepIndex;

    return {
      ...step,
      timestamp: statusEntry?.createdAt,
      isActive,
      isCompleted,
    };
  });

  return (
    <div className={cn("py-8", className)}>
      {/* Section Title */}
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Order Status
      </h2>

      {/* Timeline - Desktop (Horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800">
            {/* Progress Line */}
            <div
              className="h-full bg-orange-500 transition-all duration-500"
              style={{
                width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.key}
                  className="flex flex-col items-center"
                  style={{ width: `${100 / timelineSteps.length}%` }}
                >
                  {/* Icon Circle */}
                  <div
                    className={cn(
                      "relative z-10 w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                      step.isCompleted
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-400",
                      step.isActive && "ring-4 ring-orange-200 dark:ring-orange-500/30 animate-pulse"
                    )}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Label */}
                  <p
                    className={cn(
                      "mt-3 text-sm font-medium text-center",
                      step.isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </p>

                  {/* Timestamp */}
                  <p
                    className={cn(
                      "mt-1 text-xs text-center",
                      step.isCompleted
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.timestamp
                      ? format(new Date(step.timestamp), "hh:mm a")
                      : "--:-- --"}
                  </p>

                  {/* Status Description */}
                  <p className="mt-1 text-xs text-muted-foreground text-center">
                    {step.isCompleted
                      ? index === currentStepIndex
                        ? step.key === "preparing"
                          ? "Being prepared"
                          : step.key === "on_the_way"
                          ? "Out for delivery"
                          : step.key === "delivered"
                          ? "Order delivered"
                          : "Order confirmed"
                      : ""
                    : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timeline - Mobile (Vertical) */}
      <div className="md:hidden space-y-4">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === timelineSteps.length - 1;

          return (
            <div key={step.key} className="relative flex gap-4">
              {/* Icon and Line */}
              <div className="flex flex-col items-center">
                {/* Icon Circle */}
                <div
                  className={cn(
                    "relative z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300",
                    step.isCompleted
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-white dark:bg-slate-900 border-gray-300 dark:border-gray-700 text-gray-400",
                    step.isActive && "ring-4 ring-orange-200 dark:ring-orange-500/30 animate-pulse"
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Vertical Line */}
                {!isLast && (
                  <div
                    className={cn(
                      "w-1 flex-1 min-h-[40px]",
                      step.isCompleted
                        ? "bg-orange-500"
                        : "bg-gray-200 dark:bg-gray-800"
                    )}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <p
                  className={cn(
                    "text-base font-medium",
                    step.isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </p>
                <p
                  className={cn(
                    "text-sm mt-1",
                    step.isCompleted
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-muted-foreground"
                  )}
                >
                  {step.timestamp
                    ? format(new Date(step.timestamp), "hh:mm a")
                    : "--:-- --"}
                </p>
                {step.isCompleted && index === currentStepIndex && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {step.key === "preparing"
                      ? "Being prepared"
                      : step.key === "on_the_way"
                      ? "Out for delivery"
                      : step.key === "delivered"
                      ? "Order delivered"
                      : "Order confirmed"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
