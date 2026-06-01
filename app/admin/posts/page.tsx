// app/admin/posts/page.tsx
// Admin Posts listing page - shows all posts with status, publish toggle and actions

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Star, Clock } from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PostStatusToggle from "./PostStatusToggle"

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, status, featured, reading_time, pinned_order, tags, published_at, created_at")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error.message)
  }

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    draft:     { bg: "var(--bg-secondary)", color: "var(--text-muted)" },
    review:    { bg: "#fef9c3",             color: "#ca8a04"           },
    published: { bg: "var(--accent-subtle)", color: "var(--accent)"   },
    archived:  { bg: "var(--bg-secondary)", color: "var(--text-muted)" },
  }

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "2rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <h1 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
          }}>
            Posts
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {posts?.length ?? 0} total posts
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Posts table */}
      {!posts || posts.length === 0 ? (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          padding: "4rem",
          textAlign: "center",
          color: "var(--text-muted)",
        }}>
          <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
            No posts yet. Write your first article.
          </p>
          <Link href="/admin/posts/new" className="btn-primary">
            <Plus size={16} />
            New Post
          </Link>
        </div>
      ) : (
        <div style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
          overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 110px 100px 120px 140px",
            padding: "0.75rem 1.25rem",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            gap: "1rem",
          }}>
            <span>Post</span>
            <span>Status</span>
            <span>Featured</span>
            <span>Published</span>
            <span>Actions</span>
          </div>

          {/* Table rows */}
          {posts.map((post, i) => {
            const statusStyle = STATUS_COLORS[post.status] ?? STATUS_COLORS.draft
            return (
              <div
                key={post.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 110px 100px 120px 140px",
                  padding: "1rem 1.25rem",
                  borderBottom: i < posts.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Title and meta */}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    {post.pinned_order && (
                      <Star size={13} color="var(--accent)" fill="var(--accent)" />
                    )}
                    <p style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}>
                      {post.title}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                    {post.reading_time && (
                      <span style={{
                        display: "flex", alignItems: "center", gap: "0.25rem",
                        fontSize: "0.72rem", color: "var(--text-muted)",
                      }}>
                        <Clock size={10} />
                        {post.reading_time} min
                      </span>
                    )}
                    {post.tags?.slice(0, 2).map((t: string) => (
                      <span key={t} style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        background: "var(--bg-secondary)",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "0.2rem",
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Status badge */}
                <span style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  padding: "0.25rem 0.6rem",
                  borderRadius: "999px",
                  background: statusStyle.bg,
                  color: statusStyle.color,
                  textTransform: "capitalize",
                  display: "inline-flex",
                  alignSelf: "center",
                }}>
                  {post.status}
                </span>

                {/* Featured */}
                <span style={{
                  fontSize: "0.8rem",
                  color: post.featured ? "var(--accent)" : "var(--text-muted)",
                }}>
                  {post.featured ? "Yes" : "No"}
                </span>

                {/* Status toggle */}
                <PostStatusToggle id={post.id} status={post.status} />

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.3rem",
                      padding: "0.4rem 0.75rem", borderRadius: "0.375rem",
                      border: "1px solid var(--border)", background: "var(--surface)",
                      color: "var(--text-secondary)", fontSize: "0.8rem",
                      textDecoration: "none", transition: "all 0.15s ease",
                    }}
                  >
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <DeleteButton id={post.id} table="posts" label="post" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
