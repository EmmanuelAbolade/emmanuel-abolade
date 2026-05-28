// app/blog/BlogClient.tsx
// Client component for Blog page - handles search, tag filtering, and post card display

"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Search,
  Clock,
  Star,
  BookOpen,
  Tag,
  Calendar,
} from "lucide-react"

// Type definition for a blog post record from Supabase
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
    month: "short",
    year: "numeric",
  })
}

export default function BlogClient({ posts }: { posts: Post[] }) {
  const [search, setSearch]       = useState("")
  const [activeTag, setActiveTag] = useState(ALL_FILTER)

  // Collect all unique tags across all posts
  const allTags = useMemo(() => {
    const set = new Set<string>()
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)))
    return [ALL_FILTER, ...Array.from(set).sort()]
  }, [posts])

  // Filter posts by search and tag
  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        search.trim() === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        (p.excerpt ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (p.tags ?? []).some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        )
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
      <section
        style={{
          padding: "5rem 0 3rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            Writing
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Blog
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "560px",
              lineHeight: 1.7,
            }}
          >
            Thoughts on software development, machine learning, productivity,
            and building things that matter.
          </p>
        </div>
      </section>

      {/* Search and filter bar */}
      <section
        style={{
          padding: "2rem 0",
          background: "var(--bg-secondary)",
          borderBottom: "1px solid var(--border)",
          position: "sticky",
          top: "4rem",
          zIndex: 10,
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              alignItems: "center",
            }}
          >
            {/* Search input */}
            <div
              style={{
                position: "relative",
                flex: 1,
                minWidth: "220px",
                maxWidth: "340px",
              }}
            >
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "0.85rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-muted)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  paddingLeft: "2.25rem",
                  paddingRight: "1rem",
                  paddingTop: "0.6rem",
                  paddingBottom: "0.6rem",
                  borderRadius: "0.375rem",
                  border: "1.5px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "0.9rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Tag filter pills */}
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", flex: 1 }}
            >
              {allTags.slice(0, 10).map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  style={{
                    padding: "0.35rem 0.85rem",
                    borderRadius: "999px",
                    border: "1.5px solid",
                    borderColor:
                      activeTag === tag ? "var(--accent)" : "var(--border)",
                    background:
                      activeTag === tag
                        ? "var(--accent-subtle)"
                        : "var(--surface)",
                    color:
                      activeTag === tag
                        ? "var(--accent)"
                        : "var(--text-secondary)",
                    fontSize: "0.8rem",
                    fontWeight: activeTag === tag ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  {tag !== ALL_FILTER && <Tag size={11} />}
                  {tag}
                </button>
              ))}
            </div>

            {/* Result count */}
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                whiteSpace: "nowrap",
              }}
            >
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
            <div
              style={{
                textAlign: "center",
                padding: "5rem 0",
                color: "var(--text-muted)",
              }}
            >
              <BookOpen
                size={48}
                style={{ margin: "0 auto 1rem", opacity: 0.4 }}
              />
              <h3
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-secondary)",
                  marginBottom: "0.5rem",
                }}
              >
                {posts.length === 0
                  ? "No articles yet"
                  : "No articles match your search"}
              </h3>
              <p style={{ fontSize: "0.95rem" }}>
                {posts.length === 0
                  ? "Articles will appear here once published from the admin dashboard."
                  : "Try adjusting your search or tag filter."}
              </p>
            </div>
          )}

          {/* Featured posts */}
          {featured.length > 0 && (
            <div style={{ marginBottom: "4rem" }}>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Star size={18} color="var(--accent)" />
                Featured
              </h2>
              <div className="divider" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
                  gap: "1.75rem",
                  marginTop: "1.5rem",
                }}
              >
                {featured.map((post) => (
                  <PostCard key={post.id} post={post} featured />
                ))}
              </div>
            </div>
          )}

          {/* All other posts */}
          {regular.length > 0 && (
            <div>
              {featured.length > 0 && (
                <>
                  <h2
                    style={{
                      fontFamily: "DM Serif Display, serif",
                      fontSize: "1.5rem",
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    All Articles
                  </h2>
                  <div className="divider" />
                </>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                }}
              >
                {regular.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// Individual post card component
function PostCard({
  post,
  featured = false,
}: {
  post: Post
  featured?: boolean
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        className="card"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          padding: 0,
          borderColor: featured ? "var(--accent)" : undefined,
          cursor: "pointer",
        }}
      >
        {/* Cover image */}
        {post.cover_image && !post.hide_cover_image && (
          <div
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              overflow: "hidden",
              background: "var(--bg-secondary)",
            }}
          >
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}

        {/* No image placeholder — only shows if no image and not hidden */}
        {!post.cover_image && !post.hide_cover_image && (
          <div
            style={{
              width: "100%",
              aspectRatio: "16/9",
              background: "var(--accent-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BookOpen
              size={28}
              color="var(--accent)"
              style={{ opacity: 0.5 }}
            />
          </div>
        )}

        {/* Card content */}
        <div
          style={{
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Featured badge */}
          {featured && (
            <span
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--accent)",
                background: "var(--accent-subtle)",
                padding: "0.2rem 0.6rem",
                borderRadius: "999px",
                marginBottom: "0.75rem",
              }}
            >
              Featured
            </span>
          )}

          {/* Title */}
          <h3
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.2rem",
              color: "var(--text-primary)",
              marginBottom: "0.65rem",
              lineHeight: 1.3,
            }}
          >
            {post.title}
          </h3>

          {/* Meta: date and reading time */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            {(post.published_at ?? post.created_at) && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <Calendar size={12} />
                {formatDate(post.published_at ?? post.created_at)}
              </span>
            )}
            {post.reading_time && (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                <Clock size={12} />
                {post.reading_time} min read
              </span>
            )}
          </div>

          {/* Excerpt */}
          {post.excerpt && (
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
                marginBottom: "1rem",
                flex: 1,
              }}
            >
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.4rem",
                marginTop: "auto",
              }}
            >
              {post.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
              {post.tags.length > 4 && (
                <span className="tag">+{post.tags.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
