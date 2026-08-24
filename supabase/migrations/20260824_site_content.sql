create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique check (content_key ~ '^[a-z0-9_]+$'),
  content_value text not null default '',
  content_type text not null default 'text',
  section text,
  is_published boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id) on delete set null
);

alter table public.site_content enable row level security;

create policy "Published site content is readable" on public.site_content
  for select to anon, authenticated using (is_published = true);

create policy "Authenticated users cannot write site content directly" on public.site_content
  for all to authenticated using (false) with check (false);
