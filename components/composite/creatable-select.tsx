"use client";

import * as React from "react";
import { Check, ChevronDown, Plus, Loader2 } from "lucide-react";
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
  CommandSeparator,
} from "@/components/ui/command";

export interface CreatableSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CreatableSelectProps {
  options: CreatableSelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onCreate?: (value: string) => Promise<CreatableSelectOption>;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  createLabel?: (input: string) => string;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
}

const CreatableSelect = React.forwardRef<
  HTMLButtonElement,
  CreatableSelectProps
>(
  (
    {
      options,
      value,
      onChange,
      onCreate,
      placeholder = "Select an option",
      searchPlaceholder = "Search or create...",
      emptyMessage = "No results found.",
      createLabel = (input) => `Create "${input}"`,
      disabled = false,
      className,
      label,
      error,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [creating, setCreating] = React.useState(false);
    const [localOptions, setLocalOptions] =
      React.useState<CreatableSelectOption[]>(options);

    React.useEffect(() => {
      setLocalOptions(options);
    }, [options]);

    const selectedOption = localOptions.find((option) => option.value === value);

    const filteredOptions = query
      ? localOptions.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        )
      : localOptions;

    const showCreateOption =
      query.length > 0 &&
      !localOptions.some(
        (option) => option.label.toLowerCase() === query.toLowerCase()
      );

    const handleCreate = async () => {
      if (!onCreate || !query.trim()) return;

      setCreating(true);
      try {
        const newOption = await onCreate(query.trim());
        setLocalOptions((prev) => [...prev, newOption]);
        onChange?.(newOption.value);
        setQuery("");
        setOpen(false);
      } catch (err) {
        console.error("Failed to create option:", err);
      } finally {
        setCreating(false);
      }
    };

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
          <PopoverContent
            className="w-[var(--radix-popover-trigger-width)] p-0"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder={searchPlaceholder}
                className="h-10"
                value={query}
                onValueChange={setQuery}
              />
              <CommandList>
                {filteredOptions.length === 0 && !showCreateOption && (
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                )}
                {filteredOptions.length > 0 && (
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        disabled={option.disabled}
                        onSelect={() => {
                          onChange?.(option.value);
                          setQuery("");
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
                {showCreateOption && onCreate && (
                  <>
                    {filteredOptions.length > 0 && <CommandSeparator />}
                    <CommandGroup>
                      <CommandItem
                        onSelect={handleCreate}
                        disabled={creating}
                        className="cursor-pointer text-primary"
                      >
                        {creating ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          <Plus className="mr-2 size-4" />
                        )}
                        {createLabel(query)}
                      </CommandItem>
                    </CommandGroup>
                  </>
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

CreatableSelect.displayName = "CreatableSelect";

export { CreatableSelect };
