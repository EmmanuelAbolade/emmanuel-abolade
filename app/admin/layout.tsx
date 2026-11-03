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
        className="admin-main"
        style={{
          flex: 1,
          marginLeft: "260px",
          minHeight: "100vh",
          minWidth: 0,
          background: "var(--bg)",
        }}
      >
        {children}
      </main>

      {/* No overflow on main so sticky toolbars pin to the viewport */}
      <style>{`
        @media (max-width: 768px) {
          .admin-main {
            margin-left: 0 !important;
            padding-top: 3.5rem;
            --admin-sticky-top: 3.5rem;
          }
          .admin-main > div { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 1.25rem !important; }
        }
      `}</style>
    </div>
  )
}
