import type { NextConfig } from 'next';

const isDevelopment = process.env.NODE_ENV === 'development';
const supabaseOrigin = new URL(
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
    'https://fopmnlxsudpgsdpaqrzd.supabase.co',
).origin;
const goatCounterOrigin = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE
  ? `https://${process.env.NEXT_PUBLIC_GOATCOUNTER_CODE}.goatcounter.com`
  : '';

// Static/ISR pages need Next's inline hydration scripts; inline event handlers
// and eval are still blocked in production. A nonce policy would require
// per-request rendering instead of the blog's current static pages.
const contentSecurityPolicy = [
  "default-src 'self'",
  [
    "script-src 'self' 'unsafe-inline'",
    'https://gc.zgo.at',
    'https://va.vercel-scripts.com',
    'https://vitals.vercel-insights.com',
    ...(isDevelopment ? ["'unsafe-eval'"] : []),
  ].join(' '),
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  // Blog authors can embed images hosted outside Supabase.
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src 'self'",
    supabaseOrigin,
    supabaseOrigin.replace(/^https:/, 'wss:'),
    goatCounterOrigin,
    'https://va.vercel-scripts.com',
    'https://vitals.vercel-insights.com',
    ...(isDevelopment ? ['ws:', 'wss:'] : []),
  ]
    .filter(Boolean)
    .join(' '),
  "worker-src 'self' blob:",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(!isDevelopment ? ['upgrade-insecure-requests'] : []),
].join('; ');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fopmnlxsudpgsdpaqrzd.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/.well-known/discord',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }],
      },
    ];
  },
};

export default nextConfig;
