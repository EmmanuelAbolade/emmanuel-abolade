// app/admin/projects/page.tsx
// Admin Projects page - lists all projects with publish/unpublish, pin, and delete actions
// Links to individual edit pages for full CRUD

import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  Plus,
  Pencil,
  Star,
  Globe,
  GitBranch,
  Calendar,
} from "lucide-react"
import DeleteButton from "../components/DeleteButton"
import PublishToggle from "../components/PublishToggle"

export default async function AdminProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from("projects")
    .select("id, title, slug, status, technologies, featured, published, pinned_order, start_date, end_date, created_at")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error.message)
  }

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
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
            {projects?.length ?? 0} total projects
          </p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary">
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Projects table */}
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
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 120px 100px 120px 140px",
              padding: "0.75rem 1.25rem",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border)",
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              gap: "1rem",
            }}
          >
            <span>Project</span>
            <span>Status</span>
            <span>Featured</span>
            <span>Published</span>
            <span>Actions</span>
          </div>

          {/* Table rows */}
          {projects.map((project, i) => (
            <div
              key={project.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 100px 120px 140px",
                padding: "1rem 1.25rem",
                borderBottom:
                  i < projects.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                alignItems: "center",
                gap: "1rem",
                transition: "background 0.15s ease",
              }}
            >
              {/* Title and meta */}
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {project.pinned_order && (
                    <Star
                      size={13}
                      color="var(--accent)"
                      fill="var(--accent)"
                    />
                  )}
                  <p
                    style={{
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {project.title}
                  </p>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                  }}
                >
                  {project.technologies?.slice(0, 3).map((t: string) => (
                    <span
                      key={t}
                      style={{
                        fontSize: "0.72rem",
                        color: "var(--text-muted)",
                        background: "var(--bg-secondary)",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "0.2rem",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    padding: "0.25rem 0.6rem",
                    borderRadius: "999px",
                    background:
                      project.status === "Completed"
                        ? "var(--accent-subtle)"
                        : "var(--bg-secondary)",
                    color:
                      project.status === "Completed"
                        ? "var(--accent)"
                        : "var(--text-muted)",
                  }}
                >
                  {project.status ?? "—"}
                </span>
              </div>

              {/* Featured */}
              <div>
                <span
                  style={{
                    fontSize: "0.8rem",
                    color: project.featured
                      ? "var(--accent)"
                      : "var(--text-muted)",
                  }}
                >
                  {project.featured ? "Yes" : "No"}
                </span>
              </div>

              {/* Published toggle */}
              <PublishToggle
                id={project.id}
                table="projects"
                published={project.published}
              />

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Link
                  href={`/admin/projects/${project.id}/edit`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.375rem",
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                    color: "var(--text-secondary)",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Pencil size={12} />
                  Edit
                </Link>
                <DeleteButton
                  id={project.id}
                  table="projects"
                  label="project"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
