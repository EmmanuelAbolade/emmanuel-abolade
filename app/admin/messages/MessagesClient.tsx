// app/admin/messages/MessagesClient.tsx
// Client component for admin messages page
// Features: full message modal, status toggle, admin notes, delete

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  X,
  Mail,
  Calendar,
  Tag,
  FileText,
  Trash2,
  ChevronDown,
  Loader,
  Check,
} from "lucide-react"

type Message = {
  id: string
  name: string
  email: string
  subject: string | null
  enquiry_type: string | null
  message: string
  status: string
  admin_notes: string | null
  created_at: string
}

const STATUS_OPTIONS = ["New", "Read", "Replied", "Archived"]

const STATUS_STYLES: Record<string, { bg: string; color: string; border: string }> = {
  New:      { bg: "var(--accent-subtle)", color: "var(--accent)",   border: "var(--accent)"  },
  Read:     { bg: "var(--bg-secondary)", color: "var(--text-muted)", border: "var(--border)"  },
  Replied:  { bg: "#dcfce7",             color: "#16a34a",           border: "#86efac"         },
  Archived: { bg: "var(--bg-secondary)", color: "var(--text-muted)", border: "var(--border)"  },
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IE", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function MessageModal({
  message,
  onClose,
}: {
  message: Message
  onClose: () => void
}) {
  const router                          = useRouter()
  const [status, setStatus]             = useState(message.status)
  const [notes, setNotes]               = useState(message.admin_notes ?? "")
  const [savingStatus, setSavingStatus] = useState(false)
  const [savingNotes, setSavingNotes]   = useState(false)
  const [notesSaved, setNotesSaved]     = useState(false)
  const [deleting, setDeleting]         = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [statusOpen, setStatusOpen]     = useState(false)

  async function updateStatus(newStatus: string) {
    setSavingStatus(true)
    const supabase = createClient()
    await supabase.from("messages").update({ status: newStatus }).eq("id", message.id)
    setStatus(newStatus)
    setSavingStatus(false)
    setStatusOpen(false)
    router.refresh()
  }

  async function saveNotes() {
    setSavingNotes(true)
    const supabase = createClient()
    await supabase.from("messages").update({ admin_notes: notes || null }).eq("id", message.id)
    setSavingNotes(false)
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
    router.refresh()
  }

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from("messages").delete().eq("id", message.id)
    onClose()
    router.refresh()
  }

  const style = STATUS_STYLES[status] ?? STATUS_STYLES.New

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        backdropFilter: "blur(4px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
          width: "100%",
          maxWidth: "640px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
        }}
      >
        {/* Modal header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: 0,
          background: "var(--surface)", zIndex: 1,
        }}>
          <h2 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.25rem", color: "var(--text-primary)",
          }}>
            Message from {message.name}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", display: "flex",
              alignItems: "center", padding: "0.25rem",
              borderRadius: "0.375rem",
              transition: "color 0.2s ease",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message details */}
        <div style={{ padding: "1.5rem" }}>

          {/* Sender info */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "1rem", marginBottom: "1.5rem",
          }}>
            <div style={{
              background: "var(--bg-secondary)", borderRadius: "0.5rem",
              padding: "0.85rem 1rem",
            }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                From
              </p>
              <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                {message.name}
              </p>
              <a
                href={`mailto:${message.email}`}
                style={{ fontSize: "0.825rem", color: "var(--accent)", textDecoration: "none" }}
              >
                {message.email}
              </a>
            </div>

            <div style={{
              background: "var(--bg-secondary)", borderRadius: "0.5rem",
              padding: "0.85rem 1rem",
            }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.25rem" }}>
                Details
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.2rem" }}>
                <Tag size={11} color="var(--text-muted)" />
                <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  {message.enquiry_type ?? "General"}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={11} color="var(--text-muted)" />
                <span style={{ fontSize: "0.825rem", color: "var(--text-secondary)" }}>
                  {formatDate(message.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Subject */}
          {message.subject && (
            <div style={{ marginBottom: "1.25rem" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
                Subject
              </p>
              <p style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 500 }}>
                {message.subject}
              </p>
            </div>
          )}

          {/* Message body */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.4rem" }}>
              Message
            </p>
            <div style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--accent)",
              borderRadius: "0 0.5rem 0.5rem 0",
              padding: "1.25rem",
            }}>
              <p style={{
                color: "var(--text-secondary)", lineHeight: 1.8,
                fontSize: "0.95rem", whiteSpace: "pre-wrap",
              }}>
                {message.message}
              </p>
            </div>
          </div>

          {/* Status dropdown */}
          <div style={{ marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              Status
            </p>
            <div style={{ position: "relative", display: "inline-block" }}>
              <button
                onClick={() => setStatusOpen(!statusOpen)}
                disabled={savingStatus}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.5rem 0.85rem",
                  borderRadius: "999px",
                  border: `1.5px solid ${style.border}`,
                  background: style.bg, color: style.color,
                  fontSize: "0.82rem", fontWeight: 700,
                  cursor: "pointer", transition: "all 0.2s ease",
                }}
              >
                {savingStatus ? <Loader size={12} style={{ animation: "spin 1s linear infinite" }} /> : null}
                {status}
                <ChevronDown size={13} />
              </button>

              <AnimatePresence>
                {statusOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{
                      position: "absolute", top: "calc(100% + 0.4rem)", left: 0,
                      background: "var(--surface)", border: "1px solid var(--border)",
                      borderRadius: "0.5rem", overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 10,
                      minWidth: "130px",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(s)}
                        style={{
                          display: "flex", alignItems: "center", gap: "0.5rem",
                          width: "100%", padding: "0.6rem 0.85rem",
                          background: s === status ? "var(--bg-secondary)" : "none",
                          border: "none", cursor: "pointer",
                          fontSize: "0.85rem", color: "var(--text-primary)",
                          textAlign: "left",
                        }}
                      >
                        {s === status && <Check size={12} color="var(--accent)" />}
                        {s !== status && <span style={{ width: "12px" }} />}
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Admin notes */}
          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>
              Private Notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => { setNotes(e.target.value); setNotesSaved(false) }}
              placeholder="Add private notes about this message..."
              rows={4}
              style={{
                width: "100%", padding: "0.75rem 1rem",
                borderRadius: "0.375rem",
                border: "1.5px solid var(--border)",
                background: "var(--surface)", color: "var(--text-primary)",
                fontSize: "0.875rem", outline: "none",
                fontFamily: "DM Sans, sans-serif",
                resize: "vertical", minHeight: "100px",
                lineHeight: 1.65,
              }}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                onClick={saveNotes}
                disabled={savingNotes}
                className="btn-outline"
                style={{
                  fontSize: "0.82rem", padding: "0.4rem 0.85rem",
                  display: "inline-flex", alignItems: "center", gap: "0.4rem",
                }}
              >
                {savingNotes && <Loader size={12} style={{ animation: "spin 1s linear infinite" }} />}
                {notesSaved ? <><Check size={12} /> Saved</> : "Save Notes"}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", flexWrap: "wrap", gap: "1rem",
            paddingTop: "1rem", borderTop: "1px solid var(--border)",
          }}>
            <a
              href={`mailto:${message.email}?subject=Re: ${message.subject ?? "Your message"}`}
              className="btn-primary"
              style={{ fontSize: "0.875rem" }}
            >
              <Mail size={14} />
              Reply via Email
            </a>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.4rem",
                    padding: "0.5rem 0.85rem", borderRadius: "0.375rem",
                    border: "1px solid var(--border)", background: "var(--surface)",
                    color: "var(--text-muted)", fontSize: "0.82rem", cursor: "pointer",
                  }}
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              ) : (
                <>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.5rem 0.85rem", borderRadius: "0.375rem",
                      border: "1px solid #ef4444", background: "#ef4444",
                      color: "#fff", fontSize: "0.82rem", cursor: "pointer",
                      opacity: deleting ? 0.7 : 1,
                    }}
                  >
                    {deleting && <Loader size={12} style={{ animation: "spin 1s linear infinite" }} />}
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      padding: "0.5rem 0.85rem", borderRadius: "0.375rem",
                      border: "1px solid var(--border)", background: "var(--surface)",
                      color: "var(--text-secondary)", fontSize: "0.82rem", cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  )
}

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const [selected, setSelected]     = useState<Message | null>(null)
  const [filter, setFilter]         = useState("All")

  const STATUS_FILTERS = ["All", ...STATUS_OPTIONS]

  const filtered = messages.filter((m) =>
    filter === "All" ? true : m.status === filter
  )

  const newCount = messages.filter((m) => m.status === "New").length

  return (
    <div style={{ padding: "2rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
          <h1 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "2rem", color: "var(--text-primary)",
          }}>
            Messages
          </h1>
          {newCount > 0 && (
            <span style={{
              background: "var(--accent)", color: "var(--bg)",
              fontSize: "0.75rem", fontWeight: 700,
              padding: "0.2rem 0.6rem", borderRadius: "999px",
            }}>
              {newCount} new
            </span>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {messages.length} total messages
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {STATUS_FILTERS.map((f) => {
          const count = f === "All"
            ? messages.length
            : messages.filter((m) => m.status === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "0.35rem 0.85rem",
                borderRadius: "999px",
                border: "1.5px solid",
                borderColor: filter === f ? "var(--accent)" : "var(--border)",
                background: filter === f ? "var(--accent-subtle)" : "var(--surface)",
                color: filter === f ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "0.82rem", fontWeight: filter === f ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: "0.4rem",
              }}
            >
              {f}
              <span style={{
                background: filter === f ? "var(--accent)" : "var(--bg-secondary)",
                color: filter === f ? "var(--bg)" : "var(--text-muted)",
                borderRadius: "999px", fontSize: "0.7rem",
                padding: "0.05rem 0.4rem", fontWeight: 700,
              }}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Messages list */}
      {filtered.length === 0 ? (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "4rem",
          textAlign: "center", color: "var(--text-muted)",
        }}>
          <MessageSquare size={40} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.95rem" }}>
            {messages.length === 0 ? "No messages yet." : `No ${filter.toLowerCase()} messages.`}
          </p>
        </div>
      ) : (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", overflow: "hidden",
        }}>
          {filtered.map((msg, i) => {
            const style = STATUS_STYLES[msg.status] ?? STATUS_STYLES.New
            return (
              <button
                key={msg.id}
                onClick={() => setSelected(msg)}
                style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "1rem 1.25rem", width: "100%",
                  borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                  background: msg.status === "New" ? "var(--accent-subtle)" : "transparent",
                  border: "none", cursor: "pointer", textAlign: "left",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-secondary)" }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    msg.status === "New" ? "var(--accent-subtle)" : "transparent"
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: "2.5rem", height: "2.5rem", minWidth: "2.5rem",
                  background: "var(--accent-subtle)", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1rem", color: "var(--accent)", fontWeight: 600,
                }}>
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                    <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9rem" }}>
                      {msg.name}
                    </p>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {msg.email}
                    </span>
                  </div>
                  <p style={{
                    fontSize: "0.85rem", color: "var(--text-secondary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {msg.subject ?? msg.enquiry_type ?? "No subject"} — {msg.message.slice(0, 80)}...
                  </p>
                </div>

                {/* Meta */}
                <div style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "flex-end", gap: "0.35rem",
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontSize: "0.7rem", fontWeight: 700,
                    padding: "0.2rem 0.6rem", borderRadius: "999px",
                    background: style.bg, color: style.color,
                    border: `1px solid ${style.border}`,
                  }}>
                    {msg.status}
                  </span>
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {new Date(msg.created_at).toLocaleDateString("en-IE", {
                      day: "numeric", month: "short",
                    })}
                  </span>
                  {msg.admin_notes && (
                    <FileText size={12} color="var(--text-muted)" title="Has notes" />
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* Message modal */}
      <AnimatePresence>
        {selected && (
          <MessageModal
            message={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
