-- Extend public.trusted_network with optional description + Cloudinary asset
-- metadata, and seed the existing "Trusted by Industry Leaders" companies so
-- the public section is fully CMS-driven (Supabase = data, Cloudinary = logos).
--
-- Re-runnable: column adds use "if not exists" and seeding is guarded to run
-- only when the table is empty (never overwrites admin-managed records).

alter table public.trusted_network add column if not exists description text;
alter table public.trusted_network add column if not exists logo_public_id text;
alter table public.trusted_network add column if not exists logo_format text;
alter table public.trusted_network add column if not exists logo_width integer;
alter table public.trusted_network add column if not exists logo_height integer;
alter table public.trusted_network add column if not exists logo_alt text;
alter table public.trusted_network add column if not exists logo_resource_type text;
alter table public.trusted_network add column if not exists logo_bytes bigint;

-- Public reads filter by is_published and sort by display_order. Keep the hot
-- lookup indexed.
create index if not exists trusted_network_public_order_idx
  on public.trusted_network (is_published, display_order);

-- Seed the pre-existing website dataset (old CLIENT_LOGOS array) so no content
-- is lost. Logos start empty (admin uploads polished brand marks via the CMS);
-- the public section renders clean company-initial placeholders until then.
insert into public.trusted_network
  (name, category, website, is_featured, is_published, display_order, description)
select v.name, v.category, v.website, v.is_featured, v.is_published, v.display_order, v.description
from (
  values
    ('Reliance',    'Petrochemicals',          null, false, true, 1,  'Reliance operates across petrochemicals, refining, oil & gas, and retail — a major industrial logistics origin across India.'),
    ('Aditya Birla', 'Manufacturing Group',    null, false, true, 2,  'The Aditya Birla Group spans metals, cement, textiles and chemicals, moving heavy industrial and raw material volumes.'),
    ('Adani',       'Mundra Port Alliance',     null, false, true, 3,  'Arrowline operates out of Adani Mundra Port, the largest commercial port in India and a key maritime gateway.'),
    ('CONCOR',      'Rail Freight Partner',     null, false, true, 4,  'Container Corporation of India — scheduled rail freight integration for long-haul inland container movement.'),
    ('IATA',        'Air Cargo Licensed',       null, false, true, 5,  'International Air Transport Association alignment for air cargo and express freight operations.'),
    ('DP World',    'Terminal Operator',        null, false, true, 6,  'DP World terminal operations for container handling and transshipment at major Indian gateways.'),
    ('Maersk',      'Ocean Carrier',            null, false, true, 7,  'Maersk ocean carrier network for international freight forwarding and deep-sea container movement.'),
    ('MSC',         'Global Shipping',          null, false, true, 8,  'MSC global shipping scale for competitive ocean freight capacity across trade lanes.'),
    ('KRIBHCO',     'Bulk Fertilizer',          null, false, true, 9,  'KRIBHCO fertilizer and bulk agro-chemical movement across Indian distribution corridors.'),
    ('TATA Steel',  'Industrial Metals',        null, false, true, 10, 'TATA Steel industrial metals and specialty steel logistics for engineering and construction sectors.')
) as v(name, category, website, is_featured, is_published, display_order, description)
where not exists (select 1 from public.trusted_network);