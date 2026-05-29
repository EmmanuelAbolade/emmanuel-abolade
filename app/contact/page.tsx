// app/contact/page.tsx
// Contact page - contact form with validation, enquiry type, and Resend email integration

"use client"

import { useState } from "react"
import {
  Mail,
  MapPin,
  GitBranch,
  Briefcase,
  Send,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react"

const ENQUIRY_TYPES = [
  "Job Opportunity",
  "Freelance Project",
  "Collaboration",
  "General Enquiry",
]

type FormState = {
  name: string
  email: string
  enquiry_type: string
  subject: string
  message: string
}

type Status = "idle" | "loading" | "success" | "error"

const initialForm: FormState = {
  name:         "",
  email:        "",
  enquiry_type: "",
  subject:      "",
  message:      "",
}

export default function ContactPage() {
  const [form, setForm]         = useState<FormState>(initialForm)
  const [status, setStatus]     = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [errors, setErrors]     = useState<Partial<FormState>>({})

  function validate(): boolean {
    const newErrors: Partial<FormState> = {}

    if (!form.name.trim()) {
      newErrors.name = "Name is required."
    }
    if (!form.email.trim()) {
      newErrors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address."
    }
    if (!form.message.trim()) {
      newErrors.message = "Message is required."
    } else if (form.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear field error on change
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
        return
      }

      setStatus("success")
      setForm(initialForm)
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please check your connection and try again.")
    }
  }

  const inputStyle = (hasError?: string) => ({
    width: "100%",
    padding: "0.75rem 1rem",
    borderRadius: "0.375rem",
    border: `1.5px solid ${hasError ? "#ef4444" : "var(--border)"}`,
    background: "var(--surface)",
    color: "var(--text-primary)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s ease",
    fontFamily: "DM Sans, sans-serif",
  })

  const labelStyle = {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: 600,
    color: "var(--text-primary)",
    marginBottom: "0.4rem",
  }

  const errorStyle = {
    fontSize: "0.8rem",
    color: "#ef4444",
    marginTop: "0.3rem",
    display: "flex",
    alignItems: "center",
    gap: "0.3rem",
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Page header */}
      <section
        style={{
          padding: "5rem 0 4rem",
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <p
            style={{
              fontSize: "0.85rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "1rem",
            }}
          >
            Get in Touch
          </p>
          <h1
            style={{
              fontFamily: "DM Serif Display, serif",
              fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
              color: "var(--text-primary)",
              marginBottom: "1rem",
            }}
          >
            Let us work together.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.05rem",
              maxWidth: "520px",
              lineHeight: 1.7,
            }}
          >
            Whether you have a project in mind, a job opportunity, or just want
            to say hello — my inbox is always open.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="section">
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: "4rem",
              alignItems: "start",
            }}
          >

            {/* Left: contact info */}
            <div>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Contact Info
              </h2>
              <div className="divider" />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      minWidth: "2.25rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Mail size={15} color="var(--accent)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Email
                    </p>
                    <a
                      href="mailto:emab.dev.tech@gmail.com"
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      emab.dev.tech@gmail.com
                    </a>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      minWidth: "2.25rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MapPin size={15} color="var(--accent)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Location
                    </p>
                    <p style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>
                      Ireland
                    </p>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      minWidth: "2.25rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <GitBranch size={15} color="var(--accent)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      GitHub
                    </p>
                    <a
                      href="https://github.com/EmmanuelAbolade"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      github.com/EmmanuelAbolade
                    </a>
                  </div>
                </div>

                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}
                >
                  <div
                    style={{
                      width: "2.25rem",
                      height: "2.25rem",
                      minWidth: "2.25rem",
                      background: "var(--accent-subtle)",
                      borderRadius: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Briefcase size={15} color="var(--accent)" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "0.25rem",
                      }}
                    >
                      LinkedIn
                    </p>
                    <a
                      href="https://linkedin.com/in/emmanuel-abolade"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        textDecoration: "none",
                      }}
                    >
                      linkedin.com/in/emmanuel-abolade
                    </a>
                  </div>
                </div>
              </div>

              {/* Availability note */}
              <div
                style={{
                  marginTop: "2.5rem",
                  padding: "1.25rem",
                  background: "var(--accent-subtle)",
                  border: "1px solid var(--accent)",
                  borderRadius: "0.5rem",
                }}
              >
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--accent)",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Currently available
                </p>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  Open to full-time roles, freelance projects, and
                  collaborations. Typical response time is within 24 hours.
                </p>
              </div>
            </div>

            {/* Right: contact form */}
            <div>
              <h2
                style={{
                  fontFamily: "DM Serif Display, serif",
                  fontSize: "1.5rem",
                  color: "var(--text-primary)",
                  marginBottom: "0.5rem",
                }}
              >
                Send a Message
              </h2>
              <div className="divider" />

              {/* Success state */}
              {status === "success" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    background: "#dcfce7",
                    border: "1px solid #16a34a",
                    borderRadius: "0.5rem",
                    padding: "1.25rem",
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <CheckCircle size={20} color="#16a34a" style={{ minWidth: 20 }} />
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#15803d",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Message sent successfully
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#166534" }}>
                      Thank you for reaching out. I will get back to you within
                      24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {status === "error" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    background: "#fee2e2",
                    border: "1px solid #ef4444",
                    borderRadius: "0.5rem",
                    padding: "1.25rem",
                    marginTop: "1.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <AlertCircle size={20} color="#ef4444" style={{ minWidth: 20 }} />
                  <div>
                    <p
                      style={{
                        fontWeight: 600,
                        color: "#dc2626",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Failed to send message
                    </p>
                    <p style={{ fontSize: "0.875rem", color: "#b91c1c" }}>
                      {errorMsg}
                    </p>
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                noValidate
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  marginTop: "1.5rem",
                }}
              >
                {/* Name and Email row */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <label htmlFor="name" style={labelStyle}>
                      Name <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      style={inputStyle(errors.name)}
                      autoComplete="name"
                      maxLength={100}
                    />
                    {errors.name && (
                      <p style={errorStyle}>
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" style={labelStyle}>
                      Email <span style={{ color: "#ef4444" }}>*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handleChange}
                      style={inputStyle(errors.email)}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p style={errorStyle}>
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Enquiry type */}
                <div>
                  <label htmlFor="enquiry_type" style={labelStyle}>
                    Enquiry Type
                  </label>
                  <select
                    id="enquiry_type"
                    name="enquiry_type"
                    value={form.enquiry_type}
                    onChange={handleChange}
                    style={{
                      ...inputStyle(),
                      cursor: "pointer",
                    }}
                  >
                    <option value="">Select an enquiry type...</option>
                    {ENQUIRY_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" style={labelStyle}>
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="What is this about?"
                    value={form.subject}
                    onChange={handleChange}
                    style={inputStyle()}
                    maxLength={200}
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" style={labelStyle}>
                    Message <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project, opportunity, or just say hello..."
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    maxLength={5000}
                    style={{
                      ...inputStyle(errors.message),
                      resize: "vertical",
                      minHeight: "140px",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "0.3rem",
                    }}
                  >
                    {errors.message ? (
                      <p style={errorStyle}>
                        <AlertCircle size={12} />
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                        marginLeft: "auto",
                      }}
                    >
                      {form.message.length} / 5000
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary"
                  style={{
                    alignSelf: "flex-start",
                    opacity: status === "loading" ? 0.7 : 1,
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    minWidth: "160px",
                    justifyContent: "center",
                  }}
                >
                  {status === "loading" ? (
                    <>
                      <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
          .contact-name-email { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
