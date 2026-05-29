// app/resources/page.tsx
// Resources page - fetches published resources from Supabase and displays them in a filterable grid

import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import ResourcesClient from "./ResourcesClient"

export const metadata: Metadata = {
  title: "Resources",
  description:
    "A curated collection of tools, books, courses, and resources handpicked by Emmanuel Abolade for developers and learners.",
}

export default async function ResourcesPage() {
  const supabase = await createClient()

  const { data: resources, error } = await supabase
    .from("resources")
    .select("*")
    .eq("published", true)
    .order("pinned_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error.message)
  }

  return <ResourcesClient resources={resources ?? []} />
}
