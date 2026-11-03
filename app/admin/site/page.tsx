// app/admin/site/page.tsx
// Admin Site Content page - edit Home and About page content, photos, badges, stats and CV

import { createClient } from "@/lib/supabase/server"
import { DEFAULT_SITE_DATA, type SiteItem } from "@/lib/site-content"
import SiteContentClient from "./SiteContentClient"

export default async function AdminSitePage() {
  const supabase = await createClient()

  const [contentRes, itemsRes] = await Promise.all([
    supabase.from("site_content").select("key, value"),
    supabase
      .from("site_items")
      .select("id, section, data, status, sort_order, updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true }),
  ])

  const setupError = contentRes.error?.message ?? itemsRes.error?.message ?? null

  const content = Object.fromEntries(
    (contentRes.data ?? []).map((row) => [row.key, row.value as Record<string, unknown>])
  )

  return (
    <SiteContentClient
      setupError={setupError}
      hero={{ ...DEFAULT_SITE_DATA.hero, ...(content.hero ?? {}) }}
      about={{ ...DEFAULT_SITE_DATA.about, ...(content.about ?? {}) }}
      items={(itemsRes.data ?? []) as SiteItem[]}
    />
  )
}
