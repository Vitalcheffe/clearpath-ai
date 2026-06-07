import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clearpath-ai.vercel.app"),
  title: "ClearPath AI — Community Resource Navigator",
  description: "Verified community resources with honest confidence. Classified, not generated. Every result shows confidence, reasoning, and alternatives.",
  keywords: ["ClearPath AI", "community resources", "211", "social services", "crisis support", "honest confidence", "zero-shot classification", "BART-large-MNLI", "responsible AI"],
  authors: [{ name: "ClearPath AI Team" }, { name: "Amine Harch El Korane" }],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/clearpath-logo.png", type: "image/png", sizes: "1024x1024" },
    ],
    apple: "/clearpath-logo.png",
  },
  openGraph: {
    title: "ClearPath AI — Community Resource Navigator",
    description: "Verified community resources with honest confidence. Classified, not generated.",
    type: "website",
    images: [{ url: "/clearpath-logo.png", width: 1024, height: 1024, alt: "ClearPath AI Logo" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearPath AI — Community Resource Navigator",
    description: "Verified community resources with honest confidence. Classified, not generated.",
    images: ["/clearpath-logo.png"],
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
        style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif" }}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
