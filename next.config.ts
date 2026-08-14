import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/blog',
  async redirects() {
    if (process.env.NODE_ENV !== 'development') return []
    return [{ source: '/', destination: '/blog', basePath: false, permanent: false }]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-host', value: 'blog.xsooi.com' }],
        headers: [{ key: 'x-host-probe', value: 'direct' }],
      },
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'x-forwarded-host', value: 'www.xsooi.com' }],
        headers: [{ key: 'x-host-probe', value: 'proxied' }],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fopmnlxsudpgsdpaqrzd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
