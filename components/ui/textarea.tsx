"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "flex w-full rounded-lg border bg-background text-foreground transition-all duration-200 placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 outline-none resize-none",
  {
    variants: {
      variant: {
        default:
          "border-input focus:border-primary focus:ring-2 focus:ring-primary/20",
        error:
          "border-destructive focus:border-destructive focus:ring-2 focus:ring-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: string;
  label?: string;
  helperText?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      variant,
      error,
      label,
      helperText,
      maxLength,
      showCharCount = false,
      value,
      defaultValue,
      onChange,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;

    const [charCount, setCharCount] = React.useState(
      String(value || defaultValue || "").length
    );

    const computedVariant = error ? "error" : variant;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          data-slot="textarea"
          className={cn(
            textareaVariants({ variant: computedVariant }),
            "min-h-[100px] px-4 py-3 text-sm",
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          {...props}
        />
        <div className="flex items-center justify-between">
          <div>
            {error && (
              <p id={errorId} className="text-xs text-destructive">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-xs text-muted-foreground">
                {helperText}
              </p>
            )}
          </div>
          {showCharCount && (
            <p
              className={cn(
                "text-xs",
                maxLength && charCount >= maxLength
                  ? "text-destructive"
                  : "text-muted-foreground"
              )}
            >
              {charCount}
              {maxLength && `/${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export { TextArea, textareaVariants };
