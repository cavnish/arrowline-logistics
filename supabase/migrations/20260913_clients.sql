create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  category text not null default '',
  website text,
  is_featured boolean not null default false,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Published clients are readable"
  on public.clients for select to anon, authenticated
  using (is_published = true);

create policy "Authenticated users cannot write clients directly"
  on public.clients for all to authenticated
  using (false) with check (false);