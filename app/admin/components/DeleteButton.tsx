// app/admin/components/DeleteButton.tsx
// Reusable delete button for admin CRUD pages
// Shows confirmation dialog before deleting any record

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader } from "lucide-react"

type Props = {
  id: string
  table: string
  label: string
}

export default function DeleteButton({ id, table, label }: Props) {
  const router              = useRouter()
  const [loading, setLoad]  = useState(false)
  const [confirm, setConf]  = useState(false)

  async function handleDelete() {
    setLoad(true)
    const supabase = createClient()
    const { error } = await supabase.from(table).delete().eq("id", id)
    if (error) {
      console.error("Delete error:", error.message)
      setLoad(false)
      setConf(false)
      return
    }
    router.refresh()
  }

  if (confirm) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "0.4rem 0.65rem",
            borderRadius: "0.375rem",
            border: "1px solid #ef4444",
            background: "#ef4444",
            color: "#fff",
            fontSize: "0.75rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? <Loader size={11} style={{ animation: "spin 1s linear infinite" }} /> : null}
          {loading ? "..." : "Yes"}
        </button>
        <button
          onClick={() => setConf(false)}
          disabled={loading}
          style={{
            padding: "0.4rem 0.65rem",
            borderRadius: "0.375rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-secondary)",
            fontSize: "0.75rem",
            cursor: "pointer",
          }}
        >
          No
        </button>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConf(true)}
      title={`Delete ${label}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.3rem",
        padding: "0.4rem 0.6rem",
        borderRadius: "0.375rem",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text-muted)",
        fontSize: "0.8rem",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <Trash2 size={12} />
    </button>
  )
}
