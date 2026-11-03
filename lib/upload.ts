// lib/upload.ts
// Browser-side upload helpers for Supabase Storage (images and documents buckets)

import { createClient } from "@/lib/supabase/client"

export const IMAGE_TYPES   = ["image/jpeg", "image/png", "image/webp", "image/gif"]
export const MAX_IMAGE_MB  = 5
export const MAX_DOCUMENT_MB = 10

type UploadResult = { url: string } | { error: string }

async function upload(bucket: string, folder: string, file: File): Promise<UploadResult> {
  const supabase = createClient()
  const ext      = file.name.split(".").pop()?.toLowerCase() ?? "bin"
  const path     = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
  if (error) return { error: "Upload failed. Please try again." }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
}

export async function uploadImage(file: File, folder = "general"): Promise<UploadResult> {
  if (!IMAGE_TYPES.includes(file.type)) {
    return { error: "Only JPG, PNG, WebP and GIF files are allowed." }
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return { error: `Images must be smaller than ${MAX_IMAGE_MB}MB.` }
  }
  return upload("images", folder, file)
}

export async function uploadDocument(file: File, folder = "cv"): Promise<UploadResult> {
  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are allowed." }
  }
  if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) {
    return { error: `Files must be smaller than ${MAX_DOCUMENT_MB}MB.` }
  }
  return upload("documents", folder, file)
}
