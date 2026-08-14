import type { Metadata } from 'next';
import Script from 'next/script';
import { robotoMono, hubotSans } from '@/fonts';
import './globals.css';
import '../styles/animations.css';
import '../styles/navigation.css';
import '../styles/about.css';
import '../styles/contact.css';
import '../styles/landing.css';
import '../styles/tooltip.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.xsooi.com';

const canonicalUrl =
  process.env.NODE_ENV === 'production' ? siteUrl : 'http://localhost:3000';

// Cloudflare Web Analytics. Unset means no beacon, so dev and previews stay out of the stats.
const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export const metadata: Metadata = {
  title: {
    default: 'Xinsheng Ooi | DevOps Engineer',
    template: '%s | Xinsheng Ooi',
  },
  description:
    'DevOps engineer specializing in automation, scripting, and infrastructure management. Expert in Python, Bash, Docker, and Cloudflare for building robust deployment pipelines and automated solutions.',
  keywords: [
    'DevOps engineer',
    'automation specialist',
    'Docker',
    'Python scripting',
    'Bash automation',
    'server infrastructure',
    'deployment pipelines',
    'Cloudflare DNS',
    'Linux system administration',
  ],
  authors: [{ name: 'Xinsheng Ooi', url: siteUrl }],
  creator: 'Xinsheng Ooi',
  publisher: 'Xinsheng Ooi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: 'Xinsheng Ooi | DevOps Engineer',
    description:
      'DevOps engineer specializing in automation, scripting, and infrastructure management. Expert in Python, Bash, Docker, and Cloudflare.',
    url: siteUrl,
    siteName: 'Xinsheng Ooi - DevOps Engineer',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Xinsheng Ooi - DevOps Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Xinsheng Ooi | DevOps Engineer',
    description:
      'DevOps engineer specializing in automation, scripting, and infrastructure management.',
    creator: '@xs1128',
    images: [`${siteUrl}/og-image.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Xinsheng Ooi',
    url: siteUrl,
    image: `${siteUrl}/og-image.png`,
    sameAs: [
      'https://github.com/xs1128',
      'https://www.linkedin.com/in/xinsheng-ooi-6738083b4',
      'https://www.instagram.com/xs_ooi1128',
      'https://www.facebook.com/ooi.xinsheng/',
    ],
    jobTitle: 'DevOps Engineer',
    description:
      'DevOps engineer specializing in automation, scripting, and infrastructure management',
    knowsAbout: [
      'DevOps',
      'Automation',
      'Docker',
      'Python',
      'Bash scripting',
      'Linux system administration',
      'Cloudflare DNS',
      'Server infrastructure',
      'Deployment pipelines',
      'Container orchestration',
    ],
    email: 'hi@xsooi.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MY',
    },
  };

  return (
    <html lang="en" className={`${robotoMono.variable} ${hubotSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        {cfBeaconToken && (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
          />
        )}
      </body>
    </html>
  );
}
