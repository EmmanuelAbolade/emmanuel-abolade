// app/api/contact/route.ts
// API route for handling contact form submissions
// Saves message to Supabase and sends email notification via Resend

import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@/lib/supabase/server"

const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting - simple in-memory store (per server instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT    = 3    // max submissions
const WINDOW_MS     = 60 * 60 * 1000 // per hour

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

function sanitize(str: string): string {
  return str.trim().replace(/<[^>]*>/g, "")
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown"

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, subject, enquiry_type, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      )
    }

    // Validate field lengths
    if (sanitize(name).length > 100) {
      return NextResponse.json(
        { error: "Name is too long." },
        { status: 400 }
      )
    }
    if (sanitize(message).length > 5000) {
      return NextResponse.json(
        { error: "Message is too long. Maximum 5000 characters." },
        { status: 400 }
      )
    }

    // Sanitize all inputs
    const cleanName        = sanitize(name)
    const cleanEmail       = sanitize(email)
    const cleanSubject     = sanitize(subject ?? "")
    const cleanEnquiry     = sanitize(enquiry_type ?? "General")
    const cleanMessage     = sanitize(message)

    // Save to Supabase
    const supabase = await createClient()
    const { error: dbError } = await supabase.from("messages").insert({
      name:         cleanName,
      email:        cleanEmail,
      subject:      cleanSubject || null,
      enquiry_type: cleanEnquiry,
      message:      cleanMessage,
      status:       "New",
    })

    if (dbError) {
      console.error("Supabase insert error:", dbError.message)
      return NextResponse.json(
        { error: "Failed to save your message. Please try again." },
        { status: 500 }
      )
    }

    // Send email notification via Resend
    const { error: emailError } = await resend.emails.send({
      from:    "Contact Form <onboarding@resend.dev>",
      to:      "emab.dev.tech@gmail.com",
      replyTo: cleanEmail,
      subject: `[Contact] ${cleanEnquiry}: ${cleanSubject || "New message from " + cleanName}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
          <h2 style="color: #c17f3e; margin-bottom: 0.5rem;">New Contact Message</h2>
          <p style="color: #6b6560; margin-bottom: 2rem; font-size: 0.9rem;">
            Received via your portfolio contact form
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
            <tr>
              <td style="padding: 0.75rem; background: #f0ede8; font-weight: 600; width: 120px; border-radius: 4px 0 0 4px;">Name</td>
              <td style="padding: 0.75rem; background: #f9f7f4; border-radius: 0 4px 4px 0;">${cleanName}</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; background: #f0ede8; font-weight: 600;">Email</td>
              <td style="padding: 0.75rem; background: #f9f7f4;">${cleanEmail}</td>
            </tr>
            <tr>
              <td style="padding: 0.75rem; background: #f0ede8; font-weight: 600;">Enquiry</td>
              <td style="padding: 0.75rem; background: #f9f7f4;">${cleanEnquiry}</td>
            </tr>
            ${cleanSubject ? `
            <tr>
              <td style="padding: 0.75rem; background: #f0ede8; font-weight: 600;">Subject</td>
              <td style="padding: 0.75rem; background: #f9f7f4;">${cleanSubject}</td>
            </tr>` : ""}
          </table>
          <div style="background: #f9f7f4; border-left: 3px solid #c17f3e; padding: 1.25rem; border-radius: 0 4px 4px 0; margin-bottom: 1.5rem;">
            <p style="font-weight: 600; margin-bottom: 0.5rem; color: #1a1714;">Message</p>
            <p style="color: #6b6560; line-height: 1.7; white-space: pre-wrap;">${cleanMessage}</p>
          </div>
          <p style="font-size: 0.8rem; color: #9c9690;">
            Reply directly to this email to respond to ${cleanName}.
          </p>
        </div>
      `,
    })

    if (emailError) {
      // Message was saved to DB — log email failure but do not fail the request
      console.error("Resend email error:", emailError)
    }

    return NextResponse.json(
      { success: true, message: "Your message has been sent successfully." },
      { status: 200 }
    )
  } catch (error) {
    console.error("Contact route error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}