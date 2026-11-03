// app/admin/posts/page.tsx
// Admin Posts listing page - shows all posts with cover, status, publish toggle and actions
// Rows stack into cards on mobile so titles stay readable

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Star, Clock, Calendar, FileText, ExternalLink, Images } from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PostStatusToggle from "./PostStatusToggle"

function formatDate(value: string | null): string {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" })
}

export default async function AdminPostsPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error.message)
  }

  const counts = (posts ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
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
            {posts?.length ?? 0} total
            {Object.entries(counts).map(([status, n]) => ` · ${n} ${status}`)}
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <Plus size={16} />
          New Post
        </Link>
      </div>

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
        <div className="admin-list">
          {posts.map((post) => {
            const date = post.status === "published" ? post.published_at : post.updated_at ?? post.created_at
            return (
              <div key={post.id} className="admin-row">
                {/* Cover */}
                <div className="admin-thumb">
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={post.cover_image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <FileText size={18} />
                  )}
                </div>

                {/* Title and details */}
                <div style={{ minWidth: 0 }}>
                  <Link href={`/admin/posts/${post.id}/edit`} className="admin-row-title" title={post.title}>
                    {post.title}
                  </Link>
                  <p className="admin-row-sub">/blog/{post.slug}</p>
                  <div className="admin-row-meta">
                    {post.pinned_order && (
                      <span className="admin-chip accent"><Star size={10} fill="var(--accent)" /> Pinned #{post.pinned_order}</span>
                    )}
                    {post.featured && (
                      <span className="admin-chip accent"><Star size={10} /> Featured</span>
                    )}
                    {date && (
                      <span className="admin-chip">
                        <Calendar size={10} />
                        {post.status === "published" ? "Published " : "Updated "}
                        {formatDate(date)}
                      </span>
                    )}
                    {post.reading_time && (
                      <span className="admin-chip"><Clock size={10} /> {post.reading_time} min</span>
                    )}
                    {post.gallery?.length > 0 && (
                      <span className="admin-chip"><Images size={10} /> {post.gallery.length}</span>
                    )}
                    {post.tags?.slice(0, 3).map((t: string) => (
                      <span key={t} className="admin-chip">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-row-side">
                  <PostStatusToggle id={post.id} status={post.status} />
                  {post.status === "published" && (
                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" className="admin-action" title="View on site">
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <Link href={`/admin/posts/${post.id}/edit`} className="admin-action">
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
