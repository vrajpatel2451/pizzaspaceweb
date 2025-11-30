import type { NextConfig } from "next";

// Get image domain from environment variable (strip protocol for hostname)
const imageDomain =
  process.env.NEXT_PUBLIC_IMAGE_HOST || "api.pizzaspace.co.uk";
const imageHostname = imageDomain.replace(/^https?:\/\//, "");

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
