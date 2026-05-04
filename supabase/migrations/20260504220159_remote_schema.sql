drop extension if exists "pg_net";

create type "public"."campaign_status " as enum ('active', 'closed', 'upcoming');

create type "public"."collaborator_type " as enum ('sponsor', 'media_partner', 'partner');

create type "public"."source_type" as enum ('event_ticket', 'campaign', 'donation');

create type "public"."tag" as enum ('water', 'food', 'zakat', 'sadaqah', 'shelter', 'emergency', 'reconstruction', 'community', 'health', 'education', 'palestine', 'ramadan', 'livelihood', 'orphan', 'winter');


  create table "public"."campaigns" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "title" text not null,
    "description" text,
    "poster_url" text,
    "video_url" text,
    "goal_amount_cents" integer,
    "is_published" boolean default false,
    "created_at" timestamp with time zone default now(),
    "tags" public.tag not null,
    "status" public."campaign_status " not null,
    "amount_raised" integer default 0
      );


alter table "public"."campaigns" enable row level security;


  create table "public"."contact_messages" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "email" text not null,
    "phone" text,
    "message" text not null,
    "read" boolean not null default false,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."contact_messages" enable row level security;


  create table "public"."donations" (
    "id" uuid not null default gen_random_uuid(),
    "stripe_session_id" text,
    "stripe_payment_intent" text,
    "donor_name" text,
    "donor_email" text,
    "amount_cents" integer not null,
    "campaign_name" text,
    "note" text,
    "status" text not null default 'pending'::text,
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "campaign_id" uuid
      );


alter table "public"."donations" enable row level security;


  create table "public"."event_collaborators" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "name" text not null,
    "logo_url" text,
    "website_url" text,
    "notes" text,
    "sort_order" integer default 1,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."event_collaborators" enable row level security;


  create table "public"."event_ticket_types" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid not null,
    "name" text not null,
    "description" text,
    "price_cents" integer not null default 0,
    "max_quantity" integer default 1,
    "is_active" boolean not null default true,
    "sort_order" integer not null default 0,
    "created_at" timestamp with time zone not null default now(),
    "tickets_per_unit" integer default 1
      );


alter table "public"."event_ticket_types" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "slug" text not null,
    "title" text not null,
    "description" text,
    "event_date" timestamp with time zone not null,
    "doors_open" text,
    "venue" text,
    "address" text,
    "hosted_by" text,
    "image_url" text,
    "poster_url" text,
    "adult_price" integer not null default 1000,
    "kid_price" integer not null default 500,
    "is_published" boolean not null default false,
    "created_at" timestamp with time zone not null default now(),
    "collaboration_note" text
      );


alter table "public"."events" enable row level security;


  create table "public"."funds" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid,
    "donation_id" uuid,
    "amount_cents" numeric not null,
    "note" text,
    "created_at" timestamp with time zone not null default now(),
    "campaign_id" uuid,
    "type" public.source_type not null
      );


alter table "public"."funds" enable row level security;


  create table "public"."order_items" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "ticket_type_id" uuid not null,
    "quantity" integer not null default 1,
    "unit_price_cents" integer not null default 0,
    "total_cents" integer not null default 0,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."order_items" enable row level security;


  create table "public"."orders" (
    "id" uuid not null default gen_random_uuid(),
    "stripe_session_id" text,
    "stripe_payment_intent" text,
    "adult_qty" integer not null default 0,
    "kid_qty" integer not null,
    "total_cents" numeric,
    "customer_email" text,
    "status" text not null default 'pending'::text,
    "paid_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default now(),
    "event_id" uuid,
    "ticket_email_sent" boolean not null default false,
    "additional_notes" text,
    "special_requests" text,
    "customer_name" text,
    "customer_phone" text,
    "kids_ages" smallint[]
      );


alter table "public"."orders" enable row level security;


  create table "public"."sponsors" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid,
    "name" text not null,
    "logo_url" text,
    "sort_order" integer default 0,
    "created_at" timestamp with time zone not null default now(),
    "type" public."collaborator_type " not null default 'sponsor'::public."collaborator_type "
      );


alter table "public"."sponsors" enable row level security;


  create table "public"."tickets" (
    "id" uuid not null default gen_random_uuid(),
    "order_id" uuid not null,
    "event_id" uuid not null,
    "ticket_code" text not null,
    "ticket_type" text not null,
    "status" text not null default 'valid'::text,
    "created_at" timestamp with time zone default now(),
    "ticket_type_id" uuid not null
      );


alter table "public"."tickets" enable row level security;

CREATE UNIQUE INDEX campaigns_pkey ON public.campaigns USING btree (id);

CREATE UNIQUE INDEX campaigns_slug_key ON public.campaigns USING btree (slug);

CREATE UNIQUE INDEX contact_messages_pkey ON public.contact_messages USING btree (id);

CREATE UNIQUE INDEX donations_pkey ON public.donations USING btree (id);

CREATE UNIQUE INDEX donations_stripe_session_id_key ON public.donations USING btree (stripe_session_id);

CREATE UNIQUE INDEX event_collaborators_pkey ON public.event_collaborators USING btree (id);

CREATE UNIQUE INDEX event_ticket_types_pkey ON public.event_ticket_types USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX events_slug_key ON public.events USING btree (slug);

CREATE UNIQUE INDEX funds_pkey ON public.funds USING btree (id);

CREATE INDEX idx_tickets_ticket_type_id ON public.tickets USING btree (ticket_type_id);

CREATE UNIQUE INDEX order_items_pkey ON public.order_items USING btree (id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX orders_stripe_session_id_key ON public.orders USING btree (stripe_session_id);

CREATE UNIQUE INDEX sponsors_pkey ON public.sponsors USING btree (id);

CREATE UNIQUE INDEX tickets_pkey ON public.tickets USING btree (id);

CREATE UNIQUE INDEX tickets_ticket_code_key ON public.tickets USING btree (ticket_code);

alter table "public"."campaigns" add constraint "campaigns_pkey" PRIMARY KEY using index "campaigns_pkey";

alter table "public"."contact_messages" add constraint "contact_messages_pkey" PRIMARY KEY using index "contact_messages_pkey";

alter table "public"."donations" add constraint "donations_pkey" PRIMARY KEY using index "donations_pkey";

alter table "public"."event_collaborators" add constraint "event_collaborators_pkey" PRIMARY KEY using index "event_collaborators_pkey";

alter table "public"."event_ticket_types" add constraint "event_ticket_types_pkey" PRIMARY KEY using index "event_ticket_types_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."funds" add constraint "funds_pkey" PRIMARY KEY using index "funds_pkey";

alter table "public"."order_items" add constraint "order_items_pkey" PRIMARY KEY using index "order_items_pkey";

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."sponsors" add constraint "sponsors_pkey" PRIMARY KEY using index "sponsors_pkey";

alter table "public"."tickets" add constraint "tickets_pkey" PRIMARY KEY using index "tickets_pkey";

alter table "public"."campaigns" add constraint "campaigns_slug_key" UNIQUE using index "campaigns_slug_key";

alter table "public"."donations" add constraint "donations_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL not valid;

alter table "public"."donations" validate constraint "donations_campaign_id_fkey";

alter table "public"."donations" add constraint "donations_stripe_session_id_key" UNIQUE using index "donations_stripe_session_id_key";

alter table "public"."event_collaborators" add constraint "event_collaborators_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_collaborators" validate constraint "event_collaborators_event_id_fkey";

alter table "public"."event_ticket_types" add constraint "event_ticket_types_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_ticket_types" validate constraint "event_ticket_types_event_id_fkey";

alter table "public"."events" add constraint "events_slug_key" UNIQUE using index "events_slug_key";

alter table "public"."funds" add constraint "funds_campaign_id_fkey" FOREIGN KEY (campaign_id) REFERENCES public.campaigns(id) ON DELETE SET NULL not valid;

alter table "public"."funds" validate constraint "funds_campaign_id_fkey";

alter table "public"."funds" add constraint "funds_donation_id_fkey" FOREIGN KEY (donation_id) REFERENCES public.donations(id) ON DELETE SET NULL not valid;

alter table "public"."funds" validate constraint "funds_donation_id_fkey";

alter table "public"."funds" add constraint "funds_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL not valid;

alter table "public"."funds" validate constraint "funds_event_id_fkey";

alter table "public"."order_items" add constraint "order_items_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."order_items" validate constraint "order_items_order_id_fkey";

alter table "public"."order_items" add constraint "order_items_ticket_type_id_fkey" FOREIGN KEY (ticket_type_id) REFERENCES public.event_ticket_types(id) not valid;

alter table "public"."order_items" validate constraint "order_items_ticket_type_id_fkey";

alter table "public"."orders" add constraint "orders_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE RESTRICT not valid;

alter table "public"."orders" validate constraint "orders_event_id_fkey";

alter table "public"."orders" add constraint "orders_stripe_session_id_key" UNIQUE using index "orders_stripe_session_id_key";

alter table "public"."sponsors" add constraint "sponsors_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."sponsors" validate constraint "sponsors_event_id_fkey";

alter table "public"."tickets" add constraint "tickets_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "tickets_event_id_fkey";

alter table "public"."tickets" add constraint "tickets_order_id_fkey" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE not valid;

alter table "public"."tickets" validate constraint "tickets_order_id_fkey";

alter table "public"."tickets" add constraint "tickets_ticket_code_key" UNIQUE using index "tickets_ticket_code_key";

alter table "public"."tickets" add constraint "tickets_ticket_type_id_fkey" FOREIGN KEY (ticket_type_id) REFERENCES public.event_ticket_types(id) not valid;

alter table "public"."tickets" validate constraint "tickets_ticket_type_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_donation_fund()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$begin
  if NEW.status = 'paid' then
    insert into public.funds (
      source_type,
      donation_id,
      campaign_id,
      amount_cents,
      note
    ) values (
      case 
        when NEW.campaign_id is not null then 'campaign_donation'
        else 'donation'
      end,
      NEW.id,
      NEW.campaign_id,
      NEW.amount_cents,
      case 
        when NEW.campaign_id is not null then 'Campaign donation received'
        else 'Donation received'
      end
    );
  end if;

  return NEW;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_order_fund()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if NEW.status = 'paid' and OLD.status is distinct from 'paid' then
    insert into public.funds (
      type,
      event_id,
      amount_cents,
      note
    ) values (
      'event_ticket',
      NEW.event_id,
      NEW.total_cents,
      'Order payment'
    );
  end if;

  return NEW;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

create or replace view "public"."unpaid_customers" as  SELECT customer_email,
    customer_name
   FROM public.orders
  GROUP BY customer_email, customer_name
 HAVING ((sum(
        CASE
            WHEN (status = 'paid'::text) THEN 1
            ELSE 0
        END) = 0) AND (sum(
        CASE
            WHEN (status = 'pending'::text) THEN 1
            ELSE 0
        END) > 0));


grant delete on table "public"."campaigns" to "anon";

grant insert on table "public"."campaigns" to "anon";

grant references on table "public"."campaigns" to "anon";

grant select on table "public"."campaigns" to "anon";

grant trigger on table "public"."campaigns" to "anon";

grant truncate on table "public"."campaigns" to "anon";

grant update on table "public"."campaigns" to "anon";

grant delete on table "public"."campaigns" to "authenticated";

grant insert on table "public"."campaigns" to "authenticated";

grant references on table "public"."campaigns" to "authenticated";

grant select on table "public"."campaigns" to "authenticated";

grant trigger on table "public"."campaigns" to "authenticated";

grant truncate on table "public"."campaigns" to "authenticated";

grant update on table "public"."campaigns" to "authenticated";

grant delete on table "public"."campaigns" to "service_role";

grant insert on table "public"."campaigns" to "service_role";

grant references on table "public"."campaigns" to "service_role";

grant select on table "public"."campaigns" to "service_role";

grant trigger on table "public"."campaigns" to "service_role";

grant truncate on table "public"."campaigns" to "service_role";

grant update on table "public"."campaigns" to "service_role";

grant delete on table "public"."contact_messages" to "anon";

grant insert on table "public"."contact_messages" to "anon";

grant references on table "public"."contact_messages" to "anon";

grant select on table "public"."contact_messages" to "anon";

grant trigger on table "public"."contact_messages" to "anon";

grant truncate on table "public"."contact_messages" to "anon";

grant update on table "public"."contact_messages" to "anon";

grant delete on table "public"."contact_messages" to "authenticated";

grant insert on table "public"."contact_messages" to "authenticated";

grant references on table "public"."contact_messages" to "authenticated";

grant select on table "public"."contact_messages" to "authenticated";

grant trigger on table "public"."contact_messages" to "authenticated";

grant truncate on table "public"."contact_messages" to "authenticated";

grant update on table "public"."contact_messages" to "authenticated";

grant delete on table "public"."contact_messages" to "service_role";

grant insert on table "public"."contact_messages" to "service_role";

grant references on table "public"."contact_messages" to "service_role";

grant select on table "public"."contact_messages" to "service_role";

grant trigger on table "public"."contact_messages" to "service_role";

grant truncate on table "public"."contact_messages" to "service_role";

grant update on table "public"."contact_messages" to "service_role";

grant delete on table "public"."donations" to "anon";

grant insert on table "public"."donations" to "anon";

grant references on table "public"."donations" to "anon";

grant select on table "public"."donations" to "anon";

grant trigger on table "public"."donations" to "anon";

grant truncate on table "public"."donations" to "anon";

grant update on table "public"."donations" to "anon";

grant delete on table "public"."donations" to "authenticated";

grant insert on table "public"."donations" to "authenticated";

grant references on table "public"."donations" to "authenticated";

grant select on table "public"."donations" to "authenticated";

grant trigger on table "public"."donations" to "authenticated";

grant truncate on table "public"."donations" to "authenticated";

grant update on table "public"."donations" to "authenticated";

grant delete on table "public"."donations" to "service_role";

grant insert on table "public"."donations" to "service_role";

grant references on table "public"."donations" to "service_role";

grant select on table "public"."donations" to "service_role";

grant trigger on table "public"."donations" to "service_role";

grant truncate on table "public"."donations" to "service_role";

grant update on table "public"."donations" to "service_role";

grant delete on table "public"."event_collaborators" to "anon";

grant insert on table "public"."event_collaborators" to "anon";

grant references on table "public"."event_collaborators" to "anon";

grant select on table "public"."event_collaborators" to "anon";

grant trigger on table "public"."event_collaborators" to "anon";

grant truncate on table "public"."event_collaborators" to "anon";

grant update on table "public"."event_collaborators" to "anon";

grant delete on table "public"."event_collaborators" to "authenticated";

grant insert on table "public"."event_collaborators" to "authenticated";

grant references on table "public"."event_collaborators" to "authenticated";

grant select on table "public"."event_collaborators" to "authenticated";

grant trigger on table "public"."event_collaborators" to "authenticated";

grant truncate on table "public"."event_collaborators" to "authenticated";

grant update on table "public"."event_collaborators" to "authenticated";

grant delete on table "public"."event_collaborators" to "service_role";

grant insert on table "public"."event_collaborators" to "service_role";

grant references on table "public"."event_collaborators" to "service_role";

grant select on table "public"."event_collaborators" to "service_role";

grant trigger on table "public"."event_collaborators" to "service_role";

grant truncate on table "public"."event_collaborators" to "service_role";

grant update on table "public"."event_collaborators" to "service_role";

grant delete on table "public"."event_ticket_types" to "anon";

grant insert on table "public"."event_ticket_types" to "anon";

grant references on table "public"."event_ticket_types" to "anon";

grant select on table "public"."event_ticket_types" to "anon";

grant trigger on table "public"."event_ticket_types" to "anon";

grant truncate on table "public"."event_ticket_types" to "anon";

grant update on table "public"."event_ticket_types" to "anon";

grant delete on table "public"."event_ticket_types" to "authenticated";

grant insert on table "public"."event_ticket_types" to "authenticated";

grant references on table "public"."event_ticket_types" to "authenticated";

grant select on table "public"."event_ticket_types" to "authenticated";

grant trigger on table "public"."event_ticket_types" to "authenticated";

grant truncate on table "public"."event_ticket_types" to "authenticated";

grant update on table "public"."event_ticket_types" to "authenticated";

grant delete on table "public"."event_ticket_types" to "service_role";

grant insert on table "public"."event_ticket_types" to "service_role";

grant references on table "public"."event_ticket_types" to "service_role";

grant select on table "public"."event_ticket_types" to "service_role";

grant trigger on table "public"."event_ticket_types" to "service_role";

grant truncate on table "public"."event_ticket_types" to "service_role";

grant update on table "public"."event_ticket_types" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."funds" to "anon";

grant insert on table "public"."funds" to "anon";

grant references on table "public"."funds" to "anon";

grant select on table "public"."funds" to "anon";

grant trigger on table "public"."funds" to "anon";

grant truncate on table "public"."funds" to "anon";

grant update on table "public"."funds" to "anon";

grant delete on table "public"."funds" to "authenticated";

grant insert on table "public"."funds" to "authenticated";

grant references on table "public"."funds" to "authenticated";

grant select on table "public"."funds" to "authenticated";

grant trigger on table "public"."funds" to "authenticated";

grant truncate on table "public"."funds" to "authenticated";

grant update on table "public"."funds" to "authenticated";

grant delete on table "public"."funds" to "service_role";

grant insert on table "public"."funds" to "service_role";

grant references on table "public"."funds" to "service_role";

grant select on table "public"."funds" to "service_role";

grant trigger on table "public"."funds" to "service_role";

grant truncate on table "public"."funds" to "service_role";

grant update on table "public"."funds" to "service_role";

grant delete on table "public"."order_items" to "anon";

grant insert on table "public"."order_items" to "anon";

grant references on table "public"."order_items" to "anon";

grant select on table "public"."order_items" to "anon";

grant trigger on table "public"."order_items" to "anon";

grant truncate on table "public"."order_items" to "anon";

grant update on table "public"."order_items" to "anon";

grant delete on table "public"."order_items" to "authenticated";

grant insert on table "public"."order_items" to "authenticated";

grant references on table "public"."order_items" to "authenticated";

grant select on table "public"."order_items" to "authenticated";

grant trigger on table "public"."order_items" to "authenticated";

grant truncate on table "public"."order_items" to "authenticated";

grant update on table "public"."order_items" to "authenticated";

grant delete on table "public"."order_items" to "service_role";

grant insert on table "public"."order_items" to "service_role";

grant references on table "public"."order_items" to "service_role";

grant select on table "public"."order_items" to "service_role";

grant trigger on table "public"."order_items" to "service_role";

grant truncate on table "public"."order_items" to "service_role";

grant update on table "public"."order_items" to "service_role";

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."sponsors" to "anon";

grant insert on table "public"."sponsors" to "anon";

grant references on table "public"."sponsors" to "anon";

grant select on table "public"."sponsors" to "anon";

grant trigger on table "public"."sponsors" to "anon";

grant truncate on table "public"."sponsors" to "anon";

grant update on table "public"."sponsors" to "anon";

grant delete on table "public"."sponsors" to "authenticated";

grant insert on table "public"."sponsors" to "authenticated";

grant references on table "public"."sponsors" to "authenticated";

grant select on table "public"."sponsors" to "authenticated";

grant trigger on table "public"."sponsors" to "authenticated";

grant truncate on table "public"."sponsors" to "authenticated";

grant update on table "public"."sponsors" to "authenticated";

grant delete on table "public"."sponsors" to "service_role";

grant insert on table "public"."sponsors" to "service_role";

grant references on table "public"."sponsors" to "service_role";

grant select on table "public"."sponsors" to "service_role";

grant trigger on table "public"."sponsors" to "service_role";

grant truncate on table "public"."sponsors" to "service_role";

grant update on table "public"."sponsors" to "service_role";

grant delete on table "public"."tickets" to "anon";

grant insert on table "public"."tickets" to "anon";

grant references on table "public"."tickets" to "anon";

grant select on table "public"."tickets" to "anon";

grant trigger on table "public"."tickets" to "anon";

grant truncate on table "public"."tickets" to "anon";

grant update on table "public"."tickets" to "anon";

grant delete on table "public"."tickets" to "authenticated";

grant insert on table "public"."tickets" to "authenticated";

grant references on table "public"."tickets" to "authenticated";

grant select on table "public"."tickets" to "authenticated";

grant trigger on table "public"."tickets" to "authenticated";

grant truncate on table "public"."tickets" to "authenticated";

grant update on table "public"."tickets" to "authenticated";

grant delete on table "public"."tickets" to "service_role";

grant insert on table "public"."tickets" to "service_role";

grant references on table "public"."tickets" to "service_role";

grant select on table "public"."tickets" to "service_role";

grant trigger on table "public"."tickets" to "service_role";

grant truncate on table "public"."tickets" to "service_role";

grant update on table "public"."tickets" to "service_role";


  create policy "Public can read published campaigns"
  on "public"."campaigns"
  as permissive
  for select
  to anon
using ((is_published = true));



  create policy "Admin can read contact messages"
  on "public"."contact_messages"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



  create policy "Anyone can submit a contact message"
  on "public"."contact_messages"
  as permissive
  for insert
  to public
with check (true);



  create policy "Users can see their own donations"
  on "public"."donations"
  as permissive
  for select
  to public
using ((donor_email = (auth.jwt() ->> 'email'::text)));



  create policy "Public read collaborators"
  on "public"."event_collaborators"
  as permissive
  for select
  to public
using (true);



  create policy "Allow public read access on event_ticket_types"
  on "public"."event_ticket_types"
  as permissive
  for select
  to public
using (true);



  create policy "Public read published events"
  on "public"."events"
  as permissive
  for select
  to public
using ((is_published = true));



  create policy "Users can see their own orders"
  on "public"."orders"
  as permissive
  for select
  to public
using ((customer_email = (auth.jwt() ->> 'email'::text)));



  create policy "Public read sponsors"
  on "public"."sponsors"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER on_donation_paid_insert AFTER INSERT ON public.donations FOR EACH ROW EXECUTE FUNCTION public.handle_new_donation_fund();

CREATE TRIGGER on_order_paid AFTER UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_new_order_fund();


