// components/ImageUpload.tsx
// Reusable image upload component for admin forms
// Uploads to Supabase Storage and returns the public URL

"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Upload, X, Loader, ImageIcon } from "lucide-react"

type Props = {
  value: string
  onChange: (url: string) => void
  folder?: string
  aspectRatio?: string
  label?: string
}

const MAX_SIZE_MB = 5
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]

export default function ImageUpload({
  value,
  onChange,
  folder = "general",
  aspectRatio = "16/9",
  label = "Image",
}: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState("")
  const [dragOver, setDragOver]   = useState(false)
  const inputRef                  = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setError("")

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, WebP and GIF files are allowed.")
      return
    }

    // Validate size
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be smaller than ${MAX_SIZE_MB}MB.`)
      return
    }

    setUploading(true)

    const supabase  = createClient()
    const ext       = file.name.split(".").pop()
    const filename  = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filename, file, { upsert: false })

    if (uploadError) {
      setError("Upload failed. Please try again.")
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from("images").getPublicUrl(filename)
    onChange(data.publicUrl)
    setUploading(false)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) await uploadFile(file)
    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = ""
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await uploadFile(file)
  }

  function handleRemove() {
    onChange("")
    setError("")
  }

  return (
    <div>
      <p style={{
        fontSize: "0.85rem", fontWeight: 600,
        color: "var(--text-primary)", marginBottom: "0.5rem",
      }}>
        {label}
      </p>

      {/* Preview */}
      {value ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "400px",
            aspectRatio,
            borderRadius: "0.5rem",
            overflow: "hidden",
            border: "1.5px solid var(--border)",
            background: "var(--bg-secondary)",
          }}>
            <Image
              src={value}
              alt="Uploaded image"
              fill
              sizes="400px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: "absolute",
              top: "0.5rem",
              right: "0.5rem",
              width: "1.75rem",
              height: "1.75rem",
              borderRadius: "50%",
              background: "#ef4444",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
            title="Remove image"
          >
            <X size={12} />
          </button>

          {/* Replace button */}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            style={{
              marginTop: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline",
            }}
          >
            Replace image
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          style={{
            width: "100%",
            maxWidth: "400px",
            aspectRatio,
            borderRadius: "0.5rem",
            border: `2px dashed ${dragOver ? "var(--accent)" : "var(--border)"}`,
            background: dragOver ? "var(--accent-subtle)" : "var(--bg-secondary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.75rem",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
            padding: "2rem",
          }}
        >
          {uploading ? (
            <>
              <Loader size={28} color="var(--accent)" style={{ animation: "spin 1s linear infinite" }} />
              <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                Uploading...
              </p>
            </>
          ) : (
            <>
              <div style={{
                width: "3rem", height: "3rem",
                background: "var(--accent-subtle)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {dragOver ? (
                  <Upload size={20} color="var(--accent)" />
                ) : (
                  <ImageIcon size={20} color="var(--accent)" />
                )}
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.875rem", color: "var(--text-primary)", fontWeight: 600, marginBottom: "0.25rem" }}>
                  {dragOver ? "Drop to upload" : "Click or drag to upload"}
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                  JPG, PNG, WebP or GIF — max {MAX_SIZE_MB}MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p style={{
          fontSize: "0.8rem", color: "#ef4444",
          marginTop: "0.4rem",
          display: "flex", alignItems: "center", gap: "0.3rem",
        }}>
          {error}
        </p>
      )}

      {/* Also allow pasting a URL directly */}
      <div style={{ marginTop: "0.75rem" }}>
        <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "0.35rem" }}>
          Or paste an image URL directly
        </p>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "0.6rem 0.85rem",
            borderRadius: "0.375rem",
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-primary)",
            fontSize: "0.85rem",
            outline: "none",
            fontFamily: "DM Sans, sans-serif",
          }}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
