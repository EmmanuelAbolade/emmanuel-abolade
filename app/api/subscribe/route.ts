// app/api/subscribe/route.ts
// API route for handling newsletter subscriptions
// Validates email, checks for duplicates and saves to Supabase subscribers table

import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Simple rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT   = 3
const WINDOW_MS    = 60 * 60 * 1000

function isRateLimited(ip: string): boolean {
  const now    = Date.now()
  const record = rateLimitMap.get(ip)
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }
  if (record.count >= RATE_LIMIT) return true
  record.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body        = await request.json()
    const { email }   = body

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check for existing subscriber
    const { data: existing } = await supabase
      .from("subscribers")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 }
      )
    }

    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email: email.trim().toLowerCase() })

    if (insertError) {
      console.error("Subscriber insert error:", insertError.message)
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: "You are now subscribed." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Subscribe route error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}