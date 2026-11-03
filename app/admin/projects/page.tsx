// app/admin/projects/page.tsx
// Admin Projects page - lists all projects with image, status, publish toggle and actions
// Rows stack into cards on mobile so titles stay readable

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Plus,
  Pencil,
  Star,
  Calendar,
  Layers,
  ExternalLink,
  Images,
} from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PublishToggle from "../components/PublishToggle"

function formatMonth(value: string | null): string {
  if (!value) return ""
  return new Date(value).toLocaleDateString("en-IE", { month: "short", year: "numeric" })
}

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error.message)
  }

  const publishedCount = (projects ?? []).filter((p) => p.published).length

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "2rem",
              color: "var(--text-primary)",
              marginBottom: "0.25rem",
            }}
          >
            Projects
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            {projects?.length ?? 0} total · {publishedCount} published
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "4rem",
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <p style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
            No projects yet. Add your first project.
          </p>
          <Link href="/admin/projects/new" className="btn-primary">
            <Plus size={16} />
            New Project
          </Link>
        </div>
      ) : (
        <div className="admin-list">
          {projects.map((project) => {
            const period = [formatMonth(project.start_date), formatMonth(project.end_date)].filter(Boolean).join(" – ")
            return (
              <div key={project.id} className="admin-row">
                {/* Image */}
                <div className="admin-thumb">
                  {project.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={project.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Layers size={18} />
                  )}
                </div>

                {/* Title and details */}
                <div style={{ minWidth: 0 }}>
                  <Link href={`/admin/projects/${project.id}/edit`} className="admin-row-title" title={project.title}>
                    {project.title}
                  </Link>
                  <p className="admin-row-sub">{project.excerpt || `/projects/${project.slug}`}</p>
                  <div className="admin-row-meta">
                    {project.pinned_order && (
                      <span className="admin-chip accent"><Star size={10} fill="var(--accent)" /> Pinned #{project.pinned_order}</span>
                    )}
                    {project.featured && (
                      <span className="admin-chip accent"><Star size={10} /> Featured</span>
                    )}
                    {project.status && (
                      <span className={`admin-chip${project.status === "In Progress" ? " warn" : ""}`}>{project.status}</span>
                    )}
                    {period && (
                      <span className="admin-chip"><Calendar size={10} /> {period}</span>
                    )}
                    {project.gallery?.length > 0 && (
                      <span className="admin-chip"><Images size={10} /> {project.gallery.length}</span>
                    )}
                    {project.technologies?.slice(0, 3).map((t: string) => (
                      <span key={t} className="admin-chip">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-row-side">
                  <PublishToggle id={project.id} table="projects" published={project.published} />
                  {project.published && (
                    <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" className="admin-action" title="View on site">
                      <ExternalLink size={12} />
                    </a>
                  )}
                  <Link href={`/admin/projects/${project.id}/edit`} className="admin-action">
                    <Pencil size={12} />
                    Edit
                  </Link>
                  <DeleteButton id={project.id} table="projects" label="project" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
