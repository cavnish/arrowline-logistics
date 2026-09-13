-- Trusted Network partner cards (public "Trusted by Industry Leaders" strip).
create table if not exists public.trusted_network (
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

alter table public.trusted_network enable row level security;

create policy "Published trusted network partners are readable"
  on public.trusted_network for select to anon, authenticated
  using (is_published = true);

create policy "Authenticated users cannot write trusted network directly"
  on public.trusted_network for all to authenticated
  using (false) with check (false);