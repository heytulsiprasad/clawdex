import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { websiteSchema, organizationSchema } from "@/lib/schema";
import { PostHogProvider } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ClawDex — The OpenClaw Use Case Directory",
    template: "%s | ClawDex",
  },
  description:
    "Discover how people are using OpenClaw. Filter by category, complexity, and integrations. 85+ real use cases from the community.",
  keywords: [
    "OpenClaw",
    "use cases",
    "AI automation",
    "directory",
    "showcase",
  ],
  openGraph: {
    title: "ClawDex — The OpenClaw Use Case Directory",
    description:
      "Discover how people are using OpenClaw. Filter by category, complexity, and integrations.",
    type: "website",
    locale: "en_US",
    siteName: "ClawDex",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawDex — The OpenClaw Use Case Directory",
    description:
      "Discover how people are using OpenClaw. 85+ real use cases from the community.",
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
