"use client";

import React, { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";
import { OrderTicketResponse } from "@/types/orderTicket";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TicketCardProps {
  ticket: OrderTicketResponse;
  className?: string;
  index?: number;
  isVisible?: boolean;
}

export function TicketCard({ ticket, className, index = 0, isVisible = true }: TicketCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Format relative time
  const timeAgo = formatDistanceToNow(new Date(ticket.createdAt), {
    addSuffix: true,
  });
  const createdAtISO = new Date(ticket.createdAt).toISOString();

  // Format ticket ID
  const shortTicketId = ticket._id.substring(0, 8).toUpperCase();

  // Premium status configuration with icons and glow effects
  const statusConfig = {
    open: {
      label: "In Progress",
      icon: Clock,
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      textColor: "text-amber-600 dark:text-amber-400",
      borderColor: "border-amber-200 dark:border-amber-500/30",
      glowGradient: "from-amber-400/30 via-orange-400/20 to-amber-400/30",
      hoverBorder: "border-amber-300/60 dark:border-amber-500/40",
      barGradient: "from-amber-400 via-orange-400 to-amber-500",
      dotColor: "bg-amber-500",
    },
    closed: {
      label: "Resolved",
      icon: CheckCircle2,
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      textColor: "text-emerald-600 dark:text-emerald-400",
      borderColor: "border-emerald-200 dark:border-emerald-500/30",
      glowGradient: "from-emerald-400/30 via-green-400/20 to-emerald-400/30",
      hoverBorder: "border-emerald-300/60 dark:border-emerald-500/40",
      barGradient: "from-emerald-400 via-green-400 to-emerald-500",
      dotColor: "bg-emerald-500",
    },
  };

  const config = statusConfig[ticket.status];
  const StatusIcon = config.icon;

  // Truncate message for preview
  const MAX_PREVIEW_LENGTH = 120;
  const shouldTruncate = ticket.message.length > MAX_PREVIEW_LENGTH;
  const previewMessage = shouldTruncate
    ? ticket.message.substring(0, MAX_PREVIEW_LENGTH) + "..."
    : ticket.message;

  return (
    <div
      className={cn(
        "relative group transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        isHovered && "-translate-y-0.5",
        className
      )}
      style={{ transitionDelay: isVisible ? `${index * 50}ms` : "0ms" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient glow effect on hover */}
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl opacity-0 blur-sm transition-opacity duration-300",
          `bg-gradient-to-r ${config.glowGradient}`,
          isHovered && "opacity-100"
        )}
      />

      <div
        className={cn(
          "relative rounded-xl border overflow-hidden",
          "bg-white dark:bg-slate-900/80 backdrop-blur-sm",
          "transition-all duration-300",
          "border-slate-200/80 dark:border-slate-800/80",
          isHovered && config.hoverBorder,
          "shadow-sm",
          isHovered && "shadow-lg shadow-slate-200/50 dark:shadow-black/30"
        )}
      >
        {/* Top status indicator bar */}
        <div
          className={cn(
            "h-1 w-full",
            `bg-gradient-to-r ${config.barGradient}`
          )}
        />

        <div className="p-3 sm:p-4 md:p-5">
          {/* Header: Status & Date */}
          <div className="flex items-start justify-between gap-2 sm:gap-3 mb-4">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {/* Ticket ID */}
              <span className="text-[11px] font-mono tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-2 py-0.5 rounded">
                #{shortTicketId}
              </span>

              {/* Status Badge */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium",
                  "border transition-all duration-200 shrink-0",
                  config.bgColor,
                  config.textColor,
                  config.borderColor
                )}
                role="status"
                aria-label={`Ticket status: ${config.label}`}
              >
                {/* Animated pulse dot for open status */}
                {ticket.status === "open" && (
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" />
                    <span
                      className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        config.dotColor
                      )}
                    />
                  </span>
                )}
                {ticket.status === "closed" && (
                  <StatusIcon className="w-3 h-3" />
                )}
                <span>{config.label}</span>
              </div>
            </div>

            {/* Date */}
            <time
              dateTime={createdAtISO}
              className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 shrink-0"
              aria-label={`Created ${timeAgo}`}
            >
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="font-medium">{timeAgo}</span>
            </time>
          </div>

          {/* Message Preview/Full */}
          <div className="mb-4" id={`ticket-message-${ticket._id}`}>
            <p
              className={cn(
                "text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed break-words transition-opacity duration-150",
                isExpanded ? "opacity-100" : "opacity-100"
              )}
            >
              {isExpanded ? ticket.message : previewMessage}
            </p>

            {shouldTruncate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  "mt-2 h-auto p-0 text-xs font-medium",
                  "text-orange-500 hover:text-orange-600",
                  "hover:bg-transparent transition-colors"
                )}
                aria-expanded={isExpanded}
                aria-controls={`ticket-message-${ticket._id}`}
                aria-label={isExpanded ? "Show less of message" : "Show more of message"}
              >
                <span className="flex items-center gap-1 transition-transform duration-200 hover:translate-x-0.5">
                  {isExpanded ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" />
                      Show less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" />
                      Read more
                    </>
                  )}
                </span>
              </Button>
            )}
          </div>

          {/* Image Count */}
          {ticket.imageList.length > 0 && (
            <div
              className={cn(
                "flex items-center gap-2 text-xs mb-4",
                "text-slate-500 dark:text-slate-400",
                "bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2",
                "border border-slate-100 dark:border-slate-700/50"
              )}
              role="status"
              aria-label={`${ticket.imageList.length} ${ticket.imageList.length === 1 ? "image attachment" : "image attachments"}`}
            >
              <div className="p-1 bg-slate-200 dark:bg-slate-700 rounded">
                <ImageIcon className="w-3.5 h-3.5" aria-hidden="true" />
              </div>
              <span className="font-medium">
                {ticket.imageList.length}{" "}
                {ticket.imageList.length === 1 ? "attachment" : "attachments"}
              </span>
            </div>
          )}

          {/* Closing Message (if closed) */}
          {ticket.status === "closed" && ticket.closingMessage && (
            <div
              className={cn(
                "pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 transition-all duration-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
              )}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-emerald-100 dark:bg-emerald-500/20 rounded">
                  <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                  Resolution
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed pl-7">
                &ldquo;{ticket.closingMessage}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
