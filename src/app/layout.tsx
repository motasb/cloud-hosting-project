import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Kufi_Arabic } from "next/font/google";
import { ToastContainer } from 'react-toastify';
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const NotoKufiArabic = Noto_Kufi_Arabic({
  variable: "--font-kufi",
  weight: ['300','500'],
  subsets: ["arabic"]
}) 

export const metadata: Metadata = {
  title: "Cloud Hosting",
  description: "Cloud Hosting Project",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${NotoKufiArabic.variable} antialiased`}
      >
        <Header />
        <ToastContainer theme="colored" position="top-center"/>
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
