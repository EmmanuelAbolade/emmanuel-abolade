// components/Navbar.tsx
// Site-wide navigation with theme switcher and mobile menu

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import {
  Menu,
  X,
  Sun,
  Moon,
  Palette,
  Code2,
} from "lucide-react"

const NAV_LINKS = [
  { href: "/",          label: "Home"      },
  { href: "/about",     label: "About"     },
  { href: "/projects",  label: "Projects"  },
  { href: "/blog",      label: "Blog"      },
  { href: "/resources", label: "Resources" },
  { href: "/contact",   label: "Contact"   },
]

const THEMES = [
  { value: "light",  label: "Light"  },
  { value: "dark",   label: "Dark"   },
  { value: "forest", label: "Forest" },
  { value: "ocean",  label: "Ocean"  },
  { value: "rose",   label: "Rose"   },
  { value: "slate",  label: "Slate"  },
]

export default function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [menuOpen, setMenuOpen]       = useState(false)
  const [themeOpen, setThemeOpen]     = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [mounted, setMounted]         = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close menus when route changes
  useEffect(() => {
    setMenuOpen(false)
    setThemeOpen(false)
  }, [pathname])

  const isDark = theme === "dark" || theme === "forest" || theme === "ocean"

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: scrolled ? "var(--surface)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.3s ease",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem" }}>

        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
          <div style={{
            width: "2rem", height: "2rem",
            background: "var(--accent)",
            borderRadius: "0.375rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Code2 size={16} color="var(--bg)" />
          </div>
          <span style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.1rem", color: "var(--text-primary)", fontWeight: 400 }}>
            Emmanuel<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.4rem 0.85rem",
                borderRadius: "0.375rem",
                fontSize: "0.9rem",
                fontWeight: 500,
                color: pathname === link.href ? "var(--accent)" : "var(--text-secondary)",
                backgroundColor: pathname === link.href ? "var(--accent-subtle)" : "transparent",
                transition: "all 0.2s ease",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>

          {/* Theme picker */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setThemeOpen(!themeOpen)}
              aria-label="Switch theme"
              style={{
                width: "2.25rem", height: "2.25rem",
                borderRadius: "0.375rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)",
                transition: "all 0.2s ease",
              }}
            >
              {mounted && isDark ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {themeOpen && (
              <div style={{
                position: "absolute",
                top: "calc(100% + 0.5rem)",
                right: 0,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "0.5rem",
                padding: "0.5rem",
                minWidth: "9rem",
                boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                zIndex: 200,
              }}>
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => { setTheme(t.value); setThemeOpen(false) }}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.375rem",
                      border: "none",
                      background: theme === t.value ? "var(--accent-subtle)" : "transparent",
                      color: theme === t.value ? "var(--accent)" : "var(--text-secondary)",
                      cursor: "pointer",
                      fontSize: "0.875rem",
                      fontWeight: theme === t.value ? 600 : 400,
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Palette size={13} />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="mobile-menu-btn"
            style={{
              width: "2.25rem", height: "2.25rem",
              borderRadius: "0.375rem",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              cursor: "pointer",
              display: "none",
              alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
          padding: "1rem 1.5rem",
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: "block",
                padding: "0.75rem 0",
                borderBottom: "1px solid var(--border)",
                color: pathname === link.href ? "var(--accent)" : "var(--text-primary)",
                fontWeight: pathname === link.href ? 600 : 400,
                textDecoration: "none",
                fontSize: "1rem",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </header>
  )
}