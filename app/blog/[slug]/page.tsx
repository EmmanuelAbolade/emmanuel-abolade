// app/blog/[slug]/page.tsx
// Individual blog post page
// Features: reading progress bar, table of contents, improved typography, gallery, author card, related posts
// Layout styles (chosen per post in the admin):
//   standard   — cover banner, article + table of contents sidebar
//   minimal    — no cover, single narrow centred column, distraction-free
//   case_study — summary header with key facts, framed cover, numbered sections
//   hero_image — full-screen cover with the title over the image (falls back to standard without a cover)

import GiscusComments from "@/components/GiscusComments"
import ImageGallery from "@/components/ImageGallery"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Clock, Calendar, ArrowLeft, Tag, ArrowRight } from "lucide-react"
import { generatePostMetadata } from "@/lib/seo"
import { getAuthor } from "@/lib/site-content-server"
import type { AuthorContent } from "@/lib/site-content"
import BlogPostClient, { TOC } from "./BlogPostClient"

type Props = {
  params: Promise<{ slug: string }>
}

type Layout = "standard" | "minimal" | "case_study" | "hero_image"

type Post = {
  title: string
  excerpt: string | null
  content: string | null
  cover_image: string | null
  hide_cover_image: boolean | null
  tags: string[] | null
  reading_time: number | null
  published_at: string | null
  created_at: string | null
  allow_comments: boolean | null
  show_table_of_contents: boolean | null
  layout_style: string | null
  gallery?: string[] | null
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric", month: "long", year: "numeric",
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase  = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image, slug, published_at, tags, reading_time")
    .eq("slug", slug)
    .single()
  if (!post) return { title: "Post Not Found" }
  return generatePostMetadata(post)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const supabase  = await createClient()

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !data) notFound()
  const post = data as Post

  const [{ data: relatedPosts }, author] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, reading_time, published_at, tags")
      .eq("status", "published")
      .neq("slug", slug)
      .limit(3),
    getAuthor(),
  ])

  const hasCover = !!post.cover_image && !post.hide_cover_image
  let layout: Layout = (["standard", "minimal", "case_study", "hero_image"] as const)
    .find((l) => l === post.layout_style) ?? "standard"
  if (layout === "hero_image" && !hasCover) layout = "standard"

  const showToc = post.show_table_of_contents !== false && layout !== "minimal"

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      <BlogPostClient content={post.content ?? ""} />

      {layout === "hero_image" && <HeroHeader post={post} author={author} />}

      {layout === "case_study" && <CaseStudyHeader post={post} hasCover={hasCover} />}

      {layout === "standard" && hasCover && (
        <div style={{
          position: "relative", width: "100%",
          height: "clamp(280px, 40vh, 480px)",
          overflow: "hidden", background: "var(--bg-secondary)",
        }}>
          <Image src={post.cover_image!} alt={post.title} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, var(--bg) 100%)" }} />
        </div>
      )}

      <div
        className={showToc ? "post-layout" : undefined}
        style={{
          maxWidth: showToc ? "1100px" : layout === "minimal" ? "720px" : "820px",
          margin: "0 auto", padding: "0 1.5rem",
          display: "grid", gridTemplateColumns: showToc ? "1fr 220px" : "1fr",
          gap: "4rem", alignItems: "start",
        }}
      >
        <article style={{ padding: layout === "minimal" ? "6rem 0 4rem" : "3rem 0 4rem", minWidth: 0 }}>

          {layout === "standard" && <StandardHeader post={post} author={author} />}
          {layout === "minimal" && <MinimalHeader post={post} />}

          <div
            className={`prose-content${layout === "case_study" ? " case-study-content" : ""}`}
            style={{
              color: "var(--text-secondary)",
              lineHeight: layout === "minimal" ? 1.95 : 1.9,
              fontSize: layout === "minimal" ? "1.125rem" : "1.075rem",
            }}
            dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
          />
          {(post.gallery?.length ?? 0) > 0 && <ImageGallery images={post.gallery!} title={post.title} />}

          {layout === "minimal" && post.tags && post.tags.length > 0 && (
            <div style={{ marginTop: "2.5rem" }}><Tags tags={post.tags} /></div>
          )}

          <AuthorCard author={author} />

          {post.allow_comments && <GiscusComments />}
        </article>

        {showToc && (
          <aside className="toc-sidebar" style={{ position: "sticky", top: "5rem", padding: "3rem 0 4rem", maxHeight: "calc(100vh - 6rem)", overflowY: "auto" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.85rem" }}>
              {layout === "case_study" ? "Sections" : "On this page"}
            </p>
            <TOC content={post.content ?? ""} />
          </aside>
        )}
      </div>

      {relatedPosts && relatedPosts.length > 0 && (
        <section style={{ padding: "4rem 0", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)" }}>
          <div className="container">
            <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>More Articles</h2>
            <div className="divider" style={{ marginBottom: "2rem" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {relatedPosts.map((related) => (
                <Link key={related.id} href={`/blog/${related.slug}`} style={{ textDecoration: "none" }}>
                  <div className="card" style={{ height: "100%" }}>
                    {related.cover_image && (
                      <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: "0.375rem", overflow: "hidden", marginBottom: "1rem", background: "var(--bg-secondary)" }}>
                        <Image src={related.cover_image} alt={related.title} fill sizes="280px" style={{ objectFit: "cover" }} />
                      </div>
                    )}
                    <h3 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.5rem", lineHeight: 1.3 }}>{related.title}</h3>
                    {related.excerpt && (
                      <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "0.75rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{related.excerpt}</p>
                    )}
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                      <Clock size={11} /> {related.reading_time ?? 1} min read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .case-study-content { counter-reset: cs-section; }
        .case-study-content h2 { counter-increment: cs-section; padding-top: 1.5rem; border-top: 1px solid var(--border); }
        .case-study-content > h2:first-child { border-top: none; padding-top: 0; }
        .case-study-content h2::before {
          content: counter(cs-section, decimal-leading-zero);
          display: block; margin-bottom: 0.4rem;
          font-family: "DM Sans", sans-serif; font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.12em; color: var(--accent);
        }
        @media (max-width: 768px) {
          .post-layout { grid-template-columns: 1fr !important; gap: 0 !important; }
          .toc-sidebar { display: none !important; }
          .case-facts { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  )
}

// ── Shared pieces ─────────────────────────────────────────────

function BackLink({ light = false }: { light?: boolean }) {
  return (
    <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: light ? "rgba(255,255,255,0.85)" : "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "2rem" }}>
      <ArrowLeft size={15} /> Back to Blog
    </Link>
  )
}

function Tags({ tags, light = false }: { tags: string[]; light?: boolean }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {tags.map((tag) => (
        <span key={tag} style={{
          display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 600,
          color: light ? "#fff" : "var(--accent)",
          background: light ? "rgba(255,255,255,0.18)" : "var(--accent-subtle)",
          backdropFilter: light ? "blur(6px)" : undefined,
          padding: "0.25rem 0.7rem", borderRadius: "999px",
        }}>
          <Tag size={10} /> {tag}
        </span>
      ))}
    </div>
  )
}

function Byline({ post, author, light = false }: { post: Post; author: AuthorContent; light?: boolean }) {
  const muted = light ? "rgba(255,255,255,0.8)" : "var(--text-muted)"
  const date  = post.published_at ?? post.created_at
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", overflow: "hidden", border: `2px solid ${light ? "rgba(255,255,255,0.6)" : "var(--border)"}`, position: "relative", flexShrink: 0 }}>
          <Image src={author.photo} alt={author.name} fill sizes="32px" style={{ objectFit: "cover", objectPosition: "top" }} />
        </div>
        <span style={{ fontSize: "0.875rem", fontWeight: 600, color: light ? "#fff" : "var(--text-primary)" }}>{author.name}</span>
      </div>
      <span style={{ color: light ? "rgba(255,255,255,0.5)" : "var(--border)" }}>·</span>
      {date && (
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: muted }}>
          <Calendar size={14} /> {formatDate(date)}
        </span>
      )}
      {post.reading_time && (
        <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: muted }}>
          <Clock size={14} /> {post.reading_time} min read
        </span>
      )}
    </div>
  )
}

function AuthorCard({ author }: { author: AuthorContent }) {
  return (
    <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
      <div style={{ width: "4rem", height: "4rem", minWidth: "4rem", borderRadius: "50%", overflow: "hidden", border: "3px solid var(--surface)", position: "relative" }}>
        <Image src={author.photo} alt={author.name} fill sizes="64px" style={{ objectFit: "cover", objectPosition: "top" }} />
      </div>
      <div>
        <p style={{ fontFamily: "DM Serif Display, serif", fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>{author.name}</p>
        {author.bio && <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{author.bio}</p>}
        {author.link_label && author.link_href && (
          <Link href={author.link_href} style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.4rem" }}>
            {author.link_label} <ArrowRight size={12} />
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Layout headers ────────────────────────────────────────────

function StandardHeader({ post, author }: { post: Post; author: AuthorContent }) {
  return (
    <>
      <BackLink />
      {post.tags && post.tags.length > 0 && <div style={{ marginBottom: "1.25rem" }}><Tags tags={post.tags} /></div>}
      <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(1.85rem, 3.5vw, 2.75rem)", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
        {post.title}
      </h1>
      {post.excerpt && (
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic", borderLeft: "3px solid var(--accent)", paddingLeft: "1rem" }}>
          {post.excerpt}
        </p>
      )}
      <div style={{ paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2.5rem" }}>
        <Byline post={post} author={author} />
      </div>
    </>
  )
}

function MinimalHeader({ post }: { post: Post }) {
  const date = post.published_at ?? post.created_at
  return (
    <header style={{ textAlign: "center", marginBottom: "3rem" }}>
      <BackLink />
      <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        {[date && formatDate(date), post.reading_time && `${post.reading_time} min read`].filter(Boolean).join("  ·  ")}
      </p>
      <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(2rem, 4.5vw, 3.25rem)", lineHeight: 1.12, color: "var(--text-primary)", marginBottom: "1.25rem" }}>
        {post.title}
      </h1>
      {post.excerpt && (
        <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "560px", margin: "0 auto" }}>
          {post.excerpt}
        </p>
      )}
      <div style={{ width: "3rem", height: "2px", background: "var(--accent)", margin: "2.5rem auto 0" }} />
    </header>
  )
}

function CaseStudyHeader({ post, hasCover }: { post: Post; hasCover: boolean }) {
  const date  = post.published_at ?? post.created_at
  const facts = [
    { label: "Published",    value: date ? formatDate(date) : "—" },
    { label: "Reading time", value: post.reading_time ? `${post.reading_time} min` : "—" },
    { label: "Topics",       value: post.tags?.length ? post.tags.join(", ") : "—" },
  ]
  return (
    <>
      <header style={{ background: "var(--bg-secondary)", borderBottom: "1px solid var(--border)", padding: `3rem 0 ${hasCover ? "8rem" : "3rem"}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem" }}>
          <BackLink />
          <p style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.85rem" }}>
            Case Study
          </p>
          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(2.1rem, 4.5vw, 3.4rem)", lineHeight: 1.1, color: "var(--text-primary)", marginBottom: "1.25rem", maxWidth: "860px" }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p style={{ fontSize: "1.2rem", color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: "760px", marginBottom: "2rem" }}>
              {post.excerpt}
            </p>
          )}
          <div className="case-facts" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "1rem", maxWidth: "760px" }}>
            {facts.map((f) => (
              <div key={f.label} style={{ borderTop: "2px solid var(--accent)", paddingTop: "0.75rem" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.3rem" }}>{f.label}</p>
                <p style={{ fontSize: "0.925rem", color: "var(--text-primary)", fontWeight: 500, lineHeight: 1.45 }}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </header>
      {hasCover && (
        <div style={{ maxWidth: "1100px", margin: "-6rem auto 0", padding: "0 1.5rem" }}>
          <div style={{ position: "relative", aspectRatio: "16/9", maxHeight: "560px", width: "100%", borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 24px 60px -20px rgba(0,0,0,0.35)", background: "var(--bg-secondary)" }}>
            <Image src={post.cover_image!} alt={post.title} fill sizes="(max-width: 1100px) 100vw, 1100px" style={{ objectFit: "cover" }} priority />
          </div>
        </div>
      )}
    </>
  )
}

function HeroHeader({ post, author }: { post: Post; author: AuthorContent }) {
  return (
    <header style={{ position: "relative", width: "100%", minHeight: "clamp(440px, 85vh, 780px)", display: "flex", alignItems: "flex-end", overflow: "hidden", background: "#111" }}>
      <Image src={post.cover_image!} alt={post.title} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)" }} />
      <div style={{ position: "relative", width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "6rem 1.5rem 3.5rem" }}>
        <BackLink light />
        {post.tags && post.tags.length > 0 && <div style={{ marginBottom: "1.25rem" }}><Tags tags={post.tags} light /></div>}
        <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: "clamp(2.25rem, 5.5vw, 4rem)", lineHeight: 1.08, color: "#fff", marginBottom: "1.25rem", maxWidth: "900px", textShadow: "0 2px 24px rgba(0,0,0,0.35)" }}>
          {post.title}
        </h1>
        {post.excerpt && (
          <p style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.88)", lineHeight: 1.65, marginBottom: "1.75rem", maxWidth: "720px" }}>
            {post.excerpt}
          </p>
        )}
        <Byline post={post} author={author} light />
      </div>
    </header>
  )
}
