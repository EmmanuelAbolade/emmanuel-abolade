// app/admin/categories/page.tsx
// Admin Categories page - create, edit and delete categories
// Categories are used by both posts and resources

import { createClient } from "@/lib/supabase/server"
import CategoriesClient from "./CategoriesClient"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("Error fetching categories:", error.message)
  }

  return <CategoriesClient categories={categories ?? []} />
}
