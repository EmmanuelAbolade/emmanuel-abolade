// app/admin/projects/[id]/edit/page.tsx
// Admin edit project page - fetches existing project and renders ProjectForm with initial data

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ProjectForm from "../../ProjectForm"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !project) notFound()

  return (
    <ProjectForm
      initial={{
        ...project,
        technologies:     project.technologies ?? [],
        key_achievements: project.key_achievements ?? [],
        start_date:       project.start_date ?? "",
        end_date:         project.end_date ?? "",
        pinned_order:     project.pinned_order?.toString() ?? "",
      }}
    />
  )
}
