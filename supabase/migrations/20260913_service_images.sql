-- Service/Sub-service card image SEO & Cloudinary asset metadata.
-- Idempotent, additive-only. Existing data is left untouched.

alter table public.services add column if not exists image_alt text;
alter table public.services add column if not exists image_public_id text;

alter table public.service_items add column if not exists image_alt text;
alter table public.service_items add column if not exists image_public_id text;