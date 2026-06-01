// app/admin/resources/page.tsx
// Admin Resources listing page - shows all resources with publish toggle and actions

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Star, ExternalLink } from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PublishToggle from "../components/PublishToggle"

export default async function AdminResourcesPage() {
  const supabase = await createClient()

  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, title, url, resource_type, pricing_model, featured, published, pinned_order, created_at")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error.message)
  }

  // Add RLS policy for authenticated users to read all resources
  const PRICING_COLORS: Record<string, string> = {
    Free:          "#16a34a",
    Freemium:      "#ca8a04",
    Paid:          "#dc2626",
    "Open Source": "#2563eb",
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
            Resources
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {resources?.length ?? 0} total resources
          </p>
        </div>
        <Link href="/admin/resources/new" className="btn-primary">
          <Plus size={16} />
          New Resource
        </Link>
      </div>

      {/* Resources table */}
      {!resources || resources.length === 0 ? (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "4rem",
          textAlign: "center", color: "var(--text-muted)",
        }}>
          <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
            No resources yet. Add your first resource.
          </p>
          <Link href="/admin/resources/new" className="btn-primary">
            <Plus size={16} />
            New Resource
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
            gridTemplateColumns: "1fr 120px 110px 100px 120px 140px",
            padding: "0.75rem 1.25rem",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: "0.75rem", fontWeight: 700,
            color: "var(--text-muted)",
            textTransform: "uppercase", letterSpacing: "0.06em", gap: "1rem",
          }}>
            <span>Resource</span>
            <span>Type</span>
            <span>Pricing</span>
            <span>Featured</span>
            <span>Published</span>
            <span>Actions</span>
          </div>

          {/* Table rows */}
          {resources.map((resource, i) => (
            <div
              key={resource.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 110px 100px 120px 140px",
                padding: "1rem 1.25rem",
                borderBottom: i < resources.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "center", gap: "1rem",
              }}
            >
              {/* Title and URL */}
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                  {resource.pinned_order && (
                    <Star size={13} color="var(--accent)" fill="var(--accent)" />
                  )}
                  <p style={{
                    fontWeight: 600, color: "var(--text-primary)",
                    fontSize: "0.9rem", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {resource.title}
                  </p>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                    fontSize: "0.72rem", color: "var(--text-muted)",
                    textDecoration: "none", overflow: "hidden",
                    textOverflow: "ellipsis", whiteSpace: "nowrap",
                    maxWidth: "280px",
                  }}
                >
                  <ExternalLink size={10} />
                  {resource.url.replace(/^https?:\/\//, "").split("/")[0]}
                </a>
              </div>

              {/* Type */}
              <span style={{
                fontSize: "0.78rem", color: "var(--text-secondary)",
                background: "var(--bg-secondary)",
                padding: "0.2rem 0.6rem", borderRadius: "0.25rem",
                display: "inline-flex", alignSelf: "center",
              }}>
                {resource.resource_type ?? "—"}
              </span>

              {/* Pricing */}
              <span style={{
                fontSize: "0.75rem", fontWeight: 700,
                color: PRICING_COLORS[resource.pricing_model ?? ""] ?? "var(--text-muted)",
              }}>
                {resource.pricing_model ?? "—"}
              </span>

              {/* Featured */}
              <span style={{
                fontSize: "0.8rem",
                color: resource.featured ? "var(--accent)" : "var(--text-muted)",
              }}>
                {resource.featured ? "Yes" : "No"}
              </span>

              {/* Publish toggle */}
              <PublishToggle
                id={resource.id}
                table="resources"
                published={resource.published}
              />

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href={`/admin/resources/${resource.id}/edit`}
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
                <DeleteButton id={resource.id} table="resources" label="resource" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
