// app/admin/components/PublishToggle.tsx
// Reusable publish/unpublish toggle for admin CRUD pages
// Updates the published field in any table via Supabase

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

type Props = {
  id: string
  table: string
  published: boolean
  field?: string
}

export default function PublishToggle({
  id,
  table,
  published,
  field = "published",
}: Props) {
  const router                  = useRouter()
  const [value, setValue]       = useState(published)
  const [loading, setLoading]   = useState(false)

  async function handleToggle() {
    setLoading(true)
    const supabase = createClient()
    const newValue = !value
    const { error } = await supabase
      .from(table)
      .update({ [field]: newValue })
      .eq("id", id)

    if (!error) {
      setValue(newValue)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.75rem",
        borderRadius: "999px",
        border: "1.5px solid",
        borderColor: value ? "var(--accent)" : "var(--border)",
        background: value ? "var(--accent-subtle)" : "var(--surface)",
        color: value ? "var(--accent)" : "var(--text-muted)",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          background: value ? "var(--accent)" : "var(--text-muted)",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {value ? "Published" : "Draft"}
    </button>
  )
}
