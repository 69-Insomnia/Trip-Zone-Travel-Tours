-- Trip Zone Travel & Tours — content schema
--
-- Every table is public-readable through the anon (publishable) key so the site
-- can render from the database, and only `inquiries` accepts anonymous writes.
-- Editing a row in the Supabase table editor — or in /admin — changes the live
-- website.
--
-- Safe to run repeatedly.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- site settings
create table if not exists public.site_settings (
  id smallint primary key default 1 check (id = 1),
  name text not null,
  short_name text not null,
  tagline text not null,
  address text not null,
  phones text[] not null default '{}',
  socials jsonb not null default '[]'::jsonb,
  whatsapp_message text not null,
  updated_at timestamptz not null default now()
);

-- Wording of the "Places & mountain views" section on every tour page. The
-- defaults are the text the site shipped with, so the section reads correctly
-- from the moment this runs. Clearing the eyebrow, intro, small print or note
-- hides that line; the heading and the three labels fall back in code.
alter table public.site_settings
  add column if not exists views_eyebrow text not null
    default 'Places & mountain views',
  add column if not exists views_title text not null
    default 'See what you will experience',
  add column if not exists views_subtitle text not null
    default 'A visual route guide to the places, ridges and mountain horizons included in this package. Select any image for the full view details.',
  add column if not exists views_footnote text not null
    default 'Elevations are approximate reference values. Mountain visibility depends on season, weather and the exact viewpoint on the day.',
  add column if not exists views_elevation_label text not null
    default 'Viewpoint elevation',
  add column if not exists views_mountain_label text not null
    default 'Mountain / ridge',
  add column if not exists views_note_label text not null
    default 'Photo note',
  add column if not exists views_note_text text not null
    default 'View conditions vary by season and weather.';

-- Wording of the "view of the way" strip that draws a tour's route through every
-- stop in the itinerary. Same rules as above: clearing the eyebrow, intro or
-- small print hides that line, and the heading and labels fall back in code.
alter table public.site_settings
  add column if not exists way_eyebrow text not null
    default 'The way',
  add column if not exists way_title text not null
    default 'Follow the route, stop by stop',
  add column if not exists way_subtitle text not null
    default 'Every place the journey passes through, in the order you reach it, with how high the road and the trail climb.',
  add column if not exists way_footnote text not null
    default 'Stops follow the day-by-day itinerary. Road conditions, weather and the pace of the group decide how long each leg takes on the day.',
  add column if not exists way_day_label text not null
    default 'Day',
  add column if not exists way_high_point_label text not null
    default 'Highest point';

-- ----------------------------------------------------------------------- tours
create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text not null,
  duration text not null,
  nights integer not null default 0,
  days integer not null default 1,
  type text not null check (type in ('Pilgrimage', 'Mountain', 'Nature')),
  summary text not null,
  overview text not null default '',
  image text not null,
  highlights text[] not null default '{}',
  included text[] not null default '{}',
  excluded text[] not null default '{}',
  travel_notes text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tours
  add column if not exists travel_notes text[] not null default '{}';

create table if not exists public.tour_prices (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours (id) on delete cascade,
  transport text not null,
  price integer not null check (price >= 0),
  note text,
  sort_order integer not null default 0
);
create index if not exists tour_prices_tour_id_idx on public.tour_prices (tour_id);

create table if not exists public.tour_itinerary (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours (id) on delete cascade,
  day integer not null check (day >= 1),
  route text not null,
  unique (tour_id, day)
);
create index if not exists tour_itinerary_tour_id_idx on public.tour_itinerary (tour_id);

-- The photographs in the "Places & mountain views" section of a tour page: one
-- row per viewpoint. Replaced wholesale when the tour is saved, like the prices
-- and the itinerary, so there is no per-row published flag.
create table if not exists public.tour_views (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours (id) on delete cascade,
  title text not null,
  place text not null default '',
  elevation text not null default '',
  mountain_name text not null default '',
  mountain_elevation text not null default '',
  description text not null default '',
  image text not null,
  image_alt text not null default '',
  -- Overrides the shared photo note from site_settings for this viewpoint only.
  photo_note text not null default '',
  -- Photographer and licence for a photograph that came from Wikimedia Commons,
  -- and the page it came from. Required by CC BY-SA, which most of them are.
  credit text not null default '',
  credit_url text not null default '',
  sort_order integer not null default 0
);

alter table public.tour_views
  add column if not exists credit text not null default '',
  add column if not exists credit_url text not null default '';

-- `create table if not exists` does not repair constraints on a table that was
-- created earlier. PostgREST needs this foreign key to expose `tour_views` as an
-- embedded relationship on `tours`, so add it explicitly when it is missing.
do $$
begin
  if not exists (
    select 1
    from information_schema.table_constraints tc
    join information_schema.key_column_usage kcu
      on kcu.constraint_catalog = tc.constraint_catalog
     and kcu.constraint_schema = tc.constraint_schema
     and kcu.constraint_name = tc.constraint_name
    join information_schema.constraint_column_usage ccu
      on ccu.constraint_catalog = tc.constraint_catalog
     and ccu.constraint_schema = tc.constraint_schema
     and ccu.constraint_name = tc.constraint_name
    where tc.constraint_type = 'FOREIGN KEY'
      and tc.table_schema = 'public'
      and tc.table_name = 'tour_views'
      and kcu.column_name = 'tour_id'
      and ccu.table_schema = 'public'
      and ccu.table_name = 'tours'
      and ccu.column_name = 'id'
  ) then
    alter table public.tour_views
      add constraint tour_views_tour_id_fkey
      foreign key (tour_id) references public.tours (id) on delete cascade;
  end if;
end $$;

create index if not exists tour_views_tour_id_idx on public.tour_views (tour_id);

-- ---------------------------------------------------------------- destinations
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  image text not null,
  -- Tour this destination is featured in. Plain text so a destination can be
  -- added before its package exists.
  tour_slug text,
  sort_order integer not null default 0,
  published boolean not null default true
);

-- --------------------------------------------------------------------- photos
-- Registry of the photographs in public/photos, with their attribution.
create table if not exists public.photos (
  key text primary key,
  src text not null,
  alt text not null,
  position text,
  credit text
);

-- --------------------------------------------------------------------- videos
-- Films in public/. `tour_slugs` decides which package pages show a film;
-- an empty array means it is a general company film shown on the home page.
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  src text not null,
  poster_src text not null,
  poster_alt text not null default '',
  tour_slugs text[] not null default '{}',
  sort_order integer not null default 0,
  published boolean not null default true
);

-- -------------------------------------------------------------- gallery images
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  place text not null,
  category text not null,
  image text not null,
  -- Optional Tailwind span classes for the masonry layout.
  size_class text,
  sort_order integer not null default 0,
  published boolean not null default true
);

-- ---------------------------------------------------------------------- blogs
create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  category text not null,
  location text not null,
  image text not null,
  published_at date not null default current_date,
  read_time text not null default '5 min read',
  introduction text not null default '',
  -- [{ heading, paragraphs: [], bullets?: [] }]
  sections jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------- faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  published boolean not null default true
);

-- --------------------------------------------------------------- testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null default '',
  tour text not null default '',
  quote text not null,
  rating smallint check (rating between 1 and 5),
  sort_order integer not null default 0,
  published boolean not null default true
);

-- ------------------------------------------------------------------ inquiries
-- The only table anonymous visitors can write to, and nobody can read without
-- a privileged key.
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  phone text not null check (char_length(trim(phone)) between 7 and 20),
  email text check (email is null or char_length(email) <= 160),
  destination text,
  travel_date date,
  travelers integer check (travelers is null or travelers between 1 and 200),
  message text not null check (char_length(trim(message)) between 10 and 4000),
  tour_slug text,
  status text not null default 'new' check (status in ('new', 'contacted', 'booked', 'closed')),
  source text not null default 'website',
  created_at timestamptz not null default now()
);

-- Vehicle bookings use the same inbox as general contact inquiries, with
-- structured fields so the selected vehicle and quote can be reviewed without
-- parsing the free-text message.
alter table public.inquiries
  add column if not exists travel_time time,
  add column if not exists pickup_location text,
  add column if not exists vehicle_name text,
  add column if not exists vehicle_image text,
  add column if not exists fare_label text,
  add column if not exists quoted_price integer check (quoted_price is null or quoted_price >= 0);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- ------------------------------------------------------------------------ RLS
alter table public.site_settings enable row level security;
alter table public.tours enable row level security;
alter table public.tour_prices enable row level security;
alter table public.tour_itinerary enable row level security;
alter table public.tour_views enable row level security;
alter table public.destinations enable row level security;
alter table public.photos enable row level security;
alter table public.videos enable row level security;
alter table public.gallery_items enable row level security;
alter table public.blogs enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.inquiries enable row level security;

-- Public content: readable by anyone, writable only with a privileged key
-- (Supabase dashboard / service role), which bypasses RLS.
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "public read tours" on public.tours;
create policy "public read tours" on public.tours
  for select to anon, authenticated using (published);

drop policy if exists "public read tour_prices" on public.tour_prices;
create policy "public read tour_prices" on public.tour_prices
  for select to anon, authenticated using (
    exists (select 1 from public.tours t where t.id = tour_id and t.published)
  );

drop policy if exists "public read tour_itinerary" on public.tour_itinerary;
create policy "public read tour_itinerary" on public.tour_itinerary
  for select to anon, authenticated using (
    exists (select 1 from public.tours t where t.id = tour_id and t.published)
  );

drop policy if exists "public read tour_views" on public.tour_views;
create policy "public read tour_views" on public.tour_views
  for select to anon, authenticated using (
    exists (select 1 from public.tours t where t.id = tour_id and t.published)
  );

drop policy if exists "public read destinations" on public.destinations;
create policy "public read destinations" on public.destinations
  for select to anon, authenticated using (published);

drop policy if exists "public read photos" on public.photos;
create policy "public read photos" on public.photos
  for select to anon, authenticated using (true);

drop policy if exists "public read videos" on public.videos;
create policy "public read videos" on public.videos
  for select to anon, authenticated using (published);

drop policy if exists "public read gallery_items" on public.gallery_items;
create policy "public read gallery_items" on public.gallery_items
  for select to anon, authenticated using (published);

drop policy if exists "public read blogs" on public.blogs;
create policy "public read blogs" on public.blogs
  for select to anon, authenticated using (published);

drop policy if exists "public read faqs" on public.faqs;
create policy "public read faqs" on public.faqs
  for select to anon, authenticated using (published);

drop policy if exists "public read testimonials" on public.testimonials;
create policy "public read testimonials" on public.testimonials
  for select to anon, authenticated using (published);

-- Inquiries: anyone may submit, nobody may read back. `status` and `source` are
-- constrained so a visitor cannot mark their own lead as closed or invent an
-- administrative source.
drop policy if exists "public submit inquiries" on public.inquiries;
create policy "public submit inquiries" on public.inquiries
  for insert to anon, authenticated with check (
    status = 'new' and source in ('website', 'vehicle-booking')
  );

-- --------------------------------------------------------------- administrators
-- Who may edit the website from /admin.
--
-- Being a Supabase Auth user is not enough: an account only gains write access
-- once its id is listed here, so even if signups were left open a stranger who
-- registers can do no more than an anonymous visitor.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

-- security definer: the check must be able to read `admins` regardless of the
-- policies on it, otherwise every policy below would recurse into this table.
create or replace function public.is_admin() returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- An administrator can confirm their own membership; nobody can list the others.
drop policy if exists "admins read themselves" on public.admins;
create policy "admins read themselves" on public.admins
  for select to authenticated using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.admins to authenticated;

-- Administrators may read and write every content table. Row level security
-- policies are permissive, so these sit alongside the public read policies
-- above: visitors still see published rows only, administrators see and edit
-- everything including drafts.
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'site_settings', 'tours', 'tour_prices', 'tour_itinerary', 'tour_views',
    'destinations', 'photos', 'videos', 'gallery_items', 'blogs', 'faqs',
    'testimonials'
  ] loop
    execute format('drop policy if exists "admins manage %1$s" on public.%1$I', tbl);
    execute format(
      'create policy "admins manage %1$s" on public.%1$I for all to authenticated
         using (public.is_admin()) with check (public.is_admin())', tbl);
    execute format('grant select on public.%1$I to anon, authenticated', tbl);
    execute format('grant insert, update, delete on public.%1$I to authenticated', tbl);
  end loop;
end $$;

-- Inquiries stay unreadable to visitors; administrators get the inbox and may
-- move a lead through its statuses or delete it.
drop policy if exists "admins manage inquiries" on public.inquiries;
create policy "admins manage inquiries" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

grant insert on public.inquiries to anon;
grant select, insert, update, delete on public.inquiries to authenticated;

-- --------------------------------------------------------------- media uploads
-- Files an administrator picks on their own computer in /admin — films and
-- photographs — are uploaded into this bucket rather than committed to `public/`
-- and redeployed. The content tables keep the public URL of the stored object,
-- so swapping a film needs no developer.
--
-- Reading is public: everything in the bucket is already shown on the website.
-- Writing needs an account listed in `admins`, exactly like the tables above.
-- Keep `file_size_limit` and `allowed_mime_types` in step with MEDIA_LIMITS in
-- src/lib/media-upload.ts, or a file will pass the browser check and be refused
-- by storage. Note that the Supabase plan also caps a single upload globally
-- (50 MB on the free plan), whichever is smaller.
--
-- `storage` belongs to Supabase's own role. A connection without rights over it
-- cannot create the bucket or its policies, so each half reports what it could
-- not do instead of failing the migration — the same statements can be pasted
-- into the SQL editor, or the bucket made by hand under Storage. `npm run
-- db:migrate` prints the state of the bucket when it finishes.
do $$
begin
  insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  values (
    'media', 'media', true, 536870912,
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif',
      'video/mp4', 'video/quicktime', 'video/webm'
    ]
  )
  on conflict (id) do update
    set public = true,
        file_size_limit = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;
exception
  when insufficient_privilege or undefined_table or undefined_object then
    raise warning
      'Could not create the "media" storage bucket (%). Create a public bucket named "media" under Storage in the Supabase dashboard.',
      sqlerrm;
end $$;

-- Separate from the bucket so that losing one does not undo the other.
do $$
begin
  drop policy if exists "public read media" on storage.objects;
  create policy "public read media" on storage.objects
    for select to anon, authenticated using (bucket_id = 'media');

  drop policy if exists "admins upload media" on storage.objects;
  create policy "admins upload media" on storage.objects
    for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

  drop policy if exists "admins replace media" on storage.objects;
  create policy "admins replace media" on storage.objects
    for update to authenticated
    using (bucket_id = 'media' and public.is_admin())
    with check (bucket_id = 'media' and public.is_admin());

  drop policy if exists "admins delete media" on storage.objects;
  create policy "admins delete media" on storage.objects
    for delete to authenticated using (bucket_id = 'media' and public.is_admin());
exception
  when insufficient_privilege or undefined_table or undefined_object then
    raise warning
      'Could not set the policies on the "media" bucket (%). Add them from the Supabase SQL editor with the statements in the media uploads block of scripts/db/schema.sql.',
      sqlerrm;
end $$;

-- ------------------------------------------------------- updated_at bookkeeping
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tours_touch_updated_at on public.tours;
create trigger tours_touch_updated_at before update on public.tours
  for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- Refresh embedded relationship metadata after tables or constraints change.
notify pgrst, 'reload schema';
