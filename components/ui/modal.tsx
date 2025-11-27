"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";
import { IconButton } from "./icon-button";

export interface ModalAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonProps["variant"];
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  size?: ButtonProps["size"];
}

export interface ModalActions {
  primary?: ModalAction;
  secondary?: ModalAction;
  tertiary?: ModalAction;
  prefix?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  actions?: ModalActions;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
}

const sizeMap = {
  sm: "w-[95%] max-w-sm",
  md: "w-[95%] max-w-2xl",
  lg: "w-[95%] max-w-4xl",
  xl: "w-[95%] max-w-7xl",
  full: "w-[98%] h-[95vh]",
};

const paddingClass = "px-5 py-4";

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  actions,
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
      const timeout = setTimeout(() => setShouldRenderContent(false), 200);
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

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-200",
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          "m-auto flex max-h-[90vh] flex-col rounded-xl border bg-card shadow-lg dark:border-border",
          sizeMap[size]
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
                      id="modal-title"
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
                    aria-label="Close modal"
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
                    loading={actions.tertiary.loading}
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
                    loading={actions.secondary.loading}
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
                    loading={actions.primary.loading}
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
    return createPortal(modalContent, document.body);
  }

  return null;
};

Modal.displayName = "Modal";

export { Modal };
