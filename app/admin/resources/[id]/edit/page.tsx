// app/admin/resources/[id]/edit/page.tsx
// Admin edit resource page

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ResourceForm from "../../ResourceForm"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditResourcePage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()

  const { data: resource, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !resource) notFound()

  return (
    <ResourceForm
      initial={{
        ...resource,
        tags:         resource.tags ?? [],
        pinned_order: resource.pinned_order?.toString() ?? "",
      }}
    />
  )
}
