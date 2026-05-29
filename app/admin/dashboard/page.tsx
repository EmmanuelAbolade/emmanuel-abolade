// app/admin/dashboard/page.tsx
// Admin dashboard - overview stats for all content types

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  FolderOpen,
  FileText,
  BookMarked,
  MessageSquare,
  Users,
  ArrowRight,
  TrendingUp,
} from "lucide-react"

type StatCardProps = {
  title: string
  count: number
  subtitle: string
  href: string
  icon: React.ElementType
  accent?: boolean
}

function StatCard({ title, count, subtitle, href, icon: Icon, accent }: StatCardProps) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "1rem",
          borderColor: accent ? "var(--accent)" : undefined,
        }}
      >
        <div
          style={{
            width: "2.75rem",
            height: "2.75rem",
            minWidth: "2.75rem",
            background: "var(--accent-subtle)",
            borderRadius: "0.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color="var(--accent)" />
        </div>
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.25rem",
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "2rem",
              color: "var(--text-primary)",
              lineHeight: 1,
              marginBottom: "0.25rem",
            }}
          >
            {count}
          </p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        </div>
        <ArrowRight size={16} color="var(--text-muted)" style={{ marginTop: "0.25rem" }} />
      </div>
    </Link>
  )
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch counts in parallel
  const [
    { count: projectCount },
    { count: postCount },
    { count: resourceCount },
    { count: messageCount },
    { count: newMessageCount },
    { count: subscriberCount },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("resources").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("messages").select("*", { count: "exact", head: true }),
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("status", "New"),
    supabase.from("subscribers").select("*", { count: "exact", head: true }),
  ])

  // Fetch recent messages
  const { data: recentMessages } = await supabase
    .from("messages")
    .select("id, name, email, enquiry_type, subject, status, created_at")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div style={{ padding: "2rem" }}>

      {/* Page header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "0.4rem",
          }}
        >
          Dashboard
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          Overview of your website content and activity.
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.25rem",
          marginBottom: "3rem",
        }}
      >
        <StatCard
          title="Projects"
          count={projectCount ?? 0}
          subtitle="Published projects"
          href="/admin/projects"
          icon={FolderOpen}
        />
        <StatCard
          title="Posts"
          count={postCount ?? 0}
          subtitle="Published articles"
          href="/admin/posts"
          icon={FileText}
        />
        <StatCard
          title="Resources"
          count={resourceCount ?? 0}
          subtitle="Published resources"
          href="/admin/resources"
          icon={BookMarked}
        />
        <StatCard
          title="Messages"
          count={newMessageCount ?? 0}
          subtitle={`${messageCount ?? 0} total — ${newMessageCount ?? 0} new`}
          href="/admin/messages"
          icon={MessageSquare}
          accent={(newMessageCount ?? 0) > 0}
        />
        <StatCard
          title="Subscribers"
          count={subscriberCount ?? 0}
          subtitle="Newsletter subscribers"
          href="/admin/subscribers"
          icon={Users}
        />
      </div>

      {/* Recent messages */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.25rem",
          }}
        >
          <h2
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.35rem",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <TrendingUp size={18} color="var(--accent)" />
            Recent Messages
          </h2>
          <Link
            href="/admin/messages"
            style={{
              fontSize: "0.85rem",
              color: "var(--accent)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {recentMessages && recentMessages.length > 0 ? (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
          >
            {recentMessages.map((msg, i) => (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem 1.25rem",
                  borderBottom:
                    i < recentMessages.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    minWidth: "2.25rem",
                    background: "var(--accent-subtle)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "0.95rem",
                    color: "var(--accent)",
                  }}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.15rem",
                    }}
                  >
                    {msg.name}
                    <span
                      style={{
                        fontWeight: 400,
                        color: "var(--text-muted)",
                        fontSize: "0.8rem",
                        marginLeft: "0.5rem",
                      }}
                    >
                      {msg.email}
                    </span>
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {msg.subject ?? msg.enquiry_type ?? "No subject"}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "999px",
                      background:
                        msg.status === "New"
                          ? "var(--accent-subtle)"
                          : "var(--bg-secondary)",
                      color:
                        msg.status === "New"
                          ? "var(--accent)"
                          : "var(--text-muted)",
                    }}
                  >
                    {msg.status}
                  </span>
                  <span
                    style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}
                  >
                    {new Date(msg.created_at).toLocaleDateString("en-IE", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "3rem",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            No messages yet.
          </div>
        )}
      </div>
    </div>
  )
}
