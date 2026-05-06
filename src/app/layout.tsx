import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "@/components/ui/sonner";

// Uppy Styles
import "@uppy/core/css/style.min.css";
import "@uppy/dashboard/css/style.min.css";
import "@uppy/image-editor/css/style.min.css";
import "@uppy/status-bar/css/style.min.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resolve Home - Professional Home Services",
  description: "Book professional engineers for your home services with Resolve Home.",
  icons: {
    icon: "/favicon.svg",
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
      className={`${inter.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
