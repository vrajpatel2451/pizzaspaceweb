import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-medium whitespace-nowrap shrink-0 [&>svg]:pointer-events-none transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-white",
        success:
          "border-transparent bg-green-500 text-white",
        warning:
          "border-transparent bg-yellow-500 text-white",
        info:
          "border-transparent bg-blue-500 text-white",
        outline:
          "border-border bg-transparent text-foreground",
        "outline-primary":
          "border-primary bg-transparent text-primary",
        muted:
          "border-transparent bg-muted text-muted-foreground",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs gap-1 [&>svg]:size-3",
        sm: "px-2 py-0.5 text-[10px] gap-0.5 [&>svg]:size-2.5",
        lg: "px-3 py-1 text-sm gap-1.5 [&>svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

function Badge({
  className,
  variant,
  size,
  asChild = false,
  removable = false,
  onRemove,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-white/50"
          aria-label="Remove"
        >
          <X className="size-3" />
        </button>
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
