"use client";

import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface SearchSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SearchSelectProps {
  options: SearchSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const SearchSelect = React.forwardRef<HTMLButtonElement, SearchSelectProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      searchPlaceholder = "Search...",
      emptyMessage = "No results found.",
      disabled = false,
      className,
      label,
      error,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const selectedOption = options.find((option) => option.value === value);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">{label}</label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              ref={ref}
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              disabled={disabled}
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-lg border bg-background px-4 py-2 text-sm",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                error
                  ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                  : "border-input",
                className
              )}
            >
              <span
                className={cn(
                  selectedOption ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {selectedOption?.label || placeholder}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-10"
              />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => {
                        onChange?.(option.value);
                        setOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 size-4",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

SearchSelect.displayName = "SearchSelect";

export { SearchSelect };
