// components/ThemeProvider.tsx
// Wraps the app with next-themes for theme switching support

"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="light"
      enableSystem={false}
      themes={["light", "dark", "forest", "ocean", "rose", "slate"]}
    >
      {children}
    </NextThemesProvider>
  )
}