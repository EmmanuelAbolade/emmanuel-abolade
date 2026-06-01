// app/admin/subscribers/SubscribersClient.tsx
// Client component for admin subscribers page
// Features: list all subscribers, copy email, delete, export as CSV

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Copy,
  Check,
  Trash2,
  Download,
  Search,
  Calendar,
  Loader,
  X,
} from "lucide-react"

type Subscriber = {
  id: string
  email: string
  created_at: string
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric", month: "short", year: "numeric",
  })
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={handleCopy}
      title="Copy email"
      style={{
        display: "inline-flex", alignItems: "center",
        background: "none", border: "none",
        cursor: "pointer", color: copied ? "var(--accent)" : "var(--text-muted)",
        padding: "0.25rem", borderRadius: "0.25rem",
        transition: "color 0.2s ease",
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}

function DeleteSubscriberButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from("subscribers").delete().eq("id", id)
    setLoading(false)
    onDeleted()
  }

  if (confirm) {
    return (
      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "0.25rem 0.6rem", borderRadius: "0.25rem",
            border: "1px solid #ef4444", background: "#ef4444",
            color: "#fff", fontSize: "0.72rem", fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", gap: "0.25rem",
          }}
        >
          {loading && <Loader size={10} style={{ animation: "spin 1s linear infinite" }} />}
          Yes
        </button>
        <button
          onClick={() => setConfirm(false)}
          style={{
            padding: "0.25rem 0.6rem", borderRadius: "0.25rem",
            border: "1px solid var(--border)", background: "var(--surface)",
            color: "var(--text-muted)", fontSize: "0.72rem", cursor: "pointer",
          }}
        >
          No
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      title="Delete subscriber"
      style={{
        display: "inline-flex", alignItems: "center",
        background: "none", border: "none",
        cursor: "pointer", color: "var(--text-muted)",
        padding: "0.25rem", borderRadius: "0.25rem",
        transition: "color 0.2s ease",
      }}
    >
      <Trash2 size={13} />
    </button>
  )
}

export default function SubscribersClient({
  subscribers: initial,
}: {
  subscribers: Subscriber[]
}) {
  const router                      = useRouter()
  const [subscribers, setSubscribers] = useState(initial)
  const [search, setSearch]         = useState("")
  const [copied, setCopied]         = useState(false)

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  function handleDeleted(id: string) {
    setSubscribers((prev) => prev.filter((s) => s.id !== id))
    router.refresh()
  }

  function exportCSV() {
    const rows = ["Email,Date Subscribed"]
    subscribers.forEach((s) => {
      rows.push(`${s.email},${formatDate(s.created_at)}`)
    })
    const blob = new Blob([rows.join("\n")], { type: "text/csv" })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement("a")
    a.href     = url
    a.download = "subscribers.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyAllEmails() {
    const emails = subscribers.map((s) => s.email).join(", ")
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: "2rem", flexWrap: "wrap", gap: "1rem",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
            <h1 style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "2rem", color: "var(--text-primary)",
            }}>
              Subscribers
            </h1>
            <span style={{
              background: "var(--accent-subtle)", color: "var(--accent)",
              fontSize: "0.82rem", fontWeight: 700,
              padding: "0.2rem 0.65rem", borderRadius: "999px",
            }}>
              {subscribers.length} total
            </span>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Newsletter subscribers who signed up from your website.
          </p>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            onClick={copyAllEmails}
            className="btn-outline"
            style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy All Emails"}
          </button>
          <button
            onClick={exportCSV}
            className="btn-primary"
            style={{ fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "1rem", marginBottom: "2rem",
      }}>
        {[
          {
            label: "Total",
            value: subscribers.length,
            icon: Users,
          },
          {
            label: "This month",
            value: subscribers.filter((s) => {
              const d = new Date(s.created_at)
              const now = new Date()
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            }).length,
            icon: Calendar,
          },
          {
            label: "This week",
            value: subscribers.filter((s) => {
              const d   = new Date(s.created_at)
              const now = new Date()
              const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)
              return diff <= 7
            }).length,
            icon: Calendar,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "0.75rem", padding: "1.25rem",
              display: "flex", alignItems: "center", gap: "1rem",
            }}
          >
            <div style={{
              width: "2.25rem", height: "2.25rem",
              background: "var(--accent-subtle)", borderRadius: "0.5rem",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon size={15} color="var(--accent)" />
            </div>
            <div>
              <p style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.5rem", color: "var(--text-primary)", lineHeight: 1 }}>
                {value}
              </p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: "relative", maxWidth: "360px", marginBottom: "1.25rem" }}>
        <Search size={15} style={{
          position: "absolute", left: "0.85rem", top: "50%",
          transform: "translateY(-50%)", color: "var(--text-muted)",
          pointerEvents: "none",
        }} />
        <input
          type="text"
          placeholder="Search subscribers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%", paddingLeft: "2.25rem",
            paddingRight: search ? "2.25rem" : "1rem",
            paddingTop: "0.65rem", paddingBottom: "0.65rem",
            borderRadius: "0.375rem",
            border: "1.5px solid var(--border)",
            background: "var(--surface)", color: "var(--text-primary)",
            fontSize: "0.9rem", outline: "none",
          }}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            style={{
              position: "absolute", right: "0.75rem", top: "50%",
              transform: "translateY(-50%)", background: "none",
              border: "none", cursor: "pointer", color: "var(--text-muted)",
              display: "flex", alignItems: "center", padding: 0,
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Subscribers list */}
      {subscribers.length === 0 ? (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "4rem",
          textAlign: "center", color: "var(--text-muted)",
        }}>
          <Users size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.95rem" }}>
            No subscribers yet. Share your newsletter link to get started.
          </p>
        </div>
      ) : (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 160px 80px",
            padding: "0.65rem 1.25rem",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: "0.72rem", fontWeight: 700,
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: "0.06em", gap: "1rem",
          }}>
            <span>Email</span>
            <span>Subscribed</span>
            <span>Actions</span>
          </div>

          {/* Rows */}
          {filtered.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.875rem" }}>
              No subscribers match your search.
            </div>
          ) : (
            filtered.map((sub, i) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                style={{
                  display: "grid", gridTemplateColumns: "1fr 160px 80px",
                  padding: "0.85rem 1.25rem",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  alignItems: "center", gap: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{
                    width: "1.75rem", height: "1.75rem",
                    background: "var(--accent-subtle)", borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)",
                    flexShrink: 0,
                  }}>
                    {sub.email.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: "0.875rem", color: "var(--text-primary)" }}>
                    {sub.email}
                  </span>
                  <CopyButton text={sub.email} />
                </div>

                <span style={{
                  fontSize: "0.8rem", color: "var(--text-muted)",
                  display: "flex", alignItems: "center", gap: "0.35rem",
                }}>
                  <Calendar size={11} />
                  {formatDate(sub.created_at)}
                </span>

                <DeleteSubscriberButton
                  id={sub.id}
                  onDeleted={() => handleDeleted(sub.id)}
                />
              </motion.div>
            ))
          )}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
