create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(), slug text not null unique,
  client_name text not null default '', title text not null, industry text not null default '',
  location text not null default '', description text not null default '',
  challenge text not null default '', solution text not null default '',
  results text not null default '', featured_image text, images jsonb not null default '[]'::jsonb,
  meta_title text, meta_description text, is_published boolean not null default false,
  display_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(), title text not null default '',
  description text not null default '', category text not null default '', image text,
  alt_text text not null default '', is_published boolean not null default false,
  display_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null,
  state text not null default '', city text not null default '', description text not null default '',
  address text not null default '', image text, map_url text, meta_title text,
  meta_description text, is_published boolean not null default false, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(), question text not null, answer text not null,
  category text not null default '', is_published boolean not null default false,
  display_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(), customer_name text not null, company text not null default '',
  position text not null default '', testimonial text not null, photo text, rating numeric,
  is_published boolean not null default false, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique,
  description text not null default '', is_published boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique,
  category_id uuid references public.blog_categories(id) on delete set null, author text not null default '',
  featured_image text, excerpt text not null default '', content text not null default '',
  meta_title text, meta_description text, keywords text, published_at timestamptz,
  is_published boolean not null default false, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.social_videos (
  id uuid primary key default gen_random_uuid(), title text not null, video_url text not null,
  embed_url text, thumbnail text, description text not null default '', platform text not null default '',
  is_published boolean not null default false, display_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.statistics (
  id uuid primary key default gen_random_uuid(), value text not null, label text not null,
  description text not null default '', icon text, is_published boolean not null default false,
  display_order integer not null default 0, created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(), setting_key text not null unique,
  setting_value text not null default '', setting_type text not null default 'text',
  is_public boolean not null default true, updated_at timestamptz not null default now()
);

create index if not exists case_studies_order_idx on public.case_studies (is_published, display_order);
create index if not exists gallery_items_order_idx on public.gallery_items (is_published, display_order);
create index if not exists locations_order_idx on public.locations (is_published, display_order);
create index if not exists faqs_order_idx on public.faqs (is_published, display_order);
create index if not exists testimonials_order_idx on public.testimonials (is_published, display_order);
create index if not exists blog_posts_publish_idx on public.blog_posts (is_published, published_at);
create index if not exists social_videos_order_idx on public.social_videos (is_published, display_order);
create index if not exists statistics_order_idx on public.statistics (is_published, display_order);

do $$ declare t text; begin
  foreach t in array array['case_studies','gallery_items','locations','faqs','testimonials','blog_categories','blog_posts','social_videos','statistics','site_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Public published read %1$s" on public.%1$I for select to anon, authenticated using (%2$s)', t,
      case when t = 'site_settings' then 'is_public = true' else 'is_published = true' end);
    execute format('create policy "Backend managed writes %1$s" on public.%1$I for all to authenticated using (false) with check (false)', t);
  end loop;
end $$;
