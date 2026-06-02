// components/GiscusComments.tsx
// Giscus comments component for blog posts
// Uses GitHub Discussions as the comment backend
// Automatically adapts to the current site theme

"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

const GISCUS_REPO          = "EmmanuelAbolade/emmanuel-abolade"
const GISCUS_REPO_ID       = "R_kgDOSqL6Mw"
const GISCUS_CATEGORY      = "Announcements"
const GISCUS_CATEGORY_ID   = "DIC_kwDOSqL6M84C-UaD"

// Map site themes to Giscus themes
function getGiscusTheme(theme: string | undefined): string {
  switch (theme) {
    case "dark":
    case "forest":
    case "ocean":
      return "dark"
    case "rose":
    case "slate":
    case "light":
    default:
      return "light"
  }
}

export default function GiscusComments() {
  const { theme, resolvedTheme } = useTheme()
  const containerRef             = useRef<HTMLDivElement>(null)
  const currentTheme             = getGiscusTheme(resolvedTheme ?? theme)

  useEffect(() => {
    if (!containerRef.current) return

    // Remove any existing Giscus iframe
    const existing = containerRef.current.querySelector("iframe.giscus-frame")
    if (existing) existing.remove()

    // Remove existing script
    const existingScript = containerRef.current.querySelector("script[src*='giscus']")
    if (existingScript) existingScript.remove()

    // Create new Giscus script
    const script = document.createElement("script")
    script.src                           = "https://giscus.app/client.js"
    script.setAttribute("data-repo",          GISCUS_REPO)
    script.setAttribute("data-repo-id",       GISCUS_REPO_ID)
    script.setAttribute("data-category",      GISCUS_CATEGORY)
    script.setAttribute("data-category-id",   GISCUS_CATEGORY_ID)
    script.setAttribute("data-mapping",       "pathname")
    script.setAttribute("data-strict",        "0")
    script.setAttribute("data-reactions-enabled", "1")
    script.setAttribute("data-emit-metadata", "0")
    script.setAttribute("data-input-position", "top")
    script.setAttribute("data-theme",         currentTheme)
    script.setAttribute("data-lang",          "en")
    script.setAttribute("data-loading",       "lazy")
    script.crossOrigin                   = "anonymous"
    script.async                         = true

    containerRef.current.appendChild(script)
  }, [currentTheme])

  return (
    <div style={{ marginTop: "3rem" }}>
      <div style={{
        borderTop: "1px solid var(--border)",
        paddingTop: "2.5rem",
        marginBottom: "1.5rem",
      }}>
        <h2 style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "1.5rem",
          color: "var(--text-primary)",
          marginBottom: "0.4rem",
        }}>
          Comments
        </h2>
        <p style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          marginBottom: "1.5rem",
        }}>
          Comments are powered by GitHub Discussions. You need a GitHub account to comment.
        </p>
      </div>
      <div ref={containerRef} />
    </div>
  )
}
