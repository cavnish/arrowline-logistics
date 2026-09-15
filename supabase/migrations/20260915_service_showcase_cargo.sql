-- =============================================================================
-- Visual Showcase + Cargo & Applications — fully CMS-relational sub-resources.
--
-- Every service / sub-service gains its own:
--   • Visual Showcase  → multi-image gallery  (service_visual_showcase)
--   • Cargo & Applications → cargo profile cards (service_cargo_applications)
--
-- Design mirrors the existing service_faqs / service_process_steps pattern:
-- each row links to EXACTLY ONE owner (a main service OR a sub-service).
--
-- Supabase = metadata, Cloudinary = images. Image rows store the Cloudinary
-- secure_url + public_id + asset metadata (width/height/format/bytes).
--
-- Idempotent + additive-only. Existing data is never deleted. When an owner
-- already has legacy JSONB `gallery` / `applications` content, it is backfilled
-- into the relational tables so Public/admin stay in sync (guarded per entity).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Visual Showcase images
-- -----------------------------------------------------------------------------
create table if not exists public.service_visual_showcase (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  service_item_id uuid references public.service_items(id) on delete cascade,
  title text not null default '',
  caption text,
  alt_text text,
  image_url text not null,
  image_public_id text,
  image_format text,
  image_width integer,
  image_height integer,
  image_bytes bigint,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (service_id is not null and service_item_id is null) or
    (service_id is null and service_item_id is not null)
  )
);

alter table public.service_visual_showcase enable row level security;

create policy "Published visual showcase is readable"
  on public.service_visual_showcase for select
  to anon, authenticated
  using (is_published = true);

create policy "Backend managed writes service_visual_showcase"
  on public.service_visual_showcase for all
  to authenticated
  using (false) with check (false);

create index if not exists service_visual_showcase_public_idx
  on public.service_visual_showcase (is_published, display_order);

-- -----------------------------------------------------------------------------
-- 2. Cargo & Applications
-- -----------------------------------------------------------------------------
create table if not exists public.service_cargo_applications (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete cascade,
  service_item_id uuid references public.service_items(id) on delete cascade,
  title text not null,
  description text not null default '',
  alt_text text,
  image_url text,
  image_public_id text,
  image_format text,
  image_width integer,
  image_height integer,
  image_bytes bigint,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (service_id is not null and service_item_id is null) or
    (service_id is null and service_item_id is not null)
  )
);

alter table public.service_cargo_applications enable row level security;

create policy "Published cargo applications are readable"
  on public.service_cargo_applications for select
  to anon, authenticated
  using (is_published = true);

create policy "Backend managed writes service_cargo_applications"
  on public.service_cargo_applications for all
  to authenticated
  using (false) with check (false);

create index if not exists service_cargo_applications_public_idx
  on public.service_cargo_applications (is_published, display_order);

-- -----------------------------------------------------------------------------
-- 3. Per-owner section headings (Visual Showcase + Cargo & Applications)
-- -----------------------------------------------------------------------------
alter table public.services add column if not exists showcase_heading text;
alter table public.services add column if not exists showcase_description text;
alter table public.services add column if not exists cargo_heading text;
alter table public.services add column if not exists cargo_description text;

alter table public.service_items add column if not exists showcase_heading text;
alter table public.service_items add column if not exists showcase_description text;
alter table public.service_items add column if not exists cargo_heading text;
alter table public.service_items add column if not exists cargo_description text;

-- -----------------------------------------------------------------------------
-- 4. Backfill: migrate legacy JSONB gallery/applications into the relational
--    tables WITHOUT overwriting admin-managed rows (per-entity guard).
-- -----------------------------------------------------------------------------
-- Visual Showcase ← (service) gallery jsonb
insert into public.service_visual_showcase (service_id, title, caption, alt_text, image_url, display_order)
select s.id, v.title, v.caption, v.alt_text, v.url, (row_number() over ())::int - 1
from public.services s
cross join lateral jsonb_to_recordset(coalesce(s.gallery, '[]'::jsonb)) as v(title text, caption text, alt_text text, url text)
where s.gallery is not null
  and jsonb_array_length(s.gallery) > 0
  and not exists (select 1 from public.service_visual_showcase sc where sc.service_id = s.id);

-- Visual Showcase ← (service_item) gallery jsonb
insert into public.service_visual_showcase (service_item_id, title, caption, alt_text, image_url, display_order)
select si.id, v.title, v.caption, v.alt_text, v.url, (row_number() over ())::int - 1
from public.service_items si
cross join lateral jsonb_to_recordset(coalesce(si.gallery, '[]'::jsonb)) as v(title text, caption text, alt_text text, url text)
where si.gallery is not null
  and jsonb_array_length(si.gallery) > 0
  and not exists (select 1 from public.service_visual_showcase sc where sc.service_item_id = si.id);

-- Cargo & Applications ← (service) applications jsonb
insert into public.service_cargo_applications (service_id, title, description, image_url, display_order)
select s.id, v.title, v.desc, v.image, (row_number() over ())::int - 1
from public.services s
cross join lateral jsonb_to_recordset(coalesce(s.applications, '[]'::jsonb)) as v(title text, desc text, image text)
where s.applications is not null
  and jsonb_array_length(s.applications) > 0
  and not exists (select 1 from public.service_cargo_applications sc where sc.service_id = s.id);

-- Cargo & Applications ← (service_item) applications jsonb
insert into public.service_cargo_applications (service_item_id, title, description, image_url, display_order)
select si.id, v.title, v.desc, v.image, (row_number() over ())::int - 1
from public.service_items si
cross join lateral jsonb_to_recordset(coalesce(si.applications, '[]'::jsonb)) as v(title text, desc text, image text)
where si.applications is not null
  and jsonb_array_length(si.applications) > 0
  and not exists (select 1 from public.service_cargo_applications sc where sc.service_item_id = si.id);