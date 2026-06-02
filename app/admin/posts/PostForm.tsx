// app/admin/posts/PostForm.tsx
// Reusable form for creating and editing blog posts
// Includes TipTap rich text editor, SEO fields, and all post metadata

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { createClient } from "@/lib/supabase/client"
import { Save, Loader, AlertCircle, ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import ImageUpload from "@/components/ImageUpload"

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{
      border: "1.5px solid var(--border)",
      borderRadius: "0.5rem",
      background: "var(--surface)",
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "var(--text-muted)",
      fontSize: "0.875rem",
    }}>
      Loading editor...
    </div>
  ),
})

type Post = {
  id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  cover_image: string
  hide_cover_image: boolean
  meta_description: string
  canonical_url: string
  tags: string[]
  status: string
  featured: boolean
  allow_comments: boolean
  show_table_of_contents: boolean
  layout_style: string
  reading_time: string
  pinned_order: string
}

const STATUSES      = ["draft", "review", "published", "archived"]
const LAYOUT_STYLES = ["standard", "minimal", "case_study", "hero_image"]

const empty: Post = {
  title: "", slug: "", excerpt: "", content: "", cover_image: "",
  hide_cover_image: false, meta_description: "", canonical_url: "",
  tags: [], status: "draft", featured: false, allow_comments: true,
  show_table_of_contents: false, layout_style: "standard",
  reading_time: "", pinned_order: "",
}

function slugify(str: string): string {
  return str.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
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

const hintStyle: React.CSSProperties = {
  fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.25rem",
}

export default function PostForm({ initial }: { initial?: Partial<Post> }) {
  const router = useRouter()
  const isEdit = !!initial?.id

  const [form, setForm]         = useState<Post>({ ...empty, ...initial, tags: initial?.tags ?? [] })
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState("")

  function set(field: keyof Post, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleTitleChange(val: string) {
    set("title", val)
    if (!isEdit) set("slug", slugify(val))
  }

  function addTag() {
    const t = tagInput.trim()
    if (t && !form.tags.includes(t)) {
      set("tags", [...form.tags, t])
    }
    setTagInput("")
  }

  function removeTag(t: string) {
    set("tags", form.tags.filter((x) => x !== t))
  }

  // Auto-calculate reading time from content word count
  useEffect(() => {
    if (form.content) {
      const text      = form.content.replace(/<[^>]*>/g, " ")
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length
      const mins      = Math.max(1, Math.ceil(wordCount / 200))
      set("reading_time", mins.toString())
    }
  }, [form.content])

  async function handleSubmit(e: React.FormEvent, asDraft = false) {
    e.preventDefault()
    setError("")

    if (!form.title.trim()) { setError("Title is required."); return }
    if (!form.slug.trim())  { setError("Slug is required.");  return }

    const finalStatus = asDraft ? "draft" : form.status
    setSaving(true)

    const supabase = createClient()
    const payload = {
      title:                  form.title.trim(),
      slug:                   form.slug.trim(),
      excerpt:                form.excerpt.trim() || null,
      content:                form.content || null,
      cover_image:            form.cover_image.trim() || null,
      hide_cover_image:       form.hide_cover_image,
      meta_description:       form.meta_description.trim() || null,
      canonical_url:          form.canonical_url.trim() || null,
      tags:                   form.tags,
      status:                 finalStatus,
      featured:               form.featured,
      allow_comments:         form.allow_comments,
      show_table_of_contents: form.show_table_of_contents,
      layout_style:           form.layout_style,
      reading_time:           form.reading_time ? parseInt(form.reading_time) : null,
      pinned_order:           form.pinned_order ? parseInt(form.pinned_order) : null,
      published_at:           finalStatus === "published" ? new Date().toISOString() : null,
    }

    let dbError
    if (isEdit) {
      const { error } = await supabase.from("posts").update(payload).eq("id", initial!.id!)
      dbError = error
    } else {
      const { error } = await supabase.from("posts").insert(payload)
      dbError = error
    }

    if (dbError) {
      console.error("Post save error:", dbError)
      setError(dbError.message ?? "Failed to save post. Please try again.")
      setSaving(false)
      return
    }

    router.refresh()
    router.push("/admin/posts")
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "960px" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/posts"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            color: "var(--text-muted)", fontSize: "0.85rem",
            textDecoration: "none", marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={14} />
          Back to Posts
        </Link>
        <h1 style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "2rem", color: "var(--text-primary)",
        }}>
          {isEdit ? "Edit Post" : "New Post"}
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
        {/* Title and Slug */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              style={inputStyle}
              placeholder="Post title"
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
              placeholder="post-slug"
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
            placeholder="Short summary shown on blog cards"
            maxLength={300}
          />
          <p style={hintStyle}>{form.excerpt.length} / 300</p>
        </div>

        {/* Content editor */}
        <div>
          <label style={labelStyle}>Content</label>
          <RichTextEditor
            content={form.content}
            onChange={(html) => set("content", html)}
            placeholder="Start writing your post..."
          />
          <p style={hintStyle}>
            Reading time auto-calculated: {form.reading_time ? `${form.reading_time} min` : "—"}
          </p>
        </div>

        {/* Cover image */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <ImageUpload
            label="Cover Image"
            value={form.cover_image}
            onChange={(url) => set("cover_image", url)}
            folder="posts"
            aspectRatio="16/9"
          />
          <label style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            cursor: "pointer", fontSize: "0.875rem",
            color: "var(--text-secondary)", fontWeight: 500,
          }}>
            <input
              type="checkbox"
              checked={form.hide_cover_image}
              onChange={(e) => set("hide_cover_image", e.target.checked)}
              style={{ width: "15px", height: "15px", accentColor: "var(--accent)" }}
            />
            Hide cover image
          </label>
        </div>

        {/* Tags */}
        <div>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
              style={{ ...inputStyle, flex: 1 }}
              placeholder="e.g. Next.js — press Enter to add"
            />
            <button
              type="button"
              onClick={addTag}
              className="btn-outline"
              style={{ whiteSpace: "nowrap", padding: "0.75rem 1rem" }}
            >
              Add
            </button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {form.tags.map((t) => (
              <span
                key={t}
                className="tag"
                style={{ cursor: "pointer", gap: "0.4rem" }}
                onClick={() => removeTag(t)}
                title="Click to remove"
              >
                {t} &times;
              </span>
            ))}
          </div>
        </div>

        {/* Status, Layout, Pinned Order */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s} style={{ textTransform: "capitalize" }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Layout Style</label>
            <select
              value={form.layout_style}
              onChange={(e) => set("layout_style", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {LAYOUT_STYLES.map((l) => (
                <option key={l} value={l}>
                  {l.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Reading Time (min)</label>
            <input
              type="number"
              min="1"
              value={form.reading_time}
              onChange={(e) => set("reading_time", e.target.value)}
              style={inputStyle}
              placeholder="Auto-calculated"
            />
          </div>
          <div>
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
          </div>
        </div>

        {/* SEO section */}
        <div style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "0.5rem",
          padding: "1.25rem",
        }}>
          <h3 style={{
            fontFamily: "DM Serif Display, serif",
            fontSize: "1rem", color: "var(--text-primary)",
            marginBottom: "1rem",
          }}>
            SEO Settings
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Meta Description</label>
              <textarea
                value={form.meta_description}
                onChange={(e) => set("meta_description", e.target.value)}
                style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }}
                placeholder="Description shown in search results (max 160 characters)"
                maxLength={160}
              />
              <p style={hintStyle}>{form.meta_description.length} / 160</p>
            </div>
            <div>
              <label style={labelStyle}>Canonical URL</label>
              <input
                type="url"
                value={form.canonical_url}
                onChange={(e) => set("canonical_url", e.target.value)}
                style={inputStyle}
                placeholder="https://... (only needed if cross-posting)"
              />
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {[
            { field: "featured",               label: "Mark as Featured"          },
            { field: "allow_comments",         label: "Allow Comments"            },
            { field: "show_table_of_contents", label: "Show Table of Contents"    },
          ].map(({ field, label }) => (
            <label
              key={field}
              style={{
                display: "flex", alignItems: "center", gap: "0.6rem",
                cursor: "pointer", fontSize: "0.9rem",
                color: "var(--text-primary)", fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                checked={form[field as keyof Post] as boolean}
                onChange={(e) => set(field as keyof Post, e.target.checked)}
                style={{ width: "16px", height: "16px", cursor: "pointer", accentColor: "var(--accent)" }}
              />
              {label}
            </label>
          ))}
        </div>

        {/* Submit buttons */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
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
                {isEdit ? "Save Changes" : "Create Post"}
              </>
            )}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={(e) => handleSubmit(e as unknown as React.FormEvent, true)}
            className="btn-outline"
          >
            Save as Draft
          </button>
          <Link href="/admin/posts" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
