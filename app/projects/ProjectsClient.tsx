// app/projects/ProjectsClient.tsx
// Client component for Projects page - handles filtering and display of project cards

"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import {
  ExternalLink,
  GitBranch,
  ArrowRight,
  Search,
  Star,
  Calendar,
  User,
  Layers,
} from "lucide-react"

// Type definition for a project record from Supabase
type Project = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  description: string | null
  technologies: string[] | null
  my_role: string | null
  client: string | null
  status: string | null
  difficulty_level: string | null
  repository_url: string | null
  showcase_url: string | null
  live_url: string | null
  image_url: string | null
  key_achievements: string[] | null
  learnings: string | null
  start_date: string | null
  end_date: string | null
  featured: boolean
  published: boolean
  pinned_order: number | null
  created_at: string
  updated_at: string
}

const STATUS_COLORS: Record<string, string> = {
  Completed:   "var(--accent)",
  "In Progress": "#f59e0b",
  Maintained:  "#3b82f6",
  Archived:    "var(--text-muted)",
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner:     "#22c55e",
  Intermediate: "#f59e0b",
  Advanced:     "#ef4444",
}

const ALL_FILTER = "All"

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [search, setSearch]       = useState("")
  const [activeFilter, setFilter] = useState(ALL_FILTER)

  // Collect all unique technologies across all projects
  const allTechnologies = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)))
    return [ALL_FILTER, ...Array.from(set).sort()]
  }, [projects])

  // Filter projects by search and technology
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.technologies ?? []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        )
      const matchesFilter =
        activeFilter === ALL_FILTER ||
        (p.technologies ?? []).includes(activeFilter)
      return matchesSearch && matchesFilter
    })
  }, [projects, search, activeFilter])

  const featured = filtered.filter((p) => p.featured)
  const regular  = filtered.filter((p) => !p.featured)

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Page header */}
      <section
        style={{
          padding: "5rem 0 3rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            My Work
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Projects
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "560px",
              lineHeight: 1.7,
            }}
          >
            A curated collection of systems, applications, and experiments —
            each one a story of problem-solving, learning, and craft.
          </p>
        </div>
      </section>

      {/* Search and filter bar */}
      <section
        style={{
          padding: "2rem 0",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "4rem",
          zIndex: 10,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {/* Search input */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: "220px",
                maxWidth: "340px",
              }}
            >
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.25rem",
                  paddingRight: "1rem",
                  paddingTop: "0.6rem",
                  paddingBottom: "0.6rem",
                  borderRadius: "0.375rem",
                  border: "1.5px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            {/* Technology filter pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                flex: 1,
              }}
            >
              {allTechnologies.slice(0, 10).map((tech) => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    border: "1.5px solid",
                    borderColor:
                      activeFilter === tech ? "var(--accent)" : "var(--border)",
                    background:
                      activeFilter === tech
                        ? "var(--accent-subtle)"
                        : "var(--surface)",
                    color:
                      activeFilter === tech
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    fontSize: "0.8rem",
                    fontWeight: activeFilter === tech ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {tech}
                </button>
              ))}
            </div>

            {/* Result count */}
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Projects content */}
      <section className="section">
        <div className="container">

          {/* Empty state */}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--text-muted)",
              }}
            >
              <Layers size={48} style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <h3
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                {projects.length === 0
                  ? "No projects yet"
                  : "No projects match your search"}
              </h3>
              <p style={{ fontSize: "0.95rem" }}>
                {projects.length === 0
                  ? "Projects will appear here once published from the admin dashboard."
                  : "Try adjusting your search or filter."}
              </p>
            </div>
          )}

          {/* Featured projects */}
          {featured.length > 0 && (
            <div style={{ marginBottom: "4rem" }}>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Star size={18} color="var(--accent)" />
                Featured
              </h2>
              <div className="divider" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "1.75rem",
                  marginTop: "1.5rem",
                }}
              >
                {featured.map((project) => (
                  <ProjectCard key={project.id} project={project} featured />
                ))}
              </div>
            </div>
          )}

          {/* All other projects */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <>
                  <h2
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "1.5rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    All Projects
                  </h2>
                  <div className="divider" />
                </>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                }}
              >
                {regular.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Individual project card component
function ProjectCard({
  project,
  featured = false,
}: {
  project: Project
  featured?: boolean
}) {
  return (
    <div
      className="card"
      style={{
        display: "flex",
        flexDirection: "column",
        borderColor: featured ? "var(--accent)" : undefined,
        position: "relative",
        overflow: "hidden",
        padding: 0,
      }}
    >
      {/* Project image */}
      {project.image_url && (
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            overflow: "hidden",
            background: "var(--bg-secondary)",
          }}
        >
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      {/* No image placeholder */}
      {!project.image_url && (
        <div
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: "var(--accent-subtle)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Layers size={32} color="var(--accent)" style={{ opacity: 0.5 }} />
        </div>
      )}

      {/* Card content */}
      <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Status and difficulty badges */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginBottom: "0.75rem",
          }}
        >
          {project.status && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: STATUS_COLORS[project.status] ?? "var(--text-muted)",
                background: "var(--bg-secondary)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                border: `1px solid ${STATUS_COLORS[project.status] ?? "var(--border)"}`,
              }}
            >
              {project.status}
            </span>
          )}
          {featured && (
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--accent)",
                background: "var(--accent-subtle)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
              }}
            >
              Featured
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.3rem",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          {project.title}
        </h3>

        {/* Meta: role and client */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "0.75rem",
          }}
        >
          {project.my_role && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              <User size={12} />
              {project.my_role}
            </span>
          )}
          {(project.start_date ?? project.end_date) && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              <Calendar size={12} />
              {project.start_date
                ? new Date(project.start_date).getFullYear()
                : ""}
              {project.end_date &&
              project.start_date !== project.end_date
                ? ` – ${new Date(project.end_date).getFullYear()}`
                : ""}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {project.excerpt && (
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.7,
              marginBottom: "1rem",
              flex: 1,
            }}
          >
            {project.excerpt}
          </p>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.4rem",
              marginBottom: "1.25rem",
            }}
          >
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech} className="tag">
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="tag">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Action links */}
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginTop: "auto",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
            >
              Live App
              <ExternalLink size={13} />
            </a>
          )}
          {project.showcase_url && (
            <a
              href={project.showcase_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ fontSize: "0.8rem", padding: "0.5rem 1rem" }}
            >
              Showcase
              <ArrowRight size={13} />
            </a>
          )}
          {project.repository_url && (
            <a
              href={project.repository_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "color 0.2s ease",
                marginLeft: "auto",
              }}
            >
              <GitBranch size={13} />
              Code
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
