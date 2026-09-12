import pg from 'pg';
const { Client } = pg;

const connStr = 'postgresql://postgres.vsbircholpdlhyznlrgi:Arrowline%401234@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function runMigration() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = new Client({
    connectionString: connStr,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('Connected!');

  const sql = `
  -- 1. Ensure services table has all necessary columns
  create table if not exists public.services (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    short_description text not null default '',
    full_description text not null default '',
    hero_image text,
    is_published boolean not null default true,
    display_order integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
  );

  alter table public.services add column if not exists hero_video text;
  alter table public.services add column if not exists hero_fallback_image text;
  alter table public.services add column if not exists meta_title text;
  alter table public.services add column if not exists meta_description text;
  alter table public.services add column if not exists canonical_url text;
  alter table public.services add column if not exists og_image text;
  alter table public.services add column if not exists cta_text text;
  alter table public.services add column if not exists cta_url text;
  alter table public.services add column if not exists capabilities jsonb not null default '[]'::jsonb;
  alter table public.services add column if not exists benefits jsonb not null default '[]'::jsonb;
  alter table public.services add column if not exists category text;
  alter table public.services add column if not exists key_capability text;
  alter table public.services add column if not exists hero_badge text;
  alter table public.services add column if not exists hero_headline text;
  alter table public.services add column if not exists hero_subheadline text;
  alter table public.services add column if not exists hero_description text;
  alter table public.services add column if not exists highlights jsonb default '[]'::jsonb;
  alter table public.services add column if not exists about_badge text;
  alter table public.services add column if not exists about_heading text;
  alter table public.services add column if not exists about_description text;
  alter table public.services add column if not exists about_bullet_points jsonb default '[]'::jsonb;
  alter table public.services add column if not exists about_image text;
  alter table public.services add column if not exists why_arrowline jsonb default '[]'::jsonb;
  alter table public.services add column if not exists process_steps jsonb default '[]'::jsonb;
  alter table public.services add column if not exists applications jsonb default '[]'::jsonb;
  alter table public.services add column if not exists industries jsonb default '[]'::jsonb;
  alter table public.services add column if not exists network_description text;
  alter table public.services add column if not exists faqs jsonb default '[]'::jsonb;
  alter table public.services add column if not exists gallery jsonb default '[]'::jsonb;
  alter table public.services add column if not exists video_url text;
  alter table public.services add column if not exists video_poster text;
  alter table public.services add column if not exists cta_headline text;
  alter table public.services add column if not exists seo_title text;
  alter table public.services add column if not exists seo_desc text;

  -- 2. Create service_items table
  create table if not exists public.service_items (
    id uuid primary key default gen_random_uuid(),
    service_id uuid not null references public.services(id) on delete cascade,
    slug text not null,
    title text not null,
    short_description text not null default '',
    full_description text not null default '',
    hero_image text,
    hero_video text,
    hero_fallback_image text,
    is_published boolean not null default true,
    display_order integer not null default 0,
    meta_title text,
    meta_description text,
    canonical_url text,
    og_image text,
    capabilities jsonb not null default '[]'::jsonb,
    benefits jsonb not null default '[]'::jsonb,
    parent_slug text,
    parent_name text,
    hero_badge text,
    hero_headline text,
    hero_subheadline text,
    about_badge text,
    about_heading text,
    about_description text,
    about_bullet_points jsonb default '[]'::jsonb,
    about_image text,
    why_arrowline jsonb default '[]'::jsonb,
    process_steps jsonb default '[]'::jsonb,
    applications jsonb default '[]'::jsonb,
    industries jsonb default '[]'::jsonb,
    faqs jsonb default '[]'::jsonb,
    gallery jsonb default '[]'::jsonb,
    video_url text,
    video_poster text,
    cta_headline text,
    seo_title text,
    seo_desc text,
    keywords jsonb default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique(service_id, slug)
  );

  -- 3. Create service_faqs table
  create table if not exists public.service_faqs (
    id uuid primary key default gen_random_uuid(),
    service_id uuid references public.services(id) on delete set null,
    service_item_id uuid references public.service_items(id) on delete set null,
    question text not null,
    answer text not null,
    display_order integer not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (
      (service_id is not null and service_item_id is null) or
      (service_id is null and service_item_id is not null)
    )
  );

  -- 4. Create service_process_steps table
  create table if not exists public.service_process_steps (
    id uuid primary key default gen_random_uuid(),
    service_id uuid references public.services(id) on delete set null,
    service_item_id uuid references public.service_items(id) on delete set null,
    step text not null,
    title text not null,
    subtitle text not null default '',
    description text not null,
    icon text,
    image text,
    display_order integer not null default 0,
    is_published boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    check (
      (service_id is not null and service_item_id is null) or
      (service_id is null and service_item_id is not null)
    )
  );

  -- 5. Create service_industries junction table
  create table if not exists public.service_industries (
    service_id uuid not null references public.services(id) on delete cascade,
    industry_id uuid not null references public.industries(id) on delete cascade,
    primary key (service_id, industry_id)
  );

  -- 6. Create service_item_industries junction table
  create table if not exists public.service_item_industries (
    service_item_id uuid not null references public.service_items(id) on delete cascade,
    industry_id uuid not null references public.industries(id) on delete cascade,
    primary key (service_item_id, industry_id)
  );

  -- 7. Enable RLS
  alter table public.services enable row level security;
  alter table public.service_items enable row level security;
  alter table public.service_faqs enable row level security;
  alter table public.service_process_steps enable row level security;
  alter table public.service_industries enable row level security;
  alter table public.service_item_industries enable row level security;

  -- 8. Policies for anon/authenticated reading
  drop policy if exists "Published services are readable" on public.services;
  create policy "Published services are readable"
    on public.services for select
    to anon, authenticated
    using (is_published = true);

  drop policy if exists "Published service items are readable" on public.service_items;
  create policy "Published service items are readable"
    on public.service_items for select
    to anon, authenticated
    using (is_published = true);

  drop policy if exists "Published service FAQs are readable" on public.service_faqs;
  create policy "Published service FAQs are readable"
    on public.service_faqs for select
    to anon, authenticated
    using (is_published = true);

  drop policy if exists "Published service process steps are readable" on public.service_process_steps;
  create policy "Published service process steps are readable"
    on public.service_process_steps for select
    to anon, authenticated
    using (is_published = true);

  drop policy if exists "Published service industries are readable" on public.service_industries;
  create policy "Published service industries are readable"
    on public.service_industries for select
    to anon, authenticated
    using (true);

  drop policy if exists "Published service item industries are readable" on public.service_item_industries;
  create policy "Published service item industries are readable"
    on public.service_item_industries for select
    to anon, authenticated
    using (true);

  -- 9. Storage bucket: create site-assets if not exists
  insert into storage.buckets (id, name, public)
  values ('site-assets', 'site-assets', true)
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public)
  values ('website-media', 'website-media', true)
  on conflict (id) do nothing;

  -- Storage policy for public read
  drop policy if exists "Public Access site-assets" on storage.objects;
  create policy "Public Access site-assets"
    on storage.objects for select
    to public
    using (bucket_id in ('site-assets', 'website-media'));
  `;

  await client.query(sql);
  console.log('✅ Schema migration applied successfully!');
  await client.end();
}

runMigration().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
