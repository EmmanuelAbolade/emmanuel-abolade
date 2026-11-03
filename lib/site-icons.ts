// lib/site-icons.ts
// Icon choices for editable About page cards (experience, education, beyond code)

import {
  Award,
  BookOpen,
  Briefcase,
  Camera,
  Code2,
  GraduationCap,
  Heart,
  Lightbulb,
  Mic,
  Music,
  PenTool,
  Rocket,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react"

export const SITE_ICONS: Record<string, { label: string; icon: LucideIcon }> = {
  briefcase:  { label: "Briefcase",   icon: Briefcase     },
  code:       { label: "Code",        icon: Code2         },
  book:       { label: "Book",        icon: BookOpen      },
  graduation: { label: "Graduation",  icon: GraduationCap },
  award:      { label: "Award",       icon: Award         },
  video:      { label: "Video",       icon: Video         },
  camera:     { label: "Camera",      icon: Camera        },
  mic:        { label: "Microphone",  icon: Mic           },
  music:      { label: "Music",       icon: Music         },
  heart:      { label: "Heart",       icon: Heart         },
  users:      { label: "People",      icon: Users         },
  lightbulb:  { label: "Idea",        icon: Lightbulb     },
  rocket:     { label: "Rocket",      icon: Rocket        },
  pen:        { label: "Design",      icon: PenTool       },
}

export function getIcon(name: string | undefined, fallback = "briefcase"): LucideIcon {
  return (SITE_ICONS[name ?? ""] ?? SITE_ICONS[fallback]).icon
}
