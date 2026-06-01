// app/admin/resources/ResourceForm.tsx
// Reusable form for creating and editing resources
// Used by both /admin/resources/new and /admin/resources/[id]/edit

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Save, Loader, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

type Resource = {
  id?: string
  title: string
  url: string
  description: string
  my_take: string
  resource_type: string
  pricing_model: string
  tags: string[]
  logo_url: string
  is_downloadable: boolean
  is_affiliate: boolean
  coupon_code: string
  discount_amount: string
  featured: boolean
  published: boolean
  pinned_order: string
}

const RESOURCE_TYPES = [
  "Book", "Video", "Tool", "Course",
  "Cheat Sheet", "Library", "Article", "Podcast", "Newsletter",
]

const PRICING_MODELS = ["Free", "Freemium", "Paid", "Open Source"]

const empty: Resource = {
  title: "", url: "", description: "", my_take: "",
  resource_type: "Tool", pricing_model: "Free",
  tags: [], logo_url: "", is_downloadable: false,
  is_affiliate: false, coupon_code: "", discount_amount: "",
  featured: false, published: false, pinned_order: "",
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

export default function ResourceForm({ initial }: { initial?: Partial<Resource> }) {
  const router  = useRouter()
  const isEdit  = !!initial?.id

  const [form, setForm] = useState<Resource>({
  ...empty,
  ...initial,
  tags:            initial?.tags ?? [],
  coupon_code:     initial?.coupon_code ?? "",
  discount_amount: initial?.discount_amount ?? "",
  logo_url:        initial?.logo_url ?? "",
  my_take:         initial?.my_take ?? "",
  description:     initial?.description ?? "",
})
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState("")

  function set(field: keyof Resource, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }))
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!form.title.trim()) { setError("Title is required."); return }
    if (!form.url.trim())   { setError("URL is required.");   return }

    try {
      new URL(form.url)
    } catch {
      setError("Please enter a valid URL including https://")
      return
    }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      title:           form.title.trim(),
      url:             form.url.trim(),
      description:     form.description.trim() || null,
      my_take:         form.my_take.trim() || null,
      resource_type:   form.resource_type || null,
      pricing_model:   form.pricing_model || null,
      tags:            form.tags,
      logo_url:        form.logo_url.trim() || null,
      is_downloadable: form.is_downloadable,
      is_affiliate:    form.is_affiliate,
      coupon_code:     form.coupon_code.trim() || null,
      discount_amount: form.discount_amount.trim() || null,
      featured:        form.featured,
      published:       form.published,
      pinned_order:    form.pinned_order ? parseInt(form.pinned_order) : null,
    }

    let dbError
    if (isEdit) {
      const { error } = await supabase.from("resources").update(payload).eq("id", initial!.id!)
      dbError = error
    } else {
      const { error } = await supabase.from("resources").insert(payload)
      dbError = error
    }

    if (dbError) {
      setError(dbError.message ?? "Failed to save resource.")
      setSaving(false)
      return
    }

    router.refresh()
    router.push("/admin/resources")
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "860px" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          href="/admin/resources"
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            color: "var(--text-muted)", fontSize: "0.85rem",
            textDecoration: "none", marginBottom: "1rem",
          }}
        >
          <ArrowLeft size={14} />
          Back to Resources
        </Link>
        <h1 style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "2rem", color: "var(--text-primary)",
        }}>
          {isEdit ? "Edit Resource" : "New Resource"}
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
        {/* Title and URL */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              style={inputStyle}
              placeholder="Resource title"
              required
            />
          </div>
          <div>
            <label style={labelStyle}>
              URL <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="url"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              style={inputStyle}
              placeholder="https://..."
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            placeholder="Short description of what this resource is"
            maxLength={300}
          />
          <p style={hintStyle}>{form.description.length} / 300</p>
        </div>

        {/* My Take */}
        <div>
          <label style={labelStyle}>My Take</label>
          <textarea
            value={form.my_take}
            onChange={(e) => set("my_take", e.target.value)}
            style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
            placeholder="Why do you recommend this? What problem does it solve for you?"
            maxLength={500}
          />
          <p style={hintStyle}>
            Shown on the resource card with an accent border. {form.my_take.length} / 500
          </p>
        </div>

        {/* Type, Pricing, Pinned Order */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Resource Type</label>
            <select
              value={form.resource_type}
              onChange={(e) => set("resource_type", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {RESOURCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Pricing Model</label>
            <select
              value={form.pricing_model}
              onChange={(e) => set("pricing_model", e.target.value)}
              style={{ ...inputStyle, cursor: "pointer" }}
            >
              {PRICING_MODELS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Discount Amount</label>
            <input
              type="text"
              value={form.discount_amount}
              onChange={(e) => set("discount_amount", e.target.value)}
              style={inputStyle}
              placeholder="e.g. 20% OFF"
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

        {/* Logo URL and Coupon Code */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Logo URL</label>
            <input
              type="url"
              value={form.logo_url}
              onChange={(e) => set("logo_url", e.target.value)}
              style={inputStyle}
              placeholder="https://... (small brand logo)"
            />
            <p style={hintStyle}>Small square logo shown on the resource card.</p>
          </div>
          <div>
            <label style={labelStyle}>Coupon Code</label>
            <input
              type="text"
              value={form.coupon_code}
              onChange={(e) => set("coupon_code", e.target.value)}
              style={inputStyle}
              placeholder="e.g. MYPORTFOLIO20"
            />
            <p style={hintStyle}>Visitors can click to copy this code.</p>
          </div>
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
              placeholder="e.g. React — press Enter to add"
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

        {/* Toggles */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          {[
            { field: "featured",        label: "Mark as Featured"             },
            { field: "published",       label: "Publish (visible to public)"  },
            { field: "is_downloadable", label: "Is Downloadable"              },
            { field: "is_affiliate",    label: "Is Affiliate Link"            },
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
                checked={form[field as keyof Resource] as boolean}
                onChange={(e) => set(field as keyof Resource, e.target.checked)}
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
                {isEdit ? "Save Changes" : "Create Resource"}
              </>
            )}
          </button>
          <Link href="/admin/resources" className="btn-outline">
            Cancel
          </Link>
        </div>
      </form>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
