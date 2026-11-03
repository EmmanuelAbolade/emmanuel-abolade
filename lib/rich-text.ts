// lib/rich-text.ts
// Helpers for fields that moved from plain text to rich text (HTML)

export function isHtml(value: string | null | undefined): boolean {
  return !!value && /<(p|h[1-6]|ul|ol|li|blockquote|pre|img|br|strong|em|a)\b[^>]*>/i.test(value)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

// Converts legacy plain text (blank line = new paragraph) into editor-ready HTML
export function plainToHtml(value: string | null | undefined): string {
  if (!value) return ""
  if (isHtml(value)) return value
  return value
    .split(/\n{2,}/)
    .map((para) => `<p>${escapeHtml(para.trim()).replace(/\n/g, "<br>")}</p>`)
    .join("")
}
