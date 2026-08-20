import type { Metadata, Viewport } from "next";
import { Rajdhani } from "next/font/google";
import { CartProvider } from "@/lib/cart/CartContext";
import { AppDataProvider } from "@/lib/store/AppDataContext";
import { JsonLd } from "@/components/seo/JsonLd";
import { BRAND, getSiteUrl } from "@/lib/brand";
import {
  createPageMetadata,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  variable: "--font-rajdhani",
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: BRAND.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  ...createPageMetadata({
    description: `${BRAND.intro} Lunettes de vue, essayage virtuel, configuration de verres et magasins. ${BRAND.phoneDisplay} · ${BRAND.email}`,
  }),
  title: {
    default: `${BRAND.name} — ${BRAND.intro}`,
    template: `%s | ${BRAND.name}`,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${rajdhani.variable} ${rajdhani.className} h-full`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-on-surface antialiased">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <CartProvider>
          <AppDataProvider>{children}</AppDataProvider>
        </CartProvider>
      </body>
    </html>
  );
}
