// app/admin/categories/CategoriesClient.tsx
// Client component for admin categories page
// Features: inline create, inline edit, delete with confirmation

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Loader,
  Tag,
  Save,
} from "lucide-react"

type Category = {
  id: string
  name: string
  slug: string
  created_at: string
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

const inputStyle: React.CSSProperties = {
  padding: "0.55rem 0.85rem",
  borderRadius: "0.375rem",
  border: "1.5px solid var(--border)",
  background: "var(--surface)",
  color: "var(--text-primary)",
  fontSize: "0.875rem",
  outline: "none",
  fontFamily: "DM Sans, sans-serif",
  transition: "border-color 0.2s ease",
}

// Inline create form
function CreateForm({ onCreated }: { onCreated: (cat: Category) => void }) {
  const [name, setName]     = useState("")
  const [slug, setSlug]     = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

  function handleNameChange(val: string) {
    setName(val)
    setSlug(slugify(val))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name.trim()) { setError("Name is required."); return }
    if (!slug.trim()) { setError("Slug is required.");  return }

    setSaving(true)
    const supabase = createClient()
    const { data, error: dbError } = await supabase
      .from("categories")
      .insert({ name: name.trim(), slug: slug.trim() })
      .select()
      .single()

    if (dbError) {
      setError(dbError.message.includes("unique")
        ? "A category with this slug already exists."
        : dbError.message)
      setSaving(false)
      return
    }

    onCreated(data)
    setName("")
    setSlug("")
    setSaving(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "var(--surface)",
        border: "1.5px solid var(--accent)",
        borderRadius: "0.75rem",
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <p style={{
        fontSize: "0.8rem", fontWeight: 700,
        color: "var(--accent)", textTransform: "uppercase",
        letterSpacing: "0.06em", marginBottom: "1rem",
        display: "flex", alignItems: "center", gap: "0.4rem",
      }}>
        <Plus size={13} /> New Category
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "end" }}>
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Machine Learning"
            style={{ ...inputStyle, width: "100%" }}
            required
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "0.3rem" }}>
            Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="machine-learning"
            style={{ ...inputStyle, width: "100%" }}
            required
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="btn-primary"
          style={{
            opacity: saving ? 0.7 : 1,
            cursor: saving ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {saving ? (
            <Loader size={14} style={{ animation: "spin 1s linear infinite" }} />
          ) : (
            <><Plus size={14} /> Add</>
          )}
        </button>
      </div>

      {error && (
        <p style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: "0.5rem" }}>
          {error}
        </p>
      )}
    </form>
  )
}

// Inline edit row
function EditRow({
  category,
  onSaved,
  onCancel,
}: {
  category: Category
  onSaved: (cat: Category) => void
  onCancel: () => void
}) {
  const [name, setName]     = useState(category.name)
  const [slug, setSlug]     = useState(category.slug)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

  function handleNameChange(val: string) {
    setName(val)
    setSlug(slugify(val))
  }

  async function handleSave() {
    setError("")
    if (!name.trim() || !slug.trim()) { setError("Name and slug are required."); return }

    setSaving(true)
    const supabase = createClient()
    const { data, error: dbError } = await supabase
      .from("categories")
      .update({ name: name.trim(), slug: slug.trim() })
      .eq("id", category.id)
      .select()
      .single()

    if (dbError) {
      setError(dbError.message)
      setSaving(false)
      return
    }

    onSaved(data)
    setSaving(false)
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "0.75rem", alignItems: "center" }}>
      <input
        type="text"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        style={{ ...inputStyle, width: "100%" }}
        autoFocus
      />
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        style={{ ...inputStyle, width: "100%", fontFamily: "monospace", fontSize: "0.82rem" }}
      />
      <div style={{ display: "flex", gap: "0.4rem" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.3rem",
            padding: "0.45rem 0.75rem", borderRadius: "0.375rem",
            border: "none", background: "var(--accent)", color: "var(--bg)",
            fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? <Loader size={12} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={12} />}
          Save
        </button>
        <button
          onClick={onCancel}
          style={{
            display: "inline-flex", alignItems: "center",
            padding: "0.45rem 0.6rem", borderRadius: "0.375rem",
            border: "1px solid var(--border)", background: "var(--surface)",
            color: "var(--text-muted)", fontSize: "0.8rem", cursor: "pointer",
          }}
        >
          <X size={12} />
        </button>
      </div>
      {error && (
        <p style={{ fontSize: "0.78rem", color: "#ef4444", gridColumn: "1 / -1" }}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function CategoriesClient({
  categories: initial,
}: {
  categories: Category[]
}) {
  const router                          = useRouter()
  const [categories, setCategories]     = useState(initial)
  const [editingId, setEditingId]       = useState<string | null>(null)
  const [deletingId, setDeletingId]     = useState<string | null>(null)
  const [deleteLoading, setDeleteLoad]  = useState(false)

  function handleCreated(cat: Category) {
    setCategories((prev) => [...prev, cat].sort((a, b) => a.name.localeCompare(b.name)))
  }

  function handleSaved(cat: Category) {
    setCategories((prev) =>
      prev.map((c) => (c.id === cat.id ? cat : c))
        .sort((a, b) => a.name.localeCompare(b.name))
    )
    setEditingId(null)
  }

  async function handleDelete(id: string) {
    setDeleteLoad(true)
    const supabase = createClient()
    await supabase.from("categories").delete().eq("id", id)
    setCategories((prev) => prev.filter((c) => c.id !== id))
    setDeletingId(null)
    setDeleteLoad(false)
    router.refresh()
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "760px" }}>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{
          fontFamily: "DM Serif Display, serif",
          fontSize: "2rem", color: "var(--text-primary)", marginBottom: "0.25rem",
        }}>
          Categories
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} — used by posts and resources.
        </p>
      </div>

      {/* Create form */}
      <CreateForm onCreated={handleCreated} />

      {/* Categories list */}
      {categories.length === 0 ? (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", padding: "3rem",
          textAlign: "center", color: "var(--text-muted)",
        }}>
          <Tag size={36} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
          <p style={{ fontSize: "0.9rem" }}>
            No categories yet. Create one above.
          </p>
        </div>
      ) : (
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "0.75rem", overflow: "hidden",
        }}>
          {/* Table header */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr auto",
            padding: "0.65rem 1.25rem",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            fontSize: "0.72rem", fontWeight: 700,
            color: "var(--text-muted)", textTransform: "uppercase",
            letterSpacing: "0.06em", gap: "1rem",
          }}>
            <span>Name</span>
            <span>Slug</span>
            <span>Actions</span>
          </div>

          <AnimatePresence initial={false}>
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{
                  padding: "0.85rem 1.25rem",
                  borderBottom: i < categories.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  {editingId === cat.id ? (
                    <EditRow
                      category={cat}
                      onSaved={handleSaved}
                      onCancel={() => setEditingId(null)}
                    />
                  ) : (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr auto",
                      alignItems: "center", gap: "1rem",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{
                          width: "1.75rem", height: "1.75rem",
                          background: "var(--accent-subtle)", borderRadius: "0.375rem",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0,
                        }}>
                          <Tag size={11} color="var(--accent)" />
                        </div>
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)" }}>
                          {cat.name}
                        </span>
                      </div>

                      <span style={{
                        fontSize: "0.82rem", color: "var(--text-muted)",
                        fontFamily: "monospace",
                        background: "var(--bg-secondary)",
                        padding: "0.2rem 0.5rem", borderRadius: "0.25rem",
                        display: "inline-block",
                      }}>
                        {cat.slug}
                      </span>

                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <button
                          onClick={() => { setEditingId(cat.id); setDeletingId(null) }}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "0.3rem",
                            padding: "0.35rem 0.65rem", borderRadius: "0.375rem",
                            border: "1px solid var(--border)", background: "var(--surface)",
                            color: "var(--text-secondary)", fontSize: "0.78rem",
                            cursor: "pointer", transition: "all 0.15s ease",
                          }}
                        >
                          <Pencil size={11} /> Edit
                        </button>

                        {deletingId === cat.id ? (
                          <div style={{ display: "flex", gap: "0.3rem" }}>
                            <button
                              onClick={() => handleDelete(cat.id)}
                              disabled={deleteLoading}
                              style={{
                                padding: "0.35rem 0.6rem", borderRadius: "0.375rem",
                                border: "1px solid #ef4444", background: "#ef4444",
                                color: "#fff", fontSize: "0.78rem",
                                cursor: deleteLoading ? "not-allowed" : "pointer",
                                display: "inline-flex", alignItems: "center", gap: "0.25rem",
                              }}
                            >
                              {deleteLoading
                                ? <Loader size={11} style={{ animation: "spin 1s linear infinite" }} />
                                : <Check size={11} />}
                              Yes
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              style={{
                                padding: "0.35rem 0.6rem", borderRadius: "0.375rem",
                                border: "1px solid var(--border)", background: "var(--surface)",
                                color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer",
                              }}
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => { setDeletingId(cat.id); setEditingId(null) }}
                            style={{
                              display: "inline-flex", alignItems: "center",
                              padding: "0.35rem 0.5rem", borderRadius: "0.375rem",
                              border: "1px solid var(--border)", background: "var(--surface)",
                              color: "var(--text-muted)", fontSize: "0.78rem",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
