# 🎓 CourseForge — Online Course Platform with Progress Tracking

> Practical online courses on web development and freelancing. Browse the catalog, read free previews, and track your progress lesson by lesson — no account needed.

- **Live demo:** _[production URL]_
- **Stack:** Next.js 16, TypeScript, Supabase (PostgreSQL + Row Level Security), Tailwind CSS, pnpm + Turborepo
- **License:** MIT — see [`LICENSE`](./LICENSE)

## Features

- **Public course catalog** — course cards with level badges, lesson counts, and total duration
- **Curriculum view** — modules with ordered lessons, free-preview badges, per-lesson completion checkmarks
- **Lesson reader** — clean typography, prev/next navigation, "Mark as complete" with auto-advance suggestion
- **Progress tracking without login** — an anonymous demo-student id in `localStorage` keys the `cf_progress` table; course-level progress bars and "Continue learning" resume where you left off
- **Seeded demo content** — 3 complete courses, 20 genuinely useful lessons (Next.js 16, Supabase, freelancing with AI tools)
- **RLS-secured** — public read on published content only; public read+insert on progress

## Project structure

```
supabase/
  migrations/001_courseforge.sql  # cf_courses, cf_modules, cf_lessons, cf_progress + RLS
  seeds/demo.sql                  # 3 courses / 20 lessons of real content (re-runnable)
apps/web/src/
  app/(external-pages)/courses/   # /courses, /courses/[slug], /courses/[slug]/lessons/[lessonId]
  lib/courseforge.ts              # types + public data-fetching helpers
```

## Setup

1. Create a Supabase project (free tier works).
2. In the Supabase SQL editor, run `supabase/migrations/001_courseforge.sql`, then `supabase/seeds/demo.sql`.
3. Copy `.env.local.example` to `.env.local` at the repo root and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
4. `pnpm install`, then `pnpm web#dev` (or `pnpm dev`).
5. Open `/courses`.

## Deploy

The web app deploys to Vercel as-is (import `apps/web` as the project root). Set the two `NEXT_PUBLIC_SUPABASE_*` env vars in the Vercel dashboard.

## Attribution

CourseForge is built on the [NextBase Next.js + Supabase starter](https://github.com/awakenedpigeon/nextbase-nextjs-supabase-starter) (MIT licensed). The course platform — schema, seed content, catalog/curriculum/lesson UI, and login-free progress tracking — is original work built on top of that foundation. The starter's `LICENSE` is preserved.
