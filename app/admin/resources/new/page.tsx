// app/admin/resources/new/page.tsx
// Admin new resource page

import type { Metadata } from "next"
import ResourceForm from "../ResourceForm"

export const metadata: Metadata = { title: "New Resource — Admin" }

export default function NewResourcePage() {
  return <ResourceForm />
}
