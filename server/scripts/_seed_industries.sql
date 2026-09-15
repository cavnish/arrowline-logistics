-- _seed_industries.sql
-- Idempotent: upserts the 8 canonical public-industry categories by slug and
-- removes the stale legacy duplicate ("E-Commerce & Retail").

DELETE FROM public.industries WHERE slug = 'e-commerce-retail';

INSERT INTO public.industries (slug, title, description, icon, cargo_types, is_published, display_order) VALUES
  (
    'automotive',
    'Automotive & Auto Components',
    'Just-in-time FTL movement of auto parts, engine blocks, and assembly components across manufacturing belts.',
    'Car',
    '["Engine assemblies", "Transmission systems", "Body panels", "Tires", "Electronic control units", "Painted body parts"]'::jsonb,
    true,
    1
  ),
  (
    'fmcg-retail',
    'FMCG, Food & Retail',
    'High-frequency nationwide distribution connecting manufacturing units with regional warehousing hubs.',
    'ShoppingBag',
    '["Packaged foods", "Beverages", "Personal care products", "Household cleaners", "Pharmaceutical OTC products", "Seasonal retail inventory"]'::jsonb,
    true,
    2
  ),
  (
    'manufacturing-engineering',
    'Manufacturing & Heavy Engineering',
    'Industrial equipment, precision machinery, casting units, and structural fabrication transport.',
    'Cog',
    '["CNC machine parts", "Hydraulic presses", "Industrial pumps", "Gearboxes", "Metal fabrications", "Precision components"]'::jsonb,
    true,
    3
  ),
  (
    'pharmaceutical',
    'Pharmaceuticals & Healthcare',
    'Secure, time-critical logistics for active pharmaceutical ingredients (API) and medical products.',
    'ShieldAlert',
    '["API raw materials", "Vaccine cold-chain", "Medical devices", "Surgical instruments", "Clinical trial samples", "Hospital consumables"]'::jsonb,
    true,
    4
  ),
  (
    'chemical',
    'Chemicals & Petrochemicals',
    'Compliant containerized transportation for specialty chemicals, industrial polymers, and raw resins.',
    'FlaskConical',
    '["Bulk chemicals", "Petrochemical intermediates", "Solvents", "Acids and alkalis", "Polymer resins", "Specialty coatings"]'::jsonb,
    true,
    5
  ),
  (
    'infrastructure-steel',
    'Infrastructure, Steel & Metals',
    'Heavy-haul flatbed and rail transportation for steel coils, pipes, TMT bars, and construction equipment.',
    'HardHat',
    '["Steel coils and sheets", "Structural beams", "Cement bags", "TMT bars", "Aluminium ingots", "Construction equipment parts"]'::jsonb,
    true,
    6
  ),
  (
    'solar-energy',
    'Solar, Renewable & Energy',
    'Specialized handling for solar panels, inverters, transformers, wind turbine components, and substations.',
    'Sun',
    '["Solar panels and modules", "Inverters", "Wind turbine blades", "Transformer units", "Battery storage systems", "EV battery packs"]'::jsonb,
    true,
    7
  ),
  (
    'ecommerce-electronics',
    'E-Commerce & Electronics',
    'High-velocity linehaul trucking and express freight connectivity between port hubs and fulfillment centers.',
    'Layers',
    '["Consumer electronics", "Server racks", "Telecom equipment", "Mobile handsets", "IT peripherals", "White goods"]'::jsonb,
    true,
    8
  )
ON CONFLICT (slug) DO UPDATE SET
  title = excluded.title,
  description = excluded.description,
  icon = excluded.icon,
  cargo_types = excluded.cargo_types,
  is_published = excluded.is_published,
  display_order = excluded.display_order;