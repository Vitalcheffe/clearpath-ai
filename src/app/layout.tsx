import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ClearPath AI — Community Resource Navigator",
  description: "Verified community resources with calibrated transparency. Classified, not generated. Every result shows confidence, reasoning, and alternatives.",
  keywords: ["ClearPath AI", "community resources", "211", "social services", "crisis support", "calibrated transparency", "zero-shot classification"],
  authors: [{ name: "ClearPath AI Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ClearPath AI — Community Resource Navigator",
    description: "Verified community resources with calibrated transparency. Classified, not generated.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearPath AI — Community Resource Navigator",
    description: "Verified community resources with calibrated transparency.",
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
        className={`${inter.variable} antialiased bg-background text-foreground`}
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
