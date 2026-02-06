import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { websiteSchema, organizationSchema } from "@/lib/schema";
import { PostHogProvider } from "./providers";
import { AuthProvider } from "@/lib/firebase/auth-context";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.clawdex.io";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ClawDex — Discover AI Agent Workflows & Use Cases",
    template: "%s | ClawDex",
  },
  description:
    "The community directory for AI agent workflows. Discover 90+ real OpenClaw use cases, filter by category and complexity, and find inspiration for your next AI automation project.",
  keywords: [
    "OpenClaw",
    "AI agents",
    "AI workflows",
    "automation",
    "Claude Code",
    "MCP servers",
    "AI use cases",
    "smart home automation",
    "developer tools",
    "productivity",
    "no-code AI",
    "AI directory",
  ],
  authors: [{ name: "ClawDex", url: siteUrl }],
  creator: "ClawDex",
  publisher: "ClawDex",
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    title: "ClawDex — Discover AI Agent Workflows",
    description:
      "The community directory for AI agent workflows. 90+ real use cases from smart home to developer tools.",
    type: "website",
    locale: "en_US",
    siteName: "ClawDex",
    url: siteUrl,
    images: [
      {
        url: `${siteUrl}/og`,
        width: 1200,
        height: 630,
        alt: "ClawDex - Discover AI Agent Workflows",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ClawDex — Discover AI Agent Workflows",
    description:
      "The community directory for AI agent workflows. 90+ real use cases from smart home to developer tools.",
    images: [`${siteUrl}/og`],
    creator: "@clawdex",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    // Add your verification codes here when you have them
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
  category: "technology",
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
        <PostHogProvider>
          <AuthProvider>{children}</AuthProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
