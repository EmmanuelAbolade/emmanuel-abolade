// components/NewsletterForm.tsx
// Reusable newsletter subscription form
// Connects to /api/subscribe route and handles success and error states

"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle, Loader } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error" | "duplicate"

export default function NewsletterForm() {
  const [email, setEmail]   = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus("loading")
    setMessage("")

    try {
      const res  = await fetch("/api/subscribe", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (res.status === 409) {
        setStatus("duplicate")
        setMessage("This email is already subscribed.")
        return
      }

      if (!res.ok) {
        setStatus("error")
        setMessage(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
      setMessage("Network error. Please check your connection.")
    }
  }

  if (status === "success") {
    return (
      <div style={{
        display: "flex", alignItems: "center", gap: "0.75rem",
        background: "#dcfce7", border: "1px solid #86efac",
        borderRadius: "0.5rem", padding: "1rem 1.25rem",
      }}>
        <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontWeight: 600, color: "#15803d", fontSize: "0.9rem" }}>
            You are subscribed.
          </p>
          <p style={{ fontSize: "0.8rem", color: "#166534" }}>
            Thanks for subscribing. You will hear from me when I publish something new.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex", gap: "0.75rem",
          flexWrap: "wrap", justifyContent: "center",
        }}
      >
        <input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== "idle") setStatus("idle")
          }}
          required
          disabled={status === "loading"}
          style={{
            flex: 1, minWidth: "220px",
            padding: "0.75rem 1rem",
            borderRadius: "0.375rem",
            border: `1.5px solid ${status === "error" ? "#ef4444" : "var(--border)"}`,
            background: "var(--surface)",
            color: "var(--text-primary)",
            fontSize: "0.9rem", outline: "none",
            transition: "border-color 0.2s ease",
            opacity: status === "loading" ? 0.7 : 1,
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary"
          style={{
            opacity: status === "loading" ? 0.7 : 1,
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {status === "loading" ? (
            <>
              <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>
      </form>

      {(status === "error" || status === "duplicate") && (
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          marginTop: "0.75rem", justifyContent: "center",
        }}>
          <AlertCircle size={14} color={status === "duplicate" ? "var(--accent)" : "#ef4444"} />
          <p style={{
            fontSize: "0.82rem",
            color: status === "duplicate" ? "var(--accent)" : "#ef4444",
          }}>
            {message}
          </p>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
