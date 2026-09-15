alter table public.blog_posts
  add column if not exists display_order integer not null default 0;

create index if not exists blog_posts_order_idx on public.blog_posts (is_published, display_order);