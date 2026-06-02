// app/reset-password/page.tsx
// Reset password page - shown after clicking the email reset link
// Allows user to set a new password via Supabase

"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Code2, Eye, EyeOff, CheckCircle, AlertCircle, Loader } from "lucide-react"
import Link from "next/link"

function ResetForm() {
  const router                  = useRouter()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm]   = useState("")
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoad]      = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState("")
  const [ready, setReady]       = useState(false)

  useEffect(() => {
    // Supabase puts the token in the URL hash - we need to wait for the session
    const supabase = createClient()
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true)
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoad(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message ?? "Failed to update password.")
      setLoad(false)
      return
    }

    setDone(true)
    setLoad(false)

    // Redirect to login after 3 seconds
    setTimeout(() => router.push("/login"), 3000)
  }

  const inputStyle = (hasError?: boolean) => ({
    width: "100%",
    paddingLeft: "1rem",
    paddingRight: "3rem",
    paddingTop: "0.75rem",
    paddingBottom: "0.75rem",
    borderRadius: "0.375rem",
    border: `1.5px solid ${hasError ? "#ef4444" : "var(--border)"}`,
    background: "var(--surface)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
  })

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

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "2.5rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        }}>
          {done ? (
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
                Password updated
              </h1>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.7 }}>
                Your password has been updated successfully. Redirecting you to login...
              </p>
            </div>
          ) : !ready ? (
            /* Waiting for Supabase token */
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <Loader size={32} color="var(--accent)" style={{ margin: "0 auto 1rem", animation: "spin 1s linear infinite" }} />
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                Verifying reset link...
              </p>
            </div>
          ) : (
            /* Reset form */
            <>
              <h1 style={{
                fontFamily: "DM Serif Display, serif",
                fontSize: "1.75rem", color: "var(--text-primary)", marginBottom: "0.4rem",
              }}>
                New Password
              </h1>
              <p style={{
                color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "2rem",
              }}>
                Choose a strong password for your admin account.
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

              <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
              >
                {/* New password */}
                <div>
                  <label style={{
                    display: "block", fontSize: "0.85rem",
                    fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem",
                  }}>
                    New Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError("") }}
                      placeholder="At least 8 characters"
                      autoComplete="new-password"
                      style={inputStyle(!!error)}
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(!showPw)}
                      style={{
                        position: "absolute", right: "0.85rem", top: "50%",
                        transform: "translateY(-50%)",
                        background: "none", border: "none", cursor: "pointer",
                        color: "var(--text-muted)", display: "flex",
                        alignItems: "center", padding: 0,
                      }}
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label style={{
                    display: "block", fontSize: "0.85rem",
                    fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem",
                  }}>
                    Confirm Password
                  </label>
                  <input
                    type={showPw ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError("") }}
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                    style={{
                      ...inputStyle(!!error && password !== confirm),
                      paddingRight: "1rem",
                    }}
                    disabled={loading}
                  />
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
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link
            href="/login"
            style={{
              color: "var(--text-muted)", fontSize: "0.875rem", textDecoration: "none",
            }}
          >
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

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}
