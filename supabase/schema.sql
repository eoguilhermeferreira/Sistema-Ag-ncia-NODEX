-- ================================================================
-- NODEX Dashboard — Supabase schema
-- Run this in the Supabase SQL Editor (once, on a fresh project)
-- ================================================================

-- Enable realtime for both tables
-- (done automatically in the dashboard under Database > Replication)

-- ── services ────────────────────────────────────────────────────
create table if not exists public.services (
  id          bigint       primary key,          -- Date.now() from the client
  empresa     text         not null,
  descricao   text         not null default '',
  value       numeric      not null default 0,
  status      text         not null default 'A fazer',
  date        text,                               -- stored as 'YYYY-MM-DD' string
  created_at  timestamptz  not null default now()
);

-- ── cash_entries ─────────────────────────────────────────────────
create table if not exists public.cash_entries (
  id          bigint       primary key,
  type        text         not null,              -- 'Entrada' | 'Saída'
  descricao   text         not null,
  value       numeric      not null default 0,
  date        text,
  created_at  timestamptz  not null default now()
);

-- ── Row Level Security ───────────────────────────────────────────
-- The app uses a single shared admin account, so we keep RLS off
-- and rely on the anon key being kept private (env vars / Vercel).
-- If you need per-user isolation in the future, enable RLS here.

alter table public.services    disable row level security;
alter table public.cash_entries disable row level security;

-- ── Realtime ─────────────────────────────────────────────────────
-- Grant the anon role select/insert/update/delete so realtime works
grant select, insert, update, delete on public.services     to anon;
grant select, insert, update, delete on public.cash_entries to anon;

-- Enable realtime publications (run if not already added in Dashboard)
-- alter publication supabase_realtime add table public.services;
-- alter publication supabase_realtime add table public.cash_entries;
