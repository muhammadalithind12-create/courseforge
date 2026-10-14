-- CourseForge schema: online course platform with progress tracking
-- Run in the Supabase SQL editor (project "portfolio-backend").
-- Public (anon) read on published content; public read+insert on progress
-- so the demo works with NO login (demo student id in localStorage).

create table if not exists cf_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  thumbnail_emoji text not null default '📚',
  level text not null check (level in ('beginner', 'intermediate', 'advanced')),
  price_cents int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists cf_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references cf_courses(id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists cf_modules_course_idx on cf_modules(course_id, position);

create table if not exists cf_lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references cf_modules(id) on delete cascade,
  course_id uuid not null references cf_courses(id) on delete cascade,
  title text not null,
  content text not null,
  video_url text,
  duration_minutes int not null default 10,
  position int not null default 0,
  is_free_preview boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists cf_lessons_module_idx on cf_lessons(module_id, position);
create index if not exists cf_lessons_course_idx on cf_lessons(course_id);

create table if not exists cf_progress (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references cf_lessons(id) on delete cascade,
  student_id text not null,
  completed_at timestamptz not null default now(),
  unique(lesson_id, student_id)
);
create index if not exists cf_progress_student_idx on cf_progress(student_id);

-- Row Level Security: everything readable publicly (published content only);
-- progress is demo-tracked per anonymous student id (read + insert, no login).
alter table cf_courses enable row level security;
alter table cf_modules enable row level security;
alter table cf_lessons enable row level security;
alter table cf_progress enable row level security;

drop policy if exists cf_courses_public_read on cf_courses;
create policy cf_courses_public_read
  on cf_courses for select
  using (is_published = true);

drop policy if exists cf_modules_public_read on cf_modules;
create policy cf_modules_public_read
  on cf_modules for select
  using (
    exists (
      select 1 from cf_courses c
      where c.id = cf_modules.course_id and c.is_published = true
    )
  );

drop policy if exists cf_lessons_public_read on cf_lessons;
create policy cf_lessons_public_read
  on cf_lessons for select
  using (
    exists (
      select 1 from cf_courses c
      where c.id = cf_lessons.course_id and c.is_published = true
    )
  );

drop policy if exists cf_progress_public_read on cf_progress;
create policy cf_progress_public_read
  on cf_progress for select
  using (true);

drop policy if exists cf_progress_public_insert on cf_progress;
create policy cf_progress_public_insert
  on cf_progress for insert
  with check (true);
