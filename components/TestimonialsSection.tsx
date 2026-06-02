// components/TestimonialsSection.tsx
// Public testimonials section - displays published testimonials
// Used on the About page and optionally the home page

"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

type Testimonial = {
  id: string
  name: string
  role: string | null
  company: string | null
  avatar_url: string | null
  content: string
  rating: number | null
  project: string | null
}

function StarRating({ rating }: { rating: number | null }) {
  const stars = rating ?? 5
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "1rem" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          color="#f59e0b"
          fill={i < stars ? "#f59e0b" : "none"}
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection({
  testimonials,
}: {
  testimonials: Testimonial[]
}) {
  if (testimonials.length === 0) return null

  return (
    <section className="section" style={{ background: "var(--bg-secondary)", borderTop: "1px solid var(--border)" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          style={{ marginBottom: "3rem" }}
        >
          <p style={{
            fontSize: "0.8rem", fontWeight: 600, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.5rem",
          }}>
            Kind Words
          </p>
          <h2 className="section-title">What People Say</h2>
          <div className="divider" />
          <p className="section-subtitle">
            Feedback from people I have worked with and built for.
          </p>
        </motion.div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}>
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card"
              style={{ position: "relative", overflow: "hidden" }}
            >
              {/* Quote icon */}
              <Quote
                size={48}
                color="var(--accent)"
                style={{
                  position: "absolute", top: "1rem", right: "1rem",
                  opacity: 0.08,
                }}
              />

              <StarRating rating={t.rating} />

              {/* Content */}
              <p style={{
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                fontSize: "0.95rem",
                fontStyle: "italic",
                marginBottom: "1.5rem",
              }}>
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Project badge */}
              {t.project && (
                <div style={{ marginBottom: "1.25rem" }}>
                  <span className="tag" style={{ fontSize: "0.72rem" }}>
                    {t.project}
                  </span>
                </div>
              )}

              {/* Author */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                paddingTop: "1rem", borderTop: "1px solid var(--border)",
              }}>
                {t.avatar_url ? (
                  <div style={{
                    width: "2.5rem", height: "2.5rem", minWidth: "2.5rem",
                    borderRadius: "50%", overflow: "hidden",
                    border: "2px solid var(--border)",
                    position: "relative",
                  }}>
                    <Image
                      src={t.avatar_url}
                      alt={t.name}
                      fill
                      sizes="40px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: "2.5rem", height: "2.5rem", minWidth: "2.5rem",
                    borderRadius: "50%",
                    background: "var(--accent-subtle)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "1rem", color: "var(--accent)", fontWeight: 600,
                    border: "2px solid var(--border)",
                  }}>
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div style={{ minWidth: 0 }}>
                  <p style={{
                    fontWeight: 700, color: "var(--text-primary)",
                    fontSize: "0.9rem", marginBottom: "0.1rem",
                  }}>
                    {t.name}
                  </p>
                  {(t.role || t.company) && (
                    <p style={{
                      fontSize: "0.78rem", color: "var(--text-muted)",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {[t.role, t.company].filter(Boolean).join(" at ")}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
