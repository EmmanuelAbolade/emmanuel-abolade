// app/admin/posts/PostStatusToggle.tsx
// Toggle button for cycling through post statuses
// draft -> review -> published -> archived

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

const STATUS_CYCLE: Record<string, string> = {
  draft:     "published",
  review:    "published",
  published: "draft",
  archived:  "draft",
}

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  draft:     { bg: "var(--surface)",       color: "var(--text-muted)", border: "var(--border)"  },
  review:    { bg: "#fef9c3",              color: "#ca8a04",           border: "#fde68a"         },
  published: { bg: "var(--accent-subtle)", color: "var(--accent)",     border: "var(--accent)"   },
  archived:  { bg: "var(--surface)",       color: "var(--text-muted)", border: "var(--border)"  },
}

export default function PostStatusToggle({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router              = useRouter()
  const [current, setCurrent] = useState(status)
  const [loading, setLoad]    = useState(false)

  async function handleToggle() {
    const next = STATUS_CYCLE[current] ?? "draft"
    setLoad(true)
    const supabase = createClient()

    const updatePayload: Record<string, unknown> = { status: next }
    if (next === "published") {
      updatePayload.published_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from("posts")
      .update(updatePayload)
      .eq("id", id)

    if (!error) {
      setCurrent(next)
      router.refresh()
    }
    setLoad(false)
  }

  const style = STATUS_STYLES[current] ?? STATUS_STYLES.draft

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={`Click to set to ${STATUS_CYCLE[current] ?? "draft"}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        padding: "0.3rem 0.75rem",
        borderRadius: "999px",
        border: `1.5px solid ${style.border}`,
        background: style.bg,
        color: style.color,
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
        transition: "all 0.2s ease",
        whiteSpace: "nowrap",
        textTransform: "capitalize",
      }}
    >
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: style.color, display: "inline-block", flexShrink: 0,
      }} />
      {current}
    </button>
  )
}
