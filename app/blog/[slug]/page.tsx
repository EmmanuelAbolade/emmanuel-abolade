// app/blog/[slug]/page.tsx
// Individual blog post page
// Features: reading progress bar, table of contents, improved typography, author card, related posts

import GiscusComments from "@/components/GiscusComments"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Clock, Calendar, ArrowLeft, Tag, ArrowRight } from "lucide-react"
import { generatePostMetadata } from "@/lib/seo"
import BlogPostClient, { TOC } from "./BlogPostClient"

type Props = {
  params: Promise<{ slug: string }>
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

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single()

  if (error || !post) notFound()

  const { data: relatedPosts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, reading_time, published_at, tags")
    .eq("status", "published")
    .neq("slug", slug)
    .limit(3)

  const isCaseStudy = post.layout_style === "case_study"
  const isMinimal   = post.layout_style === "minimal"

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      <BlogPostClient content={post.content ?? ""} />

      {post.cover_image && !post.hide_cover_image && !isMinimal && (
        <div style={{
          position: "relative", width: "100%",
          height: "clamp(280px, 40vh, 480px)",
          overflow: "hidden", background: "var(--bg-secondary)",
        }}>
          <Image src={post.cover_image} alt={post.title} fill sizes="100vw" style={{ objectFit: "cover" }} priority />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, var(--bg) 100%)" }} />
        </div>
      )}

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "grid", gridTemplateColumns: "1fr 220px", gap: "4rem", alignItems: "start" }} className="post-layout">

        <article style={{ padding: isMinimal ? "6rem 0 4rem" : "3rem 0 4rem", minWidth: 0 }}>

          <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none", marginBottom: "2rem" }}>
            <ArrowLeft size={15} /> Back to Blog
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.25rem" }}>
              {post.tags.map((tag: string) => (
                <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", fontWeight: 600, color: "var(--accent)", background: "var(--accent-subtle)", padding: "0.25rem 0.7rem", borderRadius: "999px" }}>
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>
          )}

          <h1 style={{ fontFamily: "DM Serif Display, serif", fontSize: isCaseStudy ? "clamp(2rem, 4vw, 3rem)" : "clamp(1.85rem, 3.5vw, 2.75rem)", lineHeight: 1.15, color: "var(--text-primary)", marginBottom: "1.5rem" }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p style={{ fontSize: "1.15rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "1.5rem", fontStyle: "italic", borderLeft: "3px solid var(--accent)", paddingLeft: "1rem" }}>
              {post.excerpt}
            </p>
          )}

          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", alignItems: "center", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border)", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", overflow: "hidden", border: "2px solid var(--border)", position: "relative", flexShrink: 0 }}>
                <Image src="/images/profile.jpg" alt="Emmanuel Abolade" fill sizes="32px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
              <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--text-primary)" }}>Emmanuel Abolade</span>
            </div>
            <span style={{ color: "var(--border)" }}>·</span>
            {(post.published_at ?? post.created_at) && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <Calendar size={14} /> {formatDate(post.published_at ?? post.created_at)}
              </span>
            )}
            {post.reading_time && (
              <span style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <Clock size={14} /> {post.reading_time} min read
              </span>
            )}
          </div>

          <div className="prose-content" style={{ color: "var(--text-secondary)", lineHeight: 1.9, fontSize: isMinimal ? "1rem" : "1.075rem" }} dangerouslySetInnerHTML={{ __html: post.content ?? "" }} />

          <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
            <div style={{ width: "4rem", height: "4rem", minWidth: "4rem", borderRadius: "50%", overflow: "hidden", border: "3px solid var(--surface)", position: "relative" }}>
              <Image src="/images/profile.jpg" alt="Emmanuel Abolade" fill sizes="64px" style={{ objectFit: "cover", objectPosition: "top" }} />
            </div>
            <div>
              <p style={{ fontFamily: "DM Serif Display, serif", fontSize: "1rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>Emmanuel Abolade</p>
              <p style={{ fontSize: "0.825rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>Software developer based in Ireland, focused on full-stack web development and machine learning.</p>
              <Link href="/about" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.4rem" }}>
                About me <ArrowRight size={12} />
              </Link>
            </div>
          </div>

          {post.allow_comments && <GiscusComments />}
        </article>

        <aside className="toc-sidebar" style={{ position: "sticky", top: "5rem", padding: "3rem 0 4rem", maxHeight: "calc(100vh - 6rem)", overflowY: "auto" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "0.85rem" }}>
            On this page
          </p>
          <TOC content={post.content ?? ""} />
        </aside>
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
        @media (max-width: 768px) {
          .post-layout { grid-template-columns: 1fr !important; gap: 0 !important; }
          .toc-sidebar { display: none !important; }
        }
        .prose-content h1,.prose-content h2,.prose-content h3,.prose-content h4 {
          font-family: "DM Serif Display", serif; color: var(--text-primary);
          margin-top: 2.5rem; margin-bottom: 0.85rem; line-height: 1.2; scroll-margin-top: 5rem;
        }
        .prose-content h2 { font-size: 1.75rem; }
        .prose-content h3 { font-size: 1.35rem; }
        .prose-content h4 { font-size: 1.1rem; }
        .prose-content p  { margin-bottom: 1.4rem; }
        .prose-content ul,.prose-content ol { padding-left: 1.5rem; margin-bottom: 1.4rem; }
        .prose-content li { margin-bottom: 0.5rem; line-height: 1.75; }
        .prose-content a { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; }
        .prose-content blockquote { border-left: 3px solid var(--accent); padding: 0.75rem 1.25rem; margin: 2rem 0; background: var(--accent-subtle); border-radius: 0 0.5rem 0.5rem 0; color: var(--text-secondary); font-style: italic; }
        .prose-content code { background: var(--bg-secondary); border: 1px solid var(--border); padding: 0.15rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; color: var(--accent); }
        .prose-content pre { background: var(--bg-secondary); border: 1px solid var(--border); padding: 1.5rem; border-radius: 0.625rem; overflow-x: auto; margin: 1.5rem 0 2rem; }
        .prose-content pre code { background: none; border: none; padding: 0; color: var(--text-primary); font-size: 0.9rem; }
        .prose-content img { width: 100%; border-radius: 0.625rem; margin: 2rem 0; border: 1px solid var(--border); }
        .prose-content hr { border: none; border-top: 1px solid var(--border); margin: 3rem 0; }
        .prose-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.9rem; }
        .prose-content th,.prose-content td { border: 1px solid var(--border); padding: 0.65rem 1rem; text-align: left; }
        .prose-content th { background: var(--bg-secondary); font-weight: 600; color: var(--text-primary); }
        .prose-content strong { color: var(--text-primary); font-weight: 700; }
      `}</style>
    </div>
  )
}
