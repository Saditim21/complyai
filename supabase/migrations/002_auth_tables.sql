-- Organizations
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  employee_count integer,
  country text not null default 'NL',
  stripe_customer_id text,
  subscription_tier text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Users (linked to Supabase Auth)
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  organization_id uuid references organizations(id) on delete set null,
  email text not null,
  full_name text,
  role text not null default 'member',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table organizations enable row level security;
alter table users enable row level security;

-- Users can read their own organization
create policy "Users can view their organization"
  on organizations for select
  using (
    id in (select organization_id from users where id = auth.uid())
  );

-- Org owners and admins can update their organization
create policy "Owners can update their organization"
  on organizations for update
  using (
    id in (select organization_id from users where id = auth.uid() and role in ('owner', 'admin'))
  );

-- Users can view their own record
create policy "Users can view own record"
  on users for select
  using (id = auth.uid());

-- Users can view teammates in their organization
create policy "Users can view org teammates"
  on users for select
  using (
    organization_id in (select organization_id from users where id = auth.uid())
  );

-- Users can update their own record
create policy "Users can update own record"
  on users for update
  using (id = auth.uid());
