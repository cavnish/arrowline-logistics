-- About page CMS: tables that make every About-page section editable from
-- the admin panel, plus the site_content text keys that back the page copy.
-- Idempotent: safe to re-run.

-- =====================================================
-- 1. ABOUT IMAGES (Cloudinary-backed, one row per page slot)
--    Supports upload / replace / delete / reorder / publish + alt text.
-- =====================================================

create table if not exists public.about_images (
  id uuid primary key default gen_random_uuid(),
  slot text not null unique check (slot in ('hero', 'milestones', 'differentiators', 'core-values')),
  title text not null default '',
  alt_text text not null default '',
  image_url text,
  image_public_id text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists about_images_order_idx on public.about_images (is_published, display_order);

-- =====================================================
-- 2. ABOUT PILLARS (Vision / Mission / Core Purpose / Goals)
-- =====================================================

create table if not exists public.about_pillars (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'Eye',
  title text not null,
  text text not null default '',
  color text not null default 'emerald',
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists about_pillars_order_idx on public.about_pillars (is_published, display_order);

-- =====================================================
-- 3. ABOUT MILESTONES (timeline)
-- =====================================================

create table if not exists public.about_milestones (
  id uuid primary key default gen_random_uuid(),
  year text not null,
  title text not null,
  text text not null default '',
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists about_milestones_order_idx on public.about_milestones (is_published, display_order);

-- =====================================================
-- 4. ABOUT DIFFERENTIATORS ("What makes Arrowline different?")
-- =====================================================

create table if not exists public.about_differentiators (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'ClipboardCheck',
  title text not null,
  text text not null default '',
  accent text not null default 'orange',
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists about_differentiators_order_idx on public.about_differentiators (is_published, display_order);

-- =====================================================
-- RLS: public can read published rows, only the backend (service role) writes.
-- =====================================================

do $$ declare t text; begin
  foreach t in array array['about_images','about_pillars','about_milestones','about_differentiators'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "Public published read %1$s" on public.%1$I for select to anon, authenticated using (is_published = true)', t);
    execute format('create policy "Backend managed writes %1$s" on public.%1$I for all to authenticated using (false) with check (false)', t);
  end loop;
end $$;

-- =====================================================
-- 5. SITE CONTENT KEYS (About text copy). Existing rows are left untouched;
--    only missing keys are inserted so admin edits always win.
-- =====================================================

insert into public.site_content (content_key, content_value, section, content_type, is_published, updated_at)
select * from (values
  ('about_hero_badge_label', 'Est. 2014', 'About', 'text', true, now()),
  ('about_hero_badge_place', 'Mundra, Gujarat', 'About', 'text', true, now()),
  ('about_hero_eyebrow', 'ARROWLINE LOGISTICS', 'About', 'text', true, now()),
  ('about_hero_title', 'About Us', 'About', 'text', true, now()),
  ('about_hero_p1', 'Founded in **2014** by our visionary founders, **Arrowline Logistics** has grown from a trusted Indian logistics provider into a globally aligned transport solutions partner — serving multinational corporations with scale, speed, and integrity.', 'About', 'text', true, now()),
  ('about_hero_p2_pre', 'With over a **decade of expertise**, we''ve built a reputation for delivering reliable, tech-enabled, and cost-effective road transport solutions across India. Powered by a fleet of own ', 'About', 'text', true, now()),
  ('about_fleet_count', '250', 'About', 'text', true, now()),
  ('about_hero_p2_post', ' GPS-enabled vehicles — advanced control towers, and a skilled team — we ensure seamless cargo movement across every industrial corridor.', 'About', 'text', true, now()),
  ('about_hero_p3', 'From **FMCG and Pharma** to chemicals and electronics, Arrowline Logistics offers industry-specific logistics strategies and integrated multimodal solutions, making us the preferred partner for global enterprises expanding into India.', 'About', 'text', true, now()),
  ('about_philosophy_heading', 'Company Philosophy', 'About', 'text', true, now()),
  ('about_philosophy_p1', 'At Arrowline Logistics, our philosophy is rooted in ethics, purpose, and progress. We believe in building an organization that stands for **integrity, innovation, and impact** — values that mirror the spirit of India''s greatest industrial legacies and continue to inspire our journey every single day.', 'About', 'text', true, now()),
  ('about_bhag_p2_pre', 'Our **BHAG (Big Hairy Audacious Goal)** is to build an ethically-driven organization that achieves ', 'About', 'text', true, now()),
  ('about_bhag_amount', '500', 'About', 'text', true, now()),
  ('about_bhag_p2_post', ' Cr by ', 'About', 'text', true, now()),
  ('about_bhag_year', '2030', 'About', 'text', true, now()),
  ('about_bhag_p2_tail', ' — while creating sustainable growth that inspires people, empowers communities, and leaves behind a lasting legacy of excellence.', 'About', 'text', true, now()),
  ('about_milestones_eyebrow', 'MILESTONES', 'About', 'text', true, now()),
  ('about_milestones_heading_1', 'Key Moments in', 'About', 'text', true, now()),
  ('about_milestones_heading_2', 'Our Legacy', 'About', 'text', true, now()),
  ('about_milestones_caption', 'Expands into multi-city operations and signs its first long-term contract with a Fortune 500 company.', 'About', 'text', true, now()),
  ('about_differentiators_eyebrow', 'BEST VALUE SYSTEM', 'About', 'text', true, now()),
  ('about_differentiators_heading_1', 'What makes', 'About', 'text', true, now()),
  ('about_differentiators_heading_2', 'Arrowline different?', 'About', 'text', true, now()),
  ('about_differentiators_subtext', 'We fuse operational discipline, digital transparency, and end-to-end accountability — creating an experience customers keep coming back for.', 'About', 'text', true, now()),
  ('about_corevalues_heading', 'Core Values', 'About', 'text', true, now()),
  ('about_corevalues_subtext', 'At Arrowline, values aren''t just printed on paper — they''re practiced every single day, across every kilometre of every corridor.', 'About', 'text', true, now()),
  ('about_leaders_eyebrow', 'LEADERSHIP', 'About', 'text', true, now()),
  ('about_leaders_heading', 'The Architects of **our success**', 'About', 'text', true, now()),
  ('about_leaders_subtext', 'Meet the crew coordinating multi-state route surveys, port clearance compliance, customs filings, and pan-India dispatch loops.', 'About', 'text', true, now()),
  ('about_cta_heading', 'Ready to partner with **Arrowline**?', 'About', 'text', true, now()),
  ('about_cta_body', 'ARROWLINE LOGISTICS is a premier multimodal logistics and transportation company operating across India. Centered at Mundra Port, Gujarat—the gateway of India''s maritime trade—we integrate road transportation (FTL/PTL), rail freight, coastal shipping, and customs clearance to deliver reliable, optimized, and secure door-to-door supply chain solutions.', 'About', 'text', true, now()),
  ('about_cta_btn1_label', 'Visit Mundra Headquarters', 'About', 'text', true, now()),
  ('about_cta_btn2_label', 'Email Us', 'About', 'text', true, now())
) as seed(content_key, content_value, section, content_type, is_published, updated_at)
on conflict (content_key) do nothing;

-- =====================================================
-- 6. SEED COLLECTIONS FROM THE CURRENT PUBLIC COPY
--    Each row is inserted only when its natural key does not exist yet.
-- =====================================================

-- About images (Cloudinary URLs that already back the page via site_content).
insert into public.about_images (slot, title, alt_text, image_url, image_public_id, is_published, display_order, created_at, updated_at)
select * from (values
  ('hero', 'Hero image', 'Arrowline Logistics multimodal freight corridor across India', 'https://res.cloudinary.com/uorctww6/image/upload/v1789450172/arrowline/site-content/p3ixo6zur8vmvldgq2ff.jpg', 'arrowline/site-content/p3ixo6zur8vmvldgq2ff', true, 0, now(), now()),
  ('milestones', 'Milestones image', 'Arrowline Logistics partnership handshake sealing a Pan-India logistics agreement', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377036/arrowline/general/business-handshake.jpg', 'arrowline/general/business-handshake', true, 1, now(), now()),
  ('differentiators', 'Differentiators image', 'Arrowline modern GPS-enabled fleet on Indian expressway highway', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', 'arrowline/general/road-transport', true, 2, now(), now()),
  ('core-values', 'Core values image', 'Arrowline Logistics fleet parked at Mundra Port container yard, Gujarat', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg', 'arrowline/general/truck-fleet-yard', true, 3, now(), now())
) as seed(slot, title, alt_text, image_url, image_public_id, is_published, display_order, created_at, updated_at)
where not exists (select 1 from public.about_images i where i.slot = seed.slot);

-- Pillars
insert into public.about_pillars (icon, title, text, color, is_published, display_order, created_at, updated_at)
select * from (values
  ('Eye', 'Vision', 'To be India''s most trusted name in multimodal logistics, consistently delivering service excellence that surpasses customer expectations and creates enduring value.', 'emerald', true, 0, now(), now()),
  ('Target', 'Mission', 'To build lasting relationships with our customers by delivering exceptional, technology-driven transport solutions—guided by innovation, integrity, and a relentless commitment to excellence.', 'orange', true, 1, now(), now()),
  ('Award', 'Core Purpose', 'To enrich lives by providing valuable, efficient, and reliable transportation solutions that enhance productivity and bring satisfaction to every stakeholder.', 'blue', true, 2, now(), now()),
  ('TrendingUp', 'Goals', 'To expand regionally within the transportation sector, developing a strong base of key customers while pioneering sustainable multimodal freight corridors across India.', 'purple', true, 3, now(), now())
) as seed(icon, title, text, color, is_published, display_order, created_at, updated_at)
where not exists (select 1 from public.about_pillars p where p.title = seed.title);

-- Milestones
insert into public.about_milestones (year, title, text, is_published, display_order, created_at, updated_at)
select * from (values
  ('2014', 'Beginnings', 'Founded in Mundra, Gujarat as Arrowline Logistics by our visionary founders with a small fleet of 5 trucks serving the burgeoning Adani Mundra Port trade.', true, 0, now(), now()),
  ('2017', 'Multi-City Expansion', 'Transformed into a Pan-India operator, expanding our fleet to 40+ heavy-duty container trailers and opening dry-port depots in Jaipur and Indore.', true, 1, now(), now()),
  ('2018 – 2020', 'Momentum Builds', 'Continued growth in fleet strength, in-house customs brokerage services launched, and integration with CONCOR rail freight corridors established.', true, 2, now(), now()),
  ('2022', 'Wider Reach', 'Incorporated as Arrowline Logistics India Pvt Ltd, signalling a major leap forward in pan-India multimodal operations with 150+ GPS-enabled assets.', true, 3, now(), now()),
  ('2025', 'Trusted Nationwide Partner', 'Managing a robust fleet of 250+ owned and attached vehicles, serving Fortune-listed clients across coastal, road, rail, and air freight corridors of India.', true, 4, now(), now())
) as seed(year, title, text, is_published, display_order, created_at, updated_at)
where not exists (select 1 from public.about_milestones m where m.year = seed.year and m.title = seed.title);

-- Differentiators
insert into public.about_differentiators (icon, title, text, accent, is_published, display_order, created_at, updated_at)
select * from (values
  ('ClipboardCheck', 'Driver Onboarding & Vetting', 'At Arrowline, we ensure every driver is thoroughly vetted through background checks, license validation, and rigorous health & safety assessments to guarantee safe deliveries.', 'orange', true, 0, now(), now()),
  ('Cpu', 'Digitally Enabled', 'From e-PODs to real-time dashboards, we''re paperless, precise and completely transparent. Every shipment carries live GPS telemetry and automated milestone alerts.', 'emerald', true, 1, now(), now()),
  ('Package', 'End-To-End Ownership', 'One point of contact, full accountability. From port pickup and customs clearance to warehouse delivery, we own every kilometre of your cargo''s journey.', 'blue', true, 2, now(), now())
) as seed(icon, title, text, accent, is_published, display_order, created_at, updated_at)
where not exists (select 1 from public.about_differentiators d where d.title = seed.title);