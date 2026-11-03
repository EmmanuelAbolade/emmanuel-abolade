// lib/site-content.ts
// Types, defaults and admin field definitions for editable Home/About content
// Defaults mirror the original hard-coded content and are used if the database is unavailable

export type ItemStatus = "published" | "hidden" | "archived"

export type HeroContent = {
  eyebrow: string
  headline_top: string
  headline_bottom: string
  intro: string
}

export type AboutContent = {
  eyebrow: string
  name: string
  headline: string
  location: string
  bio: string
  skills_subtitle: string
  experience_subtitle: string
  education_subtitle: string
  beyond_subtitle: string
  cta_title: string
  cta_text: string
}

export type Photo       = { url: string; alt: string }
export type Badge       = { label: string; value: string }
export type HeroWord    = { text: string }
export type Stat        = { value: number; suffix: string; label: string }
export type SkillGroup  = { category: string; skills: string[] }
export type Experience  = { role: string; org: string; period: string; icon: string; points: string[] }
export type Education   = { degree: string; institution: string; period: string; note: string; icon: string }
export type BeyondCode  = { title: string; description: string; icon: string }
export type CvFile      = { url: string; file_name: string; label: string }

export type SectionKey =
  | "hero_word" | "home_photo" | "about_photo" | "home_badge" | "about_badge"
  | "stat" | "skill_group" | "experience" | "education" | "beyond_code" | "cv"

export type SiteItem = {
  id: string
  section: SectionKey
  data: Record<string, unknown>
  status: ItemStatus
  sort_order: number
  updated_at?: string
}

export type SiteData = {
  hero: HeroContent
  about: AboutContent
  heroWords: HeroWord[]
  homePhoto: Photo
  aboutPhoto: Photo
  homeBadges: Badge[]
  aboutBadges: Badge[]
  stats: Stat[]
  skillGroups: SkillGroup[]
  experience: Experience[]
  education: Education[]
  beyondCode: BeyondCode[]
}

export const DEFAULT_PHOTO: Photo = { url: "/images/profile.jpg", alt: "Emmanuel Abolade" }

export const DEFAULT_SITE_DATA: SiteData = {
  hero: {
    eyebrow: "Welcome to my portfolio",
    headline_top: "Building digital",
    headline_bottom: "that matter.",
    intro:
      "Software developer based in Ireland, focused on building clean, purposeful and user-driven digital systems. Final-year BSc student at SETU Carlow.",
  },
  about: {
    eyebrow: "About Me",
    name: "Emmanuel Abolade",
    headline: "Developer, creator,\nand problem solver.",
    location: "Ireland",
    bio:
      "<p>I am a final-year Software Development student at South East Technological University, Carlow, focused on building clean, purposeful, and user-driven digital systems.</p>" +
      "<p>I approach development as both a technical and creative discipline — structuring ideas, refining complexity, and delivering solutions that are intuitive, reliable, and scalable. My work is grounded in clarity, system thinking, and real-world application.</p>" +
      "<p>Beyond software, I create digital content and work in event videography — capturing and presenting stories that engage audiences. This creative work strengthens my attention to detail, visual thinking, and ability to communicate ideas clearly across different mediums.</p>",
    skills_subtitle:     "Technologies and tools I work with regularly.",
    experience_subtitle: "Where I have applied my skills in the real world.",
    education_subtitle:  "My academic background and qualifications.",
    beyond_subtitle:     "Other things that shape how I think and create.",
    cta_title:           "Want to work together?",
    cta_text:            "I am open to full-time roles, freelance projects, and collaborations. Let us build something great.",
  },
  heroWords:  [{ text: "experiences" }],
  homePhoto:  DEFAULT_PHOTO,
  aboutPhoto: DEFAULT_PHOTO,
  homeBadges:  [{ label: "Status", value: "Open to work" }],
  aboutBadges: [{ label: "Currently at", value: "SETU Carlow" }],
  stats: [
    { value: 3,   suffix: "+", label: "Years building"    },
    { value: 10,  suffix: "+", label: "Projects shipped"  },
    { value: 15,  suffix: "+", label: "Technologies used" },
    { value: 100, suffix: "%", label: "Passion for code"  },
  ],
  skillGroups: [
    { category: "Languages",          skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "PHP", "SQL"] },
    { category: "Frontend",           skills: ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"] },
    { category: "Backend & Database", skills: ["Node.js", "Supabase", "PostgreSQL", "MySQL", "Firebase", "Firestore", "REST APIs"] },
    { category: "Machine Learning",   skills: ["scikit-learn", "NumPy", "pandas", "NLP", "TF-IDF", "SVM", "KNN"] },
    { category: "Tools & Platforms",  skills: ["Git", "GitHub", "Vercel", "Streamlit", "VS Code", "Figma"] },
  ],
  experience: [
    {
      role: "Multimedia Specialist (Voluntary)", org: "RCCG Trinity Hall, Portlaoise",
      period: "Aug 2022 – Present", icon: "video",
      points: [
        "Conceptualise, film, and edit multimedia content for web and social media platforms end-to-end.",
        "Collaborate with stakeholders to align content with branding and community engagement goals.",
      ],
    },
    {
      role: "Software Development Intern", org: "Fastrack Into Information Technology (FIT), Dublin",
      period: "Jan 2022", icon: "code",
      points: [
        "Developed frontend components for an online craft store, collaborating on marketing and product presentation.",
        "Delivered solutions within deadlines while maintaining professional standards in a team environment.",
      ],
    },
    {
      role: "Healthcare Assistant", org: "Dunboyne Nursing Home, Dunboyne",
      period: "Aug 2019 – Jul 2021", icon: "briefcase",
      points: [
        "Provided high-quality resident care in a fast-paced environment with accurate documentation.",
        "Developed strong attention to detail, empathy, and teamwork — all transferable to software development.",
      ],
    },
  ],
  education: [
    {
      degree: "BSc (Hons) in Software Development",
      institution: "South East Technological University, Carlow",
      period: "Sep 2022 – May 2026", note: "Final year — awaiting graduation", icon: "book",
    },
    {
      degree: "QQI Level 5 — Computer Science in Software Development (Distinction)",
      institution: "Portlaoise Institute, Portlaoise",
      period: "Sep 2021 – May 2022",
      note: "Modules: Web Authoring, Software Architecture, Java, Database Management, Mathematics for IT",
      icon: "book",
    },
  ],
  beyondCode: [
    { title: "Content Creation",  icon: "video",     description: "Creator of StayEnriched and TreasuredStoriesForKids — YouTube channels built around storytelling, education, and community engagement." },
    { title: "Event Videography", icon: "video",     description: "Capturing, editing, and presenting stories at events in a way that resonates with audiences — sharpening visual thinking and detail orientation." },
    { title: "Charity Work",      icon: "briefcase", description: "Actively involved in volunteering and community service, believing that giving back is part of what it means to build something meaningful." },
  ],
}

// ── Admin field definitions ──────────────────────────────────────────

export type FieldType = "text" | "textarea" | "number" | "list" | "image" | "file" | "icon"

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  hint?: string
}

export type SectionDef = {
  key: SectionKey
  title: string
  description: string
  fields: FieldDef[]
  titleField: string
  subtitleField?: string
  singleActive?: boolean
}

export const SECTIONS: Record<SectionKey, SectionDef> = {
  hero_word: {
    key: "hero_word", title: "Rotating headline words",
    description: "The highlighted word in the home headline. Add several and they rotate with an animated underline.",
    titleField: "text",
    fields: [{ name: "text", label: "Word or phrase", type: "text", placeholder: "e.g. experiences" }],
  },
  home_photo: {
    key: "home_photo", title: "Home page photo",
    description: "The first published photo is shown in the home hero. Archive old photos to keep them for later.",
    titleField: "alt", singleActive: true,
    fields: [
      { name: "url", label: "Photo", type: "image" },
      { name: "alt", label: "Alt text", type: "text", placeholder: "Emmanuel Abolade" },
    ],
  },
  about_photo: {
    key: "about_photo", title: "About page photo",
    description: "The first published photo is shown on the About page.",
    titleField: "alt", singleActive: true,
    fields: [
      { name: "url", label: "Photo", type: "image" },
      { name: "alt", label: "Alt text", type: "text", placeholder: "Emmanuel Abolade" },
    ],
  },
  home_badge: {
    key: "home_badge", title: "Home photo badges",
    description: "Floating status cards around your home photo. Several published badges float in different spots and rotate.",
    titleField: "value", subtitleField: "label",
    fields: [
      { name: "label", label: "Small label", type: "text", placeholder: "Status" },
      { name: "value", label: "Main text", type: "text", placeholder: "Open to work" },
    ],
  },
  about_badge: {
    key: "about_badge", title: "About photo badges",
    description: "Floating status cards around your About page photo.",
    titleField: "value", subtitleField: "label",
    fields: [
      { name: "label", label: "Small label", type: "text", placeholder: "Currently at" },
      { name: "value", label: "Main text", type: "text", placeholder: "SETU Carlow" },
    ],
  },
  stat: {
    key: "stat", title: "Home stats strip",
    description: "Animated counters below the hero.",
    titleField: "label", subtitleField: "value",
    fields: [
      { name: "value",  label: "Number", type: "number", placeholder: "10" },
      { name: "suffix", label: "Suffix", type: "text",   placeholder: "+ or %" },
      { name: "label",  label: "Label",  type: "text",   placeholder: "Projects shipped" },
    ],
  },
  skill_group: {
    key: "skill_group", title: "Skills",
    description: "Cards of technologies and tools you work with regularly.",
    titleField: "category", subtitleField: "skills",
    fields: [
      { name: "category", label: "Category", type: "text", placeholder: "Frontend" },
      { name: "skills",   label: "Skills",   type: "list", hint: "One per line" },
    ],
  },
  experience: {
    key: "experience", title: "Experience",
    description: "Roles shown on the About page timeline.",
    titleField: "role", subtitleField: "org",
    fields: [
      { name: "role",   label: "Role",         type: "text", placeholder: "Software Developer" },
      { name: "org",    label: "Organisation", type: "text", placeholder: "Company, City" },
      { name: "period", label: "Period",       type: "text", placeholder: "Jun 2026 – Present" },
      { name: "icon",   label: "Icon",         type: "icon" },
      { name: "points", label: "Highlights",   type: "list", hint: "One bullet point per line" },
    ],
  },
  education: {
    key: "education", title: "Education",
    description: "Degrees and qualifications.",
    titleField: "degree", subtitleField: "institution",
    fields: [
      { name: "degree",      label: "Qualification", type: "text" },
      { name: "institution", label: "Institution",   type: "text" },
      { name: "period",      label: "Period",        type: "text", placeholder: "Sep 2022 – May 2026" },
      { name: "note",        label: "Note",          type: "textarea", placeholder: "e.g. First Class Honours" },
      { name: "icon",        label: "Icon",          type: "icon" },
    ],
  },
  beyond_code: {
    key: "beyond_code", title: "Beyond Code",
    description: "Other things that shape how you think and create.",
    titleField: "title", subtitleField: "description",
    fields: [
      { name: "title",       label: "Title",       type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "icon",        label: "Icon",        type: "icon" },
    ],
  },
  cv: {
    key: "cv", title: "CV",
    description: "The first published CV is what employers download from the “Download CV” buttons and from /cv. Archive older versions to keep them.",
    titleField: "label", subtitleField: "file_name", singleActive: true,
    fields: [
      { name: "url",       label: "CV file (PDF)",     type: "file" },
      { name: "label",     label: "Version label",     type: "text", placeholder: "e.g. Graduate CV — Nov 2026" },
      { name: "file_name", label: "Download filename", type: "text", placeholder: "Emmanuel-Abolade-CV.pdf" },
    ],
  },
}
