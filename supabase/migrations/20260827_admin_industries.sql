create table if not exists public.industries (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  icon text not null default '',
  cargo_types jsonb not null default '[]'::jsonb,
  image text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.industries enable row level security;

create policy "Published industries are readable"
  on public.industries for select to anon, authenticated
  using (is_published = true);

create policy "Authenticated users cannot write industries directly"
  on public.industries for all to authenticated
  using (false) with check (false);
