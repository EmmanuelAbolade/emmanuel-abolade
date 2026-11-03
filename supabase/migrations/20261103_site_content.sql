-- 20261103_site_content.sql
-- Editable Home/About content, CV management and image galleries.
-- Run once in Supabase → SQL Editor. Safe to re-run: seeds only insert into empty tables.

-- ── Single-value content blocks (hero text, about intro) ──────────────
create table if not exists site_content (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default now()
);

-- ── Repeatable items (photos, badges, stats, skills, experience, ...) ─
create table if not exists site_items (
  id         uuid default gen_random_uuid() primary key,
  section    text not null,
  data       jsonb not null default '{}'::jsonb,
  status     text not null default 'published'
             check (status in ('published', 'hidden', 'archived')),
  sort_order integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists site_items_section_idx on site_items (section, sort_order);

alter table site_content enable row level security;
alter table site_items   enable row level security;

drop policy if exists "Public can read site content" on site_content;
create policy "Public can read site content" on site_content
  for select using (true);

drop policy if exists "Admin can manage site content" on site_content;
create policy "Admin can manage site content" on site_content
  for all to authenticated using (true) with check (true);

drop policy if exists "Public can read published site items" on site_items;
create policy "Public can read published site items" on site_items
  for select using (status = 'published');

drop policy if exists "Admin can manage site items" on site_items;
create policy "Admin can manage site items" on site_items
  for all to authenticated using (true) with check (true);

-- ── Image galleries on projects and posts ─────────────────────────────
alter table projects add column if not exists gallery text[] default '{}';
alter table posts    add column if not exists gallery text[] default '{}';

-- ── Storage bucket for CV / documents ─────────────────────────────────
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

drop policy if exists "Public can read documents" on storage.objects;
create policy "Public can read documents" on storage.objects
  for select using (bucket_id = 'documents');

drop policy if exists "Admin can upload documents" on storage.objects;
create policy "Admin can upload documents" on storage.objects
  for insert to authenticated with check (bucket_id = 'documents');

drop policy if exists "Admin can update documents" on storage.objects;
create policy "Admin can update documents" on storage.objects
  for update to authenticated using (bucket_id = 'documents');

drop policy if exists "Admin can delete documents" on storage.objects;
create policy "Admin can delete documents" on storage.objects
  for delete to authenticated using (bucket_id = 'documents');

-- ── Seed with the content that is currently hard-coded ────────────────
insert into site_content (key, value)
select * from (values
  ('hero', $${
    "eyebrow": "Welcome to my portfolio",
    "headline_top": "Building digital",
    "headline_bottom": "that matter.",
    "intro": "Software developer based in Ireland, focused on building clean, purposeful and user-driven digital systems. Final-year BSc student at SETU Carlow."
  }$$::jsonb),
  ('about', $${
    "eyebrow": "About Me",
    "name": "Emmanuel Abolade",
    "headline": "Developer, creator,\nand problem solver.",
    "location": "Ireland",
    "bio": "<p>I am a final-year Software Development student at South East Technological University, Carlow, focused on building clean, purposeful, and user-driven digital systems.</p><p>I approach development as both a technical and creative discipline — structuring ideas, refining complexity, and delivering solutions that are intuitive, reliable, and scalable. My work is grounded in clarity, system thinking, and real-world application.</p><p>Beyond software, I create digital content and work in event videography — capturing and presenting stories that engage audiences. This creative work strengthens my attention to detail, visual thinking, and ability to communicate ideas clearly across different mediums.</p>",
    "skills_subtitle": "Technologies and tools I work with regularly.",
    "experience_subtitle": "Where I have applied my skills in the real world.",
    "education_subtitle": "My academic background and qualifications.",
    "beyond_subtitle": "Other things that shape how I think and create.",
    "cta_title": "Want to work together?",
    "cta_text": "I am open to full-time roles, freelance projects, and collaborations. Let us build something great."
  }$$::jsonb)
) as seed(key, value)
where not exists (select 1 from site_content);

insert into site_items (section, sort_order, data)
select * from (values
  ('hero_word',   1, $${"text": "experiences"}$$::jsonb),
  ('home_photo',  1, $${"url": "/images/profile.jpg", "alt": "Emmanuel Abolade"}$$::jsonb),
  ('about_photo', 1, $${"url": "/images/profile.jpg", "alt": "Emmanuel Abolade"}$$::jsonb),
  ('home_badge',  1, $${"label": "Status", "value": "Open to work"}$$::jsonb),
  ('about_badge', 1, $${"label": "Currently at", "value": "SETU Carlow"}$$::jsonb),
  ('stat', 1, $${"value": 3,   "suffix": "+", "label": "Years building"}$$::jsonb),
  ('stat', 2, $${"value": 10,  "suffix": "+", "label": "Projects shipped"}$$::jsonb),
  ('stat', 3, $${"value": 15,  "suffix": "+", "label": "Technologies used"}$$::jsonb),
  ('stat', 4, $${"value": 100, "suffix": "%", "label": "Passion for code"}$$::jsonb),
  ('skill_group', 1, $${"category": "Languages", "skills": ["JavaScript", "TypeScript", "Python", "Java", "C++", "PHP", "SQL"]}$$::jsonb),
  ('skill_group', 2, $${"category": "Frontend", "skills": ["React", "Next.js", "Tailwind CSS", "HTML", "CSS"]}$$::jsonb),
  ('skill_group', 3, $${"category": "Backend & Database", "skills": ["Node.js", "Supabase", "PostgreSQL", "MySQL", "Firebase", "Firestore", "REST APIs"]}$$::jsonb),
  ('skill_group', 4, $${"category": "Machine Learning", "skills": ["scikit-learn", "NumPy", "pandas", "NLP", "TF-IDF", "SVM", "KNN"]}$$::jsonb),
  ('skill_group', 5, $${"category": "Tools & Platforms", "skills": ["Git", "GitHub", "Vercel", "Streamlit", "VS Code", "Figma"]}$$::jsonb),
  ('experience', 1, $${"role": "Multimedia Specialist (Voluntary)", "org": "RCCG Trinity Hall, Portlaoise", "period": "Aug 2022 – Present", "icon": "video", "points": ["Conceptualise, film, and edit multimedia content for web and social media platforms end-to-end.", "Collaborate with stakeholders to align content with branding and community engagement goals."]}$$::jsonb),
  ('experience', 2, $${"role": "Software Development Intern", "org": "Fastrack Into Information Technology (FIT), Dublin", "period": "Jan 2022", "icon": "code", "points": ["Developed frontend components for an online craft store, collaborating on marketing and product presentation.", "Delivered solutions within deadlines while maintaining professional standards in a team environment."]}$$::jsonb),
  ('experience', 3, $${"role": "Healthcare Assistant", "org": "Dunboyne Nursing Home, Dunboyne", "period": "Aug 2019 – Jul 2021", "icon": "briefcase", "points": ["Provided high-quality resident care in a fast-paced environment with accurate documentation.", "Developed strong attention to detail, empathy, and teamwork — all transferable to software development."]}$$::jsonb),
  ('education', 1, $${"degree": "BSc (Hons) in Software Development", "institution": "South East Technological University, Carlow", "period": "Sep 2022 – May 2026", "note": "Final year — awaiting graduation", "icon": "book"}$$::jsonb),
  ('education', 2, $${"degree": "QQI Level 5 — Computer Science in Software Development (Distinction)", "institution": "Portlaoise Institute, Portlaoise", "period": "Sep 2021 – May 2022", "note": "Modules: Web Authoring, Software Architecture, Java, Database Management, Mathematics for IT", "icon": "book"}$$::jsonb),
  ('beyond_code', 1, $${"title": "Content Creation", "description": "Creator of StayEnriched and TreasuredStoriesForKids — YouTube channels built around storytelling, education, and community engagement.", "icon": "video"}$$::jsonb),
  ('beyond_code', 2, $${"title": "Event Videography", "description": "Capturing, editing, and presenting stories at events in a way that resonates with audiences — sharpening visual thinking and detail orientation.", "icon": "video"}$$::jsonb),
  ('beyond_code', 3, $${"title": "Charity Work", "description": "Actively involved in volunteering and community service, believing that giving back is part of what it means to build something meaningful.", "icon": "briefcase"}$$::jsonb),
  ('cv', 1, $${"url": "/cv.pdf", "file_name": "Emmanuel-Abolade-CV.pdf", "label": "Original CV"}$$::jsonb)
) as seed(section, sort_order, data)
where not exists (select 1 from site_items);
