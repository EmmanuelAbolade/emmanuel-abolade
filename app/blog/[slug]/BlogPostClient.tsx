// app/blog/[slug]/BlogPostClient.tsx
// Client components for blog post page
// Exports: default (ReadingProgress), TOC (table of contents)

"use client"

import { useEffect, useState } from "react"

// Extract headings from HTML content
function extractHeadings(html: string): { id: string; text: string; level: number }[] {
  if (typeof window === "undefined") return []
  const div = document.createElement("div")
  div.innerHTML = html
  const headings = div.querySelectorAll("h2, h3")
  return Array.from(headings).map((h, i) => ({
    id:    h.id || `heading-${i}`,
    text:  h.textContent ?? "",
    level: parseInt(h.tagName[1]),
  }))
}

// Reading progress bar — fixed at top of page
export default function BlogPostClient({ content: _ }: { content: string }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const el      = document.documentElement
      const scrolled = el.scrollTop
      const total    = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      height: "3px", zIndex: 1000,
      background: "var(--border)",
    }}>
      <div style={{
        height: "100%",
        width: `${progress}%`,
        background: "var(--accent)",
        transition: "width 0.1s linear",
      }} />
    </div>
  )
}

// Table of contents — exported as named export
export function TOC({ content }: { content: string }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    const extracted = extractHeadings(content)

    // Assign IDs to DOM headings
    const article = document.querySelector(".prose-content")
    if (article) {
      const domHeadings = article.querySelectorAll("h2, h3")
      domHeadings.forEach((h, i) => {
        if (!h.id) h.id = `heading-${i}`
      })
    }

    setHeadings(extracted)
  }, [content])

  useEffect(() => {
    if (headings.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    )
    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {headings.map(({ id, text, level }) => (
          <li key={id} style={{ marginBottom: "0.1rem" }}>
            <a
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault()
                const el = document.getElementById(id)
                if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); setActiveId(id) }
              }}
              style={{
                display: "block",
                paddingLeft: level === 3 ? "1.25rem" : "0.75rem",
                paddingTop: "0.35rem",
                paddingBottom: "0.35rem",
                fontSize: level === 3 ? "0.775rem" : "0.825rem",
                color: activeId === id ? "var(--accent)" : "var(--text-muted)",
                fontWeight: activeId === id ? 600 : 400,
                textDecoration: "none",
                borderLeft: `2px solid ${activeId === id ? "var(--accent)" : "var(--border)"}`,
                lineHeight: 1.4,
                transition: "color 0.2s ease, border-color 0.2s ease",
                wordBreak: "break-word",
              }}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
