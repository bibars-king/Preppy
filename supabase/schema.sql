-- Preppy database schema + row-level security.
-- Run this in the Supabase SQL editor (or via the CLI) on a fresh project,
-- then load content with `npm run seed`.

-- ============================================================
-- Tables
-- ============================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  total_xp integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_active_date date
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  type text not null check (type in ('psat', 'ap')),
  description text
);

create table if not exists public.topics (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams (id) on delete cascade,
  name text not null,
  order_index integer not null default 0,
  youtube_video_id text,
  summary text
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.topics (id) on delete cascade,
  exam_id uuid not null references public.exams (id) on delete cascade,
  type text not null check (type in ('mcq', 'grid_in', 'frq')),
  difficulty text not null check (difficulty in ('easy', 'medium', 'hard')),
  prompt text not null,
  choices jsonb,
  correct_answer text,
  explanation text,
  model_answer text,
  order_index integer not null default 0
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams (id) on delete cascade,
  slug text unique,
  title text not null,
  mode text not null check (mode in ('practice', 'warmup', 'mock')),
  time_limit_seconds integer,
  question_ids jsonb not null default '[]'::jsonb
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  quiz_id uuid references public.quizzes (id) on delete set null,
  exam_id uuid not null references public.exams (id) on delete cascade,
  mode text not null check (mode in ('practice', 'warmup', 'mock')),
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score integer not null default 0,
  total integer not null default 0,
  raw_score_data jsonb not null default '{}'::jsonb
);

create index if not exists attempts_profile_idx on public.attempts (profile_id, finished_at desc);
create index if not exists topics_exam_idx on public.topics (exam_id, order_index);
create index if not exists questions_topic_idx on public.questions (topic_id, order_index);

-- ============================================================
-- Auto-create a profile row when a new auth user signs up
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row-level security
-- ============================================================

alter table public.profiles enable row level security;
alter table public.exams enable row level security;
alter table public.topics enable row level security;
alter table public.questions enable row level security;
alter table public.quizzes enable row level security;
alter table public.attempts enable row level security;

-- Profiles: a user can read and update only their own row.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Content (exams / topics / questions / quizzes): readable by any
-- authenticated user. Writes happen only via the seed script using the
-- service-role key, which bypasses RLS.
drop policy if exists "exams_read" on public.exams;
create policy "exams_read" on public.exams for select using (auth.role() = 'authenticated');

drop policy if exists "topics_read" on public.topics;
create policy "topics_read" on public.topics for select using (auth.role() = 'authenticated');

drop policy if exists "questions_read" on public.questions;
create policy "questions_read" on public.questions for select using (auth.role() = 'authenticated');

drop policy if exists "quizzes_read" on public.quizzes;
create policy "quizzes_read" on public.quizzes for select using (auth.role() = 'authenticated');

-- Attempts: a user can read/write only their own attempts.
drop policy if exists "attempts_select_own" on public.attempts;
create policy "attempts_select_own" on public.attempts
  for select using (auth.uid() = profile_id);

drop policy if exists "attempts_insert_own" on public.attempts;
create policy "attempts_insert_own" on public.attempts
  for insert with check (auth.uid() = profile_id);

drop policy if exists "attempts_update_own" on public.attempts;
create policy "attempts_update_own" on public.attempts
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
