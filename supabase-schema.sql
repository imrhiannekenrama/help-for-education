-- ============================================================
-- Help for Education - Supabase Database Schema (Simplified)
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- ADMINS table (linked to Supabase Auth)
create table if not exists public.admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

-- PRODUCTS table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  long_description text,
  price numeric(10,2) not null default 0,
  image text,
  features text[] default '{}',
  bonuses text[] default '{}',
  file_size text,
  download_url text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- CODES table (single-use download codes)
create table if not exists public.codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  product_id uuid references public.products(id) on delete cascade,
  product_name text,
  status text not null default 'unused' check (status in ('unused', 'used')),
  used_by_email text,
  used_at timestamptz,
  used_ip text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.codes enable row level security;

-- Helper: is current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.admins where id = auth.uid()
  );
$$;

-- ADMINS: only admins can manage
create policy "Admins can read admins" on public.admins
  for select using (public.is_admin());
create policy "Admins can insert admins" on public.admins
  for insert with check (public.is_admin());

-- PRODUCTS: public can read active, admin can write
create policy "Public can read active products" on public.products
  for select using (is_active = true);
create policy "Admins can manage products" on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- CODES: public can check/use codes (via anon), admin can read all + create
create policy "Anyone can verify and use codes" on public.codes
  for update using (status = 'unused') with check (status = 'used');
create policy "Anyone can read codes" on public.codes
  for select using (true);
create policy "Admins can create codes" on public.codes
  for insert with check (public.is_admin());
create policy "Admins can delete codes" on public.codes
  for delete using (public.is_admin());

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at before update on public.products
  for each row execute function public.handle_updated_at();

-- ============================================================
-- INSERT A SAMPLE PRODUCT (optional — admin can edit later)
-- ============================================================
insert into public.products (name, slug, description, long_description, price, image, features, bonuses, file_size, download_url)
values (
  'Teacher Ultimate Bundle',
  'teacher-ultimate-bundle',
  'All-in-one DepEd compliant automated lesson planning, grading sheets, and classroom tools for Filipino Educators.',
  'Streamline your teaching tasks with over 500+ ready-to-use templates, automated grading tools, DepEd Form 137/138 automators, and interactive lesson presentation packs designed specifically for Philippine teachers.',
  99,
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
  ARRAY['100+ Lesson Plans (all subjects)', '200+ Printable Worksheets', '50+ Ready-made Presentations', 'DepEd Forms Automator', 'Lifetime Access & Updates'],
  ARRAY['150+ Bonus Materials & Templates', 'Free future updates', 'Priority email support'],
  '2.4 GB',
  'https://drive.google.com/file/d/YOUR_FILE_ID/view'
) on conflict (slug) do nothing;
