// app/blog/BlogClient.tsx
// Client component for Blog page
// Features: animated cards, dynamic search with suggestions, editorial card design

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Clock,
  Star,
  BookOpen,
  Calendar,
  ArrowRight,
  X,
  Tag,
} from "lucide-react"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  hide_cover_image: boolean
  tags: string[] | null
  category_id: string | null
  status: string
  featured: boolean
  reading_time: number | null
  pinned_order: number | null
  layout_style: string | null
  published_at: string | null
  created_at: string
}

const ALL_FILTER = "All"

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

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
  const [open, setOpen]   = useState(false)
  const wrapperRef        = useRef<HTMLDivElement>(null)

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
      <Search size={15} style={{
        position: "absolute", left: "0.85rem", top: "50%",
        transform: "translateY(-50%)", color: "var(--text-muted)",
        pointerEvents: "none", zIndex: 1,
      }} />
      <input
        type="text"
        placeholder="Search articles..."
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Escape") setOpen(false) }}
        style={{
          width: "100%",
          paddingLeft: "2.25rem",
          paddingRight: value ? "2.25rem" : "1rem",
          paddingTop: "0.65rem",
          paddingBottom: "0.65rem",
          borderRadius: "0.5rem",
          border: "1.5px solid",
          borderColor: open ? "var(--accent)" : "var(--border)",
          background: "var(--surface)",
          color: "var(--text-primary)",
          fontSize: "0.9rem",
          outline: "none",
          boxShadow: open ? "0 0 0 3px var(--accent-subtle)" : "none",
          transition: "all 0.2s ease",
        }}
      />
      {value && (
        <button
          onClick={() => { onChange(""); setOpen(false) }}
          style={{
            position: "absolute", right: "0.75rem", top: "50%",
            transform: "translateY(-50%)", background: "none",
            border: "none", cursor: "pointer", color: "var(--text-muted)",
            display: "flex", alignItems: "center", padding: 0,
          }}
        >
          <X size={14} />
        </button>
      )}

      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            style={{
              position: "absolute", top: "calc(100% + 0.4rem)",
              left: 0, right: 0,
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "0.5rem", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              zIndex: 50, overflow: "hidden", maxHeight: "240px", overflowY: "auto",
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { onSelectSuggestion(s); setOpen(false) }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  width: "100%", padding: "0.65rem 1rem",
                  background: "none", border: "none",
                  borderBottom: i < suggestions.length - 1 ? "1px solid var(--border)" : "none",
                  color: "var(--text-primary)", fontSize: "0.875rem",
                  cursor: "pointer", textAlign: "left",
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

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [search, setSearch]     = useState("")
  const [activeTag, setActiveTag] = useState(ALL_FILTER)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return [ALL_FILTER, ...Array.from(set).sort()]
  }, [posts])

  const suggestions = useMemo(() => {
    if (search.trim().length < 2) return []
    const q    = search.toLowerCase()
    const hits = new Set<string>()
    posts.forEach((p) => {
      if (p.title.toLowerCase().includes(q)) hits.add(p.title)
      p.tags?.forEach((t) => { if (t.toLowerCase().includes(q)) hits.add(t) })
    })
    return Array.from(hits).slice(0, 6)
  }, [posts, search])

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const q = search.trim().toLowerCase()
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.excerpt ?? "").toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      const matchesTag =
        activeTag === ALL_FILTER || (p.tags ?? []).includes(activeTag)
      return matchesSearch && matchesTag
    })
  }, [posts, search, activeTag])

  const featured = filtered.filter((p) => p.featured)
  const regular  = filtered.filter((p) => !p.featured)

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Page header */}
      <section style={{
        padding: "5rem 0 4rem", background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-20%", right: "-5%",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "var(--accent-subtle)", filter: "blur(80px)",
          opacity: 0.5, pointerEvents: "none",
        }} />
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p style={{
              fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem",
            }}>
              Writing
            </p>
            <h1 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              color: "var(--text-primary)", marginBottom: "1.25rem", lineHeight: 1.1,
            }}>
              Blog
            </h1>
            <p style={{
              color: "var(--text-secondary)", fontSize: "1.1rem",
              maxWidth: "520px", lineHeight: 1.75,
            }}>
              Thoughts on software development, machine learning, productivity
              and building things that matter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and filter */}
      <section style={{
        padding: "1.5rem 0", background: "var(--bg-secondary)",
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
            <div style={{
              display: "flex", gap: "0.4rem", flex: 1,
              overflowX: "auto", paddingBottom: "2px",
              scrollbarWidth: "none",
            }}>
              {allTags.slice(0, 8).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: "0.3rem 0.85rem", borderRadius: "999px",
                    border: "1.5px solid",
                    borderColor: activeTag === tag ? "var(--accent)" : "var(--border)",
                    background: activeTag === tag ? "var(--accent-subtle)" : "var(--surface)",
                    color: activeTag === tag ? "var(--accent)" : "var(--text-secondary)",
                    fontSize: "0.8rem", fontWeight: activeTag === tag ? 600 : 400,
                    cursor: "pointer", transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
              {filtered.length} article{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </section>

      {/* Blog content */}
      <section className="section">
        <div className="container">

          {/* Empty state */}
          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", padding: "5rem 0", color: "var(--text-muted)" }}
            >
              <BookOpen size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <h3 style={{
                fontFamily: "DM Serif Display, serif", fontSize: "1.5rem",
                color: "var(--text-secondary)", marginBottom: "0.5rem",
              }}>
                {posts.length === 0 ? "No articles yet" : "No articles match your search"}
              </h3>
              <p style={{ fontSize: "0.95rem" }}>
                {posts.length === 0
                  ? "Articles will appear here once published from the admin dashboard."
                  : "Try a different search or tag."}
              </p>
            </motion.div>
          )}

          {/* Featured posts — large hero cards */}
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
                {featured.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <PostCard post={post} featured />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* All posts */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <>
                  <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                    All Articles
                  </h2>
                  <div className="divider" />
                </>
              )}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "1.75rem", marginTop: "1.75rem",
              }}>
                {regular.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                  >
                    <PostCard post={post} />
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

function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  const [hovered, setHovered] = useState(false)

  // Truncate excerpt to a generous length to draw readers in
  const excerpt = post.excerpt
    ? post.excerpt.length > 160
      ? post.excerpt.slice(0, 160) + "..."
      : post.excerpt
    : null

  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
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
        {/* Cover image */}
        {post.cover_image && !post.hide_cover_image && (
          <div style={{
            position: "relative", width: "100%",
            aspectRatio: featured ? "2/1" : "16/9",
            overflow: "hidden", background: "var(--bg-secondary)",
          }}>
            <motion.div
              style={{ width: "100%", height: "100%", position: "relative" }}
              animate={{ scale: hovered ? 1.03 : 1 }}
              transition={{ duration: 0.35 }}
            >
              <Image
                src={post.cover_image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
                priority={featured}
              />
            </motion.div>
            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%)",
            }} />
          </div>
        )}

        {/* No image placeholder */}
        {(!post.cover_image || post.hide_cover_image) && (
          <div style={{
            width: "100%", aspectRatio: "16/9",
            background: "linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-secondary) 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <BookOpen size={32} color="var(--accent)" style={{ opacity: 0.35 }} />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>

          {/* Featured badge */}
          {featured && (
            <span style={{
              display: "inline-flex", alignSelf: "flex-start",
              alignItems: "center", gap: "0.3rem",
              fontSize: "0.7rem", fontWeight: 700,
              letterSpacing: "0.05em", textTransform: "uppercase",
              color: "var(--accent)", background: "var(--accent-subtle)",
              padding: "0.2rem 0.65rem", borderRadius: "999px",
              marginBottom: "0.85rem",
            }}>
              <Star size={10} fill="var(--accent)" />
              Featured
            </span>
          )}

          {/* Title */}
          <h3 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: featured ? "1.45rem" : "1.2rem",
            color: "var(--text-primary)",
            lineHeight: 1.3,
            marginBottom: "0.75rem",
            transition: "color 0.2s ease",
          }}>
            {post.title}
          </h3>

          {/* Excerpt — the hook */}
          {excerpt && (
            <p style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
              lineHeight: 1.75,
              marginBottom: "1.25rem",
              flex: 1,
            }}>
              {excerpt}
            </p>
          )}

          {/* Bottom meta row */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
            paddingTop: "1rem",
            borderTop: "1px solid var(--border)",
            marginTop: "auto",
          }}>
            {/* Date and reading time */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              {(post.published_at ?? post.created_at) && (
                <span style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  fontSize: "0.78rem", color: "var(--text-muted)",
                }}>
                  <Calendar size={11} />
                  {formatDate(post.published_at ?? post.created_at)}
                </span>
              )}
              {post.reading_time && (
                <span style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  fontSize: "0.78rem", color: "var(--text-muted)",
                }}>
                  <Clock size={11} />
                  {post.reading_time} min read
                </span>
              )}
            </div>

            {/* Read more */}
            <div style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              color: "var(--accent)", fontSize: "0.82rem", fontWeight: 600,
            }}>
              Read more
              <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.2 }}>
                <ArrowRight size={13} />
              </motion.span>
            </div>
          </div>

          {/* Tags — subtle, below the fold */}
          {post.tags && post.tags.length > 0 && (
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "0.35rem",
              marginTop: "0.85rem",
            }}>
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{
                  display: "inline-flex", alignItems: "center", gap: "0.25rem",
                  fontSize: "0.7rem", color: "var(--text-muted)",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  padding: "0.15rem 0.5rem", borderRadius: "999px",
                }}>
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
