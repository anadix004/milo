import type { Metadata, Viewport } from "next";
import { Lexend, Roboto_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationContext";
import { AuthProvider } from "@/components/AuthContext";
import SmoothScroll from "@/components/SmoothScroll";
import CookieConsent from "@/components/CookieConsent";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "MILO | Your City's Social Radar",
  description: "Discover exclusive events, secret parties, and connect with friends in real-time. The ultimate Gen-Z social radar app.",
  openGraph: {
    title: "MILO | Your City's Social Radar",
    description: "Discover exclusive events, secret parties, and connect with friends in real-time.",
    url: 'https://milo-web-page.vercel.app',
    siteName: 'MILO',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'MILO Social Radar',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "MILO | Your City's Social Radar",
    description: "Discover exclusive events and secret parties in real-time.",
    images: ['https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&h=630&fit=crop'],
  },
  themeColor: '#000000',
  manifest: '/manifest.ts',
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${lexend.variable} ${plusJakarta.variable} ${robotoMono.variable} antialiased bg-black text-white selection:bg-white selection:text-black overflow-x-hidden`}
      >
        <NotificationProvider>
          <AuthProvider>
            <SmoothScroll>
              {children}
              <CookieConsent />
            </SmoothScroll>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
