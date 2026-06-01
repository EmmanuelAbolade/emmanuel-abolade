// app/projects/ProjectsClient.tsx
// Client component for Projects page
// Features: animated cards, dynamic search with suggestions, filter pills, featured section

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  ExternalLink,
  GitBranch,
  ArrowRight,
  Search,
  Star,
  Layers,
  Calendar,
  User,
  X,
} from "lucide-react"

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
  Completed:     "var(--accent)",
  "In Progress": "#f59e0b",
  Maintained:    "#3b82f6",
  Archived:      "var(--text-muted)",
}

const ALL_FILTER = "All"

// Dynamic search with suggestions
function SearchBox({
  value,
  onChange,
  suggestions,
  onSelectSuggestion,
}: {
  value: string
  onChange: (v: string) => void
  suggestions: string[]
  onSelectSuggestion: (v: string) => void
}) {
  const [open, setOpen]     = useState(false)
  const wrapperRef          = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [])

  const showSuggestions = open && value.length >= 2 && suggestions.length > 0

  return (
    <div ref={wrapperRef} style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "380px" }}>
      <Search
        size={15}
        style={{
          position: "absolute",
          left: "0.85rem",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-muted)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
      <input
        type="text"
        placeholder="Search projects..."
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Escape") { setOpen(false) } }}
        style={{
          width: "100%",
          paddingLeft: "2.25rem",
          paddingRight: value ? "2.25rem" : "1rem",
          paddingTop: "0.65rem",
          paddingBottom: "0.65rem",
          borderRadius: "0.5rem",
          border: "1.5px solid var(--border)",
          background: "var(--surface)",
          color: "var(--text-primary)",
          fontSize: "0.9rem",
          outline: "none",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          boxShadow: open ? "0 0 0 3px var(--accent-subtle)" : "none",
          borderColor: open ? "var(--accent)" : "var(--border)",
        }}
      />
      {value && (
        <button
          onClick={() => { onChange(""); setOpen(false) }}
          style={{
            position: "absolute",
            right: "0.75rem",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            display: "flex",
            alignItems: "center",
            padding: 0,
          }}
        >
          <X size={14} />
        </button>
      )}

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute",
              top: "calc(100% + 0.4rem)",
              left: 0,
              right: 0,
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.5rem",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 50,
              overflow: "hidden",
              maxHeight: "240px",
              overflowY: "auto",
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { onSelectSuggestion(s); setOpen(false) }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  width: "100%",
                  padding: "0.65rem 1rem",
                  background: "none",
                  border: "none",
                  borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-secondary)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none" }}
              >
                <Search size={12} color="var(--text-muted)" />
                <span dangerouslySetInnerHTML={{
                  __html: s.replace(
                    new RegExp(`(${value})`, "gi"),
                    `<strong style="color:var(--accent)">$1</strong>`
                  ),
                }} />
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [search, setSearch]       = useState("")
  const [activeFilter, setFilter] = useState(ALL_FILTER)

  // All unique technologies for filter pills
  const allTechnologies = useMemo(() => {
    const set = new Set<string>()
    projects.forEach((p) => p.technologies?.forEach((t) => set.add(t)))
    return [ALL_FILTER, ...Array.from(set).sort()]
  }, [projects])

  // Dynamic search suggestions — titles and technologies matching input
  const suggestions = useMemo(() => {
    if (search.trim().length < 2) return []
    const q     = search.toLowerCase()
    const hits  = new Set<string>()
    projects.forEach((p) => {
      if (p.title.toLowerCase().includes(q)) hits.add(p.title)
      p.technologies?.forEach((t) => {
        if (t.toLowerCase().includes(q)) hits.add(t)
      })
    })
    return Array.from(hits).slice(0, 6)
  }, [projects, search])

  // Filtered projects
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.technologies ?? []).some((t) => t.toLowerCase().includes(q))
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
          padding: "5rem 0 4rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-30%", right: "-5%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "var(--accent-subtle)", filter: "blur(80px)",
          opacity: 0.5, pointerEvents: "none",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p style={{
              fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem",
            }}>
              My Work
            </p>
            <h1 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-primary)", marginBottom: "1.25rem", lineHeight: 1.1,
            }}>
              Projects
            </h1>
            <p style={{
              color: "var(--text-secondary)", fontSize: "1.1rem",
              maxWidth: "520px", lineHeight: 1.75,
            }}>
              A curated collection of systems, applications and experiments —
              each one a story of problem-solving, learning and craft.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and filter bar */}
      <section style={{
        padding: "1.5rem 0",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        position: "sticky", top: "4rem", zIndex: 40,
      }}>
        <div className="container">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <SearchBox
              value={search}
              onChange={setSearch}
              suggestions={suggestions}
              onSelectSuggestion={setSearch}
            />

            {/* Filter pills */}
            <div style={{
              display: "flex",
              gap: "0.4rem",
              flex: 1,
              overflowX: "auto",
              paddingBottom: "2px",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}>
              {allTechnologies.slice(0, 8).map((tech) => (
                <button
                  key={tech}
                  onClick={() => setFilter(tech)}
                  style={{
                    padding: "0.3rem 0.85rem",
                    borderRadius: "999px",
                    border: "1.5px solid",
                    borderColor: activeFilter === tech ? "var(--accent)" : "var(--border)",
                    background: activeFilter === tech ? "var(--accent-subtle)" : "var(--surface)",
                    color: activeFilter === tech ? "var(--accent)" : "var(--text-secondary)",
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

            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)" }}
            >
              <Layers size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <h3 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.5rem", color: "var(--text-secondary)", marginBottom: "0.5rem" }}>
                {projects.length === 0 ? "No projects yet" : "No projects match your search"}
              </h3>
              <p style={{ fontSize: "0.95rem" }}>
                {projects.length === 0
                  ? "Projects will appear here once published from the admin dashboard."
                  : "Try a different search or filter."}
              </p>
            </motion.div>
          )}

          {/* Featured projects */}
          {featured.length > 0 && (
            <div style={{ marginBottom: "4rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <Star size={18} color="var(--accent)" fill="var(--accent)" />
                <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.5rem", color: "var(--text-primary)" }}>
                  Featured
                </h2>
              </div>
              <div className="divider" />
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                gap: "2rem", marginTop: "1.75rem",
              }}>
                {featured.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <ProjectCard project={project} featured />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All other projects */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <>
                  <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    All Projects
                  </h2>
                  <div className="divider" />
                </>
              )}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.75rem", marginTop: "1.75rem",
              }}>
                {regular.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          y: hovered ? -6 : 0,
          boxShadow: hovered
            ? "0 20px 48px rgba(0,0,0,0.12)"
            : "0 2px 8px rgba(0,0,0,0.04)",
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: "var(--surface)",
          border: `1.5px solid ${featured || hovered ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "1rem",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
          transition: "border-color 0.2s ease",
        }}
      >
        {/* Image */}
        <div style={{
          position: "relative", width: "100%", aspectRatio: "16/9",
          overflow: "hidden", background: "var(--bg-secondary)",
        }}>
          {project.image_url ? (
            <motion.div
              style={{ width: "100%", height: "100%", position: "relative" }}
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-secondary) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Layers size={40} color="var(--accent)" style={{ opacity: 0.4 }} />
            </div>
          )}

          {/* Overlay on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)",
                  display: "flex", alignItems: "flex-end", padding: "1rem",
                  gap: "0.5rem",
                }}
              >
                {project.live_url && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    background: "var(--accent)", color: "var(--bg)",
                    padding: "0.3rem 0.75rem", borderRadius: "999px",
                    fontSize: "0.75rem", fontWeight: 600,
                  }}>
                    <ExternalLink size={11} /> Live App
                  </span>
                )}
                {project.showcase_url && (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                    background: "rgba(255,255,255,0.15)", color: "#fff",
                    padding: "0.3rem 0.75rem", borderRadius: "999px",
                    fontSize: "0.75rem", fontWeight: 600,
                    backdropFilter: "blur(4px)",
                  }}>
                    <ArrowRight size={11} /> Showcase
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured badge */}
          {featured && (
            <div style={{
              position: "absolute", top: "0.75rem", left: "0.75rem",
              background: "var(--accent)", color: "var(--bg)",
              padding: "0.2rem 0.65rem", borderRadius: "999px",
              fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.05em", textTransform: "uppercase",
            }}>
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>

          {/* Status badge */}
          {project.status && (
            <span style={{
              display: "inline-flex", alignSelf: "flex-start",
              fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: STATUS_COLORS[project.status] ?? "var(--text-muted)",
              marginBottom: "0.65rem",
            }}>
              {project.status}
            </span>
          )}

          {/* Title */}
          <h3 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: featured ? "1.5rem" : "1.25rem",
            color: "var(--text-primary)", marginBottom: "0.5rem",
            lineHeight: 1.25, transition: "color 0.2s ease",
          }}>
            {project.title}
          </h3>

          {/* Meta */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", marginBottom: "0.85rem" }}>
            {project.my_role && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <User size={11} />{project.my_role}
              </span>
            )}
            {(project.start_date ?? project.end_date) && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                <Calendar size={11} />
                {project.start_date ? new Date(project.start_date).getFullYear() : ""}
                {project.end_date && project.start_date !== project.end_date
                  ? ` – ${new Date(project.end_date).getFullYear()}` : ""}
              </span>
            )}
          </div>

          {/* Excerpt */}
          {project.excerpt && (
            <p style={{
              color: "var(--text-secondary)", fontSize: "0.875rem",
              lineHeight: 1.7, marginBottom: "1.25rem", flex: 1,
            }}>
              {project.excerpt}
            </p>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "auto" }}>
              {project.technologies.slice(0, 4).map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
              {project.technologies.length > 4 && (
                <span className="tag">+{project.technologies.length - 4}</span>
              )}
            </div>
          )}

          {/* Read more */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.4rem",
            marginTop: "1.25rem", paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
            color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600,
          }}>
            View Project
            <motion.span animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight size={14} />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
