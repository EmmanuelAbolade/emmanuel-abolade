# Project Doc — emmanuel-abolade.vercel.app

> Living record of this portfolio: what it is, how it's built, what has been done, what's pending, and how to operate it.
> **Update this file every time work is done on the project** (add a Change Log entry, tick off backlog items, record any database changes).

_Last updated: 3 Nov 2026_

---

## 1. What this project is

A personal portfolio for Emmanuel Abolade (software developer, Ireland) with two halves:

- **Public site** — Home, About, Projects, Blog, Resources, Contact, Search.
- **Admin dashboard** (`/admin`, login required) — manage every piece of content without touching code.

Live: https://emmanuel-abolade.vercel.app · Repo: https://github.com/EmmanuelAbolade/emmanuel-abolade · Deploys automatically from `main` on Vercel.

---

## 2. Tech stack & dependencies

| Area | Choice |
|---|---|
| Framework | Next.js **16.2.6** (App Router, Turbopack), React 19.2 |
| Language / styling | TypeScript 5, Tailwind CSS v4 + CSS variables in `app/globals.css` (6 themes) |
| Database / auth / files | Supabase (Postgres + RLS, Supabase Auth, Supabase Storage) |
| Hosting | Vercel (+ Analytics, Speed Insights) |
| Email | Resend (contact form) |
| Comments | Giscus (GitHub Discussions) |

**npm packages:** `next`, `react`, `react-dom`, `@supabase/supabase-js`, `@supabase/ssr`, `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-placeholder`, `@tiptap/extension-character-count`, `@tiptap/extension-code-block-lowlight`, `@tiptap/extension-image`, `lowlight`, `framer-motion`, `lucide-react`, `next-themes`, `resend`, `@vercel/analytics`, `@vercel/speed-insights`, `@fontsource/dm-sans`, `@fontsource/dm-serif-display`. Dev: `tailwindcss`, `@tailwindcss/postcss`, `typescript`, `eslint`, `eslint-config-next`, `@types/*`.

**Environment variables** (Vercel → Settings → Environment Variables, and `.env.local` for local dev):
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`.

> Next.js 16 differs from older versions — e.g. middleware is `proxy.ts`. Check `node_modules/next/dist/docs/` before using unfamiliar APIs.

---

## 3. Architecture

- **Pages pattern:** server `page.tsx` fetches from Supabase → passes data to a client component (`*Client.tsx`) for animation/interaction. All public pages are rendered on demand, so admin edits show up immediately (no rebuild needed).
- **Auth guard:** `proxy.ts` redirects unauthenticated `/admin/*` requests to `/login`; `app/admin/layout.tsx` double-checks the user.
- **Supabase clients:** `lib/supabase/server.ts` (server components/routes), `lib/supabase/client.ts` (browser/admin forms).
- **Editable site content:** `lib/site-content.ts` (types, defaults, admin field definitions) + `lib/site-content-server.ts` (`getSiteData()`, `getActiveCv()`). If the tables can't be read, pages fall back to the defaults — the site never breaks.
- **Uploads:** `lib/upload.ts` → Storage buckets `images` (photos, covers, galleries; folders `projects/ posts/ resources/ avatars/ site/`) and `documents` (CV PDFs, folder `cv/`).
- **Rich text:** `components/RichTextEditor.tsx` (TipTap, sticky toolbar, links, inline images). Output is HTML rendered with the shared `.prose-content` styles in `globals.css`.
- **API routes:** `app/api/contact` (save message + Resend email), `app/api/subscribe` (newsletter), `app/api/auth/callback`, `app/cv` (stable CV download link).
- **SEO:** `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `public/og-image.png`, Google Search Console verification file in `public/`.

### Key folders
```
app/                 public pages, admin, API routes
app/admin/site/      Site Content editor (Home/About/CV)
components/          shared UI (HeroText, FloatingBadges, ImageGallery, GalleryUpload, RichTextEditor, ImageUpload, ...)
lib/                 supabase clients, site content, uploads, seo, text helpers, hooks
supabase/migrations/ SQL changes — run in Supabase SQL Editor, in date order
```

---

## 4. Database

Tables (all with Row Level Security — public reads published content, the logged-in admin can do everything):
`projects`, `posts`, `resources`, `categories`, `messages`, `subscribers`, `testimonials`, **`site_content`**, **`site_items`**.

| Table | Purpose |
|---|---|
| `site_content` | One row per text block: `hero` (welcome line, headline, intro) and `about` (name, headline, location, bio, section subtitles, "work together" box). `value` is JSON. |
| `site_items` | Repeatable items with `section`, `data` (JSON), `status` (`published` / `hidden` / `archived`), `sort_order`. Sections: `hero_word`, `home_photo`, `about_photo`, `home_badge`, `about_badge`, `stat`, `skill_group`, `experience`, `education`, `beyond_code`, `cv`. |
| `projects.gallery`, `posts.gallery` | `text[]` of extra image URLs. |

### Migration log
| File | Purpose | Applied to production? |
|---|---|---|
| (original setup) | Base tables — see README "Database Schema" | Yes |
| `supabase/migrations/20261103_site_content.sql` | Site content tables, galleries, `documents` bucket, seed of current content | Yes — 3 Nov 2026 |

---

## 5. Features

**Public:** animated hero (letter-reveal welcome line, rotating highlighted headline word, floating rotating badges), stats counters, featured projects, latest posts, newsletter; About page (bio, skills, experience, education, beyond code, testimonials); Projects with search/filters and detail pages (rich description + gallery lightbox); Blog with search/tags, reading progress, TOC, comments, gallery; Resources; Contact; global Search; `/cv` download.

**Admin:** Dashboard · **Site Content** (Home, About, CV — publish/hide/archive, reorder, delete) · Projects, Posts, Resources, Testimonials CRUD (mobile-friendly list rows with thumbnails) · Categories · Messages · Subscribers (CSV export).

### How-to (admin)
- **Update graduate status / bio:** Admin → Site Content → About page → "About me" → edit → Save. Update the intro on the Home tab too.
- **New CV:** Site Content → CV → Add → upload PDF → Add. It becomes live at once; the old one moves to Hidden.
- **Change a photo:** Site Content → Home/About → photo section → Add new (becomes live) — old one kept as Hidden; Archive it to tuck it away.
- **Rotate several badges/words:** add more items and keep them Published.
- **Hide vs Archive vs Delete:** Hidden = not on site, still in list; Archived = not on site, collapsed under "Show archived"; Delete = permanent.

---

## 6. Operations checklist (check monthly)

- Supabase project active (free tier pauses after ~1 week of inactivity → site shows no data).
- Vercel Node.js version is 24 (Node 20 deprecated Oct 2026); latest deploy green.
- Contact emails arriving (Resend sends from `onboarding@resend.dev`, which only delivers to the Resend account owner's email).
- Admin → Messages/Subscribers for spam (rate limiting is per server instance only).
- Google Search Console: indexing and sitemap errors; Vercel Speed Insights scores.
- `npm outdated` / `npm audit` for security updates (especially `next`).

---

## 7. Backlog / known issues

| Item | Priority | Notes |
|---|---|---|
| Custom domain | Medium | `emmanuel-abolade.vercel.app` is hard-coded in `lib/seo.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx` — update all when switching. |
| Verified Resend sending domain | Medium | Needs custom domain first. |
| Stronger rate limiting on contact/subscribe | Medium | Current in-memory limiter resets per instance. |
| Newsletter sending + unsubscribe | Low | Subscribers are collected but nothing sends to them. |
| Real testimonials | Low | Add via Admin → Testimonials. |
| og-image is 1200×600 | Low | Code declares 1200×630. |
| README out of date | Low | Says "Next.js 14" in intro; Known Issues table superseded by this doc. |
| Lint: 4 × `react-hooks/set-state-in-effect` | Low | `Navbar.tsx` (2), `BlogPostClient.tsx`, `SearchClient.tsx`. Working code; flagged by the newer React lint rules. Not build-blocking. |

---

## 8. Change log

### 2026-11-03 — Editable site content, admin UX, galleries
- New **Site Content** admin (`/admin/site`): Home hero text, rotating headline words, home/about photos, photo badges, stats, About bio + section subtitles + "work together" box, skills, experience, education, beyond code, CV — each with Published/Hidden/Archived, reorder, delete.
- Home hero restyled: capsule replaced by animated accent line + letter reveal; highlighted word rotates with drawn underline; multiple floating badges with pulse dot.
- `/cv` stable download route serving the live CV (falls back to `public/cv.pdf`).
- Admin tables (projects, posts, resources, testimonials) rebuilt: thumbnails, readable 2-line titles, status/featured/date/tag chips, view-on-site link, stacked cards on mobile. Admin gets a mobile top bar; form grids wrap on small screens.
- Rich-text editor: toolbar stays pinned while scrolling; added underline, strikethrough, links, inline image upload. Project "Full Description" now uses it (old plain-text descriptions auto-converted).
- Multi-image **galleries** for projects and posts with full-screen lightbox (keyboard + swipe).
- Fixed: post draft auto-save/restore (empty form overwrote the draft; editor didn't show restored content; draft re-saved after publishing).
- Fixed: editing a published post no longer resets its publish date.
- Fixed: search suggestions/highlighting crashed on characters like `(`, `[`, `+` (Blog, Projects, Search).
- Cleaned unused imports. Added `lib/text.ts`, `lib/upload.ts`, `lib/rich-text.ts`, `lib/site-icons.ts`.

### 2026-05-28 → 2026-06-02 — Initial build (45 commits)
Supabase setup → layout/themes/public pages → contact + Resend → admin CRUD (projects, posts, resources, messages, subscribers, categories) → newsletter, image upload, global search → auto-save, Giscus, testimonials, CV → password reset, mobile fixes → SEO + Search Console → Vercel Analytics → README.
