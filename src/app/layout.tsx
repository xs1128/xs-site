import type { Metadata } from "next";
import "@fontsource/hubot-sans/400.css";
import "@fontsource/hubot-sans/700.css";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
