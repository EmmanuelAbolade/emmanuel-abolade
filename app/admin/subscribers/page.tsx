// app/admin/subscribers/page.tsx
// Admin Subscribers page - view and manage newsletter subscribers

import { createClient } from "@/lib/supabase/server"
import SubscribersClient from "./SubscribersClient"

export default async function AdminSubscribersPage() {
  const supabase = await createClient()

  const { data: subscribers, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching subscribers:", error.message)
  }

  return <SubscribersClient subscribers={subscribers ?? []} />
}
