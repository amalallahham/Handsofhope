-- ─────────────────────────────────────────────────────────────────────────────
-- ADD TO supabase-schema.sql (or run separately)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── CONTACT MESSAGES ─────────────────────────────────────────────────────────
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text,
  message     text not null,
  read        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Only service role (admin) can read messages; anyone can insert
alter table public.contact_messages enable row level security;

create policy "Anyone can submit a contact message"
  on public.contact_messages for insert
  with check (true);



-- Only authenticated admin can READ
create policy "Admin can read contact messages"
  on public.contact_messages
  for select
  using (auth.role() = 'authenticated');