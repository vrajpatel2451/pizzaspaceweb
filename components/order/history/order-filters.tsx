"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatus, TimeRange } from "@/types/order";
import { cn } from "@/lib/utils";
import { X, Filter } from "lucide-react";
import { subDays, subYears } from "date-fns";

interface OrderFiltersProps {
  totalOrders?: number;
  className?: string;
  onFilterChange?: () => void;
}

// Time range options
const timeRangeOptions: Array<{ value: TimeRange; label: string }> = [
  { value: "all", label: "All Time" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "last30days", label: "Last 30 Days" },
  { value: "last90days", label: "Last 90 Days" },
  { value: "lastyear", label: "Last Year" },
];

// Status options based on OrderStatus
const statusOptions: Array<{ value: OrderStatus | "all"; label: string }> = [
  { value: "all", label: "All Statuses" },
  { value: "payment_confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "on_the_way", label: "On the Way" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "payment_error", label: "Payment Error" },
];

// Convert time range to API params
function getTimeRangeParams(range: TimeRange): {
  startTime?: string;
  endTime?: string;
} {
  const now = new Date();

  switch (range) {
    case "last7days":
      return {
        startTime: subDays(now, 7).toISOString(),
        endTime: now.toISOString(),
      };
    case "last30days":
      return {
        startTime: subDays(now, 30).toISOString(),
        endTime: now.toISOString(),
      };
    case "last90days":
      return {
        startTime: subDays(now, 90).toISOString(),
        endTime: now.toISOString(),
      };
    case "lastyear":
      return {
        startTime: subYears(now, 1).toISOString(),
        endTime: now.toISOString(),
      };
    case "all":
    default:
      return {};
  }
}

export function OrderFilters({ totalOrders, className, onFilterChange }: OrderFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filter values from URL
  const currentTimeRange =
    (searchParams.get("timerange") as TimeRange) || "all";
  const currentStatus = searchParams.get("status") as OrderStatus | null;

  // Check if any filters are active (non-default)
  const hasActiveFilters =
    currentTimeRange !== "all" || currentStatus !== null;

  // Count active filters
  const activeFilterCount =
    (currentTimeRange !== "all" ? 1 : 0) + (currentStatus !== null ? 1 : 0);

  // Handle time range change
  const handleTimeRangeChange = (value: TimeRange) => {
    const params = new URLSearchParams(searchParams);

    // Get time range params
    const { startTime, endTime } = getTimeRangeParams(value);

    // Update URL params
    params.set("timerange", value);

    if (startTime) {
      params.set("startTime", startTime);
    } else {
      params.delete("startTime");
    }

    if (endTime) {
      params.set("endTime", endTime);
    } else {
      params.delete("endTime");
    }

    // Reset to page 1 when filters change
    params.delete("page");

    onFilterChange?.();
    router.push(`/order?${params.toString()}`);
  };

  // Handle status change
  const handleStatusChange = (value: OrderStatus | "all") => {
    const params = new URLSearchParams(searchParams);

    if (value === "all") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    // Reset to page 1 when filters change
    params.delete("page");

    onFilterChange?.();
    router.push(`/order?${params.toString()}`);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const params = new URLSearchParams();
    // Keep limit if it exists
    const limit = searchParams.get("limit");
    if (limit) {
      params.set("limit", limit);
    }

    onFilterChange?.();
    router.push(`/order?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      {/* Left section: Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Time Range Select */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          <Select
            value={currentTimeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRangeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Select */}
        <div className="flex items-center gap-2">
          <Select
            value={currentStatus || "all"}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filter badge */}
        {hasActiveFilters && (
          <Badge variant="secondary" className="hidden sm:inline-flex">
            {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"}{" "}
            active
          </Badge>
        )}
      </div>

      {/* Right section: Clear button and order count */}
      <div className="flex items-center gap-3">
        {/* Total orders display */}
        {totalOrders !== undefined && (
          <span className="text-sm text-muted-foreground">
            {totalOrders} {totalOrders === 1 ? "order" : "orders"}
          </span>
        )}

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="gap-1.5"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
