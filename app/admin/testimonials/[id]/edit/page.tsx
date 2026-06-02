// app/admin/testimonials/[id]/edit/page.tsx
// Admin edit testimonial page

import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import TestimonialForm from "../../TestimonialForm"

type Props = {
  params: Promise<{ id: string }>
}

export default async function EditTestimonialPage({ params }: Props) {
  const { id }   = await params
  const supabase = await createClient()

  const { data: testimonial, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !testimonial) notFound()

  return (
    <TestimonialForm
      initial={{
        ...testimonial,
        role:       testimonial.role       ?? "",
        company:    testimonial.company    ?? "",
        avatar_url: testimonial.avatar_url ?? "",
        project:    testimonial.project    ?? "",
      }}
    />
  )
}
