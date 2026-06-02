// app/search/page.tsx
// Global search page - searches across projects, posts and resources simultaneously

import type { Metadata } from "next"
import { Suspense } from "react"
import SearchClient from "./SearchClient"

export const metadata: Metadata = {
  title: "Search",
  description: "Search across all projects, articles and resources on Emmanuel Abolade's website.",
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchClient />
    </Suspense>
  )
}
