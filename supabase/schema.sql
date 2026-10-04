-- รันทั้งไฟล์ใน Supabase SQL Editor ของโปรเจกต์ TrackingApp

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  target text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, name)
);

create table if not exists public.day_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  occurred_on date not null,
  done boolean not null,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, occurred_on)
);

create index if not exists day_logs_user_occurred_idx
  on public.day_logs (user_id, occurred_on desc);

alter table public.habits enable row level security;
alter table public.day_logs enable row level security;

drop policy if exists "habits_own" on public.habits;
create policy "habits_own"
  on public.habits
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "day_logs_own" on public.day_logs;
create policy "day_logs_own"
  on public.day_logs
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.habits to authenticated;
grant select, insert, update, delete on public.day_logs to authenticated;
