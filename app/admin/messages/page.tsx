// app/admin/messages/page.tsx
// Admin Messages page - view all contact form submissions with status management

import { createClient } from "@/lib/supabase/server"
import MessagesClient from "./MessagesClient"

export default async function AdminMessagesPage() {
  const supabase = await createClient()

  const { data: messages, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching messages:", error.message)
  }

  return <MessagesClient messages={messages ?? []} />
}
