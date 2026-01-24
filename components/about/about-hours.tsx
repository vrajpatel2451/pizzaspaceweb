"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import type { OpeningHours } from "@/types";
import {
  formatOpeningHours,
  isStoreOpen,
  getTodayHours,
} from "@/lib/api/server-fetchers";

interface AboutHoursProps {
  hours: OpeningHours[];
}

export function AboutHours({ hours }: AboutHoursProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Check if store is open on mount and update every minute
    const checkOpenStatus = () => {
      setIsOpen(isStoreOpen(hours));
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [hours]);

  const formattedHours = formatOpeningHours(hours);
  const todayHours = getTodayHours(hours);

  return (
    <div
      ref={sectionRef}
      className={cn(
        "transition-all duration-600",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <Card className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-sm border-slate-200 dark:border-navy-700">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-500/10">
                <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-2xl text-slate-900 dark:text-white">
                  Opening Hours
                </CardTitle>
                <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                  Visit us during these times
                </CardDescription>
              </div>
            </div>
            {isOpen ? (
              <Badge variant="success" size="lg" className="gap-1.5 shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Open Now
              </Badge>
            ) : (
              <Badge variant="destructive" size="lg" className="shrink-0">
                Closed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Today's hours highlight */}
          {todayHours && (
            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-semibold text-orange-900 dark:text-orange-300">
                  Today ({todayHours.day})
                </span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatTime(todayHours.startTime)} - {formatTime(todayHours.endTime)}
              </p>
            </div>
          )}

          {/* All hours */}
          <div className="space-y-2">
            {formattedHours.map((hourString, index) => {
              const [days, times] = hourString.split(": ");
              const isTodayLine = todayHours && days.includes(todayHours.day);

              return (
                <div
                  key={index}
                  className={cn(
                    "flex justify-between items-center py-2 px-3 rounded-lg transition-colors",
                    isTodayLine
                      ? "bg-slate-50 dark:bg-navy-700/50"
                      : "hover:bg-slate-50 dark:hover:bg-navy-700/30"
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isTodayLine
                        ? "text-orange-600 dark:text-orange-400"
                        : "text-slate-700 dark:text-slate-300"
                    )}
                  >
                    {days}
                  </span>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {times}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTime(time: string): string {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}
