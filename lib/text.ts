// lib/text.ts
// Small text helpers shared across the site

// Escapes characters that have special meaning in regular expressions,
// so user-typed search text like "c++" or "(beta)" is matched literally
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// Splits text into parts, flagging the ones that match the query (case-insensitive)
export function splitMatches(text: string, query: string): { text: string; match: boolean }[] {
  const q = query.trim()
  if (!q) return [{ text, match: false }]
  return text
    .split(new RegExp(`(${escapeRegExp(q)})`, "gi"))
    .filter(Boolean)
    .map((part) => ({ text: part, match: part.toLowerCase() === q.toLowerCase() }))
}
