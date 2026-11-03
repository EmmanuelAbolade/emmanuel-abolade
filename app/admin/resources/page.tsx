// app/admin/resources/page.tsx
// Admin Resources listing page - shows all resources with logo, type, pricing, publish toggle and actions
// Rows stack into cards on mobile so titles stay readable

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil, Star, ExternalLink, BookMarked, Tag } from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PublishToggle from "../components/PublishToggle"

export default async function AdminResourcesPage() {
  const supabase = await createClient()

  const { data: resources, error } = await supabase
    .from("resources")
    .select("id, title, url, description, logo_url, resource_type, pricing_model, coupon_code, featured, published, pinned_order, created_at")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error.message)
  }

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
        marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <h1 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "2rem", color: "var(--text-primary)", marginBottom: "0.25rem",
          }}>
            Resources
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {resources?.length ?? 0} total · {(resources ?? []).filter((r) => r.published).length} published
          </p>
        </div>
        <Link href="/admin/resources/new" className="btn-primary">
          <Plus size={16} />
          New Resource
        </Link>
      </div>

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
        <div className="admin-list">
          {resources.map((resource) => (
            <div key={resource.id} className="admin-row">
              {/* Logo */}
              <div className="admin-thumb" style={{ background: resource.logo_url ? "var(--surface)" : undefined }}>
                {resource.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={resource.logo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "0.35rem" }} />
                ) : (
                  <BookMarked size={18} />
                )}
              </div>

              {/* Title and details */}
              <div style={{ minWidth: 0 }}>
                <Link href={`/admin/resources/${resource.id}/edit`} className="admin-row-title" title={resource.title}>
                  {resource.title}
                </Link>
                <p className="admin-row-sub">
                  {resource.description || resource.url.replace(/^https?:\/\//, "").split("/")[0]}
                </p>
                <div className="admin-row-meta">
                  {resource.pinned_order && (
                    <span className="admin-chip accent"><Star size={10} fill="var(--accent)" /> Pinned #{resource.pinned_order}</span>
                  )}
                  {resource.featured && (
                    <span className="admin-chip accent"><Star size={10} /> Featured</span>
                  )}
                  {resource.resource_type && (
                    <span className="admin-chip">{resource.resource_type}</span>
                  )}
                  {resource.pricing_model && (
                    <span className="admin-chip" style={{ color: PRICING_COLORS[resource.pricing_model] ?? "var(--text-muted)" }}>
                      {resource.pricing_model}
                    </span>
                  )}
                  {resource.coupon_code && (
                    <span className="admin-chip"><Tag size={10} /> {resource.coupon_code}</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="admin-row-side">
                <PublishToggle id={resource.id} table="resources" published={resource.published} />
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="admin-action" title="Open resource link">
                  <ExternalLink size={12} />
                </a>
                <Link href={`/admin/resources/${resource.id}/edit`} className="admin-action">
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
