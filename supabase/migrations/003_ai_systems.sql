-- AI Systems table (core entity — each AI tool a company uses)
create table if not exists ai_systems (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade not null,
  name text not null,
  description text,
  vendor text,
  category text not null,

  -- AI Act Classification
  risk_level text,
  annex_iii_domain text,
  is_provider boolean not null default false,
  classification_rationale text,

  -- Compliance Status
  compliance_status text not null default 'not_started',
  compliance_score integer not null default 0,

  -- Metadata
  data_types_processed text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Compliance Requirements table (what needs to be done per AI system)
create table if not exists compliance_requirements (
  id uuid primary key default gen_random_uuid(),
  ai_system_id uuid references ai_systems(id) on delete cascade not null,
  article_reference text not null,
  requirement_type text not null,
  title text not null,
  description text not null,
  status text not null default 'pending',
  due_date date,
  completed_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes for performance
create index if not exists ai_systems_organization_id_idx on ai_systems(organization_id);
create index if not exists ai_systems_risk_level_idx on ai_systems(risk_level);
create index if not exists ai_systems_compliance_status_idx on ai_systems(compliance_status);
create index if not exists compliance_requirements_ai_system_id_idx on compliance_requirements(ai_system_id);
create index if not exists compliance_requirements_status_idx on compliance_requirements(status);

-- Enable RLS
alter table ai_systems enable row level security;
alter table compliance_requirements enable row level security;

-- Helper function to get current user's organization_id
create or replace function get_user_organization_id()
returns uuid
language sql
security definer
stable
as $$
  select organization_id from users where id = auth.uid()
$$;

-- AI Systems RLS Policies

-- Users can view AI systems belonging to their organization
create policy "Users can view org AI systems"
  on ai_systems for select
  using (organization_id = get_user_organization_id());

-- Users can insert AI systems for their organization
create policy "Users can insert org AI systems"
  on ai_systems for insert
  with check (organization_id = get_user_organization_id());

-- Users can update AI systems belonging to their organization
create policy "Users can update org AI systems"
  on ai_systems for update
  using (organization_id = get_user_organization_id());

-- Users can delete AI systems belonging to their organization
create policy "Users can delete org AI systems"
  on ai_systems for delete
  using (organization_id = get_user_organization_id());

-- Compliance Requirements RLS Policies

-- Users can view requirements for AI systems in their organization
create policy "Users can view org requirements"
  on compliance_requirements for select
  using (
    ai_system_id in (
      select id from ai_systems where organization_id = get_user_organization_id()
    )
  );

-- Users can insert requirements for AI systems in their organization
create policy "Users can insert org requirements"
  on compliance_requirements for insert
  with check (
    ai_system_id in (
      select id from ai_systems where organization_id = get_user_organization_id()
    )
  );

-- Users can update requirements for AI systems in their organization
create policy "Users can update org requirements"
  on compliance_requirements for update
  using (
    ai_system_id in (
      select id from ai_systems where organization_id = get_user_organization_id()
    )
  );

-- Users can delete requirements for AI systems in their organization
create policy "Users can delete org requirements"
  on compliance_requirements for delete
  using (
    ai_system_id in (
      select id from ai_systems where organization_id = get_user_organization_id()
    )
  );

-- Trigger to auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger ai_systems_updated_at
  before update on ai_systems
  for each row
  execute function update_updated_at_column();

create trigger compliance_requirements_updated_at
  before update on compliance_requirements
  for each row
  execute function update_updated_at_column();
