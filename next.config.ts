import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['date-fns', 'jotai', '@tanstack/react-query'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

export default nextConfig;
