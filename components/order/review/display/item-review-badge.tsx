import { Rating } from "@/components/composite/rating";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface ItemReviewBadgeProps {
  rating: number;
  message?: string;
  className?: string;
}

export function ItemReviewBadge({
  rating,
  message,
  className,
}: ItemReviewBadgeProps) {
  return (
    <div className={cn(
      "mt-2 p-2.5 rounded-lg bg-gradient-to-r from-primary/5 to-transparent border border-primary/10",
      className
    )}>
      <div className="flex items-center gap-2">
        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-xs font-medium text-muted-foreground">Your rating:</span>
        <Rating value={rating} size="sm" showValue interactive={false} />
      </div>
      {message && (
        <p
          className="text-xs text-muted-foreground/80 mt-1.5 pl-5.5 truncate italic"
          title={message}
        >
          "{message}"
        </p>
      )}
    </div>
  );
}
