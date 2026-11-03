// components/GalleryUpload.tsx
// Multi-image uploader for admin forms (project and post galleries)
// Supports multiple files, drag and drop, reordering, removal and pasted URLs

"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { uploadImage, IMAGE_TYPES, MAX_IMAGE_MB } from "@/lib/upload"
import { ChevronLeft, ChevronRight, ImagePlus, Loader, X } from "lucide-react"

type Props = {
  value: string[]
  onChange: (urls: string[]) => void
  folder?: string
  label?: string
}

const iconBtn: React.CSSProperties = {
  width: "1.6rem", height: "1.6rem", borderRadius: "50%",
  border: "none", cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
}

export default function GalleryUpload({ value, onChange, folder = "general", label = "Gallery" }: Props) {
  const inputRef                  = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(0)
  const [error, setError]         = useState("")
  const [dragOver, setDragOver]   = useState(false)
  const [urlInput, setUrlInput]   = useState("")

  async function uploadFiles(files: FileList | File[]) {
    setError("")
    const list = Array.from(files)
    setUploading(list.length)
    const added: string[] = []
    for (const file of list) {
      const result = await uploadImage(file, folder)
      if ("error" in result) setError(`${file.name}: ${result.error}`)
      else added.push(result.url)
      setUploading((n) => n - 1)
    }
    if (added.length) onChange([...value, ...added])
    if (inputRef.current) inputRef.current.value = ""
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= value.length) return
    const next = [...value]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  function addUrl() {
    const url = urlInput.trim()
    if (!url) return
    if (!/^https?:\/\//.test(url)) { setError("Image URLs must start with http:// or https://"); return }
    onChange([...value, url])
    setUrlInput("")
    setError("")
  }

  return (
    <div>
      <p style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
        {label} <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>({value.length})</span>
      </p>
      <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
        Extra images shown as a gallery with a full-screen viewer. Use the arrows to reorder.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault(); setDragOver(false)
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
        }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: "0.6rem",
          padding: "0.6rem",
          borderRadius: "0.5rem",
          border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
          background: dragOver ? "var(--accent-subtle)" : "var(--bg-secondary)",
          transition: "all 0.2s ease",
        }}
      >
        {value.map((url, i) => (
          <div key={`${url}-${i}`} style={{
            position: "relative", aspectRatio: "4/3", borderRadius: "0.4rem",
            overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)",
          }}>
            <Image src={url} alt={`Gallery image ${i + 1}`} fill sizes="160px" style={{ objectFit: "cover" }} />
            <span style={{
              position: "absolute", top: "0.35rem", left: "0.35rem",
              background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "0.68rem",
              fontWeight: 700, padding: "0.1rem 0.4rem", borderRadius: "999px",
            }}>
              {i + 1}
            </span>
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              title="Remove image"
              aria-label="Remove image"
              style={{ ...iconBtn, position: "absolute", top: "0.35rem", right: "0.35rem", background: "#ef4444", color: "#fff" }}
            >
              <X size={11} />
            </button>
            <div style={{ position: "absolute", bottom: "0.35rem", right: "0.35rem", display: "flex", gap: "0.25rem" }}>
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move left"
                style={{ ...iconBtn, background: "var(--surface)", color: "var(--text-primary)", opacity: i === 0 ? 0.4 : 1 }}>
                <ChevronLeft size={12} />
              </button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === value.length - 1} aria-label="Move right"
                style={{ ...iconBtn, background: "var(--surface)", color: "var(--text-primary)", opacity: i === value.length - 1 ? 0.4 : 1 }}>
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* Add tile */}
        <button
          type="button"
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            aspectRatio: "4/3", borderRadius: "0.4rem",
            border: "1.5px dashed var(--accent)", background: "var(--surface)",
            color: "var(--accent)", cursor: uploading ? "wait" : "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "0.35rem", fontSize: "0.78rem", fontWeight: 600,
          }}
        >
          {uploading > 0 ? (
            <>
              <Loader size={18} style={{ animation: "spin 1s linear infinite" }} />
              Uploading {uploading}...
            </>
          ) : (
            <>
              <ImagePlus size={18} />
              Add images
            </>
          )}
        </button>
      </div>

      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
        Select or drop several at once — JPG, PNG, WebP or GIF, max {MAX_IMAGE_MB}MB each.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem", maxWidth: "520px" }}>
        <input
          type="url"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addUrl() } }}
          placeholder="Or paste an image URL and press Enter"
          style={{
            flex: 1, padding: "0.55rem 0.8rem", borderRadius: "0.375rem",
            border: "1.5px solid var(--border)", background: "var(--surface)",
            color: "var(--text-primary)", fontSize: "0.85rem", outline: "none",
            fontFamily: "DM Sans, sans-serif", minWidth: 0,
          }}
        />
        <button type="button" onClick={addUrl} className="btn-outline" style={{ padding: "0.55rem 0.9rem" }}>
          Add
        </button>
      </div>

      {error && <p style={{ fontSize: "0.8rem", color: "#ef4444", marginTop: "0.4rem" }}>{error}</p>}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={IMAGE_TYPES.join(",")}
        onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        style={{ display: "none" }}
      />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
