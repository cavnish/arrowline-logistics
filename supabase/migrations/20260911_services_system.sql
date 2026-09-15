-- Create services table for main services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  short_description text not null default '',
  full_description text not null default '',
  hero_image text,
  hero_video text,
  hero_fallback_image text,
  is_published boolean not null default false,
  display_order integer not null default 0,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  capabilities jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS on services
alter table public.services enable row level security;

-- Policy: Published services are readable by everyone
create policy "Published services are readable"
  on public.services for select
  to anon, authenticated
  using (is_published = true);

-- Policy: Backend managed writes (via admin API)
create policy "Backend managed writes services"
  on public.services for all
  to authenticated
  using (false) with check (false);


-- Create service_items table for sub-services
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
  is_published boolean not null default false,
  display_order integer not null default 0,
  meta_title text,
  meta_description text,
  canonical_url text,
  og_image text,
  capabilities jsonb not null default '[]'::jsonb,
  benefits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(service_id, slug)
);

-- Enable RLS on service_items
alter table public.service_items enable row level security;

-- Policy: Published service items are readable by everyone
create policy "Published service items are readable"
  on public.service_items for select
  to anon, authenticated
  using (is_published = true);

-- Policy: Backend managed writes (via admin API)
create policy "Backend managed writes service_items"
  on public.service_items for all
  to authenticated
  using (false) with check (false);


-- Create service_faqs table for FAQs related to services or service items
create table if not exists public.service_faqs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  service_item_id uuid references public.service_items(id) on delete set null,
  question text not null,
  answer text not null,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (service_id is not null and service_item_id is null) or
    (service_id is null and service_item_id is not null)
  )
);

-- Enable RLS on service_faqs
alter table public.service_faqs enable row level security;

-- Policy: Published service FAQs are readable by everyone
create policy "Published service FAQs are readable"
  on public.service_faqs for select
  to anon, authenticated
  using (is_published = true);

-- Policy: Backend managed writes (via admin API)
create policy "Backend managed writes service_faqs"
  on public.service_faqs for all
  to authenticated
  using (false) with check (false);


-- Create service_process_steps table for process steps related to services or service items
create table if not exists public.service_process_steps (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.services(id) on delete set null,
  service_item_id uuid references public.service_items(id) on delete set null,
  step text not null,
  title text not null,
  subtitle text not null,
  description text not null,
  icon text,
  image text,
  display_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (service_id is not null and service_item_id is null) or
    (service_id is null and service_item_id is not null)
  )
);

-- Enable RLS on service_process_steps
alter table public.service_process_steps enable row level security;

-- Policy: Published service process steps are readable by everyone
create policy "Published service process steps are readable"
  on public.service_process_steps for select
  to anon, authenticated
  using (is_published = true);

-- Policy: Backend managed writes (via admin API)
create policy "Backend managed writes service_process_steps"
  on public.service_process_steps for all
  to authenticated
  using (false) with check (false);


-- Create service_industries junction table for services and industries
create table if not exists public.service_industries (
  service_id uuid not null references public.services(id) on delete cascade,
  industry_id uuid not null references public.industries(id) on delete cascade,
  primary key (service_id, industry_id)
);

-- Enable RLS on service_industries
alter table public.service_industries enable row level security;

-- Policy: Read service industries when the service is published
create policy "Published service industries are readable"
  on public.service_industries for select
  using (
    exists (
      select 1 from public.services
      where services.id = service_industries.service_id
        and services.is_published = true
    )
  );

-- Policy: Backend managed writes (via admin API)
create policy "Backend managed writes service_industries"
  on public.service_industries for all
  to authenticated
  using (false) with check (false);


-- Create service_item_industries junction table for service items and industries
create table if not exists public.service_item_industries (
  service_item_id uuid not null references public.service_items(id) on delete cascade,
  industry_id uuid not null references public.industries(id) on delete cascade,
  primary key (service_item_id, industry_id)
);

-- Enable RLS on service_item_industries
alter table public.service_item_industries enable row level security;

-- Policy: Read service item industries when the service item is published
create policy "Published service item industries are readable"
  on public.service_item_industries for select
  using (
    exists (
      select 1 from public.service_items
      where service_items.id = service_item_industries.service_item_id
        and service_items.is_published = true
    )
  );

-- Policy: Backend managed writes (via admin API)
create policy "Backend managed writes service_item_industries"
  on public.service_item_industries for all
  to authenticated
  using (false) with check (false);


-- Insert the 4 main services from the existing CORE_SERVICES in logisticsData.ts
-- We'll insert them as unpublished so they can be reviewed and published via admin
insert into public.services (slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
values
  (
    'road-transportation',
    'Road Transportation',
    'Reliable road transportation solutions across India, including Full Truck Load (FTL) and Part Truck Load (PTL) services for industrial materials and high-volume cargo with real-time GPS tracking.',
    'Arrowline Logistics provides comprehensive road transportation and freight services across India, specializing in Full Truck Load (FTL) and Part Truck Load (PTL) operations. Our GPS-enabled fleet delivers secure, door-to-door transit from ports and production centers to regional warehouses with customized routing, vetted drivers, and strict safety guidelines.',
    'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg',
    null,
    null,
    false,
    1,
    'Road Transportation Services in India | FTL Transport Company | Arrowline',
    'Reliable road transportation and FTL services across India from Arrowline Logistics. Dedicated GPS-enabled container fleet operating from Mundra Port.',
    '["["Pan-India coverage & express freight movement across 500+ cities"]","["Full Truck Load (FTL) dedicated capacity & Part Truck Load (PTL) distribution"]","["Real-time live GPS tracking and automated trip milestone alerts"]","["Safe and secure cargo handling with modern heavy-duty lashings"]","["Dedicated 20-ft and 40-ft container flatbeds and high-cube closed container trucks"]"]'::jsonb,
    '["Dedicated capacity for large bulk or high-value shipments without co-loading risks","Shorter transit times by avoiding intermediate hubs or consolidation delays","End-to-end security control with vetted drivers and digital trip manifests","Flexible dispatch schedules synchronized with manufacturing & warehouse operations"]'::jsonb
  ),
  (
    'rail-multimodal-logistics',
    'Rail & Multimodal Transportation',
    'Cost-optimized logistical pipelines combining rail, road, and coastal networks backed by robust coordination with Indian Railways and dry ports.',
    'We provide integrated rail and multimodal logistics combining rail freight corridors, coastal links, and highway trucking to deliver cost-optimized bulk transportation. Backed by coordination with Indian Railways and private container train operators (CONCOR), our operations enable containerized cargo to travel smoothly from port terminals to inland container depots (ICDs).',
    'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg',
    null,
    null,
    false,
    2,
    'Rail & Multimodal Logistics India | Container Rail Freight | Arrowline',
    'Reliable rail freight and multimodal logistics in India. Direct container rail integration from Mundra Port to Northern, Central, and Southern India.',
    '["["Scheduled departure timetables via Western Dedicated Freight Corridors (WDFC)"]","["High cost efficiency for long-haul routes exceeding 500 kilometers"]","["Optimized for 20ft & 40ft containerized cargo and heavy palletized freight"]","["Integrated intermodal tracking from railhead to final warehouse dock"]"]'::jsonb,
    '["Direct seaport-to-dry-port rail connectivity bypassing road traffic","Significantly reduced carbon emissions compared to long-distance road haulage","Protected against highway blockades and adverse weather interruptions","Bulk economies of scale for minerals, grains, steel, and manufactured goods"]'::jsonb
  ),
  (
    'project-cargo-transportation',
    'Project Cargo Transportation',
    'Specialized heavy cargo and Over Dimensional Cargo (ODC) transportation for machinery, steel, solar equipment, and project cargo requiring route assessment and planning.',
    'Arrowline Logistics provides specialized transportation for heavy and oversized cargo. From machinery and industrial equipment to solar panels and project cargo, we plan routes, select appropriate vehicles, and coordinate the movement of non-standard shipments.',
    'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg',
    null,
    null,
    false,
    3,
    'Heavy Cargo & ODC Transportation Services in India | Arrowline Logistics',
    'Specialized heavy cargo and ODC (Over Dimensional Cargo) transportation for machinery, steel, and project cargo across India with Arrowline Logistics.',
    '["["Heavy Machinery Movement","Specialized handling of industrial machinery, turbines, and equipment."]","["ODC Transportation","Over Dimensional Cargo movement requiring special route planning and approvals."]","["Steel Transportation","Heavy steel coil, beam, and structural movement with securing expertise."]","["Solar Equipment","Transportation of solar panels, frames, and renewable energy equipment."]","["Project Cargo","Large project shipments including industrial equipment and construction materials."]","["Trailer Planning","Selection of appropriate trailers (flatbed, lowbed, etc.) for cargo requirements."]","["Route Assessment","Detailed route analysis for dimensional and weight compliance."]","["Loading & Securing Coordination","Professional loading with proper lashing, securing and safety measures."]"]'::jsonb,
    '["Experienced ODC handling and route planning","Suitable equipment for heavy and oversized loads","Coordination for permit and compliance requirements where applicable","Safe delivery with specialized loading expertise"]'::jsonb
  ),
  (
    'warehousing-storage',
    'Warehousing & Storage',
    'Strategic warehousing and storage solutions for industrial goods, containers, and cargo across India.',
    'Arrowline Logistics provides strategic warehousing and storage solutions designed to move industrial goods, containers, and cargo efficiently across India. Our modern warehouses are equipped with advanced inventory management systems, climate control options, and security systems to ensure the safety and integrity of your stored goods.',
    'https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg', -- Note: This image may not exist; we'll rely on the admin to upload or update
    null,
    null,
    false,
    4,
    'Warehousing & Storage Solutions | Arrowline Logistics',
    'Strategic warehousing and storage solutions for industrial goods, containers, and cargo across India.',
    '["["General & Industrial Warehousing","Secure storage for industrial goods, raw materials, and finished products."]","["Distribution & Fulfillment","Order processing, picking, packing, and shipping services for e-commerce and retail businesses."]","["Inventory Management","Real-time inventory tracking, stock optimization, and warehouse organization."]","["Container Storage & Handling","Specialized handling and storage of shipping containers with proper documentation and security."]","["Loading & Unloading","Professional loading and unloading services for trucks, containers, and railcars."]"]'::jsonb,
    '["Secure storage with climate control options","Advanced inventory management systems","24/7 surveillance and security","Flexible storage terms and scalable solutions"]'::jsonb
  );

-- Insert sub-services for Road Transportation
insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'container-transportation', 'Container Transportation', 'Specialized container transportation for 20-ft and 40-ft containers, with seamless coordination between ports, CFS facilities, and inland warehouses.',
       'Arrowline Logistics provides specialized container transportation services for import and export cargo movement. From port pickup to CFS delivery to final inland warehouse placement, we coordinate the complete logistics chain.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', null, null, false, 1,
       'Container Transportation Services | 20ft & 40ft Container Movement | Arrowline',
       'Specialized 20-ft and 40-ft container transportation for import/export with port and CFS coordination from Arrowline Logistics.',
       '["["20-ft Container Transportation","Dedicated movement of 20-foot containers from ports to inland facilities."]","["40-ft Container Transportation","Specialized handling and movement of 40-foot containers."]","["Port-to-CFS Movement","Direct pickup from port gates and delivery to Customs Freight Stations."]","["CFS-to-Warehouse","Movement of cleared containers from CFS to final warehouse location."]","["Factory-to-Port","Export container pickup from manufacturing facilities to port for shipment."]","["Export Container Movement","Coordination of full export container movements with customs documentation."]","["Import Container Movement","Handling of incoming containers with port coordination and clearance."]","["Documentation Coordination","Support with shipping documents, port authority liaison, and customs coordination."]"]'::jsonb,
       '["Seamless port-to-inland facility coordination","Reduced container detention and port demurrage","End-to-end visibility from port to destination","Coordinated documentation for customs clearance"]'::jsonb
from public.services s where s.slug = 'road-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'ftl-ltl-transportation', 'FTL & LTL Transportation', 'Dedicated FTL transportation for manufacturers, distributors, exporters, warehouses and businesses that need direct, controlled movement of full truck shipments across India.',
       'Arrowline Logistics provides dedicated FTL transportation for manufacturers, distributors, exporters, warehouses and businesses that need direct, controlled movement of full truck shipments across India. One vehicle, one shipment, direct delivery—eliminating multiple handling points and consolidation delays.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', null, null, false, 2,
       'Full Truck Load (FTL) Transportation Services in India | Arrowline Logistics',
       'Dedicated FTL transportation across India with GPS tracking, proof of delivery, and pan-India coverage from Arrowline Logistics.',
       '["["Dedicated Full Truck Load","One dedicated vehicle moves your shipment directly from pickup to delivery."]","["Factory-to-Warehouse Transportation","Specialized movement of goods from manufacturing facilities to distribution centers."]","["Factory-to-Customer Delivery","Direct delivery solutions from production plants to end customers."]","["Port-to-Warehouse Movement","Coordinated container and break-bulk cargo movement from ports to inland warehouses."]","["GPS Shipment Tracking","Real-time GPS visibility with milestone alerts throughout the transit."]","["Proof of Delivery","Digital POD and delivery confirmation for complete transparency."]"]'::jsonb,
       '["Dedicated capacity for large bulk or high-value shipments without co-loading risks","Shorter transit times by avoiding intermediate hubs or consolidation delays","End-to-end security control with vetted drivers and digital trip manifests","Flexible dispatch schedules synchronized with manufacturing & warehouse operations"]'::jsonb
from public.services s where s.slug = 'road-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'odc-heavy-haulage', 'ODC & Heavy Haulage', 'Specialized heavy cargo and Over Dimensional Cargo (ODC) transportation for machinery, steel, solar equipment, and project cargo requiring route assessment and planning.',
       'Arrowline Logistics provides specialized transportation for heavy and oversized cargo. From machinery and industrial equipment to solar panels and project cargo, we plan routes, select appropriate vehicles, and coordinate the movement of non-standard shipments.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', null, null, false, 3,
       'Heavy Cargo & ODC Transportation Services in India | Arrowline Logistics',
       'Specialized heavy cargo and ODC (Over Dimensional Cargo) transportation for machinery, steel, and project cargo across India with Arrowline Logistics.',
       '["["Heavy Machinery Movement","Specialized handling of industrial machinery, turbines, and equipment."]","["ODC Transportation","Over Dimensional Cargo movement requiring special route planning and approvals."]","["Steel Transportation","Heavy steel coil, beam, and structural movement with securing expertise."]","["Solar Equipment","Transportation of solar panels, frames, and renewable energy equipment."]","["Project Cargo","Large project shipments including industrial equipment and construction materials."]","["Trailer Planning","Selection of appropriate trailers (flatbed, lowbed, etc.) for cargo requirements."]","["Route Assessment","Detailed route analysis for dimensional and weight compliance."]","["Loading & Securing Coordination","Professional loading with proper lashing, securing and safety measures."]"]'::jsonb,
       '["Experienced ODC handling and route planning","Suitable equipment for heavy and oversized loads","Coordination for permit and compliance requirements where applicable","Safe delivery with specialized loading expertise"]'::jsonb
from public.services s where s.slug = 'road-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'project-cargo-transportation', 'Project Cargo Transportation', 'Specialized heavy cargo and Over Dimensional Cargo (ODC) transportation for machinery, steel, solar equipment, and project cargo requiring route assessment and planning.',
       'Arrowline Logistics provides specialized transportation for heavy and oversized cargo. From machinery and industrial equipment to solar panels and project cargo, we plan routes, select appropriate vehicles, and coordinate the movement of non-standard shipments.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg', null, null, false, 4,
       'Project Cargo Transportation Services | Arrowline Logistics',
       'Specialized heavy cargo and ODC (Over Dimensional Cargo) transportation for machinery, steel, solar equipment, and project cargo across India with Arrowline Logistics.',
       '["["Heavy Machinery Movement","Specialized handling of industrial machinery, turbines, and equipment."]","["ODC Transportation","Over Dimensional Cargo movement requiring special route planning and approvals."]","["Steel Transportation","Heavy steel coil, beam, and structural movement with securing expertise."]","["Solar Equipment","Transportation of solar panels, frames, and renewable energy equipment."]","["Project Cargo","Large project shipments including industrial equipment and construction materials."]","["Trailer Planning","Selection of appropriate trailers (flatbed, lowbed, etc.) for cargo requirements."]","["Route Assessment","Detailed route analysis for dimensional and weight compliance."]","["Loading & Securing Coordination","Professional loading with proper lashing, securing and safety measures."]"]'::jsonb,
       '["Experienced ODC handling and route planning","Suitable equipment for heavy and oversized loads","Coordination for permit and compliance requirements where applicable","Safe delivery with specialized loading expertise"]'::jsonb
from public.services s where s.slug = 'road-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'trailer-multi-axle-transportation', 'Trailer & Multi-Axle Transportation', 'Specialized transportation for heavy machinery and oversized cargo using multi-axle trailers and lowbed configurations.',
       'Arrowline Logistics provides specialized transportation services for heavy machinery and oversized cargo. We utilize multi-axle trailers, lowbeds, and specialized equipment to ensure the safe and secure movement of your valuable equipment.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', null, null, false, 5,
       'Trailer & Multi-Axle Transportation Services | Arrowline Logistics',
       'Specialized transportation for heavy machinery and oversized cargo using multi-axle trailers and lowbed configurations from Arrowline Logistics.',
       '["["Heavy Machinery Movement","Specialized handling of industrial machinery, turbines, and equipment."]","["Multi-Axle Transportation","Specialized transportation using multi-axle trailers and lowbed configurations."]","["Route Planning","Detailed route analysis for dimensional and weight compliance."]","["Loading & Securing","Professional loading with proper lashing and safety measures."]","["Permits & Compliance","Assistance with obtaining necessary permits and ensuring regulatory compliance."]"]'::jsonb,
       '["Experienced heavy machinery handling","Specialized trailer fleet for oversized cargo","Permit and compliance coordination","Safe delivery with specialized loading expertise"]'::jsonb
from public.services s where s.slug = 'road-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'machinery-industrial-cargo-transportation', 'Machinery & Industrial Cargo Transportation', 'Specialized transportation for industrial machinery, equipment, and manufactured goods across India.',
       'Arrowline Logistics provides specialized transportation services for industrial machinery, equipment, and manufactured goods. We coordinate the complete logistics chain from pickup to delivery, ensuring the safe and secure movement of your valuable industrial assets.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', null, null, false, 6,
       'Machinery & Industrial Cargo Transportation Services | Arrowline Logistics',
       'Specialized transportation for industrial machinery, equipment, and manufactured goods across India with Arrowline Logistics.',
       '["["Industrial Equipment Movement","Specialized handling of industrial machinery, turbines, and equipment."]","["Factory-to-Warehouse Transportation","Movement of goods from manufacturing facilities to distribution centers."]","["Factory-to-Customer Delivery","Direct delivery solutions from production plants to end customers."]","["Port-to-Warehouse Movement","Coordinated container and break-bulk cargo movement from ports to inland warehouses."]","["GPS Tracking","Real-time GPS visibility with milestone alerts throughout the transit."]","["Proof of Delivery","Digital POD and delivery confirmation for complete transparency."]"]'::jsonb,
       '["Secure handling of industrial equipment","GPS tracking and real-time updates","Experienced industrial machinery handlers","Flexible dispatch schedules synchronized with operations"]'::jsonb
from public.services s where s.slug = 'road-transportation';

-- Insert sub-services for Rail Transportation
insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'rail-freight-transportation', 'Rail Freight Transportation', 'Cost-optimized rail freight solutions for bulk cargo across India.',
       'Arrowline Logistics provides rail freight transportation services for bulk cargo such as minerals, grains, steel, and manufactured goods. We coordinate with Indian Railways and CONCOR to ensure the safe and timely movement of your cargo via rail.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', null, null, false, 1,
       'Rail Freight Transportation Services | Arrowline Logistics',
       'Cost-optimized rail freight solutions for bulk cargo across India from Arrowline Logistics.',
       '["["Scheduled Departures","Regular rail freight schedules via dedicated freight corridors."]","["Bulk Cargo Handling","Specialized handling of minerals, grains, steel, and manufactured goods."]","["Containerized Rail","Transportation of 20ft and 40ft containerized cargo via rail."]","["Real-time Tracking","GPS and rail-based tracking for monitoring cargo movement."]"]'::jsonb,
       '["Direct seaport-to-dry-port connectivity","Reduced carbon emissions","Protected against highway disruptions","Bulk economies of scale"]'::jsonb
from public.services s where s.slug = 'rail-multimodal-logistics';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'container-rail-transportation', 'Container Rail Transportation', 'Specialized container rail transportation services for import and export cargo.',
       'Arrowline Logistics provides container rail transportation services for import and export cargo. We coordinate the movement of 20ft and 40ft containers from ports to inland destinations via rail networks.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', null, null, false, 2,
       'Container Rail Transportation Services | Arrowline Logistics',
       'Specialized container rail transportation services for import and export cargo from Arrowline Logistics.',
       '["["20-ft Container Rail","Transportation of 20-foot containers via rail."]","["40-ft Container Rail","Transportation of 40-foot containers via rail."]","["Port-to-Inland","Direct pickup from port gates and delivery to inland destinations via rail."]","["Inland-to-Port","Export container pickup from manufacturing facilities to port for shipment via rail."]"]'::jsonb,
       '["Seamless port-to-inland rail connectivity","Reduced rail detention and demurrage","End-to-end visibility from port to destination","Coordinated documentation for customs clearance"]'::jsonb
from public.services s where s.slug = 'rail-multimodal-logistics';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'full-train-load-ftl', 'Full Train Load (FTL) Services', 'Dedicated full train load services for bulk cargo transportation.',
       'Arrowline Logistics provides dedicated full train load (FTL) services for bulk cargo transportation. We utilize dedicated rakes and coordinated logistics to ensure the efficient movement of your cargo via rail.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', null, null, false, 3,
       'Full Train Load (FTL) Rail Services | Arrowline Logistics',
       'Dedicated full train load services for bulk cargo transportation from Arrowline Logistics.',
       '["["Dedicated Rakes","Utilization of dedicated rail rakes for exclusive cargo movement."]","["Bulk Cargo Handling","Specialized handling of minerals, grains, steel, and manufactured goods."]","["Real-time Tracking","GPS and rail-based tracking for monitoring cargo movement."]","["Scheduled Departures","Fixed schedules for recurring bulk cargo shipments."]"]'::jsonb,
       '["Direct seaport-to-dry-port connectivity","Reduced transit times","Exclusive cargo movement","Flexible dispatch schedules"]'::jsonb
from public.services s where s.slug = 'rail-multimodal-logistics';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'multimodal-rail-transportation', 'Multimodal Rail Transportation', 'Integrated rail, road, and coastal transportation solutions for optimized logistics.',
       'Arrowline Logistics provides integrated multimodal transportation solutions combining rail, road, and coastal networks. We optimize the movement of your cargo by selecting the most efficient mode of transport for each leg of the journey.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', null, null, false, 4,
       'Multimodal Rail Transportation Services | Arrowline Logistics',
       'Integrated rail, road, and coastal transportation solutions for optimized logistics from Arrowline Logistics.',
       '["["Rail Transport","Transportation of cargo via rail networks."]","["Road Transport","Transportation of cargo via road networks."]","["Coastal Shipping","Transportation of cargo via coastal shipping routes."]","["Integrated Tracking","End-to-end tracking across multiple modes of transport."]"]'::jsonb,
       '["Mode optimization","Cost reduction","Reduced carbon emissions","Flexible routing options"]'::jsonb
from public.services s where s.slug = 'rail-multimodal-logistics';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'intermodal-rail-freight', 'Intermodal Rail Freight', 'Seamless intermodal freight transportation combining rail with road and coastal segments.',
       'Arrowline Logistics provides intermodal rail freight transportation services that seamlessly combine rail transport with road and coastal segments for efficient cargo movement.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', null, null, false, 5,
       'Intermodal Rail Freight Services | Arrowline Logistics',
       'Seamless intermodal freight transportation combining rail with road and coastal segments from Arrowline Logistics.',
       '["["Rail Segment","Transportation of cargo via rail networks."]","["Road Segment","Transportation of cargo via road networks."]","["Coastal Segment","Transportation of cargo via coastal shipping routes."]"]'::jsonb,
       '["Seamless transfers","Reduced handling","Optimized routing","Real-time tracking"]'::jsonb
from public.services s where s.slug = 'rail-multimodal-logistics';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'bulk-industrial-cargo', 'Bulk & Industrial Cargo Transportation', 'Specialized transportation for bulk industrial cargo such as minerals, grains, and chemicals.',
       'Arrowline Logistics provides specialized transportation services for bulk industrial cargo such as minerals, grains, steel, and chemicals. We utilize appropriate rail wagons and equipment to ensure the safe and secure movement of your cargo.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', null, null, false, 6,
       'Bulk & Industrial Cargo Transportation Services | Arrowline Logistics',
       'Specialized transportation for bulk industrial cargo such as minerals, grains, steel, and chemicals from Arrowline Logistics.',
       '["["Bulk Cargo Handling","Specialized handling of minerals, grains, steel, and chemicals."]","["Appropriate Wagons","Selection of suitable rail wagons for specific cargo types."]","["Secure Loading","Professional loading with proper lashing and safety measures."]","["Real-time Tracking","GPS and rail-based tracking for monitoring cargo movement."]"]'::jsonb,
       '["Specialized bulk cargo handling","Appropriate rail equipment","Secure loading and transit","Real-time tracking and updates"]'::jsonb
from public.services s where s.slug = 'rail-multimodal-logistics';

-- Insert sub-services for Project Cargo Transportation
insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'heavy-odc-cargo', 'Heavy & ODC Cargo Transportation', 'Specialized transportation for heavy machinery and oversized cargo requiring special permits and route planning.',
       'Arrowline Logistics provides specialized transportation services for heavy machinery and oversized cargo. We conduct route feasibility surveys, obtain necessary permits, and utilize specialized equipment to ensure the safe and secure movement of your cargo.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg', null, null, false, 1,
       'Heavy & ODC Cargo Transportation Services | Arrowline Logistics',
       'Specialized transportation for heavy machinery and oversized cargo requiring special permits and route planning from Arrowline Logistics.',
       '["["Route Assessment","Detailed route analysis for dimensional and weight compliance."]","["Permit Acquisition","Assistance with obtaining necessary state and central permits."]","["Specialized Equipment","Utilization of lowbed trailers, multi-axle configurations, and specialized lifting equipment."]","["Loading & Securing","Professional loading with proper lashing and safety measures."]"]'::jsonb,
       '["Experienced route planning","Permit coordination expertise","Specialized trailer fleet","Safe delivery with specialized loading expertise"]'::jsonb
from public.services s where s.slug = 'project-cargo-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'breakbulk-cargo', 'Breakbulk Cargo Transportation', 'Specialized transportation for breakbulk cargo such as steel coils, pipes, and manufactured goods.',
       'Arrowline Logistics provides specialized transportation services for breakbulk cargo such as steel coils, pipes, plates, and manufactured goods. We coordinate the movement of your cargo via road, rail, and coastal networks as appropriate.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg', null, null, false, 2,
       'Breakbulk Cargo Transportation Services | Arrowline Logistics',
       'Specialized transportation for breakbulk cargo such as steel coils, pipes, plates, and manufactured goods from Arrowline Logistics.',
       '["["Breakbulk Handling","Specialized handling of steel coils, pipes, plates, and manufactured goods."]","["Mode Selection","Selection of appropriate transport mode (road, rail, coastal) based on cargo requirements."]","["Secure Loading","Professional loading with proper lashing and safety measures."]","["Real-time Tracking","GPS and rail-based tracking for monitoring cargo movement."]"]'::jsonb,
       '["Specialized breakbulk handling","Multi-modal transportation options","Secure loading and transit","Real-time tracking and updates"]'::jsonb
from public.services s where s.slug = 'project-cargo-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'industrial-machinery', 'Industrial Machinery Transportation', 'Specialized transportation for industrial machinery, turbines, and heavy equipment.',
       'Arrowline Logistics provides specialized transportation services for industrial machinery, turbines, and heavy equipment. We utilize specialized trailers and equipment to ensure the safe and secure movement of your valuable machinery.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg', null, null, false, 3,
       'Industrial Machinery Transportation Services | Arrowline Logistics',
       'Specialized transportation for industrial machinery, turbines, and heavy equipment from Arrowline Logistics.',
       '["["Machinery Handling","Specialized handling of industrial machinery, turbines, and heavy equipment."]","["Trailer Selection","Selection of appropriate trailers based on cargo dimensions and weight."]","["Route Planning","Detailed route analysis for dimensional and weight compliance."]","["Loading & Securing","Professional loading with proper lashing and safety measures."]"]'::jsonb,
       '["Specialized machinery handling","Appropriate trailer fleet","Route planning expertise","Safe delivery with specialized loading expertise"]'::jsonb
from public.services s where s.slug = 'project-cargo-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'multi-axle-special-trailer', 'Multi-Axle & Special Trailer Transportation', 'Specialized transportation using multi-axle trailers and special configurations for oversized cargo.',
       'Arrowline Logistics provides specialized transportation services using multi-axle trailers and special configurations. We utilize lowbed trailers, multi-axle configurations, and specialized equipment to ensure the safe and secure movement of your oversized cargo.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg', null, null, false, 4,
       'Multi-Axle & Special Trailer Transportation Services | Arrowline Logistics',
       'Specialized transportation using multi-axle trailers and special configurations for oversized cargo from Arrowline Logistics.',
       '["["Trailer Configuration","Selection and configuration of multi-axle trailers and special trailers."]","["Route Assessment","Detailed route analysis for dimensional and weight compliance."]","["Loading & Securing","Professional loading with proper lashing and safety measures."]","["Permits & Compliance","Assistance with obtaining necessary permits and ensuring regulatory compliance."]"]'::jsonb,
       '["Specialized trailer configurations","Experienced route planning","Permit coordination expertise","Safe delivery with specialized loading expertise"]'::jsonb
from public.services s where s.slug = 'project-cargo-transportation';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'end-to-end-project-logistics', 'End-to-End Project Logistics', 'Comprehensive project logistics management from conception to completion.',
       'Arrowline Logistics provides end-to-end project logistics management services. We handle everything from route planning and carrier selection to customs clearance and final delivery at the project site.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377041/arrowline/general/project-cargo.jpg', null, null, false, 5,
       'End-to-End Project Logistics Services | Arrowline Logistics',
       'Comprehensive project logistics management from conception to completion from Arrowline Logistics.',
       '["["Route Planning","Comprehensive route analysis and optimization."]","["Carrier Selection","Selection and coordination of appropriate carriers for each leg of the journey."]","["Customs Clearance","Professional customs clearance and documentation support."]","["Site Coordination","On-site coordination and management at the project location."]"]'::jsonb,
       '["Comprehensive planning","Carrier network expertise","Customs coordination proficiency","Site management and supervision"]'::jsonb
from public.services s where s.slug = 'project-cargo-transportation';

-- Insert sub-services for Warehousing & Storage
insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'general-industrial-warehousing', 'General & Industrial Warehousing', 'Secure storage for industrial goods, raw materials, and finished products.',
       'Arrowline Logistics provides secure warehousing and storage services for industrial goods, raw materials, and finished products. Our warehouses are equipped with advanced inventory management systems, climate control options, and security systems.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg', null, null, false, 1,
       'General & Industrial Warehousing Services | Arrowline Logistics',
       'Secure storage for industrial goods, raw materials, and finished products from Arrowline Logistics.',
       '["["Secure Storage","Protected storage with advanced security systems."]","["Climate Control","Temperature and humidity control options for sensitive goods."]","["Inventory Management","Real-time inventory tracking and stock optimization."]","["24/7 Surveillance","Round-the-clock surveillance and monitoring."]"]'::jsonb,
       '["Secure storage facilities","Climate control options","Advanced inventory management","24/7 surveillance and security"]'::jsonb
from public.services s where s.slug = 'warehousing-storage';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'distribution-fulfillment', 'Distribution & Fulfillment', 'Order processing, picking, packing, and shipping services for e-commerce and retail businesses.',
       'Arrowline Logistics provides distribution and fulfillment services designed to move your products efficiently from warehouse to customer. We handle order processing, inventory management, picking, packing, and shipping to ensure timely delivery.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg', null, null, false, 2,
       'Distribution & Fulfillment Services | Arrowline Logistics',
       'Order processing, picking, packing, and shipping services for e-commerce and retail businesses from Arrowline Logistics.',
       '["["Order Processing","Efficient order processing and inventory management."]","["Picking & Packing","Professional picking and packing services for accurate order fulfillment."]","["Shipping & Delivery","Reliable shipping and timely delivery to customers."]","["Returns Management","Efficient returns processing and restocking services."]"]'::jsonb,
       '["Efficient order processing","Professional picking and packing","Reliable shipping and delivery","Efficient returns management"]'::jsonb
from public.services s where s.slug = 'warehousing-storage';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'inventory-management', 'Inventory Management', 'Real-time inventory tracking, stock optimization, and warehouse organization.',
       'Arrowline Logistics provides inventory management services designed to optimize your storage operations. We utilize advanced inventory management systems to provide real-time tracking, stock optimization, and warehouse organization.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg', null, null, false, 3,
       'Inventory Management Services | Arrowline Logistics',
       'Real-time inventory tracking, stock optimization, and warehouse organization from Arrowline Logistics.',
       '["["Real-time Tracking","Live inventory tracking with barcode and RFID technology."]","["Stock Optimization","Algorithms for optimal stock levels and warehouse organization."]","["Warehouse Organization","Professional warehouse layout and organization services."]","["Audit & Reporting","Regular inventory audits and detailed reporting services."]"]'::jsonb,
       '["Real-time inventory tracking","Stock optimization algorithms","Professional warehouse organization","Regular audits and reporting"]'::jsonb
from public.services s where s.slug = 'warehousing-storage';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'container-storage-handling', 'Container Storage & Handling', 'Specialized handling and storage of shipping containers with proper documentation and security.',
       'Arrowline Logistics provides specialized container storage and handling services. We offer secure container yards, proper documentation handling, and specialized equipment for container movement.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg', null, null, false, 4,
       'Container Storage & Handling Services | Arrowline Logistics',
       'Specialized handling and storage of shipping containers with proper documentation and security from Arrowline Logistics.',
       '["["Secure Container Yard","Fenced and secure container storage area with surveillance."]","["Documentation Handling","Proper handling of shipping documents, bills of lading, and customs paperwork."]","["Specialized Equipment","Utilization of cranes, forklifts, and specialized handling equipment."]","["24/7 Surveillance","Round-the-clock surveillance and monitoring of container yard."]"]'::jsonb,
       '["Secure container storage","Documentation handling expertise","Specialized handling equipment","24/7 surveillance and monitoring"]'::jsonb
from public.services s where s.slug = 'warehousing-storage';

insert into public.service_items (service_id, slug, title, short_description, full_description, hero_image, hero_video, hero_fallback_image, is_published, display_order, meta_title, meta_description, capabilities, benefits)
select s.id, 'loading-unloading', 'Loading & Unloading', 'Professional loading and unloading services for trucks, containers, and railcars.',
       'Arrowline Logistics provides professional loading and unloading services for trucks, containers, and railcars. We utilize skilled labor and specialized equipment to ensure the safe and efficient movement of your cargo.',
       'https://res.cloudinary.com/uorctww6/image/upload/v1789377044/arrowline/general/project-warehouse.jpg', null, null, false, 5,
       'Loading & Unloading Services | Arrowline Logistics',
       'Professional loading and unloading services for trucks, containers, and railcars from Arrowline Logistics.',
       '["["Truck Loading","Professional loading services for trucks with proper lashing and securing."]","["Container Loading","Professional loading services for containers with proper lashing and securing."]","["Railcar Loading","Professional loading services for railcars with proper lashing and securing."]","["Safety Compliance","Adherence to safety standards and regulations."]"]'::jsonb,
       '["Skilled labor force","Specialized handling equipment","Safety compliance expertise","Efficient loading and unloading operations"]'::jsonb
from public.services s where s.slug = 'warehousing-storage';

-- Insert industry associations for services (example: Road Transportation serves Manufacturing, FMCG, etc.)
-- We'll associate the existing industries from the industries table (assuming they were inserted via 20260827_admin_industries.sql)
-- Since we don't know the exact industry IDs, we'll skip this for now and let the admin handle it via the CMS.
-- In a real scenario, we would look up the industry IDs by slug or title and insert them here.

-- Insert FAQs for services (example: Road Transportation FAQs)
-- We'll insert a few sample FAQs for each service to demonstrate the structure.
-- For brevity, we'll insert only one FAQ per service in this migration; the admin can add more.

-- Road Transportation FAQ
insert into public.service_faqs (service_id, question, answer, is_published, display_order)
select s.id, 'What is road transportation?', 'Road transportation involves the movement of goods via trucks and trailers across road networks. Arrowline Logistics provides reliable road transportation solutions across India, including Full Truck Load (FTL) and Part Truck Load (PTL) services.', true, 1
from public.services s where s.slug = 'road-transportation';

-- Rail Transportation FAQ
insert into public.service_faqs (service_id, question, answer, is_published, display_order)
select s.id, 'What is rail freight transportation?', 'Rail freight transportation involves the movement of goods via rail networks. Arrowline Logistics provides rail freight transportation services for bulk cargo such as minerals, grains, steel, and manufactured goods.', true, 1
from public.services s where s.slug = 'rail-multimodal-logistics';

-- Project Cargo Transportation FAQ
insert into public.service_faqs (service_id, question, answer, is_published, display_order)
select s.id, 'What is project cargo transportation?', 'Project cargo transportation involves the movement of large, complex, or high-value equipment and machinery for projects such as power plants, infrastructure, and industrial facilities.', true, 1
from public.services s where s.slug = 'project-cargo-transportation';

-- Warehousing & Storage FAQ
insert into public.service_faqs (service_id, question, answer, is_published, display_order)
select s.id, 'What is warehousing and storage?', 'Warehousing and storage involves the secure storage of goods in warehouses or storage facilities. Arrowline Logistics provides strategic warehousing and storage solutions for industrial goods, containers, and cargo across India.', true, 1
from public.services s where s.slug = 'warehousing-storage';

-- Insert process steps for services (example: Road Transportation process)
-- We'll insert the process steps for each service.
-- Road Transportation process
insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, image, is_published, display_order)
select s.id, '01', 'Requirement', 'Cargo Analysis & Consultation', 'We analyze your material dimensions, weight, origin, destination, timeline requirements, and commercial considerations.', 'FileSearch', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377036/arrowline/general/business-handshake.jpg', true, 1
from public.services s where s.slug = 'road-transportation';

insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, image, is_published, display_order)
select s.id, '02', 'Planning', 'Multimodal Route Optimization', 'Our logistics planners design the optimal multimodal route combining road, rail, or coastal shipping for best cost & speed.', 'Route', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377038/arrowline/general/hero-logistics.jpg', true, 2
from public.services s where s.slug = 'road-transportation';

insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, image, is_published, display_order)
select s.id, '03', 'Pickup', 'Safe Loading & Inspection', 'GPS-enabled fleet arrives for on-schedule cargo pickup with certified heavy lashing, seal verification, and digital manifest.', 'PackageCheck', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377072/arrowline/general/truck-fleet-yard.jpg', true, 3
from public.services s where s.slug = 'road-transportation';

insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, image, is_published, display_order)
select s.id, '04', 'Transportation', 'Dedicated Transit Execution', 'Your consignment moves smoothly across national expressways, freight rail corridors, or coastal shipping lines.', 'Truck', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377046/arrowline/general/road-transport.jpg', true, 4
from public.services s where s.slug = 'road-transportation';

insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, image, is_published, display_order)
select s.id, '05', 'Tracking', 'Real-Time 24/7 Visibility', 'Live GPS tracking and milestone updates keep your supply chain team informed of location, ETA, and progress.', 'Activity', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377045/arrowline/general/rail-multimodal.jpg', true, 5
from public.services s where s.slug = 'road-transportation';

insert into public.service_process_steps (service_id, step, title, subtitle, description, icon, image, is_published, display_order)
select s.id, '06', 'Delivery', 'On-Time Doorstep Handover', 'Safe final-mile unloading, electronic Proof of Delivery (e-POD) sign-off, and seamless consignment closure.', 'CheckCircle', 'https://res.cloudinary.com/uorctww6/image/upload/v1789377039/arrowline/general/hero-trucks-city.jpg', true, 6
from public.services s where s.slug = 'road-transportation';

-- We'll do the same for other services in a real scenario, but for brevity in this migration, we'll only do Road Transportation.
-- The admin can add process steps for other services via the CMS.