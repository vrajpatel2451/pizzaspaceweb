import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border font-medium whitespace-nowrap shrink-0 cursor-pointer [&>svg]:pointer-events-none transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm",
        success:
          "border-transparent bg-green-500 text-white shadow-sm",
        warning:
          "border-transparent bg-amber-500 text-white shadow-sm",
        info:
          "border-transparent bg-blue-500 text-white",
        outline:
          "text-foreground border-border",
        "outline-primary":
          "border-primary bg-transparent text-primary",
        muted:
          "border-transparent bg-muted text-muted-foreground",
        // Food-specific variants
        new:
          "border-transparent bg-emerald-500 text-white shadow-sm",
        popular:
          "border-transparent bg-primary text-primary-foreground shadow-sm",
        spicy:
          "border-transparent bg-red-500 text-white shadow-sm",
        veg:
          "border-green-600 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        nonveg:
          "border-red-600 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
        offer:
          "border-transparent bg-amber-400 text-amber-900 shadow-sm",
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
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 focus:outline-none focus:ring-1 focus:ring-white/50 cursor-pointer"
          aria-label="Remove"
        >
          <X className="size-3" />
        </button>
      )}
    </Comp>
  );
}

export { Badge, badgeVariants };
