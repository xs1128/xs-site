import type { Metadata } from "next";
import "@fontsource/roboto-mono/400.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource/hubot-sans/400.css";
import "./globals.css";
import "../styles/animations.css";
import "../styles/marquee.css";
import "../styles/navigation.css";
import "../styles/about.css";
import "../styles/contact.css";
import "../styles/landing.css";

export const metadata: Metadata = {
  title: "Site",
  description: "Generated with create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
