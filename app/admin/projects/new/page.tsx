// app/admin/projects/new/page.tsx
// Admin new project page - renders ProjectForm with no initial data

import type { Metadata } from "next"
import ProjectForm from "../ProjectForm"

export const metadata: Metadata = { title: "New Project — Admin" }

export default function NewProjectPage() {
  return <ProjectForm />
}
