// lib/site-content-server.ts
// Loads editable Home/About content from Supabase for public pages
// Falls back to the defaults when the tables are missing or the query fails

import { createClient } from "@/lib/supabase/server"
import {
  DEFAULT_AUTHOR,
  DEFAULT_SITE_DATA,
  type AuthorContent,
  type SiteData,
  type SiteItem,
  type SectionKey,
} from "@/lib/site-content"

export async function getSiteData(): Promise<SiteData> {
  const supabase = await createClient()

  const [contentRes, itemsRes] = await Promise.all([
    supabase.from("site_content").select("key, value"),
    supabase
      .from("site_items")
      .select("id, section, data, status, sort_order")
      .eq("status", "published")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ])

  if (contentRes.error || itemsRes.error) {
    console.error("Site content fallback:", contentRes.error?.message ?? itemsRes.error?.message)
    return DEFAULT_SITE_DATA
  }

  const content = Object.fromEntries(
    (contentRes.data ?? []).map((row) => [row.key, row.value as Record<string, unknown>])
  )
  const items = (itemsRes.data ?? []) as SiteItem[]

  // Every published item of a section, in display order
  function list<T>(section: SectionKey): T[] {
    return items.filter((i) => i.section === section).map((i) => i.data as T)
  }

  const homePhoto  = list<SiteData["homePhoto"]>("home_photo")[0]
  const aboutPhoto = list<SiteData["aboutPhoto"]>("about_photo")[0]

  return {
    hero:  { ...DEFAULT_SITE_DATA.hero,  ...(content.hero  ?? {}) },
    about: { ...DEFAULT_SITE_DATA.about, ...(content.about ?? {}) },
    heroWords:   list("hero_word"),
    homePhoto:   homePhoto?.url  ? homePhoto  : DEFAULT_SITE_DATA.homePhoto,
    aboutPhoto:  aboutPhoto?.url ? aboutPhoto : DEFAULT_SITE_DATA.aboutPhoto,
    homeBadges:  list("home_badge"),
    aboutBadges: list("about_badge"),
    stats:       list<SiteData["stats"][number]>("stat").map((s) => ({ ...s, value: Number(s.value) || 0 })),
    skillGroups: list("skill_group"),
    experience:  list("experience"),
    education:   list("education"),
    beyondCode:  list("beyond_code"),
  }
}

// Author card + byline for blog posts (site_content key "author")
export async function getAuthor(): Promise<AuthorContent> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_content")
    .select("value")
    .eq("key", "author")
    .maybeSingle()

  if (error || !data) return DEFAULT_AUTHOR
  const saved = data.value as Partial<AuthorContent>
  return {
    ...DEFAULT_AUTHOR,
    ...saved,
    photo: saved.photo || DEFAULT_AUTHOR.photo,
    name:  saved.name  || DEFAULT_AUTHOR.name,
  }
}

// Resolves the CV that "Download CV" should serve
export async function getActiveCv(): Promise<{ url: string; file_name: string } | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_items")
    .select("data")
    .eq("section", "cv")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null
  const cv = data.data as { url?: string; file_name?: string }
  return cv.url ? { url: cv.url, file_name: cv.file_name || "Emmanuel-Abolade-CV.pdf" } : null
}
