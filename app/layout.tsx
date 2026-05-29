// app/layout.tsx
// Root layout - wraps all pages with ThemeProvider and conditional public layout
// Admin and login pages opt out of the public Navbar and Footer via LayoutWrapper

import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import LayoutWrapper from "@/components/LayoutWrapper"

export const metadata: Metadata = {
  title: {
    default: "Emmanuel Abolade — Software Developer",
    template: "%s | Emmanuel Abolade",
  },
  description:
    "Software developer based in Ireland specialising in full-stack web development and machine learning.",
  keywords: [
    "software developer",
    "Next.js",
    "React",
    "machine learning",
    "Ireland",
  ],
  authors: [{ name: "Emmanuel Abolade" }],
  openGraph: {
    title: "Emmanuel Abolade — Software Developer",
    description: "Software developer based in Ireland.",
    url: "https://emmanuel-abolade.vercel.app",
    siteName: "Emmanuel Abolade",
    locale: "en_IE",
    type: "website",
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
      </body>
    </html>
  )
}
