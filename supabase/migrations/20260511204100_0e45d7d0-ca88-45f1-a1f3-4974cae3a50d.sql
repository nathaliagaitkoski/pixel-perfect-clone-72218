create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  source text default 'lead_banner',
  created_at timestamptz not null default now()
);

create unique index leads_email_unique on public.leads (lower(email));

alter table public.leads enable row level security;

-- Permite que qualquer visitante anônimo insira um lead (captura de e-mail pública)
create policy "Anyone can submit a lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Ninguém lê via cliente; leitura só pelo service role (painel)
