// components/Footer.tsx
// Site-wide footer with navigation links and social icons

import Link from "next/link"
import { GitBranch, Briefcase, Mail, Code2 } from "lucide-react"

const FOOTER_LINKS = [
  { href: "/about",     label: "About"     },
  { href: "/projects",  label: "Projects"  },
  { href: "/blog",      label: "Blog"      },
  { href: "/resources", label: "Resources" },
  { href: "/contact",   label: "Contact"   },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--bg-secondary)",
        padding: "3rem 0 2rem",
        marginTop: "auto",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  width: "1.75rem",
                  height: "1.75rem",
                  background: "var(--accent)",
                  borderRadius: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Code2 size={13} color="var(--bg)" />
              </div>
              <span
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1rem",
                  color: "var(--text-primary)",
                }}
              >
                Emmanuel<span style={{ color: "var(--accent)" }}>.</span>
              </span>
            </Link>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                maxWidth: "220px",
              }}
            >
              Software developer based in Ireland. Building thoughtful digital experiences.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Navigation
            </h4>
            <ul
              style={{
                listStyle: "none",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.9rem",
                      textDecoration: "none",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4
              style={{
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "1rem",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Connect
            </h4>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <a
                href="https://github.com/EmmanuelAbolade"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                <GitBranch size={15} />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/emmanuel-abolade"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                <Briefcase size={15} />
                LinkedIn
              </a>
              <a
                href="mailto:emab.dev.tech@gmail.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "var(--text-secondary)",
                  fontSize: "0.9rem",
                  textDecoration: "none",
                }}
              >
                <Mail size={15} />
                Email
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            &copy; {year} Emmanuel Abolade. All rights reserved.
          </p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
            Built with Next.js &amp; Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
