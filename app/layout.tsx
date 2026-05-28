// app/layout.tsx
// Root layout — wraps all pages with ThemeProvider, Navbar, and Footer

import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: {
    default: "Emmanuel Abolade — Software Developer",
    template: "%s | Emmanuel Abolade",
  },
  description: "Software developer based in Ireland specialising in full-stack web development and machine learning.",
  keywords: ["software developer", "Next.js", "React", "machine learning", "Ireland"],
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
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: "4rem" }}>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}