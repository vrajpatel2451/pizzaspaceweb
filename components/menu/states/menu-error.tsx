"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuErrorProps {
  error?: Error;
  reset?: () => void;
  message?: string;
  showRetry?: boolean;
}

/**
 * MenuError - Client Component
 *
 * Error state component for handling API errors or data fetching failures.
 * Features:
 * - Friendly error message
 * - Optional retry button
 * - Error details display (in development)
 * - Accessibility (semantic HTML, ARIA attributes)
 */
export function MenuError({
  error,
  reset,
  message = "Something went wrong",
  showRetry = true,
}: MenuErrorProps) {
  const handleRetry = () => {
    if (reset) {
      reset();
    } else {
      // Fallback: reload the page
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] py-12">
      <Card className="w-full max-w-md mx-auto border-red-200 dark:border-red-900 bg-white dark:bg-slate-900">
        <CardHeader>
          {/* Error Icon */}
          <div
            className="mx-auto mb-4 rounded-full flex items-center justify-center w-16 h-16 bg-red-50 dark:bg-red-950"
            aria-hidden="true"
          >
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <CardTitle className="text-center text-xl font-semibold text-red-600 dark:text-red-400">
            {message}
          </CardTitle>

          {/* Description */}
          <CardDescription className="text-center text-slate-600 dark:text-slate-400">
            We encountered an error while loading the menu.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-400">
                {error.message || "An unexpected error occurred"}
              </p>
            </div>
          )}

          {/* Helpful suggestions */}
          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p className="font-medium">What you can try:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Check your internet connection</li>
              <li>Refresh the page</li>
              <li>Try again in a few moments</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>
        </CardContent>

        {showRetry && (
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center">
            {/* Retry Button */}
            <Button
              onClick={handleRetry}
              className={cn(
                "w-full sm:w-auto",
                "bg-orange-500 hover:bg-orange-600 text-white",
                "flex items-center gap-2"
              )}
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>

            {/* Go to Homepage */}
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="w-full sm:w-auto border-slate-200 dark:border-slate-700"
            >
              Go to Homepage
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
