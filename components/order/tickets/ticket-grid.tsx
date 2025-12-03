"use client";

import React, { useEffect, useState, useRef } from "react";
import { AlertCircle, MessageCircle, Plus, RefreshCw, HelpCircle, Sparkles } from "lucide-react";
import { OrderTicketResponse } from "@/types/orderTicket";
import { TicketCard } from "./ticket-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TicketGridProps {
  tickets: OrderTicketResponse[];
  emptyMessage?: string;
  errorMessage?: string;
  className?: string;
  onCreateTicket?: () => void;
}

export function TicketGrid({
  tickets,
  emptyMessage = "No tickets found",
  errorMessage,
  className,
  onCreateTicket,
}: TicketGridProps) {
  const [isVisible, setIsVisible] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-50px" }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Show error state if there's an error message
  if (errorMessage) {
    return (
      <div
        ref={gridRef}
        className={cn(
          "flex flex-col items-center justify-center py-20 px-4 transition-all duration-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
          className
        )}
      >
        {/* Error illustration */}
        <div className="relative mb-8">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-red-400/20 dark:bg-red-500/10 rounded-full blur-xl" />
          <div
            className={cn(
              "relative rounded-2xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 p-8 border border-red-200/50 dark:border-red-500/20 transition-transform duration-2000",
              isVisible && "animate-pulse-subtle"
            )}
          >
            <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Something went wrong
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8">
          {errorMessage}
        </p>

        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div
        ref={gridRef}
        className={cn(
          "flex flex-col items-center justify-center py-20 px-4 transition-all duration-400",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5",
          className
        )}
      >
        {/* Empty state illustration */}
        <div className="relative mb-8">
          {/* Background glow */}
          <div className="absolute inset-0 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-2xl" />

          {/* Main icon container */}
          <div
            className={cn(
              "relative transition-transform duration-3000",
              isVisible && "animate-float motion-reduce:animate-none"
            )}
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800/50 p-10 border border-slate-200/80 dark:border-slate-700/50 shadow-lg shadow-slate-200/50 dark:shadow-black/20">
              {/* Decorative elements */}
              <div
                className={cn(
                  "absolute -top-2 -right-2 transition-all duration-4000",
                  isVisible && "animate-spin-slow motion-reduce:animate-none"
                )}
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-md">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>

              <div
                className={cn(
                  "absolute -bottom-1 -left-1 transition-all duration-2000",
                  isVisible && "animate-pulse"
                )}
              >
                <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-600" />
              </div>

              {/* Main icon */}
              <div className="relative">
                <MessageCircle className="w-16 h-16 text-slate-300 dark:text-slate-600" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          {emptyMessage}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md mb-8 leading-relaxed">
          You haven&apos;t created any support tickets for this order yet.
          {onCreateTicket &&
            " Need help? Create a ticket and we'll get back to you."}
        </p>

        {onCreateTicket && (
          <div className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]">
            <Button onClick={onCreateTicket} className="gap-2 shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4" />
              Create Your First Ticket
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0",
        className
      )}
      role="list"
      aria-label="Support tickets"
    >
      {tickets.map((ticket, index) => (
        <div
          key={ticket._id}
          role="listitem"
          className={cn(
            "transition-all duration-300",
            isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-5 scale-95"
          )}
          style={{ transitionDelay: isVisible ? `${index * 100 + 50}ms` : "0ms" }}
        >
          <TicketCard ticket={ticket} index={index} isVisible={isVisible} />
        </div>
      ))}
    </div>
  );
}

// Skeleton component for loading state with premium animations
export function TicketGridSkeleton({ count = 6 }: { count?: number }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" role="status" aria-label="Loading tickets">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900/50 overflow-hidden transition-all duration-300",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          )}
          style={{ transitionDelay: isVisible ? `${i * 50}ms` : "0ms" }}
        >
          {/* Top status bar skeleton */}
          <div className="h-1 w-full bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" aria-hidden="true" />

          <div className="p-3 sm:p-4 md:p-5">
            {/* Header: Status & Date */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 flex-1">
                <Skeleton className="h-5 w-16 rounded" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-20" />
            </div>

            {/* Message Preview with varying widths for realism */}
            <div className="mb-4 space-y-2.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
              <Skeleton className="h-4 w-[75%]" />
            </div>

            {/* Image Count */}
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
