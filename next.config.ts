import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    globalNotFound: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
  },
  // Configure compiler to target modern browsers and reduce polyfills
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Add Turbopack-specific configurations here if needed
  },
};

export default nextConfig;
