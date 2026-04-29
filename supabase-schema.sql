create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

drop policy if exists "Users can read their own notes" on public.notes;
create policy "Users can read their own notes"
on public.notes
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create their own notes" on public.notes;
create policy "Users can create their own notes"
on public.notes
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update their own notes" on public.notes;
create policy "Users can update their own notes"
on public.notes
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own notes" on public.notes;
create policy "Users can delete their own notes"
on public.notes
for delete
using (auth.uid() = user_id);

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  role text not null check (role in ('client', 'collaborateur', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, email)
);

alter table public.app_users enable row level security;

drop policy if exists "Users can read their managed users" on public.app_users;
create policy "Users can read their managed users"
on public.app_users
for select
using (auth.uid() = owner_id);

drop policy if exists "Users can create managed users" on public.app_users;
create policy "Users can create managed users"
on public.app_users
for insert
with check (auth.uid() = owner_id);

drop policy if exists "Users can update managed users" on public.app_users;
create policy "Users can update managed users"
on public.app_users
for update
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "Users can delete managed users" on public.app_users;
create policy "Users can delete managed users"
on public.app_users
for delete
using (auth.uid() = owner_id);
