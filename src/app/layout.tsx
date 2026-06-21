import type { Metadata, Viewport } from "next";
import { Lexend, Roboto_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationContext";
import { AuthProvider } from "@/components/AuthContext";
import { LocationProvider } from "@/components/LocationContext";
import SmoothScroll from "@/components/SmoothScroll";
import dynamic from "next/dynamic";
const CookieConsent = dynamic(() => import("@/components/CookieConsent"));

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
  metadataBase: new URL('https://baharmilo.com'),
  title: "MILO | Your City's Social Radar",
  description: "Discover exclusive events, secret parties, and connect with friends in real-time. The ultimate Gen-Z social radar app.",
  openGraph: {
    title: "MILO | Your City's Social Radar",
    description: "Discover exclusive events, secret parties, and connect with friends in real-time.",
    url: 'https://baharmilo.com',
    siteName: 'MILO',
    images: [
      {
        url: '/images/og-image.jpg', // referencing local/relative path now supported by metadataBase
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
    images: ['/images/og-image.jpg'],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: '#000000',
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
            <LocationProvider>
              <SmoothScroll>
                {children}
                <CookieConsent />
              </SmoothScroll>
            </LocationProvider>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
