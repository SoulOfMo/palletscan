import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "PalletScan — Warehouse Barcode System",
  description: "Mobile-first warehouse pallet barcode management system",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface text-gray-200 font-mono antialiased">
        {children}
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            style: {
              background: "#0d0d18",
              border: "1px solid #1a1a2e",
              color: "#e0e0e0",
              fontFamily: "'DM Mono', monospace",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
