import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { siteConfig } from "@/lib/seo";
import "@fontsource/hubot-sans/400.css";
import "@fontsource/hubot-sans/700.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";
import "./globals.css";
import "@/styles/blog.css";
import Footer from "@/components/ui/Footer";

// Unset means no script, so dev and previews stay out of the stats.
const goatCounterCode = process.env.NEXT_PUBLIC_GOATCOUNTER_CODE;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  manifest: "/blog/site.webmanifest",
  icons: {
    icon: [
      { url: "/blog/favicon.ico", sizes: "any" },
      { url: "/blog/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/blog/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/blog/apple-touch-icon.png", sizes: "180x180" }],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F2E9D8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
        <Footer />
        {goatCounterCode && (
          <Script
            src="https://gc.zgo.at/count.js"
            strategy="afterInteractive"
            data-goatcounter={`https://${goatCounterCode}.goatcounter.com/count`}
          />
        )}
      </body>
    </html>
  );
}
