// app/projects/[slug]/ProjectDetail.tsx
// Client component for individual project detail page
// Features: animated entrance, full project info, achievements, learnings, related projects

"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  GitBranch,
  ArrowRight,
  Calendar,
  User,
  Briefcase,
  Star,
  BookOpen,
  CheckCircle,
  Layers,
  Trophy,
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

type RelatedProject = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  technologies: string[] | null
  status: string | null
}

const STATUS_COLORS: Record<string, string> = {
  Completed:     "var(--accent)",
  "In Progress": "#f59e0b",
  Maintained:    "#3b82f6",
  Archived:      "var(--text-muted)",
}

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner:     "#22c55e",
  Intermediate: "#f59e0b",
  Advanced:     "#ef4444",
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-IE", {
    month: "long",
    year: "numeric",
  })
}

export default function ProjectDetail({
  project,
  related,
}: {
  project: Project
  related: RelatedProject[]
}) {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Hero image */}
      {project.image_url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            width: "100%",
            height: "400px",
            overflow: "hidden",
            background: "var(--bg-secondary)",
          }}
        >
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, transparent 30%, var(--bg) 100%)",
          }} />
        </motion.div>
      )}

      <div className="container" style={{ maxWidth: "960px", padding: "0 1.5rem" }}>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          style={{ paddingTop: project.image_url ? "2rem" : "5rem" }}
        >
          <Link
            href="/projects"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              color: "var(--text-muted)", fontSize: "0.875rem",
              textDecoration: "none", marginBottom: "2rem",
              transition: "color 0.2s ease",
            }}
          >
            <ArrowLeft size={15} />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ marginBottom: "3rem" }}
        >
          {/* Status and difficulty */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
            {project.status && (
              <span style={{
                fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: STATUS_COLORS[project.status] ?? "var(--text-muted)",
                background: "var(--bg-secondary)",
                padding: "0.25rem 0.75rem", borderRadius: "999px",
                border: `1px solid ${STATUS_COLORS[project.status] ?? "var(--border)"}`,
              }}>
                {project.status}
              </span>
            )}
            {project.difficulty_level && (
              <span style={{
                fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: DIFFICULTY_COLORS[project.difficulty_level] ?? "var(--text-muted)",
                background: "var(--bg-secondary)",
                padding: "0.25rem 0.75rem", borderRadius: "999px",
                border: `1px solid ${DIFFICULTY_COLORS[project.difficulty_level] ?? "var(--border)"}`,
              }}>
                {project.difficulty_level}
              </span>
            )}
            {project.featured && (
              <span style={{
                fontSize: "0.75rem", fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                color: "var(--accent)", background: "var(--accent-subtle)",
                padding: "0.25rem 0.75rem", borderRadius: "999px",
                display: "inline-flex", alignItems: "center", gap: "0.3rem",
              }}>
                <Star size={11} fill="var(--accent)" /> Featured
              </span>
            )}
          </div>

          <h1 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "var(--text-primary)", lineHeight: 1.1,
            marginBottom: "1.25rem",
          }}>
            {project.title}
          </h1>

          {project.excerpt && (
            <p style={{
              fontSize: "1.15rem", color: "var(--text-secondary)",
              lineHeight: 1.75, maxWidth: "680px", marginBottom: "2rem",
            }}>
              {project.excerpt}
            </p>
          )}

          {/* Action buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ExternalLink size={15} />
                Live App
              </a>
            )}
            {project.showcase_url && (
              <a
                href={project.showcase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                View Showcase
                <ArrowRight size={15} />
              </a>
            )}
            {project.repository_url && (
              <a
                href={project.repository_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <GitBranch size={15} />
                Source Code
              </a>
            )}
          </div>
        </motion.div>

        {/* Main content grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: "3rem",
          marginBottom: "4rem",
          alignItems: "start",
        }}
          className="project-detail-grid"
        >
          {/* Left: main content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Description */}
            {project.description && (
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem", color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}>
                  About this project
                </h2>
                <div className="divider" />
                <p style={{
                  color: "var(--text-secondary)", lineHeight: 1.85,
                  fontSize: "1rem", whiteSpace: "pre-wrap",
                }}>
                  {project.description}
                </p>
              </div>
            )}

            {/* Key achievements */}
            {project.key_achievements && project.key_achievements.length > 0 && (
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem", color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <Trophy size={20} color="var(--accent)" />
                  Key Achievements
                </h2>
                <div className="divider" />
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {project.key_achievements.map((achievement, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                      style={{
                        display: "flex", alignItems: "flex-start",
                        gap: "0.75rem", fontSize: "0.95rem",
                        color: "var(--text-secondary)", lineHeight: 1.65,
                      }}
                    >
                      <CheckCircle
                        size={16}
                        color="var(--accent)"
                        style={{ marginTop: "0.2rem", flexShrink: 0 }}
                      />
                      {achievement}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learnings */}
            {project.learnings && (
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem", color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <BookOpen size={20} color="var(--accent)" />
                  What I Learned
                </h2>
                <div className="divider" />
                <div style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderLeft: "3px solid var(--accent)",
                  borderRadius: "0 0.5rem 0.5rem 0",
                  padding: "1.25rem 1.5rem",
                }}>
                  <p style={{
                    color: "var(--text-secondary)", lineHeight: 1.85,
                    fontSize: "0.975rem", whiteSpace: "pre-wrap",
                  }}>
                    {project.learnings}
                  </p>
                </div>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div>
                <h2 style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem", color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  <Layers size={20} color="var(--accent)" />
                  Technologies Used
                </h2>
                <div className="divider" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {project.technologies.map((tech) => (
                    <motion.span
                      key={tech}
                      whileHover={{ scale: 1.05 }}
                      className="tag"
                      style={{ fontSize: "0.875rem", padding: "0.35rem 0.9rem" }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: project info sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              padding: "1.5rem",
              position: "sticky",
              top: "6rem",
            }}
          >
            <h3 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.1rem", color: "var(--text-primary)",
              marginBottom: "1.25rem",
            }}>
              Project Info
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {project.my_role && (
                <InfoRow icon={User} label="My Role" value={project.my_role} />
              )}
              {project.client && (
                <InfoRow icon={Briefcase} label="Built For" value={project.client} />
              )}
              {project.start_date && (
                <InfoRow
                  icon={Calendar}
                  label="Timeline"
                  value={`${formatDate(project.start_date)}${project.end_date ? ` – ${formatDate(project.end_date)}` : " – Present"}`}
                />
              )}
              {project.status && (
                <div>
                  <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                    Status
                  </p>
                  <span style={{
                    fontSize: "0.8rem", fontWeight: 600,
                    color: STATUS_COLORS[project.status] ?? "var(--text-muted)",
                  }}>
                    {project.status}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related projects */}
        {related.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: "3rem",
              paddingBottom: "4rem",
            }}
          >
            <h2 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.75rem", color: "var(--text-primary)",
              marginBottom: "0.5rem",
            }}>
              More Projects
            </h2>
            <div className="divider" />
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem", marginTop: "1.5rem",
            }}>
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    className="card"
                    style={{ padding: 0, overflow: "hidden" }}
                  >
                    {p.image_url ? (
                      <div style={{
                        position: "relative", aspectRatio: "16/9",
                        overflow: "hidden", background: "var(--bg-secondary)",
                      }}>
                        <Image
                          src={p.image_url}
                          alt={p.title}
                          fill
                          sizes="300px"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ) : (
                      <div style={{
                        aspectRatio: "16/9",
                        background: "linear-gradient(135deg, var(--accent-subtle), var(--bg-secondary))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <Layers size={28} color="var(--accent)" style={{ opacity: 0.4 }} />
                      </div>
                    )}
                    <div style={{ padding: "1.25rem" }}>
                      <h3 style={{
                        fontFamily: "DM Serif Display, serif",
                        fontSize: "1.1rem", color: "var(--text-primary)",
                        marginBottom: "0.4rem",
                      }}>
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p style={{
                          fontSize: "0.825rem", color: "var(--text-secondary)",
                          lineHeight: 1.6,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {p.excerpt}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .project-detail-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div>
      <p style={{
        fontSize: "0.72rem", fontWeight: 700,
        color: "var(--text-muted)", textTransform: "uppercase",
        letterSpacing: "0.06em", marginBottom: "0.25rem",
        display: "flex", alignItems: "center", gap: "0.35rem",
      }}>
        <Icon size={11} />
        {label}
      </p>
      <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", lineHeight: 1.5 }}>
        {value}
      </p>
    </div>
  )
}
