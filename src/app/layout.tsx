import type { Metadata, Viewport } from "next";
import { Lexend, Roboto_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationContext";
import { AuthProvider } from "@/components/AuthContext";
import SmoothScroll from "@/components/SmoothScroll";

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
  title: "Milo | Cinematic Event Radar",
  description: "High-end, immersive city event discovery.",
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
            </SmoothScroll>
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
