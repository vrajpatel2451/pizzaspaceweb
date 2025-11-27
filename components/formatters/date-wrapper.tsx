import * as React from "react";
import { cn } from "@/lib/utils";

export interface DateWrapperProps {
  value: Date | string | number;
  format?: "short" | "medium" | "long" | "relative";
  locale?: string;
  className?: string;
  showTime?: boolean;
}

const formatConfigs: Record<
  "short" | "medium" | "long",
  Intl.DateTimeFormatOptions
> = {
  short: {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  },
  medium: {
    day: "numeric",
    month: "short",
    year: "numeric",
  },
  long: {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
};

function getRelativeTime(date: Date, locale: string): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(-Math.round(diffInSeconds), "second");
  }

  const diffInMinutes = diffInSeconds / 60;
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(-Math.round(diffInMinutes), "minute");
  }

  const diffInHours = diffInMinutes / 60;
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(-Math.round(diffInHours), "hour");
  }

  const diffInDays = diffInHours / 24;
  if (Math.abs(diffInDays) < 7) {
    return rtf.format(-Math.round(diffInDays), "day");
  }

  const diffInWeeks = diffInDays / 7;
  if (Math.abs(diffInWeeks) < 4) {
    return rtf.format(-Math.round(diffInWeeks), "week");
  }

  const diffInMonths = diffInDays / 30;
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(-Math.round(diffInMonths), "month");
  }

  const diffInYears = diffInDays / 365;
  return rtf.format(-Math.round(diffInYears), "year");
}

export function DateWrapper({
  value,
  format = "medium",
  locale = "en-GB",
  className,
  showTime = false,
}: DateWrapperProps) {
  const date = React.useMemo(() => {
    if (value instanceof Date) return value;
    return new Date(value);
  }, [value]);

  const formattedDate = React.useMemo(() => {
    if (format === "relative") {
      return getRelativeTime(date, locale);
    }

    const options: Intl.DateTimeFormatOptions = {
      ...formatConfigs[format],
      ...(showTime && {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    return new Intl.DateTimeFormat(locale, options).format(date);
  }, [date, format, locale, showTime]);

  const isoString = date.toISOString();

  return (
    <time dateTime={isoString} className={cn("tabular-nums", className)}>
      {formattedDate}
    </time>
  );
}
