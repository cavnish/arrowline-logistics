-- Testimonials CMS: add verified flag + seed the testimonials shown on the
-- public "What Our Clients Say" section so the admin CRUD fully controls them.
-- Idempotent: safe to re-run.

-- 1. Verified flag (public design shows a "Verified" badge per review).
alter table public.testimonials
  add column if not exists is_verified boolean not null default true;

-- 2. Seed the testimonials currently rendered by the public website.
--    Each row is only inserted if a matching record does not already exist
--    (matched on customer_name + company) so re-running is harmless.
insert into public.testimonials (
  customer_name, company, position, testimonial, photo, rating,
  is_published, is_verified, display_order, created_at, updated_at
)
select * from (values
  (
    'Rahul Sharma', 'Adani Exports', 'Operations Manager',
    'Great service by the Arrowline dispatch team. Excellent communication and professional handling of our FTL cargo throughout the entire Mundra to Delhi corridor. Would strongly recommend.',
    null, 5, true, true, 0, now(), now()
  ),
  (
    'Priya Iyer', 'Tata Chemicals', 'Supply Chain Director',
    'Recovered my cargo delivery timeline after a shipping delay — good communication over the phone, arrived at the time that was agreed. Highly recommend. The team was professional and responsive.',
    null, 5, true, true, 1, now(), now()
  ),
  (
    'Vikram Mehta', 'JSW Steel', 'Logistics Coordinator',
    'Exceptional service and reliability. The team went above and beyond to ensure our shipment was delivered on time despite challenging circumstances during monsoon season.',
    null, 5, true, true, 2, now(), now()
  ),
  (
    'Neha Patel', 'Renewable Energy Solutions', 'Procurement Manager',
    'Arrowline handled our transportation requirements professionally. Communication was clear and the delivery process was smooth from pickup to final destination.',
    null, 5, true, true, 3, now(), now()
  ),
  (
    'Amit Verma', 'Industrial Manufacturing Co.', 'Plant Operations Head',
    'Reliable logistics partner with excellent coordination. Their team understood our requirements quickly and executed the shipment exactly as planned.',
    null, 5, true, true, 4, now(), now()
  )
) as seed(customer_name, company, position, testimonial, photo, rating, is_published, is_verified, display_order, created_at, updated_at)
where not exists (
  select 1 from public.testimonials t
  where t.customer_name = seed.customer_name and t.company = seed.company
);

-- 3. Ensure the pre-existing database testimonial stays published and keeps a
--    sensible order after the new records.
update public.testimonials
set display_order = 5
where customer_name = 'Priya Sundaram' and company = 'Continental Ceramics & Minerals';