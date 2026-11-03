// app/cv/route.ts
// Stable CV download link — redirects to the CV currently published in the admin panel
// Falls back to the bundled /cv.pdf so the link never breaks

import { NextRequest, NextResponse } from "next/server"
import { getActiveCv } from "@/lib/site-content-server"

export async function GET(request: NextRequest) {
  const cv = await getActiveCv()

  if (!cv) {
    return NextResponse.redirect(new URL("/cv.pdf", request.url))
  }

  const target = new URL(cv.url, request.url)

  // Supabase Storage serves the file as an attachment with this filename
  if (target.hostname.endsWith(".supabase.co")) {
    target.searchParams.set("download", cv.file_name)
  }

  return NextResponse.redirect(target)
}
