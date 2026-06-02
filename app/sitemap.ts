// app/sitemap.ts
// Auto-generated sitemap for SEO
// Includes all static pages plus dynamic blog posts and projects from Supabase

import { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

const BASE_URL = "https://emmanuel-abolade.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch published posts
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("status", "published")

  // Fetch published projects
  const { data: projects } = await supabase
    .from("projects")
    .select("slug, updated_at")
    .eq("published", true)

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/resources`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ]

  const postPages: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "monthly",
    priority: 0.85,
  }))

  return [...staticPages, ...postPages, ...projectPages]
}