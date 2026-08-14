import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/blog',
  async redirects() {
    if (process.env.NODE_ENV !== 'development') return []
    return [{ source: '/', destination: '/blog', basePath: false, permanent: false }]
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
