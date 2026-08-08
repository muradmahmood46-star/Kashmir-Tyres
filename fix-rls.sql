-- Enable INSERT, UPDATE, and DELETE for catalog tables
-- Since this is a demo environment without a dedicated admin backend, 
-- we are allowing these operations for authenticated users.

-- Products
create policy "Allow all operations for authenticated users on products" 
on products for all to authenticated using (true) with check (true);

-- Categories
create policy "Allow all operations for authenticated users on categories" 
on categories for all to authenticated using (true) with check (true);

-- Brands
create policy "Allow all operations for authenticated users on brands" 
on brands for all to authenticated using (true) with check (true);

-- Bundles
create policy "Allow all operations for authenticated users on bundles" 
on bundles for all to authenticated using (true) with check (true);

-- Trusted Orgs
create policy "Allow all operations for authenticated users on trusted_orgs" 
on trusted_orgs for all to authenticated using (true) with check (true);

-- Hero Stats
create policy "Allow all operations for authenticated users on hero_stats" 
on hero_stats for all to authenticated using (true) with check (true);
