import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [{ hostname: 'images.unsplash.com' }],
  },
};

export default config;
