// app/about/page.tsx
// About page - bio, skills, experience timeline, education and beyond code
// All sections are editable from /admin/site and fall back to defaults

import { createClient } from "@/lib/supabase/server"
import { getSiteData } from "@/lib/site-content-server"
import { getIcon } from "@/lib/site-icons"
import type { AboutContent, Badge, Photo } from "@/lib/site-content"
import TestimonialsSection from "@/components/TestimonialsSection"
import FloatingBadges from "@/components/FloatingBadges"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import {
  MapPin,
  Mail,
  ArrowRight,
  Download,
} from "lucide-react"

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about Emmanuel Abolade, a software developer based in Ireland focused on full-stack web development.",
}

export default async function AboutPage() {
  const supabase = await createClient()
  const [{ data: testimonials }, site] = await Promise.all([
    supabase
      .from("testimonials")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false }),
    getSiteData(),
  ])

  return (
    <div style={{ background: "var(--bg)" }}>

      {/* ── Hero section ─────────────────────────────── */}
      <section style={{
        padding: "5rem 0 4rem",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container">

          {/* Desktop: two columns */}
          <div className="about-desktop">
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "4rem",
              alignItems: "center",
            }}>
              <AboutText about={site.about} />
              <AboutPhoto photo={site.aboutPhoto} badges={site.aboutBadges} />
            </div>
          </div>

          {/* Mobile: stacked — photo first, then text */}
          <div className="about-mobile">
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "2.5rem",
            }}>
              <div style={{ width: "240px" }}>
                <AboutPhoto photo={site.aboutPhoto} badges={site.aboutBadges} compact />
              </div>
            </div>
            <AboutText about={site.about} />
          </div>
        </div>

        <style>{`
          @media (min-width: 769px) {
            .about-desktop { display: block; }
            .about-mobile  { display: none;  }
          }
          @media (max-width: 768px) {
            .about-desktop { display: none;  }
            .about-mobile  { display: block; }
          }
          .about-bio p {
            color: var(--text-secondary); line-height: 1.85;
            margin-bottom: 1.25rem; font-size: 1rem;
          }
          .about-bio p:last-child { margin-bottom: 2rem; }
          .about-bio a { color: var(--accent); text-decoration: underline; }
          .about-bio strong { color: var(--text-primary); }
          .about-bio ul, .about-bio ol { padding-left: 1.25rem; margin-bottom: 1.25rem; color: var(--text-secondary); line-height: 1.8; }
        `}</style>
      </section>

      {/* ── Skills section ────────────────────────────── */}
      {site.skillGroups.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <h2 className="section-title">Skills</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              {site.about.skills_subtitle}
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}>
              {site.skillGroups.map((group, i) => (
                <div key={`${group.category}-${i}`} className="card">
                  <h3 style={{
                    fontSize: "0.8rem", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase",
                    color: "var(--accent)", marginBottom: "1rem",
                    fontFamily: "DM Sans, sans-serif",
                  }}>
                    {group.category}
                  </h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(group.skills ?? []).map((skill) => (
                      <span key={skill} style={{
                        display: "inline-flex", alignItems: "center",
                        background: "var(--bg)", border: "1px solid var(--border)",
                        color: "var(--text-secondary)", fontSize: "0.8rem",
                        fontWeight: 500, padding: "0.25rem 0.65rem",
                        borderRadius: "0.25rem",
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Experience section ────────────────────────── */}
      {site.experience.length > 0 && (
        <section className="section" style={{ background: "var(--bg)" }}>
          <div className="container">
            <h2 className="section-title">Experience</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              {site.about.experience_subtitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px" }}>
              {site.experience.map((item, idx) => {
                const Icon = getIcon(item.icon, "briefcase")
                return (
                  <div key={`${item.role}-${idx}`} className="card" style={{ display: "flex", gap: "1.25rem" }}>
                    <div style={{
                      width: "2.5rem", height: "2.5rem", minWidth: "2.5rem",
                      background: "var(--accent-subtle)", borderRadius: "0.5rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={16} color="var(--accent)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem",
                      }}>
                        <h3 style={{
                          fontFamily: "DM Serif Display, serif",
                          fontSize: "1.1rem", color: "var(--text-primary)",
                        }}>
                          {item.role}
                        </h3>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                          {item.period}
                        </span>
                      </div>
                      <p style={{
                        fontSize: "0.875rem", color: "var(--accent)",
                        fontWeight: 600, marginBottom: "0.75rem",
                      }}>
                        {item.org}
                      </p>
                      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                        {(item.points ?? []).map((point, i) => (
                          <li key={i} style={{
                            fontSize: "0.9rem", color: "var(--text-secondary)",
                            lineHeight: 1.65, paddingLeft: "1rem", position: "relative",
                          }}>
                            <span style={{
                              position: "absolute", left: 0, top: "0.55rem",
                              width: "4px", height: "4px", borderRadius: "50%",
                              background: "var(--accent)",
                            }} />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Education section ─────────────────────────── */}
      {site.education.length > 0 && (
        <section className="section" style={{ background: "var(--bg-secondary)" }}>
          <div className="container">
            <h2 className="section-title">Education</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              {site.about.education_subtitle}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "800px" }}>
              {site.education.map((item, idx) => {
                const Icon = getIcon(item.icon, "book")
                return (
                  <div key={`${item.degree}-${idx}`} className="card" style={{ display: "flex", gap: "1.25rem" }}>
                    <div style={{
                      width: "2.5rem", height: "2.5rem", minWidth: "2.5rem",
                      background: "var(--accent-subtle)", borderRadius: "0.5rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Icon size={16} color="var(--accent)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: "flex", justifyContent: "space-between",
                        flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.25rem",
                      }}>
                        <h3 style={{
                          fontFamily: "DM Serif Display, serif",
                          fontSize: "1.1rem", color: "var(--text-primary)",
                        }}>
                          {item.degree}
                        </h3>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 500 }}>
                          {item.period}
                        </span>
                      </div>
                      <p style={{
                        fontSize: "0.875rem", color: "var(--accent)",
                        fontWeight: 600, marginBottom: "0.5rem",
                      }}>
                        {item.institution}
                      </p>
                      {item.note && (
                        <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Beyond Code section ───────────────────────── */}
      {site.beyondCode.length > 0 && (
        <section className="section" style={{ background: "var(--bg)" }}>
          <div className="container">
            <h2 className="section-title">Beyond Code</h2>
            <div className="divider" />
            <p className="section-subtitle" style={{ marginBottom: "3rem" }}>
              {site.about.beyond_subtitle}
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem", maxWidth: "900px",
            }}>
              {site.beyondCode.map((item, idx) => {
                const Icon = getIcon(item.icon, "heart")
                return (
                  <div key={`${item.title}-${idx}`} className="card">
                    <div style={{
                      width: "2.5rem", height: "2.5rem",
                      background: "var(--accent-subtle)", borderRadius: "0.5rem",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      marginBottom: "1rem",
                    }}>
                      <Icon size={16} color="var(--accent)" />
                    </div>
                    <h3 style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "0.75rem",
                    }}>
                      {item.title}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                      {item.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <TestimonialsSection testimonials={testimonials ?? []} />

      {/* ── CTA section ───────────────────────────────── */}
      <section style={{
        padding: "5rem 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div className="container" style={{ maxWidth: "560px", margin: "0 auto" }}>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            {site.about.cta_title}
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", lineHeight: 1.7 }}>
            {site.about.cta_text}
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/contact" className="btn-primary">
              <Mail size={16} />
              Get in Touch
            </Link>
            <Link href="/projects" className="btn-outline">
              View My Work
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// Extracted text side — reused in both desktop and mobile layouts
function AboutText({ about }: { about: AboutContent }) {
  const headlineLines = about.headline.split("\n")

  return (
    <div>
      {about.eyebrow && (
        <p style={{
          fontSize: "0.85rem", fontWeight: 600,
          letterSpacing: "0.1em", textTransform: "uppercase",
          color: "var(--accent)", marginBottom: "1rem",
        }}>
          {about.eyebrow}
        </p>
      )}
      {about.name && (
        <p style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "clamp(1rem, 2vw, 1.25rem)",
          color: "var(--text-muted)", marginBottom: "0.5rem",
          letterSpacing: "0.02em",
        }}>
          {about.name}
        </p>
      )}
      <h1 style={{
        fontFamily: "DM Serif Display, serif",
        fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
        lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1.5rem",
      }}>
        {headlineLines.map((line, i) => (
          <span key={i}>
            {line}
            {i < headlineLines.length - 1 && <br />}
          </span>
        ))}
      </h1>
      {about.location && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2rem",
        }}>
          <MapPin size={15} />
          {about.location}
        </div>
      )}
      <div className="about-bio" dangerouslySetInnerHTML={{ __html: about.bio }} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <Link href="/contact" className="btn-primary">
          Get in Touch <ArrowRight size={16} />
        </Link>
        <a href="/cv" className="btn-outline" download>
          <Download size={16} /> Download CV
        </a>
      </div>
    </div>
  )
}

// Photo with accent backdrop and floating badges
function AboutPhoto({
  photo,
  badges,
  compact = false,
}: {
  photo: Photo
  badges: Badge[]
  compact?: boolean
}) {
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", inset: "-1.5rem",
        background: "var(--accent-subtle)",
        borderRadius: "1rem", zIndex: 0,
      }} />
      <div style={{
        position: "relative", zIndex: 1,
        borderRadius: "0.75rem", overflow: "hidden",
        aspectRatio: "4/5",
        border: "3px solid var(--surface)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        <Image
          src={photo.url}
          alt={photo.alt || "Emmanuel Abolade"}
          fill
          sizes={compact ? "240px" : "(max-width: 768px) 100vw, 50vw"}
          style={{ objectFit: "cover", objectPosition: "top center" }}
          priority
        />
      </div>
      <FloatingBadges
        badges={badges}
        size={compact ? "sm" : "md"}
        slots={
          compact
            ? [{ bottom: "-1.5rem", left: "-1rem" }, { top: "1rem", right: "-1rem" }]
            : [
                { bottom: "-1.5rem", left: "-1.5rem" },
                { top: "2rem", right: "-1.75rem" },
                { top: "50%", left: "-2.5rem" },
              ]
        }
      />
    </div>
  )
}
