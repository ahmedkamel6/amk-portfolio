import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow local network IPs to access Next.js HMR
  // Add any other IPs here if your phone/device IP changes
  // @ts-ignore - Ignore TS error in case NextConfig type isn't fully updated
  allowedDevOrigins: ['192.168.100.3', 'localhost'],

  // ─── Image Optimization ───
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },

  // ─── Bundle Optimization ───
  reactCompiler: true,
  experimental: {
    cssChunking: 'strict',
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@react-three/drei',
      '@react-three/fiber',
      'three',
      'recharts',
      'date-fns',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-select',
      '@radix-ui/react-popover',
    ],
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(nextConfig);
