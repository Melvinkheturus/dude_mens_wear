import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import localFont from "next/font/local";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthProvider } from "@/contexts/AuthContext";
import { DemoCartProvider } from "@/contexts/DemoCartContext";
import { ToastProvider } from "@/contexts/ToastContext";
import "@/styles/globals.css";
import Footer from "@/components/layout/Footer";
import ConditionalNavbar from "@/components/layout/ConditionalNavbar";
import PageTransition from "@/components/PageTransition";

const satoshi = localFont({
  src: [
    {
      path: "../../public/fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  display: "swap",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: "Dude Menswear - Premium Streetwear & Fashion for Men",
    template: "%s | Dude Menswear"
  },
  description: "Discover premium streetwear and fashion for men at Dude Menswear. Shop the latest trends in shirts, t-shirts, jeans, and accessories. Free shipping on orders over ₹999.",
  keywords: ["menswear", "streetwear", "men's fashion", "premium clothing", "men's shirts", "men's t-shirts", "men's jeans", "fashion", "style", "clothing"],
  authors: [{ name: "Dude Menswear" }],
  creator: "Dude Menswear",
  publisher: "Dude Menswear",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Dude Menswear",
    title: "Dude Menswear - Premium Streetwear & Fashion for Men",
    description: "Discover premium streetwear and fashion for men. Shop the latest trends with free shipping on orders over ₹999.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Dude Menswear - Premium Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dude Menswear - Premium Streetwear & Fashion for Men",
    description: "Discover premium streetwear and fashion for men. Shop the latest trends.",
    images: ["/og-image.jpg"],
    creator: "@dudemenswear",
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
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <AuthProvider>
        <DemoCartProvider>
          <ToastProvider>
            <html lang="en">
              <body
                className={`${satoshi.variable} ${manrope.variable} antialiased flex flex-col min-h-screen`}
              >
                <ConditionalNavbar />
                <main className="flex-1 pt-[52px] lg:pt-[60px] [.pdp-page_&]:pt-0 [.pdp-page_&]:lg:pt-[60px]">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
              </body>
            </html>
          </ToastProvider>
        </DemoCartProvider>
      </AuthProvider>
    </ClerkProvider>
  );
}
