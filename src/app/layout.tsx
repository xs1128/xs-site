import type { Metadata, Viewport } from "next";
import "@fontsource/hubot-sans/400.css";
import "@fontsource/hubot-sans/700.css";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/roboto-mono/700.css";
import "./globals.css";
import "@/styles/blog.css";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Blog",
  description: "Personal blog for downtime & inspiration",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      </body>
    </html>
  );
}
