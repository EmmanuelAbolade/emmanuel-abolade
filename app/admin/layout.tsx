// app/admin/layout.tsx
// Admin layout - shared sidebar navigation for all admin pages
// Protected by middleware - only authenticated users can access

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminSidebar from "./AdminSidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg)",
      }}
    >
      <AdminSidebar userEmail={user.email ?? ""} />
      <main
        style={{
          flex: 1,
          marginLeft: "260px",
          minHeight: "100vh",
          background: "var(--bg)",
          overflow: "auto",
        }}
      >
        {children}
      </main>

      <style>{`
        @media (max-width: 768px) {
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  )
}
