// lib/seo.ts
// Shared SEO metadata helpers for dynamic pages
// Used by blog post and project detail pages

import type { Metadata } from "next"

const BASE_URL = "https://emmanuel-abolade.vercel.app"

type PostSEOProps = {
  title: string
  excerpt: string | null
  cover_image: string | null
  slug: string
  published_at: string | null
  tags: string[] | null
  reading_time: number | null
}

type ProjectSEOProps = {
  title: string
  excerpt: string | null
  image_url: string | null
  slug: string
  technologies: string[] | null
}

export function generatePostMetadata(post: PostSEOProps): Metadata {
  const title       = post.title
  const description = post.excerpt ?? `Read ${post.title} on Emmanuel Abolade's blog.`
  const url         = `${BASE_URL}/blog/${post.slug}`
  const image       = post.cover_image ?? "/og-image.png"

  return {
    title,
    description,
    keywords: post.tags ?? [],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: ["Emmanuel Abolade"],
      tags: post.tags ?? [],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export function generateProjectMetadata(project: ProjectSEOProps): Metadata {
  const title       = project.title
  const description = project.excerpt ?? `View ${project.title} — a project by Emmanuel Abolade.`
  const url         = `${BASE_URL}/projects/${project.slug}`
  const image       = project.image_url ?? "/og-image.png"

  return {
    title,
    description,
    keywords: project.technologies ?? [],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}