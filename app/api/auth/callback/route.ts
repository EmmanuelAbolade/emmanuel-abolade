// app/api/auth/callback/route.ts
// Handles Supabase auth callback for email confirmation flows

import { createClient } from "@/lib/supabase/server"
import { NextResponse, type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code                     = searchParams.get("code")
  const next                     = searchParams.get("next") ?? "/admin/dashboard"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login on failure
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}