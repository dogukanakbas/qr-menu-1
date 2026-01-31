import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthSessionProvider } from "@/components/providers/session-provider";
import { ToastProvider } from "@/components/providers/toast-provider";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const restaurantName = process.env.RESTAURANT_NAME ?? "Mihrali Cafe";

export const metadata: Metadata = {
  title: `${restaurantName} QR Menü`,
  description:
    "Mihrali Cafe için kategori, ürün ve masa yönetimini kolaylaştıran QR menü sistemi.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <AuthSessionProvider>
          {children}
          <ToastProvider />
        </AuthSessionProvider>
      </body>
    </html>
  );
}
