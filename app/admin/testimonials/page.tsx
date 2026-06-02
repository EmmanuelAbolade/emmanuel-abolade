// app/admin/testimonials/page.tsx
// Admin Testimonials page - manage testimonials and recommendations

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
        marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
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

      {/* List */}
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
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 160px 80px 120px 140px",
            padding: "0.75rem 1.25rem",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: "0.75rem", fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.06em", gap: "1rem",
          }}>
            <span>Person</span>
            <span>Project</span>
            <span>Rating</span>
            <span>Published</span>
            <span>Actions</span>
          </div>

          {testimonials.map((t, i) => (
            <div
              key={t.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 160px 80px 120px 140px",
                padding: "1rem 1.25rem",
                borderBottom: i < testimonials.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center", gap: "1rem",
              }}
            >
              {/* Name and role */}
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontWeight: 600, color: "var(--text-primary)",
                  fontSize: "0.9rem", marginBottom: "0.15rem",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {t.name}
                </p>
                <p style={{
                  fontSize: "0.78rem", color: "var(--text-muted)",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {[t.role, t.company].filter(Boolean).join(" at ")}
                </p>
              </div>

              {/* Project */}
              <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
                {t.project ?? "—"}
              </span>

              {/* Rating */}
              <div style={{ display: "flex", gap: "1px" }}>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={12}
                    color={idx < (t.rating ?? 5) ? "#f59e0b" : "var(--border)"}
                    fill={idx < (t.rating ?? 5) ? "#f59e0b" : "none"}
                  />
                ))}
              </div>

              {/* Publish toggle */}
              <PublishToggle
                id={t.id}
                table="testimonials"
                published={t.published}
              />

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href={`/admin/testimonials/${t.id}/edit`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    padding: "0.4rem 0.75rem", borderRadius: "0.375rem",
                    border: "1px solid var(--border)", background: "var(--surface)",
                    color: "var(--text-secondary)", fontSize: "0.8rem",
                    textDecoration: "none",
                  }}
                >
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
