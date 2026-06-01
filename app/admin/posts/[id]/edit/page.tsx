// app/admin/posts/[id]/edit/page.tsx
// Admin edit post page - fetches existing post and renders PostForm with initial data

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PostForm from "../../PostForm"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !post) notFound()

  return (
    <PostForm
      initial={{
        ...post,
        tags:         post.tags ?? [],
        reading_time: post.reading_time?.toString() ?? "",
        pinned_order: post.pinned_order?.toString() ?? "",
      }}
    />
  )
}
