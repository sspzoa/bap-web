import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  env: {
    TZ: 'Asia/Seoul',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
