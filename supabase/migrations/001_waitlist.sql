create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  company_name text,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table waitlist enable row level security;

-- Allow anonymous users to insert (sign up for waitlist)
create policy "Allow anonymous inserts"
  on waitlist
  for insert
  to anon
  with check (true);

-- Allow reads only from service role (used server-side for admin/email sending)
-- Service role bypasses RLS by default; this policy explicitly blocks all other roles from reading.
create policy "Deny reads from non-service roles"
  on waitlist
  for select
  using (false);
