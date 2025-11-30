// "use client";

import Image, { ImageProps } from "next/image";

const IMAGE_DOMAIN =
  process.env.NEXT_PUBLIC_IMAGE_DOMAIN || "https://api.pizzaspace.co.uk";

interface CustomImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

/**
 * Custom Image component for backend URLs.
 * Automatically prepends the image domain to relative paths (e.g., /uploads/image.jpg)
 * while passing through full URLs unchanged.
 *
 * Uses unoptimized for remote images to bypass Next.js image optimization
 * which blocks images from private IPs (NAT64 addresses).
 */
export function CustomImage({ src, alt, ...props }: CustomImageProps) {
  const imageSrc = src.startsWith("uploads") ? `${IMAGE_DOMAIN}/${src}` : src;

  return <Image src={imageSrc} alt={alt} {...props} />;
}
