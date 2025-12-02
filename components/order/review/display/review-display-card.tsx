import { Rating } from "@/components/composite/rating";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

interface ReviewDisplayCardProps {
  rating: number;
  message?: string;
  title?: string;
  className?: string;
  compact?: boolean;
}

export function ReviewDisplayCard({
  rating,
  message,
  title,
  className,
  compact = false,
}: ReviewDisplayCardProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {title && (
        <p className={cn(
          "font-medium text-muted-foreground",
          compact ? "text-xs" : "text-sm"
        )}>
          {title}
        </p>
      )}
      <div className="flex items-center gap-2">
        <Rating
          value={rating}
          size={compact ? "sm" : "default"}
          showValue
          interactive={false}
        />
      </div>
      {message && (
        <div className={cn(
          "relative pl-4 border-l-2 border-primary/20",
          compact ? "pl-3" : "pl-4"
        )}>
          <Quote className={cn(
            "absolute -left-1.5 -top-0.5 text-primary/30",
            compact ? "w-3 h-3" : "w-4 h-4"
          )} />
          <p
            className={cn(
              "text-foreground/90 italic leading-relaxed",
              compact ? "text-xs" : "text-sm"
            )}
          >
            "{message}"
          </p>
        </div>
      )}
    </div>
  );
}
