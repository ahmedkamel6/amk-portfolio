import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow local network IPs to access Next.js HMR
  // Add any other IPs here if your phone/device IP changes
  // @ts-ignore - Ignore TS error in case NextConfig type isn't fully updated
  allowedDevOrigins: ['192.168.100.3', 'localhost'],
};

export default nextConfig;
