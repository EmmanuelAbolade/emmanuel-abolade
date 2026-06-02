// app/blog/[slug]/page.tsx
// Individual blog post page - fetches post by slug from Supabase and renders content

import GiscusComments from "@/components/GiscusComments"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Clock, Calendar, ArrowLeft, Tag } from "lucide-react"
import { generatePostMetadata } from "@/lib/seo"

type Props = {
  params: Promise<{ slug: string }>
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
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

  if (error || !post) {
    notFound()
  }

  const isMinimal   = post.layout_style === "minimal"
  const isCaseStudy = post.layout_style === "case_study"

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Cover image - only show if not hidden and not minimal layout */}
      {post.cover_image && !post.hide_cover_image && !isMinimal && (
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "420px",
            overflow: "hidden",
            background: "var(--bg-secondary)",
          }}
        >
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, transparent 40%, var(--bg) 100%)",
            }}
          />
        </div>
      )}

      {/* Post content */}
      <article
        style={{
          maxWidth: isCaseStudy ? "900px" : "720px",
          margin: "0 auto",
          padding: isMinimal ? "6rem 1.5rem 4rem" : "3rem 1.5rem 4rem",
        }}
      >
        {/* Back link */}
        <Link
          href="/blog"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
            textDecoration: "none",
            marginBottom: "2rem",
            transition: "color 0.2s ease",
          }}
        >
          <ArrowLeft size={15} />
          Back to Blog
        </Link>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem",
              marginBottom: "1.25rem",
            }}
          >
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "var(--accent-subtle)",
                  padding: "0.25rem 0.7rem",
                  borderRadius: "999px",
                }}
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: isCaseStudy
              ? "clamp(2rem, 4vw, 3rem)"
              : "clamp(1.85rem, 3.5vw, 2.75rem)",
            lineHeight: 1.15,
            color: "var(--text-primary)",
            marginBottom: "1.5rem",
          }}
        >
          {post.title}
        </h1>

        {/* Meta row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.25rem",
            alignItems: "center",
            paddingBottom: "1.5rem",
            borderBottom: "1px solid var(--border)",
            marginBottom: "2.5rem",
          }}
        >
          {(post.published_at ?? post.created_at) && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
              }}
            >
              <Calendar size={14} />
              {formatDate(post.published_at ?? post.created_at)}
            </span>
          )}
          {post.reading_time && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.875rem",
                color: "var(--text-muted)",
              }}
            >
              <Clock size={14} />
              {post.reading_time} min read
            </span>
          )}
        </div>

        {/* Post body */}
        <div
          className="prose-content"
          style={{
            color: "var(--text-secondary)",
            lineHeight: 1.85,
            fontSize: isMinimal ? "1rem" : "1.05rem",
          }}
          dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
        />
        {post.allow_comments && <GiscusComments />}
      </article>

      {/* Prose content styles */}
      <style>{`
        .prose-content h1,
        .prose-content h2,
        .prose-content h3,
        .prose-content h4 {
          font-family: "DM Serif Display", serif;
          color: var(--text-primary);
          margin-top: 2rem;
          margin-bottom: 0.75rem;
          line-height: 1.25;
        }
        .prose-content h2 { font-size: 1.65rem; }
        .prose-content h3 { font-size: 1.3rem; }
        .prose-content h4 { font-size: 1.1rem; }
        .prose-content p { margin-bottom: 1.25rem; }
        .prose-content ul,
        .prose-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .prose-content li { margin-bottom: 0.4rem; }
        .prose-content a {
          color: var(--accent);
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .prose-content blockquote {
          border-left: 3px solid var(--accent);
          padding-left: 1.25rem;
          margin: 1.5rem 0;
          color: var(--text-muted);
          font-style: italic;
        }
        .prose-content code {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 0.15rem 0.4rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
          color: var(--accent);
        }
        .prose-content pre {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          padding: 1.25rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 1.5rem;
        }
        .prose-content pre code {
          background: none;
          border: none;
          padding: 0;
          color: var(--text-primary);
          font-size: 0.9rem;
        }
        .prose-content img {
          width: 100%;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
          border: 1px solid var(--border);
        }
        .prose-content hr {
          border: none;
          border-top: 1px solid var(--border);
          margin: 2.5rem 0;
        }
        .prose-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }
        .prose-content th,
        .prose-content td {
          border: 1px solid var(--border);
          padding: 0.65rem 1rem;
          text-align: left;
        }
        .prose-content th {
          background: var(--bg-secondary);
          font-weight: 600;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}
