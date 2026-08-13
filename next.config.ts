import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: '/blog', destination: 'https://blog.xsooi.com/blog' },
      {
        source: '/blog/:path*',
        destination: 'https://blog.xsooi.com/blog/:path*',
      },
    ];
  },
};

export default nextConfig;
