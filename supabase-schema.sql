-- Drop existing tables to ensure a clean slate
DROP TABLE IF EXISTS hero_stats CASCADE;
DROP TABLE IF EXISTS trusted_orgs CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS bundles CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS brands CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Profiles (Extends Auth Users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text default 'customer' check (role in ('super_admin', 'manager', 'viewer', 'customer')),
  first_name text,
  last_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- Categories
create table categories (
  id text primary key,
  name text not null,
  icon text,
  description text,
  image text
);
alter table categories enable row level security;
create policy "Categories are viewable by everyone." on categories for select using (true);

-- Brands
create table brands (
  id text primary key,
  name text not null,
  logo text,
  country text,
  verified boolean default false
);
alter table brands enable row level security;
create policy "Brands are viewable by everyone." on brands for select using (true);

-- Products
create table products (
  id serial primary key,
  name text not null,
  category_id text references categories(id),
  brand_id text references brands(id),
  price numeric not null,
  original_price numeric,
  rating numeric default 0,
  reviews integer default 0,
  badge text,
  img text not null,
  tag text,
  description text,
  features jsonb default '[]'::jsonb,
  specs jsonb default '{}'::jsonb,
  in_stock boolean default true,
  stock integer default 0,
  free_shipping boolean default false
);
alter table products enable row level security;
create policy "Products are viewable by everyone." on products for select using (true);

-- Bundles
create table bundles (
  id text primary key,
  name text not null,
  description text,
  product_ids integer[] default '{}'::integer[],
  original_total numeric,
  bundle_price numeric,
  discount_type text check (discount_type in ('flat', 'percent', 'upto')),
  discount_value numeric,
  badge text,
  hero_image text,
  active boolean default false,
  is_popular boolean default false,
  free_shipping boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table bundles enable row level security;
create policy "Bundles are viewable by everyone." on bundles for select using (true);

-- Addresses
create table addresses (
  id text primary key default gen_random_uuid()::text,
  user_id uuid references auth.users on delete cascade not null,
  label text,
  location_type text,
  first_name text,
  last_name text,
  company text,
  address text,
  city text,
  state text,
  zip text,
  country text,
  phone text,
  full_address text,
  is_default boolean default false
);
alter table addresses enable row level security;
create policy "Users can view own addresses." on addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses." on addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses." on addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses." on addresses for delete using (auth.uid() = user_id);

-- Wishlists
create table wishlists (
  user_id uuid references auth.users on delete cascade,
  product_id integer references products(id) on delete cascade,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, product_id)
);
alter table wishlists enable row level security;
create policy "Users can view own wishlists." on wishlists for select using (auth.uid() = user_id);
create policy "Users can insert own wishlists." on wishlists for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlists." on wishlists for delete using (auth.uid() = user_id);

-- Cart Items
create table cart_items (
  user_id uuid references auth.users on delete cascade,
  product_id integer references products(id) on delete cascade,
  quantity integer default 1,
  primary key (user_id, product_id)
);
alter table cart_items enable row level security;
create policy "Users can view own cart." on cart_items for select using (auth.uid() = user_id);
create policy "Users can insert own cart." on cart_items for insert with check (auth.uid() = user_id);
create policy "Users can update own cart." on cart_items for update using (auth.uid() = user_id);
create policy "Users can delete own cart." on cart_items for delete using (auth.uid() = user_id);

-- Trusted Orgs
create table trusted_orgs (
  id text primary key,
  name text not null,
  industry text
);
alter table trusted_orgs enable row level security;
create policy "Trusted Orgs are viewable by everyone." on trusted_orgs for select using (true);

-- Hero Stats
create table hero_stats (
  id text primary key,
  value text,
  label text
);
alter table hero_stats enable row level security;
create policy "Hero Stats are viewable by everyone." on hero_stats for select using (true);
