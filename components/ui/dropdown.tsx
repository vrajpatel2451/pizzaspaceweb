"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  destructive?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  sideOffset?: number;
  className?: string;
}

const DropdownItem = React.forwardRef<HTMLButtonElement, DropdownItemProps>(
  (
    { children, onClick, disabled, destructive, startIcon, endIcon, className },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors outline-none",
          "rounded-md cursor-pointer",
          "focus:bg-accent focus:text-accent-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          disabled && "pointer-events-none opacity-50 cursor-not-allowed",
          destructive &&
            "text-destructive focus:bg-destructive/10 hover:bg-destructive/10",
          className
        )}
      >
        {startIcon && (
          <span className="[&_svg]:size-4 shrink-0">{startIcon}</span>
        )}
        <span className="flex-1 text-left">{children}</span>
        {endIcon && <span className="[&_svg]:size-4 shrink-0">{endIcon}</span>}
      </button>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

const DropdownSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));

DropdownSeparator.displayName = "DropdownSeparator";

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  isOpen: controlledIsOpen,
  onOpenChange,
  align = "start",
  side = "bottom",
  sideOffset = 4,
  className,
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggle = () => {
    const newValue = !isOpen;
    if (onOpenChange) {
      onOpenChange(newValue);
    } else {
      setUncontrolledIsOpen(newValue);
    }
  };

  const handleClose = React.useCallback(() => {
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setUncontrolledIsOpen(false);
    }
  }, [onOpenChange]);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, handleClose]);

  // Close on ESC key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, handleClose]);

  // Calculate position
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      let top = 0;
      let left = 0;

      // Calculate vertical position based on side
      if (side === "bottom") {
        top = triggerRect.bottom + sideOffset;
      } else if (side === "top") {
        top = triggerRect.top - contentRect.height - sideOffset;
      } else if (side === "left" || side === "right") {
        // Center vertically for left/right sides
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2;
      }

      // Calculate horizontal position based on side and align
      if (side === "left") {
        left = triggerRect.left - contentRect.width - sideOffset;
      } else if (side === "right") {
        left = triggerRect.right + sideOffset;
      } else {
        // top or bottom
        if (align === "start") {
          left = triggerRect.left;
        } else if (align === "end") {
          left = triggerRect.right - contentRect.width;
        } else {
          // center
          left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2;
        }
      }

      // Ensure dropdown stays within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      if (left + contentRect.width > viewportWidth) {
        left = viewportWidth - contentRect.width - 8;
      }
      if (left < 8) {
        left = 8;
      }
      if (top + contentRect.height > viewportHeight) {
        top = viewportHeight - contentRect.height - 8;
      }
      if (top < 8) {
        top = 8;
      }

      setPosition({ top, left });
    }
  }, [isOpen, side, align, sideOffset]);

  if (!isMounted) {
    return null;
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <div ref={triggerRef} onClick={handleToggle}>
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={contentRef}
          className={cn(
            "fixed z-50 min-w-[12rem] overflow-hidden rounded-lg border bg-popover p-1 text-popover-foreground shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            side === "bottom" && "slide-in-from-top-2",
            side === "top" && "slide-in-from-bottom-2",
            side === "left" && "slide-in-from-right-2",
            side === "right" && "slide-in-from-left-2",
            className
          )}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
          }}
          onClick={(e) => {
            // Close dropdown when clicking on items
            const target = e.target as HTMLElement;
            if (target.closest("button")) {
              handleClose();
            }
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

Dropdown.displayName = "Dropdown";

export { Dropdown, DropdownItem, DropdownSeparator };
