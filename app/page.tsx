// app/page.tsx
// Home page - hero, skills strip, featured projects, newsletter CTA

"use client"

import Link from "next/link"
import { ArrowRight, Download, GitBranch, Briefcase, Mail } from "lucide-react"

const PROJECTS = [
  {
    title: "news2signal",
    description:
      "NLP-based financial news-to-market-signal tool with Streamlit dashboard. Processes financial headlines into actionable trading signals.",
    tags: ["Python", "NLP", "Streamlit", "scikit-learn"],
    url: "https://github.com/EmmanuelAbolade",
  },
  {
    title: "NetGuard",
    description:
      "Multi-model ML cybersecurity portfolio featuring SVM, KNN, K-Means and ANN models trained on real-world datasets, deployed on Streamlit Cloud.",
    tags: ["Machine Learning", "Python", "SVM", "Cybersecurity"],
    url: "https://github.com/EmmanuelAbolade",
  },
  {
    title: "This Website",
    description:
      "A full-stack personal website with blog, projects, resources, admin dashboard, newsletter and authentication. Built with Next.js and Supabase.",
    tags: ["Next.js", "Supabase", "TypeScript", "Tailwind"],
    url: "#",
  },
]

const SKILLS = [
  "Next.js", "TypeScript", "React", "Python",
  "Supabase", "PostgreSQL", "Machine Learning",
  "Tailwind CSS", "Java", "PHP",
]

const socialLinkStyle = {
  width: "2.25rem",
  height: "2.25rem",
  borderRadius: "0.375rem",
  border: "1px solid var(--border)",
  background: "var(--surface)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "var(--text-secondary)",
  transition: "all 0.2s ease",
  textDecoration: "none",
}

export default function HomePage() {
  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
  }

  return (
    <>
      {/* Hero Section */}
      <section
        style={{
          minHeight: "calc(100vh - 4rem)",
          display: "flex",
          alignItems: "center",
          background: "var(--bg)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-20%",
            right: "-10%",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "var(--accent-subtle)",
            filter: "blur(80px)",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ maxWidth: "680px" }}>
            <span
              className="tag animate-fade-in-up"
              style={{ marginBottom: "1.5rem", display: "inline-flex" }}
            >
              Available for opportunities
            </span>

            <h1
              className="animate-fade-in-up delay-1"
              style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "clamp(2.75rem, 6vw, 4.5rem)",
                lineHeight: 1.1,
                marginBottom: "1.5rem",
                color: "var(--text-primary)",
              }}
            >
              Building digital
              <br />
              <span style={{ color: "var(--accent)" }}>experiences</span>
              <br />
              that matter.
            </h1>

            <p
              className="animate-fade-in-up delay-2"
              style={{
                fontSize: "1.15rem",
                color: "var(--text-secondary)",
                marginBottom: "2.5rem",
                lineHeight: 1.8,
                maxWidth: "520px",
              }}
            >
              I am a software developer based in Ireland, specialising in
              full-stack web development and machine learning. Final-year BSc
              student at SETU Carlow.
            </p>

            <div
              className="animate-fade-in-up delay-3"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                marginBottom: "3rem",
              }}
            >
              <Link href="/projects" className="btn-primary">
                View My Work
                <ArrowRight size={16} />
              </Link>
              <a
                href="/cv.pdf"
                className="btn-outline"
                download={true}
              >
                <Download size={16} />
                Download CV
              </a>
            </div>

            {/* Social links */}
            <div
              className="animate-fade-in-up delay-4"
              style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}
            >
              <span
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Find me on
              </span>
              <a
                href="https://github.com/EmmanuelAbolade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                style={socialLinkStyle}
              >
                <GitBranch size={16} />
              </a>
              <a
                href="https://linkedin.com/in/emmanuel-abolade"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={socialLinkStyle}
              >
                <Briefcase size={16} />
              </a>
              <a
                href="mailto:emab.dev.tech@gmail.com"
                aria-label="Email"
                style={socialLinkStyle}
              >
                <Mail size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Strip */}
      <section
        style={{
          padding: "3rem 0",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            {SKILLS.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <h2 className="section-title">Featured Projects</h2>
              <div className="divider" />
              <p className="section-subtitle">
                A selection of work I am proud of.
              </p>
            </div>
            <Link
              href="/projects"
              className="btn-outline"
              style={{ whiteSpace: "nowrap" }}
            >
              All Projects <ArrowRight size={15} />
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {PROJECTS.map((project) => (
              <div key={project.title} className="card">
                <h3
                  style={{
                    fontFamily: "DM Serif Display, serif",
                    fontSize: "1.4rem",
                    marginBottom: "0.75rem",
                    color: "var(--text-primary)",
                  }}
                >
                  {project.title}
                </h3>
                <p
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.9rem",
                    lineHeight: 1.7,
                    marginBottom: "1.25rem",
                  }}
                >
                  {project.description}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    color: "var(--accent)",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  View Project <ArrowRight size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        style={{
          padding: "5rem 0",
          background: "var(--bg-secondary)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{
            textAlign: "center",
            maxWidth: "560px",
            margin: "0 auto",
          }}
        >
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>
            Stay in the loop
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: "2rem",
              lineHeight: 1.7,
            }}
          >
            Get notified when I publish new articles, projects, or resources.
            No spam — ever.
          </p>
          <form
            onSubmit={handleSubscribe}
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <input
              type="email"
              placeholder="your@email.com"
              required
              style={{
                flex: 1,
                minWidth: "220px",
                padding: "0.75rem 1rem",
                borderRadius: "0.375rem",
                border: "1.5px solid var(--border)",
                background: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                outline: "none",
              }}
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            Unsubscribe anytime. No spam.
          </p>
        </div>
      </section>
    </>
  )
}
