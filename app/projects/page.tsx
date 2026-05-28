// app/projects/page.tsx
// Projects page - fetches all published projects from Supabase and displays them in a filterable grid

import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import ProjectsClient from "./ProjectsClient"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of software projects built by Emmanuel Abolade — from full-stack web apps to machine learning systems.",
}

export default async function ProjectsPage() {
  const supabase = await createClient()

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error.message)
  }

  return <ProjectsClient projects={projects ?? []} />
}
