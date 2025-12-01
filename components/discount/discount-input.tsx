"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscountInputProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  error?: string;
  placeholder?: string;
  className?: string;
}

export function DiscountInput({
  value,
  onChange,
  onApply,
  isLoading = false,
  isDisabled = false,
  error,
  placeholder = "Enter coupon code",
  className,
}: DiscountInputProps) {
  const handleClear = () => {
    onChange("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() && !isLoading && !isDisabled) {
      e.preventDefault();
      onApply();
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isDisabled}
            className={cn(
              "pl-10 pr-10 uppercase font-mono",
              error && "border-destructive focus-visible:ring-destructive/20"
            )}
            aria-label="Coupon code"
            aria-invalid={!!error}
            aria-describedby={error ? "coupon-error" : undefined}
          />
          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear coupon code"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          onClick={onApply}
          disabled={!value.trim() || isLoading || isDisabled}
          loading={isLoading}
          size="default"
          className="shrink-0"
        >
          Apply
        </Button>
      </div>

      {error && (
        <p
          id="coupon-error"
          className="text-sm text-destructive flex items-center gap-1"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
