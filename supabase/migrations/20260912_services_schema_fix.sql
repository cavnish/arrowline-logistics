drop policy if exists "Public website media is readable" on storage.objects;
drop policy if exists "Authenticated users can upload website media" on storage.objects;
drop policy if exists "Authenticated users can update website media" on storage.objects;
drop policy if exists "Authenticated users can delete website media" on storage.objects;

insert into storage.buckets (id, name, public)
values ('website-media', 'website-media', true)
on conflict (id) do nothing;

create policy "Public website media is readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'website-media');

alter table public.services add column if not exists hero_video text;
alter table public.services add column if not exists hero_fallback_image text;
alter table public.services add column if not exists capabilities jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists benefits jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists category text;
alter table public.services add column if not exists key_capability text;
alter table public.services add column if not exists hero_badge text;
alter table public.services add column if not exists hero_headline text;
alter table public.services add column if not exists hero_subheadline text;
alter table public.services add column if not exists hero_description text;
alter table public.services add column if not exists highlights jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists about_badge text;
alter table public.services add column if not exists about_heading text;
alter table public.services add column if not exists about_description text;
alter table public.services add column if not exists about_bullet_points jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists about_image text;
alter table public.services add column if not exists why_arrowline jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists process_steps jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists applications jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists industries jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists network_description text;
alter table public.services add column if not exists faqs jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.services add column if not exists video_url text;
alter table public.services add column if not exists video_poster text;
alter table public.services add column if not exists cta_headline text;
alter table public.services add column if not exists seo_title text;
alter table public.services add column if not exists seo_desc text;

alter table public.service_items add column if not exists hero_video text;
alter table public.service_items add column if not exists hero_fallback_image text;
alter table public.service_items add column if not exists capabilities jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists benefits jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists category text;
alter table public.service_items add column if not exists key_capability text;
alter table public.service_items add column if not exists hero_badge text;
alter table public.service_items add column if not exists hero_headline text;
alter table public.service_items add column if not exists hero_subheadline text;
alter table public.service_items add column if not exists hero_description text;
alter table public.service_items add column if not exists highlights jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists about_badge text;
alter table public.service_items add column if not exists about_heading text;
alter table public.service_items add column if not exists about_description text;
alter table public.service_items add column if not exists about_bullet_points jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists about_image text;
alter table public.service_items add column if not exists why_arrowline jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists process_steps jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists applications jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists industries jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists network_description text;
alter table public.service_items add column if not exists faqs jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists gallery jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists video_url text;
alter table public.service_items add column if not exists video_poster text;
alter table public.service_items add column if not exists cta_headline text;
alter table public.service_items add column if not exists seo_title text;
alter table public.service_items add column if not exists seo_desc text;
alter table public.service_items add column if not exists keywords jsonb not null default '[]'::jsonb;
alter table public.service_items add column if not exists parent_slug text;

create index if not exists services_display_order_idx on public.services (is_published, display_order);
create index if not exists services_slug_idx on public.services (slug);
create index if not exists service_items_service_id_display_order on public.service_items (service_id, display_order);
create index if not exists service_items_slug_idx on public.service_items (service_id, slug);
