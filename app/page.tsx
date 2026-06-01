// app/page.tsx
// Home page - hero, stats strip, featured projects from DB, latest blog posts from DB, newsletter CTA

import { createClient } from "@/lib/supabase/server"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch featured projects ordered by pinned_order
  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, slug, excerpt, image_url, technologies, status, my_role, live_url, showcase_url, featured")
    .eq("published", true)
    .eq("featured", true)
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .limit(3)

  // Fetch latest published blog posts
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, tags, reading_time, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(3)

  return <HomeClient projects={projects ?? []} posts={posts ?? []} />
}
