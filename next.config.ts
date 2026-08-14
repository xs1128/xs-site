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
  async headers() {
    return [
      {
        source: '/.well-known/discord',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default nextConfig;
