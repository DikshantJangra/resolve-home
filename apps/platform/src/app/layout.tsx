// Uppy Styles
import "@uppy/core/css/style.css";
import "@uppy/dashboard/css/style.css";
import "@uppy/image-editor/css/style.css";
import "@uppy/status-bar/css/style.css";

import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@resolve/ui";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ResolvHome - Professional Home Services",
  description: "Book professional engineers for your home services with ResolvHome.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { SocketProvider } from "@/components/providers/socket-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <QueryProvider>
          <SmoothScroll>
            <SocketProvider>
              {children}
            </SocketProvider>
            <Toaster />
          </SmoothScroll>
        </QueryProvider>
      </body>
    </html>
  );
}
