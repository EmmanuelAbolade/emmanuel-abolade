// app/HomeClient.tsx
// Home page client component
// Features: animated hero, stats strip, live featured projects, latest posts, newsletter CTA

"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useInView, animate } from "framer-motion"
import {
  ArrowRight,
  Download,
  GitBranch,
  Briefcase,
  Mail,
  ExternalLink,
  Clock,
  Calendar,
  Layers,
  BookOpen,
  Star,
} from "lucide-react"
import NewsletterForm from "@/components/NewsletterForm"

// Animated counter component
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref                   = useRef<HTMLSpanElement>(null)
  const inView                = useInView(ref, { once: true })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (inView && !started && ref.current) {
      setStarted(true)
      animate(0, to, {
        duration: 1.5,
        ease: "easeOut",
        onUpdate: (v) => {
          if (ref.current) ref.current.textContent = Math.round(v) + suffix
        },
      })
    }
  }, [inView, started, to, suffix])

  return <span ref={ref}>0{suffix}</span>
}

type Project = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  technologies: string[] | null
  status: string | null
  my_role: string | null
  live_url: string | null
  showcase_url: string | null
  featured: boolean
}

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  tags: string[] | null
  reading_time: number | null
  published_at: string | null
  created_at: string
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default function HomeClient({
  projects,
  posts,
}: {
  projects: Project[]
  posts: Post[]
}) {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
          paddingTop: "5rem",
          paddingBottom: "3rem",
        }}
      >
        {/* Background blob */}
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "-10%", right: "-5%",
            width: "600px", height: "600px", borderRadius: "50%",
            background: "var(--accent-subtle)", filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute", bottom: "10%", left: "-5%",
            width: "400px", height: "400px", borderRadius: "50%",
            background: "var(--accent-subtle)", filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "4rem",
            alignItems: "center",
          }}
            className="hero-grid"
          >
            {/* Left: text */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="tag"
                style={{ display: "inline-flex", marginBottom: "1.5rem" }}
              >
                Available for opportunities
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
                  lineHeight: 1.08, marginBottom: "1.5rem",
                  color: "var(--text-primary)",
                }}
              >
                Building digital
                <br />
                <span style={{ color: "var(--accent)" }}>experiences</span>
                <br />
                that matter.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                  fontSize: "1.1rem", color: "var(--text-secondary)",
                  lineHeight: 1.8, maxWidth: "520px", marginBottom: "2.5rem",
                }}
              >
                Software developer based in Ireland, focused on building
                clean, purposeful and user-driven digital systems. Final-year
                BSc student at SETU Carlow.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginBottom: "3rem" }}
              >
                <Link href="/projects" className="btn-primary">
                  View My Work
                  <ArrowRight size={16} />
                </Link>
                <a href="/cv.pdf" className="btn-outline" download>
                  <Download size={16} />
                  Download CV
                </a>
              </motion.div>

              {/* Social links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
              >
                <span style={{
                  fontSize: "0.78rem", color: "var(--text-muted)",
                  letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600,
                }}>
                  Find me on
                </span>
                {[
                  { href: "https://github.com/EmmanuelAbolade", icon: GitBranch, label: "GitHub" },
                  { href: "https://linkedin.com/in/emmanuel-m-abolade", icon: Briefcase, label: "LinkedIn" },
                  { href: "mailto:emab.dev.tech@gmail.com", icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <motion.a
                    key={href}
                    href={href}
                    target={href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    aria-label={label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    style={{
                      width: "2.25rem", height: "2.25rem", borderRadius: "0.375rem",
                      border: "1px solid var(--border)", background: "var(--surface)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--text-secondary)", textDecoration: "none",
                      transition: "border-color 0.2s ease, color 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)"
                      e.currentTarget.style.color = "var(--accent)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)"
                      e.currentTarget.style.color = "var(--text-secondary)"
                    }}
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            {/* Right: profile photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-photo"
              style={{ position: "relative" }}
            >
              <div style={{
                position: "absolute", inset: "-1rem",
                background: "var(--accent-subtle)",
                borderRadius: "50%", zIndex: 0,
              }} />
              <div style={{
                width: "280px", height: "280px",
                borderRadius: "50%", overflow: "hidden",
                border: "4px solid var(--surface)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                position: "relative", zIndex: 1,
              }}>
                <Image
                  src="/images/profile.jpg"
                  alt="Emmanuel Abolade"
                  fill
                  sizes="280px"
                  style={{ objectFit: "cover", objectPosition: "top center" }}
                  priority
                />
              </div>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  position: "absolute", bottom: "-0.5rem", left: "-1.5rem",
                  zIndex: 2, background: "var(--surface)",
                  border: "1px solid var(--border)", borderRadius: "0.75rem",
                  padding: "0.65rem 1rem",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                }}
              >
                <p style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginBottom: "0.1rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Based in
                </p>
                <p style={{ fontFamily: "DM Serif Display, serif", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                  Ireland
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) {
            .hero-grid {
              grid-template-columns: 1fr !important;
              text-align: center;
            }
            .hero-photo {
              display: flex !important;
              justify-content: center;
              order: -1;
              margin-bottom: 1rem;
            }
            .hero-photo > div:last-child {
              width: 180px !important;
              height: 180px !important;
            }
            .hero-photo > div:first-child {
              inset: -0.75rem !important;
            }
          }
        `}</style>
      </section>

      {/* ── Stats strip ──────────────────────────────── */}
      <section style={{
        padding: "3rem 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "2rem",
          }}>
            {[
              { value: 3, suffix: "+", label: "Years building" },
              { value: 10, suffix: "+", label: "Projects shipped" },
              { value: 15, suffix: "+", label: "Technologies used" },
              { value: 100, suffix: "%", label: "Passion for code" },
            ].map(({ value, suffix, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                style={{ textAlign: "center" }}
              >
                <p style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "2.5rem", color: "var(--accent)",
                  lineHeight: 1, marginBottom: "0.35rem",
                }}>
                  <Counter to={value} suffix={suffix} />
                </p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
                  {label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              display: "flex", alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap", gap: "1rem", marginBottom: "3rem",
            }}
          >
            <div>
              <p style={{
                fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem",
              }}>
                Selected Work
              </p>
              <h2 className="section-title">Featured Projects</h2>
              <div className="divider" />
              <p className="section-subtitle">
                A curated selection of what I have built.
              </p>
            </div>
            <Link href="/projects" className="btn-outline" style={{ whiteSpace: "nowrap" }}>
              All Projects <ArrowRight size={15} />
            </Link>
          </motion.div>

          {projects.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "3rem",
              color: "var(--text-muted)", fontSize: "0.9rem",
            }}>
              Projects will appear here once published and featured in the admin dashboard.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "1.75rem",
            }}>
              {projects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Latest Posts ──────────────────────────────── */}
      {posts.length > 0 && (
        <section className="section" style={{
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
        }}>
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex", alignItems: "flex-end",
                justifyContent: "space-between",
                flexWrap: "wrap", gap: "1rem", marginBottom: "3rem",
              }}
            >
              <div>
                <p style={{
                  fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem",
                }}>
                  Writing
                </p>
                <h2 className="section-title">Latest Articles</h2>
                <div className="divider" />
                <p className="section-subtitle">
                  Thoughts on software, learning and building things.
                </p>
              </div>
              <Link href="/blog" className="btn-outline" style={{ whiteSpace: "nowrap" }}>
                All Articles <ArrowRight size={15} />
              </Link>
            </motion.div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                >
                  <PostRow post={post} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter CTA ────────────────────────────── */}
      <section style={{
        padding: "5rem 0",
        background: "var(--bg)",
        borderTop: "1px solid var(--border)",
      }}>
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            style={{
              maxWidth: "560px", margin: "0 auto", textAlign: "center",
            }}
          >
            <h2 className="section-title" style={{ marginBottom: "1rem" }}>
              Stay in the loop
            </h2>
            <p style={{
              color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7,
            }}>
              Get notified when I publish new articles, projects, or resources.
              No spam — ever.
            </p>
            <NewsletterForm />
            <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Unsubscribe anytime. No spam.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  )
}

// Project card for homepage
function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        animate={{
          y: hovered ? -5 : 0,
          boxShadow: hovered
            ? "0 16px 40px rgba(0,0,0,0.1)"
            : "0 2px 8px rgba(0,0,0,0.04)",
        }}
        transition={{ duration: 0.25 }}
        style={{
          background: "var(--surface)",
          border: `1.5px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "1rem", overflow: "hidden",
          display: "flex", flexDirection: "column",
          transition: "border-color 0.2s ease",
        }}
      >
        {/* Image */}
        <div style={{
          position: "relative", aspectRatio: "16/9",
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
                sizes="(max-width: 768px) 100vw, 400px"
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, var(--accent-subtle), var(--bg-secondary))",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Layers size={36} color="var(--accent)" style={{ opacity: 0.35 }} />
            </div>
          )}

          {/* Hover overlay with links */}
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
                display: "flex", alignItems: "flex-end", padding: "1rem", gap: "0.5rem",
              }}
            >
              {project.live_url && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  background: "var(--accent)", color: "var(--bg)",
                  padding: "0.3rem 0.75rem", borderRadius: "999px",
                  fontSize: "0.72rem", fontWeight: 700,
                }}>
                  <ExternalLink size={10} /> Live App
                </span>
              )}
              {project.showcase_url && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "0.3rem",
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  padding: "0.3rem 0.75rem", borderRadius: "999px",
                  fontSize: "0.72rem", fontWeight: 700,
                  backdropFilter: "blur(4px)",
                }}>
                  <ArrowRight size={10} /> Showcase
                </span>
              )}
            </motion.div>
          )}

          {/* Featured badge */}
          <div style={{
            position: "absolute", top: "0.75rem", left: "0.75rem",
            background: "var(--accent)", color: "var(--bg)",
            padding: "0.2rem 0.6rem", borderRadius: "999px",
            fontSize: "0.68rem", fontWeight: 700,
            letterSpacing: "0.05em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "0.25rem",
          }}>
            <Star size={9} fill="var(--bg)" /> Featured
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "1.25rem" }}>
          <h3 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.2rem", color: "var(--text-primary)",
            marginBottom: "0.5rem", lineHeight: 1.25,
          }}>
            {project.title}
          </h3>
          {project.excerpt && (
            <p style={{
              color: "var(--text-secondary)", fontSize: "0.875rem",
              lineHeight: 1.65, marginBottom: "1rem",
            }}>
              {project.excerpt.length > 120
                ? project.excerpt.slice(0, 120) + "..."
                : project.excerpt}
            </p>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }}>
              {project.technologies.slice(0, 4).map((tech) => (
                <span key={tech} className="tag">{tech}</span>
              ))}
            </div>
          )}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.35rem",
            color: "var(--accent)", fontSize: "0.82rem", fontWeight: 600,
          }}>
            View Project
            <motion.span animate={{ x: hovered ? 4 : 0 }} transition={{ duration: 0.2 }}>
              <ArrowRight size={13} />
            </motion.span>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

// Compact horizontal post row for homepage
function PostRow({ post }: { post: Post }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        style={{
          display: "flex", alignItems: "center", gap: "1.25rem",
          background: "var(--surface)",
          border: `1.5px solid ${hovered ? "var(--accent)" : "var(--border)"}`,
          borderRadius: "0.75rem", padding: "1.25rem",
          transition: "border-color 0.2s ease",
          cursor: "pointer",
        }}
      >
        {/* Cover image thumbnail */}
        {post.cover_image && (
          <div style={{
            width: "72px", height: "72px", minWidth: "72px",
            borderRadius: "0.5rem", overflow: "hidden",
            background: "var(--bg-secondary)", position: "relative",
          }}>
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="72px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* No image: icon placeholder */}
        {!post.cover_image && (
          <div style={{
            width: "72px", height: "72px", minWidth: "72px",
            borderRadius: "0.5rem",
            background: "linear-gradient(135deg, var(--accent-subtle), var(--bg-secondary))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={22} color="var(--accent)" style={{ opacity: 0.5 }} />
          </div>
        )}

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.05rem", color: "var(--text-primary)",
            marginBottom: "0.3rem", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p style={{
              color: "var(--text-secondary)", fontSize: "0.825rem",
              lineHeight: 1.6, marginBottom: "0.5rem",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {post.excerpt}
            </p>
          )}
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            {(post.published_at ?? post.created_at) && (
              <span style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.75rem", color: "var(--text-muted)",
              }}>
                <Calendar size={10} />
                {formatDate(post.published_at ?? post.created_at)}
              </span>
            )}
            {post.reading_time && (
              <span style={{
                display: "flex", alignItems: "center", gap: "0.3rem",
                fontSize: "0.75rem", color: "var(--text-muted)",
              }}>
                <Clock size={10} />
                {post.reading_time} min read
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <motion.div
          animate={{ x: hovered ? 4 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: "var(--accent)", flexShrink: 0 }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </motion.div>
    </Link>
  )
}
