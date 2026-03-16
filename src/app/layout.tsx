import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const META_TITLE = "Jai Vardhan Sharma | Strategy, Transformation & Ventures";
const META_DESC =
  "Strategy consultant, transformation leader, and venture builder exploring ideas across businesses, technology, and brands.";
const META_URL = "https://www.jaivardhansharma.com";

export const metadata: Metadata = {
  title: META_TITLE,
  description: META_DESC,
  metadataBase: new URL(META_URL),
  openGraph: {
    type: "website",
    url: META_URL,
    title: META_TITLE,
    description: META_DESC,
    siteName: "Jai Vardhan Sharma",
  },
  twitter: {
    card: "summary_large_image",
    title: META_TITLE,
    description: META_DESC,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

