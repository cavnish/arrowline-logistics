create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  full_description text not null default '',
  icon text not null default '',
  hero_image text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  cta_text text,
  cta_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.services enable row level security;

create policy "Published services are readable"
  on public.services for select to anon, authenticated
  using (is_published = true);

create policy "Authenticated users cannot write services directly"
  on public.services for all to authenticated
  using (false) with check (false);

insert into public.site_content (content_key, content_value, section)
values
  ('hero_title', 'Logistics & Transportation Services Across India', 'Hero'),
  ('hero_description', 'Arrowline provides reliable road transportation, freight, multimodal logistics and specialized cargo solutions for businesses across India - all anchored at Mundra Port, Gujarat.', 'Hero'),
  ('hero_cta', 'Get a Free Quote', 'Hero'),
  ('about_description', 'Arrowline Logistics provides integrated logistics and transportation solutions designed to move cargo efficiently from origin to destination.', 'About'),
  ('footer_description', 'Moving Possibilities. Delivering Trust.', 'Footer')
on conflict (content_key) do nothing;

insert into storage.buckets (id, name, public)
values ('website-media', 'website-media', true)
on conflict (id) do nothing;

create policy "Public website media is readable"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'website-media');

create policy "Authenticated users can upload website media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'website-media');

create policy "Authenticated users can update website media"
  on storage.objects for update to authenticated
  using (bucket_id = 'website-media')
  with check (bucket_id = 'website-media');

create policy "Authenticated users can delete website media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'website-media');
