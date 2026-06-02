// app/admin/testimonials/TestimonialForm.tsx
// Reusable form for creating and editing testimonials

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Save, Loader, AlertCircle, ArrowLeft, Star } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/components/ImageUpload"

type Testimonial = {
  id?: string
  name: string
  role: string
  company: string
  avatar_url: string
  content: string
  rating: number
  project: string
  published: boolean
}

const empty: Testimonial = {
  name: "", role: "", company: "", avatar_url: "",
  content: "", rating: 5, project: "", published: false,
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.85rem",
  fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.75rem 1rem", borderRadius: "0.375rem",
  border: "1.5px solid var(--border)", background: "var(--surface)",
  color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
  fontFamily: "DM Sans, sans-serif", transition: "border-color 0.2s ease",
}

export default function TestimonialForm({ initial }: { initial?: Partial<Testimonial> }) {
  const router = useRouter()
  const isEdit = !!initial?.id

  const [form, setForm] = useState<Testimonial>({
    ...empty,
    ...initial,
    name:       initial?.name       ?? "",
    role:       initial?.role       ?? "",
    company:    initial?.company    ?? "",
    avatar_url: initial?.avatar_url ?? "",
    content:    initial?.content    ?? "",
    project:    initial?.project    ?? "",
    rating:     initial?.rating     ?? 5,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

  function set(field: keyof Testimonial, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.name.trim())    { setError("Name is required.");    return }
    if (!form.content.trim()) { setError("Content is required."); return }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      name:       form.name.trim(),
      role:       form.role.trim() || null,
      company:    form.company.trim() || null,
      avatar_url: form.avatar_url.trim() || null,
      content:    form.content.trim(),
      rating:     form.rating,
      project:    form.project.trim() || null,
      published:  form.published,
    }

    let dbError
    if (isEdit) {
      const { error } = await supabase
        .from("testimonials").update(payload).eq("id", initial!.id!)
      dbError = error
    } else {
      const { error } = await supabase.from("testimonials").insert(payload)
      dbError = error
    }

    if (dbError) {
      setError(dbError.message ?? "Failed to save testimonial.")
      setSaving(false)
      return
    }

    router.refresh()
    router.push("/admin/testimonials")
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "720px" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/testimonials"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            color: "var(--text-muted)", fontSize: "0.85rem",
            textDecoration: "none", marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={14} />
          Back to Testimonials
        </Link>
        <h1 style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "2rem", color: "var(--text-primary)",
        }}>
          {isEdit ? "Edit Testimonial" : "New Testimonial"}
        </h1>
      </div>

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
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Name, Role, Company */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>
              Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              style={inputStyle}
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Role / Title</label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              style={inputStyle}
              placeholder="e.g. Software Engineer"
            />
          </div>
          <div>
            <label style={labelStyle}>Company / Organisation</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => set("company", e.target.value)}
              style={inputStyle}
              placeholder="e.g. Google"
            />
          </div>
        </div>

        {/* Project */}
        <div>
          <label style={labelStyle}>Project / Context</label>
          <input
            type="text"
            value={form.project}
            onChange={(e) => set("project", e.target.value)}
            style={inputStyle}
            placeholder="e.g. SplitSync, NetGuard, Freelance work"
          />
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            What project or context is this testimonial about?
          </p>
        </div>

        {/* Content */}
        <div>
          <label style={labelStyle}>
            Testimonial <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            style={{ ...inputStyle, minHeight: "140px", resize: "vertical" }}
            placeholder="What did they say about your work?"
            required
            maxLength={1000}
          />
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            {form.content.length} / 1000
          </p>
        </div>

        {/* Rating */}
        <div>
          <label style={labelStyle}>Rating</label>
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => set("rating", star)}
                style={{
                  background: "none", border: "none",
                  cursor: "pointer", padding: "0.25rem",
                  transition: "transform 0.1s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.2)" }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)" }}
              >
                <Star
                  size={24}
                  color="#f59e0b"
                  fill={star <= form.rating ? "#f59e0b" : "none"}
                />
              </button>
            ))}
            <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginLeft: "0.25rem" }}>
              {form.rating} / 5
            </span>
          </div>
        </div>

        {/* Avatar */}
        <ImageUpload
          label="Avatar / Photo"
          value={form.avatar_url}
          onChange={(url) => set("avatar_url", url)}
          folder="avatars"
          aspectRatio="1/1"
        />

        {/* Publish toggle */}
        <label style={{
          display: "flex", alignItems: "center", gap: "0.6rem",
          cursor: "pointer", fontSize: "0.9rem",
          color: "var(--text-primary)", fontWeight: 500,
        }}>
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
            style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent)" }}
          />
          Publish (visible to public)
        </label>

        {/* Submit */}
        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{ opacity: saving ? 0.7 : 1, cursor: saving ? "not-allowed" : "pointer" }}
          >
            {saving ? (
              <>
                <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? "Save Changes" : "Create Testimonial"}
              </>
            )}
          </button>
          <Link href="/admin/testimonials" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
