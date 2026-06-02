// app/admin/testimonials/new/page.tsx
// Admin new testimonial page

import type { Metadata } from "next"
import TestimonialForm from "../TestimonialForm"

export const metadata: Metadata = { title: "New Testimonial — Admin" }

export default function NewTestimonialPage() {
  return <TestimonialForm />
}
