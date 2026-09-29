create table if not exists public.assessments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  respondent_name text,
  company text,
  email text,
  answers jsonb not null,
  scores jsonb not null,
  overall_score numeric(4,2) not null
);

alter table public.assessments enable row level security;

create policy "anonymous users can submit assessments"
on public.assessments for insert
to anon
with check (jsonb_typeof(answers) = 'object' and jsonb_typeof(scores) = 'object');

revoke select, update, delete on public.assessments from anon;
grant insert on public.assessments to anon;