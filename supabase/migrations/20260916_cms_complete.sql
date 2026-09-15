-- =============================================================================
-- Arrowline CMS — fix-flow migration (applied to the LIVE Supabase project)
--
-- Adds the tables/columns the CMS admin + public API already assume exist:
--   1. service_visual_showcase  (per-service / per-sub-service galleries)
--   2. service_cargo_applications (per-service / per-sub-service cargo profiles)
--   3. showcase/cargo heading columns on services + service_items
--   4. leadership + core_values tables (About page sections)
--   5. Backfill showcase/cargo from legacy JSONB gallery/applications
-- Idempotent. Safe to re-run.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Visual Showcase images (multi-image gallery per service / sub-service)
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

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'service_visual_showcase' and policyname = 'Published visual showcase is readable'
  ) then
    create policy "Published visual showcase is readable"
      on public.service_visual_showcase for select
      to anon, authenticated
      using (is_published = true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'service_visual_showcase' and policyname = 'Backend managed writes service_visual_showcase'
  ) then
    create policy "Backend managed writes service_visual_showcase"
      on public.service_visual_showcase for all
      to authenticated
      using (false) with check (false);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 2. Cargo & Applications (cargo profile cards per service / sub-service)
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

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'service_cargo_applications' and policyname = 'Published cargo applications are readable'
  ) then
    create policy "Published cargo applications are readable"
      on public.service_cargo_applications for select
      to anon, authenticated
      using (is_published = true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'service_cargo_applications' and policyname = 'Backend managed writes service_cargo_applications'
  ) then
    create policy "Backend managed writes service_cargo_applications"
      on public.service_cargo_applications for all
      to authenticated
      using (false) with check (false);
  end if;
end $$;

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
-- 4. Leadership team (About page)
-- -----------------------------------------------------------------------------
create table if not exists public.leadership (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  location text,
  email text,
  bio text,
  image text,
  image_public_id text,
  image_alt text default '',
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leadership enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'leadership' and policyname = 'Published leadership is readable'
  ) then
    create policy "Published leadership is readable"
      on public.leadership for select
      to anon, authenticated
      using (is_published = true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'leadership' and policyname = 'Backend managed writes leadership'
  ) then
    create policy "Backend managed writes leadership"
      on public.leadership for all
      to authenticated
      using (false) with check (false);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 5. Core values (About page)
-- -----------------------------------------------------------------------------
create table if not exists public.core_values (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.core_values enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'core_values' and policyname = 'Published core values are readable'
  ) then
    create policy "Published core values are readable"
      on public.core_values for select
      to anon, authenticated
      using (is_published = true);
  end if;
end $$;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'core_values' and policyname = 'Backend managed writes core_values'
  ) then
    create policy "Backend managed writes core_values"
      on public.core_values for all
      to authenticated
      using (false) with check (false);
  end if;
end $$;

-- -----------------------------------------------------------------------------
-- 6. Backfill relic legacy JSONB gallery/applications into the relational tables
--    (only when the owner has no rows yet — never overwrites admin data).
-- -----------------------------------------------------------------------------
insert into public.service_visual_showcase (service_id, title, caption, alt_text, image_url, display_order)
select s.id, v.title, v.caption, v.alt_text, v.url, (row_number() over (partition by s.id))::int - 1
from public.services s
cross join lateral jsonb_to_recordset(coalesce(s.gallery, '[]'::jsonb)) as v(title text, caption text, alt_text text, url text)
where s.gallery is not null
  and jsonb_typeof(s.gallery) = 'array'
  and jsonb_array_length(s.gallery) > 0
  and not exists (select 1 from public.service_visual_showcase sc where sc.service_id = s.id);

insert into public.service_visual_showcase (service_item_id, title, caption, alt_text, image_url, display_order)
select si.id, v.title, v.caption, v.alt_text, v.url, (row_number() over (partition by si.id))::int - 1
from public.service_items si
cross join lateral jsonb_to_recordset(coalesce(si.gallery, '[]'::jsonb)) as v(title text, caption text, alt_text text, url text)
where si.gallery is not null
  and jsonb_typeof(si.gallery) = 'array'
  and jsonb_array_length(si.gallery) > 0
  and not exists (select 1 from public.service_visual_showcase sc where sc.service_item_id = si.id);

insert into public.service_cargo_applications (service_id, title, description, image_url, display_order)
select s.id, v.title, v.desc, v.image, (row_number() over (partition by s.id))::int - 1
from public.services s
cross join lateral jsonb_to_recordset(coalesce(s.applications, '[]'::jsonb)) as v(title text, "desc" text, image text)
where s.applications is not null
  and jsonb_typeof(s.applications) = 'array'
  and jsonb_array_length(s.applications) > 0
  and not exists (select 1 from public.service_cargo_applications sc where sc.service_id = s.id);

insert into public.service_cargo_applications (service_item_id, title, description, image_url, display_order)
select si.id, v.title, v.desc, v.image, (row_number() over (partition by si.id))::int - 1
from public.service_items si
cross join lateral jsonb_to_recordset(coalesce(si.applications, '[]'::jsonb)) as v(title text, "desc" text, image text)
where si.applications is not null
  and jsonb_typeof(si.applications) = 'array'
  and jsonb_array_length(si.applications) > 0
  and not exists (select 1 from public.service_cargo_applications sc where sc.service_item_id = si.id);