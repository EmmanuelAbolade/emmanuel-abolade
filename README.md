# Emmanuel Abolade — Personal Portfolio

A full-stack personal portfolio website built with Next.js 14 (App Router), Supabase, Vercel, and Tailwind CSS. Features a fully functional public-facing site and a secure admin dashboard for managing all content without touching code.

**Live:** [emmanuel-abolade.vercel.app](https://emmanuel-abolade.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Admin Dashboard](#admin-dashboard)
- [Theming](#theming)
- [SEO](#seo)
- [Third-Party Services](#third-party-services)
- [Known Issues](#known-issues)

---

## Overview

This portfolio serves as a professional presence on the web — showcasing projects, writing, curated resources, and skills — while providing a secure admin dashboard for managing all content. It was built as a production-grade full-stack application with real authentication, a live database, image storage, email integration, and automatic SEO.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS + custom CSS variables |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Hosting | Vercel |
| Email | Resend |
| Comments | Giscus (GitHub Discussions) |
| Animation | Framer Motion |
| Rich Text Editor | TipTap |
| Analytics | Vercel Analytics + Speed Insights |

---

## Features

### Public Site

- **Home** — animated hero with profile photo, animated stats counter, live featured projects from database, latest blog posts, newsletter subscription
- **About** — bio, grouped skills, experience timeline, education, Beyond Code section, testimonials
- **Projects** — animated card grid, dynamic search with suggestions, tag filtering, full project detail pages with achievements, learnings, technologies and related projects
- **Blog** — editorial card grid, dynamic search, tag filtering, full post detail pages with reading progress bar, table of contents sidebar, author card, Giscus comments, related posts
- **Resources** — curated tools and references with type and pricing filters, My Take section, coupon copy functionality
- **Contact** — validated form saved to database and emailed via Resend
- **Search** — live search across projects, posts and resources simultaneously with highlighted results
- **Auth** — login, forgot password, and reset password pages

### Admin Dashboard

- **Dashboard** — stats overview and recent messages
- **Projects CRUD** — full create, edit, delete with image upload, technologies, achievements, learnings, and links
- **Posts CRUD** — TipTap rich text editor, status cycle (Draft → Review → Published → Archived), cover image upload, tags, categories
- **Resources CRUD** — URL, description, My Take, type, pricing, coupon code, logo upload
- **Categories** — inline create and edit with auto-slug generation
- **Messages** — full message modal, status management, private admin notes, reply via email
- **Subscribers** — list with search, CSV export, copy all emails, stats
- **Testimonials CRUD** — star rating, avatar upload, publish toggle

### Infrastructure

- Image upload via Supabase Storage (drag and drop, URL paste fallback)
- Newsletter subscription API with rate limiting and duplicate detection
- 6 themes — Light, Dark, Forest, Ocean, Rose, Slate
- Full SEO — sitemap, robots.txt, og:image, Twitter cards, dynamic metadata
- Google Search Console verified and sitemap submitted
- Middleware protecting all admin routes

---

## Project Structure

```
├── app/
│   ├── page.tsx                     # Home page (server component)
│   ├── HomeClient.tsx               # Home page client component
│   ├── globals.css                  # Global styles and CSS variables
│   ├── layout.tsx                   # Root layout with metadata and providers
│   ├── sitemap.ts                   # Auto-generated sitemap
│   ├── robots.ts                    # Search engine crawling rules
│   ├── about/page.tsx               # About page
│   ├── blog/
│   │   ├── page.tsx
│   │   ├── BlogClient.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── BlogPostClient.tsx
│   ├── projects/
│   │   ├── page.tsx
│   │   ├── ProjectsClient.tsx
│   │   └── [slug]/
│   │       ├── page.tsx
│   │       └── ProjectDetail.tsx
│   ├── resources/
│   │   ├── page.tsx
│   │   └── ResourcesClient.tsx
│   ├── contact/page.tsx
│   ├── search/
│   │   ├── page.tsx
│   │   └── SearchClient.tsx
│   ├── login/page.tsx
│   ├── forgot-password/page.tsx
│   ├── reset-password/page.tsx
│   ├── api/
│   │   ├── contact/route.ts
│   │   ├── subscribe/route.ts
│   │   └── auth/callback/route.ts
│   └── admin/
│       ├── layout.tsx
│       ├── AdminSidebar.tsx
│       ├── dashboard/page.tsx
│       ├── posts/
│       │   ├── page.tsx
│       │   ├── PostForm.tsx
│       │   ├── PostStatusToggle.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       ├── projects/
│       │   ├── page.tsx
│       │   ├── ProjectForm.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       ├── resources/
│       │   ├── page.tsx
│       │   ├── ResourceForm.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       ├── categories/
│       │   ├── page.tsx
│       │   └── CategoriesClient.tsx
│       ├── messages/
│       │   ├── page.tsx
│       │   └── MessagesClient.tsx
│       ├── subscribers/
│       │   ├── page.tsx
│       │   └── SubscribersClient.tsx
│       ├── testimonials/
│       │   ├── page.tsx
│       │   ├── TestimonialForm.tsx
│       │   ├── new/page.tsx
│       │   └── [id]/edit/page.tsx
│       └── components/
│           ├── DeleteButton.tsx
│           └── PublishToggle.tsx
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── LayoutWrapper.tsx
│   ├── ThemeProvider.tsx
│   ├── ImageUpload.tsx
│   ├── NewsletterForm.tsx
│   ├── GiscusComments.tsx
│   └── TestimonialsSection.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── hooks/
│   │   └── useAutoSave.ts
│   └── seo.ts
├── public/
│   ├── images/
│   │   ├── profile.jpg
│   │   └── profile-2.jpg
│   └── cv.pdf
├── proxy.ts                         # Next.js middleware (admin route protection)
└── next.config.ts                   # Image domains and config
```

---

## Database Schema

All tables have Row Level Security (RLS) enabled. Public users can only read published content. Authenticated users have full CRUD access.

```sql
-- Categories
create table categories (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  slug       text not null unique,
  created_at timestamp with time zone default now()
);

-- Projects
create table projects (
  id               uuid default gen_random_uuid() primary key,
  title            text not null,
  slug             text not null unique,
  excerpt          text,
  description      text,
  technologies     text[],
  my_role          text,
  client           text,
  status           text,
  difficulty_level text,
  repository_url   text,
  showcase_url     text,
  live_url         text,
  image_url        text,
  key_achievements text[],
  learnings        text,
  start_date       date,
  end_date         date,
  featured         boolean default false,
  published        boolean default false,
  pinned_order     integer,
  created_at       timestamp with time zone default now(),
  updated_at       timestamp with time zone default now()
);

-- Posts
create table posts (
  id                    uuid default gen_random_uuid() primary key,
  title                 text not null,
  slug                  text not null unique,
  excerpt               text,
  content               text,
  cover_image           text,
  hide_cover_image      boolean default false,
  meta_description      text,
  canonical_url         text,
  tags                  text[],
  category_id           uuid references categories(id),
  status                text default 'draft',
  featured              boolean default false,
  allow_comments        boolean default true,
  show_table_of_contents boolean default true,
  layout_style          text default 'standard',
  reading_time          integer,
  pinned_order          integer,
  related_post_ids      uuid[],
  published_at          timestamp with time zone,
  created_at            timestamp with time zone default now(),
  updated_at            timestamp with time zone default now()
);

-- Resources
create table resources (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  url             text not null,
  description     text,
  my_take         text,
  resource_type   text,
  pricing_model   text,
  category_id     uuid references categories(id),
  tags            text[],
  logo_url        text,
  is_downloadable boolean default false,
  is_affiliate    boolean default false,
  coupon_code     text,
  discount_amount text,
  click_count     integer default 0,
  featured        boolean default false,
  published       boolean default false,
  pinned_order    integer,
  created_at      timestamp with time zone default now(),
  updated_at      timestamp with time zone default now()
);

-- Subscribers
create table subscribers (
  id         uuid default gen_random_uuid() primary key,
  email      text not null unique,
  created_at timestamp with time zone default now()
);

-- Messages
create table messages (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,
  email        text not null,
  subject      text,
  enquiry_type text,
  message      text not null,
  status       text default 'New',
  admin_notes  text,
  created_at   timestamp with time zone default now()
);

-- Testimonials
create table testimonials (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  role       text,
  company    text,
  avatar_url text,
  content    text not null,
  rating     integer default 5,
  project    text,
  published  boolean default false,
  created_at timestamp with time zone default now()
);
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account and project
- A Resend account for email
- A Vercel account for deployment

### Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/EmmanuelAbolade/emmanuel-abolade.git
cd emmanuel-abolade
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
RESEND_API_KEY=your_resend_api_key
```

**4. Set up the database**

Run the SQL schema above in your Supabase SQL Editor. Then create the RLS policies and the `images` storage bucket as described in the [Admin Dashboard](#admin-dashboard) section.

**5. Create your admin user**

Go to Supabase → Authentication → Users → Add User. Use your email and a strong password. This is the only account that can access the admin dashboard.

**6. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |
| `RESEND_API_KEY` | Your Resend API key for sending emails |

---

## Deployment

This project is deployed on Vercel with automatic deployments on every push to the `main` branch.

**Steps to deploy your own instance:**

1. Push the repository to GitHub
2. Import the project in Vercel
3. Add all environment variables in Vercel → Project → Settings → Environment Variables
4. Deploy — Vercel handles the build automatically

**Build command:** `next build`
**Build time:** ~35 seconds
**Routes:** 34 total (static and dynamic)

---

## Admin Dashboard

Access the admin dashboard at `/login`. The dashboard is protected by middleware — unauthenticated users are redirected to the login page.

**Admin sections:**

| Section | Path |
|---|---|
| Dashboard | /admin/dashboard |
| Projects | /admin/projects |
| Posts | /admin/posts |
| Resources | /admin/resources |
| Categories | /admin/categories |
| Messages | /admin/messages |
| Subscribers | /admin/subscribers |
| Testimonials | /admin/testimonials |

**Image uploads** go to Supabase Storage in the `images` bucket, organised into subfolders: `projects/`, `posts/`, `resources/`, `avatars/`.

---

## Theming

Six themes are available, toggled via the theme button in the navbar:

| Theme | Description |
|---|---|
| Light | Default warm beige |
| Dark | Deep dark background |
| Forest | Deep green tones |
| Ocean | Cool blue tones |
| Rose | Warm rose tones |
| Slate | Neutral grey tones |

Themes are implemented via CSS custom properties (`--bg`, `--accent`, `--text-primary`, etc.) and stored in `localStorage`. The Giscus comments widget automatically syncs with the active theme.

---

## SEO

- **Metadata** — title, description, keywords, author on all pages
- **Open Graph** — og:title, og:description, og:image, og:url on all pages
- **Twitter Cards** — summary_large_image on all pages
- **Dynamic metadata** — blog posts and project pages generate metadata from database content
- **Sitemap** — auto-generated at `/sitemap.xml` from all published posts and projects
- **Robots.txt** — at `/robots.txt`, blocks admin and auth pages from indexing
- **Google Search Console** — verified and sitemap submitted
- **Canonical URLs** — set on all pages

---

## Third-Party Services

| Service | Purpose |
|---|---|
| Vercel | Hosting, CI/CD, Analytics, Speed Insights |
| Supabase | Database, authentication, file storage |
| Resend | Transactional email for contact form |
| Giscus | Blog post comments via GitHub Discussions |
| Google Search Console | SEO monitoring and sitemap submission |
| Cloudinary | Optional external image hosting (URL paste) |

---

## Known Issues

| Issue | Status | Notes |
|---|---|---|
| Auto-save draft restore | Pending | Saves to localStorage correctly but restore after navigation not working due to Next.js route transition timing |
| og:image | Pending | Social preview image (1200x630px) not yet created |
| Real testimonials | Pending | To be added once collected from users |
| Custom domain | Pending | To be configured when domain is purchased |

---

## Author

**Emmanuel Abolade**
Software Developer — Ireland
[emmanuel-abolade.vercel.app](https://emmanuel-abolade.vercel.app)
[linkedin.com/in/emmanuel-m-abolade](https://linkedin.com/in/emmanuel-m-abolade)
[github.com/EmmanuelAbolade](https://github.com/EmmanuelAbolade)

---

## License

This project is personal and not licensed for redistribution. The code is publicly visible for portfolio and reference purposes only.
