// app/admin/site/SiteContentClient.tsx
// Client UI for editing Home/About page content
// Text blocks save to site_content; repeatable items (photos, badges, stats, skills,
// experience, education, beyond code, CV) live in site_items with publish/hide/archive states

"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { uploadDocument } from "@/lib/upload"
import ImageUpload from "@/components/ImageUpload"
import { SITE_ICONS } from "@/lib/site-icons"
import {
  SECTIONS,
  type AboutContent,
  type AuthorContent,
  type FieldDef,
  type HeroContent,
  type ItemStatus,
  type SectionKey,
  type SiteItem,
} from "@/lib/site-content"
import {
  AlertCircle,
  Archive,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FileUp,
  Loader,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react"

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div style={{
      border: "1.5px solid var(--border)", borderRadius: "0.5rem",
      background: "var(--surface)", height: "220px",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "var(--text-muted)", fontSize: "0.875rem",
    }}>
      Loading editor...
    </div>
  ),
})

// ── Shared styles ───────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.85rem",
  fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.4rem",
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.7rem 0.9rem", borderRadius: "0.375rem",
  border: "1.5px solid var(--border)", background: "var(--surface)",
  color: "var(--text-primary)", fontSize: "0.9rem", outline: "none",
  fontFamily: "DM Sans, sans-serif",
}

const hintStyle: React.CSSProperties = {
  fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem",
}

const cardStyle: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: "0.75rem", padding: "1.25rem",
}

const smallBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.3rem",
  padding: "0.4rem 0.6rem", borderRadius: "0.375rem",
  border: "1px solid var(--border)", background: "var(--surface)",
  color: "var(--text-secondary)", fontSize: "0.78rem", cursor: "pointer",
  whiteSpace: "nowrap",
}

const STATUS_META: Record<ItemStatus, { label: string; color: string; bg: string; icon: typeof Eye }> = {
  published: { label: "Published", color: "var(--accent)",     bg: "var(--accent-subtle)", icon: Eye     },
  hidden:    { label: "Hidden",    color: "var(--text-muted)", bg: "var(--bg-secondary)",  icon: EyeOff  },
  archived:  { label: "Archived",  color: "#b45309",           bg: "#fef3c7",              icon: Archive },
}

const TABS = [
  { key: "home",  label: "Home page",  sections: ["hero_word", "home_photo", "home_badge", "stat"] as SectionKey[] },
  { key: "about", label: "About page", sections: ["about_photo", "about_badge", "skill_group", "experience", "education", "beyond_code"] as SectionKey[] },
  { key: "blog",  label: "Blog posts", sections: [] as SectionKey[] },
  { key: "cv",    label: "CV",         sections: ["cv"] as SectionKey[] },
]

// ── Root ────────────────────────────────────────────────────────────

export default function SiteContentClient({
  setupError,
  hero,
  about,
  author,
  items: initialItems,
}: {
  setupError: string | null
  hero: HeroContent
  about: AboutContent
  author: AuthorContent
  items: SiteItem[]
}) {
  const [tab, setTab]     = useState("home")
  const [items, setItems] = useState<SiteItem[]>(initialItems)

  const current = TABS.find((t) => t.key === tab)!

  return (
    <div style={{ padding: "2rem", maxWidth: "980px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{
          fontFamily: "DM Serif Display, serif", fontSize: "2rem",
          color: "var(--text-primary)", marginBottom: "0.25rem",
        }}>
          Site Content
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
          Edit what visitors see on your Home and About pages. <strong>Published</strong> items are live,{" "}
          <strong>Hidden</strong> items are kept but not shown, and <strong>Archived</strong> items are
          tucked away for future reference.
        </p>
      </div>

      {setupError && (
        <div style={{
          display: "flex", gap: "0.6rem", alignItems: "flex-start",
          background: "#fef3c7", border: "1px solid #f59e0b", color: "#92400e",
          borderRadius: "0.5rem", padding: "0.9rem 1rem", marginBottom: "1.5rem",
          fontSize: "0.875rem", lineHeight: 1.6,
        }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: "0.2rem" }} />
          <div>
            <strong>Database setup needed.</strong> Run{" "}
            <code>supabase/migrations/20261103_site_content.sql</code> in the Supabase SQL Editor, then
            reload this page. The public site keeps showing your current content until then.
            <br />
            <span style={{ opacity: 0.8 }}>Details: {setupError}</span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "0.25rem", marginBottom: "1.75rem",
        borderBottom: "1px solid var(--border)", overflowX: "auto",
      }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            style={{
              padding: "0.7rem 1rem", border: "none", background: "none",
              borderBottom: `2px solid ${tab === t.key ? "var(--accent)" : "transparent"}`,
              color: tab === t.key ? "var(--accent)" : "var(--text-secondary)",
              fontWeight: tab === t.key ? 700 : 500, fontSize: "0.9rem",
              cursor: "pointer", whiteSpace: "nowrap", marginBottom: "-1px",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {tab === "home"  && <HeroBlock initial={hero} />}
        {tab === "about" && <AboutBlock initial={about} />}
        {tab === "blog"  && <AuthorBlock initial={author} />}

        {current.sections.map((key) => (
          <ItemsSection
            key={key}
            sectionKey={key}
            items={items.filter((i) => i.section === key)}
            onItemsChange={(next) =>
              setItems((prev) => [...prev.filter((i) => i.section !== key), ...next])
            }
          />
        ))}
      </div>
    </div>
  )
}

// ── Single-value content blocks ─────────────────────────────────────

function useContentSaver(key: string) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState("")

  async function save(value: Record<string, unknown>) {
    setSaving(true); setError(""); setSaved(false)
    const supabase = createClient()
    const { error } = await supabase
      .from("site_content")
      .upsert({ key, value, updated_at: new Date().toISOString() })
    setSaving(false)
    if (error) { setError(error.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return { saving, saved, error, save }
}

function SaveBar({ saving, saved, error, label = "Save" }: { saving: boolean; saved: boolean; error: string; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
      <button type="submit" disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.7 : 1 }}>
        {saving ? <Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
        {saving ? "Saving..." : label}
      </button>
      {saved && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: "var(--accent)", fontSize: "0.85rem", fontWeight: 600 }}>
          <Check size={14} /> Saved — live on the site
        </span>
      )}
      {error && <span style={{ color: "#ef4444", fontSize: "0.85rem" }}>{error}</span>}
    </div>
  )
}

function BlockHeader({ title, description }: { title: string; description: string }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <h2 style={{ fontFamily: "DM Serif Display, serif", fontSize: "1.25rem", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
        {title}
      </h2>
      <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{description}</p>
    </div>
  )
}

function HeroBlock({ initial }: { initial: HeroContent }) {
  const [form, setForm] = useState(initial)
  const saver = useContentSaver("hero")
  const set = (k: keyof HeroContent, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); saver.save(form) }}
      style={cardStyle}
    >
      <BlockHeader
        title="Hero text"
        description="The opening of your home page. The highlighted middle line comes from “Rotating headline words” below."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={labelStyle}>Welcome line</label>
          <input style={inputStyle} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} placeholder="Welcome to my portfolio" />
          <p style={hintStyle}>Animated letter by letter with an accent line. Leave empty to hide.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Headline — first line</label>
            <input style={inputStyle} value={form.headline_top} onChange={(e) => set("headline_top", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Headline — last line</label>
            <input style={inputStyle} value={form.headline_bottom} onChange={(e) => set("headline_bottom", e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Intro paragraph</label>
          <textarea style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} value={form.intro} onChange={(e) => set("intro", e.target.value)} />
        </div>
        <SaveBar {...saver} label="Save hero text" />
      </div>
    </form>
  )
}

function AuthorBlock({ initial }: { initial: AuthorContent }) {
  const [form, setForm] = useState(initial)
  const saver = useContentSaver("author")
  const set = (k: keyof AuthorContent, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); saver.save(form) }}
      style={cardStyle}
    >
      <BlockHeader
        title="Author card"
        description="Shown at the end of every blog post. The photo and name are also used in the byline under each post title."
      />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.25rem", alignItems: "start" }}>
        <div style={{ maxWidth: "220px" }}>
          <ImageUpload
            label="Photo"
            value={form.photo}
            onChange={(url) => set("photo", url)}
            folder="avatars"
            aspectRatio="1/1"
          />
          <p style={hintStyle}>Shown as a circle. Leave empty to use your default photo.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Short bio</label>
            <textarea style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }} value={form.bio} onChange={(e) => set("bio", e.target.value)} />
            <p style={hintStyle}>One or two sentences. Leave empty to hide.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem" }}>
            <div>
              <label style={labelStyle}>Link text</label>
              <input style={inputStyle} value={form.link_label} onChange={(e) => set("link_label", e.target.value)} placeholder="About me" />
            </div>
            <div>
              <label style={labelStyle}>Link goes to</label>
              <input style={inputStyle} value={form.link_href} onChange={(e) => set("link_href", e.target.value)} placeholder="/about or https://..." />
            </div>
          </div>
          <p style={{ ...hintStyle, marginTop: 0 }}>Leave the link text empty to hide the link.</p>
        </div>
      </div>
      {/* Live preview */}
      <div style={{ marginTop: "1.25rem" }}>
        <p style={{ ...labelStyle, fontWeight: 500, color: "var(--text-muted)" }}>Preview</p>
        <div style={{ padding: "1.25rem", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "0.75rem", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ width: "3.5rem", height: "3.5rem", minWidth: "3.5rem", borderRadius: "50%", overflow: "hidden", position: "relative", border: "3px solid var(--surface)" }}>
            <Image src={form.photo || "/images/profile.jpg"} alt={form.name} fill sizes="56px" style={{ objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontFamily: "DM Serif Display, serif", color: "var(--text-primary)", marginBottom: "0.2rem" }}>{form.name || "Your name"}</p>
            {form.bio && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: 1.55 }}>{form.bio}</p>}
            {form.link_label && <p style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600, marginTop: "0.3rem" }}>{form.link_label} →</p>}
          </div>
        </div>
      </div>
      <div style={{ marginTop: "1.25rem" }}>
        <SaveBar {...saver} label="Save author card" />
      </div>
    </form>
  )
}

function AboutBlock({ initial }: { initial: AboutContent }) {
  const [form, setForm] = useState(initial)
  const saver = useContentSaver("about")
  const set = (k: keyof AboutContent, v: string) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); saver.save(form) }}
      style={cardStyle}
    >
      <BlockHeader title="About me" description="The introduction at the top of your About page." />
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div>
            <label style={labelStyle}>Small heading</label>
            <input style={inputStyle} value={form.eyebrow} onChange={(e) => set("eyebrow", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Name</label>
            <input style={inputStyle} value={form.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Location</label>
            <input style={inputStyle} value={form.location} onChange={(e) => set("location", e.target.value)} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Headline</label>
          <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={form.headline} onChange={(e) => set("headline", e.target.value)} />
          <p style={hintStyle}>Press Enter to start a new line.</p>
        </div>
        <div>
          <label style={labelStyle}>Bio</label>
          <RichTextEditor
            content={form.bio}
            onChange={(html) => set("bio", html)}
            placeholder="Tell visitors about yourself..."
            folder="site"
            minHeight={220}
            showStats={false}
          />
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <p style={{ ...labelStyle, marginBottom: "0.75rem" }}>Section subtitles</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" }}>
            {([
              ["skills_subtitle",     "Skills"],
              ["experience_subtitle", "Experience"],
              ["education_subtitle",  "Education"],
              ["beyond_subtitle",     "Beyond Code"],
            ] as const).map(([key, label]) => (
              <div key={key}>
                <label style={{ ...labelStyle, fontWeight: 500 }}>{label}</label>
                <input style={inputStyle} value={form[key]} onChange={(e) => set(key, e.target.value)} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
          <p style={{ ...labelStyle, marginBottom: "0.75rem" }}>“Work together” box at the bottom</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ ...labelStyle, fontWeight: 500 }}>Heading</label>
              <input style={inputStyle} value={form.cta_title} onChange={(e) => set("cta_title", e.target.value)} />
            </div>
            <div>
              <label style={{ ...labelStyle, fontWeight: 500 }}>Text</label>
              <textarea style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} value={form.cta_text} onChange={(e) => set("cta_text", e.target.value)} />
            </div>
          </div>
        </div>

        <SaveBar {...saver} label="Save About me" />
      </div>
    </form>
  )
}

// ── Repeatable items ────────────────────────────────────────────────

function ItemsSection({
  sectionKey,
  items,
  onItemsChange,
}: {
  sectionKey: SectionKey
  items: SiteItem[]
  onItemsChange: (items: SiteItem[]) => void
}) {
  const def = SECTIONS[sectionKey]
  const [adding, setAdding]             = useState(false)
  const [editingId, setEditingId]       = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [busyId, setBusyId]             = useState<string | null>(null)
  const [error, setError]               = useState("")

  const sorted   = [...items].sort((a, b) => a.sort_order - b.sort_order)
  const active   = sorted.filter((i) => i.status !== "archived")
  const archived = sorted.filter((i) => i.status === "archived")

  async function saveItem(data: Record<string, unknown>, existing?: SiteItem) {
    setError("")
    const supabase = createClient()
    const now = new Date().toISOString()

    if (existing) {
      const { error } = await supabase.from("site_items").update({ data, updated_at: now }).eq("id", existing.id)
      if (error) { setError(error.message); return false }
      onItemsChange(items.map((i) => (i.id === existing.id ? { ...i, data, updated_at: now } : i)))
      return true
    }

    // New items go to the end; in single-active sections the new one becomes the live one
    const maxOrder = items.reduce((m, i) => Math.max(m, i.sort_order), 0)
    const sortOrder = def.singleActive ? Math.min(0, ...items.map((i) => i.sort_order)) - 1 : maxOrder + 1
    const { data: inserted, error } = await supabase
      .from("site_items")
      .insert({ section: sectionKey, data, status: "published", sort_order: sortOrder })
      .select("id, section, data, status, sort_order, updated_at")
      .single()
    if (error || !inserted) { setError(error?.message ?? "Could not save."); return false }

    let next = [...items, inserted as SiteItem]
    if (def.singleActive) {
      const others = items.filter((i) => i.status === "published").map((i) => i.id)
      if (others.length) {
        await supabase.from("site_items").update({ status: "hidden" }).in("id", others)
        next = next.map((i) => (others.includes(i.id) ? { ...i, status: "hidden" as ItemStatus } : i))
      }
    }
    onItemsChange(next)
    return true
  }

  async function setStatus(item: SiteItem, status: ItemStatus) {
    setBusyId(item.id); setError("")
    const supabase = createClient()
    const { error } = await supabase.from("site_items").update({ status }).eq("id", item.id)
    if (error) { setError(error.message); setBusyId(null); return }

    let next = items.map((i) => (i.id === item.id ? { ...i, status } : i))
    if (def.singleActive && status === "published") {
      const others = items.filter((i) => i.id !== item.id && i.status === "published").map((i) => i.id)
      if (others.length) {
        await supabase.from("site_items").update({ status: "hidden" }).in("id", others)
        next = next.map((i) => (others.includes(i.id) ? { ...i, status: "hidden" as ItemStatus } : i))
      }
    }
    onItemsChange(next)
    setBusyId(null)
  }

  async function move(item: SiteItem, direction: -1 | 1) {
    const list  = active
    const index = list.findIndex((i) => i.id === item.id)
    const swap  = index + direction
    if (swap < 0 || swap >= list.length) return

    setBusyId(item.id); setError("")
    const reordered = [...list]
    ;[reordered[index], reordered[swap]] = [reordered[swap], reordered[index]]

    const supabase = createClient()
    const updates  = reordered.map((i, idx) => ({ id: i.id, sort_order: idx + 1 }))
    const results  = await Promise.all(
      updates
        .filter((u) => items.find((i) => i.id === u.id)?.sort_order !== u.sort_order)
        .map((u) => supabase.from("site_items").update({ sort_order: u.sort_order }).eq("id", u.id))
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) setError(failed.error.message)

    onItemsChange(items.map((i) => {
      const u = updates.find((x) => x.id === i.id)
      return u ? { ...i, sort_order: u.sort_order } : i
    }))
    setBusyId(null)
  }

  async function remove(item: SiteItem) {
    setBusyId(item.id); setError("")
    const supabase = createClient()
    const { error } = await supabase.from("site_items").delete().eq("id", item.id)
    if (error) { setError(error.message); setBusyId(null); return }
    onItemsChange(items.filter((i) => i.id !== item.id))
    setBusyId(null)
  }

  function renderRow(item: SiteItem, index: number, list: SiteItem[]) {
    if (editingId === item.id) {
      return (
        <ItemEditor
          key={item.id}
          def={def}
          initial={item.data}
          onCancel={() => setEditingId(null)}
          onSave={async (data) => { if (await saveItem(data, item)) setEditingId(null) }}
        />
      )
    }
    return (
      <ItemRow
        key={item.id}
        def={def}
        item={item}
        busy={busyId === item.id}
        canMoveUp={item.status !== "archived" && index > 0}
        canMoveDown={item.status !== "archived" && index < list.length - 1}
        onEdit={() => { setEditingId(item.id); setAdding(false) }}
        onMove={(d) => move(item, d)}
        onStatus={(s) => setStatus(item, s)}
        onDelete={() => remove(item)}
      />
    )
  }

  return (
    <section style={cardStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        <BlockHeader title={def.title} description={def.description} />
        {!adding && (
          <button
            type="button"
            className="btn-outline"
            style={{ padding: "0.5rem 0.9rem", fontSize: "0.85rem" }}
            onClick={() => { setAdding(true); setEditingId(null) }}
          >
            <Plus size={14} /> Add
          </button>
        )}
      </div>

      {error && (
        <p style={{ color: "#ef4444", fontSize: "0.82rem", marginBottom: "0.75rem", display: "flex", gap: "0.35rem", alignItems: "center" }}>
          <AlertCircle size={13} /> {error}
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <AnimatePresence initial={false}>
          {adding && (
            <motion.div key="new" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
              <ItemEditor
                def={def}
                initial={{}}
                isNew
                onCancel={() => setAdding(false)}
                onSave={async (data) => { if (await saveItem(data)) setAdding(false) }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {active.length === 0 && !adding && (
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", padding: "0.75rem 0" }}>
            Nothing here yet — this section is hidden on the site until you add something.
          </p>
        )}

        {active.map((item, i) => renderRow(item, i, active))}

        {archived.length > 0 && (
          <div style={{ marginTop: "0.25rem" }}>
            <button
              type="button"
              onClick={() => setShowArchived((v) => !v)}
              style={{ ...smallBtn, border: "none", background: "none", padding: "0.25rem 0", color: "var(--text-muted)" }}
            >
              <Archive size={13} />
              {showArchived ? "Hide" : "Show"} archived ({archived.length})
              {showArchived ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            {showArchived && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginTop: "0.6rem" }}>
                {archived.map((item, i) => renderRow(item, i, archived))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

function itemTitle(def: (typeof SECTIONS)[SectionKey], data: Record<string, unknown>) {
  const title = data[def.titleField]
  return typeof title === "string" && title.trim() ? title : "Untitled"
}

function itemSubtitle(def: (typeof SECTIONS)[SectionKey], data: Record<string, unknown>) {
  if (!def.subtitleField) return ""
  const value = data[def.subtitleField]
  if (Array.isArray(value)) return value.join(", ")
  if (value === undefined || value === null) return ""
  if (def.key === "stat") return `${value}${data.suffix ?? ""}`
  return String(value)
}

function ItemRow({
  def,
  item,
  busy,
  canMoveUp,
  canMoveDown,
  onEdit,
  onMove,
  onStatus,
  onDelete,
}: {
  def: (typeof SECTIONS)[SectionKey]
  item: SiteItem
  busy: boolean
  canMoveUp: boolean
  canMoveDown: boolean
  onEdit: () => void
  onMove: (direction: -1 | 1) => void
  onStatus: (status: ItemStatus) => void
  onDelete: () => void
}) {
  const [confirming, setConfirming] = useState(false)
  const status   = STATUS_META[item.status]
  const imageUrl = def.fields.some((f) => f.type === "image") ? (item.data.url as string | undefined) : undefined
  const fileUrl  = def.fields.some((f) => f.type === "file")  ? (item.data.url as string | undefined) : undefined
  const IconComp = typeof item.data.icon === "string" ? SITE_ICONS[item.data.icon]?.icon : undefined
  const isLive   = item.status === "published"
  const liveText = def.singleActive && isLive ? "Live" : status.label

  return (
    <div className="site-item-row" style={{
      display: "grid", gridTemplateColumns: "auto minmax(0, 1fr) auto",
      gap: "0.85rem", alignItems: "center",
      border: "1px solid var(--border)", borderRadius: "0.6rem",
      padding: "0.7rem 0.85rem",
      background: item.status === "published" ? "var(--surface)" : "var(--bg-secondary)",
      opacity: busy ? 0.6 : 1,
    }}>
      {/* Visual */}
      <div style={{
        width: "2.75rem", height: "2.75rem", borderRadius: "0.45rem",
        background: "var(--accent-subtle)", position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill sizes="44px" style={{ objectFit: "cover", objectPosition: "top" }} />
        ) : fileUrl ? (
          <FileText size={17} color="var(--accent)" />
        ) : IconComp ? (
          <IconComp size={17} color="var(--accent)" />
        ) : (
          <span style={{ fontFamily: "DM Serif Display, serif", color: "var(--accent)", fontSize: "1rem" }}>
            {itemTitle(def, item.data).charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-primary)", lineHeight: 1.35, overflowWrap: "anywhere" }}>
            {itemTitle(def, item.data)}
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "0.25rem",
            fontSize: "0.68rem", fontWeight: 700, padding: "0.12rem 0.5rem",
            borderRadius: "999px", color: status.color, background: status.bg,
            textTransform: "uppercase", letterSpacing: "0.04em",
          }}>
            <status.icon size={10} /> {liveText}
          </span>
        </div>
        {itemSubtitle(def, item.data) && (
          <p style={{
            fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.15rem",
            overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          }}>
            {itemSubtitle(def, item.data)}
          </p>
        )}
        {fileUrl && (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.75rem", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginTop: "0.2rem" }}>
            <ExternalLink size={11} /> Open file
          </a>
        )}
      </div>

      {/* Actions */}
      <div className="site-item-actions" style={{ display: "flex", alignItems: "center", gap: "0.35rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
        {!def.singleActive && (
          <>
            <button type="button" style={smallBtn} disabled={!canMoveUp || busy} onClick={() => onMove(-1)} title="Move up" aria-label="Move up">
              <ChevronUp size={13} style={{ opacity: canMoveUp ? 1 : 0.3 }} />
            </button>
            <button type="button" style={smallBtn} disabled={!canMoveDown || busy} onClick={() => onMove(1)} title="Move down" aria-label="Move down">
              <ChevronDown size={13} style={{ opacity: canMoveDown ? 1 : 0.3 }} />
            </button>
          </>
        )}
        <select
          value={item.status}
          disabled={busy}
          onChange={(e) => onStatus(e.target.value as ItemStatus)}
          aria-label="Visibility"
          style={{ ...smallBtn, paddingRight: "0.4rem" }}
        >
          <option value="published">{def.singleActive ? "Live" : "Published"}</option>
          <option value="hidden">Hidden</option>
          <option value="archived">Archived</option>
        </select>
        <button type="button" style={smallBtn} onClick={onEdit} disabled={busy}>
          <Pencil size={12} /> Edit
        </button>
        {confirming ? (
          <>
            <button type="button" style={{ ...smallBtn, background: "#ef4444", borderColor: "#ef4444", color: "#fff" }} onClick={onDelete} disabled={busy}>
              Delete
            </button>
            <button type="button" style={smallBtn} onClick={() => setConfirming(false)}>
              Keep
            </button>
          </>
        ) : (
          <button type="button" style={smallBtn} onClick={() => setConfirming(true)} title="Delete permanently" aria-label="Delete">
            <Trash2 size={12} />
          </button>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .site-item-row { grid-template-columns: auto minmax(0, 1fr) !important; }
          .site-item-actions { grid-column: 1 / -1; justify-content: flex-start !important; }
        }
      `}</style>
    </div>
  )
}

function ItemEditor({
  def,
  initial,
  isNew = false,
  onSave,
  onCancel,
}: {
  def: (typeof SECTIONS)[SectionKey]
  initial: Record<string, unknown>
  isNew?: boolean
  onSave: (data: Record<string, unknown>) => Promise<void>
  onCancel: () => void
}) {
  const [data, setData]     = useState<Record<string, unknown>>(initial)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState("")

  const set = (name: string, value: unknown) => setData((d) => ({ ...d, [name]: value }))

  async function submit() {
    setError("")
    const required = def.fields.find((f) => (f.type === "image" || f.type === "file") && !data[f.name])
    if (required) { setError(`${required.label} is required.`); return }
    // Text title is required unless the item is identified by its image/file
    const hasMedia = def.fields.some((f) => f.type === "image" || f.type === "file")
    if (!hasMedia && !String(data[def.titleField] ?? "").trim()) {
      const field = def.fields.find((f) => f.name === def.titleField)
      setError(`${field?.label ?? "Title"} is required.`)
      return
    }

    // Normalise lists and numbers before saving
    const clean: Record<string, unknown> = { ...data }
    for (const f of def.fields) {
      if (f.type === "list") {
        const raw = clean[f.name]
        clean[f.name] = (Array.isArray(raw) ? raw : String(raw ?? "").split("\n"))
          .map((s) => String(s).trim())
          .filter(Boolean)
      }
      if (f.type === "number") clean[f.name] = Number(clean[f.name]) || 0
    }

    setSaving(true)
    await onSave(clean)
    setSaving(false)
  }

  return (
    <div style={{
      border: "1.5px solid var(--accent)", borderRadius: "0.6rem",
      padding: "1rem", background: "var(--surface)",
    }}>
      <p style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.85rem" }}>
        {isNew ? `New ${def.title.toLowerCase().replace(/s$/, "")}` : "Editing"}
      </p>
      {isNew && def.singleActive && (
        <p style={{ ...hintStyle, marginTop: 0, marginBottom: "0.85rem" }}>
          Saving makes this the live version. The current one moves to Hidden so you can switch back anytime.
        </p>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {def.fields.map((field) => (
          <div
            key={field.name}
            style={{ gridColumn: ["textarea", "list", "image", "file", "icon"].includes(field.type) ? "1 / -1" : undefined }}
          >
            <FieldInput field={field} value={data[field.name]} onChange={(v) => set(field.name, v)} />
          </div>
        ))}
      </div>
      {error && <p style={{ color: "#ef4444", fontSize: "0.82rem", marginTop: "0.75rem" }}>{error}</p>}
      <div style={{ display: "flex", gap: "0.6rem", marginTop: "1rem", flexWrap: "wrap" }}>
        <button type="button" className="btn-primary" onClick={submit} disabled={saving} style={{ opacity: saving ? 0.7 : 1 }}>
          {saving ? <Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={15} />}
          {saving ? "Saving..." : isNew ? "Add" : "Save"}
        </button>
        <button type="button" className="btn-outline" onClick={onCancel} disabled={saving}>
          <X size={15} /> Cancel
        </button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: unknown
  onChange: (value: unknown) => void
}) {
  switch (field.type) {
    case "textarea":
      return (
        <>
          <label style={labelStyle}>{field.label}</label>
          <textarea
            style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      )
    case "list":
      return (
        <>
          <label style={labelStyle}>{field.label}</label>
          <textarea
            style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }}
            value={Array.isArray(value) ? value.join("\n") : String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <p style={hintStyle}>{field.hint}</p>}
        </>
      )
    case "number":
      return (
        <>
          <label style={labelStyle}>{field.label}</label>
          <input
            type="number"
            style={inputStyle}
            value={value === undefined || value === null ? "" : String(value)}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </>
      )
    case "image":
      return (
        <ImageUpload
          label={field.label}
          value={String(value ?? "")}
          onChange={(url) => onChange(url)}
          folder="site"
          aspectRatio="4/5"
        />
      )
    case "file":
      return <PdfUpload label={field.label} value={String(value ?? "")} onChange={onChange} />
    case "icon":
      return (
        <>
          <label style={labelStyle}>{field.label}</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {Object.entries(SITE_ICONS).map(([key, { label, icon: Icon }]) => {
              const selected = value === key
              return (
                <button
                  key={key}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={selected}
                  onClick={() => onChange(key)}
                  style={{
                    width: "2.4rem", height: "2.4rem", borderRadius: "0.45rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: `1.5px solid ${selected ? "var(--accent)" : "var(--border)"}`,
                    background: selected ? "var(--accent-subtle)" : "var(--surface)",
                    color: selected ? "var(--accent)" : "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <Icon size={16} />
                </button>
              )
            })}
          </div>
        </>
      )
    default:
      return (
        <>
          <label style={labelStyle}>{field.label}</label>
          <input
            style={inputStyle}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.hint && <p style={hintStyle}>{field.hint}</p>}
        </>
      )
  }
}

function PdfUpload({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (url: string) => void
}) {
  const inputRef                  = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState("")

  async function handleFile(file: File | undefined) {
    if (!file) return
    setError(""); setUploading(true)
    const result = await uploadDocument(file, "cv")
    if ("error" in result) setError(result.error)
    else onChange(result.url)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <button type="button" className="btn-outline" onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader size={15} style={{ animation: "spin 1s linear infinite" }} /> : <FileUp size={15} />}
          {uploading ? "Uploading..." : value ? "Replace PDF" : "Upload PDF"}
        </button>
        {value && (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.85rem", color: "var(--accent)", display: "inline-flex", alignItems: "center", gap: "0.3rem", overflowWrap: "anywhere" }}>
            <FileText size={14} /> {decodeURIComponent(value.split("/").pop() ?? "Current file")}
          </a>
        )}
      </div>
      <p style={hintStyle}>PDF only, up to 10MB.</p>
      {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.3rem" }}>{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ display: "none" }}
      />
    </div>
  )
}
