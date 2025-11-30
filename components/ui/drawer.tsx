"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import type { VariantProps } from "class-variance-authority";
import { buttonVariants } from "./button";

export interface DrawerAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
}

export interface DrawerActions {
  primary?: DrawerAction;
  secondary?: DrawerAction;
  tertiary?: DrawerAction;
  prefix?: React.ReactNode;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  actions?: DrawerActions;
  side?: "left" | "right" | "top" | "bottom";
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeMap = {
  left: {
    sm: "w-80",
    md: "w-96",
    lg: "w-[32rem]",
    xl: "w-[48rem]",
    full: "w-[95vw]",
  },
  right: {
    sm: "w-80",
    md: "w-96",
    lg: "w-[32rem]",
    xl: "w-[48rem]",
    full: "w-[95vw]",
  },
  top: {
    sm: "h-80",
    md: "h-96",
    lg: "h-[32rem]",
    xl: "h-[48rem]",
    full: "h-[95vh]",
  },
  bottom: {
    sm: "h-80",
    md: "h-96",
    lg: "h-[32rem]",
    xl: "h-[48rem]",
    full: "h-[95vh]",
  },
};

const positionMap = {
  left: "left-0 top-0 h-full",
  right: "right-0 top-0 h-full",
  top: "top-0 left-0 w-full",
  bottom: "bottom-0 left-0 w-full",
};

const transformMap = {
  left: {
    open: "translate-x-0",
    closed: "-translate-x-full",
  },
  right: {
    open: "translate-x-0",
    closed: "translate-x-full",
  },
  top: {
    open: "translate-y-0",
    closed: "-translate-y-full",
  },
  bottom: {
    open: "translate-y-0",
    closed: "translate-y-full",
  },
};

const paddingClass = "px-5 py-4";

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
  side = "right",
  size = "md",
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  const [shouldRenderContent, setShouldRenderContent] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      if (document) {
        document.body.style.overflow = "";
      }
      const timeout = setTimeout(() => setShouldRenderContent(false), 300);
      return () => clearTimeout(timeout);
    }

    return () => {
      if (document) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  // ESC key to close
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  const drawerContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="drawer-title"
    >
      <div
        className={cn(
          "fixed flex flex-col bg-card shadow-lg dark:border-border transition-transform duration-300 ease-in-out",
          positionMap[side],
          sizeMap[side][size],
          isOpen ? transformMap[side].open : transformMap[side].closed,
          (side === "left" || side === "right") && "max-h-screen",
          (side === "top" || side === "bottom") && "max-w-screen"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {shouldRenderContent && (
          <>
            {/* Header */}
            {(title || subtitle || showCloseButton) && (
              <div
                className={cn(
                  "flex shrink-0 items-center justify-between border-b",
                  paddingClass
                )}
              >
                <div className="flex flex-col">
                  {title && (
                    <h2
                      id="drawer-title"
                      className="text-lg font-semibold text-foreground"
                    >
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subtitle}
                    </p>
                  )}
                </div>
                {showCloseButton && (
                  <IconButton
                    aria-label="Close drawer"
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                  >
                    <X className="size-4" />
                  </IconButton>
                )}
              </div>
            )}

            {/* Body */}
            <div className={cn("flex-1 overflow-hidden", paddingClass)}>
              <div className="h-full overflow-y-auto">{children}</div>
            </div>

            {/* Footer */}
            {actions && (
              <div
                className={cn(
                  "flex shrink-0 items-center justify-end gap-2 border-t",
                  paddingClass
                )}
              >
                {actions?.prefix && actions.prefix}
                {actions?.tertiary && (
                  <Button
                    disabled={actions.tertiary.disabled}
                    onClick={actions.tertiary.onClick}
                    size={actions.tertiary.size}
                    variant={actions.tertiary.variant || "ghost"}
                    className={actions.tertiary.className}
                  >
                    {actions.tertiary.startIcon}
                    {actions.tertiary.label}
                    {actions.tertiary.endIcon}
                  </Button>
                )}
                {actions?.secondary && (
                  <Button
                    disabled={actions.secondary.disabled}
                    onClick={actions.secondary.onClick}
                    size={actions.secondary.size}
                    variant={actions.secondary.variant || "outline"}
                    className={actions.secondary.className}
                  >
                    {actions.secondary.startIcon}
                    {actions.secondary.label}
                    {actions.secondary.endIcon}
                  </Button>
                )}
                {actions?.primary && (
                  <Button
                    disabled={actions.primary.disabled}
                    onClick={actions.primary.onClick}
                    size={actions.primary.size}
                    variant={actions.primary.variant || "default"}
                    className={actions.primary.className}
                  >
                    {actions.primary.startIcon}
                    {actions.primary.label}
                    {actions.primary.endIcon}
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (!isMounted) {
    return null;
  }

  if (typeof document !== "undefined") {
    return createPortal(drawerContent, document.body);
  }

  return null;
};

Drawer.displayName = "Drawer";

export { Drawer };
