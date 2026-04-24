import type { NextConfig } from 'next';

const config: NextConfig = {
  outputFileTracingRoot: '/Users/joshphone/Desktop/AutoDriva',
  images: {
    remotePatterns: [{ hostname: 'images.unsplash.com' }],
  },
};

export default config;
