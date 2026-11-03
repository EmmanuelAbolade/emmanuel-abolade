// app/admin/testimonials/page.tsx
// Admin Testimonials page - manage testimonials and recommendations
// Rows stack into cards on mobile so names stay readable

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Star } from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PublishToggle from "../components/PublishToggle"

export default async function AdminTestimonialsPage() {
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testimonials:", error.message)
  }

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <h1 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "2rem", color: "var(--text-primary)", marginBottom: "0.25rem",
          }}>
            Testimonials
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {testimonials?.length ?? 0} total testimonials
          </p>
        </div>
        <Link href="/admin/testimonials/new" className="btn-primary">
          <Plus size={16} />
          New Testimonial
        </Link>
      </div>

      {!testimonials || testimonials.length === 0 ? (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "4rem",
          textAlign: "center", color: "var(--text-muted)",
        }}>
          <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
            No testimonials yet. Add your first one.
          </p>
          <Link href="/admin/testimonials/new" className="btn-primary">
            <Plus size={16} />
            New Testimonial
          </Link>
        </div>
      ) : (
        <div className="admin-list">
          {testimonials.map((t) => (
            <div key={t.id} className="admin-row">
              {/* Avatar */}
              <div className="admin-thumb" style={{ borderRadius: "50%", width: "54px", height: "54px" }}>
                {t.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={t.avatar_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.2rem" }}>
                    {t.name?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name and quote */}
              <div style={{ minWidth: 0 }}>
                <Link href={`/admin/testimonials/${t.id}/edit`} className="admin-row-title">
                  {t.name}
                </Link>
                <p className="admin-row-sub">
                  {[t.role, t.company].filter(Boolean).join(" at ") || "—"}
                </p>
                <div className="admin-row-meta">
                  <span className="admin-chip" style={{ gap: "1px" }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        size={10}
                        color={idx < (t.rating ?? 5) ? "#f59e0b" : "var(--border)"}
                        fill={idx < (t.rating ?? 5) ? "#f59e0b" : "none"}
                      />
                    ))}
                  </span>
                  {t.project && <span className="admin-chip">{t.project}</span>}
                  {t.content && (
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, flex: "1 1 160px" }}>
                      “{t.content}”
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="admin-row-side">
                <PublishToggle id={t.id} table="testimonials" published={t.published} />
                <Link href={`/admin/testimonials/${t.id}/edit`} className="admin-action">
                  <Pencil size={12} />
                  Edit
                </Link>
                <DeleteButton id={t.id} table="testimonials" label="testimonial" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
