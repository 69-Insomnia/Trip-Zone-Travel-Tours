-- Trip Zone Travel & Tours — content schema
--
-- Every table is public-readable through the anon (publishable) key so the site
-- can render from the database, and only `inquiries` accepts anonymous writes.
-- Editing a row in the Supabase table editor changes the live website.
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
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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
create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);

-- ------------------------------------------------------------------------ RLS
alter table public.site_settings enable row level security;
alter table public.tours enable row level security;
alter table public.tour_prices enable row level security;
alter table public.tour_itinerary enable row level security;
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
-- forced to their defaults so a visitor cannot mark their own lead as closed.
drop policy if exists "public submit inquiries" on public.inquiries;
create policy "public submit inquiries" on public.inquiries
  for insert to anon, authenticated with check (status = 'new' and source = 'website');

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
