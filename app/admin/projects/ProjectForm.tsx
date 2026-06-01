// app/admin/projects/ProjectForm.tsx
// Reusable form component for creating and editing projects
// Used by both /admin/projects/new and /admin/projects/[id]/edit

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Save, Loader, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Project = {
  id?: string
  title: string
  slug: string
  excerpt: string
  description: string
  technologies: string[]
  my_role: string
  client: string
  status: string
  difficulty_level: string
  repository_url: string
  showcase_url: string
  live_url: string
  image_url: string
  key_achievements: string[]
  learnings: string
  start_date: string
  end_date: string
  featured: boolean
  published: boolean
  pinned_order: string
}

const STATUSES     = ["In Progress", "Completed", "Maintained", "Archived"]
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"]

const empty: Project = {
  title: "", slug: "", excerpt: "", description: "",
  technologies: [], my_role: "", client: "", status: "Completed",
  difficulty_level: "Intermediate", repository_url: "", showcase_url: "",
  live_url: "", image_url: "", key_achievements: [], learnings: "",
  start_date: "", end_date: "", featured: false, published: false,
  pinned_order: "",
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: "0.4rem",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "0.375rem",
  border: "1.5px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  outline: "none",
  fontFamily: "DM Sans, sans-serif",
  transition: "border-color 0.2s ease",
}

const hintStyle: React.CSSProperties = {
  fontSize: "0.78rem",
  color: "var(--text-muted)",
  marginTop: "0.25rem",
}

export default function ProjectForm({
  initial,
}: {
  initial?: Partial<Project>
}) {
  const router = useRouter()
  const isEdit = !!initial?.id

  const [form, setForm]     = useState<Project>({ ...empty, ...initial, technologies: initial?.technologies ?? [], key_achievements: initial?.key_achievements ?? [] })
  const [techInput, setTechInput]   = useState("")
  const [achInput, setAchInput]     = useState("")
  const [saving, setSaving]         = useState(false)
  const [error, setError]           = useState("")

  function set(field: keyof Project, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleTitleChange(val: string) {
    set("title", val)
    if (!isEdit) set("slug", slugify(val))
  }

  function addTech() {
    const t = techInput.trim()
    if (t && !form.technologies.includes(t)) {
      set("technologies", [...form.technologies, t])
    }
    setTechInput("")
  }

  function removeTech(t: string) {
    set("technologies", form.technologies.filter((x) => x !== t))
  }

  function addAch() {
    const a = achInput.trim()
    if (a) set("key_achievements", [...form.key_achievements, a])
    setAchInput("")
  }

  function removeAch(i: number) {
    set("key_achievements", form.key_achievements.filter((_, idx) => idx !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.title.trim()) { setError("Title is required."); return }
    if (!form.slug.trim())  { setError("Slug is required.");  return }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      title:            form.title.trim(),
      slug:             form.slug.trim(),
      excerpt:          form.excerpt.trim() || null,
      description:      form.description.trim() || null,
      technologies:     form.technologies,
      my_role:          form.my_role.trim() || null,
      client:           form.client.trim() || null,
      status:           form.status,
      difficulty_level: form.difficulty_level,
      repository_url:   form.repository_url.trim() || null,
      showcase_url:     form.showcase_url.trim() || null,
      live_url:         form.live_url.trim() || null,
      image_url:        form.image_url.trim() || null,
      key_achievements: form.key_achievements,
      learnings:        form.learnings.trim() || null,
      start_date:       form.start_date || null,
      end_date:         form.end_date || null,
      featured:         form.featured,
      published:        form.published,
      pinned_order:     form.pinned_order ? parseInt(form.pinned_order) : null,
    }

    let dbError
    if (isEdit) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", initial!.id!)
      dbError = error
    } else {
      const { error } = await supabase.from("projects").insert(payload)
      dbError = error
    }

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
      return
    }

    router.push("/admin/projects")
    router.refresh()
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "860px" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/projects"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            color: "var(--text-muted)",
            fontSize: "0.85rem",
            textDecoration: "none",
            marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>
        <h1
          style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "2rem",
            color: "var(--text-primary)",
          }}
        >
          {isEdit ? "Edit Project" : "New Project"}
        </h1>
      </div>

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
        style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
      >
        {/* Title and Slug */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          <div>
            <label style={labelStyle}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={inputStyle}
              placeholder="Project title"
              required
            />
          </div>
          <div>
            <label style={labelStyle}>
              Slug <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              style={inputStyle}
              placeholder="project-slug"
              required
            />
            <p style={hintStyle}>Auto-generated from title. Used in URLs.</p>
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label style={labelStyle}>Excerpt</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => set("excerpt", e.target.value)}
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            placeholder="Short summary shown on project cards"
            maxLength={300}
          />
          <p style={hintStyle}>{form.excerpt.length} / 300</p>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Full Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            style={{ ...inputStyle, minHeight: "160px", resize: "vertical" }}
            placeholder="Full project description — supports plain text"
          />
        </div>

        {/* Technologies */}
        <div>
          <label style={labelStyle}>Technologies</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTech() } }}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="e.g. Next.js — press Enter to add"
            />
            <button
              type="button"
              onClick={addTech}
              className="btn-outline"
              style={{ whiteSpace: "nowrap", padding: "0.75rem 1rem" }}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {form.technologies.map((t) => (
              <span
                key={t}
                className="tag"
                style={{ cursor: "pointer", gap: "0.4rem" }}
                onClick={() => removeTech(t)}
                title="Click to remove"
              >
                {t} &times;
              </span>
            ))}
          </div>
        </div>

        {/* Role, Client, Status, Difficulty */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}
        >
          <div>
            <label style={labelStyle}>My Role</label>
            <input
              type="text"
              value={form.my_role}
              onChange={(e) => set("my_role", e.target.value)}
              style={inputStyle}
              placeholder="e.g. Full-stack Developer"
            />
          </div>
          <div>
            <label style={labelStyle}>Client / For</label>
            <input
              type="text"
              value={form.client}
              onChange={(e) => set("client", e.target.value)}
              style={inputStyle}
              placeholder="e.g. Personal, University"
            />
          </div>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Difficulty</label>
            <select
              value={form.difficulty_level}
              onChange={(e) => set("difficulty_level", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* URLs */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem" }}
        >
          <div>
            <label style={labelStyle}>Repository URL</label>
            <input
              type="url"
              value={form.repository_url}
              onChange={(e) => set("repository_url", e.target.value)}
              style={inputStyle}
              placeholder="https://github.com/..."
            />
          </div>
          <div>
            <label style={labelStyle}>Showcase URL</label>
            <input
              type="url"
              value={form.showcase_url}
              onChange={(e) => set("showcase_url", e.target.value)}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
          <div>
            <label style={labelStyle}>Live App URL</label>
            <input
              type="url"
              value={form.live_url}
              onChange={(e) => set("live_url", e.target.value)}
              style={inputStyle}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label style={labelStyle}>Image URL</label>
          <input
            type="url"
            value={form.image_url}
            onChange={(e) => set("image_url", e.target.value)}
            style={inputStyle}
            placeholder="https://... (hosted image URL)"
          />
          <p style={hintStyle}>Paste a hosted image URL. Supabase Storage upload coming soon.</p>
        </div>

        {/* Key Achievements */}
        <div>
          <label style={labelStyle}>Key Achievements</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={achInput}
              onChange={(e) => setAchInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAch() } }}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="e.g. Reduced load time by 40% — press Enter to add"
            />
            <button
              type="button"
              onClick={addAch}
              className="btn-outline"
              style={{ whiteSpace: "nowrap", padding: "0.75rem 1rem" }}
            >
              Add
            </button>
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            {form.key_achievements.map((a, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                {a}
                <button
                  type="button"
                  onClick={() => removeAch(i)}
                  style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "0.8rem" }}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Learnings */}
        <div>
          <label style={labelStyle}>Learnings</label>
          <textarea
            value={form.learnings}
            onChange={(e) => set("learnings", e.target.value)}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            placeholder="What did you learn from this project?"
          />
        </div>

        {/* Dates */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          <div>
            <label style={labelStyle}>Start Date</label>
            <input
              type="date"
              value={form.start_date}
              onChange={(e) => set("start_date", e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>End Date</label>
            <input
              type="date"
              value={form.end_date}
              onChange={(e) => set("end_date", e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Pinned order */}
        <div style={{ maxWidth: "200px" }}>
          <label style={labelStyle}>Pinned Order</label>
          <input
            type="number"
            min="1"
            max="99"
            value={form.pinned_order}
            onChange={(e) => set("pinned_order", e.target.value)}
            style={inputStyle}
            placeholder="e.g. 1, 2, 3"
          />
          <p style={hintStyle}>Controls homepage display order. Leave blank to unpin.</p>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
          {[
            { field: "featured", label: "Mark as Featured" },
            { field: "published", label: "Publish (visible to public)" },
          ].map(({ field, label }) => (
            <label
              key={field}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                cursor: "pointer",
                fontSize: "0.9rem",
                color: "var(--text-primary)",
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={form[field as "featured" | "published"]}
                onChange={(e) => set(field as keyof Project, e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent)" }}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Submit */}
        <div style={{ display: "flex", gap: "1rem", paddingTop: "0.5rem" }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary"
            style={{
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? (
              <>
                <Loader size={16} style={{ animation: "spin 1s linear infinite" }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                {isEdit ? "Save Changes" : "Create Project"}
              </>
            )}
          </button>
          <Link href="/admin/projects" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
