"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentIndex: number;
  totalSlides: number;
  onDotClick: (index: number) => void;
}

export function CarouselControls({
  onPrev,
  onNext,
  canScrollPrev,
  canScrollNext,
  isPlaying,
  onTogglePlay,
  currentIndex,
  totalSlides,
  onDotClick,
}: CarouselControlsProps) {
  return (
    <div className="flex flex-col items-center gap-6 mt-8 md:mt-12">
      {/* Navigation Row */}
      <div className="flex items-center justify-center gap-4 md:gap-6">
        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!canScrollPrev}
          className={cn(
            "group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full",
            "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700",
            "shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-all duration-300 motion-reduce:transition-none",
            canScrollPrev
              ? "hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 cursor-pointer hover:scale-105 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
              : "opacity-50 cursor-not-allowed"
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft
            className={cn(
              "w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400 transition-colors duration-300 motion-reduce:transition-none",
              canScrollPrev ? "group-hover:text-orange-500" : ""
            )}
            aria-hidden="true"
          />
        </button>

        {/* Dots Navigation */}
        <div className="flex items-center gap-1" role="group" aria-label="Testimonial navigation">
          {[...Array(totalSlides)].map((_, i) => (
            <button
              key={i}
              onClick={() => onDotClick(i)}
              className="relative min-w-[44px] min-h-[44px] flex items-center justify-center touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 rounded-full hover:scale-105 active:scale-95 transition-transform duration-200 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
              aria-label={`Go to testimonial ${i + 1} of ${totalSlides}`}
              aria-current={i === currentIndex ? "true" : "false"}
            >
              <span
                className={cn(
                  "block rounded-full transition-all duration-300 motion-reduce:transition-none",
                  i === currentIndex
                    ? "w-8 md:w-10 h-3 bg-gradient-to-r from-orange-500 to-orange-600"
                    : "w-3 h-3 bg-slate-300 dark:bg-slate-600 hover:bg-orange-300 dark:hover:bg-orange-800"
                )}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!canScrollNext}
          className={cn(
            "group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full",
            "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700",
            "shadow-lg shadow-slate-200/50 dark:shadow-black/20 transition-all duration-300 motion-reduce:transition-none",
            canScrollNext
              ? "hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/30 cursor-pointer hover:scale-105 active:scale-95 motion-reduce:hover:scale-100 motion-reduce:active:scale-100"
              : "opacity-50 cursor-not-allowed"
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight
            className={cn(
              "w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-slate-400 transition-colors duration-300 motion-reduce:transition-none",
              canScrollNext ? "group-hover:text-orange-500" : ""
            )}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Play/Pause and Progress */}
      <div className="flex items-center gap-4">
        <button
          onClick={onTogglePlay}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95 motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:active:scale-100",
            isPlaying
              ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-orange-50 dark:hover:bg-orange-950/30"
          )}
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Autoplay On</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Autoplay Off</span>
            </>
          )}
        </button>

        {/* Slide Counter */}
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium" aria-live="polite" aria-atomic="true">
          <span className="sr-only">Testimonial </span>
          <span className="text-orange-500 font-bold">{currentIndex + 1}</span>
          <span className="mx-1" aria-hidden="true">/</span>
          <span className="sr-only"> of </span>
          <span>{totalSlides}</span>
        </div>
      </div>
    </div>
  );
}
