"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

const IMAGE_DOMAIN =
  process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "https://api.pizzaspace.co.uk";

interface CustomImageProps extends Omit<ImageProps, "src"> {
  src: string;
  fallbackClassName?: string;
}

/**
 * Pizza-themed fallback placeholder SVG
 * Shows when image fails to load
 */
function ImageFallback({
  className,
  alt,
  fill,
  width,
  height,
}: {
  className?: string;
  alt: string;
  fill?: boolean;
  width?: number | `${number}`;
  height?: number | `${number}`;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20",
        // When fill is true, match next/image's fill behavior
        fill && "absolute inset-0 w-full h-full",
        // When not fill but no explicit dimensions, fill container
        !fill && !width && !height && "w-full h-full",
        className
      )}
      style={
        !fill && (width || height)
          ? {
              width: width ? `${width}px` : undefined,
              height: height ? `${height}px` : undefined,
            }
          : undefined
      }
      role="img"
      aria-label={alt || "Image unavailable"}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-1/2 h-1/2 max-w-[80px] max-h-[80px] text-orange-300 dark:text-orange-700"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Pizza slice shape */}
        <path
          d="M50 10 L85 80 Q50 95 15 80 Z"
          fill="currentColor"
          opacity="0.3"
        />
        {/* Crust */}
        <path
          d="M15 80 Q50 95 85 80"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />
        {/* Pepperoni dots */}
        <circle cx="40" cy="50" r="6" fill="currentColor" opacity="0.6" />
        <circle cx="58" cy="45" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="50" cy="65" r="5" fill="currentColor" opacity="0.6" />
        <circle cx="35" cy="70" r="4" fill="currentColor" opacity="0.6" />
        <circle cx="62" cy="68" r="4" fill="currentColor" opacity="0.6" />
        {/* Image icon overlay */}
        <rect
          x="30"
          y="25"
          width="40"
          height="30"
          rx="3"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <circle cx="40" cy="35" r="4" fill="currentColor" opacity="0.4" />
        <path
          d="M30 50 L42 42 L52 48 L60 38 L70 50"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

/**
 * Custom Image component for backend URLs.
 * Automatically prepends the image domain to relative paths (e.g., /uploads/image.jpg)
 * while passing through full URLs unchanged.
 *
 * Features:
 * - Automatic domain prepending for relative paths
 * - Error handling with pizza-themed fallback placeholder
 * - Uses unoptimized for remote images to bypass Next.js image optimization
 *   which blocks images from private IPs (NAT64 addresses).
 */
export function CustomImage({
  src,
  alt,
  className,
  fallbackClassName,
  onError,
  fill,
  width,
  height,
  ...props
}: CustomImageProps) {
  const [hasError, setHasError] = useState(false);

  const imageSrc = src?.startsWith("uploads") ? `${IMAGE_DOMAIN}/${src}` : src;

  // Handle missing or empty src
  if (!src || hasError) {
    return (
      <ImageFallback
        className={cn(className, fallbackClassName)}
        alt={alt || "Image"}
        fill={fill}
        width={width}
        height={height}
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      className={className}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      onError={(e) => {
        setHasError(true);
        onError?.(e);
      }}
      unoptimized={imageSrc.startsWith(IMAGE_DOMAIN)}
      {...props}
    />
  );
}
