-- About page leadership copy update:
--   * Replace the leadership heading with "Meet our Leadership Team".
--   * Remove the obsolete leadership subtext row (no longer rendered).
-- Idempotent: safe to re-run.

insert into public.site_content (content_key, content_value, section, content_type, is_published, updated_at)
values ('about_leaders_heading', 'Meet our Leadership Team', 'About', 'text', true, now())
on conflict (content_key) do update
  set content_value = excluded.content_value,
      section = excluded.section,
      content_type = excluded.content_type,
      is_published = excluded.is_published,
      updated_at = now();

delete from public.site_content
where content_key = 'about_leaders_subtext';