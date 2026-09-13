-- Server-side admin session registry.
-- JWT cookies are short-lived and revocable through this table.
create table if not exists public.admin_sessions (
  jti text primary key,
  user_id uuid not null,
  email text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_user_id_idx
  on public.admin_sessions (user_id);
create index if not exists admin_sessions_expires_at_idx
  on public.admin_sessions (expires_at);

alter table public.admin_sessions enable row level security;

comment on table public.admin_sessions is
  'Revocable server-side sessions for admin JWT cookies; accessed only with the service role key.';
