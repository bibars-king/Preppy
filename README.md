# Preppy

A published, multi-user web platform that helps students prepare for the
**Digital PSAT** and **AP exams**. Students sign up, watch a lesson video per
topic, drill practice questions with instant feedback, take realistic
full-screen timed mock tests with scoring, and build momentum with streaks
and XP.

The vibe: the polish of a study app with the motivation mechanics of a streak
tracker — credible and collegiate, no mascot.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (light + dark mode via CSS variables)
- **Framer Motion** for animation
- **Supabase** — email/password auth + Postgres with row-level security
- **KaTeX** for math rendering in question prompts
- Deploy target: **Vercel** (free tier)

## What's built (MVP)

The whole machine is wired end-to-end for **two exams**: Digital PSAT (with
full scoring) and AP Calculus AB. Everything else is additive content.

- Animated, public **landing page**
- **Auth** — sign up / log in / log out; a `profiles` row is auto-created on
  signup via a Postgres trigger
- **Dashboard** — level rings, count-up XP, day streak, per-exam mastery,
  "continue where you left off," and a daily warm-up prompt
- **Exam home → topic** — embedded YouTube lesson player + practice entry points
- **Practice / warm-up** — one question at a time, instant MCQ + grid-in
  grading, worked explanations, flag for review, XP, and a confetti pop
- **FRQ flow** — write a free response, reveal a model answer (ungraded, clearly
  labeled)
- **Mock-test engine** — distraction-free full-screen exam: section timer,
  question navigator (answered / unanswered / flagged), flag for review, calm
  motion only, server-side scoring on submit or timeout
- **Results screen** — animated score ring, time used, what to study next, and
  per-question review with explanations

## Architecture notes

- **Content lives in typed seed files** under [`/content`](./content). Adding a
  new exam (AP English Lang/Lit, US History, Precalc, Calc BC, Biology, …) is
  purely a content task: create `content/<exam>.ts` exporting a `SeedExam`,
  append it to `content/index.ts`, and re-run the seed. No new components.
- **Authoritative grading** happens server-side in
  [`src/app/attempts/actions.ts`](./src/app/attempts/actions.ts) — the client
  is never trusted for correctness. The same action powers practice, warm-ups,
  and mock tests, and it advances XP + the daily streak.
- **Row-level security** ([`supabase/schema.sql`](./supabase/schema.sql))
  guarantees each student only reads/writes their own profile and attempts.
  Content tables are read-only to authenticated users; the seed script writes
  with the service-role key, which bypasses RLS.

## Getting started

### 1. Install

```bash
npm install
```

### 2. Create a Supabase project

At [supabase.com](https://supabase.com/dashboard), create a project. From
**Project Settings → API**, copy:

- Project URL
- `anon` public key
- `service_role` key (server-only — never expose it)

### 3. Configure environment

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Create the schema

Open the Supabase **SQL editor**, paste the contents of
[`supabase/schema.sql`](./supabase/schema.sql), and run it. This creates all
tables, the signup trigger, and RLS policies.

### 5. Seed content

```bash
npm run seed
```

This loads the Digital PSAT and AP Calculus AB exams, topics, questions, and
quizzes. It's idempotent — safe to re-run after editing content files.

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and you'll land
on the dashboard.

> **Email confirmation:** by default Supabase requires email confirmation. For
> local development you can disable it under **Authentication → Providers →
> Email → Confirm email**, or use the magic link printed in the Supabase logs.

## Adding a new exam (no code)

1. Create `content/ap-biology.ts` exporting a `SeedExam` (copy
   `content/calc-ab.ts` as a template).
2. Add it to the array in `content/index.ts`.
3. Run `npm run seed`.

The new exam appears on the dashboard and exam list, with topics, lessons,
practice, warm-ups, and a mock test — all using the existing components.

## Lesson videos

Topic `youtube_video_id` values in the seed files are placeholders. Replace
them with your own lesson video IDs (the part after `v=` in a YouTube URL) and
re-run the seed.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the same environment variables (use your production Supabase URL/keys,
   and set `NEXT_PUBLIC_SITE_URL` to your `.vercel.app` domain).
4. In Supabase **Authentication → URL Configuration**, add your Vercel domain
   to the allowed redirect URLs (and set the site URL).
5. Deploy. Run `npm run seed` once locally against the production project (or
   any machine with the service-role key) to load content.

## Project structure

```
content/            Typed seed content (exams, topics, questions, quizzes)
scripts/seed.ts     Loads content into Supabase (idempotent)
supabase/schema.sql Tables + RLS + signup trigger
src/
  app/
    page.tsx                  Landing
    login, signup             Auth
    (app)/                    Authenticated shell (nav)
      dashboard, exams, results
    practice/[slug]           Practice & warm-up runner
    mock/[slug]               Full-screen mock-test engine
    attempts/actions.ts       Server-side grading + XP/streak
    auth/                      Auth server actions + callback
  components/                 Logo, UI, landing, practice, mock, results
  lib/                        types, grading, streak math, Supabase clients, queries
```
