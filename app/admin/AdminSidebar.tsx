// app/admin/AdminSidebar.tsx
// Admin sidebar - navigation links and logout button for admin panel

"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Code2,
  LayoutDashboard,
  FolderOpen,
  FileText,
  BookMarked,
  Tag,
  MessageSquare,
  Users,
  LogOut,
  Menu,
  Star,
  X,
} from "lucide-react"

const NAV_ITEMS = [
  { href: "/admin/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/projects",    label: "Projects",    icon: FolderOpen      },
  { href: "/admin/posts",       label: "Posts",       icon: FileText        },
  { href: "/admin/resources",   label: "Resources",   icon: BookMarked      },
  { href: "/admin/categories",  label: "Categories",  icon: Tag             },
  { href: "/admin/messages",    label: "Messages",    icon: MessageSquare   },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users           },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
]

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname        = usePathname()
  const router          = useRouter()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const sidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1.5rem 1rem",
      }}
    >
      {/* Logo */}
      <Link
        href="/admin/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          textDecoration: "none",
          marginBottom: "2rem",
          padding: "0 0.5rem",
        }}
      >
        <div
          style={{
            width: "2rem",
            height: "2rem",
            background: "var(--accent)",
            borderRadius: "0.375rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Code2 size={14} color="var(--bg)" />
        </div>
        <div>
          <p
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "0.95rem",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            Emmanuel<span style={{ color: "var(--accent)" }}>.</span>
          </p>
          <p
            style={{
              fontSize: "0.7rem",
              color: "var(--text-muted)",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.25rem",
          flex: 1,
        }}
      >
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.65rem 0.85rem",
                borderRadius: "0.5rem",
                textDecoration: "none",
                background: isActive ? "var(--accent-subtle)" : "transparent",
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                fontWeight: isActive ? 600 : 400,
                fontSize: "0.9rem",
                transition: "all 0.15s ease",
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          paddingTop: "1rem",
          marginTop: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            padding: "0 0.5rem",
            marginBottom: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {userEmail}
        </p>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "0.5rem",
            border: "none",
            background: "transparent",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            cursor: "pointer",
            width: "100%",
            transition: "all 0.15s ease",
          }}
        >
          <LogOut size={17} />
          Sign Out
        </button>

        {/* Link to public site */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.65rem 0.85rem",
            borderRadius: "0.5rem",
            textDecoration: "none",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            transition: "all 0.15s ease",
          }}
        >
          <Code2 size={17} />
          View Site
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          overflowY: "auto",
        }}
        className="admin-sidebar-desktop"
      >
        {sidebarContent}
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="admin-mobile-toggle"
        style={{
          display: "none",
          position: "fixed",
          top: "1rem",
          left: "1rem",
          zIndex: 200,
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "0.375rem",
          padding: "0.5rem",
          cursor: "pointer",
          color: "var(--text-primary)",
        }}
        aria-label="Toggle admin menu"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Mobile sidebar overlay */}
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            display: "flex",
          }}
        >
          <div
            style={{
              width: "260px",
              background: "var(--surface)",
              borderRight: "1px solid var(--border)",
              overflowY: "auto",
            }}
          >
            {sidebarContent}
          </div>
          <div
            style={{ flex: 1, background: "rgba(0,0,0,0.4)" }}
            onClick={() => setOpen(false)}
          />
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar-desktop { display: none !important; }
          .admin-mobile-toggle   { display: flex !important; }
        }
      `}</style>
    </>
  )
}
