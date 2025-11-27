"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
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

export interface AsyncSearchSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AsyncSearchSelectProps {
  loadOptions: (query: string) => Promise<AsyncSearchSelectOption[]>;
  value?: string;
  onChange?: (value: string, option?: AsyncSearchSelectOption) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  minChars?: number;
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const AsyncSearchSelect = React.forwardRef<
  HTMLButtonElement,
  AsyncSearchSelectProps
>(
  (
    {
      loadOptions,
      value,
      onChange,
      placeholder = "Select an option",
      searchPlaceholder = "Type to search...",
      emptyMessage = "No results found.",
      loadingMessage = "Loading...",
      minChars = 2,
      debounceMs = 300,
      disabled = false,
      className,
      label,
      error,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState<AsyncSearchSelectOption[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [selectedOption, setSelectedOption] =
      React.useState<AsyncSearchSelectOption | null>(null);
    const debounceRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleSearch = React.useCallback(
      async (searchQuery: string) => {
        setQuery(searchQuery);

        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        if (searchQuery.length < minChars) {
          setOptions([]);
          return;
        }

        debounceRef.current = setTimeout(async () => {
          setLoading(true);
          try {
            const results = await loadOptions(searchQuery);
            setOptions(results);
          } catch {
            setOptions([]);
          } finally {
            setLoading(false);
          }
        }, debounceMs);
      },
      [loadOptions, minChars, debounceMs]
    );

    React.useEffect(() => {
      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
      };
    }, []);

    const displayValue = selectedOption?.label || (value ? value : null);

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
              aria-controls="async-search-listbox"
              disabled={disabled}
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-lg border bg-background px-4 py-2 text-sm",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "cursor-pointer",
                error
                  ? "border-destructive focus:ring-destructive/20 focus:border-destructive"
                  : "border-input",
                className
              )}
            >
              <span
                className={cn(
                  displayValue ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {displayValue || placeholder}
              </span>
              <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-10"
                onValueChange={handleSearch}
              />
              <CommandList>
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="size-5 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-sm text-muted-foreground">
                      {loadingMessage}
                    </span>
                  </div>
                ) : query.length < minChars ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Type at least {minChars} characters to search
                  </div>
                ) : options.length === 0 ? (
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                ) : (
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        onSelect={() => {
                          setSelectedOption(option);
                          onChange?.(option.value, option);
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
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

AsyncSearchSelect.displayName = "AsyncSearchSelect";

export { AsyncSearchSelect };
