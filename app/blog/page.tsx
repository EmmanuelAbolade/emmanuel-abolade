// app/blog/page.tsx
// Blog listing page - fetches published posts from Supabase and displays them in a filterable grid

import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import BlogClient from "./BlogClient"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles, tutorials, and thoughts on software development, machine learning, and technology by Emmanuel Abolade.",
}

export default async function BlogPage() {
  const supabase = await createClient()

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, excerpt, cover_image, hide_cover_image, tags, category_id, status, featured, reading_time, pinned_order, layout_style, published_at, created_at")
    .eq("status", "published")
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("published_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error.message)
  }

  return <BlogClient posts={posts ?? []} />
}
