"use client";

import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

/**
 * Error Boundary for Menu Page
 * Catches and displays errors that occur during data fetching or rendering
 * Provides a retry mechanism to attempt reloading the page
 */
export default function MenuError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service (e.g., Sentry, LogRocket)
    console.error("Menu page error:", error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto border-red-200 dark:border-red-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            Something went wrong
          </CardTitle>
          <CardDescription>
            We encountered an error while loading the menu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {error.message || "An unexpected error occurred"}
          </p>
          {error.digest && (
            <p className="text-xs text-slate-500 dark:text-slate-500 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              Error ID: {error.digest}
            </p>
          )}
          <div className="text-xs text-muted-foreground">
            If this problem persists, please contact our support team.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={reset}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
            className="w-full"
          >
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
