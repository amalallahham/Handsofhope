-- ─────────────────────────────────────────────────────────────────────────────
-- Hands of Hope — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- ── EVENTS ───────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  description   text,
  event_date    timestamptz not null,
  doors_open    text,
  venue         text,
  address       text,
  hosted_by     text,
  image_url     text,         -- Supabase Storage public URL
  poster_url    text,         -- Supabase Storage public URL
  adult_price   integer not null default 1000,  -- cents
  kid_price     integer not null default 500,   -- cents
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ── ORDERS ───────────────────────────────────────────────────────────────────
create table if not exists public.orders (
  id                    uuid primary key default gen_random_uuid(),
  stripe_session_id     text unique not null,
  stripe_payment_intent text,
  event_id              text not null,           -- matches events.slug or id
  adult_qty             integer not null default 0,
  kid_qty               integer not null default 0,
  total_cents           integer,
  customer_email        text,
  status                text not null default 'pending',
  -- status: pending | paid | expired | refunded
  paid_at               timestamptz,
  created_at            timestamptz not null default now()
);

-- ── SPONSORS ─────────────────────────────────────────────────────────────────
create table if not exists public.sponsors (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid references public.events(id) on delete cascade,
  name        text not null,
  logo_url    text,           -- Supabase Storage public URL
  type        text default 'sponsor',  -- sponsor | media_partner
  sort_order  integer default 0,
  created_at  timestamptz not null default now()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
-- Events: anyone can read published events
alter table public.events enable row level security;
create policy "Public read published events"
  on public.events for select
  using (is_published = true);

-- Orders: users can only see their own orders; service role bypasses RLS
alter table public.orders enable row level security;
create policy "Users can see their own orders"
  on public.orders for select
  using (customer_email = auth.jwt() ->> 'email');

-- Sponsors: public read
alter table public.sponsors enable row level security;
create policy "Public read sponsors"
  on public.sponsors for select using (true);

-- ── SAMPLE DATA ──────────────────────────────────────────────────────────────
insert into public.events (
  slug, title, description, event_date, doors_open,
  venue, address, hosted_by, is_published,
  adult_price, kid_price
) values (
  'eid-of-hope',
  'Eid of Hope',
  'A joyful Eid celebration featuring Palestinian cultural activities, traditional food, coffee, maamoul, and fun for the whole family.',
  '2025-06-29 15:00:00+00',
  '3:00 PM',
  'Muslim Association of Canada — MAC',
  '2122 Kingsway, Vancouver, BC V5N 2T5',
  'Muslim Association of Canada (MAC)',
  true,
  1000,
  500
) on conflict (slug) do nothing;



-- ─────────────────────────────────────────────────────────────────────────────
-- HANDS OF HOPE — EXTRA TABLES FOR FUND SOURCES + EVENT COLLABORATORS
-- ─────────────────────────────────────────────────────────────────────────────

-- ── DONATIONS ────────────────────────────────────────────────────────────────
create table if not exists public.donations (
  id                    uuid primary key default gen_random_uuid(),
  stripe_session_id     text unique,
  stripe_payment_intent text,
  donor_name            text,
  donor_email           text,
  amount_cents          integer not null,
  campaign_name         text,              -- optional: e.g. Gaza Fund, Water Well
  note                  text,
  status                text not null default 'pending',
  -- status: pending | paid | expired | refunded
  paid_at               timestamptz,
  created_at            timestamptz not null default now()
);

alter table public.donations enable row level security;

create policy "Users can see their own donations"
  on public.donations for select
  using (donor_email = auth.jwt() ->> 'email');


-- ── FUND TRANSACTIONS / INCOME LEDGER ───────────────────────────────────────
-- This gives you one place to track incoming money from either events or donations.
create table if not exists public.funds (
  id              uuid primary key default gen_random_uuid(),
  source_type     text not null check (source_type in ('event', 'donation')),
  event_id        uuid references public.events(id) on delete set null,
  donation_id     uuid references public.donations(id) on delete set null,
  amount_cents    integer not null,
  note            text,
  created_at      timestamptz not null default now(),

  -- Ensure one row points to exactly one source
  constraint funds_exactly_one_source check (
    (source_type = 'event' and event_id is not null and donation_id is null)
    or
    (source_type = 'donation' and donation_id is not null and event_id is null)
  )
);

alter table public.funds enable row level security;

-- Optional: public should not read funds directly unless you want that
-- Usually service role/admin only.


-- ── EVENT COLLABORATORS ──────────────────────────────────────────────────────
create table if not exists public.event_collaborators (
  id            uuid primary key default gen_random_uuid(),
  event_id       uuid not null references public.events(id) on delete cascade,
  name           text not null,
  collaborator_type text default 'partner',
  -- examples: partner | organization | sponsor | venue_partner | media_partner
  logo_url       text,
  website_url    text,
  contact_name   text,
  contact_email  text,
  notes          text,
  sort_order     integer default 0,
  created_at     timestamptz not null default now()
);

alter table public.event_collaborators enable row level security;

create policy "Public read collaborators"
  on public.event_collaborators for select
  using (true);


  alter table public.orders
drop column if exists event_id;

alter table public.orders
add column event_id uuid references public.events(id) on delete restrict;

alter table public.events
add column if not exists collaboration_note text;

create or replace function public.handle_new_donation_fund()
returns trigger
language plpgsql
as $$
begin
  if NEW.status = 'paid' then
    insert into public.funds (
      source_type,
      donation_id,
      amount_cents,
      note
    ) values (
      'donation',
      NEW.id,
      NEW.amount_cents,
      'Donation received'
    );
  end if;

  return NEW;
end;
$$;

create or replace function public.handle_new_order_fund()
returns trigger
language plpgsql
as $$
begin
  -- Only insert if order is paid (important!)
  if NEW.status = 'paid' then
    insert into public.funds (
      source_type,
      event_id,
      amount_cents,
      note
    ) values (
      'event',
      NEW.event_id,
      NEW.total_cents,
      'Order payment'
    );
  end if;

  return NEW;
end;
$$;


create trigger on_order_paid_insert
after insert on public.orders
for each row
execute function public.handle_new_order_fund();

create trigger on_donation_paid_insert
after insert on public.donations
for each row
execute function public.handle_new_donation_fund();