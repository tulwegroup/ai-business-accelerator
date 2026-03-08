import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Creator Business Accelerator - Your AI-Powered Business Partner",
  description: "Build AI-powered digital products, master prompt engineering, and grow your online business with your personal AI mentor. From AI beginner to AI-powered entrepreneur in 12 weeks.",
  keywords: ["AI", "digital products", "entrepreneurship", "prompt engineering", "content creation", "Facebook growth", "AI mentor"],
  authors: [{ name: "AI Creator Accelerator" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "AI Creator Business Accelerator",
    description: "Your AI-powered business partner for digital entrepreneurship",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
