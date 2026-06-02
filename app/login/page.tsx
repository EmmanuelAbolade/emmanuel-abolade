// app/login/page.tsx
// Admin login page - authenticates via Supabase email and password

"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Code2, Eye, EyeOff, AlertCircle, Link, Loader } from "lucide-react"

function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const redirectTo   = searchParams.get("redirectTo") ?? "/admin/dashboard"

  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")

  const inputStyle = (hasError?: boolean) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    border: `1.5px solid ${hasError ? "#ef4444" : "var(--border)"}`,
    background: "var(--surface)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
    transition: "border-color 0.2s ease",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.")
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email:    email.trim(),
      password: password.trim(),
    })

    if (authError) {
      setLoading(false)
      setError("Invalid email or password. Please try again.")
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.6rem",
            marginBottom: "2.5rem",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "2.25rem",
              height: "2.25rem",
              background: "var(--accent)",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Code2 size={18} color="var(--bg)" />
          </div>
          <span
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.25rem",
              color: "var(--text-primary)",
            }}
          >
            Emmanuel<span style={{ color: "var(--accent)" }}>.</span>
          </span>
        </div>

        {/* Card */}
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "0.75rem",
            padding: "2.5rem",
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}
        >
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "1.75rem",
              color: "var(--text-primary)",
              marginBottom: "0.4rem",
            }}
          >
            Admin Login
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              marginBottom: "2rem",
            }}
          >
            Sign in to manage your website content.
          </p>

          {/* Error message */}
          {error && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "#fee2e2",
                border: "1px solid #ef4444",
                borderRadius: "0.375rem",
                padding: "0.75rem 1rem",
                marginBottom: "1.5rem",
                fontSize: "0.875rem",
                color: "#dc2626",
              }}
            >
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError("")
                }}
                placeholder="your@email.com"
                autoComplete="email"
                style={inputStyle(!!error)}
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  marginBottom: "0.4rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError("")
                  }}
                  placeholder="Your password"
                  autoComplete="current-password"
                  style={{ ...inputStyle(!!error), paddingRight: "3rem" }}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                justifyContent: "center",
                marginTop: "0.5rem",
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              
              {loading ? (
                <>
                  <Loader
                    size={16}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
            <div style={{ textAlign: "center", marginTop: "1rem" }}>
              <Link
                href="/forgot-password"
                style={{
                  fontSize: "0.825rem",
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.8rem",
            color: "var(--text-muted)",
          }}
        >
          This page is for site administrators only.
        </p>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
