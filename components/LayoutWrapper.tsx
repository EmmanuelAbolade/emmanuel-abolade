// components/LayoutWrapper.tsx
// Conditionally renders Navbar and Footer only on public pages
// Admin and login pages have their own layouts

"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"
import Footer from "./Footer"

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Do not show public Navbar/Footer on admin or login pages
  const isAdminPage = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/login"
  const showPublicLayout = !isAdminPage && !isLoginPage

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {showPublicLayout && <Navbar />}
      <main
        style={{
          flex: 1,
          paddingTop: showPublicLayout ? "4rem" : "0",
        }}
      >
        {children}
      </main>
      {showPublicLayout && <Footer />}
    </div>
  )
}
