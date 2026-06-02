// app/projects/[slug]/page.tsx
// Individual project detail page
// Shows full project info, achievements, learnings, links and related projects

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import ProjectDetail from "./ProjectDetail"
import { generateProjectMetadata } from "@/lib/seo"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from("projects")
    .select("title, excerpt, image_url, slug, technologies")
    .eq("slug", slug)
    .single()

  if (!project) return { title: "Project Not Found" }
  return generateProjectMetadata(project)

}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single()

  if (error || !project) notFound()

  // Fetch related projects excluding current
  const { data: related } = await supabase
    .from("projects")
    .select("id, title, slug, excerpt, image_url, technologies, status")
    .eq("published", true)
    .neq("id", project.id)
    .limit(3)

  return <ProjectDetail project={project} related={related ?? []} />
}
