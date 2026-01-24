import type { NextConfig } from "next";

// Get image domain from environment variable (strip protocol for hostname)
const imageDomain =
  process.env.NEXT_PUBLIC_IMAGE_HOST || "api.pizzaspace.co.uk";
const imageHostname = imageDomain.replace(/^https?:\/\//, "");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"], // Enable modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller sizes
    minimumCacheTTL: 60, // Cache images for 60 seconds
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: imageHostname,
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/*"], // Tree-shake icon libraries
  },
};

export default nextConfig;
