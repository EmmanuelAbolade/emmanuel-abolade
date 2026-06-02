// app/forgot-password/page.tsx
// Forgot password page - sends a password reset email via Supabase

"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Code2, Mail, ArrowLeft, CheckCircle, AlertCircle, Loader } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail]   = useState("")
  const [loading, setLoad]  = useState(false)
  const [sent, setSent]     = useState(false)
  const [error, setError]   = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Email is required.")
      return
    }

    setLoad(true)
    const supabase    = createClient()
    const redirectTo  =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : "https://emmanuel-abolade.vercel.app/reset-password"

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      { redirectTo }
    )

    if (resetError) {
      setError("Failed to send reset email. Please try again.")
      setLoad(false)
      return
    }

    setSent(true)
    setLoad(false)
  }

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1.5rem",
    }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          marginBottom: "2.5rem", justifyContent: "center",
        }}>
          <div style={{
            width: "2.25rem", height: "2.25rem",
            background: "var(--accent)", borderRadius: "0.5rem",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Code2 size={18} color="var(--bg)" />
          </div>
          <span style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1.25rem", color: "var(--text-primary)",
          }}>
            Emmanuel<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "2.5rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
          {sent ? (
            /* Success state */
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: "3rem", height: "3rem",
                background: "#dcfce7", borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1.25rem",
              }}>
                <CheckCircle size={24} color="#16a34a" />
              </div>
              <h1 style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "1.5rem", color: "var(--text-primary)", marginBottom: "0.75rem",
              }}>
                Check your email
              </h1>
              <p style={{
                color: "var(--text-secondary)", fontSize: "0.9rem",
                lineHeight: 1.7, marginBottom: "1.5rem",
              }}>
                We sent a password reset link to <strong>{email}</strong>.
                Click the link in the email to set a new password.
              </p>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Did not receive it? Check your spam folder or{" "}
                <button
                  onClick={() => setSent(false)}
                  style={{
                    background: "none", border: "none",
                    color: "var(--accent)", cursor: "pointer",
                    fontSize: "0.8rem", padding: 0,
                    textDecoration: "underline",
                  }}
                >
                  try again
                </button>
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              <h1 style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "1.75rem", color: "var(--text-primary)", marginBottom: "0.4rem",
              }}>
                Reset Password
              </h1>
              <p style={{
                color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem",
              }}>
                Enter your email and we will send you a reset link.
              </p>

              {error && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  background: "#fee2e2", border: "1px solid #ef4444",
                  borderRadius: "0.375rem", padding: "0.75rem 1rem",
                  marginBottom: "1.5rem", fontSize: "0.875rem", color: "#dc2626",
                }}>
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <label style={{
                    display: "block", fontSize: "0.85rem",
                    fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem",
                  }}>
                    Email
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} style={{
                      position: "absolute", left: "0.85rem", top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)", pointerEvents: "none",
                    }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError("") }}
                      placeholder="emab.dev.tech@gmail.com"
                      autoComplete="email"
                      disabled={loading}
                      style={{
                        width: "100%",
                        paddingLeft: "2.5rem",
                        paddingRight: "1rem",
                        paddingTop: "0.75rem",
                        paddingBottom: "0.75rem",
                        borderRadius: "0.375rem",
                        border: "1.5px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        outline: "none",
                        fontFamily: "DM Sans, sans-serif",
                        opacity: loading ? 0.7 : 1,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%", justifyContent: "center",
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Back to login */}
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            href="/login"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none",
            }}
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
