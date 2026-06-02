// app/layout.tsx
// Root layout - wraps all pages with ThemeProvider and conditional public layout
// Admin and login pages opt out of the public Navbar and Footer via LayoutWrapper

import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import LayoutWrapper from "@/components/LayoutWrapper"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

const BASE_URL = "https://emmanuel-abolade.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Emmanuel Abolade — Software Developer",
    template: "%s | Emmanuel Abolade",
  },
  description:
    "Software developer based in Ireland specialising in full-stack web development and machine learning. Final-year BSc student at SETU Carlow.",
  keywords: [
    "Emmanuel Abolade",
    "software developer",
    "full-stack developer",
    "Next.js developer",
    "React developer",
    "Java",
    "Ireland",
    "SETU Carlow",
    "web development",
    "Python",
    "TypeScript",
  ],
  authors: [{ name: "Emmanuel Abolade", url: BASE_URL }],
  creator: "Emmanuel Abolade",
  publisher: "Emmanuel Abolade",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Emmanuel Abolade — Software Developer",
    description:
      "Software developer based in Ireland specialising in full-stack web development and machine learning.",
    url: BASE_URL,
    siteName: "Emmanuel Abolade",
    locale: "en_IE",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Emmanuel Abolade — Software Developer based in Ireland",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emmanuel Abolade — Software Developer",
    description:
      "Software developer based in Ireland specialising in full-stack web & mobile development.",
    images: ["/og-image.png"],
    creator: "@EmmanuelAbolade",
  },
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
