// app/search/SearchClient.tsx
// Client component for global search page
// Searches projects, posts and resources simultaneously via Supabase

"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  X,
  FolderOpen,
  FileText,
  BookMarked,
  ArrowRight,
  Clock,
  Loader,
  Layers,
} from "lucide-react"

type ProjectResult = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  technologies: string[] | null
  status: string | null
}

type PostResult = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
  tags: string[] | null
  reading_time: number | null
  published_at: string | null
}

type ResourceResult = {
  id: string
  title: string
  url: string
  description: string | null
  resource_type: string | null
  pricing_model: string | null
  logo_url: string | null
}

type Results = {
  projects: ProjectResult[]
  posts:     PostResult[]
  resources: ResourceResult[]
}

const EMPTY: Results = { projects: [], posts: [], resources: [] }

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

export default function SearchClient() {
  const router                        = useRouter()
  const searchParams                  = useSearchParams()
  const initialQuery                  = searchParams.get("q") ?? ""

  const [query, setQuery]             = useState(initialQuery)
  const [results, setResults]         = useState<Results>(EMPTY)
  const [loading, setLoading]         = useState(false)
  const [searched, setSearched]       = useState(false)
  const [activeTab, setActiveTab]     = useState<"all" | "projects" | "posts" | "resources">("all")
  const inputRef                      = useRef<HTMLInputElement>(null)
  const debouncedQuery                = useDebounce(query.trim(), 350)

  const totalResults =
    results.projects.length + results.posts.length + results.resources.length

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults(EMPTY)
      setSearched(false)
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Run all three queries in parallel
    const [
      { data: projects },
      { data: posts },
      { data: resources },
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("id, title, slug, excerpt, image_url, technologies, status")
        .eq("published", true)
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,description.ilike.%${q}%`)
        .limit(6),

      supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, tags, reading_time, published_at")
        .eq("status", "published")
        .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
        .limit(6),

      supabase
        .from("resources")
        .select("id, title, url, description, resource_type, pricing_model, logo_url")
        .eq("published", true)
        .or(`title.ilike.%${q}%,description.ilike.%${q}%,my_take.ilike.%${q}%`)
        .limit(6),
    ])

    setResults({
      projects:  projects  ?? [],
      posts:     posts     ?? [],
      resources: resources ?? [],
    })
    setSearched(true)
    setLoading(false)

    // Update URL without navigation
    const url = new URL(window.location.href)
    url.searchParams.set("q", q)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  useEffect(() => {
    search(debouncedQuery)
  }, [debouncedQuery, search])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function handleClear() {
    setQuery("")
    setResults(EMPTY)
    setSearched(false)
    router.replace("/search", { scroll: false })
    inputRef.current?.focus()
  }

  // Filtered results based on active tab
  const shown = {
    projects:  activeTab === "all" || activeTab === "projects" ? results.projects : [],
    posts:     activeTab === "all" || activeTab === "posts"    ? results.posts    : [],
    resources: activeTab === "all" || activeTab === "resources"? results.resources: [],
  }

  const tabs = [
    { key: "all",       label: "All",       count: totalResults                    },
    { key: "projects",  label: "Projects",  count: results.projects.length  },
    { key: "posts",     label: "Articles",  count: results.posts.length     },
    { key: "resources", label: "Resources", count: results.resources.length },
  ] as const

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Search header */}
      <section style={{
        padding: "5rem 0 3rem",
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container" style={{ maxWidth: "720px" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p style={{
              fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "var(--accent)", marginBottom: "1rem",
            }}>
              Search
            </p>
            <h1 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--text-primary)", marginBottom: "2rem",
            }}>
              Find anything
            </h1>

            {/* Search input */}
            <div style={{ position: "relative" }}>
              <Search size={20} style={{
                position: "absolute", left: "1.1rem", top: "50%",
                transform: "translateY(-50%)",
                color: loading ? "var(--accent)" : "var(--text-muted)",
                pointerEvents: "none", transition: "color 0.2s ease",
              }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects, articles, resources..."
                style={{
                  width: "100%",
                  paddingLeft: "3rem",
                  paddingRight: query ? "3rem" : "1.5rem",
                  paddingTop: "1rem",
                  paddingBottom: "1rem",
                  fontSize: "1.1rem",
                  borderRadius: "0.75rem",
                  border: "2px solid",
                  borderColor: query ? "var(--accent)" : "var(--border)",
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  boxShadow: query ? "0 0 0 4px var(--accent-subtle)" : "none",
                  fontFamily: "DM Sans, sans-serif",
                }}
              />
              {loading && (
                <Loader
                  size={18}
                  style={{
                    position: "absolute", right: "1.1rem", top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--accent)",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              )}
              {query && !loading && (
                <button
                  onClick={handleClear}
                  style={{
                    position: "absolute", right: "1.1rem", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-muted)", display: "flex", alignItems: "center",
                    padding: "0.25rem", borderRadius: "0.25rem",
                    transition: "color 0.2s ease",
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Query summary */}
            {searched && !loading && (
              <p style={{
                marginTop: "0.75rem", fontSize: "0.875rem", color: "var(--text-muted)",
              }}>
                {totalResults === 0
                  ? `No results for "${debouncedQuery}"`
                  : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${debouncedQuery}"`}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Results */}
      <section style={{ padding: "2.5rem 0 5rem" }}>
        <div className="container" style={{ maxWidth: "720px" }}>

          {/* Tabs — only show when there are results */}
          <AnimatePresence>
            {searched && totalResults > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{
                  display: "flex", gap: "0.4rem",
                  flexWrap: "wrap", marginBottom: "2rem",
                }}
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    style={{
                      padding: "0.35rem 0.85rem",
                      borderRadius: "999px",
                      border: "1.5px solid",
                      borderColor: activeTab === tab.key ? "var(--accent)" : "var(--border)",
                      background: activeTab === tab.key ? "var(--accent-subtle)" : "var(--surface)",
                      color: activeTab === tab.key ? "var(--accent)" : "var(--text-secondary)",
                      fontSize: "0.82rem",
                      fontWeight: activeTab === tab.key ? 600 : 400,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "flex", alignItems: "center", gap: "0.4rem",
                    }}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span style={{
                        background: activeTab === tab.key ? "var(--accent)" : "var(--bg-secondary)",
                        color: activeTab === tab.key ? "var(--bg)" : "var(--text-muted)",
                        borderRadius: "999px", fontSize: "0.7rem",
                        padding: "0.05rem 0.4rem", fontWeight: 700,
                      }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty / idle state */}
          {!searched && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", paddingTop: "3rem", color: "var(--text-muted)" }}
            >
              <Search size={48} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
              <p style={{ fontSize: "1rem", color: "var(--text-secondary)" }}>
                Start typing to search across all content.
              </p>
              <p style={{ fontSize: "0.875rem", marginTop: "0.4rem" }}>
                Projects, articles and resources all in one place.
              </p>
            </motion.div>
          )}

          {/* No results */}
          {searched && !loading && totalResults === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", paddingTop: "3rem", color: "var(--text-muted)" }}
            >
              <Search size={48} style={{ margin: "0 auto 1rem", opacity: 0.2 }} />
              <h3 style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "1.4rem", color: "var(--text-secondary)", marginBottom: "0.5rem",
              }}>
                No results found
              </h3>
              <p style={{ fontSize: "0.9rem" }}>
                Try different keywords or check the spelling.
              </p>
            </motion.div>
          )}

          {/* Results sections */}
          <AnimatePresence mode="wait">
            {searched && totalResults > 0 && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}
              >
                {/* Projects */}
                {shown.projects.length > 0 && (
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      marginBottom: "1rem",
                    }}>
                      <FolderOpen size={16} color="var(--accent)" />
                      <h2 style={{
                        fontFamily: "DM Serif Display, serif",
                        fontSize: "1.2rem", color: "var(--text-primary)",
                      }}>
                        Projects
                      </h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {shown.projects.map((p) => (
                        <ProjectResultCard key={p.id} project={p} query={debouncedQuery} />
                      ))}
                    </div>
                    {activeTab === "all" && results.projects.length >= 6 && (
                      <Link
                        href="/projects"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.35rem",
                          marginTop: "0.75rem", fontSize: "0.85rem",
                          color: "var(--accent)", textDecoration: "none", fontWeight: 600,
                        }}
                      >
                        View all projects <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                )}

                {/* Posts */}
                {shown.posts.length > 0 && (
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      marginBottom: "1rem",
                    }}>
                      <FileText size={16} color="var(--accent)" />
                      <h2 style={{
                        fontFamily: "DM Serif Display, serif",
                        fontSize: "1.2rem", color: "var(--text-primary)",
                      }}>
                        Articles
                      </h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {shown.posts.map((p) => (
                        <PostResultCard key={p.id} post={p} query={debouncedQuery} />
                      ))}
                    </div>
                    {activeTab === "all" && results.posts.length >= 6 && (
                      <Link
                        href="/blog"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.35rem",
                          marginTop: "0.75rem", fontSize: "0.85rem",
                          color: "var(--accent)", textDecoration: "none", fontWeight: 600,
                        }}
                      >
                        View all articles <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                )}

                {/* Resources */}
                {shown.resources.length > 0 && (
                  <div>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "0.5rem",
                      marginBottom: "1rem",
                    }}>
                      <BookMarked size={16} color="var(--accent)" />
                      <h2 style={{
                        fontFamily: "DM Serif Display, serif",
                        fontSize: "1.2rem", color: "var(--text-primary)",
                      }}>
                        Resources
                      </h2>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {shown.resources.map((r) => (
                        <ResourceResultCard key={r.id} resource={r} query={debouncedQuery} />
                      ))}
                    </div>
                    {activeTab === "all" && results.resources.length >= 6 && (
                      <Link
                        href="/resources"
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.35rem",
                          marginTop: "0.75rem", fontSize: "0.85rem",
                          color: "var(--accent)", textDecoration: "none", fontWeight: 600,
                        }}
                      >
                        View all resources <ArrowRight size={13} />
                      </Link>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

// Highlight matching text
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query || !text) return <>{text}</>
  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            style={{
              background: "var(--accent-subtle)",
              color: "var(--accent)",
              borderRadius: "0.15rem",
              padding: "0 0.1rem",
            }}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

function ProjectResultCard({ project, query }: { project: ProjectResult; query: string }) {
  return (
    <Link href={`/projects/${project.slug}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          display: "flex", gap: "1rem", alignItems: "center",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{
          width: "3.5rem", height: "3.5rem", minWidth: "3.5rem",
          borderRadius: "0.5rem", overflow: "hidden",
          background: "var(--bg-secondary)", position: "relative",
        }}>
          {project.image_url ? (
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              sizes="56px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "var(--accent-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Layers size={18} color="var(--accent)" style={{ opacity: 0.5 }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
            <Highlight text={project.title} query={query} />
          </p>
          {project.excerpt && (
            <p style={{
              fontSize: "0.825rem", color: "var(--text-secondary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              <Highlight text={project.excerpt} query={query} />
            </p>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div style={{ display: "flex", gap: "0.35rem", marginTop: "0.35rem", flexWrap: "wrap" }}>
              {project.technologies.slice(0, 4).map((t) => (
                <span key={t} className="tag" style={{ fontSize: "0.7rem" }}>{t}</span>
              ))}
            </div>
          )}
        </div>
        <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>
    </Link>
  )
}

function PostResultCard({ post, query }: { post: PostResult; query: string }) {
  return (
    <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
      <div
        className="card"
        style={{
          display: "flex", gap: "1rem", alignItems: "center",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{
          width: "3.5rem", height: "3.5rem", minWidth: "3.5rem",
          borderRadius: "0.5rem", overflow: "hidden",
          background: "var(--bg-secondary)", position: "relative",
        }}>
          {post.cover_image ? (
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="56px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "var(--accent-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <FileText size={18} color="var(--accent)" style={{ opacity: 0.5 }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
            <Highlight text={post.title} query={query} />
          </p>
          {post.excerpt && (
            <p style={{
              fontSize: "0.825rem", color: "var(--text-secondary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              <Highlight text={post.excerpt} query={query} />
            </p>
          )}
          {post.reading_time && (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "0.25rem",
              fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.35rem",
            }}>
              <Clock size={10} /> {post.reading_time} min read
            </span>
          )}
        </div>
        <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>
    </Link>
  )
}

function ResourceResultCard({ resource, query }: { resource: ResourceResult; query: string }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div
        className="card"
        style={{
          display: "flex", gap: "1rem", alignItems: "center",
          padding: "1rem 1.25rem",
        }}
      >
        <div style={{
          width: "3.5rem", height: "3.5rem", minWidth: "3.5rem",
          borderRadius: "0.5rem", overflow: "hidden",
          background: "var(--bg-secondary)", position: "relative",
          border: "1px solid var(--border)",
        }}>
          {resource.logo_url ? (
            <Image
              src={resource.logo_url}
              alt={resource.title}
              fill
              sizes="56px"
              style={{ objectFit: "contain", padding: "6px" }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "var(--accent-subtle)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BookMarked size={18} color="var(--accent)" style={{ opacity: 0.5 }} />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.95rem", marginBottom: "0.2rem" }}>
            <Highlight text={resource.title} query={query} />
          </p>
          {resource.description && (
            <p style={{
              fontSize: "0.825rem", color: "var(--text-secondary)",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              <Highlight text={resource.description} query={query} />
            </p>
          )}
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.35rem" }}>
            {resource.resource_type && (
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                {resource.resource_type}
              </span>
            )}
            {resource.pricing_model && (
              <span style={{
                fontSize: "0.7rem", fontWeight: 600,
                color: resource.pricing_model === "Free" ? "#16a34a" : "var(--text-muted)",
              }}>
                {resource.pricing_model}
              </span>
            )}
          </div>
        </div>
        <ArrowRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>
    </a>
  )
}
