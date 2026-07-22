import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteUrl } from "@/lib/site";
import BottomNav from "@/components/BottomNav";

const inter = localFont({
  src: "./fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGrotesk.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/JetBrainsMono.ttf",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OBIXCONFIG FPV — Tuning intelligence for FPV pilots",
    template: "%s — OBIXCONFIG FPV",
  },
  description:
    "OBIXCONFIG FPV is a tuning and build console for FPV pilots — PID guidance, blackbox reading, build matching, and flight readiness in one product-grade toolkit.",
  keywords: [
    "FPV",
    "Betaflight",
    "PID tuning",
    "blackbox analyzer",
    "drone build",
    "FPV rates",
    "OBIXCONFIG",
  ],
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "OBIXCONFIG FPV — Tuning intelligence for FPV pilots",
    description:
      "A tuning and build console for FPV pilots: PID guidance, blackbox reading, build matching, and flight readiness.",
    url: siteUrl,
    siteName: "OBIXCONFIG FPV",
    images: ["/og-preview.svg"],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OBIXCONFIG FPV",
    description: "Tuning intelligence for FPV pilots.",
    images: ["/og-preview.svg"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "OBIXCONFIG FPV",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
